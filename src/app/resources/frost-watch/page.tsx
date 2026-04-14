"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { GridBackground } from "@/components/ui/grid-background";
import { IconSun, IconArrowRight, IconLeaf } from "@/components/Icons";
import { useCropIntel } from "@/components/dashboard/useCropIntel";
import { CROPS, STAGE_LABEL, frostThresholdFor, type CropStage } from "@/lib/farm-intel/crops";
import type { HourlyForecast } from "@/lib/spray-decision";

type DayMin = {
  date: string; // YYYY-MM-DD
  minF: number;
  minHour: HourlyForecast;
};

function computeDailyMinima(hourly: HourlyForecast[]): DayMin[] {
  const byDay = new Map<string, HourlyForecast>();
  for (const h of hourly) {
    const d = h.time.slice(0, 10);
    const prev = byDay.get(d);
    if (!prev || h.tempF < prev.tempF) byDay.set(d, h);
  }
  return Array.from(byDay.entries())
    .slice(0, 7)
    .map(([date, minHour]) => ({ date, minF: minHour.tempF, minHour }));
}

function FrostWatchInner() {
  const { profile, intel, loading, error, isDemo } = useCropIntel();
  const crop = CROPS[profile.cropPrimary];
  const stage = (profile.cropStage ?? crop.stages[0]) as CropStage;
  const threshold = frostThresholdFor(profile.cropPrimary, stage);

  const dailyMinima = useMemo(
    () => (intel ? computeDailyMinima(intel.forecast.hourly) : []),
    [intel]
  );

  return (
    <>
      <GridBackground />

      <section className="px-6 md:px-8 pt-28 md:pt-32 pb-4">
        <div className="container-narrow">
          <Link
            href="/resources/nj-crop-dashboard"
            className="text-sm text-white/50 hover:text-white/80 transition inline-flex items-center gap-1"
          >
            ← Back to dashboard
          </Link>
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/30 text-accent-400 text-xs font-medium mt-4 mb-4">
              <IconSun className="w-3.5 h-3.5" />
              Frost Watch · Stage-Specific Kill Temps
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
              Frost watch for{" "}
              <span className="text-accent-400">
                {crop.emoji} {crop.name}
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              {isDemo ? "Demo: Hammonton blueberries. " : `Live from ${profile.label}. `}
              7-day low-temp forecast against {stage.replace("_", " ")} damage / kill thresholds.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="px-6 md:px-8 pb-6">
        <div className="container-narrow">
          {loading && !intel && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center text-white/60">
              Loading forecast…
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
              {error}
            </div>
          )}

          {intel && threshold && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-white/50 text-xs uppercase tracking-wider">
                    Current stage
                  </div>
                  <div className="text-white font-bold text-2xl mt-1">
                    {STAGE_LABEL[stage]}
                  </div>
                  <div className="text-white/50 text-xs">
                    {profile.cropStage ? "Set by you" : "Auto-detected"}
                  </div>
                </div>
                <div>
                  <div className="text-white/50 text-xs uppercase tracking-wider">
                    Damage below
                  </div>
                  <div className="text-amber-300 font-bold text-2xl mt-1">
                    {threshold.damageF}°F
                  </div>
                  <div className="text-white/50 text-xs">10% bud/bloom loss</div>
                </div>
                <div>
                  <div className="text-white/50 text-xs uppercase tracking-wider">
                    Kill below
                  </div>
                  <div className="text-red-400 font-bold text-2xl mt-1">
                    {threshold.killF}°F
                  </div>
                  <div className="text-white/50 text-xs">90% kill point</div>
                </div>
              </div>
            </div>
          )}

          {intel && dailyMinima.length > 0 && (
            <FadeIn>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <h2 className="text-lg font-bold text-white mb-4">7-day low-temp forecast</h2>
                <div className="space-y-2">
                  {dailyMinima.map((d) => {
                    const isKill = threshold && d.minF <= threshold.killF;
                    const isDamage = threshold && d.minF <= threshold.damageF;
                    const statusBg = isKill
                      ? "border-red-500/40 bg-red-500/10"
                      : isDamage
                      ? "border-amber-400/40 bg-amber-400/10"
                      : "border-white/10 bg-white/[0.02]";
                    const statusLabel = isKill ? "KILL" : isDamage ? "DAMAGE" : "SAFE";
                    const statusColor = isKill
                      ? "text-red-300"
                      : isDamage
                      ? "text-amber-300"
                      : "text-accent-400";
                    return (
                      <div
                        key={d.date}
                        className={`rounded-lg border ${statusBg} px-4 py-3 flex items-center justify-between gap-3`}
                      >
                        <div>
                          <div className="text-white font-medium">
                            {new Date(d.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-white/50 text-xs">
                            Coldest at {new Date(d.minHour.time).toLocaleString("en-US", {
                              hour: "numeric",
                              timeZone: "America/New_York",
                            })}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">
                            {Math.round(d.minF)}°F
                          </div>
                          <div className={`text-[10px] uppercase tracking-wider font-bold ${statusColor}`}>
                            {statusLabel}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      <section className="px-6 md:px-8 pb-8">
        <div className="container-narrow">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <IconLeaf className="w-5 h-5 text-accent-400" />
              Frost thresholds by stage · {crop.name}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-white/50 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left py-2 font-medium">Stage</th>
                    <th className="text-right py-2 font-medium">Damage below</th>
                    <th className="text-right py-2 font-medium">Kill below</th>
                  </tr>
                </thead>
                <tbody>
                  {crop.frost.map((f) => (
                    <tr
                      key={f.stage}
                      className={`border-t border-white/5 ${
                        f.stage === stage ? "bg-accent-500/10" : ""
                      }`}
                    >
                      <td className="py-2 text-white font-medium">
                        {STAGE_LABEL[f.stage]}
                        {f.stage === stage && (
                          <span className="ml-2 text-[10px] uppercase text-accent-400">
                            current
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-right text-amber-300">{f.damageF}°F</td>
                      <td className="py-2 text-right text-red-400">{f.killF}°F</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-white/40 mt-3">
              Source: Washington State Univ. Tree Fruit Research Ext. frost tables adapted to
              NJ-relevant varieties. Thresholds are 30-minute exposure at that temperature.
              Wind machines, orchard heaters, and overhead irrigation can offset by 2–4°F.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 pb-12">
        <div className="container-narrow">
          <div className="rounded-2xl border border-accent-500/30 bg-gradient-to-br from-accent-500/10 to-transparent p-6 md:p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Plan your spray around the window.</h2>
            <p className="text-white/70 mb-5">
              Frost nights narrow your spray opportunity. Check when conditions align next.
            </p>
            <Link
              href="/resources/spray-today"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-500 hover:bg-accent-400 text-black font-semibold transition"
            >
              See spray window
              <IconArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function FrostWatchPage() {
  return (
    <Suspense fallback={null}>
      <FrostWatchInner />
    </Suspense>
  );
}
