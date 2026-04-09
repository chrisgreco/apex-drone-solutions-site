"use client";

import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/FadeIn";
import { GridBackground } from "@/components/ui/grid-background";
import { TerrainScan } from "@/components/ui/terrain-scan";
import {
  IconSpray,
  IconWheat,
  IconMap,
  IconTarget,
  IconArrowRight,
  IconCheckCircle,
  IconShield,
  IconDroplet,
  IconZap,
  IconLeaf,
  IconDollar,
  IconDrone,
  IconNavigation,
  IconBarChart,
  IconSun,
  IconCamera,
  IconGlobe,
} from "@/components/Icons";

const spraySpecs = [
  { label: "COVERAGE_RATE", value: "20 ac/hr", unit: "acres per hour" },
  { label: "APP_RATE", value: "5-7 GPA", unit: "gallons per acre" },
  { label: "GPS_ACCURACY", value: "2 cm", unit: "RTK precision" },
  { label: "SPRAY_WIDTH", value: "6.5 m", unit: "21 ft swath" },
  { label: "TANK_VOL", value: "20 L", unit: "per sortie" },
  { label: "NOZZLE_COUNT", value: "4x", unit: "precision atomizing" },
];

const sprayingBenefits = [
  {
    icon: <IconNavigation className="w-5 h-5" />,
    title: "GPS-Guided Precision",
    desc: "RTK GPS delivers centimeter-level accuracy for consistent, overlap-free coverage across every pass.",
  },
  {
    icon: <IconDroplet className="w-5 h-5" />,
    title: "Variable-Rate Application",
    desc: "Adjust spray rates on the fly based on prescription maps, applying more where needed and less where not.",
  },
  {
    icon: <IconZap className="w-5 h-5" />,
    title: "20 Acres Per Hour",
    desc: "Cover ground fast without soil compaction or crop damage from heavy ground rigs.",
  },
  {
    icon: <IconShield className="w-5 h-5" />,
    title: "Reduced Chemical Exposure",
    desc: "Operators stay safely on the ground while the drone handles application. No cab, no drift into the operator.",
  },
  {
    icon: <IconLeaf className="w-5 h-5" />,
    title: "Crop-Safe Operation",
    desc: "No wheel tracks, no broken stems. Drone spraying eliminates trampling losses common with ground rigs.",
  },
  {
    icon: <IconDrone className="w-5 h-5" />,
    title: "DJI T25 Fleet",
    desc: "Purpose-built agricultural drones with 20L tanks, precision nozzles, and terrain-following radar.",
  },
];

const seedingBenefits = [
  {
    icon: <IconZap className="w-5 h-5" />,
    title: "Zero Compaction",
    desc: "No heavy equipment on your soil. Aerial seeding preserves soil structure and existing crop integrity.",
  },
  {
    icon: <IconSun className="w-5 h-5" />,
    title: "Inter-Crop Planting",
    desc: "Seed directly into standing crops weeks before harvest, giving cover crops a critical head start.",
  },
  {
    icon: <IconDroplet className="w-5 h-5" />,
    title: "Wet Field Access",
    desc: "Fly over muddy, saturated fields that would swallow a ground seeder. Weather doesn't stop us.",
  },
  {
    icon: <IconNavigation className="w-5 h-5" />,
    title: "GPS-Guided Distribution",
    desc: "Even seed distribution with autonomous flight paths. No missed strips, no double-seeded areas.",
  },
  {
    icon: <IconBarChart className="w-5 h-5" />,
    title: "15 Acres Per Hour",
    desc: "Cover large fields quickly during narrow planting windows. Time your seeding perfectly.",
  },
  {
    icon: <IconWheat className="w-5 h-5" />,
    title: "Multi-Species Mixes",
    desc: "Cereal rye, crimson clover, tillage radish, and custom mixes — all in a single pass.",
  },
];

const ndviBenefits = [
  {
    icon: <IconCamera className="w-5 h-5" />,
    title: "Multispectral Imaging",
    desc: "Capture data beyond visible light to reveal crop stress invisible to the naked eye.",
  },
  {
    icon: <IconBarChart className="w-5 h-5" />,
    title: "Crop Health Monitoring",
    desc: "Track vegetation vigor over time to identify trends and measure treatment effectiveness.",
  },
  {
    icon: <IconTarget className="w-5 h-5" />,
    title: "Nutrient Deficiency ID",
    desc: "Pinpoint areas with nitrogen, phosphorus, or potassium deficiencies before symptoms spread.",
  },
  {
    icon: <IconSun className="w-5 h-5" />,
    title: "Early Problem Detection",
    desc: "Catch irrigation issues, disease pressure, and pest damage weeks before they become visible.",
  },
];

