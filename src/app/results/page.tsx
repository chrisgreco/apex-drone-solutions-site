"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GridBackground } from "@/components/ui/grid-background";
import { HudOverlay } from "@/components/ui/hud-overlay";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/FadeIn";
import { BeamDivider } from "@/components/Beam";
import {
  IconTarget,
  IconArrowRight,
  IconCheckCircle,
  IconDroplet,
  IconDollar,
  IconStar,
  IconDrone,
  IconClock,
  IconBarChart,
  IconLeaf,
  IconZap,
  IconWheat,
  IconMapPin,
  IconAward,
} from "@/components/Icons";

/* ── Data ────────────────────────────────────────────── */

const keyMetrics = [
  { value: "500K+", label: "Acres Sprayed", unit: "ac" },
  { value: "30%", label: "Avg Chemical Savings", unit: "reduction" },
  { value: "100%", label: "Coverage Accuracy", unit: "on target" },
  { value: "24hr", label: "Report Delivery", unit: "turnaround" },
];

const caseStudies = [
  {
    title: "Blueberry Farm",
    location: "Burlington County",
    code: "BRL-0042",
    acreage: "120 acres",
    passes: "10 spray passes/season",
    challenge:
      "Ground rig couldn't reach interior rows of mature blueberry bushes. Outer rows received excessive spray while interior plants remained unprotected, leading to inconsistent fungicide coverage and recurring mummy berry outbreaks.",
    solution:
      "Deployed DJI T25 fleet with precision nozzle calibration. Flew at optimal height above canopy for uniform coverage across all rows, including previously inaccessible interior sections.",
    before: [
      "Inconsistent canopy coverage",
      "Recurring mummy berry infection",
      "Chemical waste on outer rows",
    ],
    after: [
      { label: "Fungicide Reduction", value: "35%", positive: true },
      { label: "Coverage", value: "Full canopy", positive: true },
      { label: "Annual Savings", value: "$18,000", positive: true },
      { label: "Mummy Berry", value: "Eliminated", positive: true },
    ],
  },
  {
    title: "Vegetable Operation",
    location: "Cumberland County",
    code: "CMB-0087",
    acreage: "200 acres (tomatoes & peppers)",
    passes: "12-15 spray passes/season",
    challenge:
      "Heavy rain created saturated field conditions. Late blight pressure building rapidly but ground equipment couldn't enter without severe soil compaction and rut damage. Every day of delay risked crop loss.",
    solution:
      "Mobilized same-day drone spray service. Applied targeted fungicide within 6 hours of call, covering all 200 acres before conditions worsened. Zero ground contact, no compaction.",
    before: [
      "2-3 day spray delays after rain",
      "Disease pressure building unchecked",
      "Risk of total crop loss",
    ],
    after: [
      { label: "Response Time", value: "Same day", positive: true },
      { label: "Crop Saved", value: "100%", positive: true },
      { label: "Soil Compaction", value: "Zero", positive: true },
      { label: "Harvest Impact", value: "None", positive: true },
    ],
  },
  {
    title: "Soybean Farm",
    location: "Salem County",
    code: "SLM-0123",
    acreage: "450 acres",
    passes: "3 spray passes/season",
    challenge:
      "Weed pressure in standing soybean crop required targeted spot spraying. Broadcast application was wasting herbicide on clean areas and blanket coverage causing unnecessary chemical exposure.",
    solution:
      "Used GPS-mapped weed zones with targeted drone application. Prescription maps defined spray-only areas, allowing precise herbicide delivery to problem spots while leaving clean areas untreated.",
    before: [
      "Broadcast herbicide over entire field",
      "Chemical waste on clean areas",
      "Higher input costs, lower margins",
    ],
    after: [
      { label: "Herbicide Reduction", value: "28%", positive: true },
      { label: "Yield Increase", value: "8%", positive: true },
      { label: "Annual Savings", value: "$12,000", positive: true },
      { label: "Weed Control", value: "Superior", positive: true },
    ],
  },
];

