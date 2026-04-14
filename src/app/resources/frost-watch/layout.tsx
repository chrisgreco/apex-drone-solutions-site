import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NJ Frost Watch — Bloom-Stage Frost Alerts for Peach, Blueberry, Apple",
  description:
    "Free 7-day frost forecast with crop-stage-specific damage and kill temperatures. Know when your peach bloom, blueberry flowers, or apple pink-bud are at risk before the cold front arrives.",
  alternates: { canonical: "https://agdronesnj.com/resources/frost-watch" },
  openGraph: {
    title: "NJ Frost Watch — Stage-Specific Kill Temp Forecast",
    description:
      "7-day frost forecast for NJ orchards and berry farms. Damage and kill thresholds per crop stage.",
    url: "https://agdronesnj.com/resources/frost-watch",
  },
  keywords: [
    "NJ frost alert",
    "peach frost damage",
    "blueberry frost",
    "apple frost kill",
    "bloom frost NJ",
    "critical temperature fruit",
    "frost forecast New Jersey",
    "wind machine trigger temp",
    "orchard frost protection",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
