import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crop Health Monitor — Early Stress Detection for NJ Farms",
  description:
    "Understand crop stress before it's visible. Interactive tools for water stress, nutrient deficiency, temperature stress, disease pressure, and pest damage detection. Drone monitoring schedules for blueberries, peaches, tomatoes, soybeans, and corn.",
  alternates: { canonical: "https://agdronesnj.com/resources/crop-health" },
  openGraph: {
    title: "Crop Health Monitoring & Stress Detection | AG Drones NJ",
    description:
      "Detect crop stress 5-7 days before visible symptoms. Interactive health score calculator and drone monitoring schedules for NJ crops.",
    url: "https://agdronesnj.com/resources/crop-health",
  },
  keywords: [
    "crop health monitoring",
    "crop stress detection",
    "NDVI crop health",
    "drone crop monitoring",
    "nutrient deficiency detection",
    "water stress crops",
    "precision agriculture monitoring",
    "crop health score",
    "NJ crop monitoring schedule",
    "early disease detection farming",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
