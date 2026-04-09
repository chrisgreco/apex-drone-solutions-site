import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DJI Agras T25 Drone Fleet — Equipment & Specifications",
  description:
    "AG Drones NJ operates DJI Agras T25 agricultural drones: 20L tank, 4 precision nozzles, terrain-following radar, RTK GPS. 20 acres/hour coverage at 2cm accuracy.",
  alternates: { canonical: "https://agdronesnj.com/equipment" },
  openGraph: {
    title: "Our Drone Fleet — DJI Agras T25 | AG Drones NJ",
    description: "Purpose-built agricultural drones with 20L tanks, precision nozzles, and 2cm RTK GPS accuracy.",
    url: "https://agdronesnj.com/equipment",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
