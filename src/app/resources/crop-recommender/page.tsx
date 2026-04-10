"use client";

import { useState } from "react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/FadeIn";
import { GridBackground } from "@/components/ui/grid-background";
import {
  IconWheat,
  IconDroplet,
  IconSun,
  IconLeaf,
  IconTarget,
  IconArrowRight,
  IconCheckCircle,
  IconBarChart,
  IconDollar,
} from "@/components/Icons";
import Link from "next/link";

/* ─── Crop Database ─── */

interface CropProfile {
  name: string;
  emoji: string;
  idealSoilTypes: string[];
  phRange: [number, number];
  nitrogenPref: string;
  phosphorusPref: string;
  potassiumPref: string;
  rainfallRange: [number, number];
  tempRange: string;
  yieldPerAcre: string;
  marketValuePerAcre: string;
  droneBenefit: string;
}

const CROPS: CropProfile[] = [
  {
    name: "Blueberries",
    emoji: "\uD83E\uDED0",
    idealSoilTypes: ["Sandy Loam", "Sandy", "Peat/Muck"],
    phRange: [4.5, 5.5],
    nitrogenPref: "Medium",
    phosphorusPref: "Low",
    potassiumPref: "Medium",
    rainfallRange: [40, 55],
    tempRange: "Moderate",
    yieldPerAcre: "6,000 - 10,000 lbs",
    marketValuePerAcre: "$12,000 - $25,000",
    droneBenefit:
      "Precision fungicide spraying reduces SWD damage by up to 40%. Thermal imaging detects stress before visible symptoms.",
  },
  {
    name: "Peaches",
    emoji: "\uD83C\uDF51",
    idealSoilTypes: ["Sandy Loam", "Loam"],
    phRange: [6.0, 7.0],
    nitrogenPref: "Medium",
    phosphorusPref: "Medium",
    potassiumPref: "Medium",
    rainfallRange: [35, 50],
    tempRange: "Warm",
    yieldPerAcre: "8,000 - 15,000 lbs",
    marketValuePerAcre: "$8,000 - $18,000",
    droneBenefit:
      "Canopy-level spraying reaches treetops traditional equipment misses. NDVI mapping tracks orchard health block by block.",
  },
  {
    name: "Tomatoes",
    emoji: "\uD83C\uDF45",
    idealSoilTypes: ["Loam", "Sandy Loam", "Clay Loam"],
    phRange: [6.0, 6.8],
    nitrogenPref: "High",
    phosphorusPref: "High",
    potassiumPref: "High",
    rainfallRange: [35, 50],
    tempRange: "Warm",
    yieldPerAcre: "25,000 - 40,000 lbs",
    marketValuePerAcre: "$10,000 - $20,000",
    droneBenefit:
      "Early blight detection through multispectral scanning. Targeted foliar feeding saves 30% on fertilizer costs.",
  },
  {
    name: "Bell Peppers",
    emoji: "\uD83E\uDED1",
    idealSoilTypes: ["Loam", "Sandy Loam"],
    phRange: [6.0, 6.8],
    nitrogenPref: "High",
    phosphorusPref: "Medium",
    potassiumPref: "High",
    rainfallRange: [35, 50],
    tempRange: "Warm",
    yieldPerAcre: "15,000 - 25,000 lbs",
    marketValuePerAcre: "$12,000 - $22,000",
    droneBenefit:
      "Aphid and whitefly detection via thermal imaging. Precision pesticide application reduces chemical use by 50%.",
  },
  {
    name: "Cranberries",
    emoji: "\uD83E\uDED0",
    idealSoilTypes: ["Peat/Muck", "Sandy"],
    phRange: [4.5, 5.5],
    nitrogenPref: "Low",
    phosphorusPref: "Low",
    potassiumPref: "Low",
    rainfallRange: [40, 55],
    tempRange: "Cool",
    yieldPerAcre: "15,000 - 25,000 lbs",
    marketValuePerAcre: "$5,000 - $10,000",
    droneBenefit:
      "Bog-level imaging monitors water levels and fruit set. Drone seeding for bog renovation eliminates manual labor.",
  },
  {
    name: "Sweet Corn",
    emoji: "\uD83C\uDF3D",
    idealSoilTypes: ["Loam", "Sandy Loam", "Clay Loam"],
    phRange: [5.8, 7.0],
    nitrogenPref: "High",
    phosphorusPref: "Medium",
    potassiumPref: "Medium",
    rainfallRange: [35, 50],
    tempRange: "Warm",
    yieldPerAcre: "10,000 - 18,000 ears",
    marketValuePerAcre: "$3,000 - $6,000",
    droneBenefit:
      "Fall armyworm scouting with AI-powered image recognition. Variable-rate nitrogen application maximizes ear fill.",
  },
  {
    name: "Soybeans",
    emoji: "\uD83E\uDED8",
    idealSoilTypes: ["Loam", "Clay Loam", "Sandy Loam"],
    phRange: [6.0, 7.0],
    nitrogenPref: "Low",
    phosphorusPref: "Medium",
    potassiumPref: "High",
    rainfallRange: [35, 50],
    tempRange: "Moderate",
    yieldPerAcre: "40 - 60 bushels",
    marketValuePerAcre: "$500 - $900",
    droneBenefit:
      "Weed pressure mapping guides spot-spray herbicide application. Stand counts verify planting population in days, not weeks.",
  },
  {
    name: "Asparagus",
    emoji: "\uD83E\uDD66",
    idealSoilTypes: ["Sandy Loam", "Sandy"],
    phRange: [6.5, 7.5],
    nitrogenPref: "Medium",
    phosphorusPref: "High",
    potassiumPref: "High",
    rainfallRange: [30, 45],
    tempRange: "Moderate",
    yieldPerAcre: "2,500 - 4,000 lbs",
    marketValuePerAcre: "$6,000 - $12,000",
    droneBenefit:
      "Crown rot detection with thermal imaging. Fern-stage fungicide application protects next year's yield.",
  },
  {
    name: "Spinach",
    emoji: "\uD83E\uDD6C",
    idealSoilTypes: ["Loam", "Clay Loam"],
    phRange: [6.5, 7.5],
    nitrogenPref: "High",
    phosphorusPref: "Medium",
    potassiumPref: "Medium",
    rainfallRange: [30, 45],
    tempRange: "Cool",
    yieldPerAcre: "8,000 - 15,000 lbs",
    marketValuePerAcre: "$4,000 - $10,000",
    droneBenefit:
      "Downy mildew detection through leaf-level multispectral analysis. Quick-turn field mapping for succession planting.",
  },
  {
    name: "Strawberries",
    emoji: "\uD83C\uDF53",
    idealSoilTypes: ["Sandy Loam", "Loam"],
    phRange: [5.5, 6.5],
    nitrogenPref: "Medium",
    phosphorusPref: "High",
    potassiumPref: "High",
    rainfallRange: [35, 50],
    tempRange: "Moderate",
    yieldPerAcre: "15,000 - 25,000 lbs",
    marketValuePerAcre: "$20,000 - $40,000",
    droneBenefit:
      "Gray mold (Botrytis) early detection saves crop losses. Precise pollination monitoring ensures fruit set quality.",
  },
  {
    name: "Pumpkins",
    emoji: "\uD83C\uDF83",
    idealSoilTypes: ["Loam", "Sandy Loam", "Clay Loam"],
    phRange: [6.0, 6.8],
    nitrogenPref: "Medium",
    phosphorusPref: "Medium",
    potassiumPref: "Medium",
    rainfallRange: [35, 50],
    tempRange: "Warm",
    yieldPerAcre: "20,000 - 40,000 lbs",
    marketValuePerAcre: "$3,000 - $8,000",
    droneBenefit:
      "Powdery mildew detection and targeted fungicide spraying. Vine coverage mapping optimizes field spacing.",
  },
  {
    name: "Snap Beans",
    emoji: "\uD83E\uDED8",
    idealSoilTypes: ["Loam", "Sandy Loam"],
    phRange: [6.0, 6.8],
    nitrogenPref: "Low",
    phosphorusPref: "Medium",
    potassiumPref: "Medium",
    rainfallRange: [35, 50],
    tempRange: "Moderate",
    yieldPerAcre: "5,000 - 10,000 lbs",
    marketValuePerAcre: "$3,000 - $7,000",
    droneBenefit:
      "Rust and white mold detection via aerial imaging. Post-emergence herbicide application with zero crop damage.",
  },
];

