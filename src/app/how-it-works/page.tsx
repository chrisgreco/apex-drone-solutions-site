"use client";

import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/FadeIn";
import { GridBackground } from "@/components/ui/grid-background";
import {
  IconPhone,
  IconMap,
  IconClock,
  IconDrone,
  IconBarChart,
  IconArrowRight,
  IconCheckCircle,
  IconDroplet,
  IconTruck,
} from "@/components/Icons";

const steps = [
  {
    icon: <IconPhone className="w-5 h-5" />,
    number: "STEP_01",
    title: "Quote Request",
    description:
      "Submit your field details through our intake form. We need field size, crop type, location, and current spray method. No commitment — just data for an accurate quote.",
    details: [
      "Field size in acres",
      "Crop type and growth stage",
      "Location (county and town)",
      "Current spray method (ground rig, airplane, manual)",
      "Product to be applied (or we can recommend)",
    ],
    note: "Response time: < 24 hours. Usually same day.",
    status: "INTAKE",
  },
  {
    icon: <IconMap className="w-5 h-5" />,
    number: "STEP_02",
    title: "Field Assessment",
    description:
      "We review your fields using satellite imagery to map terrain, obstacles, and layout. For specialty crops like blueberries or orchards, we may schedule an on-site recon.",
    details: [
      "Satellite imagery review of field boundaries",
      "Terrain and obstacle identification",
      "Flight path planning for complete coverage",
      "Weather window analysis for your area",
      "Chemical requirements discussion with your agronomist",
    ],
    note: "No charge for field assessment — included in our quoting process.",
    status: "RECON",
  },
  {
    icon: <IconClock className="w-5 h-5" />,
    number: "STEP_03",
    title: "Scheduling",
    description:
      "Once you approve the quote, we lock your spray window. We monitor weather forecasts and schedule during optimal conditions for maximum product effectiveness.",
    details: [
      "Wind speed below 10 mph for drift control",
      "No rain forecast for 2+ hours post-application",
      "Temperature within product label requirements",
      "Early morning or late evening for best absorption",
      "Flexible rescheduling if conditions change",
    ],
    note: "Confirmation via text and email with your scheduled window.",
    status: "LOCKED",
  },
  {
    icon: <IconTruck className="w-5 h-5" />,
    number: "STEP_04",
    title: "Preparation",
    description:
      "Day of ops. Our crew arrives with the full mobile command setup — truck, trailer, drones, batteries, mixing equipment. Setup takes approximately 30 minutes before the first sortie.",
    details: [
      "RTK base station deployment for cm-level GPS",
      "Spray system calibration and nozzle check",
      "Chemical mixing per agronomist specifications",
      "Battery pre-flight checks and charging",
      "30-point pre-flight safety inspection",
    ],
    note: "Self-contained operation. We bring everything.",
    status: "STAGING",
  },
  {
    icon: <IconDrone className="w-5 h-5" />,
    number: "STEP_05",
    title: "Precision Application",
    description:
      "The DJI Agras T25 flies autonomous GPS-guided paths across your field. Our operator monitors every pass in real time — watching coverage, wind changes, and obstacles.",
    details: [
      "Autonomous GPS-guided flight paths with overlap",
      "Real-time flow rate and coverage monitoring",
      "5-7 GPA application rate (adjustable)",
      "Terrain-following radar maintains consistent height",
      "Multiple sorties for large fields with battery swaps",
    ],
    note: "Coverage rate: 20 ac/hr. A 40-acre field is done before lunch.",
    status: "ACTIVE",
  },
  {
    icon: <IconBarChart className="w-5 h-5" />,
    number: "STEP_06",
    title: "Coverage Report",
    description:
      "Same day, you receive a GPS coverage map showing exactly where product was applied. This telemetry becomes part of your spray records for compliance and future planning.",
    details: [
      "GPS map of exact spray coverage area",
      "Product type and rate applied per zone",
      "Weather conditions during application",
      "Total acres treated and product used",
      "Digital archive for compliance records",
    ],
    note: "Reports delivered as PDF via email. We maintain copies for your records.",
    status: "COMPLETE",
  },
];

