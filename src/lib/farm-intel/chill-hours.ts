/**
 * Chill hours + chill portions.
 *
 * Utah model: one "chill unit" per hour at 32–45°F (0–7°C). Hours above 65°F
 * subtract from the running total (negation effect). The Utah model is the
 * NJ-standard metric cited in Rutgers Cooperative Extension fruit variety guides.
 *
 * Because we only have a 7-day forecast from Open-Meteo but chill accumulates
 * from Oct 1, we fetch the archive API (also free) for the past hours. This
 * gives the grower a running count for the current dormancy season.
 */

export type ChillAccumulation = {
  hours: number;
  /** Optional chill portions using the Dynamic/Fishman model. Simplified here. */
  portions: number;
  /** Running totals by month, for sparkline UI later. */
  monthlyHours: { month: string; hours: number }[];
  /** Start of the accumulation window (always Oct 1 of the dormant season). */
  startIso: string;
  /** End of the accumulation window (now). */
  endIso: string;
};

/**
 * Utah chill unit table: °F -> contribution per hour.
 * Hours above 65°F are *negative* to model chilling reversal in warm spells.
 */
function utahChillUnit(tempF: number): number {
  if (tempF < 34) return 0;
  if (tempF >= 34 && tempF < 36) return 0.5;
  if (tempF >= 36 && tempF <= 48) return 1.0;
  if (tempF > 48 && tempF <= 54) return 0.5;
  if (tempF > 54 && tempF <= 60) return 0;
  if (tempF > 60 && tempF <= 65) return -0.5;
  return -1.0;
}

/** Simplified Dynamic Model (Fishman): cheaper than full 3-state logic. */
function dynamicPortionPerHour(tempF: number): number {
  const c = (tempF - 32) * (5 / 9);
  if (c < -2 || c > 13) return 0;
  // peak ~6°C
  const delta = Math.abs(c - 6);
  const portion = Math.max(0, (1 - delta / 7) * 0.0833); // 12 good hours = 1 portion
  return portion;
}

/**
 * Accumulate chill hours from a series of hourly temperatures.
 * `series` must be sorted oldest → newest and only cover Oct 1 onward.
 */
export function accumulateChill(
  series: { time: string; tempF: number }[]
): ChillAccumulation {
  if (series.length === 0) {
    return {
      hours: 0,
      portions: 0,
      monthlyHours: [],
      startIso: new Date().toISOString(),
      endIso: new Date().toISOString(),
    };
  }
  let hours = 0;
  let portions = 0;
  const byMonth = new Map<string, number>();
  for (const h of series) {
    const delta = utahChillUnit(h.tempF);
    hours += delta;
    portions += dynamicPortionPerHour(h.tempF);
    const monthKey = h.time.slice(0, 7);
    byMonth.set(monthKey, (byMonth.get(monthKey) ?? 0) + delta);
  }
  const monthlyHours = Array.from(byMonth.entries()).map(([month, h]) => ({
    month,
    hours: h,
  }));
  return {
    hours: Math.max(0, Math.round(hours)),
    portions: Math.max(0, Math.round(portions * 10) / 10),
    monthlyHours,
    startIso: series[0].time,
    endIso: series[series.length - 1].time,
  };
}

/**
 * Fetch hourly 2m temperature from Open-Meteo archive (free, no key) + forecast
 * combined, from Oct 1 of the most recent dormant season through now.
 *
 * If "now" is between Oct 1 and Dec 31, uses current year; otherwise uses prior.
 */
export async function fetchSeasonalTemps(
  lat: number,
  lon: number
): Promise<{ time: string; tempF: number }[]> {
  const now = new Date();
  const yearNow = now.getUTCFullYear();
  const dormantStartYear = now.getUTCMonth() >= 9 ? yearNow : yearNow - 1;
  const startDate = `${dormantStartYear}-10-01`;
  const endDate = now.toISOString().slice(0, 10);

  const url = new URL("https://archive-api.open-meteo.com/v1/archive");
  url.searchParams.set("latitude", lat.toFixed(4));
  url.searchParams.set("longitude", lon.toFixed(4));
  url.searchParams.set("start_date", startDate);
  url.searchParams.set("end_date", endDate);
  url.searchParams.set("hourly", "temperature_2m");
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("timezone", "America/New_York");

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = (await res.json()) as {
    hourly?: { time: string[]; temperature_2m: number[] };
  };
  const h = data.hourly;
  if (!h?.time || !h.temperature_2m) return [];
  return h.time.map((t, i) => ({ time: t, tempF: h.temperature_2m[i] ?? 0 }));
}

/**
 * Bloom-date prediction: simple heuristic.
 * After variety's chill requirement is met, bloom occurs ≈ 350 GDD (base 50°F)
 * later. For a 7-day forecast we only know the start of that countdown, so we
 * either return:
 *   - "chill not complete" → null
 *   - "chill complete N days ago" → bloom ETA based on avg historical GDD
 */
export function predictBloomDate(opts: {
  accumulatedHours: number;
  chillRequired: number;
  /** Forecast avg daily max temp °F for heat accumulation. */
  avgHighF?: number;
}): { daysOut: number | null; date: string | null; chillComplete: boolean } {
  if (opts.accumulatedHours < opts.chillRequired) {
    return { daysOut: null, date: null, chillComplete: false };
  }
  // Post-chill, ~350 GDD base 50 to bloom. Back-of-envelope:
  // avg daily GDD ≈ (avgHighF - 50) / 2. Avoid div-by-zero.
  const dailyGdd = Math.max(1, ((opts.avgHighF ?? 60) - 50) / 2);
  const days = Math.round(350 / dailyGdd);
  const date = new Date();
  date.setDate(date.getDate() + days);
  return { daysOut: days, date: date.toISOString().slice(0, 10), chillComplete: true };
}
