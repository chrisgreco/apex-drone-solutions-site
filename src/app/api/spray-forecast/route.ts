// src/app/api/spray-forecast/route.ts
//
// Unified spray-forecast endpoint. Fetches:
//   - NWS api.weather.gov for authoritative US point forecast + short forecast text
//   - Open-Meteo for hourly wind at 10m & 80m, temp at 2m & 80m (inversion detection),
//     precipitation history (past 24h) and future (next 7d).
//
// Output is normalized to the SprayForecast shape defined in @/lib/spray-decision.
// Response is cached 10 minutes per lat/lon — forecasts don't change that often,
// and this keeps us well under NWS rate limits even with a popular page.

import { NextResponse } from "next/server";
import type { HourlyForecast, SprayForecast } from "@/lib/spray-decision";

export const revalidate = 600; // 10 min

// ---------- NWS types (minimal subset we need) ----------
type NwsPointsResponse = {
  properties?: {
    forecast?: string;
    forecastHourly?: string;
    relativeLocation?: { properties?: { city?: string; state?: string } };
  };
};

type NwsHourlyPeriod = {
  startTime: string;
  temperature: number;
  temperatureUnit: string;
  windSpeed: string;
  windDirection: string;
  shortForecast: string;
  probabilityOfPrecipitation?: { value: number | null };
  relativeHumidity?: { value: number | null };
};

type NwsHourlyResponse = {
  properties?: { periods?: NwsHourlyPeriod[] };
};

// ---------- Open-Meteo types ----------
type OpenMeteoResponse = {
  hourly?: {
    time: string[];
    temperature_2m: (number | null)[];
    temperature_80m: (number | null)[];
    wind_speed_10m: (number | null)[];
    wind_speed_80m: (number | null)[];
    wind_gusts_10m: (number | null)[];
    wind_direction_10m: (number | null)[];
    precipitation: (number | null)[];
    precipitation_probability: (number | null)[];
    relative_humidity_2m: (number | null)[];
  };
  utc_offset_seconds?: number;
};

// ---------- Helpers ----------

function parseWindSpeedMph(s: string): number {
  // NWS format: "5 mph" or "5 to 10 mph" — take the high end for conservatism.
  const nums = s.match(/\d+/g);
  if (!nums) return 0;
  return Number(nums[nums.length - 1]);
}

function cToF(c: number): number {
  return c * 9 / 5 + 32;
}

function kmhToMph(k: number): number {
  return k * 0.621371;
}

function mmToIn(mm: number): number {
  return mm * 0.0393701;
}

// ---------- Fetchers ----------

async function fetchNws(
  lat: number,
  lon: number
): Promise<{
  locationName: string;
  hourlyByTime: Map<string, NwsHourlyPeriod>;
} | null> {
  try {
    const pointsRes = await fetch(
      `https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`,
      {
        headers: {
          Accept: "application/geo+json",
          "User-Agent": "AgDronesNJ/1.0 (https://agdronesnj.com)",
        },
        next: { revalidate: 3600 }, // point metadata rarely changes
      }
    );
    if (!pointsRes.ok) return null;
    const points = (await pointsRes.json()) as NwsPointsResponse;
    const hourlyUrl = points.properties?.forecastHourly;
    if (!hourlyUrl) return null;

    const city = points.properties?.relativeLocation?.properties?.city;
    const state = points.properties?.relativeLocation?.properties?.state;
    const locationName = city && state ? `${city}, ${state}` : "";

    const hourlyRes = await fetch(hourlyUrl, {
      headers: {
        Accept: "application/geo+json",
        "User-Agent": "AgDronesNJ/1.0 (https://agdronesnj.com)",
      },
      next: { revalidate: 600 },
    });
    if (!hourlyRes.ok) return null;
    const hourly = (await hourlyRes.json()) as NwsHourlyResponse;
    const periods = hourly.properties?.periods ?? [];

    // Key by ISO hour (trimmed to the hour) for easy join with Open-Meteo.
    const byTime = new Map<string, NwsHourlyPeriod>();
    for (const p of periods) {
      const hourKey = p.startTime.slice(0, 13); // "2026-04-13T22"
      byTime.set(hourKey, p);
    }
    return { locationName, hourlyByTime: byTime };
  } catch {
    return null;
  }
}

