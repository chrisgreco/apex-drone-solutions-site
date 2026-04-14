/**
 * Spray decision engine — pure functions, no side effects.
 * Used by both the /api/spray-forecast server route and the /spray-today client.
 *
 * Thresholds follow FAA Part 137 guidance and ag drone best practices:
 *   - Sustained wind ≤ 10 mph (preferred), ≤ 15 mph (caution), > 15 mph (no-go)
 *   - Gusts ≤ 15 mph (preferred), ≤ 20 mph (caution), > 20 mph (no-go)
 *   - Temperature 50–90°F optimal, 45–95°F caution
 *   - No rain within 2h (ideal), caution if within 4h
 *   - Temperature inversion (T_80m > T_2m by > 0.5°F) → caution/no-go
 *   - Lightning in forecast → hard no-go
 */

export type Verdict = "GO" | "CAUTION" | "NO-GO";

export type Condition = {
  label: string;
  ok: boolean;
  caution?: boolean;
  detail: string;
};

/** Per-hour forecast point — unified shape combining NWS + Open-Meteo. */
export type HourlyForecast = {
  /** ISO timestamp for the start of this hour */
  time: string;
  /** Surface (10m) wind speed in mph */
  windMph: number;
  /** Wind gust speed in mph */
  gustMph: number;
  /** 80m wind speed in mph (drone upper-range altitude) */
  windMph80m: number | null;
  /** Wind direction in degrees (0 = N, 90 = E) */
  windDirDeg: number | null;
  /** 2m temperature in °F */
  tempF: number;
  /** 80m temperature in °F — used for inversion detection */
  tempF80m: number | null;
  /** Relative humidity 0–100 */
  humidity: number | null;
  /** Precipitation probability 0–100 */
  popPct: number;
  /** Precipitation amount (inches) this hour */
  precipIn: number;
  /** True when any thunder/lightning in the forecast text */
  lightning: boolean;
  /** NWS short forecast text, e.g. "Partly Sunny" */
  shortForecast: string;
};

export type SprayForecast = {
  location: {
    lat: number;
    lon: number;
    label: string;
  };
  /** Fetched at (ISO) — for "updated X min ago" display */
  fetchedAt: string;
  /** Next 168 hours (7 days). First entry ≈ current hour. */
  hourly: HourlyForecast[];
  /** Past 24h precip summary — for rainfast decisions */
  pastRain: {
    /** Hours since last measurable rain (≥ 0.01 in), null if no rain in past 7d */
    hoursSinceLastRain: number | null;
    /** Inches of last rain event */
    lastRainAmountIn: number | null;
    /** Hours until next forecast rain (≥ 0.01 in), null if none in next 7d */
    hoursUntilNextRain: number | null;
  };
};

/** Threshold constants — exported for UI display / tooltips. */
export const THRESHOLDS = {
  WIND_OK_MPH: 10,
  WIND_CAUTION_MPH: 15,
  GUST_OK_MPH: 15,
  GUST_CAUTION_MPH: 20,
  TEMP_MIN_F: 50,
  TEMP_MAX_F: 90,
  TEMP_CAUTION_MIN_F: 45,
  TEMP_CAUTION_MAX_F: 95,
  INVERSION_DELTA_F: 0.5, // T_80m - T_2m above this = inversion
  INVERSION_STRONG_DELTA_F: 2.0,
  POP_OK_PCT: 30,
  RAINFAST_HOURS: 6,
} as const;

/**
 * Evaluate a single hour against spray thresholds.
 * `nextHours` is used to detect imminent rain/storms within the next 2–4h.
 */
