import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { IconCheckCircle, IconUsers } from "@/components/Icons";

export const metadata: Metadata = {
  title: "About",
  description:
    "Apex Drone Solutions combines a nationwide pilot network with AI-powered processing to deliver faster, safer property documentation for insurance and roofing professionals.",
};

const values = [
  {
    title: "Safety First",
    description:
      "Every decision starts with safety — for our pilots, for the people on the ground, and for the integrity of the data we deliver.",
  },
  {
    title: "Accuracy Over Speed",
    description:
      "We move fast, but never at the cost of data quality. Every report is reviewed by a human analyst before it reaches a client.",
  },
  {
    title: "Reliability at Scale",
    description:
      "Insurance and roofing teams depend on consistent delivery. Our systems and processes are built for volume without compromising standards.",
  },
  {
    title: "Transparency",
    description:
      "Our documentation is objective and our processes are visible. Clients know exactly what they're getting and when they'll get it.",
  },
];

const leadership = [
  {
    name: "Leadership Position",
    role: "Chief Executive Officer",
    bio: "Background in insurance technology and field services operations.",
  },
  {
    name: "Leadership Position",
    role: "Chief Technology Officer",
    bio: "Background in computer vision, geospatial data, and platform engineering.",
  },
  {
    name: "Leadership Position",
    role: "VP of Operations",
    bio: "Background in drone operations, FAA compliance, and pilot network management.",
  },
  {
    name: "Leadership Position",
    role: "VP of Sales",
    bio: "Background in insurance carrier relationships and enterprise sales.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary-950 text-white">
        <div className="container-narrow mx-auto px-5 py-20 md:py-24">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-400 mb-4">
              About Apex
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.12] mb-6">
              Better property data. Delivered safely, consistently, and fast.
            </h1>
            <p className="text-lg text-primary-300 leading-relaxed max-w-2xl">
              Apex Drone Solutions was built on a simple thesis: the insurance and
              roofing industries need better property documentation, and drones
              plus AI are the most practical way to deliver it at scale.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-500 mb-3">
                Our Thesis
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 leading-tight mb-6">
                Why this matters now
              </h2>
              <div className="space-y-4 text-neutral-500 leading-relaxed">
                <p>
                  America&apos;s housing stock is aging. Severe weather events are increasing
                  in frequency and intensity. Insurance carriers, independent adjusters, and
                  roofing contractors all face the same problem: they need accurate property
                  condition data, and the traditional ways of getting it are slow, inconsistent,
                  and increasingly dangerous.
                </p>
                <p>
                  Sending a person onto a damaged roof costs time, creates liability, and
                  produces variable results depending on who shows up. Drone-captured data
                  eliminates those problems. Every slope is documented. Every image is
                  time-stamped and geo-tagged. And AI processing ensures every report follows
                  the same standard.
                </p>
                <p>
                  Apex is not replacing adjusters or inspectors. We&apos;re giving them
                  better, faster, safer data so they can do their jobs more effectively.
                  AI is our infrastructure, not our product. The product is reliable property
                  documentation at scale.
                </p>
              </div>
            </div>
            <div className="space-y-5">
              {[
                { label: "Aging housing stock", detail: "50% of U.S. homes were built before 1980. Roofs age, materials degrade, and documentation gaps widen." },
                { label: "Increasing storm severity", detail: "The frequency and cost of severe weather events continues to rise, straining claims operations." },
                { label: "Workforce challenges", detail: "The adjuster workforce is aging. Fewer people want to climb damaged roofs in 100-degree heat." },
                { label: "Technology readiness", detail: "Commercial drones, LiDAR, and computer vision have matured to a point where reliable, automated documentation is practical." },
              ].map((item, i) => (
                <div key={i} className="bg-neutral-50 border border-neutral-100 rounded-lg p-5">
                  <h4 className="font-semibold text-primary-900 mb-1">{item.label}</h4>
                  <p className="text-sm text-neutral-500">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How we operate */}
      <section className="section bg-neutral-50">
        <div className="container-narrow mx-auto">
          <SectionHeading
            tag="Our Model"
            title="National network, powered by technology"
            description="Apex is a hybrid of field services and software. We combine a growing network of local drone pilots with a centralized AI processing platform."
          />
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white border border-neutral-100 rounded-lg p-7">
              <h3 className="text-lg font-semibold text-primary-900 mb-3">Pilot Network</h3>
              <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                FAA Part 107 certified drone operators in markets across the country.
                Each pilot is trained on Apex documentation standards and equipped with
                commercial-grade hardware.
              </p>
              <ul className="space-y-2">
                {["Vetted and credentialed", "Trained on insurance documentation", "Local market knowledge", "Scalable for storm surge"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                    <IconCheckCircle className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-neutral-100 rounded-lg p-7">
              <h3 className="text-lg font-semibold text-primary-900 mb-3">Technology Platform</h3>
              <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                A centralized system that handles dispatch, flight planning, data processing,
                quality assurance, and report generation. AI multiplies pilot productivity
                without replacing human judgment.
              </p>
              <ul className="space-y-2">
                {["Automated dispatch and scheduling", "AI damage detection and annotation", "3D modeling and measurement", "Structured report generation"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                    <IconCheckCircle className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto">
          <SectionHeading tag="Values" title="What guides us" />
          <div className="grid sm:grid-cols-2 gap-7 max-w-4xl mx-auto">
            {values.map((v, i) => (
              <div key={i} className="border-l-2 border-accent-500 pl-5">
                <h3 className="text-lg font-semibold text-primary-900 mb-1">{v.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section bg-neutral-50">
        <div className="container-narrow mx-auto">
          <SectionHeading
            tag="Leadership"
            title="The team behind Apex"
            description="Our leadership team brings together experience in insurance technology, drone operations, computer vision, and enterprise field services."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7 max-w-5xl mx-auto">
            {leadership.map((person, i) => (
              <div key={i} className="bg-white border border-neutral-100 rounded-lg p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
                  <IconUsers className="w-7 h-7 text-primary-400" />
                </div>
                <h3 className="font-semibold text-primary-900">{person.name}</h3>
                <p className="text-xs font-medium text-accent-500 mb-2">{person.role}</p>
                <p className="text-xs text-neutral-400">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
            Want to work with us?
          </h2>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto mb-8">
            Whether you&apos;re a carrier looking for documentation support, a contractor
            who needs better data, or a pilot who wants consistent work &mdash; we&apos;d
            like to hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary text-base">
              Contact Us
            </Link>
            <Link href="/become-a-pilot" className="btn-secondary text-base">
              Become a Pilot
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
