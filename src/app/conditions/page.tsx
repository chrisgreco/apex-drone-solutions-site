"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { GridBackground } from "@/components/ui/grid-background";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/FadeIn";
import { BeamDivider } from "@/components/Beam";
import { EventCard } from "@/components/EventCard";
import { DroughtStatusPanel } from "@/components/DroughtStatusPanel";
import { TfrPanel } from "@/components/TfrPanel";
import { CATEGORY_CONFIG, type ConditionEvent } from "@/lib/eonet";
import type { DroughtState } from "@/lib/drought";
import type { RegionalTfr } from "@/lib/tfrs";
import { IconArrowRight } from "@/components/Icons";

const ConditionsMap = dynamic(() => import("@/components/ConditionsMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] md:h-[600px] bg-primary-950/50 rounded-xl animate-pulse flex items-center justify-center border border-accent-500/10">
      <p className="text-xs text-accent-400/40 font-mono">LOADING TERRAIN DATA...</p>
    </div>
  ),
});

export default function ConditionsPage() {
  const [events, setEvents] = useState<ConditionEvent[]>([]);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [tfrs, setTfrs] = useState<RegionalTfr[]>([]);
  const [tfrsLoading, setTfrsLoading] = useState(true);

  const [droughtStates, setDroughtStates] = useState<DroughtState[]>([]);
  const [droughtLoading, setDroughtLoading] = useState(true);

  useEffect(() => {
    fetch("/api/conditions")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events ?? []);
        setLastChecked(data.lastChecked ?? null);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));

    fetch("/api/tfrs")
      .then((res) => res.json())
      .then((data) => setTfrs(data.tfrs ?? []))
      .catch(() => setTfrs([]))
      .finally(() => setTfrsLoading(false));

    fetch("/api/drought")
      .then((res) => res.json())
      .then((data) => setDroughtStates(data.states ?? []))
      .catch(() => setDroughtStates([]))
      .finally(() => setDroughtLoading(false));
  }, []);

  const activeCount = events.length;
  const sources = {
    eonet: events.filter((e) => e.source === "eonet").length,
    nws: events.filter((e) => e.source === "nws").length,
  };

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────── */}
      <section className="relative bg-primary-950 overflow-hidden">
        <GridBackground />
        <div className="relative container-narrow mx-auto px-5 py-24 md:py-32">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Live Conditions
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.08] max-w-3xl">
              NJ Operations <span className="text-accent-400">Radar</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-white/60 max-w-2xl">
              Live monitoring across the Mid-Atlantic — New Jersey,
              Pennsylvania, Delaware &amp; New York. NASA satellite events, NOAA
              severe weather alerts, FAA airspace restrictions, and USDA drought
              status, all in one operations radar.
            </p>
          </FadeIn>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-4 text-[10px] font-mono text-accent-400/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <motion.span
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              RADAR::ONLINE
            </motion.span>
            <span className="w-1 h-1 rounded-full bg-accent-400/30" />
            <span>NASA EONET: {loading ? "..." : sources.eonet}</span>
            <span className="w-1 h-1 rounded-full bg-accent-400/30" />
            <span>NOAA NWS: {loading ? "..." : sources.nws}</span>
            <span className="w-1 h-1 rounded-full bg-accent-400/30" />
            <span>FAA TFRs: {tfrsLoading ? "..." : tfrs.length}</span>
            <span className="w-1 h-1 rounded-full bg-accent-400/30" />
            <span>USDM: {droughtLoading ? "..." : droughtStates.length} STATES</span>
          </motion.div>
        </div>
      </section>

      <BeamDivider />

      {/* ─── 3D Map ───────────────────────────────────── */}
      <section className="bg-primary-950 py-16 md:py-24">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <div className="relative bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm overflow-hidden hud-corners p-3">
              {/* Top HUD bar */}
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-4 text-[10px] font-mono text-accent-400/50">
                  <span>MAPBOX 3D TERRAIN</span>
                  <span className="w-1 h-1 rounded-full bg-accent-400/40" />
                  <span>NJ / PA / DE / NY</span>
                </div>
                <div className="text-[10px] font-mono text-accent-400/40">
                  {lastChecked && (
                    <>LAST_UPDATE: {new Date(lastChecked).toLocaleTimeString()}</>
                  )}
                </div>
              </div>

              <ConditionsMap events={events} />

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-3 px-2">
                {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.glow}` }}
                    />
                    <span className="text-[10px] font-mono text-white/50">{cfg.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <BeamDivider />

      {/* ─── Event Feed ───────────────────────────────── */}
      <section className="bg-primary-900 py-16 md:py-24">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <div className="text-center mb-10">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
                // Active Events
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Current Farm Weather Conditions
              </h2>
              <p className="mt-3 text-white/40 max-w-lg mx-auto text-sm">
                Combined feed of NASA EONET satellite events and NOAA severe
                weather alerts. Each event includes recommended drone survey
                actions.
              </p>
            </div>
          </FadeIn>

          {loading ? (
            <div className="flex justify-center py-12">
              <p className="text-sm text-white/40 font-mono animate-pulse">
                SCANNING NASA EONET &amp; NOAA NWS...
              </p>
            </div>
          ) : activeCount === 0 ? (
            <FadeIn>
              <div className="relative bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-10 text-center">
                <div className="absolute top-0 left-0 w-5 h-5 border-l-2 border-t-2 border-accent-400/30 rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-5 h-5 border-r-2 border-t-2 border-accent-400/30 rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-l-2 border-b-2 border-accent-400/30 rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-r-2 border-b-2 border-accent-400/30 rounded-br-2xl" />

                <div className="w-14 h-14 rounded-full bg-accent-900/60 border border-accent-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-accent-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">All Clear</h3>
                <p className="text-sm text-white/50 mt-2">
                  No active weather events detected in the Mid-Atlantic region.
                </p>
                {lastChecked && (
                  <p className="text-[10px] font-mono text-accent-400/40 mt-4">
                    LAST_CHECK: {new Date(lastChecked).toLocaleString()}
                  </p>
                )}
              </div>
            </FadeIn>
          ) : (
            <StaggerContainer className="grid md:grid-cols-2 gap-5">
              {events.map((event) => (
                <StaggerItem key={event.id}>
                  <EventCard event={event} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      <BeamDivider />

      {/* ─── TFRs + Drought Panels ────────────────────── */}
      <section className="bg-primary-950 py-16 md:py-24">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <div className="text-center mb-10">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
                // Airspace &amp; Drought Intel
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Flight Readiness &amp; Crop Stress Indicators
              </h2>
              <p className="mt-3 text-white/40 max-w-xl mx-auto text-sm">
                FAA airspace restrictions and USDA drought classifications —
                the data you need before every drone survey.
              </p>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-6">
            <FadeIn delay={0.1}>
              <TfrPanel tfrs={tfrs} loading={tfrsLoading} />
            </FadeIn>
            <FadeIn delay={0.2}>
              <DroughtStatusPanel states={droughtStates} loading={droughtLoading} />
            </FadeIn>
          </div>
        </div>
      </section>

      <BeamDivider />

      {/* ─── CTA ─────────────────────────────────────── */}
      <section className="relative bg-primary-950 py-16 md:py-24 overflow-hidden">
        <GridBackground />
        <div className="relative container-narrow mx-auto px-5 text-center">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Engage
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Weather Conditions Affecting Your NJ Farm?
            </h2>
            <p className="mt-3 text-white/50 max-w-lg mx-auto">
              Whether it&apos;s post-storm crop damage assessment, drought
              NDVI monitoring, or post-flood drainage surveys across South
              Jersey — AG Drones NJ is ready to fly.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-accent-500 text-primary-950 font-semibold px-6 py-3 rounded-lg hover:bg-accent-400 transition-colors"
              >
                Get a Free Quote <IconArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 border border-accent-500/30 text-accent-400 font-semibold px-6 py-3 rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                View Our Services
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
