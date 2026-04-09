"use client";

import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/FadeIn";
import { GridBackground } from "@/components/ui/grid-background";
import { HudOverlay } from "@/components/ui/hud-overlay";
import {
  IconDrone,
  IconArrowRight,
  IconCheckCircle,
  IconShield,
  IconDroplet,
  IconZap,
  IconNavigation,
  IconBattery,
  IconTarget,
  IconTool,
  IconTruck,
  IconBarChart,
  IconCamera,
  IconAward,
  IconMap,
  IconGlobe,
  IconSun,
} from "@/components/Icons";

const t25Specs = [
  { label: "TANK_CAPACITY", value: "20L", detail: "5.3 gal" },
  { label: "DAILY_COVERAGE", value: "18-20", detail: "acres/day" },
  { label: "SPRAY_PAYLOAD", value: "5 gal", detail: "per load" },
  { label: "SPRAY_WIDTH", value: "6.5m", detail: "21 ft swath" },
  { label: "FLIGHT_SPEED", value: "7 m/s", detail: "max velocity" },
  { label: "NOZZLE_ARRAY", value: "4x", detail: "precision atomizing" },
  { label: "GPS_SYSTEM", value: "RTK", detail: "cm-level accuracy" },
  { label: "OBSTACLE_AVO", value: "OMNI", detail: "radar detection" },
  { label: "TERRAIN_FOLLOW", value: "ACTIVE", detail: "radar altitude" },
  { label: "TAKEOFF_WEIGHT", value: "<55 lb", detail: "FAA advantage" },
  { label: "BATTERY_LIFE", value: "~10 min", detail: "hot-swap capable" },
  { label: "IP_RATING", value: "IP67", detail: "dust + water" },
];

const t25Advantages = [
  {
    title: "Built for NJ Specialty Crops",
    desc: "The T25's compact frame navigates tight blueberry rows and orchard canopies that larger drones can't reach. Perfect for New Jersey's diverse, smaller-acreage farms.",
  },
  {
    title: "Under-55lb FAA Advantage",
    desc: "At under 55 lbs takeoff weight, the T25 operates under simplified FAA regulations. No special waivers needed for most operations — faster permitting, fewer delays.",
  },
  {
    title: "Precision Over Volume",
    desc: "While larger drones carry more product, the T25 delivers more precise application. For specialty crops where accuracy matters more than speed, precision saves money.",
  },
  {
    title: "Cost-Effective for NJ Scale",
    desc: "Most NJ farms are 5-100 acres. The T25 covers this range efficiently without the overhead of larger aircraft designed for 500+ acre operations.",
  },
];

const comparisonRows = [
  { feature: "Tank Capacity", t25: "20L (5.3 gal)", t50: "40L (10.6 gal)", t25Win: false },
  { feature: "Takeoff Weight", t25: "< 55 lbs", t50: "> 55 lbs", t25Win: true },
  { feature: "FAA Regulations", t25: "Standard Part 107", t50: "Additional waivers", t25Win: true },
  { feature: "Spray Width", t25: "6.5m", t50: "9m", t25Win: false },
  { feature: "Maneuverability", t25: "Excellent — tight rows", t50: "Good — open fields", t25Win: true },
  { feature: "Specialty Crop Fit", t25: "Ideal", t50: "Limited", t25Win: true },
  { feature: "Daily Coverage", t25: "18-20 acres", t50: "40+ acres", t25Win: false },
  { feature: "Best For", t25: "NJ farms, specialty", t50: "Large-scale row crops", t25Win: true },
  { feature: "Cost Per Acre", t25: "Lower for small fields", t50: "Lower for 200+ ac", t25Win: true },
];

