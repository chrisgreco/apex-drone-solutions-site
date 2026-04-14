/**
 * NJ agricultural statistics used on the /resources/nj-crop-dashboard hub.
 * Source: USDA NASS 2023 + NJ Dept of Ag.
 *
 * Hardcoded because USDA's public API is slow and these values only update annually.
 */

export type NjCrop = {
  name: string;
  emoji: string;
  /** Production value, $M */
  valueM: number;
  acres: number;
  /** Annual production, millions of lbs (if tracked). */
  productionLbs?: number;
  nationalRank?: number;
  droneFit: string;
};

export const NJ_CROPS: NjCrop[] = [
  {
    name: "Blueberries",
    emoji: "🫐",
    valueM: 96,
    acres: 9_000,
    productionLbs: 44,
    nationalRank: 2,
    droneFit: "Targeted fungicide spraying for mummy berry & botrytis; NDVI scouting for bush health.",
  },
  {
    name: "Tomatoes (Fresh)",
    emoji: "🍅",
    valueM: 41,
    acres: 2_800,
    droneFit: "Early blight detection via multispectral imaging; precise copper spray applications.",
  },
  {
    name: "Peaches",
    emoji: "🍑",
    valueM: 33,
    acres: 4_500,
    productionLbs: 30,
    nationalRank: 5,
    droneFit: "Brown rot control spraying; canopy mapping for pruning optimization.",
  },
  {
    name: "Bell Peppers",
    emoji: "🫑",
    valueM: 32,
    acres: 2_700,
    nationalRank: 4,
    droneFit: "Bacterial spot monitoring; row-level fertilizer guidance via NDVI.",
  },
  {
    name: "Sweet Corn",
    emoji: "🌽",
    valueM: 31,
    acres: 6_500,
    droneFit: "Earworm scouting, tassel-stage spray coverage where sprayers can't reach.",
  },
  {
    name: "Cranberries",
    emoji: "🔴",
    valueM: 28,
    acres: 3_000,
    productionLbs: 54,
    nationalRank: 3,
    droneFit: "Bog-friendly aerial spraying (no soil compaction); fruit rot detection.",
  },
  {
    name: "Snap Beans",
    emoji: "🫛",
    valueM: 18,
    acres: 3_900,
    droneFit: "White mold monitoring; uniform fungicide deposition at canopy closure.",
  },
  {
    name: "Cucumbers",
    emoji: "🥒",
    valueM: 15,
    acres: 1_800,
    droneFit: "Downy mildew scouting; rapid-response fungicide passes.",
  },
  {
    name: "Apples",
    emoji: "🍎",
    valueM: 12,
    acres: 2_400,
    droneFit: "Fire blight detection; orchard floor weed mapping.",
  },
  {
    name: "Spinach",
    emoji: "🥬",
    valueM: 11,
    acres: 2_200,
    droneFit: "Leaf miner scouting; rescue spraying for close-planted beds.",
  },
  {
    name: "Squash",
    emoji: "🎃",
    valueM: 11,
    acres: 2_600,
    droneFit: "Powdery mildew early detection; targeted mid-season sprays.",
  },
  {
    name: "Asparagus",
    emoji: "🌱",
    valueM: 5,
    acres: 850,
    droneFit: "Fern-stage rust monitoring; precision herbicide rescue.",
  },
];

export const NJ_COUNTIES = [
  { name: "Salem", acres: 71_000, emoji: "🌾" },
  { name: "Cumberland", acres: 68_000, emoji: "🫐" },
  { name: "Burlington", acres: 64_000, emoji: "🔴" },
  { name: "Gloucester", acres: 37_000, emoji: "🍑" },
  { name: "Atlantic", acres: 32_000, emoji: "🌽" },
];

export const NJ_RANKINGS = [
  { rank: 2, crop: "Blueberries", blurb: "Second-highest producing state after Michigan." },
  { rank: 3, crop: "Cranberries", blurb: "Pine Barrens bogs behind only WI and MA." },
  { rank: 4, crop: "Bell Peppers", blurb: "Top-four nationally in fresh bell pepper output." },
  { rank: 5, crop: "Peaches", blurb: "Fifth-largest peach producer in the United States." },
];

export const NJ_HEADLINE_STATS = [
  { label: "Total Farms", value: "9,800" },
  { label: "Farmland Acres", value: "711K" },
  { label: "Ag Production Value", value: "$1.15B" },
  { label: "Avg Farm Size", value: "72 ac" },
];