const pestFeatures = [
  {
    icon: <IconTarget className="w-5 h-5" />,
    title: "Early Detection",
    desc: "AI-assisted analysis identifies pest and disease hotspots before they spread across the field.",
    status: "ACTIVE",
  },
  {
    icon: <IconMap className="w-5 h-5" />,
    title: "Targeted Treatment Zones",
    desc: "Generate precision spray maps — treat only affected areas instead of blanket applications.",
    status: "MAPPING",
  },
  {
    icon: <IconLeaf className="w-5 h-5" />,
    title: "30-50% Chemical Reduction",
    desc: "Spot-treat problem areas only. Less product, lower cost, less environmental impact.",
    status: "OPTIMIZED",
  },
  {
    icon: <IconGlobe className="w-5 h-5" />,
    title: "Season-Long Monitoring",
    desc: "Regular flights track pest pressure trends and measure treatment effectiveness over time.",
    status: "TRACKING",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 overflow-hidden min-h-[60vh] flex items-center">
        <GridBackground />
        <div className="container-narrow mx-auto px-5 py-24 md:py-32 relative z-10">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Our Services
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.08] text-white max-w-4xl">
              Full-Spectrum Agricultural{" "}
              <span className="text-accent-400">Drone Intelligence</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-white/60 max-w-2xl">
              3D field mapping. Precision spraying. NDVI crop analytics.
              AI-powered pest detection. Everything your operation needs to
              maximize yield and minimize waste — deployed from the air.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/contact" className="btn-primary">
                Get a Free Quote <IconArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/how-it-works" className="btn-ghost">
                How It Works
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Crop Spraying */}
      <section id="spraying" className="relative bg-primary-900 py-20 md:py-28 tech-grid">
        <div className="container-narrow mx-auto px-5">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <div>
              <FadeIn>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
                  // Precision Spraying
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  Fungicide, Pesticide &amp; Herbicide Application
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="mt-6 space-y-4 text-white/60 leading-relaxed">
                  <p>
                    Our DJI Agras T25 drones deliver precise, GPS-guided spray
                    application for fungicides, pesticides, and herbicides. Every
                    acre gets exactly the right amount of product — no more, no
                    less.
                  </p>
                  <p>
                    Variable-rate technology adjusts application rates based on
                    prescription maps. Tight blueberry rows, open soybean fields,
                    orchard canopies — we handle them all with centimeter-level
                    GPS accuracy.
                  </p>
                </div>
              </FadeIn>

              {/* What We Spray */}
              <FadeIn delay={0.15}>
                <div className="mt-8 bg-white/[0.03] border border-accent-500/10 rounded-2xl p-7 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent-900/60 text-accent-400 flex items-center justify-center">
                      <IconSpray className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      Application Types
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Fungicides — blueberry mummy berry, soybean rust, wheat head scab",
                      "Pesticides — spotted lanternfly, Japanese beetle, aphid control",
                      "Herbicides — burndown applications, pre-emergent, targeted weed control",
                      "Foliar nutrients — micronutrient applications, liquid fertilizer",
                      "Desiccants — pre-harvest crop drying for even maturity",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-white/50"
                      >
                        <IconCheckCircle className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </div>

            {/* HUD Data Readouts */}
            <div>
              <FadeIn delay={0.2}>
                <div className="bg-white/[0.03] border border-accent-500/10 rounded-2xl p-7 backdrop-blur-sm hud-corners">
                  <p className="text-[10px] font-mono text-accent-400/60 mb-5 tracking-widest uppercase">
                    System Specifications
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {spraySpecs.map((spec, i) => (
                      <div
                        key={i}
                        className="bg-primary-950/50 border border-accent-500/5 rounded-lg p-4"
                      >
                        <p className="text-[10px] font-mono text-white/30 tracking-wider uppercase mb-1">
                          {spec.label}
                        </p>
                        <p className="text-2xl font-bold font-mono text-accent-400">
                          {spec.value}
                        </p>
                        <p className="text-[11px] text-white/40 font-mono mt-0.5">
                          {spec.unit}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Benefits Grid */}
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {sprayingBenefits.map((benefit, i) => (
              <StaggerItem key={i}>
                <div className="bg-white/[0.03] border border-accent-500/10 rounded-2xl p-7 h-full backdrop-blur-sm hover:border-accent-400/30 hover:bg-white/[0.06] transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-accent-900/60 text-accent-400 flex items-center justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h4 className="font-semibold text-white">
                    {benefit.title}
                  </h4>
                  <p className="mt-2 text-sm text-white/50">
                    {benefit.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Cover Crop Seeding */}
      <section id="seeding" className="relative bg-primary-950 py-20 md:py-28">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Cover Crop Seeding
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight max-w-2xl">
              Aerial Seeding for Cover Crops
            </h2>
            <p className="mt-4 text-white/60 max-w-2xl leading-relaxed">
              Cover crops protect your soil, suppress weeds, and improve organic
              matter. Drone seeding solves the timing problem — plant into standing
              crops weeks before harvest, reach wet fields, and eliminate compaction.
            </p>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {seedingBenefits.map((item, i) => (
              <StaggerItem key={i}>
                <div className="bg-white/[0.03] border border-accent-500/10 rounded-2xl p-7 h-full backdrop-blur-sm hover:border-accent-400/30 hover:bg-white/[0.06] transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-accent-900/60 text-accent-400 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h4 className="font-semibold text-white">{item.title}</h4>
                  <p className="mt-2 text-sm text-white/50">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* NDVI Field Mapping */}
      <section id="mapping" className="relative bg-primary-900 py-20 md:py-28 tech-grid">
        <div className="container-narrow mx-auto px-5">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <div>
              <FadeIn>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
                  // NDVI Field Mapping
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  See What Your Eyes Can&apos;t
                </h2>
                <p className="mt-4 text-white/60 leading-relaxed">
                  Multispectral drone surveys generate detailed NDVI maps that
                  reveal crop health across your entire operation. Identify problems
                  early, target treatments precisely, and track improvement over time.
                </p>
              </FadeIn>

              {/* NDVI Process */}
              <FadeIn delay={0.15}>
                <div className="mt-8 bg-white/[0.03] border border-accent-500/10 rounded-2xl p-7 backdrop-blur-sm">
                  <p className="text-[10px] font-mono text-accent-400/60 mb-4 tracking-widest uppercase">
                    Processing Pipeline
                  </p>
                  <div className="space-y-5">
                    {[
                      {
                        step: "01",
                        title: "CAPTURE",
                        desc: "Multispectral drone captures near-infrared and visible light data across your fields.",
                      },
                      {
                        step: "02",
                        title: "PROCESS",
                        desc: "Software stitches imagery into a georeferenced NDVI map with color-coded health zones.",
                      },
                      {
                        step: "03",
                        title: "ANALYZE",
                        desc: "Generate variable-rate prescription maps or target scouting to problem areas.",
                      },
                    ].map((s, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <span className="text-xs font-bold font-mono text-accent-400 bg-accent-900/60 rounded px-2 py-1 shrink-0">
                          {s.step}
                        </span>
                        <div>
                          <h4 className="font-semibold text-white font-mono text-sm tracking-wider">
                            {s.title}
                          </h4>
                          <p className="mt-1 text-sm text-white/50">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* TerrainScan Visual + Cards */}
            <div>
              <FadeIn delay={0.1}>
                <div className="bg-white/[0.03] border border-accent-500/10 rounded-2xl overflow-hidden backdrop-blur-sm hud-corners">
                  <div className="h-64 relative">
                    <TerrainScan />
                    <div className="absolute top-3 left-4 text-[9px] font-mono text-accent-400/50 tracking-widest">
                      NDVI_SCAN // LIVE
                    </div>
                    <div className="absolute bottom-3 right-4 text-[9px] font-mono text-green-400/50 tracking-widest">
                      HEALTH INDEX: 0.82
                    </div>
                  </div>
                </div>
              </FadeIn>

              <StaggerContainer className="grid grid-cols-2 gap-4 mt-4">
                {ndviBenefits.map((item, i) => (
                  <StaggerItem key={i}>
                    <div className="bg-white/[0.03] border border-accent-500/10 rounded-xl p-5 hover:border-accent-400/30 hover:bg-white/[0.06] transition-all duration-300">
                      <div className="w-8 h-8 rounded-lg bg-accent-900/60 text-accent-400 flex items-center justify-center mb-3">
                        {item.icon}
                      </div>
                      <h4 className="font-semibold text-white text-sm">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-xs text-white/50">{item.desc}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Pest & Disease Detection */}
      <section id="pest-detection" className="relative bg-primary-950 py-20 md:py-28">
        <div className="container-narrow mx-auto px-5">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <div>
              <FadeIn>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
                  // Pest &amp; Disease Detection
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  AI-Powered Early Identification
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="mt-6 space-y-4 text-white/60 leading-relaxed">
                  <p>
                    High-resolution RGB and multispectral imagery reveals subtle
                    color changes, canopy thinning, and stress patterns that indicate
                    insect damage, fungal infection, or bacterial disease — often
                    weeks before ground-level scouting would catch them.
                  </p>
                  <p>
                    Machine learning models trained on regional pest data identify
                    spotted lanternfly damage, soybean cyst nematode stress, and
                    fungal infections with increasing accuracy each season.
                  </p>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.15}>
              <StaggerContainer className="space-y-4">
                {pestFeatures.map((item, i) => (
                  <StaggerItem key={i}>
                    <div className="bg-white/[0.03] border border-accent-500/10 rounded-xl p-5 flex items-start gap-4 hover:border-accent-400/30 hover:bg-white/[0.06] transition-all duration-300">
                      <div className="w-10 h-10 rounded-lg bg-accent-900/60 text-accent-400 flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-white">
                            {item.title}
                          </h4>
                          <span className="flex items-center gap-1.5 text-[10px] font-mono text-green-400 tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            {item.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-white/50">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative bg-primary-900 py-20 md:py-28 tech-grid">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <div className="bg-white/[0.03] border border-accent-500/10 rounded-2xl p-10 md:p-14 text-center backdrop-blur-sm hud-corners">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
                // Pricing
              </p>
              <div className="w-14 h-14 rounded-full bg-accent-900/60 flex items-center justify-center mx-auto mb-6">
                <IconDollar className="w-7 h-7 text-accent-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Competitive Pricing Starting at
              </h2>
              <p className="text-6xl md:text-7xl font-bold font-mono text-accent-400 mt-4">
                $16<span className="text-2xl text-white/40">/acre</span>
              </p>
              <p className="mt-6 text-white/50 max-w-xl mx-auto">
                Every farm is different. Pricing depends on field size, crop
                type, terrain complexity, and product requirements. We provide
                custom quotes for every job.
              </p>
              <div className="grid sm:grid-cols-3 gap-6 mt-8 max-w-2xl mx-auto">
                {[
                  { label: "SPRAY_SERVICE", price: "$16", unit: "/acre" },
                  { label: "COVER_SEED", price: "$18", unit: "/acre" },
                  { label: "NDVI_MAPPING", price: "$8", unit: "/acre" },
                ].map((tier, i) => (
                  <div
                    key={i}
                    className="bg-primary-950/50 border border-accent-500/10 rounded-xl p-5"
                  >
                    <p className="text-[10px] font-mono text-white/40 tracking-wider uppercase">
                      {tier.label}
                    </p>
                    <p className="text-2xl font-bold font-mono text-white mt-2">
                      {tier.price}
                      <span className="text-sm text-white/40">{tier.unit}</span>
                    </p>
                    <p className="text-[11px] font-mono text-accent-400/60 mt-1">
                      starting from
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-white/30 font-mono">
                Volume discounts available for 50+ acres. Seasonal contracts
                reduce per-acre cost further.
              </p>
              <Link
                href="/contact"
                className="btn-primary mt-8"
              >
                Get a Custom Quote <IconArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-primary-950 py-20 md:py-28 overflow-hidden">
        <GridBackground />
        <div className="container-narrow mx-auto px-5 text-center relative z-10">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Initialize
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Deploy?
            </h2>
            <p className="mt-3 text-white/50 max-w-lg mx-auto">
              Tell us about your fields and we&apos;ll put together a precision
              operations plan that fits your operation and budget.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/contact" className="btn-primary">
                Request a Quote <IconArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/how-it-works" className="btn-ghost">
                See How It Works
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
