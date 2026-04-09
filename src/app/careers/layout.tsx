import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drone Pilot Jobs NJ — Join AG Drones NJ",
  description:
    "Become an agricultural drone pilot in New Jersey. FAA Part 107 required. Veteran-friendly. Fly DJI Agras T25 drones for precision crop spraying across South Jersey farms.",
  alternates: { canonical: "https://agdronesnj.com/careers" },
  openGraph: {
    title: "Become a Drone Pilot | AG Drones NJ Careers",
    description: "Join our team of agricultural drone pilots. FAA Part 107 required. Veteran-friendly. South Jersey based.",
    url: "https://agdronesnj.com/careers",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
