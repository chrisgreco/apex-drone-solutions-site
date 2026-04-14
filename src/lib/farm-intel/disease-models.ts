/**
 * Crop disease infection models — simplified implementations of the
 * published Extension-grade models NJ growers already know by name.
 *
 * Each model consumes the hourly forecast we already fetch (wind/temp/RH/precip)
 * and returns a risk level + next predicted infection event. Leaf wetness is
 * estimated from RH ≥ 90% OR measurable rain in that hour — standard practice
 * in NEWA and PSU tools when real leaf-wetness sensors aren't available.
 *
 * Sources cited per-model. These are NOT laboratory-accurate; they're field-
 * defensible "when to spray" flags that match what extension IPM advisors do.
 * We want to raise attention, not make final regulatory decisions.
 */

import type { HourlyForecast } from "@/lib/spray-decision";
import type { CropId, DiseaseModel } from "./crops";

export type RiskLevel = "low" | "moderate" | "high" | "extreme";

export type InfectionEvent = {
  /** Start of the at-risk window (ISO). */
  startIso: string;
  /** End of the at-risk window (ISO). */
  endIso: string;
  /** Continuous wet hours in this event. */
  wetHours: number;
  /** Average air temp °F across the event. */
  avgTempF: number;
};

export type DiseasePrediction = {
  disease: DiseaseModel;
  /** Human label, e.g. "Mummy berry". */
  name: string;
  /** Which crop this prediction is for. */
  crop: CropId;
  /** Current / next-7-day peak risk. */
  risk: RiskLevel;
  /** One-line summary for the dashboard tile. */
  headline: string;
  /** 1–3 sentence detail for the deep page. */
  detail: string;
  /** Next predicted infection event in the forecast window, if any. */
  nextEvent: InfectionEvent | null;
  /** Plain-English recommendation. */
  recommendation: string;
};

// ---------- Leaf-wetness estimation ----------

/**
 * Treat an hour as "leaf wet" when RH ≥ 90% OR precip > 0.01".
 * Standard NEWA / PSU fallback when a leaf-wetness sensor isn't available.
 */
function isLeafWet(h: HourlyForecast): boolean {
  if (h.precipIn > 0.01) return true;
  if (h.humidity != null && h.humidity >= 90) return true;
  return false;
}

/**
 * Scan forecast hours and return every contiguous leaf-wetness event whose
 * avg temp falls inside [tempMinF, tempMaxF] and whose duration meets minHours.
 */
function findWetEvents(
  hourly: HourlyForecast[],
  opts: { tempMinF: number; tempMaxF: number; minHours: number }
): InfectionEvent[] {
  const out: InfectionEvent[] = [];
  let runStart = -1;
  let tempSum = 0;
  let runLen = 0;

  const flush = (endExclusive: number) => {
    if (runStart === -1 || runLen < opts.minHours) return;
    const avg = tempSum / runLen;
    if (avg < opts.tempMinF || avg > opts.tempMaxF) return;
    out.push({
      startIso: hourly[runStart].time,
      endIso: hourly[endExclusive - 1].time,
      wetHours: runLen,
      avgTempF: avg,
    });
  };

  for (let i = 0; i < hourly.length; i++) {
    const h = hourly[i];
    if (isLeafWet(h)) {
      if (runStart === -1) {
        runStart = i;
        tempSum = 0;
        runLen = 0;
      }
      tempSum += h.tempF;
      runLen += 1;
    } else {
      flush(i);
      runStart = -1;
      tempSum = 0;
      runLen = 0;
    }
  }
  flush(hourly.length);
  return out;
}

// ---------- Mummy berry (blueberry, Milholland 1985) ----------
//
// Primary infection (apothecia → young tissue): 6+ wet hours with avg temp
// 50–59°F. Secondary (conidia → flowers): 6–9 wet hours at 65–77°F during bloom.
// Reference: NC State Ext. and Rutgers Blueberry IPM.

