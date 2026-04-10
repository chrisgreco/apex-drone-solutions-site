import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NJ Operations Radar — Live Conditions | AG Drones NJ",
  description:
    "Real-time NASA satellite monitoring of weather events affecting South Jersey agriculture. Track storms, floods, wildfires, drought, and temperature extremes across NJ farmland.",
  alternates: { canonical: "https://agdronesnj.com/conditions" },
  openGraph: {
    title: "NJ Operations Radar | AG Drones NJ",
    description:
      "Live NASA EONET data showing conditions affecting NJ farms. Severe storms, floods, wildfires, drought monitoring for drone operations.",
    url: "https://agdronesnj.com/conditions",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "NJ Operations Radar",
            description:
              "Real-time NASA satellite monitoring of weather events affecting South Jersey agriculture.",
            url: "https://agdronesnj.com/conditions",
            provider: {
              "@type": "LocalBusiness",
              name: "AG Drones NJ",
              url: "https://agdronesnj.com",
            },
            about: {
              "@type": "Thing",
              name: "Agricultural weather monitoring",
              description:
                "Live tracking of severe storms, floods, wildfires, drought, and temperature extremes across New Jersey farmland using NASA EONET satellite data.",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
