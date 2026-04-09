"use client";

import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/FadeIn";
import { GridBackground } from "@/components/ui/grid-background";
import { SprayParticles } from "@/components/ui/particles";
import { BeamDivider } from "@/components/Beam";
import {
  IconDollar,
  IconSun,
  IconDrone,
  IconAward,
  IconUsers,
  IconWheat,
  IconShield,
  IconTarget,
  IconCheckCircle,
  IconArrowRight,
  IconStar,
  IconZap,
  IconTool,
  IconClock,
} from "@/components/Icons";

const benefits = [
  {
    icon: <IconDollar className="w-6 h-6" />,
    title: "Competitive Pay",
    highlight: "$50-70K + Bonus",
    desc: "Base salary plus per-acre performance bonuses. Top operators earn significantly more during peak season.",
  },
  {
    icon: <IconDrone className="w-6 h-6" />,
    title: "Cutting-Edge Equipment",
    highlight: "DJI T25 Platform",
    desc: "Fly the latest DJI T25 agricultural drones. We invest in the best equipment so you can do your best work.",
  },
  {
    icon: <IconAward className="w-6 h-6" />,
    title: "Training Provided",
    highlight: "Full Certification",
    desc: "Full training on agricultural drone operations, pesticide handling, and FAA compliance. No prior ag experience required.",
  },
  {
    icon: <IconZap className="w-6 h-6" />,
    title: "Growth Opportunities",
    highlight: "Lead & Manage",
    desc: "We are growing fast. Early team members will have the opportunity to lead crews, manage regions, and shape the company.",
  },
  {
    icon: <IconWheat className="w-6 h-6" />,
    title: "Real Impact",
    highlight: "Feed Communities",
    desc: "Help local farmers protect their crops more efficiently. Every flight makes a tangible difference for New Jersey agriculture.",
  },
  {
    icon: <IconSun className="w-6 h-6" />,
    title: "Seasonal Schedule",
    highlight: "Apr - Oct Peak",
    desc: "Seasonal peaks mean long days in summer but lighter winters. Work-life balance built around nature's schedule.",
  },
];

const requirements = [
  "FAA Part 107 Remote Pilot Certificate (or willingness to obtain -- we will help you get it)",
  "Mechanical aptitude and comfort working with drone hardware",
  "Ability to work outdoors in varied weather conditions during growing season",
  "Valid driver's license and reliable transportation",
  "Team player who communicates clearly and shows up on time",
];

const niceToHave = [
  "Agricultural background or experience working on farms",
  "NJ Pesticide Applicator license (CORE or category-specific)",
  "Military drone or aviation experience",
  "Experience with DJI agricultural platforms (T25, T40, etc.)",
  "Basic understanding of crop protection products and application methods",
];

const compensationItems = [
  {
    icon: <IconDollar className="w-5 h-5" />,
    title: "Base Salary + Per-Acre Bonus",
    amount: "$50-70K Base",
    desc: "Depending on experience, plus performance bonuses tied to acres sprayed. Top operators exceed $85K.",
  },
  {
    icon: <IconDrone className="w-5 h-5" />,
    title: "Equipment Provided",
    amount: "$40K+ Value",
    desc: "All drones, batteries, chargers, spray systems, and vehicles provided. You bring the skill, we bring the gear.",
  },
  {
    icon: <IconAward className="w-5 h-5" />,
    title: "Training & Certification",
    amount: "$3K+ Covered",
    desc: "We cover the cost of FAA Part 107, pesticide applicator licensing, and ongoing professional development.",
  },
  {
    icon: <IconClock className="w-5 h-5" />,
    title: "Seasonal Flexibility",
    amount: "7 Mo. Peak",
    desc: "Peak season is April through October. Winter months are lighter with equipment maintenance and training.",
  },
];

const applicationSteps = [
  {
    step: "01",
    title: "Submit Application",
    desc: "Fill out our application form or send your resume. Tell us about your experience and why you want to fly ag drones.",
  },
  {
    step: "02",
    title: "Phone Interview",
    desc: "A 20-minute conversation about your background, goals, and what the job looks like day-to-day.",
  },
  {
    step: "03",
    title: "Field Demonstration",
    desc: "Spend a half-day with our team in the field. See the operation firsthand and show us your drone handling skills.",
  },
  {
    step: "04",
    title: "Onboarding & Training",
    desc: "Two weeks of structured training covering ag drone operations, pesticide safety, and field procedures.",
  },
];

