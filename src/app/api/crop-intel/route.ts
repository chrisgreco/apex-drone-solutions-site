// GET /api/crop-intel?lat=X&lon=Y&crop=blueberry&stage=pink_bud
//
// Unified farm-intelligence endpoint. Calls /api/spray-forecast internally,
// then runs all crop-aware models in parallel and returns a single payload
// the dashboard's tiles feed from with one fetch.
//
// Cached 10 min at the edge. Disease/harvest/pollination outputs shift slowly
// relative to the base forecast; they just re-derive from the same cached
// weather data.

import { NextResponse } from "next/server";
import type { SprayForecast } from "@/lib/spray-decision";
import { CROPS, type CropId, type CropStage } from "@/lib/farm-intel/crops";
import { predictDiseasesForCrop, type DiseasePrediction } from "@/lib/farm-intel/disease-models";
import {
  accumulateChill,
  fetchSeasonalTemps,
  predictBloomDate,
  type ChillAccumulation,
} from "@/lib/farm-intel/chill-hours";
import {
  computePollinationForecast,
  type PollinationForecast,
} from "@/lib/farm-intel/pollination";
import {
  fetchDailyTempsSinceBloom,
  predictHarvest,
  type HarvestPrediction,
} from "@/lib/farm-intel/harvest";

export const revalidate = 600;

export type CropIntelResponse = {
  location: { lat: number; lon: number; label: string };
  crop: CropId;
  stage: CropStage | null;
  fetchedAt: string;
  forecast: SprayForecast;
  diseases: DiseasePrediction[];
  chill: (ChillAccumulation & {
    chillRequired: number;
    variety: string;
    percentComplete: number;
    bloomPrediction: { daysOut: number | null; date: string | null; chillComplete: boolean };
  }) | null;
  pollination: PollinationForecast;
  harvest: HarvestPrediction;
};

async function fetchBaseForecast(baseUrl: string, lat: number, lon: number, label: string) {
  const url = new URL("/api/spray-forecast", baseUrl);
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("label", label);
  const res = await fetch(url.toString(), { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`spray-forecast ${res.status}`);
  return (await res.json()) as SprayForecast;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const lat = Number(url.searchParams.get("lat"));
  const lon = Number(url.searchParams.get("lon"));
  const cropParam = url.searchParams.get("crop") as CropId | null;
  const stageParam = url.searchParams.get("stage") as CropStage | null;
  const label = url.searchParams.get("label") ?? "";

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: "Invalid lat/lon" }, { status: 400 });
  }
  if (!cropParam || !(cropParam in CROPS)) {
    return NextResponse.json({ error: "Invalid crop" }, { status: 400 });
  }
  const crop = CROPS[cropParam];
  const stage: CropStage | null = stageParam ?? null;

  // Base forecast first (everything else derives from this or parallel archive calls)
  let forecast: SprayForecast;
  try {
    forecast = await fetchBaseForecast(url.origin, lat, lon, label);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Forecast unavailable" },
      { status: 502 }
    );
  }

  // Parallel archive fetches (chill + harvest), plus synchronous disease/pollination
  const primaryVariety = crop.varieties[0];
  const chillPromise =
    crop.gddBase <= 50 && primaryVariety
      ? fetchSeasonalTemps(lat, lon).then((series) => accumulateChill(series))
      : Promise.resolve(null);

  // For now we don't know the farmer's actual bloom date; leave bloomDateIso null
  // and predict "pre-bloom" unless the forecast already passes the typical range.
  const bloomPromise: Promise<Awaited<ReturnType<typeof fetchDailyTempsSinceBloom>>> = (async () => {
    const tbr = crop.typicalBloomRange;
    const year = new Date().getUTCFullYear();
    const typicalBloomStart = `${year}-${tbr.start}`;
    // Only pull daily archive if that bloom date is in the past
    if (new Date(typicalBloomStart).getTime() > Date.now()) return [];
    return fetchDailyTempsSinceBloom(lat, lon, typicalBloomStart);
  })();

  const [chillAcc, bloomDaily] = await Promise.all([chillPromise, bloomPromise]);

  // Assemble chill block
  let chill: CropIntelResponse["chill"] = null;
  if (chillAcc && primaryVariety) {
    const chillRequired = primaryVariety.chillHoursReq;
    const avgHigh =
      forecast.hourly.slice(0, 24).reduce((a, h) => Math.max(a, h.tempF), 0) ||
      60;
    const bloomPrediction = predictBloomDate({
      accumulatedHours: chillAcc.hours,
      chillRequired,
      avgHighF: avgHigh,
    });
    chill = {
      ...chillAcc,
      chillRequired,
      variety: primaryVariety.name,
      percentComplete: chillRequired > 0 ? Math.min(100, Math.round((chillAcc.hours / chillRequired) * 100)) : 100,
      bloomPrediction,
    };
  }

  // Diseases
  const diseases = predictDiseasesForCrop(cropParam, crop.diseases, forecast.hourly);

  // Pollination
  const pollination = computePollinationForecast(forecast.hourly);

  // Harvest — only meaningful if bloom date has passed AND we have daily temps
  const typicalBloomIso = `${new Date().getUTCFullYear()}-${crop.typicalBloomRange.start}`;
  const bloomHasOccurred = new Date(typicalBloomIso).getTime() <= Date.now();
  const harvest = predictHarvest({
    cropId: cropParam,
    bloomDateIso: bloomHasOccurred ? typicalBloomIso : null,
    dailyTemps: bloomDaily,
    varietyGddTarget: primaryVariety?.gddBloomToHarvest ?? crop.gddBloomToHarvest,
  });

  const body: CropIntelResponse = {
    location: { lat, lon, label: label || `${lat.toFixed(2)}, ${lon.toFixed(2)}` },
    crop: cropParam,
    stage,
    fetchedAt: new Date().toISOString(),
    forecast,
    diseases,
    chill,
    pollination,
    harvest,
  };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800",
    },
  });
}