/* ─── Scoring Algorithm ─── */

function scoreCrop(
  crop: CropProfile,
  soilType: string,
  ph: number,
  nitrogen: string,
  phosphorus: string,
  potassium: string,
  rainfall: number,
  temp: string
): number {
  let score = 0;

  // Soil type match (30 pts)
  if (crop.idealSoilTypes.includes(soilType)) {
    score += 30;
  } else {
    // Partial credit for adjacent soil types
    const soilAdjacency: Record<string, string[]> = {
      "Sandy Loam": ["Sandy", "Loam"],
      Loam: ["Sandy Loam", "Clay Loam"],
      "Clay Loam": ["Loam"],
      Sandy: ["Sandy Loam"],
      "Peat/Muck": ["Sandy"],
    };
    const adjacent = soilAdjacency[soilType] || [];
    if (crop.idealSoilTypes.some((s) => adjacent.includes(s))) {
      score += 15;
    }
  }

  // pH match (25 pts)
  const [phMin, phMax] = crop.phRange;
  if (ph >= phMin && ph <= phMax) {
    score += 25;
  } else {
    const phDist = Math.min(Math.abs(ph - phMin), Math.abs(ph - phMax));
    if (phDist <= 0.5) score += 18;
    else if (phDist <= 1.0) score += 10;
    else score += 3;
  }

  // Nutrient match (5 pts each, 15 total)
  if (crop.nitrogenPref === nitrogen) score += 5;
  else score += 2;
  if (crop.phosphorusPref === phosphorus) score += 5;
  else score += 2;
  if (crop.potassiumPref === potassium) score += 5;
  else score += 2;

  // Rainfall match (15 pts)
  const [rainMin, rainMax] = crop.rainfallRange;
  if (rainfall >= rainMin && rainfall <= rainMax) {
    score += 15;
  } else {
    const rainDist = Math.min(
      Math.abs(rainfall - rainMin),
      Math.abs(rainfall - rainMax)
    );
    if (rainDist <= 5) score += 10;
    else if (rainDist <= 10) score += 5;
  }

  // Temperature match (15 pts)
  if (crop.tempRange === temp) {
    score += 15;
  } else {
    // Adjacent temp ranges get partial credit
    const tempAdjacent: Record<string, string[]> = {
      Cool: ["Moderate"],
      Moderate: ["Cool", "Warm"],
      Warm: ["Moderate"],
    };
    if ((tempAdjacent[temp] || []).includes(crop.tempRange)) {
      score += 8;
    }
  }

  return score;
}