export default function CareersPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 overflow-hidden">
        <GridBackground />
        <SprayParticles
          colors={["rgba(34,211,238,0.3)", "rgba(34,211,238,0.15)", "rgba(74,222,128,0.2)", "rgba(74,222,128,0.1)"]}
          quantity={40}
        />
        <div className="container-narrow mx-auto px-5 py-24 md:py-32 relative z-10">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Join the Mission
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.08] text-white max-w-3xl">
              Join the Future of Agriculture
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-white/60 max-w-2xl">
              We&apos;re looking for skilled drone operators to join our growing team serving
              New Jersey&apos;s farming community. No agricultural background required -- just
              discipline, mechanical aptitude, and a desire to do meaningful work outdoors.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-8">
              <a
                href="#apply"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-400 text-primary-950 font-semibold rounded-lg transition-colors"
              >
                Apply Now <IconArrowRight className="w-4 h-4" />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <BeamDivider />

      {/* Why Join AG Drones */}
      <section className="py-20 md:py-28 bg-primary-950 px-5">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Why Join AG Drones
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              More than just a job
            </h2>
            <p className="mt-3 text-white/60 max-w-2xl">
              We are building something new in New Jersey agriculture. Join early and grow with us.
            </p>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {benefits.map((b, i) => (
              <StaggerItem key={i}>
                <div className="bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-7 h-full">
                  <div className="w-11 h-11 rounded-lg bg-accent-900/40 flex items-center justify-center text-accent-400 mb-4">
                    {b.icon}
                  </div>
                  <h3 className="font-semibold text-white">{b.title}</h3>
                  <p className="text-sm font-mono text-accent-400 mt-1">{b.highlight}</p>
                  <p className="mt-2 text-sm text-white/60 leading-relaxed">{b.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <BeamDivider />

      {/* Veterans Welcome */}
      <section className="py-20 md:py-28 bg-primary-900 px-5">
        <div className="container-narrow mx-auto">
          <div className="bg-white/[0.03] border border-green-500/20 rounded-2xl backdrop-blur-sm p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              <div>
                <FadeIn>
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-green-400 mb-3 font-mono">
                    // Veterans Welcome
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    Your military experience translates directly
                  </h2>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <div className="mt-6 space-y-4 text-white/60 leading-relaxed">
                    <p>
                      If you operated drones, worked in aviation, or served in any capacity that
                      required precision, discipline, and mission focus -- you already have the
                      foundation for this work.
                    </p>
                    <p>
                      Agricultural drone operations demand the same attention to detail, safety
                      mindset, and ability to execute under pressure that the military instills.
                      We value that training and want veterans on our team.
                    </p>
                    <p>
                      We will help you obtain your FAA Part 107 certification and pesticide
                      applicator license. Many veterans qualify for expedited FAA processing
                      based on prior military aviation credentials.
                    </p>
                  </div>
                </FadeIn>

                {/* Veteran stats */}
                <FadeIn delay={0.2}>
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    {[
                      { value: "2x", label: "Faster Certification" },
                      { value: "100%", label: "Training Covered" },
                      { value: "15%", label: "Veteran Pay Bonus" },
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <p className="text-2xl font-bold font-mono text-green-400">{stat.value}</p>
                        <p className="text-xs text-white/40 mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </FadeIn>
              </div>

              <FadeIn delay={0.15} direction="right">
                <StaggerContainer className="space-y-4">
                  {[
                    {
                      icon: <IconTarget className="w-5 h-5" />,
                      title: "Precision & Discipline",
                      desc: "Mission planning, pre-flight checks, and precise execution -- you have done this before.",
                    },
                    {
                      icon: <IconShield className="w-5 h-5" />,
                      title: "Safety-First Culture",
                      desc: "Our safety protocols will feel familiar. We never cut corners on safety.",
                    },
                    {
                      icon: <IconUsers className="w-5 h-5" />,
                      title: "Leadership Opportunities",
                      desc: "Veterans with leadership experience can advance quickly to crew lead and regional roles.",
                    },
                    {
                      icon: <IconAward className="w-5 h-5" />,
                      title: "FAA Fast Track",
                      desc: "Military aviation credentials can expedite your Part 107 certification process.",
                    },
                  ].map((item, i) => (
                    <StaggerItem key={i}>
                      <div className="bg-white/[0.03] border border-green-500/10 rounded-xl p-5 flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-green-950/40 flex items-center justify-center text-green-400 shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{item.title}</h4>
                          <p className="mt-0.5 text-sm text-white/60">{item.desc}</p>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <BeamDivider />

      {/* What We're Looking For */}
      <section className="py-20 md:py-28 bg-primary-950 px-5">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Requirements
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Requirements &amp; qualifications
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 mt-10 max-w-4xl">
            <FadeIn delay={0.05}>
              <div className="bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-7">
                <div className="flex items-center gap-2 mb-5">
                  <IconCheckCircle className="w-5 h-5 text-accent-400" />
                  <h3 className="text-lg font-semibold text-white">Required</h3>
                </div>
                <ul className="space-y-3">
                  {requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/60">
                      <IconCheckCircle className="w-3.5 h-3.5 text-accent-400 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-7">
                <div className="flex items-center gap-2 mb-5">
                  <IconStar className="w-5 h-5 text-accent-400" />
                  <h3 className="text-lg font-semibold text-white">Nice to Have</h3>
                </div>
                <ul className="space-y-3">
                  {niceToHave.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/60">
                      <IconStar className="w-3.5 h-3.5 text-white/30 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <BeamDivider />

      {/* Compensation */}
      <section className="py-20 md:py-28 bg-primary-900 px-5">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Compensation
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Transparent from day one
            </h2>
            <p className="mt-3 text-white/60 max-w-2xl">
              No guessing about pay. Here is exactly how compensation works. Proven operators
              who demonstrate reliability and leadership can earn profit sharing after their
              first full season.
            </p>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 gap-6 mt-10 max-w-4xl">
            {compensationItems.map((item, i) => (
              <StaggerItem key={i}>
                <div className="relative bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-7 h-full hud-corners">
                  <div className="w-10 h-10 rounded-lg bg-accent-900/40 flex items-center justify-center text-accent-400 mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-lg font-mono text-accent-400 mt-1">{item.amount}</p>
                  <p className="mt-2 text-sm text-white/60 leading-relaxed">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <BeamDivider />

      {/* How to Apply */}
      <section className="py-20 md:py-28 bg-primary-950 px-5">
        <div className="container-narrow mx-auto max-w-3xl">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // How to Apply
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Simple four-step process
            </h2>
          </FadeIn>

          {applicationSteps.map((step, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="relative pl-20 pb-14 last:pb-0 mt-10 first:mt-10">
                {i < applicationSteps.length - 1 && (
                  <div className="absolute left-[1.22rem] top-14 bottom-0 w-px bg-accent-500/20" />
                )}
                <div className="absolute left-0 top-0 w-10 h-10 flex items-center justify-center rounded-lg bg-accent-500 text-primary-950 text-sm font-bold font-mono">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-white/60 leading-relaxed">{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <BeamDivider />

      {/* CTA */}
      <section id="apply" className="py-20 md:py-28 bg-primary-900 px-5">
        <div className="container-narrow mx-auto text-center">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Ready?
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to fly with us?</h2>
            <p className="mt-4 text-white/60 max-w-lg mx-auto">
              Send us your resume and a brief note about your experience. We review every
              application and respond within one week.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-400 text-primary-950 font-semibold rounded-lg transition-colors"
              >
                Apply Now <IconArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="mailto:careers@agdronesnj.com"
                className="inline-flex items-center gap-2 px-6 py-3 border border-accent-500/20 text-accent-400 hover:bg-accent-900/40 rounded-lg transition-colors"
              >
                Email careers@agdronesnj.com
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
