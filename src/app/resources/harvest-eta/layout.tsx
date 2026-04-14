import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NJ Harvest ETA — Predicted Pick Dates for Blueberry, Peach, Apple, Tomato",
  description:
    "Free harvest-date forecaster for NJ fruit and vegetable crops. GDD-based bloom-to-harvest projection with variety-specific targets. Plan your labor, packing, and sales weeks ahead.",
  alternates: { canonical: "https://agdronesnj.com/resources/harvest-eta" },
  openGraph: {
    title: "NJ Harvest ETA — Predicted Pick Dates",
    description:
      "GDD-based harvest date prediction for NJ crops. Variety-specific, live, and free.",
    url: "https://agdronesnj.com/resources/harvest-eta",
  },
  keywords: [
    "NJ harvest date",
    "blueberry harvest prediction",
    "peach harvest date",
    "Bluecrop harvest",
    "Redhaven harvest",
    "GDD harvest NJ",
    "crop maturity prediction",
    "growing degree days harvest",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
