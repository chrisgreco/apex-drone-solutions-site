import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alert preferences — AG Drones NJ",
  description: "Manage your AG Drones NJ farm alert email preferences.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
