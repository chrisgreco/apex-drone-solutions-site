import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Should I Spray Today? — NJ Drone Spray Forecast with Inversion Alerts",
  description:
    "Free for NJ farmers. Hour-by-hour 7-day spray window forecast powered by NOAA + Open-Meteo. Checks wind, gusts, rain, temperature, and temperature inversions — the #1 cause of off-target drift.",
  alternates: { canonical: "https://agdronesnj.com/resources/spray-today" },
  openGraph: {
    title: "Should I Spray Today? NJ Drone Spray Forecast",
    description:
      "Hour-by-hour 7-day spray window forecast for NJ farmers. Inversion alerts, rain washoff timer, FAA Part 137 limits. Free email alerts.",
    url: "https://agdronesnj.com/resources/spray-today",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Should I Spray Today? — NJ Drone Spray Forecast",
    description:
      "7-day hourly spray windows, temperature inversion alerts, rain washoff timer. Free for NJ farmers.",
  },
  keywords: [
    "drone spray weather NJ",
    "should I spray today",
    "spray window forecast",
    "temperature inversion forecast",
    "FAA Part 137 wind limits",
    "agricultural spray conditions New Jersey",
    "NOAA spray forecast",
    "spray drift prevention",
    "rainfast timer",
    "when can I spray",
    "NJ crop spraying weather",
    "pesticide drift inversion",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What wind speed is safe for drone spraying in New Jersey?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Under FAA Part 137 and pesticide label guidance, sustained wind should be 10 mph or less at surface (10m), with gusts under 15 mph. Between 10–15 mph sustained is marginal — proceed with caution and watch for drift. Over 15 mph sustained or 20 mph gusts, ground all flights.",
      },
    },
    {
      "@type": "Question",
      name: "What is a temperature inversion and why does it matter for spraying?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A temperature inversion occurs when air aloft is warmer than air at the surface — the opposite of normal. Inversions trap spray droplets in a thin, stable layer that can drift long distances onto neighboring crops, waterways, or homes. They're most common at dawn, dusk, and on clear calm nights. If the 80m temperature is more than 0.5°F warmer than the 2m temperature, don't spray.",
      },
    },
    {
      "@type": "Question",
      name: "How long after rain can I spray?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depends entirely on the product. Many herbicides require 6–24 hours rainfast; contact fungicides often need 2–4 hours dry. Always check the product label's rainfast requirement. Our rain washoff timer shows hours since last rain and hours until the next forecast rain.",
      },
    },
    {
      "@type": "Question",
      name: "Is this spray forecast free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Free for every NJ farmer, no account required. Optional email alerts for when a spray window opens for your farm are also free.",
      },
    },
    {
      "@type": "Question",
      name: "What data powers this tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We combine NOAA's National Weather Service point forecast (authoritative short forecast text and precipitation probability) with Open-Meteo's hourly model data (wind speeds at 10m and 80m, temperatures at 2m and 80m for inversion detection, past 24 hours of precipitation). Data refreshes every 10 minutes.",
      },
    },
    {
      "@type": "Question",
      name: "Do you fly drone sprays for hire in New Jersey?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — AG Drones NJ is an FAA Part 137 operator serving South Jersey farms. If the window is open but you don't have a sprayer, contact us to book a job.",
      },
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="spray-today-faq-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
