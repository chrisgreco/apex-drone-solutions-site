import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crop Recommender — Best Crops for Your NJ Farmland",
  description:
    "Data-driven crop recommendations for South Jersey soil types. Input soil pH, nutrients, rainfall, and temperature to find the best crops for your land. Covers blueberries, peaches, tomatoes, and 9 more NJ crops.",
  alternates: { canonical: "https://agdronesnj.com/resources/crop-recommender" },
  openGraph: {
    title: "What Should You Grow? NJ Crop Recommender | AG Drones NJ",
    description:
      "Enter your soil conditions and climate to get ranked crop recommendations for South Jersey farmland. Yield estimates and market values included.",
    url: "https://agdronesnj.com/resources/crop-recommender",
  },
  keywords: [
    "crop recommendation tool",
    "what to grow NJ",
    "South Jersey crops",
    "soil type crop matching",
    "NJ farming guide",
    "sandy loam crops",
    "blueberry soil requirements",
    "peach growing conditions",
    "best crops New Jersey",
    "crop selection tool",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
