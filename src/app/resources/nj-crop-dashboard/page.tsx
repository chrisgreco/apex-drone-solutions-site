"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FadeIn } from "@/components/FadeIn";
import { GridBackground } from "@/components/ui/grid-background";
import {
  IconDroplet,
  IconSun,
  IconZap,
  IconLeaf,
  IconTarget,
  IconShield,
  IconChart,
  IconBarChart,
  IconArrowRight,
  IconWheat,
  IconMapPin,
  IconDollar,
} from "@/components/Icons";
import { FarmPicker, PROFILE_STORAGE_KEY } from "@/components/dashboard/FarmPicker";
import { Tile, type TileStatus } from "@/components/dashboard/Tile";
import { ActionBanner } from "@/components/dashboard/ActionBanner";
import {
  evaluateHour,
  findNextGoWindow,
  type Verdict,
} from "@/lib/spray-decision";
import {
  CROPS,
  STAGE_LABEL,
  type CropId,
  type CropStage,
} from "@/lib/farm-intel/crops";
import { computeBannerCards } from "@/lib/farm-intel/banner";
import type { RiskLevel } from "@/lib/farm-intel/disease-models";
import type { CropIntelResponse } from "@/app/api/crop-intel/route";
import {
  NJ_CROPS,
  NJ_COUNTIES,
  NJ_RANKINGS,
  NJ_HEADLINE_STATS,
} from "@/lib/nj-ag-stats";

type Profile = {
  email: string;
  label: string;
  lat: number;
  lon: number;
  cropPrimary: CropId;
  cropStage: CropStage | null;
  acres: number | null;
};

// Hammonton, NJ — the blueberry capital. Default demo farm.
const DEMO_PROFILE: Profile = {
  email: "demo@agdronesnj.com",
  label: "Hammonton, NJ 08037",
  lat: 39.6365,
  lon: -74.7897,
  cropPrimary: "blueberry",
  cropStage: null,
  acres: null,
};

const RISK_STATUS: Record<RiskLevel, TileStatus> = {
  low: "good",
  moderate: "watch",
  high: "alert",
  extreme: "alert",
};

function verdictToStatus(v: Verdict): TileStatus {
  if (v === "GO") return "good";
  if (v === "CAUTION") return "watch";
  return "alert";
}

function sumNextHoursPrecip(forecast: CropIntelResponse["forecast"], hours: number): number {
  return forecast.hourly.slice(0, hours).reduce((a, h) => a + h.precipIn, 0);
}

function formatRelativeHour(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    hour: "numeric",
    timeZone: "America/New_York",
  });
}

/* ------------------------------------------------------------------ */

