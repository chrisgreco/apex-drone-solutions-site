import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { MarketingLayout } from "@/components/MarketingLayout";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://agdronesnj.com"),
  title: {
    default: "AG Drones NJ | Precision Agricultural Drone Services in New Jersey",
    template: "%s | AG Drones NJ",
  },
  description:
    "Precision agricultural drone services for New Jersey farms. FAA Part 137 certified. GPS-guided crop spraying, 3D field mapping, NDVI analytics, cover crop seeding. Cut chemical costs 30%. Serving Burlington, Cumberland, Salem & Atlantic counties.",
  keywords: [
    "agricultural drone spraying NJ",
    "crop spraying drone New Jersey",
    "drone spraying services South Jersey",
    "precision agriculture drone",
    "FAA Part 137 drone operator",
    "blueberry spraying drone",
    "cranberry farm drone",
    "NDVI drone mapping NJ",
    "3D field mapping drone",
    "cover crop seeding drone",
    "drone pest detection agriculture",
    "farm drone services Burlington County",
    "Cumberland County crop spraying",
    "Salem County agriculture drone",
    "Atlantic County farm drone",
    "AG Drones NJ",
    "drone spraying cost per acre",
    "agricultural drone operator New Jersey",
  ],
  authors: [{ name: "AG Drones NJ" }],
  creator: "AG Drones NJ",
  publisher: "AG Drones NJ",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://agdronesnj.com",
    siteName: "AG Drones NJ",
    title: "AG Drones NJ | Precision Agricultural Drone Services",
    description:
      "FAA Part 137 certified drone spraying for NJ farms. GPS-guided precision application, 3D field mapping, NDVI analytics. 30% chemical savings. Starting at $16/acre.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AG Drones NJ - Precision Agricultural Drone Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AG Drones NJ | Precision Agricultural Drone Services",
    description:
      "FAA Part 137 certified drone spraying for NJ farms. GPS-guided precision, 3D mapping, NDVI analytics. 30% chemical savings.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  alternates: {
    canonical: "https://agdronesnj.com",
  },
  category: "Agriculture Technology",
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
        <JsonLd />
      </body>
    </html>
  );
}
