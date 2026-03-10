"use client";

import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/FadeIn";
import { DottedSurface } from "@/components/ui/dotted-surface";
import {
  IconCheckCircle,
  IconCamera,
  IconChart,
  IconShield,
  IconFileText,
  IconHome,
  IconArrowRight,
} from "@/components/Icons";

export default function RoofingRestorationPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 text-white overflow-hidden">
        <DottedSurface dotColor={[130, 154, 177]} fogColor={0x0a1929} />
        <div className="container-narrow mx-auto px-5 py-24 md:py-28 relative z-10">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-4">Roofing &amp; Restoration</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.08] max-w-3xl">
              Document every slope. <span className="text-accent-400">Win more approvals.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-primary-300 max-w-2xl">
              Aerial documentation that carriers trust. Reduce re-inspections, close jobs faster, and protect your revenue with objective third-party data.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/contact" className="btn-primary">Get Started <IconArrowRight className="w-4 h-4" /></Link>
              <Link href="/how-it-works" className="btn-ghost">See How It Works</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Value props */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-500 mb-3">Why Contractors Choose Apex</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 max-w-lg">Better documentation, better results</h2>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[
              { icon: <IconCheckCircle className="w-5 h-5" />, title: "Win More Approvals", desc: "All-slope documentation with damage annotations. Adjusters approve without return visits." },
              { icon: <IconCamera className="w-5 h-5" />, title: "Document Every Detail", desc: "High-res imagery captures damage invisible from a ladder. 3D models with accurate measurements." },
              { icon: <IconChart className="w-5 h-5" />, title: "Reduce Re-Inspections", desc: "First report covers everything. No reason for the carrier to send someone back." },
              { icon: <IconShield className="w-5 h-5" />, title: "Third-Party Objectivity", desc: "Reports from independent, certified operators. Carriers trust the source." },
              { icon: <IconFileText className="w-5 h-5" />, title: "Professional Reports", desc: "Branded PDF reports and online viewers for carriers, homeowners, and your team." },
              { icon: <IconHome className="w-5 h-5" />, title: "Pre & Post-Storm", desc: "Baseline documentation before storm season. Rapid damage capture after." },
            ].map((card, i) => (
              <StaggerItem key={i}>
                <div className="border border-neutral-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary-50 text-primary-700">{card.icon}</div>
                  <h3 className="mt-4 font-semibold text-primary-900">{card.title}</h3>
                  <p className="mt-1.5 text-sm text-neutral-500 leading-relaxed">{card.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Use cases */}
      <section className="section bg-neutral-50">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-500 mb-3">How Contractors Use Apex</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900">From lead to close</h2>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-2 gap-6 mt-10 max-w-4xl">
            {[
              { title: "Initial Assessment", items: ["Full roof measurement and slope analysis", "Damage identification with annotated imagery", "3D model for accurate material estimation"] },
              { title: "Insurance Claim Support", items: ["Carrier-grade documentation format", "Time-stamped, geo-tagged evidence", "Independent third-party source"] },
              { title: "Pre-Storm Documentation", items: ["Baseline condition reports", "Portfolio-wide documentation programs", "Rapid post-storm comparison reports"] },
              { title: "Job Completion Verification", items: ["Post-installation verification imagery", "Quality assurance documentation", "Customer-facing completion reports"] },
            ].map((card, i) => (
              <StaggerItem key={i}>
                <div className="bg-white border border-neutral-100 rounded-xl p-6">
                  <h3 className="font-semibold text-primary-900 mb-3">{card.title}</h3>
                  <ul className="space-y-2">
                    {card.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-neutral-600">
                        <IconCheckCircle className="w-4 h-4 text-accent-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-primary-950 text-white overflow-hidden">
        <DottedSurface dotColor={[100, 130, 160]} fogColor={0x0a1929} className="opacity-50" />
        <div className="container-narrow mx-auto px-5 py-20 text-center relative z-10">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold">Give your team the documentation advantage</h2>
            <p className="mt-3 text-primary-300 max-w-lg mx-auto">Five crews or fifty, Apex scales with your operation.</p>
            <Link href="/contact" className="btn-primary mt-8 inline-flex">Get Started <IconArrowRight className="w-4 h-4" /></Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
