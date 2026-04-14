"use client";

import { Suspense } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { GridBackground } from "@/components/ui/grid-background";
import { IconShield, IconArrowRight, IconLeaf } from "@/components/Icons";
import { useCropIntel } from "@/components/dashboard/useCropIntel";
import { AlertSignupCTA } from "@/components/dashboard/AlertSignupCTA";
import { CROPS } from "@/lib/farm-intel/crops";
import type { DiseasePrediction, RiskLevel } from "@/lib/farm-intel/disease-models";

const RISK_BADGE: Record<RiskLevel, { bg: string; text: string; label: string }> = {
  low: { bg: "bg-accent-500/15 border-accent-500/30", text: "text-accent-300", label: "LOW" },
  moderate: { bg: "bg-amber-400/15 border-amber-400/30", text: "text-amber-300", label: "MODERATE" },
  high: { bg: "bg-red-500/15 border-red-500/30", text: "text-red-300", label: "HIGH" },
  extreme: { bg: "bg-red-500/25 border-red-500/50", text: "text-red-200", label: "EXTREME" },
};

function formatEventWindow(startIso: string, endIso: string): string {
  const s = new Date(startIso);
  const e = new Date(endIso);
  return `${s.toLocaleString("en-US", {
    weekday: "short",
    hour: "numeric",
    timeZone: "America/New_York",
  })} – ${e.toLocaleString("en-US", {
    weekday: "short",
    hour: "numeric",
    timeZone: "America/New_York",
  })}`;
}

function DiseaseCard({ d }: { d: DiseasePrediction }) {
  const badge = RISK_BADGE[d.risk];
  return (
    <div className={`rounded-xl border ${badge.bg} p-5`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${badge.text} ${badge.bg}`}
            >
              {badge.label}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white">{d.name}</h3>
        </div>
      </div>
      <p className="text-sm text-white/70 mb-3">{d.detail}</p>
      {d.nextEvent && (
        <div className="rounded-lg bg-black/25 border border-white/10 p-3 mb-3 text-sm">
          <div className="text-white/50 text-xs uppercase tracking-wider mb-1">
            Predicted infection event
          </div>
          <div className="text-white font-medium">
            {formatEventWindow(d.nextEvent.startIso, d.nextEvent.endIso)}
          </div>
          <div className="text-white/60 text-xs mt-1">
            {d.nextEvent.wetHours}h of leaf wetness, avg {Math.round(d.nextEvent.avgTempF)}°F
          </div>
        </div>
      )}
      <div className="text-sm">
        <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Recommendation</div>
        <div className="text-white/85">{d.recommendation}</div>
      </div>
      {(d.risk === "high" || d.risk === "extreme") && (
        <Link
          href="/contact"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-500 hover:bg-accent-400 text-black font-semibold text-sm transition"
        >
          Book a drone spray
          <IconArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}

function DiseasePressureInner() {
  const { profile, intel, loading, error, isDemo } = useCropIntel();
  const crop = CROPS[profile.cropPrimary];

  return (
    <>
      <GridBackground />

      <section className="px-6 md:px-8 pt-28 md:pt-32 pb-4">
        <div className="container-narrow">
          <Link
            href="/resources"
            className="text-sm text-white/50 hover:text-white/80 transition inline-flex items-center gap-1"
          >
            ← Back to dashboard
          </Link>
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/30 text-accent-400 text-xs font-medium mt-4 mb-4">
              <IconShield className="w-3.5 h-3.5" />
              Disease Pressure · 7-day infection forecast
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
              Disease pressure for{" "}
              <span className="text-accent-400">
                {crop.emoji} {crop.name}
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              {isDemo
                ? `Showing the Hammonton blueberry demo. `
                : `Showing live infection risk for ${profile.label}. `}
              Models are the extension-standard workhorses growers already trust — Milholland
              (mummy berry), Mills-adapted (brown rot), Cougarblight (fire blight), Johnson
              (late blight).
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="px-6 md:px-8 pb-8 md:pb-10">
        <div className="container-narrow">
          {loading && !intel && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center text-white/60">
              Running disease models for {profile.label}…
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
              Couldn't load: {error}
            </div>
          )}
          {intel && intel.diseases.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center text-white/60">
              No disease models implemented yet for {crop.name}. Coming soon.
            </div>
          )}
          {intel && intel.diseases.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {intel.diseases.map((d) => (
                <FadeIn key={d.disease}>
                  <DiseaseCard d={d} />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-6 md:px-8 pb-10">
        <div className="container-narrow">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <IconLeaf className="w-5 h-5 text-accent-400" />
              How these models work
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-white/75">
              <div>
                <h3 className="text-white font-semibold mb-1">Leaf wetness estimation</h3>
                <p>
                  We approximate leaf wetness with RH ≥ 90% or measurable precipitation — the
                  same fallback NEWA and Penn State use when real wetness sensors aren't
                  available. Accuracy is roughly ±1 hour on event length, which is fine for
                  spray-decision flagging.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Risk thresholds</h3>
                <p>
                  Each model flags high/extreme risk based on established infection thresholds:
                  mummy berry needs 6+ hours at 50–59°F, fire blight needs 65°F + wet blossoms,
                  late blight accumulates Disease Severity Values. Rutgers and NC State IPM
                  advisories use these same numbers.
                </p>
              </div>
            </div>
            <p className="text-xs text-white/40 mt-4">
              These forecasts are educational tools, not a substitute for on-farm scouting or
              Extension advisories. Always consult your regional IPM specialist and the
              pesticide label before applying any product.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 pb-8">
        <div className="container-narrow">
          <AlertSignupCTA
            heading="Get an email when disease pressure spikes"
            pitch="We'll send you a heads-up as soon as a HIGH or EXTREME infection event is predicted for your crop — before the sporulation window opens, while there's still time to spray."
          />
        </div>
      </section>

      <section className="px-6 md:px-8 pb-12">
        <div className="container-narrow">
          <div className="rounded-2xl border border-accent-500/30 bg-gradient-to-br from-accent-500/10 to-transparent p-6 md:p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              High risk forecast? We can fly it.
            </h2>
            <p className="text-white/70 mb-5">
              FAA Part 137 agricultural drone operator serving South Jersey. Book a targeted
              fungicide application before the infection event hits.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-500 hover:bg-accent-400 text-black font-semibold transition"
            >
              Book a spray
              <IconArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function DiseasePressurePage() {
  return (
    <Suspense fallback={null}>
      <DiseasePressureInner />
    </Suspense>
  );
}
