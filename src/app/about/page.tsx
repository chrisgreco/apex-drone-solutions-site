"use client";

import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/FadeIn";
import { GridBackground } from "@/components/ui/grid-background";
import { HudOverlay } from "@/components/ui/hud-overlay";
import { BeamDivider } from "@/components/Beam";
import {
  IconTarget,
  IconLeaf,
  IconDollar,
  IconShield,
  IconCheckCircle,
  IconArrowRight,
  IconAward,
  IconBarChart,
  IconNavigation,
  IconWheat,
  IconDroplet,
  IconMap,
  IconUsers,
  IconGlobe,
} from "@/components/Icons";

const certifications = [
  {
    icon: <IconNavigation className="w-6 h-6" />,
    title: "FAA Part 107 Remote Pilot",
    desc: "All operators hold current FAA Part 107 remote pilot certificates with biennial recurrency.",
  },
  {
    icon: <IconAward className="w-6 h-6" />,
    title: "FAA Part 137 Ag Aircraft Operator",
    desc: "Federally certified agricultural aircraft operator -- the same certification required of manned crop dusters.",
  },
  {
    icon: <IconDroplet className="w-6 h-6" />,
    title: "NJ Pesticide Applicator (CORE + AERIAL)",
    desc: "Licensed by the NJ DEP to apply restricted-use pesticides via aerial application methods.",
  },
  {
    icon: <IconShield className="w-6 h-6" />,
    title: "Commercial Liability Insurance",
    desc: "Fully insured for agricultural drone operations with $2M general liability and per-occurrence coverage.",
  },
  {
    icon: <IconGlobe className="w-6 h-6" />,
    title: "EPA Pesticide Business License",
    desc: "Registered with the EPA as a licensed pesticide application business with full regulatory compliance.",
  },
];

const stats = [
  { value: "2,500+", label: "Acres Sprayed" },
  { value: "85+", label: "Farms Served" },
  { value: "40%", label: "Chemical Savings" },
  { value: "8", label: "NJ Counties Covered" },
  { value: "5", label: "Certifications Held" },
];