function DashboardInner() {
  const searchParams = useSearchParams();
  const alertParam = searchParams.get("alert");

  const [profile, setProfile] = useState<Profile>(DEMO_PROFILE);
  const [isDemo, setIsDemo] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [intel, setIntel] = useState<CropIntelResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Profile;
      if (saved.lat && saved.lon && saved.cropPrimary) {
        setProfile(saved);
        setIsDemo(false);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const url = new URL("/api/crop-intel", window.location.origin);
        url.searchParams.set("lat", String(profile.lat));
        url.searchParams.set("lon", String(profile.lon));
        url.searchParams.set("label", profile.label);
        url.searchParams.set("crop", profile.cropPrimary);
        if (profile.cropStage) url.searchParams.set("stage", profile.cropStage);
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(`Intel ${res.status}`);
        const data = (await res.json()) as CropIntelResponse;
        if (cancelled) return;
        setIntel(data);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Dashboard unavailable");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [profile]);

  const forecast = intel?.forecast ?? null;
  const currentHour = forecast?.hourly[0];

  const currentEval = useMemo(() => {
    if (!forecast || !currentHour) return null;
    return evaluateHour(currentHour, forecast.hourly.slice(1, 5));
  }, [forecast, currentHour]);

  const nextGoWindow = useMemo(() => {
    if (!forecast) return null;
    return findNextGoWindow(forecast.hourly.slice(0, 48), 2);
  }, [forecast]);

  const bannerCards = useMemo(() => {
    if (!intel) return [];
    return computeBannerCards({
      forecast: intel.forecast,
      cropId: profile.cropPrimary,
      cropStage: profile.cropStage,
      diseases: intel.diseases,
      chill: intel.chill,
    });
  }, [intel, profile.cropPrimary, profile.cropStage]);

  const crop = CROPS[profile.cropPrimary];

  const coldest24h = useMemo(() => {
    if (!forecast) return null;
    const next24 = forecast.hourly.slice(0, 24);
    if (next24.length === 0) return null;
    return next24.reduce((min, h) => (h.tempF < min.tempF ? h : min));
  }, [forecast]);

  const topDisease = intel?.diseases[0] ?? null;
  const chill = intel?.chill ?? null;
  const harvest = intel?.harvest ?? null;
  const pollination = intel?.pollination ?? null;

  return (
    <>
      <GridBackground />

      {alertParam && (
        <div className="relative z-20 pt-24">
          <div className="container-narrow px-6 md:px-8">
            {alertParam === "confirmed" && (
              <div className="rounded-lg border border-accent-500/30 bg-accent-500/10 px-4 py-3 text-accent-300 text-sm">
                ✓ Confirmed! Your farm is set up. We'll email only when something actually matters.
              </div>
            )}
            {alertParam === "unsubscribed" && (
              <div className="rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white/80 text-sm">
                You've been unsubscribed. No more emails — come back anytime.
              </div>
            )}
            {alertParam === "invalid" && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm">
                That link is invalid or already used.
              </div>
            )}
          </div>
        </div>
      )}

      {/* HERO */}
      <section className={`px-6 md:px-8 ${alertParam ? "pt-8" : "pt-28 md:pt-32"} pb-6`}>
        <div className="container-narrow">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/30 text-accent-400 text-xs font-medium mb-5">
              <IconLeaf className="w-3.5 h-3.5" />
              Free NJ Grower Dashboard
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
              Everything your farm needs —{" "}
              <span className="text-accent-400">one screen.</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Spray windows, frost warnings, disease pressure, chill hours, harvest dates —
              all live, all free, all tuned for your exact crop at your exact location.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* FARM CHIP */}
      <section className="px-6 md:px-8 pb-4">
        <div className="container-narrow">
          <FadeIn>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 flex flex-wrap items-center gap-3">
              <span className="text-2xl" aria-hidden>
                {crop.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-xs uppercase tracking-wider text-white/50">
                  {isDemo ? "Demo farm" : "Your farm"}
                </div>
                <div className="text-white font-medium truncate">
                  {crop.name}
                  {profile.cropStage && ` · ${STAGE_LABEL[profile.cropStage]}`}
                  {profile.acres && ` · ${profile.acres} ac`}
                  <span className="text-white/50 font-normal"> · {profile.label}</span>
                </div>
              </div>
              {isDemo ? (
                <button
                  onClick={() => setShowPicker((s) => !s)}
                  className="px-4 py-2 rounded-lg bg-accent-500 hover:bg-accent-400 text-black text-sm font-semibold transition whitespace-nowrap"
                >
                  {showPicker ? "Close" : "Unlock YOUR farm →"}
                </button>
              ) : (
                <button
                  onClick={() => setShowPicker((s) => !s)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-sm transition whitespace-nowrap"
                >
                  Edit farm
                </button>
              )}
            </div>
          </FadeIn>

          {showPicker && (
            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <FarmPicker
                onSaved={(p) => {
                  setProfile(p);
                  setIsDemo(false);
                  setShowPicker(false);
                }}
                onCancel={() => setShowPicker(false)}
              />
            </div>
          )}
        </div>
      </section>

      {/* ACTION BANNER */}
      <section className="px-6 md:px-8 pb-6">
        <div className="container-narrow">
          {loading && !intel ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-white/60 text-sm">
              Loading dashboard for {profile.label}…
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300 text-sm">
              Couldn't load: {error}
            </div>
          ) : (
            <FadeIn>
              <ActionBanner
                cards={bannerCards}
                emptyLabel={`All clear for your ${crop.name.toLowerCase()}s — nothing urgent today.`}
              />
            </FadeIn>
          )}
        </div>
      </section>

      {/* TILE GRID */}
      <section className="px-6 md:px-8 pb-8 md:pb-10">
        <div className="container-narrow space-y-6">
          {/* TODAY */}
          <div>
            <h2 className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-3">
              Today
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Tile
                label="Spray window"
                status={currentEval ? verdictToStatus(currentEval.verdict) : "loading"}
                value={
                  currentEval
                    ? currentEval.verdict === "GO"
                      ? "Good now"
                      : currentEval.verdict === "CAUTION"
                      ? "Marginal"
                      : "No-go"
                    : "…"
                }
                context={
                  nextGoWindow && forecast
                    ? `Next window: ${formatRelativeHour(forecast.hourly[nextGoWindow.startIdx].time)} · ${nextGoWindow.hours}h`
                    : "No 2h window in 48h"
                }
                icon={<IconDroplet className="w-4 h-4" />}
                href="/resources/spray-today"
              />

              <Tile
                label="Frost watch"
                status={
                  coldest24h
                    ? coldest24h.tempF <= 28
                      ? "alert"
                      : coldest24h.tempF <= 32
                      ? "watch"
                      : "good"
                    : "loading"
                }
                value={coldest24h ? `${Math.round(coldest24h.tempF)}°F low` : "…"}
                context={coldest24h ? formatRelativeHour(coldest24h.time) : undefined}
                subtitle={
                  profile.cropStage
                    ? `${crop.name} · ${STAGE_LABEL[profile.cropStage]}`
                    : "Stage auto-detect"
                }
                icon={<IconSun className="w-4 h-4" />}
                href="/resources/frost-watch"
              />

              <Tile
                label="Rain washoff"
                status={
                  forecast
                    ? forecast.pastRain.hoursSinceLastRain != null &&
                      forecast.pastRain.hoursSinceLastRain < 6
                      ? "watch"
                      : "good"
                    : "loading"
                }
                value={
                  forecast
                    ? forecast.pastRain.hoursSinceLastRain != null
                      ? `${forecast.pastRain.hoursSinceLastRain.toFixed(0)}h ago`
                      : "Dry"
                    : "…"
                }
                context={
                  forecast?.pastRain.hoursUntilNextRain != null
                    ? `Next rain: in ${forecast.pastRain.hoursUntilNextRain.toFixed(0)}h`
                    : "No rain in 7d forecast"
                }
                icon={<IconDroplet className="w-4 h-4" />}
                href="/resources/spray-today"
              />
            </div>
          </div>

          {/* THIS WEEK */}
          <div>
            <h2 className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-3">
              This week
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Tile
                label="Disease risk"
                status={topDisease ? RISK_STATUS[topDisease.risk] : "loading"}
                value={topDisease ? topDisease.name : "…"}
                context={topDisease ? topDisease.headline : undefined}
                subtitle={
                  intel && intel.diseases.length > 1
                    ? `+${intel.diseases.length - 1} more tracked`
                    : "Infection-event model"
                }
                icon={<IconShield className="w-4 h-4" />}
                href="/resources/disease-pressure"
              />

              <Tile
                label="Pollination window"
                status={
                  pollination?.bestDay
                    ? pollination.bestDay.rating === "excellent"
                      ? "good"
                      : pollination.bestDay.rating === "good"
                      ? "good"
                      : pollination.bestDay.rating === "fair"
                      ? "watch"
                      : "alert"
                    : "loading"
                }
                value={
                  pollination?.bestDay
                    ? `${pollination.bestDay.goodHours}h best`
                    : "…"
                }
                context={
                  pollination?.bestDay
                    ? new Date(pollination.bestDay.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })
                    : undefined
                }
                subtitle={`${pollination?.totalGoodHours ?? 0}h of flight weather, 7d`}
                icon={<IconTarget className="w-4 h-4" />}
                href="/resources/crop-health"
              />

              <Tile
                label="7-day rainfall"
                status={
                  forecast
                    ? sumNextHoursPrecip(forecast, 168) > 1.5
                      ? "watch"
                      : "good"
                    : "loading"
                }
                value={
                  forecast ? `${sumNextHoursPrecip(forecast, 168).toFixed(2)} in` : "…"
                }
                context="Next 7 days total"
                icon={<IconChart className="w-4 h-4" />}
                href="/resources/spray-today"
              />
            </div>
          </div>

          {/* THIS SEASON */}
          <div>
            <h2 className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-3">
              This season
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Tile
                label="Chill hours"
                status={
                  chill
                    ? chill.percentComplete >= 100
                      ? "good"
                      : chill.percentComplete >= 70
                      ? "watch"
                      : "neutral"
                    : "loading"
                }
                value={
                  chill ? `${chill.hours}h / ${chill.chillRequired}h` : "…"
                }
                context={
                  chill
                    ? chill.percentComplete >= 100
                      ? `✓ Complete · ${chill.variety}`
                      : `${chill.percentComplete}% · ${chill.variety}`
                    : undefined
                }
                subtitle={
                  chill?.bloomPrediction.date
                    ? `Bloom ETA ${chill.bloomPrediction.date}`
                    : "Since Oct 1"
                }
                icon={<IconZap className="w-4 h-4" />}
                href="/resources/chill-hours"
              />

              <Tile
                label="Harvest ETA"
                status={
                  harvest?.harvestDateIso
                    ? harvest.status === "harvest"
                      ? "good"
                      : "neutral"
                    : "neutral"
                }
                value={harvest?.harvestDateIso ?? "Pre-bloom"}
                context={
                  harvest?.harvestDateIso
                    ? `±${harvest.plusMinusDays}d · ${harvest.gddAccumulated}/${harvest.gddTarget} GDD`
                    : harvest
                    ? `Typical bloom ${crop.typicalBloomRange.start}–${crop.typicalBloomRange.end}`
                    : undefined
                }
                subtitle={`Base ${crop.gddBase}°F`}
                icon={<IconLeaf className="w-4 h-4" />}
                href="/resources/harvest-eta"
              />

              <Tile
                label="Growing degree days"
                status="neutral"
                value="GDD tracker"
                subtitle={`${crop.name} phenology calculator`}
                icon={<IconBarChart className="w-4 h-4" />}
                href="/resources/growing-degree-days"
              />
            </div>
          </div>

          {/* MORE TOOLS */}
          <div>
            <h2 className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-3">
              More tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Tile
                label="Pest activity"
                status="neutral"
                value={`${crop.pests.length} targets`}
                subtitle={crop.pests
                  .slice(0, 3)
                  .map((p) => p.replace(/_/g, " "))
                  .join(", ")}
                href="/resources/pest-identifier"
              />
              <Tile
                label="Crop health"
                status="neutral"
                value="Monitor stress"
                subtitle="5 stress factors, detection timeline"
                href="/resources/crop-health"
              />
              <Tile
                label="Yield calculator"
                status="neutral"
                value={profile.cropPrimary === "blueberry" ? "Blueberry" : "Coming soon"}
                subtitle={
                  profile.cropPrimary === "blueberry"
                    ? "Estimate yield + revenue"
                    : "Blueberry model live today"
                }
                href="/resources/blueberry-yield-calculator"
              />
              <Tile
                label="Plan my farm"
                status="neutral"
                value="Crop recommender"
                subtitle="Match crops to your soil"
                href="/resources/crop-recommender"
              />
            </div>
          </div>
        </div>
      </section>

      {/* NJ AG AT A GLANCE */}
      <section className="px-6 md:px-8 pb-8 md:pb-10">
        <div className="container-narrow">
          <FadeIn>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
              <div className="flex items-center gap-2 mb-5">
                <IconWheat className="w-5 h-5 text-accent-400" />
                <h2 className="text-xl font-bold text-white">NJ agriculture at a glance</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {NJ_HEADLINE_STATS.map((s, i) => (
                  <div
                    key={s.label}
                    className="rounded-lg bg-white/[0.04] border border-white/5 p-3"
                  >
                    <div className="flex items-center gap-2 text-white/50">
                      {i === 0 && <IconWheat className="w-4 h-4" />}
                      {i === 1 && <IconMapPin className="w-4 h-4" />}
                      {i === 2 && <IconDollar className="w-4 h-4" />}
                      {i === 3 && <IconLeaf className="w-4 h-4" />}
                      <span className="text-[10px] uppercase tracking-wider">{s.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-white mt-1">{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-white/80 mb-2">
                    Top crops by production value
                  </h3>
                  <ul className="space-y-1.5 text-sm">
                    {NJ_CROPS.slice(0, 6).map((c) => (
                      <li
                        key={c.name}
                        className="flex items-center justify-between gap-3 py-1 border-b border-white/5"
                      >
                        <span className="text-white/80">
                          <span className="mr-1">{c.emoji}</span>
                          {c.name}
                        </span>
                        <span className="text-white font-medium">${c.valueM}M</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white/80 mb-2">
                    National rankings
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {NJ_RANKINGS.map((r) => (
                      <li key={r.crop} className="flex gap-3">
                        <span className="text-accent-400 font-bold">#{r.rank}</span>
                        <span className="text-white/80">
                          <span className="font-medium text-white">{r.crop}</span>{" "}
                          <span className="text-white/55">— {r.blurb}</span>
                        </span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-sm font-semibold text-white/80 mb-2 mt-4">
                    Top ag counties
                  </h3>
                  <ul className="space-y-1 text-sm">
                    {NJ_COUNTIES.map((c) => (
                      <li key={c.name} className="flex items-center justify-between">
                        <span className="text-white/80">
                          <span className="mr-1">{c.emoji}</span>
                          {c.name}
                        </span>
                        <span className="text-white/60">
                          {(c.acres / 1000).toFixed(0)}K ac
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="mt-5 text-xs text-white/40">
                Source: USDA NASS 2023 · NJ Department of Agriculture
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-8 pb-12">
        <div className="container-narrow">
          <FadeIn>
            <div className="rounded-2xl border border-accent-500/30 bg-gradient-to-br from-accent-500/10 to-transparent p-6 md:p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Window open? Skip the sprayer — we'll fly the job.
              </h2>
              <p className="text-white/70 mb-5 max-w-2xl mx-auto">
                FAA Part 137 ag drones, serving South Jersey. Book when conditions are right,
                we handle the rest.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-500 hover:bg-accent-400 text-black font-semibold transition"
              >
                Book a spray
                <IconArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}

export default function NJCropDashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardInner />
    </Suspense>
  );
}