export function evaluateHour(
  hour: HourlyForecast,
  nextHours: HourlyForecast[]
): { verdict: Verdict; conditions: Condition[] } {
  const conditions: Condition[] = [];

  // --- Wind sustained (10m) ---
  if (hour.windMph <= THRESHOLDS.WIND_OK_MPH) {
    conditions.push({
      label: "Sustained wind",
      ok: true,
      detail: `${Math.round(hour.windMph)} mph · within 10 mph limit`,
    });
  } else if (hour.windMph <= THRESHOLDS.WIND_CAUTION_MPH) {
    conditions.push({
      label: "Sustained wind",
      ok: false,
      caution: true,
      detail: `${Math.round(hour.windMph)} mph · elevated, proceed with caution`,
    });
  } else {
    conditions.push({
      label: "Sustained wind",
      ok: false,
      detail: `${Math.round(hour.windMph)} mph · exceeds 15 mph limit`,
    });
  }

  // --- Wind gusts ---
  const gust = Math.max(
    hour.gustMph,
    ...nextHours.slice(0, 2).map((h) => h.gustMph)
  );
  if (gust <= THRESHOLDS.GUST_OK_MPH) {
    conditions.push({
      label: "Wind gusts",
      ok: true,
      detail: `${Math.round(gust)} mph · within 15 mph limit`,
    });
  } else if (gust <= THRESHOLDS.GUST_CAUTION_MPH) {
    conditions.push({
      label: "Wind gusts",
      ok: false,
      caution: true,
      detail: `${Math.round(gust)} mph · elevated gusts`,
    });
  } else {
    conditions.push({
      label: "Wind gusts",
      ok: false,
      detail: `${Math.round(gust)} mph · exceeds 20 mph limit`,
    });
  }

  // --- Precipitation ---
  const rainIn2h = nextHours
    .slice(0, 2)
    .some(
      (h) =>
        h.popPct >= 50 ||
        h.precipIn > 0.01 ||
        /rain|shower|storm|thunder/i.test(h.shortForecast)
    );
  const rainIn4h = nextHours
    .slice(0, 4)
    .some(
      (h) =>
        h.popPct >= 30 ||
        h.precipIn > 0.01 ||
        /rain|shower|storm|thunder/i.test(h.shortForecast)
    );
  if (!rainIn2h && !rainIn4h && hour.popPct < THRESHOLDS.POP_OK_PCT) {
    conditions.push({
      label: "Precipitation",
      ok: true,
      detail: `${hour.popPct}% chance · clear window`,
    });
  } else if (!rainIn2h && rainIn4h) {
    conditions.push({
      label: "Precipitation",
      ok: false,
      caution: true,
      detail: "Rain possible within 4 hours",
    });
  } else {
    conditions.push({
      label: "Precipitation",
      ok: false,
      detail: "Rain imminent or active",
    });
  }

  // --- Temperature (2m) ---
  if (hour.tempF >= THRESHOLDS.TEMP_MIN_F && hour.tempF <= THRESHOLDS.TEMP_MAX_F) {
    conditions.push({
      label: "Temperature",
      ok: true,
      detail: `${Math.round(hour.tempF)}°F · optimal 50–90°F`,
    });
  } else if (
    hour.tempF >= THRESHOLDS.TEMP_CAUTION_MIN_F &&
    hour.tempF <= THRESHOLDS.TEMP_CAUTION_MAX_F
  ) {
    conditions.push({
      label: "Temperature",
      ok: false,
      caution: true,
      detail: `${Math.round(hour.tempF)}°F · outside optimal, monitor drift`,
    });
  } else {
    conditions.push({
      label: "Temperature",
      ok: false,
      detail: `${Math.round(hour.tempF)}°F · unsafe for spray efficacy`,
    });
  }

  // --- Temperature inversion ---
  // Inversion = air warmer aloft than at surface → traps droplets → drift risk.
  if (hour.tempF80m != null) {
    const delta = hour.tempF80m - hour.tempF;
    if (delta > THRESHOLDS.INVERSION_STRONG_DELTA_F) {
      conditions.push({
        label: "Temperature inversion",
        ok: false,
        detail: `+${delta.toFixed(1)}°F aloft · strong inversion, high drift risk`,
      });
    } else if (delta > THRESHOLDS.INVERSION_DELTA_F) {
      conditions.push({
        label: "Temperature inversion",
        ok: false,
        caution: true,
        detail: `+${delta.toFixed(1)}°F aloft · mild inversion, droplets may drift`,
      });
    } else {
      conditions.push({
        label: "Temperature inversion",
        ok: true,
        detail: `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}°F aloft · no inversion`,
      });
    }
  }

  // --- Lightning (hard override) ---
  if (hour.lightning) {
    conditions.push({
      label: "Lightning / storms",
      ok: false,
      detail: "Thunderstorms in forecast — ground all flights",
    });
  }

  // --- Verdict ---
  const anyHard = conditions.some((c) => !c.ok && !c.caution);
  const anyCaution = conditions.some((c) => c.caution);
  let verdict: Verdict = "GO";
  if (anyHard) verdict = "NO-GO";
  else if (anyCaution) verdict = "CAUTION";

  return { verdict, conditions };
}

/**
 * Find the next contiguous block of GO hours of at least `minHours` duration.
 * Returns null if no such window exists in the provided forecast.
 */
export function findNextGoWindow(
  hourly: HourlyForecast[],
  minHours = 2
): { startIdx: number; endIdx: number; hours: number } | null {
  let runStart = -1;
  for (let i = 0; i < hourly.length; i++) {
    const nextHours = hourly.slice(i + 1, i + 5);
    const { verdict } = evaluateHour(hourly[i], nextHours);
    if (verdict === "GO") {
      if (runStart === -1) runStart = i;
    } else {
      if (runStart !== -1) {
        const len = i - runStart;
        if (len >= minHours) {
          return { startIdx: runStart, endIdx: i - 1, hours: len };
        }
        runStart = -1;
      }
    }
  }
  // Trailing run
  if (runStart !== -1) {
    const len = hourly.length - runStart;
    if (len >= minHours) {
      return { startIdx: runStart, endIdx: hourly.length - 1, hours: len };
    }
  }
  return null;
}

/** Per-hour verdicts for every hour in the forecast — used for the timeline UI. */
export function computeHourlyVerdicts(
  hourly: HourlyForecast[]
): Verdict[] {
  return hourly.map((h, i) => {
    const { verdict } = evaluateHour(h, hourly.slice(i + 1, i + 5));
    return verdict;
  });
}
