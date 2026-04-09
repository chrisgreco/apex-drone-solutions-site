# AG Drones NJ — Brand Guide

## Brand Voice

- **Tone:** Tech-forward, precise, confident. Innovation meets agriculture.
- **Audience:** New Jersey farmers, farm managers, agricultural cooperatives, crop consultants, and tech-minded operators.
- **Rules:**
  - Lead with technology and data: 3D mapping, NDVI analytics, GPS precision.
  - Back it up with farmer outcomes: cost savings, yield protection, time savings.
  - Emphasize precision, intelligence, certifications, and environmental benefits.
  - Use concrete numbers: "30% less chemical use", "2cm resolution", "99.2% NDVI accuracy."
  - Never oversell. Farmers respect honesty and data.
  - Always mention FAA Part 137 certification — it's our competitive moat.
  - Use monospace font for data labels and technical readouts.

## Logo

The AG Drones NJ mark features a **hexagonal drone** with propeller arms, a central sensor eye, and scan lines beneath — communicating aerial intelligence, precision technology, and agricultural scanning.

- **Full-color mark:** Deep Forest (`#0F2419`) hexagon + Vibrant Green (`#4CAF50`) elements + Bright Green (`#4ade80`) scan lines.
- **Monochrome:** Single-color version available in forest or white.
- **Wordmark:** "AG Drones" in bold white + "NJ" in vibrant green monospace small-caps below.

Files:
- `src/components/Logo.tsx` — React components (LogoFull, LogoMark, LogoMonochrome)
- `public/favicon.svg` — Favicon

## Color Palette

### Primary — Deep Forest
Used for backgrounds, dark UI surfaces, and text on light.

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-50` | `#F0F4EC` | Light backgrounds |
| `primary-100` | `#D0D8C8` | Subtle borders |
| `primary-800` | `#0F2419` | Dark surfaces |
| `primary-900` | `#0B1A12` | Main dark bg |
| `primary-950` | `#07110C` | Deepest backgrounds |

### Accent — Vibrant Green
Used for highlights, interactive elements, data visualizations, and tech accents.

| Token | Hex | Usage |
|-------|-----|-------|
| `accent-400` | `#66BB6A` | Primary highlights, buttons |
| `accent-500` | `#4CAF50` | Button backgrounds |
| `accent-600` | `#43A047` | Button hover |

### Green — Agricultural Bright
Used for agricultural elements, health indicators, scan lines, and success states.

| Token | Hex | Usage |
|-------|-----|-------|
| `green-400` | `#4ade80` | Health indicators, scan lines |
| `green-500` | `#22c55e` | Badges, active states |
| `green-600` | `#16a34a` | Section labels |

### Neutral — Warm Sage Grays
Used for body text, borders, and backgrounds.

| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-50` | `#F0F4EC` | Section backgrounds |
| `neutral-500` | `#6B7A62` | Body text |
| `neutral-800` | `#2A3026` | Default text color |

## Typography

- **Font family:** Montserrat (with Inter fallback)
- **Headings:** Montserrat Bold (700), letter-spacing -0.02em
- **Body:** Montserrat Regular (400), 15px base
- **Data/Technical:** Monospace font for HUD labels, stats, and technical readouts
- **Buttons:** Montserrat SemiBold (600), 15px

## Key Design Patterns

- **Dark-first:** Site defaults to dark backgrounds (primary-950, primary-900)
- **Tech grid:** Subtle green grid lines on dark sections
- **HUD corners:** Corner bracket accents on visualization containers
- **Section labels:** `text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 font-mono` prefixed with `//`
- **Cards:** Dark glass with `border border-accent-500/10` and subtle glow
- **Animations:** Scanning lines, pulsing dots, terrain visualizations
- **Data points:** Monospace numbers with green accent suffixes
- **Trust badges:** Pill shape with green dot indicator on dark bg

## Pages

| Page | Path | Purpose |
|------|------|---------|
| Home | `/` | Hero, 3D terrain scan, services, benefits, crops, testimonials, CTA |
| Services | `/services` | Detailed service descriptions |
| How It Works | `/how-it-works` | Full workflow + FAQ |
| Equipment | `/equipment` | Fleet specs (DJI T25) |
| Coverage | `/coverage` | South Jersey service area map |
| ROI Calculator | `/roi-calculator` | Interactive savings calculator |
| Results | `/results` | Case studies & testimonials |
| About | `/about` | Company story & certifications |
| Careers | `/careers` | Pilot recruitment (veteran-focused) |
| Contact | `/contact` | Quote request form |
| Privacy | `/privacy` | Privacy policy |
| Terms | `/terms` | Terms of service |
