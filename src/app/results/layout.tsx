import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Results & Testimonials — NJ Farmer Reviews of Drone Spraying",
  description:
    "Real results from NJ farmers using AG Drones NJ. 30% chemical savings, faster coverage, zero crop damage. Read testimonials from Burlington, Cumberland & Salem County farms.",
  alternates: { canonical: "https://agdronesnj.com/results" },
  openGraph: {
    title: "Farmer Testimonials & Results | AG Drones NJ",
    description: "Real results: 30% chemical savings, zero soil compaction, GPS-verified coverage. See what NJ farmers say about drone spraying.",
    url: "https://agdronesnj.com/results",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
