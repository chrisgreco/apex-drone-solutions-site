/**
 * NJ grower dashboard — crop constants.
 *
 * Every crop-aware tile, alert, and model reads from this file. Adding a crop =
 * adding one entry here (and optionally a variety row). Sources cited inline.
 */

export type CropId =
  | "blueberry"
  | "peach"
  | "apple"
  | "cranberry"
  | "tomato"
  | "pepper";

/** Growth stages we recognize. "bloom_*" and "dormant" drive frost kill thresholds. */
export type CropStage =
  | "dormant"
  | "bud_swell"
  | "tight_cluster"
  | "pink_bud"
  | "full_bloom"
  | "petal_fall"
  | "fruit_set"
  | "fruit_fill"
  | "harvest"
  | "post_harvest";

/**
 * Critical temperatures (°F) below which damage occurs at each stage.
 * From Washington State Univ fruit frost tables + Rutgers/Cornell extension.
 * "damage" ≈ 10% kill, "kill" ≈ 90% kill.
 */
export type FrostThreshold = {
  stage: CropStage;
  damageF: number;
  killF: number;
};

export type DiseaseModel =
  | "mummy_berry" // Milholland / Monilinia vaccinii-corymbosi
  | "brown_rot" // Monilinia fructicola (Mills-like model)
  | "fire_blight" // Erwinia amylovora (Cougarblight / Maryblyt)
  | "bacterial_spot" // Xanthomonas (peach)
  | "late_blight" // Phytophthora infestans (Johnson/Blitecast)
  | "early_blight" // Alternaria solani
  | "botrytis" // Botrytis cinerea
  | "anthracnose" // Colletotrichum
  | "fruit_rot"; // Cranberry fruit rot complex

export type PestTarget =
  | "plum_curculio"
  | "oriental_fruit_moth"
  | "codling_moth"
  | "swd" // Spotted wing drosophila
  | "blueberry_maggot"
  | "cranberry_fruitworm"
  | "bmsb" // Brown marmorated stink bug
  | "tomato_hornworm"
  | "european_corn_borer"
  | "pepper_weevil";

export type Variety = {
  id: string;
  name: string;
  /** Chill-hour requirement (Utah model, 32–45°F hours). */
  chillHoursReq: number;
  /** GDD base 50°F from full-bloom to harvest. */
  gddBloomToHarvest?: number;
  notes?: string;
};

export type Crop = {
  id: CropId;
  name: string;
  emoji: string;
  /** Applicable frost thresholds, roughly ordered by season. */
  frost: FrostThreshold[];
  /** Diseases relevant to this crop; drives which models run for them. */
  diseases: DiseaseModel[];
  /** Pests relevant to this crop. */
  pests: PestTarget[];
  /** GDD base temperature (°F) used for this crop's phenology. */
  gddBase: number;
  /** Canonical varieties grown in NJ with chill requirements. */
  varieties: Variety[];
  /** Human stages in rough order for UI pickers. */
  stages: CropStage[];
  /** Harvest model target — GDD since bloom to harvest (fallback if variety missing). */
  gddBloomToHarvest: number;
  /** Rough NJ bloom window for UI hints. */
  typicalBloomRange: { start: string; end: string }; // MM-DD
};

/* ------------------------------------------------------------------ */
/*  Crop database                                                     */
/* ------------------------------------------------------------------ */

