# NJ Crop Dashboard Hub — Unified Grower Dashboard

## Goal
Transform `/resources/nj-crop-dashboard` into a one-stop-shop hub where NJ farmers
give an email and get all their farm intelligence in one spot. Existing spray-today
tool becomes one tile of many.

## Decisions locked
- **Route**: `/resources/nj-crop-dashboard` (existing slug, strong SEO for "NJ crop dashboard")
- **Crops v1**: blueberry, peach, apple, cranberry, tomato, pepper
- **Email gate**: demo-first soft gate (Hammonton blueberries as default demo)
- **Stage + acreage**: optional fields on farm profile form
- **Multi-crop per farm**: one primary crop in v1
- **DB**: migrate `spray_alert_subscribers` → `farm_profiles` with crop/stage/prefs cols

## Phase 1 — Hub shell + email gate + existing tools wired in

### Foundation
- [ ] `src/lib/farm-intel/crops.ts` — 6 crop constants (frost thresholds, chill requirements, bloom→harvest GDD, stages, disease models, pest list)
- [ ] `src/lib/farm-intel/banner.ts` — compute 0–3 urgent action cards from forecast + farm profile
- [ ] `src/lib/nj-ag-stats.ts` — extract USDA data arrays (CROPS/COUNTIES/RANKINGS/HEADLINE_STATS) from the old page so they can be reused in the "About NJ Ag" bottom section

### Database
- [ ] Migration `20260414_farm_profiles.sql`:
  - Rename `spray_alert_subscribers` → `farm_profiles`
  - Add `crop_primary text`, `crop_variety text`, `crop_stage text`, `acres numeric`
  - Add `alert_prefs jsonb default '{"spray_window":true,"frost":true,"disease":true,"chill":true}'`
  - Keep all existing cols (email, tokens, lat/lon, etc.) so existing subscribers keep working
- [ ] Apply via Supabase MCP

### API routes
- [ ] `POST /api/farm-profile` — create/upsert profile, email + ZIP + crop + optional stage/acres
- [ ] `GET /api/farm-profile?token=…` — fetch by unsubscribe/profile token (for deep-link)
- [ ] `PATCH /api/farm-profile` — update alert prefs, stage, etc.
- [ ] Reuse existing `confirm` and `unsubscribe` endpoints

### UI components
- [ ] `src/components/dashboard/FarmPicker.tsx` — inline email gate form (email + ZIP + crop dropdown + optional stage + optional acres)
- [ ] `src/components/dashboard/ActionBanner.tsx` — renders 0–3 urgent cards with icon + headline + CTA
- [ ] `src/components/dashboard/Tile.tsx` — primitive: icon, label, big-number, trend/context, tap-to-drill href
- [ ] `src/components/dashboard/TileGrid.tsx` — 3-column Today / This Week / This Season layout, stacks on mobile

### Page rewrite
- [ ] `src/app/resources/nj-crop-dashboard/page.tsx` — hub shell:
  1. Hero: farm chip ("Demo: Hammonton Blueberries" → "Unlock YOUR farm")
  2. ActionBanner (0–3 urgent cards)
  3. TileGrid (3×3, + drawer)
  4. "About NJ Agriculture" — existing USDA section moved here
- [ ] `src/app/resources/nj-crop-dashboard/layout.tsx` — updated metadata + FAQPage JSON-LD

### Tiles in v1 (all link to existing deep pages except 🟡 live tiles which show data but link to their deep pages)
- [ ] **Today · Spray window** → `/resources/spray-today` (live number from forecast)
- [ ] **Today · Frost watch** → shows tonight's low vs kill threshold (live, bloom-stage-aware stub; full page in phase 4)
- [ ] **Today · Rain washoff** → live hrs-since / hrs-until rain (from spray-forecast)
- [ ] **This Week · Disease risk** → `/resources/crop-disease-guide` (live pressure stub; full model in phase 2)
- [ ] **This Week · Pest activity** → `/resources/pest-identifier`
- [ ] **This Week · 7d rainfall** → live inches total
- [ ] **This Season · GDD** → `/resources/growing-degree-days` (live number)
- [ ] **This Season · Chill hours** → shows Oct 1–now chill count (live stub; full page in phase 3)
- [ ] **This Season · Harvest ETA** → links to GDD page (full page in phase 5)

### Drawer (secondary tools)
- [ ] **Crop health** → `/resources/crop-health`
- [ ] **Yield calculator** → `/resources/blueberry-yield-calculator` (only when crop = blueberry)
- [ ] **Plan my farm** → `/resources/crop-recommender`
- [ ] **See what drones see** → `/resources/drone-imagery`

### Homepage + nav
- [ ] Update homepage "Free tool" link from `/resources/spray-today` → `/resources/nj-crop-dashboard`
- [ ] Sitemap: bump nj-crop-dashboard priority to 1.0, changefreq hourly

## Phase 2 — Disease pressure (next turn)
Live Mills/Milholland/Johnson models using Open-Meteo RH+temp for leaf wetness. Biggest funnel lever.

## Phase 3 — Chill hours tracker (timely for winter)
Utah + Dynamic models, variety-specific targets, bloom date prediction.

## Phase 4 — Bloom-stage frost alerts with email list
Crop-stage kill thresholds, dew-point corrected forecast, email alerts.

## Phase 5 — Harvest ETA + pollination window + soil temp (Rutgers NJWX integration)

## Phase 6 — Polish, SEO, preference UI
