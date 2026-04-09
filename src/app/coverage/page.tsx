"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GridBackground } from "@/components/ui/grid-background";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/FadeIn";
import { BeamDivider } from "@/components/Beam";
import {
  IconMapPin,
  IconWheat,
  IconLeaf,
  IconBarChart,
  IconGlobe,
  IconUsers,
  IconAward,
  IconArrowRight,
  IconCheckCircle,
  IconMail,
  IconStar,
  IconMap,
  IconDrone,
} from "@/components/Icons";

/* ── Data ────────────────────────────────────────────── */

const counties = [
  {
    name: "Burlington County",
    code: "BRL",
    topCrops: ["Blueberries", "Cranberries", "Vegetables"],
    farmlandAcres: "~70,000",
    farmCount: "700+",
    keyAreas: "Pemberton, Shamong, Tabernacle, Woodland Twp",
    highlight:
      "Home to the Pine Barrens blueberry and cranberry region. NJ's largest concentration of berry farms.",
    coord: "39.8731N, 74.6578W",
  },
  {
    name: "Cumberland County",
    code: "CMB",
    topCrops: ["Tomatoes", "Peppers", "Soybeans"],
    farmlandAcres: "~65,000",
    farmCount: "550+",
    keyAreas: "Bridgeton, Vineland, Upper Deerfield, Hopewell Twp",
    highlight:
      "Heart of South Jersey vegetable production. One of the most productive agricultural regions in the Northeast.",
    coord: "39.3284N, 75.1293W",
  },
  {
    name: "Salem County",
    code: "SLM",
    topCrops: ["Soybeans", "Corn", "Field crops"],
    farmlandAcres: "~97,000",
    farmCount: "600+",
    keyAreas: "Salem, Woodstown, Alloway, Pilesgrove",
    highlight:
      "Largest agricultural county in South Jersey by total farmland. Rich Delaware River floodplain soils.",
    coord: "39.5762N, 75.3590W",
  },
  {
    name: "Atlantic County",
    code: "ATL",
    topCrops: ["Blueberries", "Peaches", "Specialty crops"],
    farmlandAcres: "~45,000",
    farmCount: "400+",
    keyAreas: "Hammonton, Buena, Egg Harbor, Folsom",
    highlight:
      "Hammonton: 'Blueberry Capital of the World.' Growing specialty crop sector including wine grapes.",
    coord: "39.4697N, 74.6344W",
  },
];

const njStats = [
  { label: "Agricultural Output", value: "$1.5B" },
  { label: "Farmland Acres", value: "711K" },
  { label: "Active Farms", value: "10K+" },
];

/* ── Component ───────────────────────────────────────── */

