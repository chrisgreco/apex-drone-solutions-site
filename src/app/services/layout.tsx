import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agricultural Drone Services — Spraying, Seeding, Mapping, Pest Detection",
  description:
    "Precision crop spraying at $16/acre, cover crop seeding, 3D NDVI field mapping, and AI pest detection for NJ farms. DJI Agras T25 fleet. 20 acres/hour. FAA Part 137 certified.",
  alternates: { canonical: "https://agdronesnj.com/services" },
  openGraph: {
    title: "Agricultural Drone Services | AG Drones NJ",
    description: "GPS-guided crop spraying, cover crop seeding, NDVI mapping & AI pest detection for New Jersey farms. Starting at $16/acre.",
    url: "https://agdronesnj.com/services",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
