"use client";

import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { DottedSurface } from "@/components/ui/dotted-surface";
import {
  IconUpload,
  IconDrone,
  IconCamera,
  IconChart,
  IconFileText,
  IconCheckCircle,
  IconArrowRight,
} from "@/components/Icons";

const steps = [
  {
    icon: <IconUpload className="w-6 h-6" />,
    title: "Intake & Request",
    desc: "Submit the property address and scope through our portal, API, or flat-file upload. Confirmation and ETA within minutes.",
    details: ["Single-property or batch uploads", "API for high-volume clients", "Automatic address validation"],
  },
  {
    icon: <IconDrone className="w-6 h-6" />,
    title: "Scheduling & Dispatch",
    desc: "Our platform matches the nearest qualified pilot and schedules the flight based on weather and airspace.",
    details: ["Automatic pilot matching", "Weather and airspace monitoring", "Client notified on scheduling"],
  },
  {
    icon: <IconCamera className="w-6 h-6" />,
    title: "On-Site Drone Operations",
    desc: "Calibrated flight plans capture every slope, flashing, and penetration in high resolution.",
    details: ["Standardized flight plans", "High-res nadir and oblique imagery", "GPS-tagged with metadata"],
  },
  {
    icon: <IconChart className="w-6 h-6" />,
    title: "AI Processing & Analysis",
    desc: "Computer vision detects damage, measures facets, and generates 3D models. Human QA on every report.",
    details: ["Automated damage detection", "3D roof model with measurements", "Human quality review"],
  },
  {
    icon: <IconFileText className="w-6 h-6" />,
    title: "Report Delivery",
    desc: "Structured PDF, interactive online viewer, and raw data. Push directly to your claims platform.",
    details: ["PDF with annotated imagery", "Interactive 3D viewer", "Xactimate-compatible export"],
  },
];

const faqs = [
  { q: "How long does a property documentation take?", a: "The drone flight takes 15-30 minutes. Reports are delivered within 48 hours, with rush options available." },
  { q: "What areas do you cover?", a: "Nationwide via our FAA Part 107 pilot network. Strongest coverage in storm-prone regions: Southeast, Gulf Coast, Midwest, and Texas." },
  { q: "Do you need property access?", a: "In most cases, no. Drones capture from above without entering the property. Some scopes include a brief ground walkthrough." },
  { q: "What data formats do you deliver?", a: "Structured PDF, interactive online viewer with 3D model, high-res imagery, and raw measurement data. Xactimate and Symbility integrations available." },
  { q: "How do you handle weather?", a: "Real-time weather monitoring. Unsuitable conditions trigger automatic rescheduling and client notification." },
  { q: "Can I white-label reports?", a: "Yes. White-label and co-branded options available for carrier and contractor partners." },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 text-white overflow-hidden">
        <DottedSurface dotColor={[130, 154, 177]} fogColor={0x0a1929} />
        <div className="container-narrow mx-auto px-5 py-24 md:py-28 relative z-10">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-4">How It Works</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.08] max-w-3xl">
              From request to report, <span className="text-accent-400">handled end-to-end</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-primary-300 max-w-2xl">
              Submit a request. We handle dispatch, flight, processing, and delivery. You get a complete report.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Timeline */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto max-w-3xl">
          {steps.map((step, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="relative pl-20 pb-14 last:pb-0">
                {i < steps.length - 1 && (
                  <div className="absolute left-[1.22rem] top-14 bottom-0 w-px bg-neutral-200" />
                )}
                <div className="absolute left-0 top-0 w-10 h-10 flex items-center justify-center rounded-lg bg-accent-500 text-white">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-primary-900">
                  <span className="text-accent-500 mr-2">0{i + 1}</span>{step.title}
                </h3>
                <p className="mt-2 text-neutral-500 leading-relaxed">{step.desc}</p>
                <ul className="mt-3 space-y-1.5">
                  {step.details.map((d, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-neutral-600">
                      <IconCheckCircle className="w-3.5 h-3.5 text-accent-500 shrink-0" />{d}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-neutral-50">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <div className="text-center">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-500 mb-3">FAQ</p>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900">Common questions</h2>
            </div>
          </FadeIn>
          <div className="max-w-3xl mx-auto mt-10 space-y-4">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="bg-white border border-neutral-100 rounded-xl p-5">
                  <h3 className="font-semibold text-primary-900">{faq.q}</h3>
                  <p className="mt-1.5 text-sm text-neutral-500 leading-relaxed">{faq.a}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900">Ready to see it in action?</h2>
            <p className="mt-3 text-neutral-500 max-w-md mx-auto">We&apos;ll walk you through a sample report and discuss your workflow.</p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/contact" className="btn-primary">Talk to Sales <IconArrowRight className="w-4 h-4" /></Link>
              <Link href="/become-a-pilot" className="btn-secondary">Join as a Pilot</Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
