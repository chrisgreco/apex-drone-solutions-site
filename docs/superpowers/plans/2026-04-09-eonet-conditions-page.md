# NJ Operations Radar — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public `/conditions` page that displays live NASA EONET events on a 3D Mapbox terrain map of New Jersey, with actionable CTAs connecting each event to AG Drones NJ services.

**Architecture:** Next.js API route proxies NASA EONET v3 API with 15-min cache. Client page loads Mapbox GL with 3D terrain, plots events as animated markers with severity extrusion columns. Event cards below the map provide farmer-focused context and service CTAs.

**Tech Stack:** Next.js 16 App Router, Mapbox GL JS (already installed), Framer Motion (already installed), date-fns (already installed), NASA EONET v3 API.

**Spec:** `docs/superpowers/specs/2026-04-09-eonet-conditions-page-design.md`

---

## File Map

| File | Purpose |
|------|---------|
| `src/lib/eonet.ts` | TypeScript types, category config (colors, CTAs), fetch helper |
| `src/app/api/conditions/route.ts` | GET handler: fetch EONET, filter to NJ, cache 15min |
| `src/components/ConditionsMap.tsx` | Mapbox 3D terrain map with event markers + severity columns |
| `src/components/EventCard.tsx` | Single event card with colored indicator, description, CTA |
| `src/app/conditions/layout.tsx` | Metadata, OpenGraph, JSON-LD |
| `src/app/conditions/page.tsx` | Page: hero, map, event feed, CTA section |
| `src/components/Header.tsx` | Add "Conditions" nav link (modify existing) |

---

### Task 1: EONET Types & Category Config

**Files:**
- Create: `src/lib/eonet.ts`

- [ ] **Step 1: Create the EONET types and category configuration**

```typescript
// src/lib/eonet.ts

// ─── Types ──────────────────────────────────────────────────

export interface EonetGeometry {
  magnitudeValue: number | null;
  magnitudeUnit: string | null;
  date: string;
  type: "Point" | "Polygon";
  coordinates: [number, number] | [number, number][];
}

export interface EonetCategory {
  id: string;
  title: string;
}

export interface EonetEvent {
  id: string;
  title: string;
  description: string | null;
  link: string;
  closed: string | null;
  categories: EonetCategory[];
  geometry: EonetGeometry[];
}

export interface EonetResponse {
  title: string;
  description: string;
  events: EonetEvent[];
}

// Normalized event for our UI
export interface ConditionEvent {
  id: string;
  title: string;
  description: string | null;
  category: string;
  coordinates: [number, number]; // [lng, lat]
  magnitude: number | null;
  magnitudeUnit: string | null;
  date: string;
  link: string;
}

// ─── Category Config ────────────────────────────────────────

export const CATEGORY_CONFIG: Record<
  string,
  { label: string; color: string; glow: string; cta: string }
> = {
  severeStorms: {
    label: "Severe Storm",
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.5)",
    cta: "Schedule Post-Storm Assessment",
  },
  floods: {
    label: "Flood",
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.5)",
    cta: "Request Drainage & Field Survey",
  },
  wildfires: {
    label: "Wildfire",
    color: "#ef4444",
    glow: "rgba(239,68,68,0.5)",
    cta: "Request Smoke Impact Survey",
  },
  drought: {
    label: "Drought",
    color: "#fbbf24",
    glow: "rgba(251,191,36,0.5)",
    cta: "Book Crop Stress Survey",
  },
  tempExtremes: {
    label: "Temperature Extreme",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.5)",
    cta: "Schedule Frost/Heat Damage Assessment",
  },
};

// NJ bounding box (with buffer)
export const NJ_BBOX = {
  west: -75.6,
  south: 38.9,
  east: -73.9,
  north: 41.4,
};

export const EONET_CATEGORIES = Object.keys(CATEGORY_CONFIG).join(",");

// ─── Fetch Helper ───────────────────────────────────────────

export function normalizeEvents(data: EonetResponse): ConditionEvent[] {
  return data.events
    .filter((e) => e.geometry.length > 0)
    .map((e) => {
      const latest = e.geometry[e.geometry.length - 1];
      const coords: [number, number] =
        latest.type === "Point"
          ? (latest.coordinates as [number, number])
          : (latest.coordinates as [number, number][])[0];

      return {
        id: e.id,
        title: e.title,
        description: e.description,
        category: e.categories[0]?.id ?? "unknown",
        coordinates: coords,
        magnitude: latest.magnitudeValue,
        magnitudeUnit: latest.magnitudeUnit,
        date: latest.date,
        link: e.link,
      };
    });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/eonet.ts
git commit -m "feat(conditions): add EONET types, category config, and normalize helper"
```