function predictMummyBerry(hourly: HourlyForecast[]): DiseasePrediction {
  const primary = findWetEvents(hourly, { tempMinF: 50, tempMaxF: 59, minHours: 6 });
  const secondary = findWetEvents(hourly, { tempMinF: 65, tempMaxF: 77, minHours: 6 });
  const all = [...primary, ...secondary].sort((a, b) => a.startIso.localeCompare(b.startIso));
  const next = all[0] ?? null;

  let risk: RiskLevel = "low";
  if (next) {
    if (next.wetHours >= 12) risk = "extreme";
    else if (next.wetHours >= 9) risk = "high";
    else risk = "moderate";
  }

  return {
    disease: "mummy_berry",
    name: "Mummy berry",
    crop: "blueberry",
    risk,
    headline:
      risk === "low"
        ? "No infection event in 7-day forecast"
        : `${risk === "extreme" ? "EXTREME" : risk.toUpperCase()} risk — ${next!.wetHours}h wet @ ${Math.round(next!.avgTempF)}°F`,
    detail:
      "Mummy berry (Monilinia vaccinii-corymbosi) infects young blueberry shoots in spring after 6+ hours of leaf wetness at 50–59°F (primary), or flowers during bloom at 65–77°F (secondary). Primary infection causes shoot blight; secondary destroys developing fruit.",
    nextEvent: next,
    recommendation:
      risk === "low"
        ? "No action required. Scout weekly during bloom for shepherd's-crook shoot symptoms."
        : "Apply a protectant fungicide (fenbuconazole, propiconazole, or Indar) before the event if shoots are at bud-break or later. Re-spray if 14 days elapse.",
  };
}

// ---------- Brown rot (peach, Zehr-style Mills-adapted) ----------
//
// Blossom blight: wet period ≥ 6 hours at 55–77°F during bloom. Fruit rot
// pre-harvest: temp ≥ 70°F + RH ≥ 85% + wet ≥ 5h as fruit ripens.
// Reference: Zehr & Ogawa 1994, PSU Brown Rot TOM-CAST adaptation.

function predictBrownRot(hourly: HourlyForecast[]): DiseasePrediction {
  const events = findWetEvents(hourly, { tempMinF: 55, tempMaxF: 77, minHours: 6 });
  const next = events[0] ?? null;

  // Count total wet hours in the warm-humid "fruit rot" window (≥ 70°F, ≥ 85% RH)
  const preharvestHours = hourly.filter(
    (h) => h.tempF >= 70 && (h.humidity ?? 0) >= 85
  ).length;

  let risk: RiskLevel = "low";
  if (next) {
    if (next.wetHours >= 12 || preharvestHours >= 12) risk = "extreme";
    else if (next.wetHours >= 9 || preharvestHours >= 8) risk = "high";
    else risk = "moderate";
  } else if (preharvestHours >= 6) {
    risk = "moderate";
  }

  return {
    disease: "brown_rot",
    name: "Brown rot",
    crop: "peach",
    risk,
    headline:
      risk === "low"
        ? "No blossom/fruit infection risk in 7d"
        : next
        ? `${risk.toUpperCase()} risk — ${next.wetHours}h wet @ ${Math.round(next.avgTempF)}°F`
        : `${risk.toUpperCase()} — pre-harvest conditions warm+humid`,
    detail:
      "Brown rot (Monilinia fructicola) hits stone fruit at bloom (blossom blight) and again pre-harvest (fruit rot). Blossom infection needs 6+ wet hours at 55–77°F; pre-harvest fruit rot accelerates at ≥70°F with ≥85% RH.",
    nextEvent: next,
    recommendation:
      risk === "low"
        ? "Scout weekly for mummified fruit/twig cankers. No immediate spray needed."
        : "Bloom: protectant fungicide (propiconazole, fenbuconazole) at pink bud + full bloom. Pre-harvest: SDHI (Merivon/Luna) 7–14 days before harvest, shorter interval if rain forecast.",
  };
}

