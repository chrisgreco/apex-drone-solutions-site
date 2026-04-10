import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NJ Farm Weather & Conditions Radar — Live NASA Satellite Data",
  description:
    "Real-time NASA EONET satellite monitoring of weather events affecting South Jersey agriculture. Track severe storms, floods, wildfires, drought, and temperature extremes across Burlington, Cumberland, Salem & Atlantic counties. Know when to schedule drone crop surveys, post-storm assessments, and NDVI monitoring.",
  alternates: { canonical: "https://agdronesnj.com/conditions" },
  keywords: [
    "NJ farm weather conditions",
    "South Jersey agriculture weather",
    "farm weather radar New Jersey",
    "NASA satellite farm monitoring",
    "drone flight conditions NJ",
    "crop weather alerts South Jersey",
    "Burlington County farm weather",
    "Cumberland County agriculture conditions",
    "Salem County farm radar",
    "Atlantic County crop weather",
    "blueberry farm weather NJ",
    "cranberry bog conditions",
    "peach orchard frost alert NJ",
    "post-storm crop damage assessment",
    "drought monitoring NJ farms",
    "flood risk South Jersey agriculture",
    "wildfire smoke farm impact NJ",
    "NDVI crop stress survey NJ",
    "agricultural drone weather planning",
    "AG Drones NJ conditions",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "NJ Farm Weather Radar — Live NASA Satellite Conditions | AG Drones NJ",
    description:
      "Live NASA EONET data showing storms, floods, wildfires, drought & temperature extremes affecting NJ farms. Real-time conditions for drone operations and crop management across South Jersey.",
    url: "https://agdronesnj.com/conditions",
    type: "website",
    siteName: "AG Drones NJ",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AG Drones NJ — NJ Operations Radar showing live NASA weather conditions for South Jersey farms",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NJ Farm Weather Radar — Live NASA Satellite Data",
    description:
      "Real-time NASA EONET monitoring of storms, floods, wildfires & drought across South Jersey farmland. Know when your crops need drone surveys.",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* WebPage + DataFeed structured data for search engines & LLMs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "NJ Farm Weather & Conditions Radar",
            description:
              "Real-time NASA EONET satellite monitoring of weather events affecting South Jersey agriculture — storms, floods, wildfires, drought, and temperature extremes across Burlington, Cumberland, Salem, and Atlantic counties.",
            url: "https://agdronesnj.com/conditions",
            isPartOf: {
              "@type": "WebSite",
              name: "AG Drones NJ",
              url: "https://agdronesnj.com",
            },
            provider: {
              "@type": "LocalBusiness",
              "@id": "https://agdronesnj.com/#business",
              name: "AG Drones NJ",
              url: "https://agdronesnj.com",
              areaServed: [
                { "@type": "AdministrativeArea", name: "Burlington County, NJ" },
                { "@type": "AdministrativeArea", name: "Cumberland County, NJ" },
                { "@type": "AdministrativeArea", name: "Salem County, NJ" },
                { "@type": "AdministrativeArea", name: "Atlantic County, NJ" },
              ],
            },
            about: [
              { "@type": "Thing", name: "Agricultural weather monitoring" },
              { "@type": "Thing", name: "Drone flight safety conditions" },
              { "@type": "Thing", name: "Crop damage assessment" },
              { "@type": "Thing", name: "NASA Earth Observatory Natural Event Tracker" },
            ],
            mainEntity: {
              "@type": "DataFeed",
              name: "NASA EONET Live Weather Events — New Jersey",
              description:
                "Live feed of natural events from NASA Earth Observatory Natural Event Tracker (EONET) filtered to New Jersey. Categories: severe storms, floods, wildfires, drought, temperature extremes.",
              dataFeedElement: "NASA EONET v3 API",
              url: "https://eonet.gsfc.nasa.gov/api/v3/events",
              creator: {
                "@type": "Organization",
                name: "NASA Goddard Space Flight Center",
                url: "https://eonet.gsfc.nasa.gov",
              },
            },
          }),
        }}
      />

      {/* FAQ structured data — targets conversational/LLM queries */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What weather conditions affect agricultural drone operations in New Jersey?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Severe storms (hurricanes, nor'easters, tornadoes) ground drone operations immediately. Wildfires and smoke in the Pine Barrens reduce visibility and sensor accuracy. Floods make fields inaccessible. Drought conditions signal the need for NDVI crop stress surveys. Temperature extremes like late frost can damage peach blossoms and blueberry crops, requiring post-event damage assessments. AG Drones NJ monitors all of these in real-time via NASA EONET satellite data.",
                },
              },
              {
                "@type": "Question",
                name: "How does AG Drones NJ monitor farm weather conditions?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "AG Drones NJ uses NASA's Earth Observatory Natural Event Tracker (EONET) satellite data to monitor real-time weather events across South Jersey. The NJ Operations Radar tracks severe storms, floods, wildfires, drought, and temperature extremes in Burlington, Cumberland, Salem, and Atlantic counties — the heart of NJ's agricultural corridor covering 277,000+ farmland acres.",
                },
              },
              {
                "@type": "Question",
                name: "What should farmers do after a severe storm hits their fields in South Jersey?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "After a severe storm, farmers should schedule a post-storm aerial damage assessment. AG Drones NJ can deploy drones within 24-48 hours of a storm clearing to capture high-resolution imagery, identify crop damage patterns, assess drainage issues, and generate reports for insurance claims. Early assessment helps prioritize recovery efforts across blueberry, cranberry, vegetable, and field crop operations.",
                },
              },
              {
                "@type": "Question",
                name: "Can drones detect drought stress in NJ crops?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. AG Drones NJ uses multispectral NDVI (Normalized Difference Vegetation Index) drone surveys to detect crop stress from drought before it's visible to the naked eye. When our NJ Operations Radar shows drought conditions in South Jersey, we recommend scheduling an NDVI crop health survey to identify stressed areas early and optimize irrigation — particularly important for blueberry and peach operations.",
                },
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
