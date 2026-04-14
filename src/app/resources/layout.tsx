import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "NJ Grower Resources — Free Farm Dashboard, Spray & Disease Forecasts",
  description:
    "Free one-stop-shop for NJ farmers. Live spray windows, frost alerts, disease pressure, chill hours, harvest ETA, plus reference guides for crop diseases, pests, yield calculators, and drone imagery. Daily email updates — only when they matter.",
  alternates: { canonical: "https://agdronesnj.com/resources" },
  openGraph: {
    title: "NJ Grower Resources | AG Drones NJ",
    description:
      "Free live dashboard for NJ growers. Spray windows, frost, disease pressure, chill hours, harvest dates, plus reference guides for every tool in one place.",
    url: "https://agdronesnj.com/resources",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NJ Grower Resources — Free Farm Intelligence Hub",
    description:
      "Live dashboard + reference guides for NJ farmers. Spray windows, frost, disease, chill hours, harvest ETA.",
  },
  keywords: [
    "NJ grower dashboard",
    "NJ crop dashboard",
    "NJ farming tools",
    "New Jersey farm tools",
    "NJ farmer resources",
    "NJ agriculture data",
    "free farm forecast",
    "NJ blueberry weather",
    "NJ peach weather",
    "spray window NJ",
    "frost alert NJ farmers",
    "chill hours New Jersey",
    "mummy berry forecast",
    "brown rot forecast",
    "temperature inversion NJ",
    "USDA NASS NJ",
    "South Jersey farming tools",
    "crop disease guide",
    "pest identifier",
    "blueberry yield calculator",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does the NJ Grower Resources hub do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It's a free one-stop-shop for NJ farmers. Live spray windows, tonight's frost risk against your crop's stage-specific kill temp, disease pressure for mummy berry / brown rot / fire blight / late blight, chill hours accumulated, pest activity trackers, 7-day rainfall, harvest ETA, plus reference guides for crop diseases and pests and a yield calculator — all tuned for your exact crop and location.",
      },
    },
    {
      "@type": "Question",
      name: "Is everything really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every tool is free forever. Reference guides and calculators don't require an email. The email is optional — it unlocks personalized alerts when conditions actually change for your crop. Unsubscribe in one click.",
      },
    },
    {
      "@type": "Question",
      name: "Which crops are supported for personalized alerts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Blueberry, peach, apple, cranberry, tomato, and bell pepper — the signature crops of New Jersey. Each is tuned with variety-specific chill requirements, stage-specific frost kill thresholds, and the right disease and pest models. Sweet corn, soybean, strawberry and more coming soon.",
      },
    },
    {
      "@type": "Question",
      name: "What data sources power the dashboard?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NOAA National Weather Service (authoritative short forecast and storm watches), Open-Meteo (hourly wind at 10m and 80m, temperatures at 2m and 80m for temperature inversion detection, 7-day precipitation forecast, past 24-hour rainfall), and USDA NASS for New Jersey crop statistics. We're adding Rutgers NJ Weather Network station data for leaf wetness and soil temperatures next.",
      },
    },
    {
      "@type": "Question",
      name: "What is a temperature inversion and why does the dashboard care?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A temperature inversion is when air aloft is warmer than air at the surface — the opposite of normal. Inversions trap spray droplets in a thin stable layer and carry them long distances onto neighboring crops, waterways, and homes. They're most common at dawn and dusk. If 80-meter temperature exceeds 2-meter surface by more than 0.5°F, we flag it as a reason not to spray.",
      },
    },
    {
      "@type": "Question",
      name: "Can you spray my field with a drone?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. AG Drones NJ is an FAA Part 137 agricultural operator serving South Jersey farms (Atlantic, Burlington, Camden, Cape May, Cumberland, Gloucester, Ocean, and Salem counties). When the dashboard tells you a spray window is open and you don't have a sprayer — or conditions are too tight for tractor coverage — contact us to book a drone.",
      },
    },
    {
      "@type": "Question",
      name: "How often will you email me?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "At most once per day, and only when something actually changes: a frost night forecast, a disease infection event at HIGH or EXTREME risk, a spray window opening, or your chill requirement being met. Per-alert cooldowns prevent duplicate emails for the same event. You can tune which alert types you want via the manage-alerts link in every email.",
      },
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="resources-faq-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
