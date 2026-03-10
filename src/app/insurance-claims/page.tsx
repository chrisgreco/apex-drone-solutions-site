import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { Card, StepCard } from "@/components/Card";
import {
  IconClock,
  IconShield,
  IconChart,
  IconCheckCircle,
  IconFileText,
  IconArrowRight,
  IconZap,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "Insurance & Claims",
  description:
    "Faster, safer property documentation for insurance carriers, claim leaders, and vendor managers. Reduce cycle times and improve triage after storm events.",
};

export default function InsuranceClaimsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary-950 text-white">
        <div className="container-narrow mx-auto px-5 py-20 md:py-24">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-400 mb-4">
              Insurance &amp; Claims
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.12] mb-6">
              Close claims faster with drone-captured property data
            </h1>
            <p className="text-lg text-primary-300 leading-relaxed max-w-2xl mb-8">
              Apex gives carrier claims teams and vendor managers consistent,
              high-quality property documentation&mdash;without putting adjusters
              on damaged roofs. Faster triage, fewer supplements, and better outcomes
              on every file.
            </p>
            <Link href="/contact" className="btn-primary">
              Schedule a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Pain points / value */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto">
          <SectionHeading
            tag="The Challenge"
            title="Traditional roof inspections slow down every claim"
            description="Manual inspections are weather-dependent, inconsistent between adjusters, and create safety exposure. Supplements and re-inspections add days to cycle time."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            <Card icon={<IconClock />} title="Faster Cycle Times">
              Drone documentation is completed in a single site visit and reports are delivered
              within 48 hours. No rescheduling, no return trips.
            </Card>
            <Card icon={<IconShield />} title="Reduced Safety Exposure">
              Adjusters stay on the ground. Drones handle steep pitches, fire-damaged structures,
              and active storm areas without risk.
            </Card>
            <Card icon={<IconChart />} title="Consistent Documentation">
              Every report follows the same data standard regardless of region or pilot.
              Structured outputs that integrate with Xactimate and other estimating tools.
            </Card>
            <Card icon={<IconZap />} title="Rapid Storm Response">
              Surge capacity when you need it. Our pilot network scales to meet catastrophe
              volume in the markets that matter most.
            </Card>
            <Card icon={<IconFileText />} title="Carrier-Grade Reports">
              High-resolution imagery, labeled damage annotations, 3D roof models with
              measurements, and automated PDF reports ready for the claim file.
            </Card>
            <Card icon={<IconCheckCircle />} title="Fewer Supplements">
              Complete, all-slope documentation reduces the back-and-forth between desk
              adjusters and field teams. Get it right the first time.
            </Card>
          </div>
        </div>
      </section>

      {/* Workflow integration */}
      <section className="section bg-neutral-50">
        <div className="container-narrow mx-auto">
          <SectionHeading
            tag="Workflow Integration"
            title="Apex fits into your existing claims process"
            description="No new systems to learn. Apex slots into the flow between FNOL and estimate."
          />
          <div className="max-w-3xl mx-auto space-y-10">
            <StepCard number="01" title="FNOL triggers a request">
              When a claim is filed, submit the property address and scope through our portal,
              API, or flat-file integration. Apex takes it from there.
            </StepCard>
            <StepCard number="02" title="Pilot dispatched automatically">
              Our platform matches the job to the nearest qualified pilot and schedules the
              flight. You receive a confirmation and ETA within minutes.
            </StepCard>
            <StepCard number="03" title="Drone captures property data">
              The pilot captures all roof slopes, elevations, and areas of interest using
              calibrated flight plans optimized for insurance documentation.
            </StepCard>
            <StepCard number="04" title="AI processes and annotates">
              Computer vision identifies damage signatures, measures roof facets, and
              generates a 3D model. Human QA reviews every report before delivery.
            </StepCard>
            <StepCard number="05" title="Report delivered to your system">
              The completed report&mdash;PDF, online viewer, and raw data&mdash;is delivered
              to the adjuster or pushed directly into your claims platform.
            </StepCard>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto">
          <SectionHeading
            tag="Use Cases"
            title="From daily claims to catastrophe events"
          />
          <div className="grid md:grid-cols-2 gap-7 max-w-4xl mx-auto">
            <div className="border border-neutral-100 rounded-lg p-7">
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Daily / Weather Claims</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Hail, wind, and water damage claims benefit from complete, unbiased
                aerial documentation that eliminates the need for adjuster roof access.
              </p>
            </div>
            <div className="border border-neutral-100 rounded-lg p-7">
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Catastrophe Response</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                After a major storm, Apex surges pilots into affected regions to document
                hundreds of properties per day, helping carriers triage and prioritize.
              </p>
            </div>
            <div className="border border-neutral-100 rounded-lg p-7">
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Underwriting Surveys</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Capture roof condition, age, and material data for new policies or
                renewals without scheduling a physical inspection.
              </p>
            </div>
            <div className="border border-neutral-100 rounded-lg p-7">
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Litigation Support</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Time-stamped, geo-tagged aerial evidence that holds up in disputes.
                Objective documentation from a third-party source.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-primary-950 text-white">
        <div className="container-narrow mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See how Apex can improve your claims operation
          </h2>
          <p className="text-lg text-primary-300 max-w-xl mx-auto mb-8">
            We work with carriers of all sizes. Let&apos;s talk about your volume, your
            markets, and how drone documentation fits your workflow.
          </p>
          <Link href="/contact" className="btn-primary text-base">
            Schedule a Demo
          </Link>
        </div>
      </section>
    </>
  );
}