const supportEquipment = [
  {
    icon: <IconNavigation className="w-5 h-5" />,
    title: "RTK Base Station",
    desc: "Centimeter-level GPS correction for precision flight paths. Sets up in minutes, covers the entire work area.",
    spec: "ACCURACY: 2cm",
  },
  {
    icon: <IconBattery className="w-5 h-5" />,
    title: "Multi-Battery Charging",
    desc: "8-port rapid charging hub keeps batteries rotating. While one set flies, the next charges. Zero downtime.",
    spec: "PORTS: 8x RAPID",
  },
  {
    icon: <IconTruck className="w-5 h-5" />,
    title: "Field Truck & Trailer",
    desc: "Purpose-built mobile command center. Carries all drones, batteries, mixing equipment, and supplies.",
    spec: "SELF-CONTAINED",
  },
  {
    icon: <IconDroplet className="w-5 h-5" />,
    title: "Mixing Equipment",
    desc: "Graduated tanks, agitation system, and calibrated measuring tools for precise chemical mixing.",
    spec: "CALIBRATED",
  },
  {
    icon: <IconShield className="w-5 h-5" />,
    title: "PPE & Safety Gear",
    desc: "Full chemical-rated PPE including respirators, chemical-resistant suits, gloves, and eye protection.",
    spec: "CHEM-RATED",
  },
  {
    icon: <IconSun className="w-5 h-5" />,
    title: "Weather Station",
    desc: "Portable monitoring for real-time wind speed, temperature, humidity, and delta-T readings during application.",
    spec: "REAL-TIME",
  },
];

const technologyFeatures = [
  {
    icon: <IconMap className="w-5 h-5" />,
    title: "GPS-Guided Flight Paths",
    desc: "Pre-programmed autonomous routes ensure complete, overlap-consistent coverage. No missed strips, no double-spray.",
  },
  {
    icon: <IconBarChart className="w-5 h-5" />,
    title: "Variable-Rate Application",
    desc: "Adjust spray rates zone-by-zone based on prescription maps. Apply more where needed, less where not.",
  },
  {
    icon: <IconCamera className="w-5 h-5" />,
    title: "Real-Time Flow Monitoring",
    desc: "Live telemetry shows flow rate, remaining tank volume, and application rate during every pass.",
  },
  {
    icon: <IconGlobe className="w-5 h-5" />,
    title: "Terrain Following",
    desc: "Active radar maintains consistent spray height regardless of hills, ditches, or field contours.",
  },
  {
    icon: <IconTarget className="w-5 h-5" />,
    title: "Obstacle Avoidance",
    desc: "Omnidirectional radar detects trees, poles, wires, and structures. Automatic path adjustment.",
  },
  {
    icon: <IconZap className="w-5 h-5" />,
    title: "Automated Coverage Reports",
    desc: "Every flight generates a GPS-logged coverage map showing exact spray area, rates, and conditions.",
  },
];

