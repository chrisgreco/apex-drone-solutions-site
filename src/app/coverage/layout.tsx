import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Area — South Jersey Farm Coverage Map",
  description:
    "AG Drones NJ serves Burlington, Cumberland, Salem, Atlantic, Gloucester, Camden & Cape May counties. 711K+ farmland acres, 10K+ farms in our coverage zone.",
  alternates: { canonical: "https://agdronesnj.com/coverage" },
  openGraph: {
    title: "Coverage Area — South Jersey | AG Drones NJ",
    description: "Serving 7 South Jersey counties: Burlington, Cumberland, Salem, Atlantic and more. 711K+ farmland acres.",
    url: "https://agdronesnj.com/coverage",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
