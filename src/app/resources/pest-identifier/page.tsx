"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/FadeIn";
import { GridBackground } from "@/components/ui/grid-background";
import {
  IconTarget,
  IconShield,
  IconArrowRight,
  IconLeaf,
  IconCheckCircle,
  IconZap,
  IconDrone,
} from "@/components/Icons";

/* ── Types ───────────────────────────────────────────── */

type DamageType = "Chewing" | "Sucking" | "Boring" | "Root-feeding";
type DroneEffectiveness = "Yes" | "Partial" | "Preventive";

interface Pest {
  name: string;
  scientific: string;
  crops: string[];
  damageType: DamageType;
  threatLevel: 1 | 2 | 3 | 4 | 5;
  description: string;
  treatmentWindow: string;
  droneEffective: DroneEffectiveness;
  color: string;
}

/* ── Data ────────────────────────────────────────────── */

const pests: Pest[] = [
  {
    name: "Japanese Beetle",
    scientific: "Popillia japonica",
    crops: ["Grapes", "Roses", "Soybeans", "Corn"],
    damageType: "Chewing",
    threatLevel: 4,
    description:
      "Skeletonizes leaves by feeding between veins, leaving a lace-like pattern. Adults emerge mid-June through August. Larvae (grubs) feed on turf and crop roots, causing secondary damage below ground.",
    treatmentWindow: "Late June - Early July (adult emergence)",
    droneEffective: "Yes",
    color: "from-emerald-600/30 to-green-700/30",
  },
  {
    name: "Spotted Lanternfly",
    scientific: "Lycorma delicatula",
    crops: ["Grapes", "Fruit Trees", "Hardwoods", "Hops"],
    damageType: "Sucking",
    threatLevel: 5,
    description:
      "Invasive planthopper that feeds on plant sap, excreting honeydew that promotes sooty mold growth. Massive swarms can weaken and kill grapevines and fruit trees. NJ is a quarantine zone for this pest.",
    treatmentWindow: "May - June (nymph stage) & Sept - Nov (adults)",
    droneEffective: "Yes",
    color: "from-red-500/30 to-rose-600/30",
  },
  {
    name: "Aphids",
    scientific: "Aphidoidea spp.",
    crops: ["Peppers", "Tomatoes", "Lettuce", "Cucurbits"],
    damageType: "Sucking",
    threatLevel: 3,
    description:
      "Colonies cluster on new growth and leaf undersides, extracting phloem sap. Causes curling, yellowing, and stunted growth. Aphids also transmit viral diseases between plants, amplifying crop losses.",
    treatmentWindow: "Early spring at first colony sighting",
    droneEffective: "Yes",
    color: "from-lime-500/30 to-green-500/30",
  },
  {
    name: "Spider Mites",
    scientific: "Tetranychus urticae",
    crops: ["Tomatoes", "Strawberries", "Peppers", "Beans"],
    damageType: "Sucking",
    threatLevel: 3,
    description:
      "Tiny arachnids that pierce leaf cells and extract contents, causing stippling and bronzing. Fine webbing appears on leaf undersides in heavy infestations. Thrive in hot, dry conditions common in NJ summers.",
    treatmentWindow: "June - August (hot, dry periods)",
    droneEffective: "Partial",
    color: "from-orange-500/30 to-amber-600/30",
  },
  {
    name: "Corn Earworm",
    scientific: "Helicoverpa zea",
    crops: ["Corn", "Tomatoes", "Peppers", "Beans"],
    damageType: "Chewing",
    threatLevel: 4,
    description:
      "Larvae bore into corn ears through the silk channel, feeding on kernels from the tip down. Also attacks tomato and pepper fruit. One of the most economically damaging pests of sweet corn in the Mid-Atlantic.",
    treatmentWindow: "July - August (peak silk stage)",
    droneEffective: "Yes",
    color: "from-yellow-600/30 to-amber-700/30",
  },
  {
    name: "Tomato Hornworm",
    scientific: "Manduca quinquemaculata",
    crops: ["Tomatoes", "Peppers", "Eggplant", "Potatoes"],
    damageType: "Chewing",
    threatLevel: 3,
    description:
      "Large green caterpillars that can defoliate entire tomato plants rapidly. Feed on leaves, stems, and green fruit. Their camouflage makes them hard to spot until significant damage is done.",
    treatmentWindow: "June - August (larval stage)",
    droneEffective: "Preventive",
    color: "from-green-600/30 to-emerald-700/30",
  },
  {
    name: "Blueberry Maggot",
    scientific: "Rhagoletis mendax",
    crops: ["Blueberries"],
    damageType: "Boring",
    threatLevel: 5,
    description:
      "Female flies lay eggs inside ripening berries. Larvae tunnel through fruit flesh, causing premature drop and unmarketable fruit. Zero tolerance for this pest in commercial blueberry operations in NJ.",
    treatmentWindow: "Late June - July (pre-harvest)",
    droneEffective: "Yes",
    color: "from-blue-500/30 to-indigo-600/30",
  },
  {
    name: "Oriental Fruit Moth",
    scientific: "Grapholita molesta",
    crops: ["Peaches", "Nectarines", "Apples", "Cherries"],
    damageType: "Boring",
    threatLevel: 4,
    description:
      "Larvae bore into shoot tips in spring, then shift to fruit as it develops. Creates tunnels through peach flesh, often entering near the stem. Multiple generations per season in NJ's climate.",
    treatmentWindow: "April - May (first generation) & July (fruit entry)",
    droneEffective: "Preventive",
    color: "from-pink-500/30 to-rose-500/30",
  },
  {
    name: "Brown Marmorated Stink Bug",
    scientific: "Halyomorpha halys",
    crops: ["Peppers", "Tomatoes", "Peaches", "Soybeans"],
    damageType: "Sucking",
    threatLevel: 4,
    description:
      "Piercing-sucking mouthparts create dimpled, corky spots on fruit surfaces. Feeds on a huge range of crops and ornamentals. Invasive species that has become a major agricultural pest across NJ.",
    treatmentWindow: "June - September (crop damage window)",
    droneEffective: "Partial",
    color: "from-stone-500/30 to-stone-600/30",
  },
  {
    name: "Flea Beetles",
    scientific: "Chaetocnema spp.",
    crops: ["Eggplant", "Potatoes", "Brassicas", "Corn"],
    damageType: "Chewing",
    threatLevel: 2,
    description:
      "Tiny jumping beetles that chew small, round 'shot holes' in leaves. Heaviest damage to seedlings and transplants in spring. Larvae feed on roots underground. Can transmit bacterial wilt in some crops.",
    treatmentWindow: "May - June (seedling stage)",
    droneEffective: "Yes",
    color: "from-amber-500/30 to-yellow-600/30",
  },
  {
    name: "Cucumber Beetles",
    scientific: "Diabrotica spp.",
    crops: ["Cucumbers", "Melons", "Squash", "Pumpkins"],
    damageType: "Chewing",
    threatLevel: 3,
    description:
      "Striped and spotted species feed on leaves, flowers, and fruit of cucurbits. Major vector for bacterial wilt, which can kill entire vine crops. Adults emerge as transplants go into the field.",
    treatmentWindow: "May - June (transplant establishment)",
    droneEffective: "Yes",
    color: "from-yellow-500/30 to-lime-500/30",
  },
  {
    name: "Armyworms",
    scientific: "Spodoptera frugiperda",
    crops: ["Corn", "Soybeans", "Turf", "Small grains"],
    damageType: "Chewing",
    threatLevel: 4,
    description:
      "Caterpillars that feed in large groups, 'marching' across fields and consuming everything in their path. Can destroy entire corn fields overnight. Fall armyworm migrates north into NJ each summer.",
    treatmentWindow: "July - September (migration arrival)",
    droneEffective: "Yes",
    color: "from-green-700/30 to-emerald-800/30",
  },
];

