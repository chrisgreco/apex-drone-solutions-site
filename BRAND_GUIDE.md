# Apex Drone Solutions — Brand Guide

## Brand Voice

- **Tone:** Clear, calm, confident. Business-first, not hypey.
- **Audience:** Claims leaders, vendor managers, independent adjuster firm owners, roofing/restoration contractors, professional drone pilots.
- **Rules:**
  - Plain English, short sentences, strong verbs.
  - Emphasize reliability, safety, turnaround time, and workflow integration.
  - Talk outcomes: faster claims, fewer re-inspections, better documentation.
  - Avoid buzzwords and "AI magic" language. AI is infrastructure, not the product.
  - Never describe our services as formal "inspections." We provide **property condition documentation**.

## Logo

The Apex mark combines a **roofline / apex triangle** with a subtle **flight path arc** and a small diamond representing a drone in flight. It communicates upward motion, precision, and field operations.

- **Full-color mark:** Deep Navy (`#102A43`) roof + Safety Orange (`#E8792A`) flight path.
- **Monochrome:** Single-color version available in navy or white.
- **Wordmark:** "Apex Drone" in bold weight + "SOLUTIONS" in small-caps spaced tracking below.

Files:
- `src/components/Logo.tsx` — React components (LogoFull, LogoMark, LogoMonochrome)
- `public/favicon.svg` — Favicon

## Color Palette

### Primary — Deep Navy
Used for headings, dark backgrounds, and primary text.

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-50` | `#f0f4f8` | Light backgrounds |
| `primary-100` | `#d9e2ec` | Subtle borders |
| `primary-200` | `#bcccdc` | Secondary borders |
| `primary-300` | `#9fb3c8` | Muted text on dark bg |
| `primary-400` | `#829ab1` | Icons on dark bg |
| `primary-500` | `#627d98` | Secondary text |
| `primary-600` | `#486581` | — |
| `primary-700` | `#334e68` | — |
| `primary-800` | `#243b53` | Dark text |
| `primary-900` | `#102a43` | Headings, logo |
| `primary-950` | `#0a1929` | Hero backgrounds |

### Accent — Safety Orange
Used for CTAs, step numbers, highlights, and the brand mark flight path.

| Token | Hex | Usage |
|-------|-----|-------|
| `accent-500` | `#e8792a` | Primary buttons, highlights |
| `accent-600` | `#c45d1a` | Button hover |
| `accent-700` | `#9e4a15` | Dark accent |

### Neutral — Warm Grays
Used for body text, borders, and backgrounds.

| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-50` | `#f7f7f5` | Section backgrounds |
| `neutral-100` | `#ededea` | Card borders |
| `neutral-200` | `#dcdcd7` | Input borders |
| `neutral-500` | `#7c7c72` | Body text |
| `neutral-700` | `#454540` | Strong body text |
| `neutral-800` | `#2d2d29` | Default text color |

## Typography

- **Font family:** Inter (loaded via system font stack fallback)
- **Headings:** Inter Bold (700), letter-spacing -0.01em
- **Body:** Inter Regular (400), 15px base
- **Buttons:** Inter SemiBold (600), 15px

## Components

### Buttons
- **Primary (`.btn-primary`):** Accent-500 background, white text, 6px radius, semibold. Hover → accent-600.
- **Secondary (`.btn-secondary`):** Transparent, 2px primary-200 border, primary-800 text. Hover → primary-50 fill.

### Cards
- White background, 1px neutral-100 border, 8px radius, 28px padding
- Icon container: 44px square, primary-50 background, primary-700 icon color
- Title: 18px semibold primary-900
- Body: 14px neutral-500

### Form Inputs
- 1px neutral-200 border, 6px radius, 10px 16px padding
- Focus: 2px accent-500/30 ring + accent-500 border

### Section Spacing
- Desktop: 96px vertical padding
- Mobile: 80px vertical padding
- Max width container: 72rem (1152px)

## Adding New Pages

1. Create a new directory under `src/app/` with a `page.tsx` file.
2. Export a `metadata` object for SEO (title + description).
3. Use the `SectionHeading`, `Card`, and `StepCard` components for consistency.
4. Follow the hero → content → CTA section pattern used across existing pages.
5. Use `container-narrow` and `section` classes for layout.
6. Add the page to the nav items array in `src/components/Header.tsx`.
