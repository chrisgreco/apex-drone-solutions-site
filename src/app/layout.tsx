import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { ElevenLabsWidget } from "@/components/ElevenLabsWidget";

export const metadata: Metadata = {
  title: {
    default: "Apex Drone Solutions | Drone-Powered Property Documentation",
    template: "%s | Apex Drone Solutions",
  },
  description:
    "Drone-powered roof and property condition documentation for insurance carriers, independent adjusters, and roofing contractors. AI-driven reports, 3D models, and faster claims resolution.",
  keywords: [
    "drone inspection",
    "roof documentation",
    "insurance claims",
    "property damage",
    "aerial survey",
    "roofing contractor",
    "storm response",
    "AI damage detection",
  ],
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ElevenLabsWidget />
        </Providers>
      </body>
    </html>
  );
}
