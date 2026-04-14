# Spray-Today: Upgrade to "The Killer NJ Spray Decision Tool"

## Goal
Turn `/spray-today` into a standalone marketing asset NJ farmers bookmark and return to daily — so when the drone business launches, we already have traffic, an email list, and SEO.

## Current state (what's already built)
- 997-line client-side page at `src/app/resources/spray-today/page.tsx`
- 8 NJ counties + browser geolocation
- Fetches NOAA `api.weather.gov` client-side (no caching)
- Spray decision engine: wind, gusts, precip, temperature, lightning → GO / CAUTION / NO-GO
- Shows current verdict + "next GO window in 24h"

## Critical gaps for the marketing hook
- No address/ZIP input (must pick from 8 counties)
- No temperature inversion forecast (top differentiator — no free NJ tool surfaces this)
- No visual 7-day timeline (single-hour verdict is forgettable)
- No rain washoff timer (farmers ask this constantly)
- No email alerts / saved farms (list-building is the whole point pre-launch)
- Client-side NOAA fetch is slow and wasteful (no cache, every visitor hits NOAA cold)

---

## Phase 1 — Server-side forecast API with caching (foundation)
- [ ] Create `src/app/api/spray-forecast/route.ts`
  - Input: `?lat=X&lon=Y`
  - Fetches NWS (authority) + Open-Meteo (7-day hourly, 80m wind, 80m temp for inversion, past precip) in parallel
  - Normalizes to unified `SprayForecast` type with pre-computed per-hour verdicts
  - `revalidate = 600` (10 min)
- [ ] Move decision engine from page into `src/lib/spray-decision.ts` (pure functions, reusable server + client)
- [ ] Replace client-side NOAA fetch in page with `/api/spray-forecast` call

## Phase 2 — Address / ZIP input
- [ ] Add ZIP / address search box above the county picker (keep county picker as fallback)
- [ ] Geocode via Census Bureau Geocoder (free, no key, US-only — perfect for our audience)
- [ ] Persist last location in `localStorage`
- [ ] Reverse-geocode when using "my location" so label shows "Hammonton, NJ" not "My current location"

## Phase 3 — Temperature inversion forecast (THE differentiator)
- [ ] Pull `temperature_2m` and `temperature_80m` from Open-Meteo hourly
- [ ] Inversion detected when `T_80m - T_2m > 0.5°F` (warmer aloft = trapped spray drift)
- [ ] Add as first-class condition in the decision engine (inversion = CAUTION, strong inversion + low wind = NO-GO)
- [ ] Explainer tooltip: "Inversions trap spray droplets and cause off-target drift — common at dawn/dusk in NJ"

## Phase 4 — 7-day hourly timeline (THE visual)
- [ ] Build `<SprayTimeline>` component: horizontal strip per day, colored cells per hour (green/yellow/red)
- [ ] Highlight contiguous GO windows of 2+ hours with a label ("Wed 6–9 AM: 3h window")
- [ ] Click a cell → expand with all conditions for that hour
- [ ] Mobile: stack vertically, swipeable days

## Phase 5 — Wind at drone altitude
- [ ] Show wind at surface (10m) AND at 80m from Open-Meteo
- [ ] Annotate "Drones typically operate at 3–30m — expect wind between these two values"
- [ ] Keep Part 137 decision rules based on 10m (regulatory reference)

## Phase 6 — Rain washoff timer
- [ ] Pull past 24h precip from Open-Meteo `past_days=1`
- [ ] Display: "Last rain: 18h ago (0.4 in) · Next rain: in 26h" above the verdict
- [ ] Flag if last rain < 6h ago (fungicide/herbicide rainfast window)

## Phase 7 — Save-your-farm email alerts (the marketing asset)
- [ ] Simple form: email + farm name + location → Supabase table `spray_alert_subscribers`
- [ ] Double opt-in email confirmation
- [ ] Daily Vercel Cron at 5 AM ET: for each subscriber, check next-24h forecast; if GO window ≥ 2h, send email
- [ ] Email via Resend (cheap, Next.js-friendly) — plain text + CTA to `/spray-today`
- [ ] Unsubscribe link (signed token, no login needed)
- [ ] **This becomes our pre-launch email list**

