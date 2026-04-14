/**
 * Harvest ETA model.
 *
 * Takes a bloom date (user-provided or auto-detected from GDD threshold) and
 * accumulates growing degree days until the crop-variety's target GDD is met.
 *
 * For the dashboard we use the forecast hourly series to accumulate through
 * the next 7 days, then extrapolate based on the season's daily average GDD.
 */

import type { CropId } from "./crops";
import { CROPS } from "./crops";

export type HarvestPrediction = {
  crop: CropId;
  variety?: string;
  bloomDate: string | null;
  /** Total GDD accumulated bloom → now. */
  gddAccumulated: number;
  /** GDD target for this variety or crop default. */
  gddTarget: number;
  /** Estimated harvest date. Null if bloom unknown. */
  harvestDateIso: string | null;
  /** Uncertainty band in days (± either side). */
  plusMinusDays: number;
  /** Derived status for UI tile coloring. */
  status: "pre-bloom" | "early" | "mid" | "late" | "harvest" | "post";
};

/**
 * Single-base GDD accumulation using simple-average formula:
 *   GDD = max(0, (Tmax + Tmin)/2 - base)
 * Inputs are daily (one entry per day).
 */
export function dailyGdd(maxF: number, minF: number, baseF: number): number {
  return Math.max(0, (maxF + minF) / 2 - baseF);
}

/**
 * Fetch daily Tmax/Tmin from Open-Meteo archive to compute real GDD between a
 * bloom date and today.
 */
export async function fetchDailyTempsSinceBloom(
  lat: number,
  lon: number,
  bloomIso: string
): Promise<{ date: string; maxF: number; minF: number }[]> {
  const today = new Date().toISOString().slice(0, 10);
  const url = new URL("https://archive-api.open-meteo.com/v1/archive");
  url.searchParams.set("latitude", lat.toFixed(4));
  url.searchParams.set("longitude", lon.toFixed(4));
  url.searchParams.set("start_date", bloomIso);
  url.searchParams.set("end_date", today);
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min");
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("timezone", "America/New_York");

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      daily?: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
      };
    };
    const d = data.daily;
    if (!d?.time) return [];
    return d.time.map((t, i) => ({
      date: t,
      maxF: d.temperature_2m_max[i] ?? 0,
      minF: d.temperature_2m_min[i] ?? 0,
    }));
  } catch {
    return [];
  }
}

export function predictHarvest(opts: {
  cropId: CropId;
  bloomDateIso: string | null;
  dailyTemps: { date: string; maxF: number; minF: number }[];
  varietyGddTarget?: number;
}): HarvestPrediction {
  const crop = CROPS[opts.cropId];
  const target = opts.varietyGddTarget ?? crop.gddBloomToHarvest;

  if (!opts.bloomDateIso) {
    return {
      crop: opts.cropId,
      bloomDate: null,
      gddAccumulated: 0,
      gddTarget: target,
      harvestDateIso: null,
      plusMinusDays: 0,
      status: "pre-bloom",
    };
  }

  let gdd = 0;
  for (const d of opts.dailyTemps) {
    gdd += dailyGdd(d.maxF, d.minF, crop.gddBase);
  }

  const pct = target > 0 ? gdd / target : 0;
  let status: HarvestPrediction["status"] = "early";
  if (pct >= 1) status = "harvest";
  else if (pct >= 0.85) status = "late";
  else if (pct >= 0.5) status = "mid";

  // Project future: use last 14 days' avg daily GDD as the rate.
  const recent = opts.dailyTemps.slice(-14);
  const avgDaily =
    recent.length > 0
      ? recent.reduce((a, d) => a + dailyGdd(d.maxF, d.minF, crop.gddBase), 0) /
        recent.length
      : 8; // sensible fallback for NJ summer

  const remaining = Math.max(0, target - gdd);
  const daysAhead = remaining > 0 && avgDaily > 0 ? Math.round(remaining / avgDaily) : 0;
  const harvestDate = new Date();
  harvestDate.setDate(harvestDate.getDate() + daysAhead);

  return {
    crop: opts.cropId,
    bloomDate: opts.bloomDateIso,
    gddAccumulated: Math.round(gdd),
    gddTarget: target,
    harvestDateIso: remaining === 0 ? new Date().toISOString().slice(0, 10) : harvestDate.toISOString().slice(0, 10),
    plusMinusDays: Math.max(3, Math.round(daysAhead * 0.15)),
    status,
  };
}
