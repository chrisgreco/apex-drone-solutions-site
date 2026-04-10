import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pest Identifier — 12 Common Crop Pests in New Jersey",
  description:
    "Identify Japanese Beetles, Spotted Lanternfly, Aphids, Blueberry Maggot, and 8 more crop pests in the Mid-Atlantic region. Threat levels, damage patterns, treatment windows, and drone spray effectiveness.",
  alternates: { canonical: "https://agdronesnj.com/resources/pest-identifier" },
  openGraph: {
    title: "NJ Crop Pest Identifier | AG Drones NJ",
    description:
      "Interactive guide to 12 crop pests threatening NJ farms. Damage patterns, threat levels, and drone treatment options for each pest.",
    url: "https://agdronesnj.com/resources/pest-identifier",
  },
  keywords: [
    "crop pest identification",
    "NJ farm pests",
    "spotted lanternfly",
    "japanese beetle",
    "blueberry maggot",
    "aphid control",
    "armyworm",
    "corn earworm",
    "drone pest treatment",
    "agricultural pest management",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
