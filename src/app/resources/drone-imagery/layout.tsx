import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drone Imagery Gallery — RGB, NDVI, Multispectral & Thermal",
  description:
    "Explore agricultural drone imagery types: standard RGB aerial photos, NDVI vegetation indexes, multispectral crop analysis, and thermal heat maps. See what drone surveys reveal about crop health.",
  alternates: { canonical: "https://agdronesnj.com/resources/drone-imagery" },
  openGraph: {
    title: "Agricultural Drone Imagery Gallery | AG Drones NJ",
    description:
      "See what our drones capture. RGB, multispectral, NDVI, and thermal imagery for precision agriculture. Sub-centimeter resolution.",
    url: "https://agdronesnj.com/resources/drone-imagery",
  },
  keywords: [
    "drone imagery agriculture",
    "NDVI crop map",
    "multispectral drone survey",
    "thermal crop imaging",
    "aerial farm photography",
    "UAV crop monitoring",
    "precision agriculture imagery",
    "drone survey examples",
    "agricultural remote sensing",
    "DJI T25 camera",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
