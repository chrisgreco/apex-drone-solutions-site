import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get a Free Drone Spraying Quote — Contact AG Drones NJ",
  description:
    "Request a free, no-obligation quote for drone crop spraying, seeding, or field mapping on your NJ farm. Response within 24 hours. Serving South Jersey.",
  alternates: { canonical: "https://agdronesnj.com/contact" },
  openGraph: {
    title: "Get a Free Quote | AG Drones NJ",
    description: "Free drone spraying quotes for NJ farms. Tell us your field size and crop — custom pricing within 24 hours.",
    url: "https://agdronesnj.com/contact",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
