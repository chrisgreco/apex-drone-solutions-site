"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GridBackground } from "@/components/ui/grid-background";
import { Globe } from "@/components/ui/globe";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { FadeIn } from "@/components/FadeIn";
import {
  IconSpray,
  IconWheat,
  IconMap,
  IconTarget,
  IconArrowRight,
  IconCheckCircle,
  IconShield,
  IconDroplet,
  IconLeaf,
  IconDollar,
  IconPhone,
  IconStar,
  IconAward,
  IconDrone,
} from "@/components/Icons";

/* ── Data ────────────────────────────────────────────── */

const services = [
  {
    icon: <IconSpray className="w-5 h-5" />,
    title: "Precision Crop Spraying",
    desc: "GPS-guided application at 20 acres/hour with centimeter-level accuracy. Fungicides, pesticides, herbicides.",
    href: "/services",
  },
  {
    icon: <IconWheat className="w-5 h-5" />,
    title: "Cover Crop Seeding",
    desc: "Aerial seeding into standing crops. Zero soil compaction, no ruts, no crop damage.",
    href: "/services#seeding",
  },
  {
    icon: <IconMap className="w-5 h-5" />,
    title: "3D Mapping & NDVI",
    desc: "Multispectral imaging and 3D terrain models. Catch crop stress before it spreads.",
    href: "/services#mapping",
  },
  {
    icon: <IconTarget className="w-5 h-5" />,
    title: "Pest & Disease Detection",
    desc: "AI-powered identification with targeted treatment zones. Less chemical waste.",
    href: "/services#pest-detection",
  },
];

const stats = [
  { value: "30%", label: "Chemical Savings" },
  { value: "$16", label: "Per Acre" },
  { value: "20ac/hr", label: "Coverage Speed" },
  { value: "2cm", label: "GPS Accuracy" },
];

