/**
 * Compute the 0–3 urgent action cards shown on the dashboard's top banner.
 *
 * Priority order (highest first):
 *   1. Frost / freeze within 24h below the crop's stage kill threshold
 *   2. Rainfast window closing (recent rain + next spray)
 *   3. Spray window opening today/tomorrow (≥2h)
 *
 * Later phases will add: disease infection event within 72h, chill complete,
 * bloom start, pollination window.
 */

import type { SprayForecast } from "@/lib/spray-decision";
import { findNextGoWindow } from "@/lib/spray-decision";
import type { ActionCard } from "@/components/dashboard/ActionBanner";
import {
  CROPS,
  frostThresholdFor,
  type CropId,
  type CropStage,
} from "./crops";

export type BannerInputs = {
  forecast: SprayForecast;
  cropId: CropId | null;
  cropStage: CropStage | null;
};

function formatLocalDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    hour: "numeric",
    timeZone: "America/New_York",
  });
}

function formatLocalTimeRange(startIso: string, endIso: string): string {
  return `${formatLocalDateTime(startIso)} – ${new Date(endIso).toLocaleString(
    "en-US",
    { hour: "numeric", timeZone: "America/New_York" }
  )}`;
}

/**
 * Does the forecast show a freeze hit below the crop's stage kill temp in the
 * next 24 hours? We use "kill" temp for alert severity; "damage" for watch.
 */
function computeFrostCard(inputs: BannerInputs): ActionCard | null {
  const { forecast, cropId, cropStage } = inputs;

  // Minimum temperature in the next 24 hours.
  const next24 = forecast.hourly.slice(0, 24);
  if (next24.length === 0) return null;
  const minEntry = next24.reduce((min, h) => (h.tempF < min.tempF ? h : min));
  const minF = minEntry.tempF;

  // No farm profile yet? Use a conservative generic blossom threshold (28°F).
  // Only warn if the generic threshold is actually threatened.
  if (!cropId) {
    if (minF >= 32) return null;
    return {
      id: "frost-generic",
      severity: minF <= 28 ? "alert" : "watch",
      headline: `Tonight's low: ${Math.round(minF)}°F at ${formatLocalDateTime(minEntry.time)}`,
      detail:
        "Below-freezing temps ahead. Pick your crop above to see stage-specific damage thresholds.",
      ctaLabel: "See spray window",
      ctaHref: "/resources/spray-today",
    };
  }

  // With crop + stage, look up the actual kill threshold.
  const crop = CROPS[cropId];
  const stage = cropStage ?? crop.stages[0];
  const t = frostThresholdFor(cropId, stage);
  if (!t) return null;

  if (minF > t.damageF) return null; // comfortable margin

  const severity: ActionCard["severity"] =
    minF <= t.killF ? "alert" : "watch";
  const verb = minF <= t.killF ? "Kill temp threatened" : "Damage temp threatened";
  return {
    id: "frost",
    severity,
    headline: `${verb}: ${Math.round(minF)}°F at ${formatLocalDateTime(minEntry.time)}`,
    detail: `${crop.name} at ${stage.replace("_", " ")} is damaged below ${t.damageF}°F, killed below ${t.killF}°F.`,
    ctaLabel: "See full forecast",
    ctaHref: "/resources/spray-today",
  };
}

function computeSprayWindowCard(inputs: BannerInputs): ActionCard | null {
  const { forecast } = inputs;
  const next48 = forecast.hourly.slice(0, 48);
  const window = findNextGoWindow(next48, 2);
  if (!window) return null;

  const startIso = next48[window.startIdx].time;
  const endIso = next48[window.endIdx].time;
  return {
    id: "spray-window",
    severity: "good",
    headline: `Spray window opens ${formatLocalTimeRange(startIso, endIso)}`,
    detail: `${window.hours} hour window meets Part 137 wind + inversion limits. Book a drone while conditions hold.`,
    ctaLabel: "Book a spray",
    ctaHref: "/contact",
  };
}

function computeRainfastCard(inputs: BannerInputs): ActionCard | null {
  const { pastRain } = inputs.forecast;
  if (
    pastRain.hoursSinceLastRain == null ||
    pastRain.hoursSinceLastRain > 6
  ) {
    return null;
  }
  return {
    id: "rainfast",
    severity: "watch",
    headline: `Rain ${pastRain.hoursSinceLastRain.toFixed(0)}h ago — within rainfast window`,
    detail:
      "Most fungicides and contact herbicides aren't rainfast yet. Check product label before respraying.",
    ctaLabel: "See rain timer",
    ctaHref: "/resources/spray-today",
  };
}

export function computeBannerCards(inputs: BannerInputs): ActionCard[] {
  const candidates: (ActionCard | null)[] = [
    computeFrostCard(inputs),
    computeRainfastCard(inputs),
    computeSprayWindowCard(inputs),
  ];
  return candidates.filter((c): c is ActionCard => c !== null).slice(0, 3);
}
