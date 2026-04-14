import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "NJ Grower Dashboard — Free Farm Intelligence for New Jersey Farmers",
  description:
    "Free one-stop-shop dashboard for NJ farmers. Real-time spray windows, frost alerts, disease pressure, chill hours, pest activity, and harvest forecasts — tuned for your exact crop and location. Powered by NOAA + Open-Meteo + Rutgers data.",
  alternates: { canonical: "https://agdronesnj.com/resources/nj-crop-dashboard" },
  openGraph: {
    title: "NJ Grower Dashboard — All Your Farm Intel in One Place",
    description:
      "Free live dashboard for NJ growers. Spray windows, frost warnings, disease pressure, chill hours, and harvest dates — tuned for your crop.",
    url: "https://agdronesnj.com/resources/nj-crop-dashboard",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NJ Grower Dashboard — Free Farm Intelligence Hub",
    description:
      "One screen for spray windows, frost, disease, chill hours, and harvest ETA. Free for NJ farmers.",
  },
  keywords: [
    "NJ grower dashboard",
    "NJ crop dashboard",
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
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does the NJ Grower Dashboard do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It's a free one-stop-shop dashboard for NJ farmers. Live spray windows, tonight's frost risk against your crop's stage-specific kill temp, disease pressure for mummy berry / brown rot / fire blight / late blight, chill hours accumulated, pest activity trackers, 7-day rainfall, and harvest ETA — all tuned for your exact crop and location.",
      },
    },
    {
      "@type": "Question",
      name: "Is the NJ Grower Dashboard free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, free forever for NJ farmers. We only ask for an email so we can send you alerts when conditions change — for example, a good spray window opens tomorrow morning, or tonight's forecast threatens your peaches at full bloom. Unsubscribe in one click.",
      },
    },
    {
      "@type": "Question",
      name: "Which crops are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "v1 supports blueberry, peach, apple, cranberry, tomato, and bell pepper — the signature crops of New Jersey agriculture. Each is tuned with variety-specific chill requirements, stage-specific frost kill thresholds, and the right disease and pest models. Sweet corn, soybean, strawberry, and more coming soon.",
      },
    },
    {
      "@type": "Question",
      name: "What data sources power the dashboard?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NOAA National Weather Service (authoritative short forecast and storm watches), Open-Meteo (hourly wind at 10m and 80m, temperatures at 2m and 80m for temperature inversion detection, 7-day precipitation forecast and past 24-hour rainfall), and USDA NASS for New Jersey crop statistics. We're adding Rutgers NJ Weather Network station data for leaf wetness and soil temperatures soon.",
      },
    },
    {
      "@type": "Question",
      name: "What is a temperature inversion and why does the dashboard care?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A temperature inversion occurs when air aloft is warmer than air at the surface — the opposite of normal. Inversions trap spray droplets in a thin stable layer and carry them long distances onto neighboring crops, waterways, and homes. They're most common at dawn and dusk. If 80-meter temperature exceeds 2-meter surface temperature by more than 0.5°F, we flag it as a reason not to spray.",
      },
    },
    {
      "@type": "Question",
      name: "Can you spray my field with a drone if the window opens?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. AG Drones NJ is an FAA Part 137 agricultural operator serving South Jersey farms (Atlantic, Burlington, Camden, Cape May, Cumberland, Gloucester, Ocean, and Salem counties). When our dashboard tells you a spray window is open and you don't have a sprayer — or conditions are too tight for tractor coverage — contact us to book a drone.",
      },
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="nj-crop-dashboard-faq-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
