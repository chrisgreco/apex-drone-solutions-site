"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/FadeIn";
import { GridBackground } from "@/components/ui/grid-background";
import {
  IconLeaf,
  IconTarget,
  IconArrowRight,
  IconShield,
  IconDroplet,
  IconSun,
  IconCheckCircle,
} from "@/components/Icons";

/* ────────────────────────────────────────── */
/*  Types                                     */
/* ────────────────────────────────────────── */

type Severity = "Low" | "Medium" | "High" | "Critical";

interface Disease {
  name: string;
  crops: string[];
  severity: Severity;
  color: string;
  description: string;
  signs: string[];
  sprayTiming: string;
}

/* ────────────────────────────────────────── */
/*  Filter crops                              */
/* ────────────────────────────────────────── */

const CROP_FILTERS = [
  "All",
  "Blueberry",
  "Peach",
  "Tomato",
  "Pepper",
  "Apple",
  "Grape",
  "Corn",
  "Soybean",
] as const;

/* ────────────────────────────────────────── */
/*  Disease data                              */
/* ────────────────────────────────────────── */

const diseases: Disease[] = [
  {
    name: "Early Blight",
    crops: ["Tomato", "Pepper"],
    severity: "High",
    color: "bg-amber-800",
    description:
      "Caused by Alternaria solani, early blight produces dark concentric rings on lower leaves first. Left unchecked it defoliates plants and reduces yields by up to 50%.",
    signs: [
      "Dark brown spots with concentric rings (target pattern)",
      "Yellowing leaves starting from the bottom",
      "Stem lesions near the soil line",
    ],
    sprayTiming: "Apply fungicide at first sign of spots, typically mid-June through August.",
  },
  {
    name: "Late Blight",
    crops: ["Tomato", "Pepper"],
    severity: "Critical",
    color: "bg-red-900",
    description:
      "The same pathogen (Phytophthora infestans) that caused the Irish Potato Famine. Spreads explosively in cool, wet weather and can destroy a field in days.",
    signs: [
      "Water-soaked gray-green lesions on leaves",
      "White fuzzy mold on leaf undersides in humid conditions",
      "Dark, firm rot on fruit",
    ],
    sprayTiming: "Preventive sprays before rainy periods; immediate treatment at first detection.",
  },
  {
    name: "Powdery Mildew",
    crops: ["Grape", "Apple", "Pepper"],
    severity: "Medium",
    color: "bg-gray-300",
    description:
      "A white, powdery fungal coating that thrives in warm, dry days with cool nights. Reduces photosynthesis and weakens vines and trees over the season.",
    signs: [
      "White powdery patches on leaf surfaces",
      "Curling or distorted new growth",
      "Premature leaf drop",
    ],
    sprayTiming: "Begin applications at bud break; repeat every 10-14 days through fruit set.",
  },
  {
    name: "Downy Mildew",
    crops: ["Grape", "Soybean"],
    severity: "High",
    color: "bg-yellow-700",
    description:
      "Plasmopara viticola attacks leaves, shoots, and fruit clusters. It favors wet springs and can devastate untreated vineyards in a single season.",
    signs: [
      "Oily yellow-green spots on upper leaf surface",
      "White-gray downy growth on leaf undersides",
      "Brown, shriveled fruit clusters",
    ],
    sprayTiming: "Apply before bloom when shoots are 6-10 inches; repeat after rain events.",
  },
  {
    name: "Anthracnose",
    crops: ["Blueberry", "Grape", "Peach"],
    severity: "High",
    color: "bg-rose-800",
    description:
      "Colletotrichum species cause sunken, dark lesions on ripe fruit. Warm, humid conditions accelerate spore production and fruit rot during harvest.",
    signs: [
      "Sunken, circular lesions on ripe fruit",
      "Salmon-pink spore masses in wet weather",
      "Twig dieback on woody plants",
    ],
    sprayTiming: "Spray at bloom and pre-harvest; critical during warm, rainy stretches.",
  },
  {
    name: "Bacterial Spot",
    crops: ["Tomato", "Pepper", "Peach"],
    severity: "High",
    color: "bg-amber-900",
    description:
      "Xanthomonas bacteria cause water-soaked spots that turn brown and papery. Splashing rain spreads the pathogen rapidly through fields.",
    signs: [
      "Small, dark, water-soaked spots on leaves",
      "Raised, scab-like lesions on fruit",
      "Shot-hole appearance as leaf tissue falls out",
    ],
    sprayTiming: "Copper sprays before symptoms appear; treat after storms in warm weather.",
  },
  {
    name: "Cedar Apple Rust",
    crops: ["Apple"],
    severity: "Medium",
    color: "bg-orange-600",
    description:
      "Gymnosporangium juniperi-virginianae alternates between cedar and apple hosts. Bright orange spots on apple leaves reduce tree vigor and fruit quality.",
    signs: [
      "Bright yellow-orange spots on upper leaf surfaces",
      "Tube-like projections on leaf undersides",
      "Gelatinous orange galls on nearby cedar trees in spring",
    ],
    sprayTiming: "Fungicide at pink bud through petal fall; 3-4 applications total.",
  },
  {
    name: "Gray Mold (Botrytis)",
    crops: ["Blueberry", "Grape", "Peach"],
    severity: "High",
    color: "bg-stone-500",
    description:
      "Botrytis cinerea is the most common post-harvest rot in NJ. Cool, damp conditions during bloom cause blossom blight and later fruit rot.",
    signs: [
      "Gray, fuzzy mold on flowers or ripening fruit",
      "Brown, water-soaked tissue beneath mold",
      "Wilting and collapse of flower clusters",
    ],
    sprayTiming: "Apply at early bloom and again at full bloom; critical in wet springs.",
  },
  {
    name: "Mummy Berry",
    crops: ["Blueberry"],
    severity: "Critical",
    color: "bg-neutral-700",
    description:
      "Monilinia vaccinii-corymbosi is the most economically important blueberry disease in NJ. Infected berries shrivel into hard, gray 'mummies' that overwinter on the ground.",
    signs: [
      "Wilted, brown shoot tips in early spring",
      "Berries that turn salmon-pink, then gray and hard",
      "Shriveled mummified berries on the ground or bush",
    ],
    sprayTiming: "First spray at green tip; repeat at 10% bloom and full bloom.",
  },
  {
    name: "Phomopsis",
    crops: ["Blueberry", "Grape"],
    severity: "Medium",
    color: "bg-amber-700",
    description:
      "Phomopsis vaccinii causes twig blight and fruit rot in blueberries. Wet spring weather drives infection through wounds and natural openings.",
    signs: [
      "Brown, wilted shoot tips with visible cankers",
      "Small dark spots on green fruit",
      "Soft rot and shriveling at harvest",
    ],
    sprayTiming: "Spray at bud swell and green tip; additional applications if rain persists.",
  },
  {
    name: "Brown Rot",
    crops: ["Peach", "Apple"],
    severity: "Critical",
    color: "bg-yellow-900",
    description:
      "Monilinia fructicola is the primary stone fruit disease in NJ. It can destroy an entire peach crop in warm, humid summers within days of harvest.",
    signs: [
      "Soft, brown expanding lesions on ripe fruit",
      "Tan powdery spore tufts on fruit surface",
      "Mummified fruit hanging on tree branches",
    ],
    sprayTiming: "Pre-bloom through petal fall, then again 2-3 weeks before harvest.",
  },
  {
    name: "Leaf Scorch",
    crops: ["Blueberry", "Soybean"],
    severity: "Medium",
    color: "bg-red-700",
    description:
      "Caused by Xylella fastidiosa bacteria spread by sharpshooter leafhoppers. Infected plants show marginal leaf burn and gradual decline over years.",
    signs: [
      "Browning and drying of leaf margins",
      "Reddish discoloration in blueberry leaves",
      "Reduced vigor and smaller fruit over multiple seasons",
    ],
    sprayTiming: "No direct spray cure; control leafhoppers early in the season to prevent spread.",
  },
  {
    name: "Cercospora Leaf Spot",
    crops: ["Blueberry", "Soybean", "Corn"],
    severity: "Medium",
    color: "bg-purple-900",
    description:
      "Cercospora species cause small purple-bordered spots that expand and coalesce. Heavy infections cause premature defoliation and weaken plants for winter.",
    signs: [
      "Small spots with purple-red borders and tan centers",
      "Coalescing spots leading to large dead areas",
      "Premature leaf yellowing and drop",
    ],
    sprayTiming: "Apply fungicide when spots first appear, typically mid-summer; repeat in 14 days.",
  },
  {
    name: "Septoria Leaf Spot",
    crops: ["Tomato"],
    severity: "High",
    color: "bg-amber-600",
    description:
      "Septoria lycopersici starts on lower leaves and works upward. One of the most common tomato diseases in NJ, it thrives in warm, wet weather.",
    signs: [
      "Many small circular spots with dark borders and gray centers",
      "Tiny black dots (pycnidia) visible in spot centers",
      "Progressive defoliation from bottom up",
    ],
    sprayTiming: "Begin sprays when first spots appear on lower leaves; repeat every 7-10 days.",
  },
  {
    name: "Northern Corn Leaf Blight",
    crops: ["Corn"],
    severity: "High",
    color: "bg-emerald-800",
    description:
      "Exserohilum turcicum produces large cigar-shaped lesions on corn leaves. Severe infections during tasseling can reduce yields by 30% or more.",
    signs: [
      "Long, elliptical gray-green lesions (1-6 inches)",
      "Lesions running parallel to leaf veins",
      "Lower leaves affected first, moving upward",
    ],
    sprayTiming: "Apply fungicide at VT (tasseling) if lesions reach the ear leaf or above.",
  },
  {
    name: "Sudden Death Syndrome",
    crops: ["Soybean"],
    severity: "Critical",
    color: "bg-teal-900",
    description:
      "Fusarium virguliforme attacks soybean roots in cool, wet soils. Above-ground symptoms appear suddenly during pod fill, causing dramatic yield loss.",
    signs: [
      "Interveinal yellowing and browning of upper leaves",
      "Leaves drop but petioles remain attached to stem",
      "Blue-gray fungal growth on root surface",
    ],
    sprayTiming: "Seed treatments at planting; foliar fungicides are ineffective for this disease.",
  },
  {
    name: "Frogeye Leaf Spot",
    crops: ["Soybean"],
    severity: "Medium",
    color: "bg-slate-600",
    description:
      "Cercospora sojina creates distinctive eye-shaped lesions on soybean foliage. Warm, humid conditions in July and August favor rapid disease development.",
    signs: [
      "Circular spots with gray centers and dark reddish-brown borders",
      "Spots that resemble a frog's eye",
      "Lesions on leaves, stems, and pods",
    ],
    sprayTiming: "Apply fungicide at R3 (beginning pod) if threshold is exceeded; scout weekly.",
  },
  {
    name: "Black Rot",
    crops: ["Apple", "Grape"],
    severity: "High",
    color: "bg-zinc-900",
    description:
      "Guignardia bidwellii (grape) and Botryosphaeria obtusa (apple) cause fruit mummification and leaf spots. Infected fruit becomes unmarketable.",
    signs: [
      "Reddish-brown circular leaf spots (apple)",
      "Light brown spots that darken and shrivel grapes",
      "Hard, black mummified fruit",
    ],
    sprayTiming: "Spray from bud break through 4-5 weeks after bloom; sanitation is critical.",
  },
];

