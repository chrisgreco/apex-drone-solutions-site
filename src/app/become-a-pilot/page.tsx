"use client";

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/FadeIn";
import { DottedSurface } from "@/components/ui/dotted-surface";
import {
  IconCheckCircle,
  IconMapPin,
  IconShield,
  IconChart,
  IconDrone,
  IconUsers,
} from "@/components/Icons";
import { useState, type FormEvent } from "react";

export default function BecomeAPilotPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 text-white overflow-hidden">
        <DottedSurface dotColor={[130, 154, 177]} fogColor={0x000000} />
        <div className="container-narrow mx-auto px-5 py-24 md:py-28 relative z-10">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-4">Become a Pilot</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.08] max-w-3xl">
              Fly with Apex. <span className="text-accent-400">Get consistent work.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-white/80 max-w-2xl">
              Join a nationwide network of Part 107 pilots. We handle sales, scheduling, and clients. You handle the flights.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Why fly */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-500 mb-3">Why Fly With Apex</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 max-w-md">Focus on flying, not finding work</h2>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[
              { icon: <IconChart className="w-5 h-5" />, title: "Consistent Income", desc: "Regular job assignments. Volume-based pay that rewards reliability." },
              { icon: <IconMapPin className="w-5 h-5" />, title: "Local Jobs", desc: "Fly in your region. Matched by proximity and availability." },
              { icon: <IconDrone className="w-5 h-5" />, title: "Professional Standards", desc: "Calibrated flight plans and clear documentation standards." },
              { icon: <IconShield className="w-5 h-5" />, title: "Insurance Covered", desc: "Supplemental liability coverage for all contracted flights." },
              { icon: <IconUsers className="w-5 h-5" />, title: "Community", desc: "Network of professional pilots. Training and direct ops support." },
              { icon: <IconCheckCircle className="w-5 h-5" />, title: "Simple Onboarding", desc: "Apply, verify, orient, fly. Most pilots active within a week." },
            ].map((card, i) => (
              <StaggerItem key={i}>
                <div className="border border-neutral-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary-50 text-primary-700">{card.icon}</div>
                  <h3 className="mt-4 font-semibold text-primary-900">{card.title}</h3>
                  <p className="mt-1.5 text-sm text-neutral-500">{card.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Requirements */}
      <section className="section bg-neutral-50">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-500 mb-3">Requirements</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900">What we look for</h2>
          </FadeIn>
          <div className="max-w-3xl mt-8 grid sm:grid-cols-2 gap-4">
            {[
              "Valid FAA Part 107 Remote Pilot Certificate",
              "Commercial drone liability insurance",
              "Reliable DJI or equivalent commercial drone",
              "Smartphone or tablet for the Apex pilot app",
              "Reliable transportation to job sites",
              "Strong attention to detail and safety mindset",
              "Availability for at least 5 jobs per month",
              "Roof or property documentation experience preferred",
            ].map((req, i) => (
              <FadeIn key={i} delay={i * 0.04}>
                <div className="flex items-start gap-3">
                  <IconCheckCircle className="w-4 h-4 text-accent-500 mt-1 shrink-0" />
                  <span className="text-sm text-neutral-700">{req}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <div className="text-center">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-500 mb-3">Apply Now</p>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900">Join the network</h2>
              <p className="mt-2 text-neutral-500">Review within 2 business days.</p>
            </div>
          </FadeIn>

          <div className="max-w-2xl mx-auto mt-10">
            {submitted ? (
              <FadeIn>
                <div className="bg-success-100 border border-success-500/20 rounded-xl p-8 text-center">
                  <IconCheckCircle className="w-10 h-10 text-success-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-primary-900 mb-2">Application Received</h3>
                  <p className="text-neutral-500">We&apos;ll review and reach out within 2 business days.</p>
                </div>
              </FadeIn>
            ) : (
              <FadeIn delay={0.1}>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1.5">First Name *</label>
                      <input id="firstName" name="firstName" type="text" required className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500" />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1.5">Last Name *</label>
                      <input id="lastName" name="lastName" type="text" required className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">Email *</label>
                    <input id="email" name="email" type="email" required className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1.5">City *</label>
                      <input id="city" name="city" type="text" required className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500" />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1.5">State *</label>
                      <input id="state" name="state" type="text" required className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="part107" className="block text-sm font-medium text-neutral-700 mb-1.5">Part 107 Status *</label>
                    <select id="part107" name="part107" required className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 bg-white">
                      <option value="">Select status</option>
                      <option value="certified">Certified — current</option>
                      <option value="expired">Certified — needs renewal</option>
                      <option value="in-progress">In progress</option>
                      <option value="not-started">Not yet started</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="equipment" className="block text-sm font-medium text-neutral-700 mb-1.5">Drone Equipment</label>
                    <input id="equipment" name="equipment" type="text" placeholder="e.g. DJI Mavic 3 Enterprise" className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500" />
                  </div>
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-neutral-700 mb-1.5">Experience</label>
                    <textarea id="experience" name="experience" rows={3} placeholder="Relevant drone, insurance, or property documentation experience." className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 resize-y" />
                  </div>
                  <button type="submit" className="btn-primary w-full sm:w-auto">Submit Application</button>
                </form>
              </FadeIn>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