function getRating(pct: number): {
  label: string;
  color: string;
  bg: string;
} {
  if (pct >= 80)
    return {
      label: "Ideal for your soil",
      color: "text-accent-400",
      bg: "bg-accent-500/20",
    };
  if (pct >= 60)
    return {
      label: "Good match",
      color: "text-yellow-400",
      bg: "bg-yellow-500/20",
    };
  return {
    label: "Consider",
    color: "text-orange-400",
    bg: "bg-orange-500/20",
  };
}

/* ─── Component ─── */

export default function CropRecommenderPage() {
  const [soilType, setSoilType] = useState("Sandy Loam");
  const [ph, setPh] = useState(5.8);
  const [nitrogen, setNitrogen] = useState("Medium");
  const [phosphorus, setPhosphorus] = useState("Medium");
  const [potassium, setPotassium] = useState("Medium");
  const [rainfall, setRainfall] = useState(40);
  const [temp, setTemp] = useState("Moderate");
  const [acreage, setAcreage] = useState(50);
  const [showResults, setShowResults] = useState(false);

  const results = CROPS.map((crop) => {
    const rawScore = scoreCrop(
      crop,
      soilType,
      ph,
      nitrogen,
      phosphorus,
      potassium,
      rainfall,
      temp
    );
    const pct = Math.round((rawScore / 100) * 100);
    return { crop, pct, rating: getRating(pct) };
  })
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowResults(true);
  }

  return (
    <>
      <GridBackground />
      {/* ── Hero ── */}
      <section className="section pt-32 pb-16">
        <div className="container-narrow text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/20 mb-6">
              <IconWheat className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-medium text-accent-400">
                Data-Driven Farming
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              What Should You{" "}
              <span className="text-accent-400">Grow?</span>
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto">
              Get personalized crop recommendations for your South Jersey
              farmland. Our data-driven tool matches your soil, climate, and
              acreage to the crops that will thrive on your land.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Input Form ── */}
      <section className="section py-12">
        <div className="container-narrow">
          <FadeIn>
            <form onSubmit={handleSubmit}>
              <div className="glass-card p-6 md:p-8">
                <div className="flex items-center gap-3 mb-8">
                  <IconTarget className="w-6 h-6 text-accent-400" />
                  <h2 className="text-2xl font-bold text-white">
                    Your Farm Profile
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Soil Type */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      <IconLeaf className="w-4 h-4 inline mr-2 text-accent-400" />
                      Soil Type
                    </label>
                    <select
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-primary-950/60 border border-white/10 text-white focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 transition-colors"
                    >
                      <option value="Sandy Loam">Sandy Loam</option>
                      <option value="Loam">Loam</option>
                      <option value="Clay Loam">Clay Loam</option>
                      <option value="Sandy">Sandy</option>
                      <option value="Peat/Muck">Peat/Muck</option>
                    </select>
                  </div>

                  {/* Soil pH */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      <IconDroplet className="w-4 h-4 inline mr-2 text-accent-400" />
                      Soil pH:{" "}
                      <span className="text-accent-400 font-bold">
                        {ph.toFixed(1)}
                      </span>
                    </label>
                    <input
                      type="range"
                      min="4.5"
                      max="8.0"
                      step="0.1"
                      value={ph}
                      onChange={(e) => setPh(parseFloat(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-primary-950/60 accent-accent-500"
                    />
                    <div className="flex justify-between text-xs text-white/30 mt-1">
                      <span>4.5 (Acidic)</span>
                      <span>6.5 (Neutral)</span>
                      <span>8.0 (Alkaline)</span>
                    </div>
                  </div>

                  {/* Nitrogen */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Nitrogen Level
                    </label>
                    <div className="flex gap-2">
                      {["Low", "Medium", "High"].map((level) => (
                        <button
                          type="button"
                          key={level}
                          onClick={() => setNitrogen(level)}
                          className={`flex-1 px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                            nitrogen === level
                              ? "bg-accent-500/20 border-accent-500 text-accent-400"
                              : "bg-primary-950/60 border-white/10 text-white/50 hover:border-white/30"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Phosphorus */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Phosphorus Level
                    </label>
                    <div className="flex gap-2">
                      {["Low", "Medium", "High"].map((level) => (
                        <button
                          type="button"
                          key={level}
                          onClick={() => setPhosphorus(level)}
                          className={`flex-1 px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                            phosphorus === level
                              ? "bg-accent-500/20 border-accent-500 text-accent-400"
                              : "bg-primary-950/60 border-white/10 text-white/50 hover:border-white/30"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Potassium */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Potassium Level
                    </label>
                    <div className="flex gap-2">
                      {["Low", "Medium", "High"].map((level) => (
                        <button
                          type="button"
                          key={level}
                          onClick={() => setPotassium(level)}
                          className={`flex-1 px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                            potassium === level
                              ? "bg-accent-500/20 border-accent-500 text-accent-400"
                              : "bg-primary-950/60 border-white/10 text-white/50 hover:border-white/30"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Annual Rainfall */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      <IconDroplet className="w-4 h-4 inline mr-2 text-accent-400" />
                      Annual Rainfall
                    </label>
                    <select
                      value={rainfall}
                      onChange={(e) => setRainfall(parseInt(e.target.value))}
                      className="w-full px-4 py-3 rounded-lg bg-primary-950/60 border border-white/10 text-white focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 transition-colors"
                    >
                      <option value={30}>30 inches</option>
                      <option value={35}>35 inches</option>
                      <option value={40}>40 inches</option>
                      <option value={45}>45 inches</option>
                      <option value={50}>50 inches</option>
                      <option value={55}>55 inches</option>
                      <option value={60}>60 inches</option>
                    </select>
                  </div>

                  {/* Temperature */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      <IconSun className="w-4 h-4 inline mr-2 text-accent-400" />
                      Avg Temperature Range
                    </label>
                    <select
                      value={temp}
                      onChange={(e) => setTemp(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-primary-950/60 border border-white/10 text-white focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 transition-colors"
                    >
                      <option value="Cool">Cool (55-65 F)</option>
                      <option value="Moderate">Moderate (65-75 F)</option>
                      <option value="Warm">Warm (75-85 F)</option>
                    </select>
                  </div>

                  {/* Acreage */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      <IconBarChart className="w-4 h-4 inline mr-2 text-accent-400" />
                      Available Acreage
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={acreage}
                      onChange={(e) =>
                        setAcreage(
                          Math.max(1, Math.min(1000, parseInt(e.target.value) || 1))
                        )
                      }
                      className="w-full px-4 py-3 rounded-lg bg-primary-950/60 border border-white/10 text-white focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 transition-colors"
                    />
                    <p className="text-xs text-white/30 mt-1">
                      1 - 1,000 acres
                    </p>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <button type="submit" className="btn-primary text-lg px-10 py-4">
                    Get Recommendations
                    <IconArrowRight className="w-5 h-5 inline ml-2" />
                  </button>
                </div>
              </div>
            </form>
          </FadeIn>
        </div>
      </section>

      {/* ── Results ── */}
      {showResults && (
        <section className="section py-12">
          <div className="container-narrow">
            <FadeIn>
              <div className="flex items-center gap-3 mb-8">
                <IconCheckCircle className="w-6 h-6 text-accent-400" />
                <h2 className="text-2xl font-bold text-white">
                  Top 5 Recommendations for Your {acreage}-Acre Farm
                </h2>
              </div>
            </FadeIn>

            <StaggerContainer className="space-y-6">
              {results.map(({ crop, pct, rating }, index) => (
                <StaggerItem key={crop.name}>
                  <div className="glass-card p-6 md:p-8 relative overflow-hidden">
                    {/* Rank badge */}
                    <div className="absolute top-0 right-0 bg-accent-500/10 border-l border-b border-accent-500/20 px-4 py-2 rounded-bl-lg">
                      <span className="text-accent-400 font-bold text-lg">
                        #{index + 1}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* Crop header */}
                      <div className="flex-shrink-0 text-center md:text-left">
                        <div className="text-5xl mb-2">{crop.emoji}</div>
                        <h3 className="text-xl font-bold text-white">
                          {crop.name}
                        </h3>
                        <div
                          className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${rating.bg} ${rating.color}`}
                        >
                          {rating.label}
                        </div>
                      </div>

                      {/* Details grid */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Match score */}
                        <div className="flex items-start gap-3">
                          <IconTarget className="w-5 h-5 text-accent-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-white/40 uppercase tracking-wider">
                              Match Score
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex-1 h-2 bg-primary-950/60 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-accent-500 rounded-full transition-all duration-700"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-accent-400 font-bold text-lg">
                                {pct}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Yield */}
                        <div className="flex items-start gap-3">
                          <IconBarChart className="w-5 h-5 text-accent-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-white/40 uppercase tracking-wider">
                              Expected Yield / Acre
                            </p>
                            <p className="text-white font-medium mt-1">
                              {crop.yieldPerAcre}
                            </p>
                          </div>
                        </div>

                        {/* Market value */}
                        <div className="flex items-start gap-3">
                          <IconDollar className="w-5 h-5 text-accent-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-white/40 uppercase tracking-wider">
                              Market Value / Acre
                            </p>
                            <p className="text-white font-medium mt-1">
                              {crop.marketValuePerAcre}
                            </p>
                          </div>
                        </div>

                        {/* Drone benefit */}
                        <div className="flex items-start gap-3 sm:col-span-2">
                          <IconWheat className="w-5 h-5 text-accent-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-white/40 uppercase tracking-wider">
                              AG Drones NJ Advantage
                            </p>
                            <p className="text-white/50 text-sm mt-1">
                              {crop.droneBenefit}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="section py-20">
        <div className="container-narrow">
          <FadeIn>
            <div className="glass-card p-8 md:p-12 text-center">
              <IconLeaf className="w-10 h-10 text-accent-400 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to grow?
              </h2>
              <p className="text-white/50 max-w-xl mx-auto mb-8">
                Our drones handle spraying, seeding, and crop monitoring for all
                these crops. Get a free aerial assessment of your farmland and a
                custom service plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn-primary text-lg px-8 py-4">
                  Get a Free Assessment
                  <IconArrowRight className="w-5 h-5 inline ml-2" />
                </Link>
                <Link href="/services" className="btn-secondary text-lg px-8 py-4">
                  View Our Services
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
