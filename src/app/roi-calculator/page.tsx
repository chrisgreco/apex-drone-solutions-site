"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GridBackground } from "@/components/ui/grid-background";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/FadeIn";
import { BeamDivider } from "@/components/Beam";
import {
  IconCalculator,
  IconDollar,
  IconDroplet,
  IconClock,
  IconBarChart,
  IconCheckCircle,
  IconArrowRight,
  IconDrone,
  IconTruck,
  IconNavigation,
  IconLeaf,
  IconTarget,
  IconZap,
  IconWheat,
} from "@/components/Icons";

/* ── Data ────────────────────────────────────────────── */

const cropDefaults: Record<string, number> = {
  Blueberries: 10,
  Cranberries: 8,
  Tomatoes: 15,
  Peppers: 12,
  Peaches: 12,
  Soybeans: 3,
  Other: 6,
};

const cropOptions = Object.keys(cropDefaults);

const sprayMethods = ["Ground rig", "Aerial (airplane)", "Manual/backpack"];

const comparisonData = [
  { feature: "Cost per acre", drone: "$15", ground: "$18-25", airplane: "$25-40", droneWins: true },
  { feature: "Soil compaction", drone: "None", ground: "Significant", airplane: "None", droneWins: true },
  { feature: "Spray precision", drone: "Sub-inch GPS", ground: "Low", airplane: "Very low", droneWins: true },
  { feature: "Speed (acres/hr)", drone: "30-50", ground: "10-20", airplane: "200+", droneWins: false },
  { feature: "Wet field access", drone: "Yes", ground: "No", airplane: "Yes", droneWins: true },
  { feature: "Chemical efficiency", drone: "95%+ on target", ground: "60-70%", airplane: "40-50%", droneWins: true },
  { feature: "Drift control", drone: "Excellent", ground: "Moderate", airplane: "Poor", droneWins: true },
  { feature: "Minimum acreage", drone: "Any size", ground: "5+ acres", airplane: "50+ acres", droneWins: true },
];

/* ── Component ───────────────────────────────────────── */