const testimonials = [
  {
    quote:
      "We switched to drone spraying two seasons ago and haven't looked back. The coverage on our blueberry fields is night and day compared to our old ground rig. The savings on fungicide alone paid for the service.",
    name: "Robert M.",
    farm: "Pine Haven Berry Farm",
    county: "Burlington County",
  },
  {
    quote:
      "When we got hit with that heavy rain last August and late blight was moving in, AG Drones had drones in the air the same day. That saved our entire tomato crop. You can't put a price on that kind of response.",
    name: "Maria L.",
    farm: "Bridgeton Valley Farms",
    county: "Cumberland County",
  },
  {
    quote:
      "The GPS mapping and targeted spraying changed how we think about weed management. We're using less herbicide, getting better results, and our yields are up. The data they provide is incredibly useful.",
    name: "Tom K.",
    farm: "Woodstown Grain & Soy",
    county: "Salem County",
  },
  {
    quote:
      "As a smaller specialty operation, we thought drone spraying was only for big farms. Turns out it's actually more cost-effective at our scale because there's no minimum acreage. Best decision we made this year.",
    name: "Jennifer D.",
    farm: "Hammonton Orchards",
    county: "Atlantic County",
  },
];

/* ── Component ───────────────────────────────────────── */

export default function ResultsPage() {
  return (
    <>
      {/* ─── Hero ─────────────────────────────────────── */}
      <section className="relative bg-primary-950 overflow-hidden">
        <GridBackground />
        <HudOverlay />
        <div className="relative container-narrow mx-auto px-5 py-24 md:py-32">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Mission Reports
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.08] max-w-3xl">
              Real Results from{" "}
              <span className="text-accent-400">Real Farms</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-white/60 max-w-2xl">
              Every data point below comes from verified field operations in South
              Jersey. Measurable outcomes, season after season.
            </p>
          </FadeIn>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-6 text-[10px] font-mono text-accent-400/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <span>RPT::MISSION_LOG</span>
            <span className="w-1 h-1 rounded-full bg-accent-400/30" />
            <span>VERIFIED: TRUE</span>
            <span className="w-1 h-1 rounded-full bg-accent-400/30" />
            <span>REGION: SOUTH_NJ</span>
          </motion.div>
        </div>
      </section>

      <BeamDivider />

      {/* ─── Key Metrics ─────────────────────────────── */}
      <section className="bg-primary-950 py-14">
        <div className="container-narrow mx-auto px-5">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {keyMetrics.map((metric, i) => (
              <StaggerItem key={i}>
                <div className="relative bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-6 text-center hover:border-accent-400/30 hover:bg-white/[0.06] transition-all duration-300">
                  <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-accent-400/20 rounded-tl-2xl" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-accent-400/20 rounded-tr-2xl" />

                  <p className="text-3xl md:text-4xl font-bold text-accent-400 font-mono">
                    {metric.value}
                  </p>
                  <p className="text-sm text-white/60 mt-1">{metric.label}</p>
                  <p className="text-[10px] font-mono text-white/20 mt-1">{metric.unit}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <BeamDivider />

      {/* ─── Case Studies ────────────────────────────── */}
      <section className="bg-primary-900 py-16 md:py-24">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
                // Field Operations
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Mission Case Files
              </h2>
            </div>
          </FadeIn>

          <div className="space-y-8">
            {caseStudies.map((study, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="relative bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm overflow-hidden hover:border-accent-400/20 transition-all duration-300">
                  {/* HUD corners */}
                  <div className="absolute top-0 left-0 w-5 h-5 border-l-2 border-t-2 border-accent-400/30 rounded-tl-2xl" />
                  <div className="absolute top-0 right-0 w-5 h-5 border-r-2 border-t-2 border-accent-400/30 rounded-tr-2xl" />
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-l-2 border-b-2 border-accent-400/20 rounded-bl-2xl" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-r-2 border-b-2 border-accent-400/20 rounded-br-2xl" />

                  {/* Header */}
                  <div className="px-6 py-5 border-b border-white/[0.06] flex flex-wrap items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent-900/60 border border-accent-500/20 flex items-center justify-center text-accent-400">
                      <IconDrone className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-white">{study.title}</h3>
                        <span className="text-[10px] font-mono text-accent-400/40 bg-accent-900/40 border border-accent-500/10 px-2 py-0.5 rounded">
                          {study.code}
                        </span>
                      </div>
                      <p className="text-sm text-white/40 font-mono">
                        {study.location} &middot; {study.acreage} &middot; {study.passes}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Challenge */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-red-950/60 border border-red-500/20 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-red-400">!</span>
                          </div>
                          <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider font-mono">
                            Challenge
                          </h4>
                        </div>
                        <p className="text-sm text-white/40 leading-relaxed">{study.challenge}</p>
                      </div>

                      {/* Solution */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-accent-900/60 border border-accent-500/20 flex items-center justify-center text-accent-400">
                            <IconDrone className="w-3.5 h-3.5" />
                          </div>
                          <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider font-mono">
                            Solution
                          </h4>
                        </div>
                        <p className="text-sm text-white/40 leading-relaxed">{study.solution}</p>
                      </div>

                      {/* Results */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-green-950/60 border border-green-500/20 flex items-center justify-center text-green-400">
                            <IconCheckCircle className="w-3.5 h-3.5" />
                          </div>
                          <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider font-mono">
                            Results
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {study.after.map((r, j) => (
                            <div key={j} className="flex justify-between items-center py-1 border-b border-white/[0.04] last:border-0">
                              <span className="text-sm text-white/40">{r.label}</span>
                              <span className="text-sm font-bold text-green-400 font-mono">{r.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Before/After bar */}
                    <div className="mt-6 pt-5 border-t border-white/[0.06]">
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Before */}
                        <div className="bg-red-950/20 border border-red-500/10 rounded-xl p-4">
                          <p className="text-[10px] font-mono text-red-400/60 mb-2 uppercase tracking-wider">Before :: Traditional</p>
                          <ul className="space-y-1.5">
                            {study.before.map((item, j) => (
                              <li key={j} className="flex items-center gap-2 text-xs text-red-300/60">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400/50 shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* After */}
                        <div className="bg-green-950/20 border border-green-500/10 rounded-xl p-4">
                          <p className="text-[10px] font-mono text-green-400/60 mb-2 uppercase tracking-wider">After :: Drone Application</p>
                          <ul className="space-y-1.5">
                            {study.after.map((item, j) => (
                              <li key={j} className="flex items-center gap-2 text-xs text-green-300/60">
                                <IconCheckCircle className="w-3 h-3 shrink-0 text-green-400/60" />
                                {item.label}: <span className="font-mono font-semibold text-green-400">{item.value}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <BeamDivider />

      {/* ─── Testimonials ────────────────────────────── */}
      <section className="bg-primary-950 py-16 md:py-24">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
                // Operator Feedback
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                What Farmers Are Saying
              </h2>
            </div>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <StaggerItem key={i}>
                <div className="relative bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-6 h-full flex flex-col hover:border-accent-400/30 hover:bg-white/[0.06] transition-all duration-300">
                  <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-accent-400/15 rounded-tl-2xl" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-accent-400/15 rounded-tr-2xl" />

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <IconStar key={j} className="w-4 h-4 text-accent-400 fill-accent-400" />
                    ))}
                  </div>

                  <blockquote className="text-sm text-white/50 leading-relaxed flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>

                  <div className="mt-5 pt-4 border-t border-white/[0.06]">
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/30 font-mono">
                      {t.farm} &middot; {t.county}
                    </p>
                  </div>
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
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-full bg-accent-900/60 border border-accent-500/20 flex items-center justify-center">
                <IconAward className="w-7 h-7 text-accent-400" />
              </div>
            </div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Deploy
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              See These Results on Your Farm
            </h2>
            <p className="mt-4 text-white/50 max-w-xl mx-auto">
              Every farm is different. Let us assess your operation and show you
              the specific savings and improvements you can expect.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-accent-500 text-primary-950 font-semibold px-6 py-3 rounded-lg hover:bg-accent-400 transition-colors"
              >
                Schedule a Consultation <IconArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/roi-calculator"
                className="inline-flex items-center gap-2 border border-accent-500/30 text-accent-400 font-semibold px-6 py-3 rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                Calculate Your ROI
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