const damageTypeColors: Record<DamageType, string> = {
  Chewing: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Sucking: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  Boring: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "Root-feeding": "text-orange-400 bg-orange-400/10 border-orange-400/20",
};

const droneColors: Record<DroneEffectiveness, string> = {
  Yes: "text-accent-400 bg-accent-500/10 border-accent-500/20",
  Partial: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Preventive: "text-blue-400 bg-blue-400/10 border-blue-400/20",
};

const threatColors = [
  "bg-green-400",
  "bg-lime-400",
  "bg-yellow-400",
  "bg-orange-400",
  "bg-red-400",
];

const damageSigns = [
  {
    sign: "Skeletonized Leaves",
    description:
      "Leaf tissue eaten between veins, leaving only the vein network. Indicates chewing insects like Japanese Beetles.",
    pests: ["Japanese Beetle", "Flea Beetles"],
  },
  {
    sign: "Curling & Yellowing",
    description:
      "New growth curls inward with yellow discoloration. Often caused by sap-feeding insects colonizing growing tips.",
    pests: ["Aphids", "Spider Mites"],
  },
  {
    sign: "Fruit Entry Holes",
    description:
      "Small puncture wounds or bore holes on fruit surfaces. Larvae tunnel inside, causing internal decay and fruit drop.",
    pests: ["Blueberry Maggot", "Oriental Fruit Moth", "Corn Earworm"],
  },
  {
    sign: "Honeydew & Sooty Mold",
    description:
      "Sticky residue on leaves with black fungal coating. Produced by sap-feeding insects that excrete excess sugars.",
    pests: ["Spotted Lanternfly", "Aphids"],
  },
  {
    sign: "Shot-Hole Damage",
    description:
      "Numerous small, round holes scattered across leaves, especially on young seedlings and transplants.",
    pests: ["Flea Beetles", "Cucumber Beetles"],
  },
  {
    sign: "Defoliation Trails",
    description:
      "Entire leaf sections stripped bare in widening swaths across a field. Sign of group-feeding caterpillars.",
    pests: ["Armyworms", "Tomato Hornworm"],
  },
];

