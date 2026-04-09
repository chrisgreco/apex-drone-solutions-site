"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/FadeIn";
import { GridBackground } from "@/components/ui/grid-background";
import { BeamDivider } from "@/components/Beam";
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconClock,
  IconCheckCircle,
  IconShield,
  IconAward,
  IconArrowRight,
} from "@/components/Icons";

const counties = [
  "Burlington",
  "Cumberland",
  "Salem",
  "Atlantic",
  "Gloucester",
  "Camden",
  "Cape May",
  "Other NJ County",
  "Outside NJ",
];

const crops = [
  "Blueberries",
  "Cranberries",
  "Tomatoes",
  "Peppers",
  "Peaches",
  "Soybeans",
  "Corn",
  "Other",
];

const serviceOptions = [
  "Crop Spraying",
  "Cover Crop Seeding",
  "Field Mapping / NDVI",
  "Pest Detection",
];

const sprayMethods = [
  "Ground Rig",
  "Aerial / Airplane",
  "Manual / Backpack",
  "None / New to Spraying",
];

const timelines = [
  "ASAP",
  "This Month",
  "This Season",
  "Next Season",
  "Just Exploring",
];

const faqs = [
  {
    q: "Is the quote really free?",
    a: "Yes, 100% free with no obligation. We will review your farm details, recommend the right service, and give you a transparent per-acre price. No hidden fees, no pressure.",
  },
  {
    q: "What's your minimum field size?",
    a: "We do not have a strict minimum. We have sprayed fields as small as 2 acres. That said, drone spraying becomes most cost-effective above 5 acres. We will always give you an honest assessment.",
  },
  {
    q: "Do you provide the chemicals?",
    a: "We can work either way. Many farmers supply their own crop protection products. We can also source and supply chemicals at competitive prices. We handle all mixing and application regardless.",
  },
  {
    q: "How quickly can you schedule?",
    a: "During growing season, we can typically schedule within 3-5 business days. For urgent pest or disease situations, we offer priority scheduling and can often be on-site within 48 hours.",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [services, setServices] = useState<string[]>([]);

  function handleServiceChange(e: ChangeEvent<HTMLInputElement>) {
    const { value, checked } = e.target;
    setServices((prev) =>
      checked ? [...prev, value] : prev.filter((s) => s !== value)
    );
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  const inputClasses =
    "w-full px-4 py-2.5 bg-primary-900 border border-accent-500/20 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent-400 focus:ring-1 focus:ring-accent-400/30";
  const labelClasses = "block text-sm font-medium text-white/60 mb-1.5";

  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 overflow-hidden">
        <GridBackground />
        <div className="container-narrow mx-auto px-5 py-20 md:py-28 relative z-10">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Request Quote
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.08] text-white max-w-3xl">
              Get a Free Quote for Your Farm
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-5 text-lg text-white/60 max-w-2xl">
              Tell us about your farm and we will put together a custom quote. No obligation,
              no pressure -- just honest pricing for your specific operation.
            </p>
          </FadeIn>
        </div>
      </section>

      <BeamDivider />

      {/* Form + Sidebar */}
      <section className="py-20 md:py-28 bg-primary-950 px-5">
        <div className="container-narrow mx-auto">
          <div className="grid lg:grid-cols-3 gap-14">
            {/* Form */}
            <FadeIn className="lg:col-span-2">
              {submitted ? (
                <div className="bg-accent-900/40 border border-accent-500/20 rounded-2xl p-10 text-center hud-corners">
                  <IconCheckCircle className="w-12 h-12 text-accent-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Thanks! We&apos;ll get back to you within 24 hours.
                  </h3>
                  <p className="text-white/60 max-w-md mx-auto">
                    We have received your quote request. A member of our team will review your
                    farm details and reach out with a custom proposal.
                  </p>
                </div>
              ) : (
                <div className="bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-8 hud-corners">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-xl font-bold text-white mb-2">
                      Request Your Free Quote
                    </h2>

                    {/* Name / Email */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className={labelClasses}>
                          Full Name <span className="text-accent-400">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          placeholder="John Smith"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className={labelClasses}>
                          Email <span className="text-accent-400">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="john@example.com"
                          className={inputClasses}
                        />
                      </div>
                    </div>

                    {/* Phone / Farm Name */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="phone" className={labelClasses}>
                          Phone <span className="text-accent-400">*</span>
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          placeholder="(555) 123-4567"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label htmlFor="farmName" className={labelClasses}>
                          Farm Name <span className="text-white/30">(optional)</span>
                        </label>
                        <input
                          id="farmName"
                          name="farmName"
                          type="text"
                          placeholder="Smith Family Farm"
                          className={inputClasses}
                        />
                      </div>
                    </div>

                    {/* County / Acres */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="county" className={labelClasses}>
                          County <span className="text-accent-400">*</span>
                        </label>
                        <select
                          id="county"
                          name="county"
                          required
                          className={inputClasses}
                        >
                          <option value="">Select county</option>
                          {counties.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="acres" className={labelClasses}>
                          Total Acres to Spray <span className="text-accent-400">*</span>
                        </label>
                        <input
                          id="acres"
                          name="acres"
                          type="number"
                          min="1"
                          required
                          placeholder="e.g. 25"
                          className={inputClasses}
                        />
                      </div>
                    </div>

                    {/* Crop / Current Method */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="crop" className={labelClasses}>
                          Primary Crop <span className="text-accent-400">*</span>
                        </label>
                        <select
                          id="crop"
                          name="crop"
                          required
                          className={inputClasses}
                        >
                          <option value="">Select crop</option>
                          {crops.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="sprayMethod" className={labelClasses}>
                          Current Spray Method
                        </label>
                        <select
                          id="sprayMethod"
                          name="sprayMethod"
                          className={inputClasses}
                        >
                          <option value="">Select method</option>
                          {sprayMethods.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Services checkboxes */}
                    <div>
                      <p className={labelClasses}>Services Needed</p>
                      <div className="grid sm:grid-cols-2 gap-3 mt-1">
                        {serviceOptions.map((service) => (
                          <label
                            key={service}
                            className="flex items-center gap-2.5 text-sm text-white/60 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              name="services"
                              value={service}
                              checked={services.includes(service)}
                              onChange={handleServiceChange}
                              className="w-4 h-4 rounded border-accent-500/30 bg-primary-900 text-accent-400 focus:ring-accent-400/30 focus:ring-offset-0 checked:bg-accent-500"
                            />
                            {service}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <label htmlFor="timeline" className={labelClasses}>
                        Timeline
                      </label>
                      <select
                        id="timeline"
                        name="timeline"
                        className={inputClasses}
                      >
                        <option value="">When do you need service?</option>
                        {timelines.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Notes */}
                    <div>
                      <label htmlFor="notes" className={labelClasses}>
                        Additional Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={4}
                        placeholder="Tell us anything else about your farm, specific pest or disease concerns, access limitations, etc."
                        className={`${inputClasses} resize-y`}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-primary w-full sm:w-auto justify-center"
                    >
                      Request Your Free Quote <IconArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </FadeIn>

            {/* Sidebar */}
            <FadeIn direction="right" delay={0.15} className="lg:col-span-1">
              <div className="space-y-8 lg:sticky lg:top-28">
                <div className="bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-6">
                  <h3 className="font-semibold text-white mb-5">Contact Info</h3>
                  <div className="space-y-5">
                    {[
                      {
                        icon: <IconPhone className="w-4.5 h-4.5" />,
                        label: "Phone",
                        value: "(555) AG-DRONE",
                      },
                      {
                        icon: <IconMail className="w-4.5 h-4.5" />,
                        label: "Email",
                        value: "info@agdronesnj.com",
                      },
                      {
                        icon: <IconMapPin className="w-4.5 h-4.5" />,
                        label: "Location",
                        value: "South Jersey, NJ",
                      },
                      {
                        icon: <IconClock className="w-4.5 h-4.5" />,
                        label: "Hours",
                        value: "Monday - Saturday, 6am - 8pm (growing season)",
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="text-accent-400 mt-0.5">{item.icon}</div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {item.label}
                          </p>
                          <p className="text-sm text-white/60">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-accent-900/40 border border-accent-500/20 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <IconCheckCircle className="w-4.5 h-4.5 text-accent-400" />
                    <p className="text-sm font-semibold text-white">
                      24-Hour Response
                    </p>
                  </div>
                  <p className="text-sm text-white/60">
                    We respond to all quote requests within 24 hours during growing season,
                    and within 48 hours off-season.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <BeamDivider />

      {/* Trust Signals */}
      <section className="py-20 md:py-28 bg-primary-900 px-5">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <StaggerContainer className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                {
                  icon: <IconAward className="w-7 h-7" />,
                  title: "FAA Part 137 Certified",
                  desc: "Federally licensed agricultural aircraft operator.",
                },
                {
                  icon: <IconShield className="w-7 h-7" />,
                  title: "Commercially Insured",
                  desc: "$2M liability coverage for every operation.",
                },
                {
                  icon: <IconCheckCircle className="w-7 h-7" />,
                  title: "NJ Licensed Applicator",
                  desc: "DEP-licensed for aerial pesticide application.",
                },
              ].map((badge, i) => (
                <StaggerItem key={i}>
                  <div className="text-center p-6 bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm">
                    <div className="w-14 h-14 mx-auto rounded-full bg-accent-900/40 border border-accent-500/10 flex items-center justify-center text-accent-400 mb-3">
                      {badge.icon}
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
                      <h3 className="font-semibold text-white text-sm">
                        {badge.title}
                      </h3>
                    </div>
                    <p className="mt-1 text-xs text-white/60">{badge.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </FadeIn>
        </div>
      </section>

      <BeamDivider />

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-primary-950 px-5">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <div className="text-center">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
                // FAQ
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Quick answers
              </h2>
            </div>
          </FadeIn>

          <div className="max-w-3xl mx-auto mt-10 space-y-4">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-6">
                  <h3 className="font-semibold text-white">{faq.q}</h3>
                  <p className="mt-2 text-sm text-white/60 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
