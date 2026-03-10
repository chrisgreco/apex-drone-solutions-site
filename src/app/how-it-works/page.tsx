import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import {
  IconUpload,
  IconDrone,
  IconCamera,
  IconChart,
  IconFileText,
  IconCheckCircle,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "See how Apex Drone Solutions handles property documentation end-to-end: from intake and scheduling to drone flight, AI processing, and report delivery.",
};

const steps = [
  {
    icon: <IconUpload className="w-7 h-7" />,
    title: "Intake & Request",
    description:
      "Submit the property address, scope, and any special instructions through our client portal, API, or flat-file upload. Apex confirms the request and provides an estimated completion date within minutes.",
    details: [
      "Single-property or batch uploads",
      "API integration for high-volume clients",
      "Automatic address validation and geocoding",
    ],
  },
  {
    icon: <IconDrone className="w-7 h-7" />,
    title: "Scheduling & Dispatch",
    description:
      "Our platform identifies the closest qualified pilot and schedules the flight based on weather, airspace, and client priority. The pilot receives a detailed job packet with flight parameters.",
    details: [
      "Automatic pilot matching by location and availability",
      "Weather and airspace monitoring",
      "Client notified when flight is scheduled",
    ],
  },
  {
    icon: <IconCamera className="w-7 h-7" />,
    title: "On-Site Drone Operations",
    description:
      "The pilot flies the property using calibrated flight plans designed for insurance-grade documentation. Every slope, flashing, penetration, and elevation is captured in high resolution.",
    details: [
      "Standardized flight plans for consistency",
      "High-resolution nadir and oblique imagery",
      "GPS-tagged photos with altitude and orientation metadata",
    ],
  },
  {
    icon: <IconChart className="w-7 h-7" />,
    title: "AI Processing & Analysis",
    description:
      "Raw imagery is uploaded to our processing pipeline. Computer vision models detect damage patterns, measure roof facets, and generate 3D models. Human QA analysts review every output before delivery.",
    details: [
      "Automated damage detection and annotation",
      "3D roof model with measurements",
      "Human quality review on every report",
    ],
  },
  {
    icon: <IconFileText className="w-7 h-7" />,
    title: "Report Delivery",
    description:
      "The completed report is delivered as a structured PDF, an interactive online viewer, and raw data files. Reports can be pushed directly to your claims management or estimating platform.",
    details: [
      "PDF report with annotated imagery",
      "Online interactive viewer with 3D model",
      "Data export compatible with Xactimate and other tools",
    ],
  },
];

const faqs = [
  {
    q: "How long does a typical property documentation take?",
    a: "The on-site drone flight takes 15–30 minutes depending on property size and complexity. Reports are delivered within 48 hours of the flight, with rush options available.",
  },
  {
    q: "What areas do you cover?",
    a: "Apex operates nationwide through our network of FAA Part 107 certified pilots. We currently have the strongest coverage in storm-prone regions across the Southeast, Gulf Coast, Midwest, and Texas. We're expanding coverage continuously.",
  },
  {
    q: "Do you need access to the property?",
    a: "In most cases, no. Drones capture data from above without needing to enter the property or access the roof. For certain scopes, a brief ground-level walkthrough may be included.",
  },
  {
    q: "What data formats do you deliver?",
    a: "Reports include a structured PDF, an interactive online viewer with 3D model, high-resolution imagery, and raw measurement data. We also offer integrations with Xactimate, Symbility, and other estimating tools.",
  },
  {
    q: "How do you handle weather delays?",
    a: "Our platform monitors weather conditions in real time. If conditions are unsuitable for flight, we automatically reschedule and notify you. Safety is never compromised for speed.",
  },
  {
    q: "Is the data compliant with carrier documentation standards?",
    a: "Yes. Apex reports are designed to meet the documentation requirements of major insurance carriers. Every image is time-stamped, geo-tagged, and captured with calibrated equipment.",
  },
  {
    q: "Can I white-label the reports?",
    a: "Yes. We offer white-label and co-branded report options for carrier and contractor partners. Contact our team for details.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary-950 text-white">
        <div className="container-narrow mx-auto px-5 py-20 md:py-24">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-400 mb-4">
              How It Works
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.12] mb-6">
              From request to report, handled end-to-end
            </h1>
            <p className="text-lg text-primary-300 leading-relaxed max-w-2xl">
              Apex manages the entire documentation workflow so you can focus on
              your claims, estimates, and projects. Here&apos;s what happens after
              you submit a request.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto">
          <div className="max-w-3xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="relative pl-20 pb-14 last:pb-0">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[1.34rem] top-14 bottom-0 w-px bg-neutral-200" />
                )}
                {/* Icon */}
                <div className="absolute left-0 top-0 w-11 h-11 flex items-center justify-center rounded-lg bg-accent-500 text-white">
                  {step.icon}
                </div>

                <h3 className="text-xl font-semibold text-primary-900 mb-2">
                  <span className="text-accent-500 mr-2">0{i + 1}</span>
                  {step.title}
                </h3>
                <p className="text-neutral-500 leading-relaxed mb-4">
                  {step.description}
                </p>
                <ul className="space-y-2">
                  {step.details.map((d, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-neutral-600">
                      <IconCheckCircle className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-neutral-50">
        <div className="container-narrow mx-auto">
          <SectionHeading
            tag="FAQ"
            title="Common questions"
          />
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-neutral-100 rounded-lg p-6">
                <h3 className="text-base font-semibold text-primary-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
            Ready to see it in action?
          </h2>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto mb-8">
            We can walk you through a sample report and discuss how Apex fits your workflow.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary text-base">
              Talk to Sales
            </Link>
            <Link href="/become-a-pilot" className="btn-secondary text-base">
              Join as a Pilot
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
