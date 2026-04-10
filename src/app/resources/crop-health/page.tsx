"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/FadeIn";
import { GridBackground } from "@/components/ui/grid-background";
import { BeamDivider } from "@/components/Beam";
import {
  IconBarChart,
  IconLeaf,
  IconDroplet,
  IconSun,
  IconTarget,
  IconArrowRight,
  IconCheckCircle,
  IconShield,
  IconZap,
  IconWheat,
} from "@/components/Icons";

/* ── Stress Factor Data ─────────────────────────────── */

interface StressFactor {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  visualSymptoms: string[];
  detectionMethod: { drone: string; ground: string };
  affectedNJCrops: string[];
  recommendedAction: string;
}

const stressFactors: StressFactor[] = [
  {
    id: "water",
    label: "Water Stress",
    icon: <IconDroplet className="w-5 h-5" />,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    description:
      "Drought or overwatering disrupts nutrient uptake and photosynthesis. In South Jersey's sandy soils, water stress can develop within 48 hours during summer heat waves.",
    visualSymptoms: [
      "Wilting or curling leaves",
      "Yellowing from leaf margins inward",
      "Premature leaf drop",
      "Stunted growth or fruit set",
    ],
    detectionMethod: {
      drone:
        "Thermal imaging detects canopy temperature differences 3-5 days before visible wilting. NDVI mapping shows declining vigor in stressed zones.",
      ground:
        "Soil moisture probes at fixed points, visual scouting of individual plants. Limited to sampled areas only.",
    },
    affectedNJCrops: ["Blueberries", "Peaches", "Tomatoes", "Cranberries"],
    recommendedAction:
      "Adjust irrigation scheduling based on drone-generated moisture maps. Target deficit zones with variable-rate irrigation to conserve water and prevent root rot.",
  },
  {
    id: "nutrient",
    label: "Nutrient Deficiency",
    icon: <IconLeaf className="w-5 h-5" />,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    description:
      "Nitrogen (N), Phosphorus (P), and Potassium (K) imbalances directly impact yield. NJ blueberry soils often run low in iron and magnesium due to high pH pockets.",
    visualSymptoms: [
      "N: Uniform yellowing of older leaves",
      "P: Purple/reddish discoloration",
      "K: Brown leaf edges (scorch)",
      "Fe: Interveinal chlorosis on new growth",
    ],
    detectionMethod: {
      drone:
        "Multispectral sensors measure chlorophyll content and leaf area index. Machine learning classifies deficiency type from spectral signatures with 87% accuracy.",
      ground:
        "Tissue sampling and lab analysis (5-7 day turnaround). Spot-checks miss spatial variability across fields.",
    },
    affectedNJCrops: ["Blueberries", "Soybeans", "Corn", "Tomatoes"],
    recommendedAction:
      "Generate variable-rate prescription maps from drone data. Apply targeted fertilizer only where needed, reducing input costs by 20-35% while improving uniformity.",
  },
  {
    id: "temperature",
    label: "Temperature Stress",
    icon: <IconSun className="w-5 h-5" />,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    description:
      "Heat stress above 90F and frost events below 32F can devastate NJ crops. Late spring frosts are the #1 risk for peach and blueberry growers in Burlington and Atlantic counties.",
    visualSymptoms: [
      "Heat: Sunscald on fruit, leaf curl",
      "Frost: Blackened flower buds, water-soaked tissue",
      "Reduced pollen viability",
      "Uneven ripening patterns",
    ],
    detectionMethod: {
      drone:
        "Thermal cameras map canopy temperature at sub-meter resolution. Identifies cold pockets and heat islands across topography for targeted frost/heat protection.",
      ground:
        "Weather station data gives single-point readings. Misses microclimates caused by terrain, windbreaks, and drainage patterns.",
    },
    affectedNJCrops: ["Peaches", "Blueberries", "Tomatoes", "Peppers"],
    recommendedAction:
      "Use drone thermal maps to position frost fans and shade cloth precisely. Post-event surveys quantify damage within hours for insurance documentation.",
  },
  {
    id: "disease",
    label: "Disease Pressure",
    icon: <IconShield className="w-5 h-5" />,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    description:
      "Fungal, bacterial, and viral pathogens spread exponentially once established. NJ's humid summers create ideal conditions for mummy berry, anthracnose, and brown rot.",
    visualSymptoms: [
      "Lesions, spots, or rings on foliage",
      "Fuzzy mold on fruit surfaces",
      "Cankers on stems and branches",
      "Wilting despite adequate moisture",
    ],
    detectionMethod: {
      drone:
        "RGB + multispectral analysis detects infected tissue 5-7 days before visible symptoms. AI models trained on 20k+ disease images classify pathogen type.",
      ground:
        "Walk-through scouting identifies symptomatic plants. By detection, the disease has typically spread to neighboring rows.",
    },
    affectedNJCrops: ["Blueberries", "Peaches", "Tomatoes", "Soybeans"],
    recommendedAction:
      "Schedule precision drone spraying within 24 hours of detection. Target only affected zones plus buffer areas, reducing fungicide use by 40-60%.",
  },
  {
    id: "pest",
    label: "Pest Damage",
    icon: <IconTarget className="w-5 h-5" />,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    description:
      "Spotted lanternfly, Japanese beetle, and spotted wing drosophila are the top invasive threats to NJ agriculture. Early detection prevents exponential population growth.",
    visualSymptoms: [
      "Chewed or skeletonized leaves",
      "Honeydew residue and sooty mold",
      "Entry holes in fruit",
      "Egg masses on trunks and equipment",
    ],
    detectionMethod: {
      drone:
        "High-resolution RGB cameras identify feeding damage patterns at scale. Thermal imaging spots pest aggregation hotspots by canopy temperature anomalies.",
      ground:
        "Trap counts and manual inspection. Labor-intensive and limited to trap placement locations.",
    },
    affectedNJCrops: ["Peaches", "Blueberries", "Soybeans", "Corn"],
    recommendedAction:
      "Map pest pressure zones and apply targeted insecticide via drone. Reduce broadcast spraying, protect beneficial insects, and cut chemical costs.",
  },
];