export default function ROICalculatorPage() {
  const [acres, setAcres] = useState(100);
  const [crop, setCrop] = useState("Blueberries");
  const [spraysPerSeason, setSpraysPerSeason] = useState(cropDefaults.Blueberries);
  const [method, setMethod] = useState("Ground rig");
  const [costPerAcre, setCostPerAcre] = useState(20);

  function handleCropChange(newCrop: string) {
    setCrop(newCrop);
    setSpraysPerSeason(cropDefaults[newCrop] ?? 6);
  }

  const results = useMemo(() => {
    const totalPasses = acres * spraysPerSeason;
    const droneCost = totalPasses * 15;
    const currentCost = totalPasses * costPerAcre;
    const annualSavings = currentCost - droneCost;
    const chemicalSavings = currentCost * 0.3;
    const totalValue = annualSavings + chemicalSavings;
    const roiPercent = currentCost > 0 ? (totalValue / currentCost) * 100 : 0;
    const timeSavedHours =
      method === "Manual/backpack"
        ? acres * spraysPerSeason * 0.5
        : method === "Ground rig"
          ? acres * spraysPerSeason * 0.15
          : acres * spraysPerSeason * 0.02;

    return {
      totalPasses,
      droneCost,
      currentCost,
      annualSavings,
      chemicalSavings,
      totalValue,
      roiPercent,
      timeSavedHours: Math.round(timeSavedHours),
    };
  }, [acres, spraysPerSeason, costPerAcre, method]);

  const fmt = (val: number) =>
    val >= 0
      ? `$${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
      : `-$${Math.abs(val).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────── */}
      <section className="relative bg-primary-950 overflow-hidden">
        <GridBackground />
        <div className="relative container-narrow mx-auto px-5 py-24 md:py-32">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // ROI Analysis
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.08] max-w-3xl">
              Calculate Your Drone Spraying{" "}
              <span className="text-accent-400">Savings</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-white/60 max-w-2xl">
              Input your farm parameters and watch real-time ROI projections update
              instantly. Precision data for precision agriculture.
            </p>
          </FadeIn>

          {/* HUD telemetry strip */}
          <motion.div
            className="mt-8 flex flex-wrap items-center gap-6 text-[10px] font-mono text-accent-400/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <span>SYS::ROI_ENGINE v2.4</span>
            <span className="w-1 h-1 rounded-full bg-accent-400/30" />
            <span>MODE: REAL_TIME</span>
            <span className="w-1 h-1 rounded-full bg-accent-400/30" />
            <span>REGION: SOUTH_NJ</span>
          </motion.div>
        </div>
      </section>

      <BeamDivider />

      {/* ─── Calculator ──────────────────────────────── */}
      <section className="bg-primary-950 py-16 md:py-24">
        <div className="container-narrow mx-auto px-5">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* ── Inputs Panel ── */}
            <FadeIn className="lg:col-span-2">
              <div className="relative bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-6 lg:p-8 sticky top-24 hud-corners">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-5 h-5 border-l-2 border-t-2 border-accent-400/30 rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-5 h-5 border-r-2 border-t-2 border-accent-400/30 rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-l-2 border-b-2 border-accent-400/30 rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-r-2 border-b-2 border-accent-400/30 rounded-br-2xl" />

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-accent-900/60 border border-accent-500/20 flex items-center justify-center text-accent-400">
                    <IconCalculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Farm Parameters</h2>
                    <p className="text-[10px] font-mono text-accent-400/40">INPUT_MODULE</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Acres */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">
                      Field Size <span className="text-accent-400/60 font-mono text-xs">(acres)</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={10}
                        max={2000}
                        step={10}
                        value={acres}
                        onChange={(e) => setAcres(Number(e.target.value))}
                        className="flex-1 accent-accent-400"
                      />
                      <input
                        type="number"
                        min={1}
                        max={10000}
                        value={acres}
                        onChange={(e) => setAcres(Math.max(1, Number(e.target.value)))}
                        className="w-20 bg-primary-900 border border-accent-500/20 text-white rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-400/40"
                      />
                    </div>
                  </div>

                  {/* Crop */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">
                      Crop Type
                    </label>
                    <select
                      value={crop}
                      onChange={(e) => handleCropChange(e.target.value)}
                      className="w-full bg-primary-900 border border-accent-500/20 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-400/40"
                    >
                      {cropOptions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sprays per season */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">
                      Sprays per Season
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={spraysPerSeason}
                      onChange={(e) => setSpraysPerSeason(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-primary-900 border border-accent-500/20 text-white rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-400/40"
                    />
                    <p className="text-xs text-white/30 mt-1 font-mono">
                      // Auto-set from crop profile. Override as needed.
                    </p>
                  </div>

                  {/* Method */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">
                      Current Spray Method
                    </label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="w-full bg-primary-900 border border-accent-500/20 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-400/40"
                    >
                      {sprayMethods.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Cost per acre */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">
                      Current Cost per Acre
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-400/60 text-sm font-mono">$</span>
                      <input
                        type="number"
                        min={1}
                        max={200}
                        value={costPerAcre}
                        onChange={(e) => setCostPerAcre(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-primary-900 border border-accent-500/20 text-white rounded-lg pl-7 pr-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-400/40"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* ── Results Panel ── */}
            <div className="lg:col-span-3 space-y-6">
              <FadeIn>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-2xl font-bold text-white">Analysis Output</h2>
                  <span className="text-[10px] font-mono text-accent-400/40">LIVE_FEED</span>
                </div>
                <p className="text-white/40 text-sm mb-6 font-mono">
                  {acres.toLocaleString()} ac / {crop.toLowerCase()} / {spraysPerSeason} passes
                </p>
              </FadeIn>

              {/* Result cards */}
              <StaggerContainer className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: <IconDollar className="w-5 h-5" />,
                    label: "Annual Savings",
                    value: fmt(results.annualSavings),
                    sub: `vs. ${method.toLowerCase()}`,
                    positive: results.annualSavings >= 0,
                  },
                  {
                    icon: <IconDroplet className="w-5 h-5" />,
                    label: "Chemical Reduction",
                    value: fmt(results.chemicalSavings),
                    sub: "30% less with precision application",
                    positive: true,
                  },
                  {
                    icon: <IconClock className="w-5 h-5" />,
                    label: "Time Saved",
                    value: `${results.timeSavedHours.toLocaleString()} hrs`,
                    sub: "Estimated hours saved per season",
                    positive: true,
                  },
                  {
                    icon: <IconBarChart className="w-5 h-5" />,
                    label: "ROI",
                    value: `${results.roiPercent.toFixed(0)}%`,
                    sub: "Total return on switching",
                    positive: results.roiPercent > 0,
                  },
                ].map((card, i) => (
                  <StaggerItem key={i}>
                    <div className="bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-6 hover:border-accent-400/30 hover:bg-white/[0.06] transition-all duration-300">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-accent-400">{card.icon}</span>
                        <span className="text-sm font-medium text-white/60">{card.label}</span>
                      </div>
                      <p className={`text-3xl font-bold font-mono ${card.positive ? "text-green-400" : "text-red-400"}`}>
                        {card.value}
                      </p>
                      <p className="text-xs text-white/30 mt-1 font-mono">
                        {card.sub}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {/* Cost Breakdown */}
              <FadeIn delay={0.2}>
                <div className="relative bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-6">
                  <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-accent-400/20 rounded-tl-2xl" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-accent-400/20 rounded-tr-2xl" />

                  <h3 className="text-lg font-semibold text-white mb-4">
                    Cost Breakdown
                    <span className="text-[10px] font-mono text-accent-400/40 ml-3">DETAILED_VIEW</span>
                  </h3>

                  <div className="space-y-0">
                    {[
                      { label: "Total spray passes", value: results.totalPasses.toLocaleString(), color: "text-white" },
                      { label: `Current annual cost (${method})`, value: fmt(results.currentCost), color: "text-white" },
                      { label: "Drone annual cost ($15/acre)", value: fmt(results.droneCost), color: "text-accent-400" },
                      { label: "Application savings", value: fmt(results.annualSavings), color: results.annualSavings >= 0 ? "text-green-400" : "text-red-400" },
                      { label: "Chemical savings (30% reduction)", value: fmt(results.chemicalSavings), color: "text-green-400" },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-center py-3 border-b border-white/[0.06]">
                        <span className="text-sm text-white/50">{row.label}</span>
                        <span className={`text-sm font-semibold font-mono ${row.color}`}>
                          {row.value}
                        </span>
                      </div>
                    ))}

                    <div className="flex justify-between items-center py-4 mt-1 bg-accent-900/40 rounded-lg px-4 -mx-1">
                      <span className="text-sm font-bold text-accent-300">Total annual value</span>
                      <span className="text-xl font-bold text-green-400 font-mono">
                        {fmt(results.totalValue)}
                      </span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <BeamDivider />

      {/* ─── Comparison Table ────────────────────────── */}
      <section className="bg-primary-900 py-16 md:py-24">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <div className="text-center mb-10">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
                // Method Comparison
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Drone vs. Traditional Spraying
              </h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider py-4 px-4 font-mono">
                      Feature
                    </th>
                    <th className="text-center py-4 px-4">
                      <div className="inline-flex items-center gap-2 bg-accent-900/60 border border-accent-500/30 rounded-lg px-4 py-2">
                        <IconDrone className="w-4 h-4 text-accent-400" />
                        <span className="text-sm font-semibold text-accent-300 font-mono">Drone</span>
                      </div>
                    </th>
                    <th className="text-center py-4 px-4">
                      <div className="inline-flex items-center gap-2 text-white/40">
                        <IconTruck className="w-4 h-4" />
                        <span className="text-sm font-medium font-mono">Ground</span>
                      </div>
                    </th>
                    <th className="text-center py-4 px-4">
                      <div className="inline-flex items-center gap-2 text-white/40">
                        <IconNavigation className="w-4 h-4" />
                        <span className="text-sm font-medium font-mono">Airplane</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, i) => (
                    <tr
                      key={i}
                      className={`border-t border-white/[0.06] ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}
                    >
                      <td className="text-sm text-white/70 font-medium py-4 px-4">
                        {row.feature}
                      </td>
                      <td className="text-center text-sm py-4 px-4">
                        <span className={`font-semibold font-mono ${row.droneWins ? "text-accent-400" : "text-white/70"}`}>
                          {row.drone}
                        </span>
                      </td>
                      <td className="text-center text-sm text-white/40 py-4 px-4 font-mono">
                        {row.ground}
                      </td>
                      <td className="text-center text-sm text-white/40 py-4 px-4 font-mono">
                        {row.airplane}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      <BeamDivider />

      {/* ─── Benefits ────────────────────────────────── */}
      <section className="bg-primary-950 py-16 md:py-24">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <div className="text-center mb-10">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
                // System Advantages
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Beyond the Cost Savings
              </h2>
            </div>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <IconTarget className="w-6 h-6" />, title: "Precision Application", desc: "RTK GPS guidance delivers sub-inch accuracy, putting every drop exactly where it needs to be." },
              { icon: <IconLeaf className="w-6 h-6" />, title: "Reduced Environmental Impact", desc: "30% less chemical usage means less runoff, less drift, and healthier surrounding ecosystems." },
              { icon: <IconZap className="w-6 h-6" />, title: "Wet Field Access", desc: "Spray after rain when ground rigs can't enter. Never miss a critical spray window again." },
              { icon: <IconWheat className="w-6 h-6" />, title: "Zero Crop Damage", desc: "No wheel tracks, no soil compaction, no crushed rows. Your crop stays untouched." },
              { icon: <IconClock className="w-6 h-6" />, title: "Faster Turnaround", desc: "Cover 30-50 acres per hour with rapid battery swaps. Same-day service available." },
              { icon: <IconBarChart className="w-6 h-6" />, title: "Detailed Reporting", desc: "GPS-logged flight data shows exactly where, when, and how much was applied." },
            ].map((item, i) => (
              <StaggerItem key={i}>
                <div className="bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-6 hover:border-accent-400/30 hover:bg-white/[0.06] transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-accent-900/60 border border-accent-500/20 flex items-center justify-center text-accent-400 mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <BeamDivider />

      {/* ─── CTA ─────────────────────────────────────── */}
      <section className="relative bg-primary-950 py-16 md:py-24 overflow-hidden">
        <GridBackground />
        <div className="relative container-narrow mx-auto px-5 text-center">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Initialize
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Start Saving?
            </h2>
            <p className="mt-4 text-white/50 max-w-xl mx-auto">
              Get a customized quote for your operation. We&apos;ll walk through the
              numbers together and build a spray plan for your season.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link
                href={`/contact?acres=${acres}&crop=${encodeURIComponent(crop)}&method=${encodeURIComponent(method)}`}
                className="inline-flex items-center gap-2 bg-accent-500 text-primary-950 font-semibold px-6 py-3 rounded-lg hover:bg-accent-400 transition-colors"
              >
                Get Your Custom Quote <IconArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/coverage"
                className="inline-flex items-center gap-2 border border-accent-500/30 text-accent-400 font-semibold px-6 py-3 rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                Check Service Area
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