/* ── Filter helpers ──────────────────────────────────── */

const allDamageTypes: DamageType[] = [
  "Chewing",
  "Sucking",
  "Boring",
  "Root-feeding",
];

/* ── Component ───────────────────────────────────────── */

export default function PestIdentifierPage() {
  const [activeFilter, setActiveFilter] = useState<DamageType | "All">("All");

  const filtered =
    activeFilter === "All"
      ? pests
      : pests.filter((p) => p.damageType === activeFilter);

  return (
    <>
      <GridBackground />

      {/* ─── Hero ─────────────────────────────────────── */}
      <section className="section relative">
        <div className="container-narrow mx-auto text-center">
          <FadeIn>
            <p className="text-accent-400 font-mono text-sm tracking-wider uppercase mb-4">
              // Pest Intelligence
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Pest <span className="text-accent-400">Identifier</span>
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Identify the 12 most common crop pests in the Mid-Atlantic
              region. Know their damage patterns, optimal treatment windows,
              and how drone spraying can protect your fields.
            </p>
          </FadeIn>

          {/* Filter pills */}
          <FadeIn delay={0.2}>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setActiveFilter("All")}
                className={`px-4 py-2 rounded-full text-sm font-mono transition-all duration-200 border ${
                  activeFilter === "All"
                    ? "bg-accent-500/20 text-accent-400 border-accent-500/40"
                    : "bg-white/5 text-white/40 border-white/10 hover:text-white/60 hover:border-white/20"
                }`}
              >
                All Pests
              </button>
              {allDamageTypes.map((dt) => (
                <button
                  key={dt}
                  onClick={() => setActiveFilter(dt)}
                  className={`px-4 py-2 rounded-full text-sm font-mono transition-all duration-200 border ${
                    activeFilter === dt
                      ? "bg-accent-500/20 text-accent-400 border-accent-500/40"
                      : "bg-white/5 text-white/40 border-white/10 hover:text-white/60 hover:border-white/20"
                  }`}
                >
                  {dt}
                </button>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Pest Cards Grid ──────────────────────────── */}
      <section className="section !pt-0 relative">
        <div className="container-narrow mx-auto">
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pest) => (
              <StaggerItem key={pest.name}>
                <div className="glass-card border-white/[0.06] hover:border-accent-500/20 p-6 transition-all duration-300 h-full flex flex-col">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${pest.color} flex items-center justify-center text-white`}
                    >
                      <IconTarget className="w-6 h-6" />
                    </div>
                    {/* Drone badge */}
                    <span
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${droneColors[pest.droneEffective]}`}
                    >
                      Drone: {pest.droneEffective}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-bold text-white mb-0.5">
                    {pest.name}
                  </h3>
                  <p className="text-xs text-white/30 italic font-mono mb-3">
                    {pest.scientific}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-white/50 leading-relaxed mb-4 flex-grow">
                    {pest.description}
                  </p>

                  {/* Threat level */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
                        Threat Level
                      </span>
                      <span className="text-[10px] font-mono text-white/40">
                        {pest.threatLevel}/5
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full ${
                            i < pest.threatLevel
                              ? threatColors[pest.threatLevel - 1]
                              : "bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Damage type badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${damageTypeColors[pest.damageType]}`}
                    >
                      {pest.damageType}
                    </span>
                  </div>

                  {/* Crop tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {pest.crops.map((crop) => (
                      <span
                        key={crop}
                        className="text-[10px] font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>

                  {/* Treatment window */}
                  <div className="mt-auto pt-3 border-t border-white/[0.06]">
                    <div className="flex items-start gap-2">
                      <IconZap className="w-3.5 h-3.5 text-accent-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-mono text-accent-400/60 uppercase tracking-wider mb-0.5">
                          Best Treatment Window
                        </p>
                        <p className="text-xs text-white/50">
                          {pest.treatmentWindow}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── Damage Signs ─────────────────────────────── */}
      <section className="section relative">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <div className="text-center mb-10">
              <p className="text-accent-400 font-mono text-sm tracking-wider uppercase mb-4">
                // Field Reconnaissance
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Damage <span className="text-accent-400">Signs</span>
              </h2>
              <p className="text-white/50 max-w-2xl mx-auto">
                Know what to look for when scouting your fields. Early
                identification means faster treatment and less crop loss.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {damageSigns.map((sign) => (
              <StaggerItem key={sign.sign}>
                <div className="glass-card border-white/[0.06] p-6 h-full">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                    <IconShield className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {sign.sign}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed mb-4">
                    {sign.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {sign.pests.map((p) => (
                      <span
                        key={p}
                        className="text-[10px] font-mono text-accent-400/70 bg-accent-500/10 px-2 py-0.5 rounded"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────── */}
      <section className="section relative">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <div className="glass-card border-accent-500/20 p-8 md:p-12 text-center">
              <div className="w-14 h-14 rounded-xl bg-accent-500/10 flex items-center justify-center mx-auto mb-6">
                <IconDrone className="w-8 h-8 text-accent-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Don&apos;t Let Pests Destroy Your Yield
              </h2>
              <p className="text-white/50 max-w-xl mx-auto mb-8">
                Precision drone spraying targets pests where they live with
                less chemical, less drift, and faster coverage than ground
                rigs. Schedule a treatment before the damage spreads.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn-primary">
                  Schedule Drone Treatment
                  <IconArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link href="/services" className="btn-secondary">
                  View Services
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Data Source ──────────────────────────────── */}
      <section className="section !pt-0 relative">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <div className="glass-card p-8 text-center">
              <p className="text-xs font-mono text-white/30 uppercase tracking-wider mb-3">
                Data Reference
              </p>
              <p className="text-sm text-white/40 max-w-3xl mx-auto">
                Pest profiles informed by Rutgers Cooperative Extension, USDA
                APHIS, NJ Department of Agriculture pest advisories, and the
                AgroPest-12 crop pest detection dataset. Treatment windows
                calibrated for USDA Zone 7a (South New Jersey).
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