export const CROPS: Record<CropId, Crop> = {
  blueberry: {
    id: "blueberry",
    name: "Blueberry",
    emoji: "🫐",
    gddBase: 50,
    gddBloomToHarvest: 1100,
    typicalBloomRange: { start: "04-25", end: "05-20" },
    stages: [
      "dormant",
      "bud_swell",
      "tight_cluster",
      "pink_bud",
      "full_bloom",
      "petal_fall",
      "fruit_set",
      "fruit_fill",
      "harvest",
      "post_harvest",
    ],
    frost: [
      { stage: "dormant", damageF: 10, killF: 0 },
      { stage: "bud_swell", damageF: 23, killF: 18 },
      { stage: "tight_cluster", damageF: 27, killF: 22 },
      { stage: "pink_bud", damageF: 28, killF: 25 },
      { stage: "full_bloom", damageF: 30, killF: 28 },
      { stage: "petal_fall", damageF: 31, killF: 28 },
      { stage: "fruit_set", damageF: 32, killF: 30 },
    ],
    diseases: ["mummy_berry", "botrytis", "anthracnose"],
    pests: ["swd", "blueberry_maggot", "cranberry_fruitworm"],
    varieties: [
      { id: "bluecrop", name: "Bluecrop", chillHoursReq: 800, gddBloomToHarvest: 1100, notes: "NJ's most-planted highbush cultivar." },
      { id: "duke", name: "Duke", chillHoursReq: 850, gddBloomToHarvest: 950, notes: "Early-season, excellent firmness." },
      { id: "elliott", name: "Elliott", chillHoursReq: 900, gddBloomToHarvest: 1400, notes: "Late-season; extends picking window." },
      { id: "jersey", name: "Jersey", chillHoursReq: 800, gddBloomToHarvest: 1300, notes: "Processing standard; very cold-hardy." },
      { id: "weymouth", name: "Weymouth", chillHoursReq: 750, gddBloomToHarvest: 900, notes: "Earliest-ripening, Hammonton heritage." },
    ],
  },

  peach: {
    id: "peach",
    name: "Peach",
    emoji: "🍑",
    gddBase: 50,
    gddBloomToHarvest: 1200,
    typicalBloomRange: { start: "04-08", end: "04-28" },
    stages: [
      "dormant",
      "bud_swell",
      "pink_bud",
      "full_bloom",
      "petal_fall",
      "fruit_set",
      "fruit_fill",
      "harvest",
      "post_harvest",
    ],
    frost: [
      { stage: "dormant", damageF: 5, killF: -10 },
      { stage: "bud_swell", damageF: 22, killF: 15 },
      { stage: "pink_bud", damageF: 25, killF: 19 },
      { stage: "full_bloom", damageF: 28, killF: 25 },
      { stage: "petal_fall", damageF: 28, killF: 25 },
      { stage: "fruit_set", damageF: 30, killF: 28 },
    ],
    diseases: ["brown_rot", "bacterial_spot"],
    pests: ["plum_curculio", "oriental_fruit_moth", "bmsb"],
    varieties: [
      { id: "redhaven", name: "Redhaven", chillHoursReq: 950, gddBloomToHarvest: 1150, notes: "Industry standard mid-season freestone." },
      { id: "loring", name: "Loring", chillHoursReq: 800, gddBloomToHarvest: 1250 },
      { id: "cresthaven", name: "Cresthaven", chillHoursReq: 850, gddBloomToHarvest: 1350 },
      { id: "glohaven", name: "Glohaven", chillHoursReq: 850, gddBloomToHarvest: 1300 },
      { id: "encore", name: "Encore", chillHoursReq: 850, gddBloomToHarvest: 1450, notes: "Late-season, extends harvest into Sept." },
    ],
  },

  apple: {
    id: "apple",
    name: "Apple",
    emoji: "🍎",
    gddBase: 50,
    gddBloomToHarvest: 2400,
    typicalBloomRange: { start: "04-22", end: "05-10" },
    stages: [
      "dormant",
      "bud_swell",
      "tight_cluster",
      "pink_bud",
      "full_bloom",
      "petal_fall",
      "fruit_set",
      "fruit_fill",
      "harvest",
      "post_harvest",
    ],
    frost: [
      { stage: "dormant", damageF: 0, killF: -20 },
      { stage: "bud_swell", damageF: 15, killF: 2 },
      { stage: "tight_cluster", damageF: 21, killF: 15 },
      { stage: "pink_bud", damageF: 25, killF: 19 },
      { stage: "full_bloom", damageF: 28, killF: 25 },
      { stage: "petal_fall", damageF: 28, killF: 25 },
      { stage: "fruit_set", damageF: 30, killF: 28 },
    ],
    diseases: ["fire_blight"],
    pests: ["codling_moth", "plum_curculio", "bmsb"],
    varieties: [
      { id: "gala", name: "Gala", chillHoursReq: 600, gddBloomToHarvest: 2300 },
      { id: "honeycrisp", name: "Honeycrisp", chillHoursReq: 800, gddBloomToHarvest: 2400 },
      { id: "fuji", name: "Fuji", chillHoursReq: 650, gddBloomToHarvest: 2800 },
      { id: "granny_smith", name: "Granny Smith", chillHoursReq: 600, gddBloomToHarvest: 2700 },
      { id: "mcintosh", name: "McIntosh", chillHoursReq: 900, gddBloomToHarvest: 2200 },
    ],
  },

  cranberry: {
    id: "cranberry",
    name: "Cranberry",
    emoji: "🔴",
    gddBase: 45,
    gddBloomToHarvest: 1400,
    typicalBloomRange: { start: "06-10", end: "07-05" },
    stages: [
      "dormant",
      "bud_swell",
      "full_bloom",
      "fruit_set",
      "fruit_fill",
      "harvest",
      "post_harvest",
    ],
    frost: [
      { stage: "dormant", damageF: 10, killF: 0 },
      { stage: "bud_swell", damageF: 26, killF: 22 },
      { stage: "full_bloom", damageF: 30, killF: 28 },
      { stage: "fruit_set", damageF: 30, killF: 28 },
      { stage: "fruit_fill", damageF: 28, killF: 25 },
    ],
    diseases: ["fruit_rot", "botrytis"],
    pests: ["cranberry_fruitworm"],
    varieties: [
      { id: "stevens", name: "Stevens", chillHoursReq: 500 },
      { id: "ben_lear", name: "Ben Lear", chillHoursReq: 500 },
      { id: "early_black", name: "Early Black", chillHoursReq: 500, notes: "Heritage NJ cultivar, Pine Barrens." },
      { id: "demoranville", name: "Demoranville", chillHoursReq: 500 },
    ],
  },

  tomato: {
    id: "tomato",
    name: "Tomato",
    emoji: "🍅",
    gddBase: 50,
    gddBloomToHarvest: 900,
    typicalBloomRange: { start: "06-10", end: "07-01" },
    stages: ["dormant", "fruit_set", "fruit_fill", "harvest", "post_harvest"],
    frost: [
      // Tomato is a warm-season annual — frost = death, no gradient.
      { stage: "fruit_set", damageF: 33, killF: 32 },
      { stage: "fruit_fill", damageF: 33, killF: 32 },
    ],
    diseases: ["late_blight", "early_blight", "botrytis"],
    pests: ["tomato_hornworm", "bmsb"],
    varieties: [
      { id: "rutgers_250", name: "Rutgers 250", chillHoursReq: 0, notes: "NJ heritage, rebred 2014." },
      { id: "big_beef", name: "Big Beef", chillHoursReq: 0 },
      { id: "celebrity", name: "Celebrity", chillHoursReq: 0 },
      { id: "sungold", name: "Sungold", chillHoursReq: 0, notes: "Cherry; market favorite." },
    ],
  },

  pepper: {
    id: "pepper",
    name: "Bell Pepper",
    emoji: "🫑",
    gddBase: 50,
    gddBloomToHarvest: 1100,
    typicalBloomRange: { start: "06-15", end: "07-10" },
    stages: ["dormant", "fruit_set", "fruit_fill", "harvest", "post_harvest"],
    frost: [
      { stage: "fruit_set", damageF: 33, killF: 32 },
      { stage: "fruit_fill", damageF: 33, killF: 32 },
    ],
    diseases: ["bacterial_spot"],
    pests: ["pepper_weevil", "european_corn_borer", "bmsb"],
    varieties: [
      { id: "aristotle", name: "Aristotle", chillHoursReq: 0, notes: "Bacterial-spot resistant." },
      { id: "paladin", name: "Paladin", chillHoursReq: 0 },
      { id: "revolution", name: "Revolution", chillHoursReq: 0 },
    ],
  },
};