---

### Task 2: API Route

**Files:**
- Create: `src/app/api/conditions/route.ts`

- [ ] **Step 1: Create the API route with 15-min cache**

```typescript
// src/app/api/conditions/route.ts

import { NextResponse } from "next/server";
import {
  NJ_BBOX,
  EONET_CATEGORIES,
  normalizeEvents,
  type EonetResponse,
  type ConditionEvent,
} from "@/lib/eonet";

export const revalidate = 900; // 15 minutes

export async function GET() {
  try {
    const url = new URL("https://eonet.gsfc.nasa.gov/api/v3/events");
    url.searchParams.set("status", "open");
    url.searchParams.set("category", EONET_CATEGORIES);
    url.searchParams.set(
      "bbox",
      `${NJ_BBOX.west},${NJ_BBOX.south},${NJ_BBOX.east},${NJ_BBOX.north}`
    );

    const res = await fetch(url.toString(), { next: { revalidate: 900 } });

    if (!res.ok) {
      return NextResponse.json(
        { events: [], error: "EONET API unavailable", lastChecked: new Date().toISOString() },
        { status: 200 }
      );
    }

    const data: EonetResponse = await res.json();
    const events: ConditionEvent[] = normalizeEvents(data);

    return NextResponse.json({
      events,
      lastChecked: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { events: [], error: "Failed to fetch conditions", lastChecked: new Date().toISOString() },
      { status: 200 }
    );
  }
}
```

- [ ] **Step 2: Test the route locally**

Run: `curl http://localhost:3000/api/conditions`
Expected: JSON with `events` array (possibly empty if no active NJ events) and `lastChecked` timestamp.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/conditions/route.ts
git commit -m "feat(conditions): add EONET API proxy route with 15-min cache"
```

---

### Task 3: ConditionsMap Component

**Files:**
- Create: `src/components/ConditionsMap.tsx`

- [ ] **Step 1: Create the Mapbox 3D terrain map with event markers and severity columns**

```typescript
// src/components/ConditionsMap.tsx

"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { CATEGORY_CONFIG, type ConditionEvent } from "@/lib/eonet";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// South Jersey center
const NJ_CENTER: [number, number] = [-74.85, 39.55];
const NJ_ZOOM = 8.2;
const NJ_PITCH = 55;
const NJ_BEARING = -10;

interface ConditionsMapProps {
  events: ConditionEvent[];
}

