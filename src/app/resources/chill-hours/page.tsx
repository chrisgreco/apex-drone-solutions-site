"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { GridBackground } from "@/components/ui/grid-background";
import { IconZap, IconArrowRight, IconLeaf } from "@/components/Icons";
import { useCropIntel } from "@/components/dashboard/useCropIntel";
import { AlertSignupCTA } from "@/components/dashboard/AlertSignupCTA";
import { CROPS } from "@/lib/farm-intel/crops";

function MonthlyBars({ months }: { months: { month: string; hours: number }[] }) {
  const max = Math.max(1, ...months.map((m) => m.hours));
  return (
    <div className="grid grid-cols-6 gap-2">
      {months.map((m) => (
        <div key={m.month} className="flex flex-col items-center gap-1">
          <div className="h-32 w-full flex items-end">
            <div
              className="w-full rounded-t bg-gradient-to-t from-accent-500/40 to-accent-400"
              style={{ height: `${(m.hours / max) * 100}%` }}
              title={`${m.hours}h in ${m.month}`}
            />
          </div>
          <div className="text-[10px] text-white/50 font-mono">
            {m.month.slice(5)}
          </div>
          <div className="text-xs text-white font-medium">{m.hours}h</div>
        </div>
      ))}
    </div>
  );
}

function ChillHoursInner() {
  const { profile, intel, loading, error, isDemo } = useCropIntel();
  const crop = CROPS[profile.cropPrimary];
  const chill = intel?.chill ?? null;

  const pct = chill ? Math.min(100, chill.percentComplete) : 0;

  const varietyTable = useMemo(
    () =>
      crop.varieties.map((v) => ({
        ...v,
        reached: chill ? chill.hours >= v.chillHoursReq : false,
      })),
    [crop.varieties, chill]
  );

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
              <IconZap className="w-3.5 h-3.5" />
              Chill Hours Tracker · Utah Model
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
              Chill hours for{" "}
              <span className="text-accent-400">
                {crop.emoji} {crop.name}
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              {isDemo ? "Demo: Hammonton blueberries. " : `Live from ${profile.label}. `}
              Running total since October 1, Utah model weighting.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="px-6 md:px-8 pb-6">
        <div className="container-narrow">
          {loading && !intel && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center text-white/60">
              Pulling hourly temperatures since Oct 1…
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
              {error}
            </div>
          )}
          {!chill && intel && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center text-white/60">
              Chill tracking not applicable for {crop.name} — this crop is grown as an annual
              in NJ and doesn't require winter chill.
            </div>
          )}

          {chill && (
            <>
              <FadeIn>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-white/50">
                        Accumulated · {chill.variety}
                      </div>
                      <div className="text-5xl md:text-6xl font-bold text-white mt-1">
                        {chill.hours}
                        <span className="text-2xl text-white/50 font-normal">
                          {" "}
                          / {chill.chillRequired}h
                        </span>
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
                        pct >= 100
                          ? "bg-accent-400"
                          : pct >= 70
                          ? "bg-amber-400"
                          : "bg-accent-500/60"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-white/50 text-xs uppercase tracking-wider">
                        Dynamic portions
                      </div>
                      <div className="text-white font-semibold text-lg">{chill.portions}</div>
                      <div className="text-white/50 text-xs">Fishman model</div>
                    </div>
                    <div>
                      <div className="text-white/50 text-xs uppercase tracking-wider">
                        Chill complete?
                      </div>
                      <div
                        className={`font-semibold text-lg ${
                          chill.bloomPrediction.chillComplete
                            ? "text-accent-400"
                            : "text-white/80"
                        }`}
                      >
                        {chill.bloomPrediction.chillComplete ? "Yes ✓" : "Not yet"}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/50 text-xs uppercase tracking-wider">
                        Bloom ETA
                      </div>
                      <div className="text-white font-semibold text-lg">
                        {chill.bloomPrediction.date ??
                          `Typical ${crop.typicalBloomRange.start}–${crop.typicalBloomRange.end}`}
                      </div>
                      {chill.bloomPrediction.daysOut != null && (
                        <div className="text-white/50 text-xs">
                          ~{chill.bloomPrediction.daysOut} days out
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 mt-4">
                  <h2 className="text-lg font-bold text-white mb-4">Monthly accumulation</h2>
                  <MonthlyBars months={chill.monthlyHours} />
                </div>
              </FadeIn>

              <FadeIn>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 mt-4">
                  <h2 className="text-lg font-bold text-white mb-4">
                    Variety targets · {crop.name}
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-white/50 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="text-left py-2 font-medium">Variety</th>
                          <th className="text-right py-2 font-medium">Chill req</th>
                          <th className="text-right py-2 font-medium">Status</th>
                          <th className="text-left py-2 font-medium pl-4 hidden md:table-cell">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {varietyTable.map((v) => (
                          <tr key={v.id} className="border-t border-white/5">
                            <td className="py-2 font-medium text-white">{v.name}</td>
                            <td className="py-2 text-right text-white/80">{v.chillHoursReq}h</td>
                            <td className="py-2 text-right">
                              {v.reached ? (
                                <span className="text-accent-400 font-semibold">✓ Met</span>
                              ) : (
                                <span className="text-white/50">
                                  {Math.max(0, v.chillHoursReq - chill.hours)}h to go
                                </span>
                              )}
                            </td>
                            <td className="py-2 pl-4 text-white/55 hidden md:table-cell">
                              {v.notes ?? ""}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </FadeIn>
            </>
          )}
        </div>
      </section>

      <section className="px-6 md:px-8 pb-6">
        <div className="container-narrow">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <IconLeaf className="w-5 h-5 text-accent-400" />
              How chill hours work
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-white/75">
              <div>
                <h3 className="text-white font-semibold mb-1">Utah model</h3>
                <p>
                  Weights each hour by temperature: peak credit at 36–48°F, reduced credit at
                  marginal temps, and negative credit above 60°F (warm spells reverse
                  dormancy). The Utah model is the NJ/Rutgers standard.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Why it matters</h3>
                <p>
                  Fruit trees and blueberries need a species/variety-specific amount of chill
                  to break dormancy and bloom uniformly. Insufficient chill causes delayed
                  leaf-out, scattered bloom, and reduced yield — especially in warmer winters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 pb-8">
        <div className="container-narrow">
          <AlertSignupCTA
            heading="Get an email the day chill requirement is met"
            pitch="One-time alert when your variety hits its chill target — the signal to finish pruning and prep your pre-bloom sprays. No ongoing email spam, just the milestone."
          />
        </div>
      </section>

      <section className="px-6 md:px-8 pb-12">
        <div className="container-narrow">
          <div className="rounded-2xl border border-accent-500/30 bg-gradient-to-br from-accent-500/10 to-transparent p-6 md:p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Chill complete — time to scout.</h2>
            <p className="text-white/70 mb-5">
              Once chill requirement is met, bud swell is coming fast. Plan your pre-bloom
              fungicide and scout for overwintered pests.
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

export default function ChillHoursPage() {
  return (
    <Suspense fallback={null}>
      <ChillHoursInner />
    </Suspense>
  );
}