## Phase 8 — SEO polish
- [ ] Update page metadata with new features (inversion forecast, 7-day window, ZIP search)
- [ ] Add FAQ schema: "What wind speed is safe for drone spraying?", "What is a temperature inversion?", etc.
- [ ] Ensure `/spray-today` is in `sitemap.ts` with high priority
- [ ] Internal link from homepage hero

---

## Check-in questions before I start
1. **Email provider**: OK to use Resend? (~$20/mo after free tier of 3k emails/mo — plenty pre-launch). Alternative is SES but more setup.
2. **Scope for v1**: Ship Phases 1–6 first as "the tool", then Phase 7 (email alerts) as a follow-up? Or bundle it all? Phase 7 is the biggest lift.
3. **Supabase**: I see `supabase/.temp/` in gitStatus — is Supabase already wired up, or fresh setup needed?
4. **Resend/email copy**: Want me to write the daily alert email copy, or keep it plain and factual for v1?

---

## Review (2026-04-13)

### Shipped
- **Phase 1** ✅ Server API `src/app/api/spray-forecast/route.ts` + pure engine `src/lib/spray-decision.ts`. NWS + Open-Meteo merged, 10-min cache, 168-hour forecast.
- **Phase 2** ✅ `src/components/spray/AddressSearch.tsx` — Census geocoder + ZIP (Zippopotam.us) + "use my location"; last location persisted in localStorage.
- **Phase 3** ✅ Temperature inversion (T_80m − T_2m) in the decision engine + dedicated UI card.
- **Phase 4** ✅ `src/components/spray/SprayTimeline.tsx` — 7-day hourly grid, green/yellow/red cells, click-to-expand hour details.
- **Phase 5** ✅ Wind at 10m / 80m / gusts panel with drone-altitude explainer.
- **Phase 6** ✅ Rain washoff card: hours-since-last-rain + hours-until-next-rain + rainfast warning < 6h.
- **Phase 7** ✅ Subscribe / confirm / unsubscribe flow. Supabase `spray_alert_subscribers` + `spray_alert_sends` tables w/ RLS. Resend transactional emails. Vercel Cron at 09:00 UTC daily → `/api/cron/spray-alerts`. One-click unsubscribe with List-Unsubscribe header.
- **Phase 8** ✅ Metadata rewritten, FAQ JSON-LD schema, `spray-today` sitemap priority bumped to 0.95 + hourly changefreq, homepage hero link added.

### Infrastructure
- New Supabase project `ag-drones-nj` (ID `xhqlkergymgnptkktrrr`, us-east-1). Old `apex-drone-solutions` project was already paused.
- Resend SDK installed. `RESEND_API_KEY` in `.env.local`.

### Verified
- `npx tsc --noEmit` → clean (EXIT=0).
- `GET /api/spray-forecast?lat=39.8756&lon=-74.6724` → 200 with full 168h hourly data, NWS shortForecast joined, inversion math correct (morning Δ ≈ +3.8°F matches expected dawn inversion).
- `GET /resources/spray-today` → 200, renders hero + timeline + subscribe form server-side.
- `POST /api/spray-alerts/subscribe` with invalid payload → 400 with error message.

### Still required before production
1. **Paste `SUPABASE_SERVICE_ROLE_KEY`** from the dashboard into `.env.local` — cron + confirm/unsubscribe endpoints need it. [Get it here](https://supabase.com/dashboard/project/xhqlkergymgnptkktrrr/settings/api-keys).
2. **Verify `agdronesnj.com` (or pick a subdomain) in Resend** — or alerts won't actually send. [Resend domains](https://resend.com/domains).
3. **Set `CRON_SECRET` in Vercel env** (and `.env.local` for local testing). Any random string; the cron route requires it in the Authorization header.
4. **Set `NEXT_PUBLIC_SITE_URL=https://agdronesnj.com`** in Vercel env so email links point at prod, not localhost.
5. **Rotate the Resend API key** — it was pasted in chat so it's in logs.

### Deferred / future polish
- Email copy can be fancied up (HTML, branding) later. Plain text ships per spec.
- Could add admin dashboard to view subscriber list.
- Could add weekly digest (Beehiiv play) once list > 100.
