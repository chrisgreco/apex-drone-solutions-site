/**
 * Pollination window forecast.
 *
 * Honeybees and bumblebees pollinate effectively when:
 *   - Air temp ≥ 55°F (bees become torpid below this)
 *   - Wind ≤ 15 mph (flight becomes erratic above)
 *   - Daylight (6 AM – 7 PM)
 *   - Not actively raining
 *
 * For each day we report the total good-hours, plus identify "best day"
 * for farmers choosing when to move hives or boost activity with attractants.
 */

import type { HourlyForecast } from "@/lib/spray-decision";

export type PollinationDay = {
  date: string; // YYYY-MM-DD
  goodHours: number;
  avgTempF: number;
  avgWindMph: number;
  rating: "excellent" | "good" | "fair" | "poor";
};

export type PollinationForecast = {
  days: PollinationDay[];
  bestDay: PollinationDay | null;
  totalGoodHours: number;
};

function isBeeFlightHour(h: HourlyForecast): boolean {
  const hour = Number(h.time.slice(11, 13));
  if (hour < 6 || hour >= 19) return false;
  if (h.tempF < 55) return false;
  if (h.windMph > 15) return false;
  if (h.precipIn > 0.01) return false;
  return true;
}

function ratingOf(goodHours: number): PollinationDay["rating"] {
  if (goodHours >= 9) return "excellent";
  if (goodHours >= 6) return "good";
  if (goodHours >= 3) return "fair";
  return "poor";
}

export function computePollinationForecast(
  hourly: HourlyForecast[]
): PollinationForecast {
  const byDay = new Map<string, HourlyForecast[]>();
  for (const h of hourly) {
    const d = h.time.slice(0, 10);
    if (!byDay.has(d)) byDay.set(d, []);
    byDay.get(d)!.push(h);
  }

  const days: PollinationDay[] = [];
  let totalGoodHours = 0;
  for (const [date, hours] of byDay) {
    const goodHours = hours.filter(isBeeFlightHour).length;
    const dayHours = hours.filter((h) => {
      const hr = Number(h.time.slice(11, 13));
      return hr >= 6 && hr < 19;
    });
    const avgTemp = dayHours.reduce((a, h) => a + h.tempF, 0) / Math.max(1, dayHours.length);
    const avgWind = dayHours.reduce((a, h) => a + h.windMph, 0) / Math.max(1, dayHours.length);
    totalGoodHours += goodHours;
    days.push({
      date,
      goodHours,
      avgTempF: avgTemp,
      avgWindMph: avgWind,
      rating: ratingOf(goodHours),
    });
  }

  const bestDay =
    days.reduce<PollinationDay | null>(
      (best, d) => (best == null || d.goodHours > best.goodHours ? d : best),
      null
    ) ?? null;

  return { days, bestDay, totalGoodHours };
}