/* ── Timeline Data ──────────────────────────────────── */

const timelineSteps = [
  {
    day: "Day 0",
    label: "Stress Begins",
    description: "Cellular changes start. No visible signs. Plants compensate internally.",
    color: "bg-white/20",
    textColor: "text-white/60",
    dotColor: "bg-white/30",
    marker: "INVISIBLE",
  },
  {
    day: "Day 3-5",
    label: "Drone Detection",
    description:
      "Multispectral sensors detect spectral shifts in chlorophyll and water content. Thermal cameras show canopy temperature anomalies.",
    color: "bg-accent-500/30",
    textColor: "text-accent-400",
    dotColor: "bg-accent-400",
    marker: "DRONE CATCHES IT",
  },
  {
    day: "Day 7-10",
    label: "Visible Symptoms",
    description:
      "Yellowing, wilting, or lesions become visible to the naked eye. Farmer notices during routine scouting.",
    color: "bg-amber-500/30",
    textColor: "text-amber-400",
    dotColor: "bg-amber-400",
    marker: "FARMER NOTICES",
  },
  {
    day: "Day 14+",
    label: "Yield Loss",
    description:
      "Irreversible damage to fruit set, root systems, or canopy. Every day of delay costs measurable yield.",
    color: "bg-red-500/30",
    textColor: "text-red-400",
    dotColor: "bg-red-400",
    marker: "YIELD IMPACT",
  },
];

/* ── Monitoring Schedule Data ───────────────────────── */

const monitoringSchedule = [
  {
    crop: "Blueberries",
    frequency: "Every 2 weeks",
    season: "Apr - Aug",
    critical: "Bloom through harvest",
    note: "Increase to weekly if mummy berry detected",
  },
  {
    crop: "Peaches",
    frequency: "Monthly + post-storm",
    season: "Mar - Sep",
    critical: "Petal fall, pit hardening",
    note: "Add survey after any hail or >2\" rain event",
  },
  {
    crop: "Tomatoes",
    frequency: "Weekly",
    season: "Jun - Oct",
    critical: "Flowering through fruiting",
    note: "Late blight can destroy a field in 5 days",
  },
  {
    crop: "Soybeans",
    frequency: "Bi-weekly",
    season: "Jun - Oct",
    critical: "R1-R3 reproductive stages",
    note: "SDS and SCN detection saves entire fields",
  },
  {
    crop: "Corn",
    frequency: "Every 10 days",
    season: "May - Aug",
    critical: "V6 through VT (tasseling)",
    note: "Nitrogen variability mapping at V8 drives yield",
  },
];

