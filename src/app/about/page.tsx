"use client";

import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/FadeIn";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { IconCheckCircle, IconUsers, IconArrowRight } from "@/components/Icons";

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 text-white overflow-hidden">
        <DottedSurface dotColor={[130, 154, 177]} fogColor={0x000000} />
        <div className="container-narrow mx-auto px-5 py-24 md:py-28 relative z-10">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-4">About Apex</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.08] max-w-3xl">
              Better property data. <span className="text-accent-400">Safely and fast.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-primary-200 max-w-2xl">
              Drones plus AI are the most practical way to deliver property documentation at scale.
              We built Apex on that thesis.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Thesis */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <div>
              <FadeIn>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-500 mb-3">Our Thesis</p>
                <h2 className="text-3xl md:text-4xl font-bold text-primary-900 leading-tight">Why this matters now</h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="mt-6 space-y-4 text-neutral-500 leading-relaxed">
                  <p>
                    America&apos;s housing stock is aging. Severe weather is increasing. The traditional
                    ways of getting property data are slow, inconsistent, and dangerous.
                  </p>
                  <p>
                    Drone-captured data eliminates those problems. Every slope documented. Every image
                    time-stamped. AI processing ensures consistency across every report.
                  </p>
                  <p>
                    We&apos;re not replacing adjusters. We&apos;re giving them better, faster, safer
                    data. AI is our infrastructure, not our product.
                  </p>
                </div>
              </FadeIn>
            </div>
            <StaggerContainer className="space-y-4">
              {[
                { label: "Aging housing stock", detail: "50% of U.S. homes built before 1980. Documentation gaps widening." },
                { label: "Increasing storm severity", detail: "Frequency and cost of severe weather rising, straining claims ops." },
                { label: "Workforce challenges", detail: "Adjuster workforce aging. Fewer people climbing damaged roofs." },
                { label: "Technology readiness", detail: "Commercial drones, LiDAR, and computer vision now mature enough for reliable automation." },
              ].map((item, i) => (
                <StaggerItem key={i}>
                  <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-5">
                    <h4 className="font-semibold text-primary-900">{item.label}</h4>
                    <p className="mt-1 text-sm text-neutral-500">{item.detail}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Model */}
      <section className="section bg-neutral-50">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-500 mb-3">Our Model</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900">National network, powered by technology</h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-6 mt-10 max-w-4xl">
            {[
              { title: "Pilot Network", desc: "FAA Part 107 operators trained on Apex standards.", items: ["Vetted and credentialed", "Insurance documentation training", "Scalable for storm surge"] },
              { title: "Technology Platform", desc: "Dispatch, processing, QA, and report generation.", items: ["Automated scheduling", "AI damage detection", "3D modeling and measurement"] },
            ].map((col, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white border border-neutral-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-primary-900">{col.title}</h3>
                  <p className="mt-2 text-sm text-neutral-500">{col.desc}</p>
                  <ul className="mt-4 space-y-2">
                    {col.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-neutral-600">
                        <IconCheckCircle className="w-3.5 h-3.5 text-accent-500 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-500 mb-3">Values</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900">What guides us</h2>
          </FadeIn>
          <StaggerContainer className="grid sm:grid-cols-2 gap-8 mt-10 max-w-4xl">
            {[
              { title: "Safety First", desc: "Every decision starts with safety — for pilots, people on the ground, and data integrity." },
              { title: "Accuracy Over Speed", desc: "We move fast but never at the cost of data quality. Human QA on every report." },
              { title: "Reliability at Scale", desc: "Built for volume without compromising standards." },
              { title: "Transparency", desc: "Objective documentation. Visible processes. Clients know exactly what they're getting." },
            ].map((v, i) => (
              <StaggerItem key={i}>
                <div className="border-l-2 border-accent-500 pl-5">
                  <h3 className="font-semibold text-primary-900">{v.title}</h3>
                  <p className="mt-1 text-sm text-neutral-500">{v.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Leadership */}
      <section className="section bg-neutral-50">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-500 mb-3">Leadership</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900">The team behind Apex</h2>
          </FadeIn>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 max-w-5xl">
            {[
              { role: "Chief Executive Officer", bg: "Insurance technology and field services." },
              { role: "Chief Technology Officer", bg: "Computer vision and platform engineering." },
              { role: "VP of Operations", bg: "Drone operations and FAA compliance." },
              { role: "VP of Sales", bg: "Carrier relationships and enterprise sales." },
            ].map((p, i) => (
              <StaggerItem key={i}>
                <div className="bg-white border border-neutral-100 rounded-xl p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
                    <IconUsers className="w-6 h-6 text-primary-400" />
                  </div>
                  <p className="text-xs font-medium text-accent-500 mb-1">{p.role}</p>
                  <p className="text-xs text-neutral-400">{p.bg}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900">Want to work with us?</h2>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/contact" className="btn-primary">Contact Us <IconArrowRight className="w-4 h-4" /></Link>
              <Link href="/become-a-pilot" className="btn-secondary">Become a Pilot</Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