const faqs = [
  {
    q: "What's the minimum field size you'll spray?",
    a: "No hard minimum, but economics work best at 5+ acres. For fields under 5 acres, a mobilization fee may apply to cover setup time. Call us and we'll work something out.",
  },
  {
    q: "What crops do you spray?",
    a: "Blueberries, cranberries, soybeans, corn, wheat, vegetables, orchard fruits, and specialty crops. If you grow it in NJ, we've probably sprayed it or can figure out how.",
  },
  {
    q: "What happens if the weather is bad on my scheduled day?",
    a: "We monitor weather closely and reschedule if conditions are unsafe or would reduce product effectiveness. Wind above 10 mph, rain within 2 hours, or temperature inversions trigger a reschedule at no extra cost.",
  },
  {
    q: "How should I prepare my field before you arrive?",
    a: "Ensure vehicle access to the field edge, remove temporary obstacles not shown on maps, and notify neighbors about drone operations. If animals are in adjacent fields, let us know so we can plan accordingly.",
  },
  {
    q: "Can you spray any chemical?",
    a: "We handle most liquid-formulation products compatible with drone application: fungicides, pesticides, herbicides, foliar nutrients, and desiccants. We follow all label requirements. Your agronomist specifies the product and rate.",
  },
  {
    q: "How fast can you respond to urgent requests?",
    a: "Standard turnaround from quote approval to spray is 3-5 business days. For urgent situations like sudden pest pressure, we accommodate rush requests within 24-48 hours when possible.",
  },
  {
    q: "How does pricing compare to traditional methods?",
    a: "Drone spraying runs $16-25 per acre depending on the job. Competitive with aerial airplane application and often less expensive than custom ground rigs, especially for smaller fields or specialty crops where ground equipment causes damage.",
  },
  {
    q: "Is it safe for people and animals nearby?",
    a: "Yes. We follow strict buffer zones per product labels. The drone's downwash reduces drift compared to airplanes. All operations comply with FAA and EPA regulations.",
  },
  {
    q: "Do I need to be present during the spray?",
    a: "Helpful but not required. We need advance access to the field and clear communication about boundaries and exclusion zones. Many farmers meet us at setup, then go about their day.",
  },
  {
    q: "What certifications do your pilots have?",
    a: "All operators hold FAA Part 107 Remote Pilot Certificates with appropriate insurance. We're registered with the New Jersey Department of Agriculture for commercial pesticide application.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 overflow-hidden min-h-[55vh] flex items-center">
        <GridBackground />
        <div className="container-narrow mx-auto px-5 py-24 md:py-32 relative z-10">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Mission Protocol
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.08] text-white max-w-4xl">
              From First Contact to{" "}
              <span className="text-accent-400">Coverage Report</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-white/60 max-w-2xl">
              Six-step operational workflow from quote request to GPS-verified
              coverage data. No surprises, no guesswork — every phase is
              documented and transparent.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Steps Timeline */}
      <section className="relative bg-primary-900 py-20 md:py-28 tech-grid">
        <div className="container-narrow mx-auto px-5 max-w-3xl">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Operations Sequence
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-14">
              Mission Workflow
            </h2>
          </FadeIn>

          {steps.map((step, i) => (
            <FadeIn key={i} delay={i * 0.06}>
              <div className="relative pl-20 pb-16 last:pb-0">
                {/* Cyan connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[1.22rem] top-14 bottom-0 w-px bg-gradient-to-b from-accent-400/40 to-accent-400/10" />
                )}
                {/* Step icon */}
                <div className="absolute left-0 top-0 w-10 h-10 flex items-center justify-center rounded-lg bg-accent-900/60 border border-accent-500/20 text-accent-400">
                  {step.icon}
                </div>

                {/* Content card */}
                <div className="bg-white/[0.03] border border-accent-500/10 rounded-2xl p-6 backdrop-blur-sm hud-corners hover:border-accent-400/30 hover:bg-white/[0.06] transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold font-mono text-accent-400 tracking-wider">
                        {step.number}
                      </span>
                      <h3 className="text-lg font-semibold text-white">
                        {step.title}
                      </h3>
                    </div>
                    <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-green-400 tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      {step.status}
                    </span>
                  </div>

                  <p className="text-white/50 leading-relaxed text-sm">
                    {step.description}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {step.details.map((d, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm text-white/40"
                      >
                        <IconCheckCircle className="w-3.5 h-3.5 text-accent-400/60 shrink-0 mt-0.5" />
                        {d}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 bg-accent-900/40 border border-accent-500/10 rounded-lg px-4 py-2.5 inline-block">
                    <p className="text-xs text-accent-400/80 font-mono">
                      {step.note}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="relative bg-primary-950 py-20 md:py-28">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <div className="text-center">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
                // FAQ Database
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Common Questions
              </h2>
              <p className="mt-3 text-white/50 max-w-lg mx-auto">
                Straight answers to the questions we hear most. Don&apos;t see
                yours? Give us a call.
              </p>
            </div>
          </FadeIn>

          <div className="max-w-3xl mx-auto mt-10 space-y-4">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.04}>
                <div className="bg-white/[0.03] border border-accent-500/10 rounded-xl p-6 hover:border-accent-400/30 hover:bg-white/[0.06] transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <span className="text-[10px] font-mono text-accent-400/50 bg-accent-900/60 rounded px-1.5 py-0.5 shrink-0 mt-0.5">
                      Q{String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{faq.q}</h3>
                      <p className="mt-2 text-sm text-white/50 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-primary-900 py-20 md:py-28 overflow-hidden">
        <GridBackground />
        <div className="container-narrow mx-auto px-5 text-center relative z-10">
          <FadeIn>
            <div className="w-14 h-14 rounded-full bg-accent-900/60 border border-accent-500/20 flex items-center justify-center mx-auto mb-6">
              <IconDroplet className="w-7 h-7 text-accent-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Initiate?
            </h2>
            <p className="mt-3 text-white/50 max-w-lg mx-auto">
              Get a free, no-obligation quote for your farm. Tell us what you
              grow and we&apos;ll deploy a precision plan for your operation.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/contact" className="btn-primary">
                Get a Quote <IconArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/services" className="btn-ghost">
                View All Services
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
