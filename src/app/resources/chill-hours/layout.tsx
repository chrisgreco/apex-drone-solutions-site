import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NJ Chill Hours Tracker — Dormant Season Progress for Blueberry, Peach, Apple",
  description:
    "Free live chill-hour tracker for NJ orchards and blueberry farms. Utah model + variety-specific requirements. See your Oct 1 to now accumulation and predicted bloom date.",
  alternates: { canonical: "https://agdronesnj.com/resources/chill-hours" },
  openGraph: {
    title: "NJ Chill Hours Tracker — Variety-Specific, Free",
    description:
      "Track dormant-season chill hours for your NJ farm. Utah model, variety targets, and bloom date prediction.",
    url: "https://agdronesnj.com/resources/chill-hours",
  },
  keywords: [
    "chill hours NJ",
    "chill hours blueberry",
    "chill hours peach",
    "chill hours apple",
    "Utah chill model",
    "dynamic chill portions",
    "NJ dormancy tracker",
    "blueberry variety chill",
    "Redhaven chill hours",
    "Bluecrop chill hours",
    "NJ fruit bloom prediction",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