/* ── Health Score Calculator ────────────────────────── */

function calculateHealthScore(factors: {
  moisture: number;
  nutrient: number;
  temperature: number;
  disease: number;
  pest: number;
}): { score: number; label: string; color: string; recommendations: string[] } {
  const weights = { moisture: 0.25, nutrient: 0.25, temperature: 0.15, disease: 0.2, pest: 0.15 };
  const score = Math.round(
    factors.moisture * weights.moisture +
      factors.nutrient * weights.nutrient +
      factors.temperature * weights.temperature +
      factors.disease * weights.disease +
      factors.pest * weights.pest
  );

  const recommendations: string[] = [];
  if (factors.moisture < 60) recommendations.push("Schedule irrigation audit and drone moisture mapping");
  if (factors.nutrient < 60) recommendations.push("Order tissue sampling + drone multispectral survey");
  if (factors.temperature < 60) recommendations.push("Review frost/heat protection infrastructure");
  if (factors.disease < 60) recommendations.push("Initiate preventive spray program with drone application");
  if (factors.pest < 60) recommendations.push("Deploy drone scouting to map pest pressure zones");
  if (recommendations.length === 0) recommendations.push("Maintain current monitoring schedule. Crop is healthy.");

  if (score >= 80) return { score, label: "Excellent", color: "text-accent-400", recommendations };
  if (score >= 60) return { score, label: "Good", color: "text-amber-400", recommendations };
  if (score >= 40) return { score, label: "At Risk", color: "text-orange-400", recommendations };
  return { score, label: "Critical", color: "text-red-400", recommendations };
}

/* ── Component ──────────────────────────────────────── */

