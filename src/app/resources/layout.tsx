import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Farming Resources — Crop Tools, Pest Guides & Yield Calculators",
  description:
    "Free tools for NJ farmers: crop disease identification, pest guides, blueberry yield calculator, crop recommender, drone imagery gallery, and crop health monitoring. Powered by real agricultural data.",
  alternates: { canonical: "https://agdronesnj.com/resources" },
  openGraph: {
    title: "Free Farming Resources & Tools | AG Drones NJ",
    description:
      "Interactive tools for New Jersey farmers — identify crop diseases, estimate blueberry yields, find the best crops for your soil, and explore drone survey imagery.",
    url: "https://agdronesnj.com/resources",
  },
  keywords: [
    "NJ farming tools",
    "crop disease guide",
    "pest identifier",
    "blueberry yield calculator",
    "crop recommender",
    "drone imagery",
    "crop health monitoring",
    "New Jersey agriculture",
    "agricultural drone data",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
