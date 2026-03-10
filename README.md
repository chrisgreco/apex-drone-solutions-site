# Apex Drone Solutions — Marketing Site

Public marketing website for **Apex Drone Solutions**, a tech-enabled drone documentation platform for insurance, roofing, and property damage documentation.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Deployment:** Vercel
- **Font:** Inter (system font stack)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The development server runs at `http://localhost:3000`.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (Header + Footer)
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles + Tailwind theme
│   ├── insurance-claims/   # Insurance & Claims page
│   ├── roofing-restoration/# Roofing & Restoration page
│   ├── how-it-works/       # How It Works page
│   ├── become-a-pilot/     # Pilot application page
│   ├── about/              # About / Why Apex page
│   ├── contact/            # Contact page
│   ├── privacy/            # Privacy Policy
│   └── terms/              # Terms of Service
├── components/             # Shared React components
│   ├── Logo.tsx            # Logo mark + wordmark (SVG)
│   ├── Icons.tsx           # Line icon set
│   ├── Header.tsx          # Site header with responsive nav
│   ├── Footer.tsx          # Site footer
│   ├── SectionHeading.tsx  # Section title component
│   └── Card.tsx            # Card, StatCard, StepCard
└── lib/                    # Utilities (empty, for future use)

public/
└── favicon.svg             # SVG favicon
```

## Branding

See [BRAND_GUIDE.md](./BRAND_GUIDE.md) for:
- Color palette and tokens
- Typography specs
- Component styling conventions
- Guidelines for adding new pages

### Adjusting Colors

All color tokens are defined in `src/app/globals.css` under the `@theme` block. Update hex values there and they'll propagate throughout the site via Tailwind classes.

### Updating the Logo

The logo is a React SVG component in `src/components/Logo.tsx`. Edit the SVG paths directly. The favicon lives at `public/favicon.svg`.

## Deployment

This site is deployed to Vercel via GitHub integration. Pushes to `main` trigger automatic deployments.

No environment variables are required for the base marketing site.

## License

Proprietary — Apex Drone Solutions / Apex Aerial Systems.
