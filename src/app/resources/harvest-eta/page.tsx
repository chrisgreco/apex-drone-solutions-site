"use client";

import { Suspense } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { GridBackground } from "@/components/ui/grid-background";
import { IconLeaf, IconArrowRight } from "@/components/Icons";
import { useCropIntel } from "@/components/dashboard/useCropIntel";
import { AlertSignupCTA } from "@/components/dashboard/AlertSignupCTA";
import { CROPS } from "@/lib/farm-intel/crops";

function HarvestEtaInner() {
  const { profile, intel, loading, error, isDemo } = useCropIntel();
  const crop = CROPS[profile.cropPrimary];
  const harvest = intel?.harvest ?? null;

  const pct = harvest && harvest.gddTarget > 0
    ? Math.min(100, Math.round((harvest.gddAccumulated / harvest.gddTarget) * 100))
    : 0;

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
              <IconLeaf className="w-3.5 h-3.5" />
              Harvest ETA · GDD Bloom-to-Harvest
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
              Harvest ETA for{" "}
              <span className="text-accent-400">
                {crop.emoji} {crop.name}
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              {isDemo ? "Demo: Hammonton blueberries. " : `Live from ${profile.label}. `}
              Predicted harvest date from growing-degree-day accumulation since bloom.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="px-6 md:px-8 pb-6">
        <div className="container-narrow">
          {loading && !intel && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center text-white/60">
              Running GDD projection…
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
              {error}
            </div>
          )}

          {harvest && harvest.status === "pre-bloom" && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
              <div className="text-xs uppercase tracking-wider text-white/50 mb-2">
                Pre-bloom
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                Waiting for bloom
              </div>
              <p className="text-white/70 text-sm">
                Harvest forecasting starts at full bloom. Typical NJ bloom window for{" "}
                {crop.name}: <strong>{crop.typicalBloomRange.start}</strong>–
                <strong>{crop.typicalBloomRange.end}</strong>. Once bloom begins we'll
                accumulate GDD (base {crop.gddBase}°F) and project harvest to within a few
                days.
              </p>
            </div>
          )}

          {harvest && harvest.status !== "pre-bloom" && (
            <FadeIn>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-white/50">
                      Predicted harvest
                    </div>
                    <div className="text-5xl md:text-6xl font-bold text-white mt-1">
                      {harvest.harvestDateIso
                        ? new Date(harvest.harvestDateIso).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </div>
                    <div className="text-accent-400 text-sm mt-1">
                      ± {harvest.plusMinusDays} days
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-wider text-white/50">
                      Progress
                    </div>
                    <div
                      className={`text-4xl font-bold ${
                        pct >= 100 ? "text-accent-400" : "text-white"
                      }`}
                    >
                      {pct}%
                    </div>
                  </div>
                </div>

                <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      pct >= 100 ? "bg-accent-400" : pct >= 85 ? "bg-amber-400" : "bg-accent-500/60"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-white/50 text-xs uppercase tracking-wider">
                      GDD accumulated
                    </div>
                    <div className="text-white font-semibold text-lg">
                      {harvest.gddAccumulated}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/50 text-xs uppercase tracking-wider">
                      GDD target
                    </div>
                    <div className="text-white font-semibold text-lg">{harvest.gddTarget}</div>
                  </div>
                  <div>
                    <div className="text-white/50 text-xs uppercase tracking-wider">
                      Bloom date
                    </div>
                    <div className="text-white font-semibold text-lg">
                      {harvest.bloomDate ?? "—"}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      <section className="px-6 md:px-8 pb-8">
        <div className="container-narrow">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <h2 className="text-lg font-bold text-white mb-4">
              Variety harvest targets · {crop.name}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-white/50 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left py-2 font-medium">Variety</th>
                    <th className="text-right py-2 font-medium">GDD to harvest</th>
                    <th className="text-left py-2 font-medium pl-4 hidden md:table-cell">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {crop.varieties.map((v) => (
                    <tr key={v.id} className="border-t border-white/5">
                      <td className="py-2 text-white font-medium">{v.name}</td>
                      <td className="py-2 text-right text-white/80">
                        {v.gddBloomToHarvest ?? crop.gddBloomToHarvest} GDD
                      </td>
                      <td className="py-2 pl-4 text-white/55 hidden md:table-cell">
                        {v.notes ?? ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-white/40 mt-3">
              GDD base {crop.gddBase}°F. Daily accumulation uses (Tmax + Tmin) / 2 − base,
              floored at zero. Harvest projection extrapolates using the trailing 14-day
              average from Open-Meteo's NJ archive.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 pb-8">
        <div className="container-narrow">
          <AlertSignupCTA
            heading="Get updates as harvest approaches"
            pitch="We'll fold harvest ETA into your daily digest alongside spray windows and disease pressure — so you know when to line up labor, bins, and packing."
          />
        </div>
      </section>

      <section className="px-6 md:px-8 pb-12">
        <div className="container-narrow">
          <div className="rounded-2xl border border-accent-500/30 bg-gradient-to-br from-accent-500/10 to-transparent p-6 md:p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Final cover sprays before harvest?</h2>
            <p className="text-white/70 mb-5">
              Pre-harvest intervals get tight as the date approaches. Check disease pressure
              and your spray window before the clock runs out.
            </p>
            <Link
              href="/resources/disease-pressure"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-500 hover:bg-accent-400 text-black font-semibold transition"
            >
              See disease pressure
              <IconArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function HarvestEtaPage() {
  return (
    <Suspense fallback={null}>
      <HarvestEtaInner />
    </Suspense>
  );
}