const values = [
  {
    icon: <IconShield className="w-5 h-5" />,
    title: "Safety First",
    desc: "Every flight follows strict pre-flight checklists, weather minimums, and FAA procedures. No shortcuts.",
  },
  {
    icon: <IconLeaf className="w-5 h-5" />,
    title: "Environmental Stewardship",
    desc: "Precision application means less chemical runoff, zero soil compaction, and healthier ecosystems around your fields.",
  },
  {
    icon: <IconWheat className="w-5 h-5" />,
    title: "Farmer-First Approach",
    desc: "We work around your schedule, your crops, and your budget. If it does not make sense for your farm, we will tell you.",
  },
  {
    icon: <IconBarChart className="w-5 h-5" />,
    title: "Transparency",
    desc: "GPS flight logs and spray reports delivered after every job. You see exactly what was applied, where, and when.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 overflow-hidden">
        <GridBackground />
        <HudOverlay />
        <div className="container-narrow mx-auto px-5 py-24 md:py-32 relative z-10">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // About AG Drones NJ
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.08] text-white max-w-3xl">
              Precision Agriculture from Above
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-white/60 max-w-2xl leading-relaxed">
              AG Drones NJ is a New Jersey-based agricultural drone services company
              bringing precision crop protection to the farms that need it most. We combine
              FAA-certified drone operations with deep knowledge of South Jersey agriculture
              to deliver smarter, safer spraying.
            </p>
          </FadeIn>
        </div>
      </section>

      <BeamDivider />

      {/* Our Story */}
      <section className="py-20 md:py-28 bg-primary-950 px-5">
        <div className="container-narrow mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <div>
              <FadeIn>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
                  // Our Story
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  Built for New Jersey farms
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="mt-6 space-y-4 text-white/60 leading-relaxed">
                  <p>
                    We founded AG Drones NJ after seeing a clear gap in New Jersey
                    agriculture. The state&apos;s specialty crops -- blueberries, cranberries,
                    tomatoes, peppers, peaches -- were being underserved by traditional spray methods.
                  </p>
                  <p>
                    Small fields with tight rows. Wet, sandy soils that ground rigs get stuck in.
                    Crops too delicate for heavy equipment. These are problems that drones solve
                    perfectly.
                  </p>
                  <p>
                    We are FAA Part 137 certified, commercially insured, and hold NJ pesticide
                    applicator licenses. We did not cut corners to get here, and we do not cut
                    corners in the field.
                  </p>
                </div>
              </FadeIn>
            </div>
            <StaggerContainer className="space-y-4">
              {[
                {
                  label: "Specialty crop challenges",
                  detail:
                    "Blueberries, cranberries, and other NJ crops need precise, low-volume application that ground rigs cannot deliver.",
                },
                {
                  label: "Small field accessibility",
                  detail:
                    "Many NJ farms are 5-50 acres -- too small for manned aircraft, too tight for large ground rigs.",
                },
                {
                  label: "Wet soil conditions",
                  detail:
                    "Pine Barrens and coastal soils stay wet. Drones spray without touching the ground, eliminating compaction and rutting.",
                },
                {
                  label: "Regulatory compliance",
                  detail:
                    "Full FAA Part 137, NJ DEP pesticide licensing, and commercial insurance from day one.",
                },
              ].map((item, i) => (
                <StaggerItem key={i}>
                  <div className="bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-5">
                    <h4 className="font-semibold text-white">{item.label}</h4>
                    <p className="mt-1 text-sm text-white/60">{item.detail}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      <BeamDivider />

      {/* Our Mission */}
      <section className="py-20 md:py-28 bg-primary-900 px-5">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Our Mission
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight max-w-3xl">
              Make precision crop protection accessible to every New Jersey farm,
              regardless of size.
            </h2>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-3 gap-6 mt-12 max-w-5xl">
            {[
              {
                icon: <IconTarget className="w-7 h-7" />,
                title: "Precision",
                data: "2cm RTK GPS",
                desc: "GPS-guided flight paths with centimeter-level accuracy. Every pass is recorded, every drop is accounted for.",
              },
              {
                icon: <IconLeaf className="w-7 h-7" />,
                title: "Sustainability",
                data: "30% Less Chemicals",
                desc: "Targeted application reduces chemical usage dramatically. Zero soil compaction. Reduced drift and runoff.",
              },
              {
                icon: <IconMap className="w-7 h-7" />,
                title: "Intelligence",
                data: "3D Mapping + NDVI",
                desc: "Advanced field mapping and vegetation index analysis to identify problem areas before they spread.",
              },
            ].map((pillar, i) => (
              <StaggerItem key={i}>
                <div className="bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-7">
                  <div className="w-12 h-12 rounded-lg bg-accent-900/40 flex items-center justify-center text-accent-400 mb-4">
                    {pillar.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{pillar.title}</h3>
                  <p className="text-sm font-mono text-accent-400 mt-1">{pillar.data}</p>
                  <p className="mt-3 text-sm text-white/60 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <BeamDivider />

      {/* Certifications & Compliance */}
      <section className="py-20 md:py-28 bg-primary-950 px-5">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Certifications &amp; Compliance
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Fully licensed. Fully insured.
            </h2>
            <p className="mt-3 text-white/60 max-w-2xl">
              Agricultural drone spraying is a regulated activity. We hold every license and
              certification required to operate legally and safely in New Jersey.
            </p>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {certifications.map((cert, i) => (
              <StaggerItem key={i}>
                <div className="relative bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-7 h-full hud-corners">
                  <div className="w-11 h-11 rounded-lg bg-accent-900/40 flex items-center justify-center text-accent-400 mb-4">
                    {cert.icon}
                  </div>
                  <h3 className="font-semibold text-white">{cert.title}</h3>
                  <p className="mt-2 text-sm text-white/60 leading-relaxed">
                    {cert.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <BeamDivider />

      {/* By the Numbers */}
      <section className="py-20 md:py-28 bg-primary-900 px-5">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // By the Numbers
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Growing with New Jersey agriculture
            </h2>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-10">
            {stats.map((stat, i) => (
              <StaggerItem key={i}>
                <div className="bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-6 text-center">
                  <p className="text-3xl md:text-4xl font-bold text-accent-400 font-mono">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-white/60">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <BeamDivider />

      {/* Our Values */}
      <section className="py-20 md:py-28 bg-primary-950 px-5">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Our Values
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              What guides every flight
            </h2>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 gap-8 mt-10 max-w-4xl">
            {values.map((v, i) => (
              <StaggerItem key={i}>
                <div className="border-l-2 border-accent-500 pl-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-accent-400">{v.icon}</span>
                    <h3 className="font-semibold text-white">{v.title}</h3>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">{v.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <BeamDivider />

      {/* CTA */}
      <section className="py-20 md:py-28 bg-primary-900 px-5">
        <div className="container-narrow mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Work with a team that knows New Jersey agriculture
            </h2>
            <p className="mt-3 text-white/60 max-w-lg mx-auto">
              Whether you farm 5 acres of blueberries or 500 acres of soybeans, we will
              give you an honest assessment of how drone spraying fits your operation.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-400 text-primary-950 font-semibold rounded-lg transition-colors"
              >
                Get a Free Quote <IconArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/careers"
                className="inline-flex items-center gap-2 px-6 py-3 border border-accent-500/20 text-accent-400 hover:bg-accent-900/40 rounded-lg transition-colors"
              >
                Join Our Team
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
