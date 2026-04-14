/**
 * Compute the 0–3 urgent action cards shown on the dashboard's top banner.
 *
 * Priority order (highest first):
 *   1. Frost / freeze within 24h below the crop-stage kill threshold
 *   2. Disease infection event within 72h at HIGH/EXTREME risk
 *   3. Rainfast window closing (recent rain)
 *   4. Chill hours just satisfied (timely winter nudge)
 *   5. Spray window opening today/tomorrow (≥2h)
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
import type { DiseasePrediction } from "./disease-models";
import type { ChillAccumulation } from "./chill-hours";

export type BannerInputs = {
  forecast: SprayForecast;
  cropId: CropId | null;
  cropStage: CropStage | null;
  diseases?: DiseasePrediction[];
  chill?: (ChillAccumulation & {
    chillRequired: number;
    bloomPrediction: { daysOut: number | null; date: string | null; chillComplete: boolean };
  }) | null;
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

function computeFrostCard(inputs: BannerInputs): ActionCard | null {
  const { forecast, cropId, cropStage } = inputs;
  const next24 = forecast.hourly.slice(0, 24);
  if (next24.length === 0) return null;
  const minEntry = next24.reduce((min, h) => (h.tempF < min.tempF ? h : min));
  const minF = minEntry.tempF;

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

  const crop = CROPS[cropId];
  const stage = cropStage ?? crop.stages[0];
  const t = frostThresholdFor(cropId, stage);
  if (!t) return null;
  if (minF > t.damageF) return null;

  const severity: ActionCard["severity"] = minF <= t.killF ? "alert" : "watch";
  const verb = minF <= t.killF ? "Kill temp threatened" : "Damage temp threatened";
  return {
    id: "frost",
    severity,
    headline: `${verb}: ${Math.round(minF)}°F at ${formatLocalDateTime(minEntry.time)}`,
    detail: `${crop.name} at ${stage.replace("_", " ")} is damaged below ${t.damageF}°F, killed below ${t.killF}°F.`,
    ctaLabel: "See frost watch",
    ctaHref: "/resources/frost-watch",
  };
}

function computeDiseaseCard(inputs: BannerInputs): ActionCard | null {
  const disease = inputs.diseases?.find((d) => d.risk === "high" || d.risk === "extreme");
  if (!disease) return null;
  const whenSuffix = disease.nextEvent
    ? ` at ${formatLocalDateTime(disease.nextEvent.startIso)}`
    : "";
  return {
    id: `disease-${disease.disease}`,
    severity: disease.risk === "extreme" ? "alert" : "watch",
    headline: `${disease.name} risk ${disease.risk.toUpperCase()}${whenSuffix}`,
    detail: disease.recommendation,
    ctaLabel: "Book a spray",
    ctaHref: "/contact",
  };
}

function computeRainfastCard(inputs: BannerInputs): ActionCard | null {
  const { pastRain } = inputs.forecast;
  if (pastRain.hoursSinceLastRain == null || pastRain.hoursSinceLastRain > 6) {
    return null;
  }
  return {
    id: "rainfast",
    severity: "watch",
    headline: `Rain ${pastRain.hoursSinceLastRain.toFixed(0)}h ago — within rainfast window`,
    detail: "Most fungicides and contact herbicides aren't rainfast yet. Check product label before respraying.",
    ctaLabel: "See rain timer",
    ctaHref: "/resources/spray-today",
  };
}

function computeChillCard(inputs: BannerInputs): ActionCard | null {
  if (!inputs.chill) return null;
  if (!inputs.chill.bloomPrediction.chillComplete) return null;
  const over = inputs.chill.hours - inputs.chill.chillRequired;
  if (over < 0 || over > 60) return null; // only nudge in the small window near completion
  return {
    id: "chill-complete",
    severity: "info",
    headline: `Chill requirement met (${inputs.chill.hours}h / ${inputs.chill.chillRequired}h)`,
    detail: inputs.chill.bloomPrediction.date
      ? `Bloom projected ${inputs.chill.bloomPrediction.date} — ready to start pest scouting and pre-bloom sprays.`
      : "Ready to transition into bud-break management.",
    ctaLabel: "See chill tracker",
    ctaHref: "/resources/chill-hours",
  };
}

function computeSprayWindowCard(inputs: BannerInputs): ActionCard | null {
  const next48 = inputs.forecast.hourly.slice(0, 48);
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

export function computeBannerCards(inputs: BannerInputs): ActionCard[] {
  const candidates: (ActionCard | null)[] = [
    computeFrostCard(inputs),
    computeDiseaseCard(inputs),
    computeRainfastCard(inputs),
    computeChillCard(inputs),
    computeSprayWindowCard(inputs),
  ];
  return candidates.filter((c): c is ActionCard => c !== null).slice(0, 3);
}