/* ────────────────────────────────────────── */
/*  Helpers                                   */
/* ────────────────────────────────────────── */

const severityConfig: Record<Severity, { badge: string; text: string }> = {
  Low: { badge: "bg-green-500/20 text-green-400 border-green-500/30", text: "Low" },
  Medium: { badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", text: "Medium" },
  High: { badge: "bg-orange-500/20 text-orange-400 border-orange-500/30", text: "High" },
  Critical: { badge: "bg-red-500/20 text-red-400 border-red-500/30", text: "Critical" },
};

/* ────────────────────────────────────────── */
/*  Page component                            */
/* ────────────────────────────────────────── */

export default function CropDiseaseGuidePage() {
  const [activeCrop, setActiveCrop] = useState<string>("All");

  const filtered =
    activeCrop === "All"
      ? diseases
      : diseases.filter((d) => d.crops.includes(activeCrop));

  return (
    <>
      <GridBackground />

      {/* Hero */}
      <section className="section relative">
        <div className="container-narrow mx-auto text-center">
          <FadeIn>
            <p className="text-accent-400 font-mono text-sm tracking-wider uppercase mb-4">
              Agricultural Reference
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Crop Disease{" "}
              <span className="text-accent-400">Guide</span>
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Identify diseases affecting New Jersey crops with our visual
              reference. 18 common diseases across blueberries, peaches,
              tomatoes, grapes, corn, soybeans, and more — with treatment
              timing so you know exactly when to call for drone spraying.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="section !pt-0 relative">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <div className="glass-card p-4 flex flex-wrap items-center gap-2 justify-center">
              <span className="text-xs font-mono text-white/30 uppercase tracking-wider mr-2">
                Filter by crop:
              </span>
              {CROP_FILTERS.map((crop) => (
                <button
                  key={crop}
                  onClick={() => setActiveCrop(crop)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCrop === crop
                      ? "bg-accent-500 text-white shadow-lg shadow-accent-500/25"
                      : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Disease Cards Grid */}
      <section className="section !pt-0 relative">
        <div className="container-narrow mx-auto">
          {filtered.length === 0 ? (
            <FadeIn>
              <div className="glass-card p-12 text-center">
                <IconLeaf className="w-10 h-10 text-white/20 mx-auto mb-4" />
                <p className="text-white/40">
                  No diseases found for this crop filter.
                </p>
              </div>
            </FadeIn>
          ) : (
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((disease) => (
                <StaggerItem key={disease.name}>
                  <div className="glass-card border-white/5 hover:border-accent-500/30 p-0 transition-all duration-300 hover:translate-y-[-2px] overflow-hidden flex flex-col h-full">
                    {/* Color placeholder */}
                    <div
                      className={`${disease.color} h-28 w-full flex items-center justify-center relative`}
                    >
                      <IconLeaf className="w-10 h-10 text-white/30" />
                      <div className="absolute top-3 right-3">
                        <span
                          className={`text-xs font-mono px-2 py-0.5 rounded-full border ${severityConfig[disease.severity].badge}`}
                        >
                          {severityConfig[disease.severity].text}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      {/* Name */}
                      <h3 className="text-lg font-bold text-white mb-2">
                        {disease.name}
                      </h3>

                      {/* Crop tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {disease.crops.map((crop) => (
                          <span
                            key={crop}
                            className="text-[11px] font-mono bg-accent-500/10 text-accent-400/70 px-2 py-0.5 rounded-full"
                          >
                            {crop}
                          </span>
                        ))}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-white/50 leading-relaxed mb-4">
                        {disease.description}
                      </p>

                      {/* Signs to watch */}
                      <div className="mb-4 flex-1">
                        <p className="text-xs font-mono text-white/30 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <IconTarget className="w-3.5 h-3.5" />
                          Signs to Watch
                        </p>
                        <ul className="space-y-1.5">
                          {disease.signs.map((sign, i) => (
                            <li
                              key={i}
                              className="text-xs text-white/40 flex items-start gap-2"
                            >
                              <IconCheckCircle className="w-3.5 h-3.5 text-accent-500/50 mt-0.5 shrink-0" />
                              <span>{sign}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Spray timing */}
                      <div className="border-t border-white/5 pt-3 mt-auto">
                        <p className="text-xs font-mono text-white/30 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <IconDroplet className="w-3.5 h-3.5" />
                          When to Spray
                        </p>
                        <p className="text-xs text-white/50 leading-relaxed">
                          {disease.sprayTiming}
                        </p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {/* Result count */}
          <FadeIn>
            <p className="text-center text-xs text-white/20 font-mono mt-6">
              Showing {filtered.length} of {diseases.length} diseases
              {activeCrop !== "All" && ` affecting ${activeCrop}`}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section relative">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <div className="glass-card p-8 md:p-12 text-center">
              <div className="w-14 h-14 rounded-full bg-accent-500/20 flex items-center justify-center mx-auto mb-6">
                <IconShield className="w-7 h-7 text-accent-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Spotted Something on Your Crops?
              </h2>
              <p className="text-white/50 max-w-xl mx-auto mb-8 leading-relaxed">
                Our drone spraying service can treat your fields fast.
                Precision application means less chemical, better coverage,
                and no crop damage from heavy equipment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn-primary">
                  Get a Free Assessment
                  <IconArrowRight className="w-4 h-4 ml-2 inline-block" />
                </Link>
                <Link href="/services" className="btn-secondary">
                  View Spray Services
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Data Sources */}
      <section className="section !pt-0 relative">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <div className="glass-card p-8 text-center">
              <p className="text-xs font-mono text-white/30 uppercase tracking-wider mb-3">
                Data Sources
              </p>
              <p className="text-sm text-white/40 max-w-3xl mx-auto">
                Disease information compiled from the 20k+ Multi-Class Crop
                Disease Images dataset, Crop Pest and Disease Detection
                research, Rutgers Cooperative Extension plant pathology
                guides, and USDA agricultural research publications.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
