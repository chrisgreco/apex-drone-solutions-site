import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ROI Calculator — How Much Does Drone Spraying Save?",
  description:
    "Calculate your savings from switching to drone crop spraying. Compare costs vs ground rigs and airplanes. See chemical savings, labor reduction, and annual ROI for your farm.",
  alternates: { canonical: "https://agdronesnj.com/roi-calculator" },
  openGraph: {
    title: "Drone Spraying ROI Calculator | AG Drones NJ",
    description: "Enter your field size and crop type. See exactly how much switching to drone application saves you annually.",
    url: "https://agdronesnj.com/roi-calculator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