// ---------- Fire blight (apple, Cougarblight-adapted) ----------
//
// Risk proportional to cumulative Degree Hours > 65°F during bloom + blossom
// wetting event. Simplified: "high" when avg temp during bloom-window hours
// is ≥ 65°F AND at least one wetting event exists.
// Reference: Smith 1996 Cougarblight.

function predictFireBlight(hourly: HourlyForecast[]): DiseasePrediction {
  const warmBloomHours = hourly.filter((h) => h.tempF >= 65 && h.tempF <= 85).length;
  const wetEvents = findWetEvents(hourly, {
    tempMinF: 60,
    tempMaxF: 85,
    minHours: 2,
  });
  const next = wetEvents[0] ?? null;

  let risk: RiskLevel = "low";
  if (warmBloomHours >= 72 && wetEvents.length > 0) risk = "extreme";
  else if (warmBloomHours >= 48 && wetEvents.length > 0) risk = "high";
  else if (warmBloomHours >= 24) risk = "moderate";

  return {
    disease: "fire_blight",
    name: "Fire blight",
    crop: "apple",
    risk,
    headline:
      risk === "low"
        ? "Below threshold in 7-day forecast"
        : `${risk.toUpperCase()} — ${warmBloomHours}h ≥ 65°F${next ? " + wet blossom event" : ""}`,
    detail:
      "Fire blight (Erwinia amylovora) accumulates infection potential as degree-hours above 65°F during bloom. Bacterial populations double every 8 hours when warm, and any blossom wetting event (rain, dew, hail) enables explosive infection.",
    nextEvent: next,
    recommendation:
      risk === "low"
        ? "Monitor weather; no spray needed until bloom is imminent and warmth accumulates."
        : "Apply streptomycin within 24h of any predicted wetting event during bloom. Re-apply if bloom continues 4+ days. Remove infected strikes promptly — burn or bury.",
  };
}

// ---------- Late blight (tomato/potato, Johnson/Blitecast-adapted) ----------
//
// Disease Severity Value (DSV) accumulates during RH ≥ 90% hours at 10–25°C
// (50–77°F). 7+ DSVs in a running week → spray threshold.
// Reference: Wallin 1962, Johnson 1996 (USAblight adaptation).

function predictLateBlight(hourly: HourlyForecast[]): DiseasePrediction {
  // Collapse to wet events at 50–77°F; each ≥10h event = ~4 DSV
  const events = findWetEvents(hourly, { tempMinF: 50, tempMaxF: 77, minHours: 10 });
  const totalWet = events.reduce((a, e) => a + e.wetHours, 0);
  const next = events[0] ?? null;

  let risk: RiskLevel = "low";
  if (totalWet >= 40) risk = "extreme";
  else if (totalWet >= 20) risk = "high";
  else if (totalWet >= 10) risk = "moderate";

  return {
    disease: "late_blight",
    name: "Late blight",
    crop: "tomato",
    risk,
    headline:
      risk === "low"
        ? "No DSV accumulation this week"
        : `${risk.toUpperCase()} — ${totalWet}h of infection-favorable conditions`,
    detail:
      "Late blight (Phytophthora infestans) accumulates Disease Severity Values (DSVs) during ≥10-hour leaf wetness events at 50–77°F. 7+ DSVs trigger rapid sporulation. NJ late blight outbreaks spread statewide within days.",
    nextEvent: next,
    recommendation:
      risk === "low"
        ? "Standard rotation of protectant fungicides (chlorothalonil, mancozeb) on 7–10 day schedule."
        : "Tighten fungicide interval to 5–7 days. Add a translaminar product (mandipropamid, cymoxanil) if active spores detected in NJ. Destroy any infected plants immediately.",
  };
}

// ---------- Early blight (tomato, P-days surrogate) ----------
//
// Accumulates with warm + humid + leaf-wet conditions; simpler model: count
// wet events at 65–85°F.