export default function CropHealthPage() {
  const [activeStress, setActiveStress] = useState<string>("water");
  const [healthFactors, setHealthFactors] = useState({
    moisture: 75,
    nutrient: 80,
    temperature: 85,
    disease: 70,
    pest: 75,
  });

  const activeData = stressFactors.find((s) => s.id === activeStress)!;
  const healthResult = calculateHealthScore(healthFactors);

  function updateFactor(key: keyof typeof healthFactors, value: number) {
    setHealthFactors((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────── */}
      <section className="relative bg-primary-950 overflow-hidden">
        <GridBackground />
        <div className="relative container-narrow mx-auto px-5 py-24 md:py-32">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Crop Intelligence
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.08] max-w-3xl">
              Crop Health{" "}
              <span className="text-accent-400">Monitor</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-white/60 max-w-2xl">
              Understand crop stress before it&apos;s visible. Multispectral drone
              surveys detect problems 5-7 days earlier than the human eye, giving
              you time to act before yield is lost.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-[10px] font-mono text-accent-400/40">
              <span>SYS::CROP_HEALTH v3.1</span>
              <span className="w-1 h-1 rounded-full bg-accent-400/30" />
              <span>MODE: MONITORING</span>
              <span className="w-1 h-1 rounded-full bg-accent-400/30" />
              <span>SENSORS: MULTISPECTRAL + THERMAL</span>
            </div>
          </FadeIn>
        </div>
      </section>

      <BeamDivider />

      {/* ─── Stress Factor Dashboard ──────────────────── */}
      <section className="bg-primary-950 py-16 md:py-24">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Stress Factor Dashboard
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Identify the <span className="text-accent-400">Threat</span>
            </h2>
            <p className="text-white/50 max-w-2xl mb-10">
              Select a stress type to see how drone monitoring detects and addresses each
              threat to your crops. Based on crop health and environmental stress research data.
            </p>
          </FadeIn>

          {/* Stress type toggles */}
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap gap-3 mb-10">
              {stressFactors.map((sf) => (
                <button
                  key={sf.id}
                  onClick={() => setActiveStress(sf.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
                    activeStress === sf.id
                      ? `${sf.bgColor} ${sf.borderColor} ${sf.color}`
                      : "bg-white/[0.03] border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
                  }`}
                >
                  {sf.icon}
                  {sf.label}
                </button>
              ))}
            </div>
          </FadeIn>

          {/* Active stress detail card */}
          <FadeIn key={activeStress}>
            <div className={`glass-card ${activeData.borderColor} p-6 md:p-8`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-lg ${activeData.bgColor} ${activeData.borderColor} border flex items-center justify-center ${activeData.color}`}>
                  {activeData.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{activeData.label}</h3>
                  <p className="text-[10px] font-mono text-accent-400/40">STRESS_ANALYSIS</p>
                </div>
              </div>

              <p className="text-white/60 mb-8 leading-relaxed">{activeData.description}</p>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Visual Symptoms */}
                <div>
                  <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">
                    Visual Symptoms
                  </h4>
                  <ul className="space-y-2">
                    {activeData.visualSymptoms.map((symptom, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                        <IconCheckCircle className="w-4 h-4 text-white/20 mt-0.5 shrink-0" />
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Affected NJ Crops */}
                <div>
                  <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">
                    Affected NJ Crops
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {activeData.affectedNJCrops.map((crop) => (
                      <span
                        key={crop}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${activeData.bgColor} ${activeData.color} border ${activeData.borderColor}`}
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Detection Methods Comparison */}
              <div className="mt-8 grid md:grid-cols-2 gap-4">
                <div className="bg-accent-500/5 border border-accent-500/15 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <IconZap className="w-4 h-4 text-accent-400" />
                    <span className="text-sm font-semibold text-accent-400">Drone Detection</span>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {activeData.detectionMethod.drone}
                  </p>
                </div>
                <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <IconTarget className="w-4 h-4 text-white/40" />
                    <span className="text-sm font-semibold text-white/40">Ground Scouting</span>
                  </div>
                  <p className="text-sm text-white/40 leading-relaxed">
                    {activeData.detectionMethod.ground}
                  </p>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="mt-6 bg-accent-900/20 border border-accent-500/15 rounded-xl p-5">
                <h4 className="text-sm font-semibold text-accent-400 mb-2">Recommended Action</h4>
                <p className="text-sm text-white/60 leading-relaxed">{activeData.recommendedAction}</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <BeamDivider />

      {/* ─── Early Detection Timeline ─────────────────── */}
      <section className="bg-primary-950 py-16 md:py-24">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Early Detection Timeline
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The <span className="text-accent-400">5-Day</span> Advantage
            </h2>
            <p className="text-white/50 max-w-2xl mb-12">
              Drone monitoring detects crop stress days before it becomes visible. That window
              is the difference between a targeted treatment and a lost harvest.
            </p>
          </FadeIn>

          {/* Timeline visualization */}
          <div className="relative">
            {/* Progress bar background */}
            <FadeIn delay={0.1}>
              <div className="hidden md:block absolute top-[52px] left-0 right-0 h-2 rounded-full bg-white/5">
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: "100%",
                    background: "linear-gradient(to right, rgba(255,255,255,0.1) 0%, rgba(74,222,128,0.4) 25%, rgba(251,191,36,0.4) 60%, rgba(239,68,68,0.4) 100%)",
                  }}
                />
              </div>
            </FadeIn>

            <StaggerContainer className="grid md:grid-cols-4 gap-6 relative">
              {timelineSteps.map((step, i) => (
                <StaggerItem key={step.day}>
                  <div className="relative">
                    {/* Dot marker */}
                    <div className="flex items-center gap-3 mb-4 md:flex-col md:items-center md:gap-2">
                      <div className={`w-8 h-8 rounded-full ${step.dotColor} flex items-center justify-center z-10 relative`}>
                        <div className="w-3 h-3 rounded-full bg-primary-950" />
                      </div>
                      <span className={`text-xs font-mono font-bold ${step.textColor}`}>
                        {step.day}
                      </span>
                    </div>

                    {/* Card */}
                    <div className={`${step.color} border border-white/5 rounded-xl p-5`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`text-sm font-bold ${step.textColor}`}>{step.label}</h3>
                      </div>
                      <span
                        className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-full mb-3 ${
                          i === 1
                            ? "bg-accent-500/20 text-accent-400"
                            : i === 2
                              ? "bg-amber-500/20 text-amber-400"
                              : i === 3
                                ? "bg-red-500/20 text-red-400"
                                : "bg-white/10 text-white/40"
                        }`}
                      >
                        {step.marker}
                      </span>
                      <p className="text-xs text-white/40 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Arrow annotation */}
            <FadeIn delay={0.5}>
              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/20">
                  <IconZap className="w-4 h-4 text-accent-400" />
                  <span className="text-sm font-medium text-accent-400">
                    5-7 day head start with drone monitoring
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <BeamDivider />

      {/* ─── Monitoring Schedule ──────────────────────── */}
      <section className="bg-primary-950 py-16 md:py-24">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Monitoring Schedule
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Survey <span className="text-accent-400">Frequency</span> by Crop
            </h2>
            <p className="text-white/50 max-w-2xl mb-10">
              Recommended drone survey intervals for South Jersey&apos;s top crops. Timing
              aligned with critical growth stages and regional pest/disease pressure windows.
            </p>
          </FadeIn>

          <StaggerContainer className="space-y-4">
            {monitoringSchedule.map((item) => (
              <StaggerItem key={item.crop}>
                <div className="glass-card border-accent-500/10 hover:border-accent-500/25 p-5 md:p-6 transition-all duration-300">
                  <div className="grid md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3">
                      <div className="flex items-center gap-3">
                        <IconWheat className="w-5 h-5 text-accent-400" />
                        <div>
                          <h3 className="text-white font-bold">{item.crop}</h3>
                          <p className="text-[10px] font-mono text-accent-400/40">{item.season}</p>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-accent-500/15 text-accent-400 border border-accent-500/20">
                        {item.frequency}
                      </span>
                    </div>
                    <div className="md:col-span-3">
                      <p className="text-xs text-white/40">
                        <span className="text-white/60 font-medium">Critical:</span>{" "}
                        {item.critical}
                      </p>
                    </div>
                    <div className="md:col-span-4">
                      <p className="text-xs text-white/40 italic">{item.note}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <BeamDivider />

      {/* ─── Field Health Score ────────────────────────── */}
      <section className="bg-primary-950 py-16 md:py-24">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Field Health Score
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Rate Your <span className="text-accent-400">Field Health</span>
            </h2>
            <p className="text-white/50 max-w-2xl mb-10">
              Estimate your crop&apos;s overall health by rating each factor from 0 (critical) to 100
              (excellent). Get a weighted score with actionable recommendations.
            </p>
          </FadeIn>

          <div className="grid lg:grid-cols-5 gap-10">
            {/* Input panel */}
            <FadeIn delay={0.1} className="lg:col-span-2">
              <div className="relative bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-6 lg:p-8 sticky top-24">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-5 h-5 border-l-2 border-t-2 border-accent-400/30 rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-5 h-5 border-r-2 border-t-2 border-accent-400/30 rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-l-2 border-b-2 border-accent-400/30 rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-r-2 border-b-2 border-accent-400/30 rounded-br-2xl" />

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-accent-900/60 border border-accent-500/20 flex items-center justify-center text-accent-400">
                    <IconBarChart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Health Factors</h3>
                    <p className="text-[10px] font-mono text-accent-400/40">INPUT_MODULE</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {([
                    { key: "moisture" as const, label: "Moisture Level", icon: <IconDroplet className="w-4 h-4" /> },
                    { key: "nutrient" as const, label: "Nutrient Status", icon: <IconLeaf className="w-4 h-4" /> },
                    { key: "temperature" as const, label: "Temperature Tolerance", icon: <IconSun className="w-4 h-4" /> },
                    { key: "disease" as const, label: "Disease Resistance", icon: <IconShield className="w-4 h-4" /> },
                    { key: "pest" as const, label: "Pest Pressure", icon: <IconTarget className="w-4 h-4" /> },
                  ]).map(({ key, label, icon }) => (
                    <div key={key}>
                      <label className="flex items-center justify-between text-sm font-medium text-white/80 mb-1.5">
                        <span className="flex items-center gap-2">
                          <span className="text-accent-400/60">{icon}</span>
                          {label}
                        </span>
                        <span className="font-mono text-accent-400 text-xs">{healthFactors[key]}</span>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={healthFactors[key]}
                        onChange={(e) => updateFactor(key, Number(e.target.value))}
                        className="w-full accent-accent-400"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-white/20 mt-1">
                        <span>CRITICAL</span>
                        <span>EXCELLENT</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Results panel */}
            <FadeIn delay={0.2} className="lg:col-span-3">
              <div className="space-y-6">
                {/* Score display */}
                <div className="glass-card border-accent-500/10 p-8 text-center">
                  <p className="text-[10px] font-mono text-accent-400/40 mb-2">FIELD_HEALTH_INDEX</p>
                  <div className="relative inline-flex items-center justify-center mb-4">
                    <div className="w-36 h-36 rounded-full border-4 border-white/5 flex items-center justify-center relative">
                      {/* Score ring */}
                      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 144 144">
                        <circle
                          cx="72"
                          cy="72"
                          r="66"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="6"
                          strokeDasharray={`${(healthResult.score / 100) * 415} 415`}
                          strokeLinecap="round"
                          className={healthResult.color}
                          style={{ transition: "stroke-dasharray 0.5s ease" }}
                        />
                      </svg>
                      <div>
                        <span className={`text-4xl font-bold ${healthResult.color}`}>
                          {healthResult.score}
                        </span>
                        <span className="text-white/30 text-lg">/100</span>
                      </div>
                    </div>
                  </div>
                  <p className={`text-lg font-bold ${healthResult.color}`}>{healthResult.label}</p>
                </div>

                {/* Factor breakdown */}
                <div className="glass-card border-accent-500/10 p-6">
                  <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">
                    Factor Breakdown
                  </h4>
                  <div className="space-y-3">
                    {([
                      { key: "moisture" as const, label: "Moisture", weight: "25%" },
                      { key: "nutrient" as const, label: "Nutrients", weight: "25%" },
                      { key: "temperature" as const, label: "Temperature", weight: "15%" },
                      { key: "disease" as const, label: "Disease", weight: "20%" },
                      { key: "pest" as const, label: "Pest", weight: "15%" },
                    ]).map(({ key, label, weight }) => (
                      <div key={key}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-white/50">{label} <span className="text-white/20">({weight})</span></span>
                          <span className={`font-mono ${
                            healthFactors[key] >= 80
                              ? "text-accent-400"
                              : healthFactors[key] >= 60
                                ? "text-amber-400"
                                : healthFactors[key] >= 40
                                  ? "text-orange-400"
                                  : "text-red-400"
                          }`}>
                            {healthFactors[key]}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              healthFactors[key] >= 80
                                ? "bg-accent-400"
                                : healthFactors[key] >= 60
                                  ? "bg-amber-400"
                                  : healthFactors[key] >= 40
                                    ? "bg-orange-400"
                                    : "bg-red-400"
                            }`}
                            style={{ width: `${healthFactors[key]}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="glass-card border-accent-500/10 p-6">
                  <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">
                    Recommendations
                  </h4>
                  <ul className="space-y-3">
                    {healthResult.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/50">
                        <IconCheckCircle className="w-4 h-4 text-accent-400 mt-0.5 shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <BeamDivider />

      {/* ─── CTA ──────────────────────────────────────── */}
      <section className="bg-primary-950 py-16 md:py-24">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <div className="glass-card border-accent-500/15 p-8 md:p-12 text-center">
              <IconBarChart className="w-10 h-10 text-accent-400 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Stop Guessing. Start <span className="text-accent-400">Monitoring.</span>
              </h2>
              <p className="text-white/50 max-w-xl mx-auto mb-8">
                Schedule regular drone surveys and catch crop stress before it costs you yield.
                Our multispectral monitoring packages start at just $8/acre.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact" className="btn-primary">
                  Schedule a Survey
                  <IconArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/services" className="btn-secondary">
                  View Monitoring Plans
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