export default function CoveragePage() {
  const [expansionForm, setExpansionForm] = useState({
    name: "",
    email: "",
    county: "",
    state: "NJ",
    acres: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleExpansionSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────── */}
      <section className="relative bg-primary-950 overflow-hidden">
        <GridBackground />
        <div className="relative container-narrow mx-auto px-5 py-24 md:py-32">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Service Area
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.08] max-w-3xl">
              Coverage <span className="text-accent-400">Zone</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-white/60 max-w-2xl">
              Operating across South Jersey&apos;s most productive agricultural
              corridor. Four counties. 277K+ farmland acres. Full drone coverage.
            </p>
          </FadeIn>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-6 text-[10px] font-mono text-accent-400/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <span>NAV::COVERAGE_MAP</span>
            <span className="w-1 h-1 rounded-full bg-accent-400/30" />
            <span>COUNTIES: 4</span>
            <span className="w-1 h-1 rounded-full bg-accent-400/30" />
            <span>STATUS: ACTIVE</span>
          </motion.div>
        </div>
      </section>

      <BeamDivider />

      {/* ─── Map ─────────────────────────────────────── */}
      <section className="bg-primary-950 py-16 md:py-24">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <div className="relative bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm overflow-hidden" style={{ minHeight: 520 }}>
              {/* HUD corners */}
              <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-accent-400/30 z-10" />
              <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-accent-400/30 z-10" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-accent-400/30 z-10" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-accent-400/30 z-10" />

              {/* Top HUD bar */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[10px] font-mono text-accent-400/50 z-10">
                <motion.span
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  MAP ONLINE
                </motion.span>
                <span className="w-1 h-1 rounded-full bg-accent-400/40" />
                <span>PROJ: NAD83</span>
                <span className="w-1 h-1 rounded-full bg-accent-400/40" />
                <span>ZOOM: 8x</span>
              </div>

              {/* NJ SVG Map */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative" style={{ width: 320, height: 440 }}>
                  <svg
                    viewBox="0 0 200 300"
                    className="w-full h-full"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Grid overlay */}
                    {Array.from({ length: 11 }).map((_, i) => (
                      <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="300" stroke="rgba(34,211,238,0.06)" strokeWidth="0.5" />
                    ))}
                    {Array.from({ length: 16 }).map((_, i) => (
                      <line key={`h${i}`} x1="0" y1={i * 20} x2="200" y2={i * 20} stroke="rgba(34,211,238,0.06)" strokeWidth="0.5" />
                    ))}

                    {/* NJ outline */}
                    <path
                      d="M120 10 C130 10, 150 20, 155 35 C160 50, 158 65, 150 80 C142 95, 130 110, 125 130 C120 150, 118 165, 120 180 C122 195, 130 210, 125 225 C120 240, 100 255, 90 265 C80 275, 65 280, 55 275 C45 270, 40 260, 45 245 C50 230, 60 215, 65 200 C70 185, 68 170, 60 155 C52 140, 45 130, 50 115 C55 100, 70 90, 80 75 C90 60, 95 45, 100 30 C105 15, 110 10, 120 10Z"
                      fill="rgba(34,211,238,0.04)"
                      stroke="rgba(34,211,238,0.25)"
                      strokeWidth="1.5"
                    />

                    {/* Southern service area highlight */}
                    <path
                      d="M125 130 C120 150, 118 165, 120 180 C122 195, 130 210, 125 225 C120 240, 100 255, 90 265 C80 275, 65 280, 55 275 C45 270, 40 260, 45 245 C50 230, 60 215, 65 200 C70 185, 68 170, 60 155 C52 140, 55 135, 70 130 C85 125, 110 128, 125 130Z"
                      fill="rgba(34,211,238,0.15)"
                      stroke="rgba(34,211,238,0.5)"
                      strokeWidth="2"
                      strokeDasharray="6 3"
                    />

                    {/* Pulsing dots at county centers */}
                    <motion.circle
                      cx="95" cy="155" r="3"
                      fill="rgba(34,211,238,0.8)"
                      animate={{ r: [3, 5, 3], opacity: [0.8, 0.4, 0.8] }}
                      transition={{ repeat: Infinity, duration: 2, delay: 0 }}
                    />
                    <motion.circle
                      cx="80" cy="210" r="3"
                      fill="rgba(74,222,128,0.8)"
                      animate={{ r: [3, 5, 3], opacity: [0.8, 0.4, 0.8] }}
                      transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                    />
                    <motion.circle
                      cx="58" cy="240" r="3"
                      fill="rgba(74,222,128,0.8)"
                      animate={{ r: [3, 5, 3], opacity: [0.8, 0.4, 0.8] }}
                      transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                    />
                    <motion.circle
                      cx="110" cy="180" r="3"
                      fill="rgba(34,211,238,0.8)"
                      animate={{ r: [3, 5, 3], opacity: [0.8, 0.4, 0.8] }}
                      transition={{ repeat: Infinity, duration: 2, delay: 1.5 }}
                    />
                  </svg>

                  {/* County HUD labels */}
                  <div className="absolute top-[36%] left-[18%]">
                    <div className="bg-primary-950/80 backdrop-blur-sm rounded px-2.5 py-1 border border-accent-500/20">
                      <span className="text-[10px] font-mono font-bold text-accent-400">BRL</span>
                      <span className="text-[9px] font-mono text-white/40 ml-1.5">Burlington</span>
                    </div>
                  </div>
                  <div className="absolute top-[58%] left-[30%]">
                    <div className="bg-primary-950/80 backdrop-blur-sm rounded px-2.5 py-1 border border-green-500/20">
                      <span className="text-[10px] font-mono font-bold text-green-400">CMB</span>
                      <span className="text-[9px] font-mono text-white/40 ml-1.5">Cumberland</span>
                    </div>
                  </div>
                  <div className="absolute top-[70%] left-[5%]">
                    <div className="bg-primary-950/80 backdrop-blur-sm rounded px-2.5 py-1 border border-green-500/20">
                      <span className="text-[10px] font-mono font-bold text-green-400">SLM</span>
                      <span className="text-[9px] font-mono text-white/40 ml-1.5">Salem</span>
                    </div>
                  </div>
                  <div className="absolute top-[42%] right-[2%]">
                    <div className="bg-primary-950/80 backdrop-blur-sm rounded px-2.5 py-1 border border-accent-500/20">
                      <span className="text-[10px] font-mono font-bold text-accent-400">ATL</span>
                      <span className="text-[9px] font-mono text-white/40 ml-1.5">Atlantic</span>
                    </div>
                  </div>

                  {/* Drone icon */}
                  <motion.div
                    className="absolute top-[48%] left-[38%] text-accent-400"
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    <IconDrone className="w-7 h-7" />
                  </motion.div>
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-primary-950/80 backdrop-blur-sm rounded-lg p-3 border border-accent-500/10 z-10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-3 h-2 rounded-sm bg-accent-400/30 border border-accent-400/50" />
                  <span className="text-[10px] font-mono text-white/60">Active Service Zone</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-2 rounded-sm bg-accent-400/10 border border-accent-400/20" />
                  <span className="text-[10px] font-mono text-white/40">State Boundary</span>
                </div>
              </div>

              {/* Badge */}
              <div className="absolute top-4 right-4 bg-primary-950/80 backdrop-blur-sm rounded-lg px-4 py-2.5 border border-accent-500/10 z-10">
                <p className="text-[10px] font-mono text-accent-400/60">
                  SECTORS: 4 &middot; ACRES: 277K+
                </p>
              </div>

              {/* Coordinate readout */}
              <motion.div
                className="absolute bottom-4 right-4 text-[9px] font-mono text-accent-400/30 z-10"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 4 }}
              >
                <div>LAT 39.7837 N</div>
                <div>LON 74.9723 W</div>
                <div>ALT 000 ft AGL</div>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </section>

      <BeamDivider />

      {/* ─── County Cards ────────────────────────────── */}
      <section className="bg-primary-900 py-16 md:py-24">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <div className="text-center mb-10">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
                // Sector Details
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Service Counties
              </h2>
            </div>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {counties.map((county, i) => (
              <StaggerItem key={i}>
                <div className="relative bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-6 h-full hover:border-accent-400/30 hover:bg-white/[0.06] transition-all duration-300">
                  {/* HUD corner */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-accent-400/20 rounded-tl-2xl" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-accent-400/20 rounded-tr-2xl" />

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-accent-400 bg-accent-900/60 border border-accent-500/20 px-2 py-0.5 rounded">
                          {county.code}
                        </span>
                        <h3 className="text-lg font-bold text-white">{county.name}</h3>
                      </div>
                      <p className="text-xs text-white/40 font-mono">{county.coord}</p>
                    </div>
                  </div>

                  <p className="text-sm text-white/50 leading-relaxed mb-4">
                    {county.highlight}
                  </p>

                  <p className="text-[10px] font-mono text-white/30 mb-2">{county.keyAreas}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-primary-950/60 rounded-lg p-3 border border-white/[0.04]">
                      <p className="text-[10px] font-mono text-accent-400/60 mb-0.5">FARMLAND</p>
                      <p className="text-lg font-bold text-white font-mono">{county.farmlandAcres}</p>
                      <p className="text-[10px] font-mono text-white/30">acres</p>
                    </div>
                    <div className="bg-primary-950/60 rounded-lg p-3 border border-white/[0.04]">
                      <p className="text-[10px] font-mono text-accent-400/60 mb-0.5">FARMS</p>
                      <p className="text-lg font-bold text-white font-mono">{county.farmCount}</p>
                      <p className="text-[10px] font-mono text-white/30">operations</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-mono text-white/30 mb-2">CROP_PROFILE</p>
                    <div className="flex flex-wrap gap-2">
                      {county.topCrops.map((crop, j) => (
                        <span
                          key={j}
                          className="inline-flex items-center gap-1 text-xs font-medium bg-accent-900/60 text-accent-300 border border-accent-800/30 px-2.5 py-1 rounded-full"
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <BeamDivider />

      {/* ─── NJ Stats Banner ─────────────────────────── */}
      <section className="bg-primary-950 py-14">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <div className="relative bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-8 md:p-10">
              <div className="absolute top-0 left-0 w-5 h-5 border-l-2 border-t-2 border-accent-400/30 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-5 h-5 border-r-2 border-t-2 border-accent-400/30 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-l-2 border-b-2 border-accent-400/30 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-r-2 border-b-2 border-accent-400/30 rounded-br-2xl" />

              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-6 font-mono text-center">
                // NJ Agriculture Intel
              </p>

              <div className="grid grid-cols-3 gap-6 md:gap-10">
                {njStats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-3xl md:text-5xl font-bold text-accent-400 font-mono">{stat.value}</p>
                    <p className="text-xs text-white/40 mt-2 font-mono uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <BeamDivider />

      {/* ─── Expansion Form ──────────────────────────── */}
      <section className="bg-primary-900 py-16 md:py-24">
        <div className="container-narrow mx-auto px-5">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <FadeIn>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
                // Expansion Queue
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Not in our current service area?
              </h2>
              <p className="mt-4 text-white/50 leading-relaxed">
                We&apos;re actively planning expansion into additional counties in
                New Jersey, Pennsylvania, and Delaware. Submit your interest and
                we&apos;ll prioritize areas with the most demand.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  "Priority notification when we expand to your area",
                  "Early-access pricing for first customers in new counties",
                  "Help shape our expansion roadmap",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-white/50">
                    <IconCheckCircle className="w-4 h-4 text-accent-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              {submitted ? (
                <div className="relative bg-accent-900/40 border border-accent-500/20 rounded-2xl p-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-accent-900/60 border border-accent-500/20 flex items-center justify-center mx-auto mb-4 text-accent-400">
                    <IconCheckCircle className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Interest Logged</h3>
                  <p className="text-sm text-white/50 mt-2 font-mono">
                    // You&apos;ll be notified when we expand to your area.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleExpansionSubmit}
                  className="relative bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-6 lg:p-8"
                >
                  <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-accent-400/20 rounded-tl-2xl" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-accent-400/20 rounded-tr-2xl" />

                  <h3 className="text-lg font-bold text-white mb-1">
                    Request Coverage
                  </h3>
                  <p className="text-[10px] font-mono text-accent-400/40 mb-5">EXPANSION_FORM</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1.5">Name</label>
                      <input
                        type="text"
                        required
                        value={expansionForm.name}
                        onChange={(e) => setExpansionForm({ ...expansionForm, name: e.target.value })}
                        className="w-full bg-primary-900 border border-accent-500/20 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-400/40 placeholder:text-white/20"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
                      <input
                        type="email"
                        required
                        value={expansionForm.email}
                        onChange={(e) => setExpansionForm({ ...expansionForm, email: e.target.value })}
                        className="w-full bg-primary-900 border border-accent-500/20 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-400/40 placeholder:text-white/20"
                        placeholder="you@farm.com"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1.5">County</label>
                        <input
                          type="text"
                          required
                          value={expansionForm.county}
                          onChange={(e) => setExpansionForm({ ...expansionForm, county: e.target.value })}
                          className="w-full bg-primary-900 border border-accent-500/20 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-400/40 placeholder:text-white/20"
                          placeholder="e.g. Gloucester"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1.5">State</label>
                        <select
                          value={expansionForm.state}
                          onChange={(e) => setExpansionForm({ ...expansionForm, state: e.target.value })}
                          className="w-full bg-primary-900 border border-accent-500/20 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-400/40"
                        >
                          <option value="NJ">New Jersey</option>
                          <option value="PA">Pennsylvania</option>
                          <option value="DE">Delaware</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1.5">
                        Approximate Acreage
                      </label>
                      <input
                        type="text"
                        value={expansionForm.acres}
                        onChange={(e) => setExpansionForm({ ...expansionForm, acres: e.target.value })}
                        className="w-full bg-primary-900 border border-accent-500/20 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-400/40 placeholder:text-white/20"
                        placeholder="e.g. 200"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-accent-500 text-primary-950 font-semibold py-3 rounded-lg hover:bg-accent-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <IconMail className="w-4 h-4" /> Submit Interest
                    </button>
                  </div>
                </form>
              )}
            </FadeIn>
          </div>
        </div>
      </section>

      <BeamDivider />

      {/* ─── CTA ─────────────────────────────────────── */}
      <section className="relative bg-primary-950 py-16 md:py-24 overflow-hidden">
        <GridBackground />
        <div className="relative container-narrow mx-auto px-5 text-center">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Engage
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              In Our Service Area? Let&apos;s Talk.
            </h2>
            <p className="mt-3 text-white/50 max-w-md mx-auto">
              Get a free assessment of your operation and see how drone spraying
              fits your farm.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-accent-500 text-primary-950 font-semibold px-6 py-3 rounded-lg hover:bg-accent-400 transition-colors"
              >
                Get a Free Quote <IconArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/roi-calculator"
                className="inline-flex items-center gap-2 border border-accent-500/30 text-accent-400 font-semibold px-6 py-3 rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                Calculate Your Savings
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