async function fetchOpenMeteo(
  lat: number,
  lon: number
): Promise<OpenMeteoResponse | null> {
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", lat.toFixed(4));
    url.searchParams.set("longitude", lon.toFixed(4));
    url.searchParams.set(
      "hourly",
      [
        "temperature_2m",
        "temperature_80m",
        "wind_speed_10m",
        "wind_speed_80m",
        "wind_gusts_10m",
        "wind_direction_10m",
        "precipitation",
        "precipitation_probability",
        "relative_humidity_2m",
      ].join(",")
    );
    url.searchParams.set("temperature_unit", "fahrenheit");
    url.searchParams.set("wind_speed_unit", "mph");
    url.searchParams.set("precipitation_unit", "inch");
    url.searchParams.set("timezone", "America/New_York");
    url.searchParams.set("past_days", "1"); // for rain-washoff lookback
    url.searchParams.set("forecast_days", "7");

    const res = await fetch(url.toString(), {
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as OpenMeteoResponse;
  } catch {
    return null;
  }
}

// ---------- Normalize ----------

function buildHourlyForecast(
  om: OpenMeteoResponse,
  nws: Awaited<ReturnType<typeof fetchNws>>
): HourlyForecast[] {
  const h = om.hourly;
  if (!h) return [];
  const out: HourlyForecast[] = [];
  const now = Date.now();

  for (let i = 0; i < h.time.length; i++) {
    const tIso = h.time[i]; // "2026-04-13T22:00" local NJ
    // Open-Meteo returns local time without offset; parse as NY time.
    const localMs = new Date(tIso).getTime();
    // Only include hours from ~1h in the past onward (past_days=1 gives us history we trim).
    if (localMs < now - 60 * 60 * 1000) continue;

    const hourKey = tIso.slice(0, 13);
    const nwsPeriod = nws?.hourlyByTime.get(hourKey);

    const shortForecast = nwsPeriod?.shortForecast ?? "";
    const lightning = /thunder|lightning/i.test(shortForecast);

    out.push({
      time: tIso,
      windMph: h.wind_speed_10m[i] ?? 0,
      gustMph: h.wind_gusts_10m[i] ?? h.wind_speed_10m[i] ?? 0,
      windMph80m: h.wind_speed_80m[i],
      windDirDeg: h.wind_direction_10m[i],
      tempF: h.temperature_2m[i] ?? 0,
      tempF80m: h.temperature_80m[i],
      humidity: h.relative_humidity_2m[i],
      popPct:
        h.precipitation_probability[i] ??
        nwsPeriod?.probabilityOfPrecipitation?.value ??
        0,
      precipIn: h.precipitation[i] ?? 0,
      lightning,
      shortForecast,
    });
  }
  return out.slice(0, 168); // hard cap at 7 days
}

function computePastRain(om: OpenMeteoResponse): SprayForecast["pastRain"] {
  const h = om.hourly;
  if (!h) {
    return {
      hoursSinceLastRain: null,
      lastRainAmountIn: null,
      hoursUntilNextRain: null,
    };
  }
  const now = Date.now();
  let hoursSinceLastRain: number | null = null;
  let lastRainAmountIn: number | null = null;
  let hoursUntilNextRain: number | null = null;

  for (let i = 0; i < h.time.length; i++) {
    const t = new Date(h.time[i]).getTime();
    const precip = h.precipitation[i] ?? 0;
    const hoursDelta = (t - now) / (1000 * 60 * 60);

    if (precip >= 0.01) {
      if (hoursDelta < 0) {
        // past rain — keep updating until we pass `now` so we land on the most recent
        hoursSinceLastRain = Math.abs(hoursDelta);
        lastRainAmountIn = precip;
      } else if (hoursUntilNextRain === null) {
        hoursUntilNextRain = hoursDelta;
      }
    }
  }
  return { hoursSinceLastRain, lastRainAmountIn, hoursUntilNextRain };
}

// ---------- Route ----------

export async function GET(req: Request) {
  const url = new URL(req.url);
  const latRaw = url.searchParams.get("lat");
  const lonRaw = url.searchParams.get("lon");
  const labelRaw = url.searchParams.get("label") ?? "";

  const lat = Number(latRaw);
  const lon = Number(lonRaw);
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    return NextResponse.json(
      { error: "Invalid lat/lon" },
      { status: 400 }
    );
  }

  const [om, nws] = await Promise.all([
    fetchOpenMeteo(lat, lon),
    fetchNws(lat, lon),
  ]);

  if (!om) {
    return NextResponse.json(
      { error: "Forecast data unavailable" },
      { status: 502 }
    );
  }

  const hourly = buildHourlyForecast(om, nws);
  const pastRain = computePastRain(om);

  const forecast: SprayForecast = {
    location: {
      lat,
      lon,
      label: labelRaw || nws?.locationName || `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
    },
    fetchedAt: new Date().toISOString(),
    hourly,
    pastRain,
  };

  return NextResponse.json(forecast, {
    headers: {
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800",
    },
  });
}
