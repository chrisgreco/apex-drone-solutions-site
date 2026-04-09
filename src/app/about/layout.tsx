import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About AG Drones NJ — FAA Part 137 Certified Ag Drone Operator",
  description:
    "AG Drones NJ is a South Jersey agricultural drone company. FAA Part 137 & 107 certified, NJ DEP licensed pesticide applicator, $2M insured. Built for NJ specialty crops.",
  alternates: { canonical: "https://agdronesnj.com/about" },
  openGraph: {
    title: "About AG Drones NJ | Certifications & Story",
    description: "FAA Part 137 certified. NJ DEP licensed. $2M insured. Learn about the team bringing precision drone technology to NJ farms.",
    url: "https://agdronesnj.com/about",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
