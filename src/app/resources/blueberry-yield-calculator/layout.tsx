import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blueberry Yield Calculator — Estimate Your NJ Harvest",
  description:
    "Free blueberry yield estimator for New Jersey growers. Input acreage, pollinator density, rainfall, temperature, and fruit factors to predict harvest size and revenue. NJ is #2 in US blueberry production.",
  alternates: { canonical: "https://agdronesnj.com/resources/blueberry-yield-calculator" },
  openGraph: {
    title: "NJ Blueberry Yield Calculator | AG Drones NJ",
    description:
      "Estimate your blueberry harvest based on environmental factors. Calculate yield per acre, total harvest, and revenue at fresh and processed market prices.",
    url: "https://agdronesnj.com/resources/blueberry-yield-calculator",
  },
  keywords: [
    "blueberry yield calculator",
    "NJ blueberry harvest",
    "blueberry yield prediction",
    "New Jersey blueberry farming",
    "blueberry revenue estimate",
    "wild blueberry yield",
    "blueberry pollination",
    "blueberry growing conditions",
    "drone spraying blueberries",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
