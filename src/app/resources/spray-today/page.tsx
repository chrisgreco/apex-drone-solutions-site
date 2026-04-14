"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FadeIn } from "@/components/FadeIn";
import { GridBackground } from "@/components/ui/grid-background";
import {
  IconDroplet,
  IconShield,
  IconArrowRight,
  IconCheckCircle,
  IconZap,
  IconSun,
} from "@/components/Icons";
import { AddressSearch } from "@/components/spray/AddressSearch";
import { SprayTimeline } from "@/components/spray/SprayTimeline";
import { SubscribeForm } from "@/components/spray/SubscribeForm";
import {
  evaluateHour,
  findNextGoWindow,
  THRESHOLDS,
  type SprayForecast,
  type Verdict,
} from "@/lib/spray-decision";

/* ------------------------------------------------------------------ */
/*  NJ counties — default locations served by AG Drones NJ            */
/* ------------------------------------------------------------------ */

const DEFAULT_COUNTIES = [
  { name: "Burlington County", lat: 39.8756, lon: -74.6724 },
  { name: "Cumberland County", lat: 39.3243, lon: -75.1271 },
  { name: "Salem County", lat: 39.5718, lon: -75.3849 },
  { name: "Atlantic County", lat: 39.4694, lon: -74.635 },
  { name: "Gloucester County", lat: 39.7224, lon: -75.1402 },
  { name: "Camden County", lat: 39.8068, lon: -74.9597 },
  { name: "Cape May County", lat: 39.0767, lon: -74.859 },
  { name: "Ocean County", lat: 39.9857, lon: -74.3118 },
] as const;

const LOCATION_STORAGE_KEY = "spray-today:last-location";

/* ------------------------------------------------------------------ */
/*  Verdict styling                                                   */
/* ------------------------------------------------------------------ */