export default function ConditionsMap({ events }: ConditionsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!MAPBOX_TOKEN || !containerRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: NJ_CENTER,
      zoom: NJ_ZOOM,
      pitch: NJ_PITCH,
      bearing: NJ_BEARING,
      antialias: true,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on("load", () => {
      // Add 3D terrain
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 2.5 });

      // Add sky layer for atmosphere
      map.addLayer({
        id: "sky",
        type: "sky",
        paint: {
          "sky-type": "atmosphere",
          "sky-atmosphere-sun": [0.0, 0.0],
          "sky-atmosphere-sun-intensity": 15,
        },
      });

      // Add severity columns as fill-extrusion
      if (events.length > 0) {
        const features = events.map((event) => {
          const config = CATEGORY_CONFIG[event.category];
          // Create a small polygon around the point for extrusion
          const lng = event.coordinates[0];
          const lat = event.coordinates[1];
          const offset = 0.015; // ~1.5km square

          // Height based on magnitude or default
          const height = event.magnitude
            ? Math.min(Math.max(event.magnitude * 50, 2000), 30000)
            : 8000;

          return {
            type: "Feature" as const,
            properties: {
              color: config?.color ?? "#888",
              height,
              id: event.id,
            },
            geometry: {
              type: "Polygon" as const,
              coordinates: [
                [
                  [lng - offset, lat - offset],
                  [lng + offset, lat - offset],
                  [lng + offset, lat + offset],
                  [lng - offset, lat + offset],
                  [lng - offset, lat - offset],
                ],
              ],
            },
          };
        });

        map.addSource("event-columns", {
          type: "geojson",
          data: { type: "FeatureCollection", features },
        });

        map.addLayer({
          id: "event-columns-layer",
          type: "fill-extrusion",
          source: "event-columns",
          paint: {
            "fill-extrusion-color": ["get", "color"],
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-base": 0,
            "fill-extrusion-opacity": 0.6,
          },
        });
      }

      // Add animated HTML markers
      events.forEach((event) => {
        const config = CATEGORY_CONFIG[event.category];
        if (!config) return;

        const el = document.createElement("div");
        el.className = "eonet-marker";
        el.innerHTML = `
          <div style="
            width: 16px; height: 16px;
            background: ${config.color};
            border-radius: 50%;
            box-shadow: 0 0 12px ${config.glow}, 0 0 24px ${config.glow};
            animation: eonet-pulse 2s ease-in-out infinite;
          "></div>
        `;

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(event.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 15, closeButton: false }).setHTML(`
              <div style="font-family:ui-monospace,monospace; font-size:12px; max-width:220px;">
                <strong style="color:${config.color};">${config.label}</strong>
                <p style="margin:4px 0 0; color:#333; font-size:11px;">${event.title}</p>
              </div>
            `)
          )
          .addTo(map);

        markersRef.current.push(marker);
      });
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
    };
  }, [events]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-[500px] bg-primary-950 rounded-xl flex items-center justify-center border border-accent-500/10">
        <p className="text-xs text-white/40 font-mono">MAPBOX_TOKEN not configured</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes eonet-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.6; }
        }
        .mapboxgl-popup-content {
          background: #fff;
          border-radius: 8px;
          padding: 10px 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .mapboxgl-popup-tip { border-top-color: #fff; }
      `}</style>
      <div ref={containerRef} className="w-full h-[500px] md:h-[600px] rounded-xl" />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ConditionsMap.tsx
git commit -m "feat(conditions): add 3D terrain map with animated EONET markers and severity columns"
```

---

### Task 4: EventCard Component

**Files:**
- Create: `src/components/EventCard.tsx`

- [ ] **Step 1: Create the event card component**

```typescript
// src/components/EventCard.tsx

"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CATEGORY_CONFIG, type ConditionEvent } from "@/lib/eonet";

interface EventCardProps {
  event: ConditionEvent;
}

export function EventCard({ event }: EventCardProps) {
  const config = CATEGORY_CONFIG[event.category];
  if (!config) return null;

  const timeAgo = formatDistanceToNow(new Date(event.date), { addSuffix: true });

  // Build contact link with event context
  const contactParams = new URLSearchParams({
    subject: `${config.label} — ${event.title}`,
    source: "conditions-radar",
  });

  return (
    <div className="relative bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-5 hover:border-accent-400/30 hover:bg-white/[0.06] transition-all duration-300">
      {/* HUD corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-accent-400/20 rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-accent-400/20 rounded-tr-2xl" />

      <div className="flex items-start gap-3">
        {/* Color indicator */}
        <div
          className="w-3 h-3 rounded-full shrink-0 mt-1.5"
          style={{
            background: config.color,
            boxShadow: `0 0 10px ${config.glow}`,
          }}
        />

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-[15px] font-semibold text-white leading-snug">
            {event.title}
          </h3>

          {/* Meta */}
          <p className="text-[11px] text-white/40 font-mono mt-1">
            Detected {timeAgo} via NASA EONET
            {event.magnitude && event.magnitudeUnit && (
              <> &middot; {event.magnitude.toLocaleString()} {event.magnitudeUnit}</>
            )}
          </p>

          {/* Description */}
          {event.description && (
            <p className="text-sm text-white/50 mt-2 leading-relaxed">
              {event.description}
            </p>
          )}

          {/* CTA */}
          <Link
            href={`/contact?${contactParams.toString()}`}
            className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{
              background: `${config.color}15`,
              border: `1px solid ${config.color}30`,
              color: config.color,
            }}
          >
            {config.cta}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/EventCard.tsx
git commit -m "feat(conditions): add EventCard with category color, time-ago, and service CTA"
```

---

### Task 5: Conditions Page Layout (SEO/Metadata)

**Files:**
- Create: `src/app/conditions/layout.tsx`

- [ ] **Step 1: Create the layout with metadata and JSON-LD**

```typescript
// src/app/conditions/layout.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NJ Operations Radar — Live Conditions | AG Drones NJ",
  description:
    "Real-time NASA satellite monitoring of weather events affecting South Jersey agriculture. Track storms, floods, wildfires, drought, and temperature extremes across NJ farmland.",
  alternates: { canonical: "https://agdronesnj.com/conditions" },
  openGraph: {
    title: "NJ Operations Radar | AG Drones NJ",
    description:
      "Live NASA EONET data showing conditions affecting NJ farms. Severe storms, floods, wildfires, drought monitoring for drone operations.",
    url: "https://agdronesnj.com/conditions",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "NJ Operations Radar",
            description:
              "Real-time NASA satellite monitoring of weather events affecting South Jersey agriculture.",
            url: "https://agdronesnj.com/conditions",
            provider: {
              "@type": "LocalBusiness",
              name: "AG Drones NJ",
              url: "https://agdronesnj.com",
            },
            about: {
              "@type": "Thing",
              name: "Agricultural weather monitoring",
              description:
                "Live tracking of severe storms, floods, wildfires, drought, and temperature extremes across New Jersey farmland using NASA EONET satellite data.",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/conditions/layout.tsx
git commit -m "feat(conditions): add layout with SEO metadata and JSON-LD"
```

---

### Task 6: Conditions Page

**Files:**
- Create: `src/app/conditions/page.tsx`

- [ ] **Step 1: Create the full page component**

```typescript
// src/app/conditions/page.tsx

"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { GridBackground } from "@/components/ui/grid-background";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/FadeIn";
import { BeamDivider } from "@/components/Beam";
import { EventCard } from "@/components/EventCard";
import { CATEGORY_CONFIG, type ConditionEvent } from "@/lib/eonet";
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

  useEffect(() => {
    fetch("/api/conditions")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events ?? []);
        setLastChecked(data.lastChecked ?? null);
      })
      .catch(() => {
        setEvents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeCount = events.length;

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
              Real-time NASA satellite monitoring across South Jersey&apos;s
              agricultural corridor. Track events that impact your farm and
              drone operations.
            </p>
          </FadeIn>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-6 text-[10px] font-mono text-accent-400/40"
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
            <span>SOURCE: NASA EONET</span>
            <span className="w-1 h-1 rounded-full bg-accent-400/30" />
            <span>
              EVENTS: {loading ? "..." : activeCount} ACTIVE
            </span>
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
                  <span>SOUTH JERSEY</span>
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
                Current Conditions
              </h2>
            </div>
          </FadeIn>

          {loading ? (
            <div className="flex justify-center py-12">
              <p className="text-sm text-white/40 font-mono animate-pulse">
                SCANNING NASA EONET...
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
                  No active weather events detected in the South Jersey region.
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

      {/* ─── CTA ─────────────────────────────────────── */}
      <section className="relative bg-primary-950 py-16 md:py-24 overflow-hidden">
        <GridBackground />
        <div className="relative container-narrow mx-auto px-5 text-center">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Engage
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Conditions Affecting Your Farm?
            </h2>
            <p className="mt-3 text-white/50 max-w-md mx-auto">
              Whether it&apos;s storm damage assessment, drought monitoring, or
              post-flood field surveys — we&apos;re ready to fly.
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/conditions/page.tsx
git commit -m "feat(conditions): add full conditions page with hero, map, event feed, and CTA"
```

---

### Task 7: Add Navigation Link

**Files:**
- Modify: `src/components/Header.tsx:8-15` (navItems array)

- [ ] **Step 1: Add "Conditions" to the navItems array**

In `src/components/Header.tsx`, add the Conditions link to the `navItems` array. Insert it after "Coverage Area":

```typescript
const navItems = [
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/equipment", label: "Equipment" },
  { href: "/coverage", label: "Coverage Area" },
  { href: "/conditions", label: "Conditions" },
  { href: "/roi-calculator", label: "ROI Calculator" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat(nav): add Conditions link to site header"
```

---

### Task 8: Visual QA & Polish

- [ ] **Step 1: Start the dev server and navigate to /conditions**

Run: `npm run dev`

Open: `http://localhost:3000/conditions`

Verify:
- Hero renders with "NJ Operations Radar" headline and HUD status indicators
- 3D terrain map loads with Mapbox satellite imagery, pitched camera angle
- If events exist: animated colored markers pulse on the map, severity columns extrude, event cards show below with CTAs
- If no events: "All Clear" state shows with last-checked timestamp
- Legend shows all 5 event categories with correct colors
- Navigation header includes "Conditions" link
- Page matches existing HUD aesthetic (dark bg, green accents, mono labels)
- Mobile responsive: map resizes, cards stack single column

- [ ] **Step 2: Fix any visual issues found during QA**

Common fixes:
- Map container height on mobile
- Card spacing and text overflow
- HUD label alignment
- Map popup styling on dark theme

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "fix(conditions): visual polish and responsive tweaks"
```
