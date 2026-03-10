"use client";

import Link from "next/link";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { NumberTicker } from "@/components/NumberTicker";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/FadeIn";
import { GlobeVisualization } from "@/components/GlobeVisualization";
import { BeamDivider } from "@/components/Beam";
import {
  IconShield,
  IconClock,
  IconChart,
  IconCamera,
  IconUsers,
  IconTool,
  IconArrowRight,
} from "@/components/Icons";

export default function HomePage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center bg-primary-950 overflow-hidden">
        <DottedSurface dotColor={[130, 154, 177]} fogColor={0x0a1929} />

        <div className="container-narrow mx-auto px-5 py-20 relative z-10">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-700 bg-primary-900/50 backdrop-blur-sm mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
              <span className="text-xs font-medium text-primary-300">Nationwide Drone Coverage</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight max-w-4xl">
              Roof documentation,{" "}
              <span className="text-accent-400">reimagined</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg md:text-xl text-primary-200 max-w-2xl leading-relaxed">
              AI-powered drone inspections that deliver carrier-grade property
              reports in 48 hours. Built for insurers, adjusters, and roofers.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link href="/contact" className="btn-primary text-[0.9375rem]">
                Talk to Sales
                <IconArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/how-it-works" className="btn-ghost text-[0.9375rem]">
                See How It Works
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────── */}
      <section className="relative bg-primary-950 border-t border-primary-800/50">
        <div className="container-narrow mx-auto px-5 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 48, suffix: "hr", label: "Report delivery" },
              { value: 10000, suffix: "+", label: "Properties documented" },
              { value: 50, suffix: "+", label: "Markets covered" },
              { value: 99, suffix: "%", label: "Completion rate" },
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white">
                    <NumberTicker value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="mt-1 text-sm text-primary-400">{stat.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <BeamDivider />

      {/* ── Who We Serve ───────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-500 mb-3">Who We Serve</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 max-w-xl">
              Built for the teams that document and repair properties
            </h2>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: <IconShield className="w-5 h-5" />,
                title: "Insurance Carriers",
                desc: "Reduce cycle times and keep adjusters off damaged roofs. Consistent documentation that integrates with your claims workflow.",
                href: "/insurance-claims",
              },
              {
                icon: <IconUsers className="w-5 h-5" />,
                title: "Independent Adjusters",
                desc: "Comprehensive property data delivered to your desk. Focus on the estimate while we handle the fieldwork.",
                href: "/insurance-claims",
              },
              {
                icon: <IconTool className="w-5 h-5" />,
                title: "Roofing & Restoration",
                desc: "Win more approvals with thorough, objective documentation. Pre-storm and post-storm programs that protect your revenue.",
                href: "/roofing-restoration",
              },
            ].map((card, i) => (
              <StaggerItem key={i}>
                <Link href={card.href} className="group block border border-neutral-100 rounded-xl p-7 hover:border-accent-200 hover:shadow-lg transition-all duration-300">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-50 text-primary-700 group-hover:bg-accent-50 group-hover:text-accent-600 transition-colors">
                    {card.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-primary-900">{card.title}</h3>
                  <p className="mt-2 text-sm text-neutral-500 leading-relaxed">{card.desc}</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-accent-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <IconArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────── */}
      <section className="section bg-neutral-50">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <div className="text-center">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-500 mb-3">How It Works</p>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900">
                Request to report in 48 hours
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 mt-14 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Submit Request",
                desc: "Enter the property address through our portal or API. We handle scheduling and dispatch.",
              },
              {
                step: "02",
                title: "Drone Captures Data",
                desc: "A local Part 107 pilot flies the property. High-res imagery, measurements, and 3D models.",
              },
              {
                step: "03",
                title: "AI Report Delivered",
                desc: "Computer vision processes the data. Carrier-grade PDF and interactive report to your inbox.",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="relative">
                  <span className="text-6xl font-bold text-primary-100">{item.step}</span>
                  <h3 className="mt-2 text-lg font-semibold text-primary-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <div className="text-center mt-12">
              <Link href="/how-it-works" className="inline-flex items-center gap-2 text-sm font-semibold text-accent-600 hover:text-accent-700">
                View full workflow <IconArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Benefits ───────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-500 mb-3">Why Apex</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 max-w-md">
              Better data, delivered faster
            </h2>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { icon: <IconClock className="w-5 h-5" />, title: "48hr Turnaround", desc: "Reports within 48 hours. Rush available for storm events." },
              { icon: <IconShield className="w-5 h-5" />, title: "Safer Operations", desc: "Pilots and drones handle hazardous roofs. Adjusters stay on the ground." },
              { icon: <IconChart className="w-5 h-5" />, title: "Consistent Quality", desc: "Structured format. No variability between inspectors or regions." },
              { icon: <IconCamera className="w-5 h-5" />, title: "Complete Coverage", desc: "Every slope, flashing, and penetration. 3D models with measurements." },
            ].map((card, i) => (
              <StaggerItem key={i}>
                <div className="p-6 rounded-xl border border-neutral-100 hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                    {card.icon}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-primary-900">{card.title}</h3>
                  <p className="mt-1.5 text-sm text-neutral-500 leading-relaxed">{card.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Pilot Network + Globe ──────────────────────── */}
      <section className="relative bg-primary-950 overflow-hidden">
        <div className="container-narrow mx-auto px-5 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3">Pilot Network</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  Nationwide coverage, local expertise
                </h2>
                <p className="mt-4 text-primary-200 leading-relaxed">
                  Every Apex pilot holds FAA Part 107 certification and carries commercial liability insurance.
                  Trained on our documentation standards. Equipped for roof-grade data capture.
                </p>
                <Link href="/become-a-pilot" className="btn-ghost mt-8 inline-flex">
                  Join Our Network <IconArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.2}>
              <div className="aspect-square max-w-md mx-auto">
                <GlobeVisualization />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold text-primary-900 max-w-2xl mx-auto leading-tight">
              Ready to modernize your property documentation?
            </h2>
            <p className="mt-4 text-lg text-neutral-500 max-w-lg mx-auto">
              Talk to our team about coverage, volume pricing, and workflow integration.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/contact" className="btn-primary">
                Talk to Sales <IconArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/how-it-works" className="btn-secondary">
                See How It Works
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
