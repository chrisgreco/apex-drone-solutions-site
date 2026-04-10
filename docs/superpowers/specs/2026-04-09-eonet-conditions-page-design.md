# NJ Operations Radar — NASA EONET Conditions Page

**Date:** 2026-04-09
**Status:** Approved
**Page:** `/conditions` (public marketing page)

## Overview

A public-facing "/conditions" page for AG Drones NJ that displays live NASA Earth Observatory (EONET) events on a 3D terrain map of New Jersey. The page serves two purposes: showing farmers real-time conditions that affect their operations, and connecting each event to an actionable AG Drones NJ service CTA.

## Page Sections

### 1. Hero
- Headline: "NJ Operations Radar"
- Subtitle: real-time NASA satellite monitoring description
- HUD-style status indicators: RADAR::ONLINE, SOURCE: NASA EONET, EVENTS: N ACTIVE
- Matches existing site aesthetic (dark bg, accent-400 green, monospace HUD labels, `// SECTION_LABEL` pattern)

### 2. 3D Terrain Map (centerpiece)
- Mapbox GL JS with 3D terrain exaggeration focused on South Jersey
- Live EONET event markers: color-coded, animated pulse/glow
- Severity columns: Mapbox `fill-extrusion` layer — height proportional to event severity
- HUD corner borders framing the map
- Legend overlay showing event type colors
- Interactive: hover for event details, scroll to zoom

### 3. Event Feed
- Cards below the map, one per active event
- Each card shows:
  - Event type indicator (colored dot)
  - Title with location (e.g., "Severe Thunderstorm — Burlington Co.")
  - Detection time and source attribution ("Detected 2hrs ago via NASA EONET")
  - Impact description specific to local agriculture
  - Contextual CTA button linking to `/contact`
- "All Clear" state when no events are active, showing last-checked timestamp

### 4. CTA Section
- "Conditions affecting your farm?" messaging
- Links to `/contact` page
- Matches existing CTA section styling from other pages

## Event Categories

Five EONET categories, each with unique color and CTA:

| Category | Color | Marker | CTA Text |
|----------|-------|--------|----------|
| Severe Storms | `#3b82f6` (blue) | Blue pulse | "Schedule Post-Storm Assessment" |
| Floods | `#38bdf8` (sky blue) | Cyan pulse | "Request Drainage & Field Survey" |
| Wildfires | `#ef4444` (red) | Red pulse | "Request Smoke Impact Survey" |
| Drought | `#fbbf24` (amber) | Amber pulse | "Book Crop Stress Survey" |
| Temp Extremes | `#a855f7` (purple) | Purple pulse | "Schedule Frost/Heat Damage Assessment" |

## Data Pipeline

```
NASA EONET API (v3) → Next.js API Route (/api/conditions) → 15-min cache → Client Component
```

### API Route: `/api/conditions`
- Fetches from `https://eonet.gsfc.nasa.gov/api/v3/events`
- Query params:
  - `status=open` (active events only)
  - `bbox=-75.6,38.9,-73.9,41.4` (NJ bounding box with buffer)
  - `category=severeStorms,floods,wildfires,drought,tempExtremes`
- Response cached with `revalidate: 900` (15 minutes)
- Returns normalized event objects with: id, title, category, coordinates, magnitude, date, description

### Fallback behavior
- EONET returns no events → "All Clear" state with green checkmark and last-checked time
- EONET API unreachable → Show cached data if available, otherwise "Conditions data temporarily unavailable"

## Technical Approach

### Map
- Mapbox GL JS with `mapbox://styles/mapbox/satellite-streets-v12`
- 3D terrain via `mapbox-dem` raster-dem source with exaggeration
- Camera: pitched ~60°, centered on South Jersey (~39.5°N, 74.8°W)
- Custom HTML markers with CSS keyframe animations (pulse, glow)
- Severity columns via `fill-extrusion` paint properties (native Mapbox 3D)
- Dynamic import with `ssr: false` (Mapbox requires browser APIs)

### Styling
- Matches existing HUD aesthetic throughout the site
- Dark backgrounds (`primary-950`, `primary-900`)
- Green accent (`accent-400`, `accent-500`)
- Monospace HUD labels with `// SECTION_LABEL` pattern
- HUD corner borders on map and cards
- Framer Motion for fade-in animations

### SEO
- Server-rendered hero text and event descriptions
- Layout with metadata (title, description, OpenGraph)
- JSON-LD structured data for the page

## Files to Create

| File | Purpose |
|------|---------|
| `src/app/conditions/page.tsx` | Page component — hero, map, event feed, CTA |
| `src/app/conditions/layout.tsx` | Metadata, SEO, JSON-LD |
| `src/app/api/conditions/route.ts` | EONET API proxy with 15-min cache |
| `src/components/ConditionsMap.tsx` | Mapbox 3D terrain map with event markers |
| `src/components/EventCard.tsx` | Individual event card with type color + CTA |
| `src/lib/eonet.ts` | EONET TypeScript types and fetch utilities |

## Dependencies

All already installed — no new packages needed:
- `mapbox-gl` — interactive map
- `framer-motion` — animations
- `date-fns` — relative time formatting
- Existing UI components: `FadeIn`, `BeamDivider`, `GridBackground`, Icons

## Navigation

Add "Conditions" link to the site header navigation, between existing items.