function verdictStyle(v: Verdict) {
  if (v === "GO")
    return {
      badge: "bg-accent-500/15 border-accent-500/30 text-accent-400",
      dot: "bg-accent-400 shadow-[0_0_10px_rgba(76,175,80,0.7)]",
      headline: "Good to spray now",
      desc: "Conditions meet FAA Part 137 limits and best-practice thresholds.",
    };
  if (v === "CAUTION")
    return {
      badge: "bg-amber-400/15 border-amber-400/30 text-amber-300",
      dot: "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]",
      headline: "Proceed with caution",
      desc: "One or more marginal factors — monitor carefully or wait for the window to improve.",
    };
  return {
    badge: "bg-red-500/15 border-red-500/30 text-red-400",
    dot: "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]",
    headline: "Do not spray",
    desc: "Conditions exceed safe operating limits. Grounds all Part 137 flights.",
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

type Location = { lat: number; lon: number; label: string };

function SprayTodayInner() {
  const searchParams = useSearchParams();
  const alertParam = searchParams.get("alert");

  const [location, setLocation] = useState<Location | null>(null);
  const [forecast, setForecast] = useState<SprayForecast | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initial location: localStorage → first county
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Location;
        if (
          typeof parsed.lat === "number" &&
          typeof parsed.lon === "number" &&
          typeof parsed.label === "string"
        ) {
          setLocation(parsed);
          return;
        }
      }
    } catch {
      /* ignore */
    }
    const c = DEFAULT_COUNTIES[0];
    setLocation({ lat: c.lat, lon: c.lon, label: c.name });
  }, []);

  // Persist location
  useEffect(() => {
    if (!location) return;
    try {
      localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
    } catch {
      /* ignore */
    }
  }, [location]);

  // Fetch forecast when location changes
  useEffect(() => {
    if (!location) return;
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const url = new URL("/api/spray-forecast", window.location.origin);
        url.searchParams.set("lat", String(location!.lat));
        url.searchParams.set("lon", String(location!.lon));
        url.searchParams.set("label", location!.label);
        const res = await fetch(url.toString());
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Forecast request failed (${res.status})`);
        }
        const data = (await res.json()) as SprayForecast;
        if (cancelled) return;
        setForecast(data);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Unable to load forecast");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [location]);

  // Current-hour evaluation
  const current = useMemo(() => {
    if (!forecast || forecast.hourly.length === 0) return null;
    return evaluateHour(forecast.hourly[0], forecast.hourly.slice(1, 5));
  }, [forecast]);

  // Next GO window (next 48 hours, ≥ 2h)
  const nextWindow = useMemo(() => {
    if (!forecast) return null;
    const slice = forecast.hourly.slice(0, 48);
    const w = findNextGoWindow(slice, 2);
    if (!w) return null;
    return {
      start: slice[w.startIdx].time,
      end: slice[w.endIdx].time,
      hours: w.hours,
    };
  }, [forecast]);

  const style = current ? verdictStyle(current.verdict) : null;

  return (
    <>
      <GridBackground />

      {/* ALERT BANNER (from confirm/unsubscribe redirects) */}
      {alertParam && (
        <div className="relative z-20 pt-24">
          <div className="container-narrow">
            {alertParam === "confirmed" && (
              <div className="rounded-lg border border-accent-500/30 bg-accent-500/10 px-4 py-3 text-accent-300 text-sm">
                ✓ You're confirmed! Watch your inbox — we'll email when a spray window opens for your farm.
              </div>
            )}
            {alertParam === "unsubscribed" && (
              <div className="rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white/80 text-sm">
                You've been unsubscribed. No more alert emails — come back anytime.
              </div>
            )}
            {alertParam === "invalid" && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm">
                That link is invalid or has already been used. Contact us if you need help.
              </div>
            )}
          </div>
        </div>
      )}

      {/* HERO */}
      <section className={`px-6 md:px-8 pb-10 md:pb-12 ${alertParam ? "pt-8" : "pt-32"} relative`}>
        <div className="container-narrow relative z-10">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/30 text-accent-400 text-sm font-medium mb-6">
              <IconDroplet className="w-4 h-4" />
              Real-Time NJ Spray Decision Tool
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
              Should I Spray <span className="text-accent-400">Today?</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl">
              Free for NJ farmers. NOAA + Open-Meteo hourly forecast, FAA Part 137 limits,
              and the one thing most tools miss — <strong className="text-white">temperature inversion</strong>.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* LOCATION PICKER */}
      <section className="px-6 md:px-8 pb-8 md:pb-10">
        <div className="container-narrow">
          <FadeIn>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
              <h2 className="text-sm uppercase tracking-wider text-white/50 mb-3">
                Location
              </h2>
              <AddressSearch onLocation={setLocation} />
              <div className="mt-4 flex flex-wrap gap-2">
                {DEFAULT_COUNTIES.map((c) => {
                  const active = location?.label === c.name;
                  return (
                    <button
                      key={c.name}
                      onClick={() => setLocation({ lat: c.lat, lon: c.lon, label: c.name })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        active
                          ? "bg-accent-500 border-accent-400 text-black"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {c.name.replace(" County", "")}
                    </button>
                  );
                })}
              </div>
              {location && (
                <div className="mt-4 text-sm text-white/60">
                  Showing forecast for{" "}
                  <span className="text-white font-medium">{location.label}</span>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CURRENT VERDICT */}
      <section className="px-6 md:px-8 pb-8 md:pb-10">
        <div className="container-narrow">
          {loading && !forecast && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-white/60">
              Loading NOAA + Open-Meteo forecast…
            </div>
          )}
          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
              <div className="font-semibold mb-1">Forecast unavailable</div>
              <div className="text-sm text-red-300/80">{error}</div>
            </div>
          )}
          {current && style && forecast && (
            <FadeIn>
              <div className={`rounded-2xl border ${style.badge} p-6 md:p-8`}>
                <div className="flex items-start gap-4">
                  <div className={`mt-2 w-4 h-4 rounded-full flex-shrink-0 ${style.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs uppercase tracking-wider opacity-70 mb-1">
                      Right now · {forecast.location.label}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">
                      {style.headline}
                    </h2>
                    <p className="text-sm opacity-80 mb-4">{style.desc}</p>
                    <ul className="space-y-2">
                      {current.conditions.map((c) => (
                        <li key={c.label} className="flex gap-2.5 text-sm">
                          <span
                            className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                              c.ok
                                ? "bg-accent-400"
                                : c.caution
                                ? "bg-amber-400"
                                : "bg-red-500"
                            }`}
                            aria-hidden
                          />
                          <span className="text-white/80">
                            <span className="font-medium text-white">{c.label}:</span>{" "}
                            {c.detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* NEXT WINDOW + RAIN WASHOFF */}
      {forecast && (
        <section className="px-6 md:px-8 pb-8 md:pb-10">
          <div className="container-narrow grid grid-cols-1 md:grid-cols-2 gap-4">
            <FadeIn>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 h-full">
                <div className="text-xs uppercase tracking-wider text-white/50 mb-2">
                  Next good spray window
                </div>
                {nextWindow ? (
                  <>
                    <div className="text-2xl font-bold text-white mb-1">
                      {new Date(nextWindow.start).toLocaleString("en-US", {
                        weekday: "short",
                        hour: "numeric",
                        timeZone: "America/New_York",
                      })}{" "}
                      –{" "}
                      {new Date(nextWindow.end).toLocaleString("en-US", {
                        hour: "numeric",
                        timeZone: "America/New_York",
                      })}
                    </div>
                    <div className="text-accent-400 text-sm font-medium">
                      {nextWindow.hours} hour window
                    </div>
                  </>
                ) : (
                  <div className="text-white/60 text-sm">
                    No 2+ hour window in the next 48 hours. Check back tomorrow.
                  </div>
                )}
              </div>
            </FadeIn>
            <FadeIn>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 h-full">
                <div className="text-xs uppercase tracking-wider text-white/50 mb-2">
                  Rain washoff timer
                </div>
                <div className="space-y-1 text-sm">
                  <div className="text-white/80">
                    <span className="text-white/50">Last rain:</span>{" "}
                    <span className="font-medium text-white">
                      {forecast.pastRain.hoursSinceLastRain != null
                        ? `${forecast.pastRain.hoursSinceLastRain.toFixed(0)}h ago` +
                          (forecast.pastRain.lastRainAmountIn != null
                            ? ` (${forecast.pastRain.lastRainAmountIn.toFixed(2)} in)`
                            : "")
                        : "None in past 24h"}
                    </span>
                  </div>
                  <div className="text-white/80">
                    <span className="text-white/50">Next rain:</span>{" "}
                    <span className="font-medium text-white">
                      {forecast.pastRain.hoursUntilNextRain != null
                        ? `in ${forecast.pastRain.hoursUntilNextRain.toFixed(0)}h`
                        : "None in next 7 days"}
                    </span>
                  </div>
                  {forecast.pastRain.hoursSinceLastRain != null &&
                    forecast.pastRain.hoursSinceLastRain < THRESHOLDS.RAINFAST_HOURS && (
                      <div className="mt-2 text-xs text-amber-300">
                        ⚠ Within rainfast window — check product label before respraying.
                      </div>
                    )}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* 7-DAY TIMELINE */}
      {forecast && forecast.hourly.length > 0 && (
        <section className="px-6 md:px-8 pb-8 md:pb-10">
          <div className="container-narrow">
            <FadeIn>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">7-day spray window</h2>
                  <span className="text-xs text-white/50">Tap any hour for details</span>
                </div>
                <SprayTimeline hourly={forecast.hourly} />
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* WIND AT DRONE ALTITUDE */}
      {forecast && forecast.hourly[0] && (
        <section className="px-6 md:px-8 pb-8 md:pb-10">
          <div className="container-narrow grid grid-cols-1 md:grid-cols-2 gap-4">
            <FadeIn>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 h-full">
                <div className="text-xs uppercase tracking-wider text-white/50 mb-3">
                  Wind at drone altitude
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-white/60">Surface (10m)</span>
                    <span className="text-xl font-semibold text-white">
                      {Math.round(forecast.hourly[0].windMph)} mph
                    </span>
                  </div>
                  {forecast.hourly[0].windMph80m != null && (
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-white/60">80m aloft</span>
                      <span className="text-xl font-semibold text-white">
                        {Math.round(forecast.hourly[0].windMph80m)} mph
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-white/60">Gusts</span>
                    <span className="text-xl font-semibold text-white">
                      {Math.round(forecast.hourly[0].gustMph)} mph
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-white/50">
                  Drones typically operate at 3–30m — expect wind between the two values above.
                  Part 137 limits reference 10m surface wind.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 h-full">
                <div className="text-xs uppercase tracking-wider text-white/50 mb-3">
                  Temperature inversion
                </div>
                {forecast.hourly[0].tempF80m != null ? (
                  <>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-white/60">2m (surface)</span>
                      <span className="text-xl font-semibold text-white">
                        {Math.round(forecast.hourly[0].tempF)}°F
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-white/60">80m (aloft)</span>
                      <span className="text-xl font-semibold text-white">
                        {Math.round(forecast.hourly[0].tempF80m)}°F
                      </span>
                    </div>
                    {(() => {
                      const d = forecast.hourly[0].tempF80m! - forecast.hourly[0].tempF;
                      const inv = d > THRESHOLDS.INVERSION_DELTA_F;
                      return (
                        <div
                          className={`mt-3 text-xs ${
                            d > THRESHOLDS.INVERSION_STRONG_DELTA_F
                              ? "text-red-400"
                              : inv
                              ? "text-amber-300"
                              : "text-accent-400"
                          }`}
                        >
                          Δ {d >= 0 ? "+" : ""}
                          {d.toFixed(1)}°F ·{" "}
                          {d > THRESHOLDS.INVERSION_STRONG_DELTA_F
                            ? "Strong inversion — high drift risk"
                            : inv
                            ? "Mild inversion — droplets may drift"
                            : "No inversion"}
                        </div>
                      );
                    })()}
                    <p className="mt-2 text-[11px] text-white/50 leading-relaxed">
                      Inversions trap spray droplets and carry them off-target. Common at dawn
                      and dusk in NJ.
                    </p>
                  </>
                ) : (
                  <div className="text-sm text-white/60">
                    80m temperature data unavailable for this location.
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* SUBSCRIBE */}
      <section className="px-6 md:px-8 pb-8 md:pb-10">
        <div className="container-narrow">
          <FadeIn>
            <div className="rounded-2xl border border-accent-500/30 bg-gradient-to-br from-accent-500/10 to-transparent p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Get alerted when to spray
                  </h2>
                  <p className="text-white/70 text-sm mb-4">
                    We'll email you when a 2+ hour spray window opens for your farm. One email
                    per day max, only when conditions are actually good. Unsubscribe in one click.
                  </p>
                  <ul className="space-y-1.5 text-sm text-white/80">
                    <li className="flex items-center gap-2">
                      <IconCheckCircle className="w-4 h-4 text-accent-400" />
                      NWS + Open-Meteo data, no ads
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheckCircle className="w-4 h-4 text-accent-400" />
                      Inversion + wind + rain washoff checked
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheckCircle className="w-4 h-4 text-accent-400" />
                      Free forever
                    </li>
                  </ul>
                </div>
                <SubscribeForm location={location} />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* THRESHOLDS REFERENCE */}
      <section className="px-6 md:px-8 pb-8 md:pb-10">
        <div className="container-narrow">
          <FadeIn>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Decision thresholds</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex gap-3">
                  <IconZap className="w-5 h-5 text-accent-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Wind</div>
                    <div className="text-white/60">
                      GO ≤ 10 mph · Caution 10–15 · No-go &gt; 15 (surface/10m)
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <IconZap className="w-5 h-5 text-accent-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Gusts</div>
                    <div className="text-white/60">
                      GO ≤ 15 · Caution 15–20 · No-go &gt; 20 mph
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <IconSun className="w-5 h-5 text-accent-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Temperature</div>
                    <div className="text-white/60">
                      Optimal 50–90°F · Caution 45–50 or 90–95 · No-go outside 45–95
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <IconDroplet className="w-5 h-5 text-accent-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Rain</div>
                    <div className="text-white/60">
                      No-go if within 2h · Caution if within 4h
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <IconShield className="w-5 h-5 text-accent-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Inversion</div>
                    <div className="text-white/60">
                      Caution if T<sub>80m</sub> − T<sub>2m</sub> &gt; 0.5°F · No-go if &gt; 2°F
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <IconShield className="w-5 h-5 text-accent-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Lightning</div>
                    <div className="text-white/60">
                      Any thunderstorm in the forecast — ground all flights
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-8 pb-8 md:pb-10">
        <div className="container-narrow">
          <FadeIn>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                Window is open but you don't have a sprayer?
              </h2>
              <p className="text-white/70 mb-5">
                We fly Part 137 ag drones across South Jersey. Book a job in a good window.
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

export default function SprayTodayPage() {
  return (
    <Suspense fallback={null}>
      <SprayTodayInner />
    </Suspense>
  );
}
