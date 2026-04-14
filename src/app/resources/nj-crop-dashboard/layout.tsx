import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NJ Crop Dashboard — moved to /resources",
  alternates: { canonical: "https://agdronesnj.com/resources" },
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