function predictEarlyBlight(hourly: HourlyForecast[]): DiseasePrediction {
  const events = findWetEvents(hourly, { tempMinF: 65, tempMaxF: 85, minHours: 5 });
  const totalHours = events.reduce((a, e) => a + e.wetHours, 0);
  const next = events[0] ?? null;

  let risk: RiskLevel = "low";
  if (totalHours >= 30) risk = "extreme";
  else if (totalHours >= 18) risk = "high";
  else if (totalHours >= 8) risk = "moderate";

  return {
    disease: "early_blight",
    name: "Early blight",
    crop: "tomato",
    risk,
    headline:
      risk === "low"
        ? "No accumulation in 7-day forecast"
        : `${risk.toUpperCase()} — ${totalHours}h warm+humid`,
    detail:
      "Early blight (Alternaria solani) thrives on leaf-wet hours at 65–85°F. Older foliage is most susceptible; risk rises mid-season once canopies close.",
    nextEvent: next,
    recommendation:
      risk === "low"
        ? "Scout lower leaves for target-spot lesions weekly."
        : "Apply a protectant (azoxystrobin, chlorothalonil, or tebuconazole) and improve airflow by pruning lower leaves.",
  };
}

// ---------- Bacterial spot (peach / pepper) ----------
//
// Favored by warm wet conditions. Count wet hours at 75–85°F.

function predictBacterialSpot(hourly: HourlyForecast[], crop: CropId): DiseasePrediction {
  const events = findWetEvents(hourly, { tempMinF: 75, tempMaxF: 85, minHours: 4 });
  const totalHours = events.reduce((a, e) => a + e.wetHours, 0);
  const next = events[0] ?? null;

  let risk: RiskLevel = "low";
  if (totalHours >= 24) risk = "extreme";
  else if (totalHours >= 12) risk = "high";
  else if (totalHours >= 5) risk = "moderate";

  return {
    disease: "bacterial_spot",
    name: "Bacterial spot",
    crop,
    risk,
    headline:
      risk === "low"
        ? "Below threshold this week"
        : `${risk.toUpperCase()} — ${totalHours}h warm+wet`,
    detail:
      "Bacterial spot (Xanthomonas) causes lesions on leaves and fruit under warm wet conditions. On peaches it defoliates canopies and scars fruit; on peppers it spreads explosively in summer storms.",
    nextEvent: next,
    recommendation:
      risk === "low"
        ? "Choose resistant varieties; avoid overhead irrigation."
        : "Apply copper + mancozeb tank mix before forecast wet events. Resistance management: rotate with Actigard (plant defense activator).",
  };
}

// ---------- Dispatcher ----------

const MODEL_DISPATCH: Record<
  DiseaseModel,
  ((hourly: HourlyForecast[], crop: CropId) => DiseasePrediction) | null
> = {
  mummy_berry: (h) => predictMummyBerry(h),
  brown_rot: (h) => predictBrownRot(h),
  fire_blight: (h) => predictFireBlight(h),
  late_blight: (h) => predictLateBlight(h),
  early_blight: (h) => predictEarlyBlight(h),
  bacterial_spot: (h, c) => predictBacterialSpot(h, c),
  // Below are tracked for future phases:
  botrytis: null,
  anthracnose: null,
  fruit_rot: null,
};

/**
 * Run every disease model relevant to the given crop, return sorted by risk
 * (extreme → high → moderate → low).
 */
export function predictDiseasesForCrop(
  crop: CropId,
  diseases: DiseaseModel[],
  hourly: HourlyForecast[]
): DiseasePrediction[] {
  const riskRank: Record<RiskLevel, number> = { low: 0, moderate: 1, high: 2, extreme: 3 };
  return diseases
    .map((d) => {
      const fn = MODEL_DISPATCH[d];
      if (!fn) return null;
      return fn(hourly, crop);
    })
    .filter((p): p is DiseasePrediction => p !== null)
    .sort((a, b) => riskRank[b.risk] - riskRank[a.risk]);
}