export default function EquipmentPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 overflow-hidden min-h-[55vh] flex items-center">
        <GridBackground />
        <HudOverlay />
        <div className="container-narrow mx-auto px-5 py-24 md:py-32 relative z-10">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Fleet Systems
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.08] text-white max-w-4xl">
              Purpose-Built{" "}
              <span className="text-accent-400">Aerial Platforms</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-white/60 max-w-2xl">
              Every component selected specifically for New Jersey crops,
              terrain, and farm sizes. Not the biggest fleet — the most
              precisely matched to your operation.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* DJI T25 Showcase */}
      <section className="relative bg-primary-900 py-20 md:py-28 tech-grid">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Primary Fleet
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              DJI Agras T25
            </h2>
            <p className="mt-4 text-white/60 max-w-3xl leading-relaxed">
              The backbone of our fleet. Purpose-built for agricultural spraying
              with a 20-liter tank, precision nozzles, RTK GPS, and
              omnidirectional obstacle avoidance in a compact, maneuverable
              frame ideal for New Jersey&apos;s specialty crops.
            </p>
          </FadeIn>

          {/* Specs HUD Grid */}
          <FadeIn delay={0.1}>
            <div className="mt-10 bg-white/[0.03] border border-accent-500/10 rounded-2xl p-8 backdrop-blur-sm hud-corners">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-900/60 border border-accent-500/20 text-accent-400 flex items-center justify-center">
                    <IconDrone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Technical Specifications
                    </h3>
                    <p className="text-[10px] font-mono text-white/30 tracking-wider">
                      DJI_AGRAS_T25 // REV 2024
                    </p>
                  </div>
                </div>
                <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-green-400 tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  OPERATIONAL
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {t25Specs.map((spec, i) => (
                  <div
                    key={i}
                    className="bg-primary-950/50 border border-accent-500/5 rounded-lg p-4 hover:border-accent-400/20 transition-colors"
                  >
                    <p className="text-[10px] font-mono text-white/30 tracking-wider uppercase mb-1">
                      {spec.label}
                    </p>
                    <p className="text-xl font-bold font-mono text-accent-400">
                      {spec.value}
                    </p>
                    <p className="text-[11px] text-white/40 font-mono mt-0.5">
                      {spec.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* T25 Advantages */}
          <StaggerContainer className="grid sm:grid-cols-2 gap-6 mt-10">
            {t25Advantages.map((adv, i) => (
              <StaggerItem key={i}>
                <div className="bg-white/[0.03] border border-accent-500/10 rounded-2xl p-7 h-full backdrop-blur-sm hover:border-accent-400/30 hover:bg-white/[0.06] transition-all duration-300">
                  <h4 className="font-semibold text-white">{adv.title}</h4>
                  <p className="mt-2 text-sm text-white/50">{adv.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* T25 vs T50 Comparison */}
      <section className="relative bg-primary-950 py-20 md:py-28">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Platform Comparison
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight max-w-3xl">
              Why We Chose the T25 Over Larger Drones
            </h2>
            <p className="mt-4 text-white/60 max-w-3xl leading-relaxed">
              Bigger isn&apos;t always better. The DJI T50 carries twice the
              payload, but for New Jersey farms it comes with tradeoffs that
              matter.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-10 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-accent-500/20">
                    <th className="text-left py-4 px-5 text-xs font-mono font-semibold text-white/50 tracking-wider uppercase">
                      Parameter
                    </th>
                    <th className="text-left py-4 px-5 text-xs font-mono font-semibold text-accent-400 tracking-wider uppercase">
                      DJI Agras T25
                    </th>
                    <th className="text-left py-4 px-5 text-xs font-mono font-semibold text-white/30 tracking-wider uppercase">
                      DJI Agras T50
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={i}
                      className={`border-b border-accent-500/5 ${
                        i % 2 === 0
                          ? "bg-white/[0.02]"
                          : "bg-transparent"
                      } hover:bg-white/[0.04] transition-colors`}
                    >
                      <td className="py-3 px-5 text-sm font-medium text-white/70">
                        {row.feature}
                      </td>
                      <td className="py-3 px-5 text-sm font-mono">
                        <span className={`flex items-center gap-2 ${row.t25Win ? "text-accent-400" : "text-white/60"}`}>
                          {row.t25Win && (
                            <IconCheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" />
                          )}
                          {row.t25}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-sm text-white/30 font-mono">
                        {row.t50}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="mt-8 bg-accent-900/40 border border-accent-500/10 rounded-xl p-6 max-w-3xl">
              <p className="text-sm text-white/60 leading-relaxed">
                <span className="font-semibold text-accent-400 font-mono">SUMMARY:</span>{" "}
                The T50 is built for large-scale Midwest row crop operations. For
                New Jersey&apos;s mix of blueberry fields, vegetable farms,
                orchards, and smaller grain operations, the T25 delivers better
                precision at a better price point — without the regulatory
                complexity of a heavier aircraft.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Support Equipment */}
      <section className="relative bg-primary-900 py-20 md:py-28 tech-grid">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Support Systems
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Full Kit Deployment
            </h2>
            <p className="mt-4 text-white/60 max-w-2xl leading-relaxed">
              A drone is only part of the system. Here&apos;s the complete
              equipment loadout that deploys to your field on spray day.
            </p>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {supportEquipment.map((item, i) => (
              <StaggerItem key={i}>
                <div className="bg-white/[0.03] border border-accent-500/10 rounded-2xl p-7 h-full backdrop-blur-sm hover:border-accent-400/30 hover:bg-white/[0.06] transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent-900/60 text-accent-400 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="text-[9px] font-mono text-green-400/60 tracking-wider">
                      {item.spec}
                    </span>
                  </div>
                  <h4 className="font-semibold text-white">{item.title}</h4>
                  <p className="mt-2 text-sm text-white/50">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Technology Features */}
      <section className="relative bg-primary-950 py-20 md:py-28 overflow-hidden">
        <GridBackground />
        <div className="container-narrow mx-auto px-5 relative z-10">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Onboard Intelligence
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Smart Systems That Make the Difference
            </h2>
            <p className="mt-4 text-white/60 max-w-2xl leading-relaxed">
              It&apos;s not just about flying and spraying. These technology
              features ensure consistent, accurate, documented results on every
              mission.
            </p>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {technologyFeatures.map((item, i) => (
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

      {/* Safety & Compliance */}
      <section className="relative bg-primary-900 py-20 md:py-28 tech-grid">
        <div className="container-narrow mx-auto px-5">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <div>
              <FadeIn>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
                  // Compliance &amp; Safety
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  Maintained, Registered, Ready
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="mt-6 space-y-4 text-white/60 leading-relaxed">
                  <p>
                    Every drone is FAA-registered and maintained per DJI
                    manufacturer specifications. No shortcuts on maintenance —
                    your spray job depends on equipment that works flawlessly.
                  </p>
                  <p>
                    Before every flight, we run a standardized 30-point
                    pre-flight checklist covering motor function, GPS lock,
                    battery health, nozzle calibration, and obstacle avoidance.
                    If anything fails, that drone doesn&apos;t fly.
                  </p>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.15}>
              <StaggerContainer className="space-y-4">
                {[
                  {
                    icon: <IconAward className="w-5 h-5" />,
                    title: "FAA Registered",
                    desc: "All aircraft registered and compliant with current FAA regulations for commercial agricultural operations.",
                    status: "VERIFIED",
                  },
                  {
                    icon: <IconTool className="w-5 h-5" />,
                    title: "Manufacturer Maintenance",
                    desc: "Maintained per DJI specs with logged service records. Components replaced on schedule, not when they fail.",
                    status: "CURRENT",
                  },
                  {
                    icon: <IconCheckCircle className="w-5 h-5" />,
                    title: "Pre-Flight Checks",
                    desc: "30-point inspection before every operation. Motors, GPS, batteries, nozzles, and avoidance systems verified.",
                    status: "30-POINT",
                  },
                  {
                    icon: <IconBattery className="w-5 h-5" />,
                    title: "Battery Monitoring",
                    desc: "Cycle counts, voltage, and temperature tracked on every battery. Retired before degradation, not after.",
                    status: "TRACKED",
                  },
                  {
                    icon: <IconShield className="w-5 h-5" />,
                    title: "Failsafe Systems",
                    desc: "Auto return-to-home on signal loss, low battery auto-land, and geofencing for flight boundary enforcement.",
                    status: "ARMED",
                  },
                ].map((item, i) => (
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
                          <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-green-400 tracking-wider">
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

      {/* CTA */}
      <section className="relative bg-primary-950 py-20 md:py-28 overflow-hidden">
        <GridBackground />
        <div className="container-narrow mx-auto px-5 text-center relative z-10">
          <FadeIn>
            <div className="w-14 h-14 rounded-full bg-accent-900/60 border border-accent-500/20 flex items-center justify-center mx-auto mb-6">
              <IconDrone className="w-7 h-7 text-accent-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              See Our Fleet in Action
            </h2>
            <p className="mt-3 text-white/50 max-w-lg mx-auto">
              Want to see a T25 fly your fields before committing? We offer
              on-site demos so you can evaluate precision and coverage firsthand.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/contact" className="btn-primary">
                Schedule a Demo <IconArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/services" className="btn-ghost">
                View Our Services
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