export const CROP_LIST: Crop[] = Object.values(CROPS);

/** Human-readable stage label. */
export const STAGE_LABEL: Record<CropStage, string> = {
  dormant: "Dormant",
  bud_swell: "Bud swell",
  tight_cluster: "Tight cluster",
  pink_bud: "Pink bud",
  full_bloom: "Full bloom",
  petal_fall: "Petal fall",
  fruit_set: "Fruit set",
  fruit_fill: "Fruit fill",
  harvest: "Harvest",
  post_harvest: "Post-harvest",
};

/**
 * Look up frost damage/kill thresholds for a crop at a given stage.
 * Falls back to the closest defined stage.
 */
export function frostThresholdFor(
  cropId: CropId,
  stage: CropStage
): FrostThreshold | null {
  const crop = CROPS[cropId];
  if (!crop) return null;
  const exact = crop.frost.find((f) => f.stage === stage);
  if (exact) return exact;
  // Nearest by index order
  const stageIdx = crop.stages.indexOf(stage);
  if (stageIdx === -1) return crop.frost[0] ?? null;
  let best: FrostThreshold | null = null;
  let bestDist = Infinity;
  for (const f of crop.frost) {
    const dist = Math.abs(crop.stages.indexOf(f.stage) - stageIdx);
    if (dist < bestDist) {
      bestDist = dist;
      best = f;
    }
  }
  return best;
}

/** Determine if a crop is currently in a bloom-adjacent stage (for UI tile visibility). */
export function isBloomStage(stage: CropStage | null | undefined): boolean {
  return (
    stage === "pink_bud" ||
    stage === "full_bloom" ||
    stage === "petal_fall" ||
    stage === "tight_cluster" ||
    stage === "bud_swell"
  );
}