const testimonials = [
  {
    quote: "We cut our fungicide costs by a third on our blueberry fields. The drone gets into the rows better than our old ground rig ever could.",
    name: "Mike R.",
    farm: "Burlington County",
    acres: "120 acres",
  },
  {
    quote: "After a heavy rain, our fields were too wet for the tractor. AG Drones came out and sprayed the same day. Saved our tomato crop from late blight.",
    name: "Sarah T.",
    farm: "Cumberland County",
    acres: "85 acres",
  },
  {
    quote: "The GPS coverage maps they send after every job give me peace of mind. I know exactly what got sprayed and where.",
    name: "James K.",
    farm: "Salem County",
    acres: "340 acres",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center bg-primary-950 overflow-hidden">
        <GridBackground />
        <div className="container-narrow mx-auto px-5 py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-800/60 bg-accent-900/40 backdrop-blur-sm mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
                  <span className="text-xs font-medium text-accent-300/90 font-mono">
                    FAA Part 137 Certified &middot; South Jersey
                  </span>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h1 className="text-5xl md:text-6xl lg:text-[4.25rem] font-bold text-white leading-[1.05] tracking-tight">
                  Next-gen drone technology for{" "}
                  <span className="text-accent-400">smarter farming</span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="mt-6 text-lg md:text-xl text-white/50 max-w-xl leading-relaxed">
                  3D field mapping. Precision spraying. NDVI analytics.
                  Cut chemical costs 30% with centimeter-level GPS accuracy.
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="flex flex-wrap gap-4 mt-10">
                  <Link href="/contact" className="btn-primary text-base">
                    Get a Free Quote
                    <IconArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/roi-calculator" className="btn-secondary text-base">
                    Calculate Your ROI
                  </Link>
                </div>
              </FadeIn>
            </div>

            {/* 3D Globe */}
            <FadeIn delay={0.2} direction="right">
              <div className="hidden lg:block relative">
                <Globe className="max-w-[480px] opacity-80" />
                {/* Floating HUD labels */}
                <motion.div
                  className="absolute top-16 right-8 flex items-center gap-2 px-3 py-2 bg-accent-900/60 backdrop-blur-md rounded-lg border border-accent-500/20"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                  <IconDrone className="w-4 h-4 text-accent-400" />
                  <span className="text-xs text-white/80 font-mono">DJI T25 Fleet</span>
                </motion.div>
                <motion.div
                  className="absolute bottom-28 left-4 flex items-center gap-2 px-3 py-2 bg-accent-900/60 backdrop-blur-md rounded-lg border border-accent-500/20"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                >
                  <IconMap className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-white/80 font-mono">South Jersey</span>
                </motion.div>
              </div>
            </FadeIn>
          </div>

          {/* Stats row */}
          <FadeIn delay={0.4}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-10 border-t border-accent-500/10">
              {stats.map((s, i) => (
                <div key={i}>
                  <p className="text-3xl font-bold text-white font-mono">{s.value}</p>
                  <p className="text-sm text-white/30 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────── */}
      <section className="section bg-primary-900">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Services
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white max-w-lg">
              Full-spectrum agricultural drone intelligence
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-4 mt-12">
            {services.map((s, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <Link
                  href={s.href}
                  className="group block p-6 rounded-2xl border border-accent-500/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-accent-500/20 transition-all duration-300"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent-900/60 text-accent-400 mb-4">
                    {s.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
                  <span className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-accent-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                    Learn more <IconArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Drones ───────────────────────────────────── */}
      <section className="section bg-primary-950 tech-grid">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Advantages
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white max-w-lg">
              Better for your crops. Better for your bottom line.
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {[
              { icon: <IconDroplet className="w-5 h-5" />, title: "30% Chemical Savings", desc: "Precision nozzles and GPS guidance reduce waste while improving coverage." },
              { icon: <IconLeaf className="w-5 h-5" />, title: "Zero Soil Compaction", desc: "No tire ruts, no crushed crops, no soil structure damage." },
              { icon: <IconShield className="w-5 h-5" />, title: "Fully Licensed & Insured", desc: "FAA Part 137, NJ pesticide applicator, commercially insured." },
              { icon: <IconDrone className="w-5 h-5" />, title: "Any Terrain, Any Time", desc: "Wet fields, steep slopes, tight rows \u2014 we go where ground rigs can\u2019t." },
              { icon: <IconDollar className="w-5 h-5" />, title: "Competitive at $16/ac", desc: "Comparable to airplane rates with precision accuracy." },
              { icon: <IconMap className="w-5 h-5" />, title: "GPS Coverage Reports", desc: "Every job documented with maps and analytics." },
            ].map((card, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="p-5 rounded-xl border border-accent-500/8 bg-white/[0.02]">
                  <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent-900/40 text-accent-400 mb-3">
                    {card.icon}
                  </div>
                  <h3 className="text-base font-semibold text-white">{card.title}</h3>
                  <p className="mt-1.5 text-sm text-white/35 leading-relaxed">{card.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="section bg-primary-900">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Field Reports
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              What farmers are saying
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-5 mt-12">
            {testimonials.map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="p-6 rounded-2xl border border-accent-500/10 bg-white/[0.02] h-full flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <IconStar key={j} className="w-3.5 h-3.5 text-accent-400 fill-accent-400" />
                    ))}
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-5 pt-4 border-t border-accent-500/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-900 border border-accent-500/20 flex items-center justify-center text-accent-400 text-xs font-bold font-mono">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{t.name}</p>
                      <p className="text-[11px] text-white/25">{t.farm} &middot; {t.acres}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <div className="text-center mt-8">
              <Link href="/results" className="inline-flex items-center gap-2 text-sm font-semibold text-accent-400 hover:text-accent-300 font-mono">
                View all results <IconArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Certifications Strip ─────────────────────────── */}
      <section className="bg-primary-950 border-y border-accent-500/10">
        <div className="container-narrow mx-auto px-5 py-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              { icon: <IconAward className="w-5 h-5" />, label: "FAA Part 107", sub: "Remote Pilot" },
              { icon: <IconShield className="w-5 h-5" />, label: "FAA Part 137", sub: "Ag Aircraft Operator" },
              { icon: <IconLeaf className="w-5 h-5" />, label: "NJ Pesticide", sub: "CORE + AERIAL" },
              { icon: <IconCheckCircle className="w-5 h-5" />, label: "Commercially", sub: "Insured" },
            ].map((cert, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-accent-500/10 text-accent-400">
                  {cert.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{cert.label}</p>
                  <p className="text-xs text-white/25">{cert.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="relative bg-primary-950 overflow-hidden">
        <BackgroundBeams />
        <GridBackground />
        <div className="container-narrow mx-auto px-5 py-24 relative z-10 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold text-white max-w-2xl mx-auto leading-tight">
              Ready to protect your crops with{" "}
              <span className="text-accent-400">precision technology?</span>
            </h2>
            <p className="mt-4 text-lg text-white/35 max-w-md mx-auto">
              Most quotes delivered within 24 hours.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/contact" className="btn-primary text-base">
                Get a Free Quote <IconArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/roi-calculator" className="btn-secondary text-base">
                Calculate Your ROI
              </Link>
            </div>
            <a
              href="tel:+1-555-AG-DRONE"
              className="inline-flex items-center gap-2 mt-5 text-sm text-white/20 hover:text-white/50 transition-colors font-mono"
            >
              <IconPhone className="w-3.5 h-3.5" />
              (555) AG-DRONE
            </a>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
