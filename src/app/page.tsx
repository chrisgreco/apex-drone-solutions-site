import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { Card, StatCard, StepCard } from "@/components/Card";
import {
  IconShield,
  IconClock,
  IconChart,
  IconCamera,
  IconUsers,
  IconCheckCircle,
  IconDrone,
  IconHome,
  IconTool,
  IconArrowRight,
} from "@/components/Icons";

export default function HomePage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="bg-primary-950 text-white">
        <div className="container-narrow mx-auto px-5 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-400 mb-4">
              Nationwide Drone Documentation
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold leading-[1.12] mb-6">
              Drone-powered roof &amp; property condition documentation for insurance and roofing teams
            </h1>
            <p className="text-lg md:text-xl text-primary-300 leading-relaxed max-w-2xl mb-8">
              We deploy FAA-certified pilots with commercial drones to capture every slope,
              every detail. Our AI turns that data into carrier-grade reports&mdash;faster,
              safer, and more consistent than manual methods.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="btn-primary text-base">
                Talk to Sales
              </Link>
              <Link href="/how-it-works" className="btn-secondary !border-primary-600 !text-primary-200 hover:!bg-primary-900">
                Request Inspection Coverage
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who We Serve ───────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto">
          <SectionHeading
            tag="Who We Serve"
            title="Built for the teams that document, assess, and repair properties"
            description="Whether you manage a carrier claims operation, run an IA firm, or lead a roofing crew, Apex gives you better data without changing how you work."
          />
          <div className="grid md:grid-cols-3 gap-7">
            <Card icon={<IconShield />} title="Insurance Carriers">
              Reduce cycle times, improve documentation consistency, and keep adjusters off roofs.
              Apex integrates with your existing claims and estimating workflows.
            </Card>
            <Card icon={<IconUsers />} title="Independent Adjusters">
              Get comprehensive property documentation delivered to your desk.
              Focus on the estimate while we handle the fieldwork and data capture.
            </Card>
            <Card icon={<IconTool />} title="Roofing &amp; Restoration">
              Win more approvals with thorough, objective documentation.
              Pre-storm and post-storm programs that protect your revenue and reputation.
            </Card>
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────── */}
      <section className="section bg-neutral-50">
        <div className="container-narrow mx-auto">
          <SectionHeading
            tag="How It Works"
            title="From request to report in 48 hours"
            description="Three steps. No complexity on your end."
          />
          <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            <StepCard number="01" title="Submit a Request">
              Enter the property address and scope through our portal or API.
              We handle scheduling and pilot dispatch automatically.
            </StepCard>
            <StepCard number="02" title="Drone Captures Data">
              A local FAA Part 107 pilot flies the property, capturing high-resolution
              imagery, measurements, and 3D roof models on-site.
            </StepCard>
            <StepCard number="03" title="AI-Driven Report Delivered">
              Our platform processes the data with computer vision and delivers
              a carrier-grade PDF and interactive online report to your inbox.
            </StepCard>
          </div>
          <div className="text-center mt-12">
            <Link href="/how-it-works" className="inline-flex items-center gap-2 text-sm font-semibold text-accent-600 hover:text-accent-700">
              See the full workflow <IconArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Benefits ───────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto">
          <SectionHeading
            tag="Why Apex"
            title="Better data, delivered faster"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
            <Card icon={<IconClock />} title="Faster Turnaround">
              Reports delivered within 48 hours of the flight. Rush turnaround available for storm events.
            </Card>
            <Card icon={<IconShield />} title="Safer Operations">
              Keep adjusters and inspectors on the ground. Our pilots and drones handle steep, damaged, or hazardous roofs.
            </Card>
            <Card icon={<IconChart />} title="Consistent Quality">
              Every report follows the same structured format. No variability between inspectors or regions.
            </Card>
            <Card icon={<IconCamera />} title="Complete Documentation">
              High-resolution imagery of every slope, flashing, and penetration. 3D models with accurate measurements.
            </Card>
          </div>
        </div>
      </section>

      {/* ── Proof / Stats Strip ────────────────────────────────── */}
      <section className="bg-primary-950">
        <div className="container-narrow mx-auto px-5 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard value="48hr" label="Average report delivery" />
            <StatCard value="10K+" label="Properties documented" />
            <StatCard value="50+" label="Markets covered" />
            <StatCard value="99.4%" label="Pilot completion rate" />
          </div>
        </div>
      </section>

      {/* ── Pilot Network ──────────────────────────────────────── */}
      <section className="section bg-neutral-50">
        <div className="container-narrow mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-500 mb-3">
                Pilot Network
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 leading-tight mb-4">
                A nationwide network of certified drone operators
              </h2>
              <p className="text-neutral-500 leading-relaxed mb-6">
                Every Apex pilot holds an FAA Part 107 certificate and carries commercial liability
                insurance. They&apos;re trained on our documentation standards and equipped with the
                hardware to capture roof-grade data in a single visit.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/become-a-pilot" className="btn-primary">
                  Join Our Pilot Network
                </Link>
              </div>
            </div>
            <div className="bg-primary-100 rounded-lg aspect-[4/3] flex items-center justify-center">
              <div className="text-center text-primary-400">
                <IconDrone className="w-16 h-16 mx-auto mb-3" />
                <span className="text-sm font-medium">Pilot operations imagery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
            Ready to modernize your property documentation?
          </h2>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto mb-8">
            Talk to our team about coverage in your region, volume pricing, and how Apex fits into your existing workflow.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary text-base">
              Talk to Sales
            </Link>
            <Link href="/how-it-works" className="btn-secondary text-base">
              See How It Works
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
