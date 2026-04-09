import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { MarketingLayout } from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title: {
    default: "AG Drones NJ | Precision Agricultural Drone Services in New Jersey",
    template: "%s | AG Drones NJ",
  },
  description:
    "Next-gen agricultural drone services for New Jersey farms. FAA Part 137 certified. 3D field mapping, precision crop spraying, NDVI analytics — cut chemical costs 30% with drone technology.",
  keywords: [
    "agricultural drone spraying",
    "crop spraying drone",
    "drone spraying NJ",
    "precision agriculture",
    "New Jersey farms",
    "drone crop application",
    "FAA Part 137",
    "agricultural drone services",
    "3D field mapping",
    "NDVI drone analytics",
    "AG Drones NJ",
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
          <MarketingLayout>{children}</MarketingLayout>
        </Providers>
      </body>
    </html>
  );
}
