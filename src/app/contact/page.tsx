"use client";

import { FadeIn } from "@/components/FadeIn";
import { DottedSurface } from "@/components/ui/dotted-surface";
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
      <section className="relative bg-primary-950 text-white overflow-hidden">
        <DottedSurface dotColor={[130, 154, 177]} fogColor={0x0a1929} />
        <div className="container-narrow mx-auto px-5 py-24 md:py-28 relative z-10">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-4">Contact</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.08] max-w-2xl">
              Let&apos;s talk
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-4 text-lg text-primary-300 max-w-xl">
              Our team typically responds within one business day.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Form + info */}
      <section className="section bg-white">
        <div className="container-narrow mx-auto">
          <div className="grid lg:grid-cols-3 gap-14">
            {/* Sidebar */}
            <FadeIn direction="left" className="lg:col-span-1">
              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold text-primary-900 mb-4">Get in Touch</h3>
                  <div className="space-y-4">
                    {[
                      { icon: <IconMail className="w-4.5 h-4.5" />, label: "Email", value: "info@apexdronesolns.com" },
                      { icon: <IconPhone className="w-4.5 h-4.5" />, label: "Phone", value: "(800) 555-APEX" },
                      { icon: <IconMapPin className="w-4.5 h-4.5" />, label: "HQ", value: "Dallas, TX" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="text-accent-500 mt-0.5">{item.icon}</div>
                        <div>
                          <p className="text-sm font-medium text-neutral-700">{item.label}</p>
                          <p className="text-sm text-neutral-500">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-neutral-100 pt-6">
                  <h3 className="font-semibold text-primary-900 mb-3">Quick Links</h3>
                  <ul className="space-y-2 text-sm">
                    <li><span className="text-neutral-400">Carriers → </span><a href="/insurance-claims" className="text-accent-600 font-medium">Insurance &amp; Claims</a></li>
                    <li><span className="text-neutral-400">Contractors → </span><a href="/roofing-restoration" className="text-accent-600 font-medium">Roofing &amp; Restoration</a></li>
                    <li><span className="text-neutral-400">Pilots → </span><a href="/become-a-pilot" className="text-accent-600 font-medium">Become a Pilot</a></li>
                  </ul>
                </div>
              </div>
            </FadeIn>

            {/* Form */}
            <FadeIn direction="right" delay={0.1} className="lg:col-span-2">
              {submitted ? (
                <div className="bg-success-100 border border-success-500/20 rounded-xl p-8 text-center">
                  <IconCheckCircle className="w-10 h-10 text-success-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-primary-900 mb-2">Message Sent</h3>
                  <p className="text-neutral-500">We&apos;ll get back to you within one business day.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5">Full Name *</label>
                      <input id="name" name="name" type="text" required className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500" />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-neutral-700 mb-1.5">Company</label>
                      <input id="company" name="company" type="text" className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">Email *</label>
                      <input id="email" name="email" type="email" required className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1.5">Phone</label>
                      <input id="phone" name="phone" type="tel" className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-neutral-700 mb-1.5">I am a... *</label>
                    <select id="type" name="type" required className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 bg-white">
                      <option value="">Select one</option>
                      <option value="carrier">Insurance Carrier / Claims Team</option>
                      <option value="adjuster">Independent Adjuster / IA Firm</option>
                      <option value="contractor">Roofing / Restoration Contractor</option>
                      <option value="pilot">Drone Pilot</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1.5">Message *</label>
                    <textarea id="message" name="message" rows={4} required placeholder="Tell us about your needs." className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 resize-y" />
                  </div>
                  <button type="submit" className="btn-primary">Send Message</button>
                </form>
              )}
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
