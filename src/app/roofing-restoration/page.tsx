import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { Card } from "@/components/Card";
import {
  IconCheckCircle,
  IconCamera,
  IconChart,
  IconShield,
  IconFileText,
  IconHome,
  IconArrowRight,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "Roofing & Restoration",
  description:
    "Win more insurance approvals with complete, objective drone documentation. Pre-storm and post-storm programs for roofing and restoration contractors.",
};

export default function RoofingRestorationPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary-950 text-white">
        <div className="container-narrow mx-auto px-5 py-20 md:py-24">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-400 mb-4">
              Roofing &amp; Restoration
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.12] mb-6">
              Document every slope. Win more approvals.
            </h1>
            <p className="text-lg text-primary-300 leading-relaxed max-w-2xl mb-8">
              Apex gives roofing and restoration contractors the aerial documentation
              they need to support insurance claims, reduce re-inspections, and close
              jobs faster. Complete, objective data that carriers trust.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="btn-primary">
                Get Started
              </Link>
              <Link href="/how-it-works" className="btn-secondary !border-primary-600 !text-primary-200 hover:!bg-primary-900">
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto">
          <SectionHeading
            tag="Why Contractors Choose Apex"
            title="Better documentation means better results"
            description="When the data is thorough and objective, carriers approve faster and supplements drop. Apex gives your team an edge on every file."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            <Card icon={<IconCheckCircle />} title="Win More Approvals">
              Complete, all-slope documentation with damage annotations gives adjusters
              what they need to approve the claim without a return visit.
            </Card>
            <Card icon={<IconCamera />} title="Document Every Detail">
              High-resolution imagery captures damage that&apos;s invisible from a ladder.
              3D models provide accurate measurements for every facet.
            </Card>
            <Card icon={<IconChart />} title="Reduce Re-Inspections">
              When the first report covers everything, there&apos;s no reason for a
              carrier to send someone back. Save time on every project.
            </Card>
            <Card icon={<IconShield />} title="Objective Third-Party Data">
              Apex reports come from independent, certified drone operators&mdash;not
              from your sales team. Carriers trust the source.
            </Card>
            <Card icon={<IconFileText />} title="Professional Reports">
              Branded, structured PDF reports and online viewers that you can share
              with carriers, homeowners, and your own team.
            </Card>
            <Card icon={<IconHome />} title="Pre &amp; Post-Storm Programs">
              Document properties before storm season to establish baseline condition.
              After a storm, mobilize quickly to capture damage across your portfolio.
            </Card>
          </div>
        </div>
      </section>

      {/* How contractors use Apex */}
      <section className="section bg-neutral-50">
        <div className="container-narrow mx-auto">
          <SectionHeading
            tag="How Contractors Use Apex"
            title="From lead to close, Apex supports the entire job"
          />
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-neutral-100 rounded-lg p-7">
              <h3 className="text-lg font-semibold text-primary-900 mb-3">Initial Property Assessment</h3>
              <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                Before you commit resources to a project, get a complete aerial view of the
                property. Identify damage areas, measure the roof, and assess scope.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-neutral-600">
                  <IconCheckCircle className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                  Full roof measurement and slope analysis
                </li>
                <li className="flex items-start gap-2 text-sm text-neutral-600">
                  <IconCheckCircle className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                  Damage identification with annotated imagery
                </li>
                <li className="flex items-start gap-2 text-sm text-neutral-600">
                  <IconCheckCircle className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                  3D model for accurate material estimation
                </li>
              </ul>
            </div>
            <div className="bg-white border border-neutral-100 rounded-lg p-7">
              <h3 className="text-lg font-semibold text-primary-900 mb-3">Insurance Claim Support</h3>
              <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                Submit Apex reports alongside your claim documentation. The objective, structured
                data gives adjusters confidence to approve without delays.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-neutral-600">
                  <IconCheckCircle className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                  Carrier-grade documentation format
                </li>
                <li className="flex items-start gap-2 text-sm text-neutral-600">
                  <IconCheckCircle className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                  Time-stamped, geo-tagged evidence
                </li>
                <li className="flex items-start gap-2 text-sm text-neutral-600">
                  <IconCheckCircle className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                  Independent third-party source
                </li>
              </ul>
            </div>
            <div className="bg-white border border-neutral-100 rounded-lg p-7">
              <h3 className="text-lg font-semibold text-primary-900 mb-3">Pre-Storm Documentation</h3>
              <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                Establish baseline roof condition before storm season. When damage occurs,
                you have clear before-and-after evidence for every property.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-neutral-600">
                  <IconCheckCircle className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                  Baseline condition reports
                </li>
                <li className="flex items-start gap-2 text-sm text-neutral-600">
                  <IconCheckCircle className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                  Portfolio-wide documentation programs
                </li>
                <li className="flex items-start gap-2 text-sm text-neutral-600">
                  <IconCheckCircle className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                  Rapid post-storm comparison reports
                </li>
              </ul>
            </div>
            <div className="bg-white border border-neutral-100 rounded-lg p-7">
              <h3 className="text-lg font-semibold text-primary-900 mb-3">Job Completion Verification</h3>
              <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                After the work is done, document the completed roof from above. Provide
                homeowners and carriers with proof of quality workmanship.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-neutral-600">
                  <IconCheckCircle className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                  Post-installation verification imagery
                </li>
                <li className="flex items-start gap-2 text-sm text-neutral-600">
                  <IconCheckCircle className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                  Quality assurance documentation
                </li>
                <li className="flex items-start gap-2 text-sm text-neutral-600">
                  <IconCheckCircle className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                  Customer-facing completion reports
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-primary-950 text-white">
        <div className="container-narrow mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Give your team the documentation advantage
          </h2>
          <p className="text-lg text-primary-300 max-w-xl mx-auto mb-8">
            Whether you run five crews or fifty, Apex scales with your operation.
            Talk to us about contractor programs and volume pricing.
          </p>
          <Link href="/contact" className="btn-primary text-base">
            Get Started
          </Link>
        </div>
      </section>
    </>
  );
}
