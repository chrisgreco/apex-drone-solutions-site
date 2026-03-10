"use client";

import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/FadeIn";
import { DottedSurface } from "@/components/ui/dotted-surface";
import {
  IconClock,
  IconShield,
  IconChart,
  IconCheckCircle,
  IconFileText,
  IconArrowRight,
  IconZap,
} from "@/components/Icons";

export default function InsuranceClaimsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 text-white overflow-hidden">
        <DottedSurface dotColor={[130, 154, 177]} fogColor={0x0a1929} />
        <div className="container-narrow mx-auto px-5 py-24 md:py-28 relative z-10">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-4">Insurance &amp; Claims</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.08] max-w-3xl">
              Close claims faster with <span className="text-accent-400">drone-captured</span> property data
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-primary-200 max-w-2xl">
              Consistent, high-quality documentation without putting adjusters on damaged roofs.
              Faster triage, fewer supplements, better outcomes.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <Link href="/contact" className="btn-primary mt-8 inline-flex">Schedule a Demo <IconArrowRight className="w-4 h-4" /></Link>
          </FadeIn>
        </div>
      </section>

      {/* Value props */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto">
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <IconClock className="w-5 h-5" />, title: "Faster Cycle Times", desc: "Single site visit. Reports in 48 hours. No rescheduling." },
              { icon: <IconShield className="w-5 h-5" />, title: "Reduced Safety Exposure", desc: "Adjusters stay on the ground. Drones handle steep pitches and storm damage." },
              { icon: <IconChart className="w-5 h-5" />, title: "Consistent Documentation", desc: "Same data standard across every region and pilot. Xactimate-compatible." },
              { icon: <IconZap className="w-5 h-5" />, title: "Rapid Storm Response", desc: "Surge capacity when you need it. Our network scales for CAT events." },
              { icon: <IconFileText className="w-5 h-5" />, title: "Carrier-Grade Reports", desc: "Labeled damage, 3D roof models, measurements, and automated PDF reports." },
              { icon: <IconCheckCircle className="w-5 h-5" />, title: "Fewer Supplements", desc: "Complete all-slope documentation reduces back-and-forth. Get it right the first time." },
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

      {/* Workflow */}
      <section className="section bg-neutral-50">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-500 mb-3">Workflow Integration</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 max-w-lg">Slots into your existing claims process</h2>
          </FadeIn>

          <div className="mt-12 max-w-3xl mx-auto space-y-8">
            {[
              { step: "01", title: "FNOL triggers a request", desc: "Submit the property address via portal, API, or flat-file. Apex handles the rest." },
              { step: "02", title: "Pilot dispatched", desc: "Nearest qualified pilot is matched and scheduled. Confirmation and ETA within minutes." },
              { step: "03", title: "Data captured", desc: "Calibrated flight plans capture all slopes, elevations, and areas of interest." },
              { step: "04", title: "AI processes & annotates", desc: "Computer vision identifies damage, measures facets, generates 3D model. Human QA reviews." },
              { step: "05", title: "Report delivered", desc: "PDF, online viewer, and raw data pushed directly into your claims platform." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="flex gap-5">
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-accent-500 text-white text-sm font-bold">{item.step}</div>
                  <div>
                    <h3 className="font-semibold text-primary-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-neutral-500">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-500 mb-3">Use Cases</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900">From daily claims to catastrophe events</h2>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-2 gap-6 mt-10 max-w-4xl">
            {[
              { title: "Daily Weather Claims", desc: "Hail, wind, and water damage documented with complete, unbiased aerial data." },
              { title: "Catastrophe Response", desc: "Surge pilots into affected regions. Document hundreds of properties per day." },
              { title: "Underwriting Surveys", desc: "Roof condition, age, and material data for new policies or renewals." },
              { title: "Litigation Support", desc: "Time-stamped, geo-tagged evidence from an independent third-party source." },
            ].map((card, i) => (
              <StaggerItem key={i}>
                <div className="border border-neutral-100 rounded-xl p-6">
                  <h3 className="font-semibold text-primary-900">{card.title}</h3>
                  <p className="mt-1.5 text-sm text-neutral-500">{card.desc}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold">See how Apex improves claims operations</h2>
            <p className="mt-3 text-primary-200 max-w-lg mx-auto">We work with carriers of all sizes. Let&apos;s talk volume, markets, and integration.</p>
            <Link href="/contact" className="btn-primary mt-8 inline-flex">Schedule a Demo <IconArrowRight className="w-4 h-4" /></Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
