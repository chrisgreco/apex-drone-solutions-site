"use client";

import { SectionHeading } from "@/components/SectionHeading";
import { Card } from "@/components/Card";
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
    // In production, this would POST to an API
    setSubmitted(true);
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-primary-950 text-white">
        <div className="container-narrow mx-auto px-5 py-20 md:py-24">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-400 mb-4">
              Become a Pilot
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.12] mb-6">
              Fly with Apex. Get consistent, well-paid drone work.
            </h1>
            <p className="text-lg text-primary-300 leading-relaxed max-w-2xl">
              Join a nationwide network of FAA Part 107 pilots focused on insurance
              and roofing documentation. We handle sales, scheduling, and client
              management. You handle the flights.
            </p>
          </div>
        </div>
      </section>

      {/* Why fly with Apex */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto">
          <SectionHeading
            tag="Why Fly With Apex"
            title="Focus on flying, not on finding work"
            description="Apex provides a steady pipeline of paid drone jobs in your area. No cold calling, no invoicing headaches, and no chasing down clients."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            <Card icon={<IconChart />} title="Consistent Income">
              Receive regular job assignments in your area. Volume-based compensation
              that rewards reliability and quality.
            </Card>
            <Card icon={<IconMapPin />} title="Local Jobs">
              Fly properties in your region. No long-distance travel unless you want it.
              Jobs matched by proximity and availability.
            </Card>
            <Card icon={<IconDrone />} title="Professional Standards">
              Work with calibrated flight plans and clear documentation standards.
              Every job builds your professional portfolio.
            </Card>
            <Card icon={<IconShield />} title="Insurance Covered">
              Apex provides supplemental liability coverage for all contracted flights.
              Your Part 107 and personal equipment insurance are your responsibility.
            </Card>
            <Card icon={<IconUsers />} title="Community &amp; Support">
              Join a network of professional pilots. Access training resources,
              best practices, and direct support from the Apex operations team.
            </Card>
            <Card icon={<IconCheckCircle />} title="Simple Onboarding">
              Apply, verify your credentials, complete a brief orientation, and
              start receiving job assignments. Most pilots are active within a week.
            </Card>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="section bg-neutral-50">
        <div className="container-narrow mx-auto">
          <SectionHeading
            tag="Requirements"
            title="What we look for in Apex pilots"
          />
          <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-6">
            {[
              "Valid FAA Part 107 Remote Pilot Certificate",
              "Commercial drone liability insurance",
              "Reliable DJI or equivalent commercial drone",
              "Smartphone or tablet for the Apex pilot app",
              "Reliable transportation to job sites",
              "Strong attention to detail and safety mindset",
              "Availability for at least 5 jobs per month",
              "Experience with roof or property documentation preferred",
            ].map((req, i) => (
              <div key={i} className="flex items-start gap-3">
                <IconCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 shrink-0" />
                <span className="text-sm text-neutral-700">{req}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto">
          <SectionHeading
            tag="Apply Now"
            title="Join the Apex pilot network"
            description="Fill out the form below and our pilot operations team will review your application within 2 business days."
          />

          <div className="max-w-2xl mx-auto">
            {submitted ? (
              <div className="bg-success-100 border border-success-500/20 rounded-lg p-8 text-center">
                <IconCheckCircle className="w-10 h-10 text-success-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-primary-900 mb-2">Application Received</h3>
                <p className="text-neutral-500">
                  Thank you for your interest in flying with Apex. Our pilot operations
                  team will review your application and reach out within 2 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1.5">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className="w-full px-4 py-2.5 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className="w-full px-4 py-2.5 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1.5">
                      City *
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      className="w-full px-4 py-2.5 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1.5">
                      State *
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      required
                      className="w-full px-4 py-2.5 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="part107" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    FAA Part 107 Status *
                  </label>
                  <select
                    id="part107"
                    name="part107"
                    required
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 bg-white"
                  >
                    <option value="">Select status</option>
                    <option value="certified">Certified — current</option>
                    <option value="expired">Certified — needs renewal</option>
                    <option value="in-progress">In progress / studying</option>
                    <option value="not-started">Not yet started</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="equipment" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Drone Equipment
                  </label>
                  <input
                    id="equipment"
                    name="equipment"
                    type="text"
                    placeholder="e.g. DJI Mavic 3 Enterprise, DJI Mini 4 Pro"
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
                  />
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Relevant Experience
                  </label>
                  <textarea
                    id="experience"
                    name="experience"
                    rows={4}
                    placeholder="Tell us about your drone experience, especially any insurance, roofing, or property documentation work."
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 resize-y"
                  />
                </div>

                <button type="submit" className="btn-primary w-full sm:w-auto">
                  Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
