"use client";

import { SectionHeading } from "@/components/SectionHeading";
import { IconMail, IconPhone, IconMapPin, IconCheckCircle } from "@/components/Icons";
import { useState, type FormEvent } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-primary-950 text-white">
        <div className="container-narrow mx-auto px-5 py-20 md:py-24">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-400 mb-4">
              Contact
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.12] mb-6">
              Let&apos;s talk about your documentation needs
            </h1>
            <p className="text-lg text-primary-300 leading-relaxed max-w-2xl">
              Whether you&apos;re a carrier, adjuster firm, roofing contractor, or
              drone pilot, we&apos;d like to hear from you. Our team typically
              responds within one business day.
            </p>
          </div>
        </div>
      </section>

      {/* Contact form + info */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact info sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-primary-900 mb-4">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <IconMail className="w-5 h-5 text-accent-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-neutral-700">Email</p>
                      <p className="text-sm text-neutral-500">info@apexdronesolns.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <IconPhone className="w-5 h-5 text-accent-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-neutral-700">Phone</p>
                      <p className="text-sm text-neutral-500">(800) 555-APEX</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <IconMapPin className="w-5 h-5 text-accent-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-neutral-700">Headquarters</p>
                      <p className="text-sm text-neutral-500">Dallas, TX</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary-900 mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <span className="text-neutral-500">Insurance teams → </span>
                    <a href="/insurance-claims" className="text-accent-600 hover:text-accent-700 font-medium">
                      Insurance &amp; Claims
                    </a>
                  </li>
                  <li>
                    <span className="text-neutral-500">Contractors → </span>
                    <a href="/roofing-restoration" className="text-accent-600 hover:text-accent-700 font-medium">
                      Roofing &amp; Restoration
                    </a>
                  </li>
                  <li>
                    <span className="text-neutral-500">Drone pilots → </span>
                    <a href="/become-a-pilot" className="text-accent-600 hover:text-accent-700 font-medium">
                      Become a Pilot
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-success-100 border border-success-500/20 rounded-lg p-8 text-center">
                  <IconCheckCircle className="w-10 h-10 text-success-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-primary-900 mb-2">Message Sent</h3>
                  <p className="text-neutral-500">
                    Thank you for reaching out. A member of our team will get back to
                    you within one business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Company
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
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
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-neutral-700 mb-1.5">
                      I am a... *
                    </label>
                    <select
                      id="type"
                      name="type"
                      required
                      className="w-full px-4 py-2.5 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 bg-white"
                    >
                      <option value="">Select one</option>
                      <option value="carrier">Insurance Carrier / Claims Team</option>
                      <option value="adjuster">Independent Adjuster / IA Firm</option>
                      <option value="contractor">Roofing / Restoration Contractor</option>
                      <option value="pilot">Drone Pilot</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      placeholder="Tell us about your needs, volume, and the markets you operate in."
                      className="w-full px-4 py-2.5 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 resize-y"
                    />
                  </div>

                  <button type="submit" className="btn-primary">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
