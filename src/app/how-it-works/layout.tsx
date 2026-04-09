import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Drone Spraying Works — 6-Step Process from Quote to Coverage Report",
  description:
    "See how AG Drones NJ delivers precision drone spraying: quote request, field assessment, scheduling, GPS-guided application, and same-day coverage reports. FAQs answered.",
  alternates: { canonical: "https://agdronesnj.com/how-it-works" },
  openGraph: {
    title: "How Agricultural Drone Spraying Works | AG Drones NJ",
    description: "From quote request to GPS coverage report in days. See our 6-step precision drone spraying workflow.",
    url: "https://agdronesnj.com/how-it-works",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
