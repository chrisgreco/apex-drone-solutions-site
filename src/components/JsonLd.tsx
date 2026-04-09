export function JsonLd() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://agdronesnj.com/#business",
    name: "AG Drones NJ",
    description:
      "Precision agricultural drone services for New Jersey farms. FAA Part 137 certified. GPS-guided crop spraying, 3D field mapping, NDVI analytics, cover crop seeding.",
    url: "https://agdronesnj.com",
    telephone: "+1-555-AG-DRONE",
    email: "info@agdronesnj.com",
    image: "https://agdronesnj.com/og-image.png",
    priceRange: "$16-25/acre",
    areaServed: [
      { "@type": "State", name: "New Jersey" },
      { "@type": "AdministrativeArea", name: "Burlington County, NJ" },
      { "@type": "AdministrativeArea", name: "Cumberland County, NJ" },
      { "@type": "AdministrativeArea", name: "Salem County, NJ" },
      { "@type": "AdministrativeArea", name: "Atlantic County, NJ" },
      { "@type": "AdministrativeArea", name: "Gloucester County, NJ" },
      { "@type": "AdministrativeArea", name: "Camden County, NJ" },
      { "@type": "AdministrativeArea", name: "Cape May County, NJ" },
    ],
    address: {
      "@type": "PostalAddress",
      addressRegion: "NJ",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 39.7837,
      longitude: -74.9723,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Agricultural Drone Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Precision Crop Spraying",
            description:
              "GPS-guided drone application of fungicides, pesticides, herbicides at 20 acres/hour with 2cm RTK accuracy. DJI Agras T25 fleet.",
          },
          price: "16",
          priceCurrency: "USD",
          unitText: "per acre",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Cover Crop Seeding",
            description:
              "Aerial seeding into standing crops with zero soil compaction. Cereal rye, crimson clover, tillage radish mixes.",
          },
          price: "18",
          priceCurrency: "USD",
          unitText: "per acre",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "3D Field Mapping & NDVI Analytics",
            description:
              "Multispectral drone surveys generating NDVI crop health maps, 3D terrain models, and variable-rate prescription maps.",
          },
          price: "8",
          priceCurrency: "USD",
          unitText: "per acre",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "AI Pest & Disease Detection",
            description:
              "Machine learning analysis of aerial imagery to identify pest damage, fungal infections, and disease hotspots.",
          },
        },
      ],
    },
    sameAs: [],
    knowsAbout: [
      "Agricultural drone spraying",
      "Precision agriculture",
      "NDVI crop health mapping",
      "FAA Part 137 operations",
      "Cover crop aerial seeding",
      "Blueberry farming",
      "Cranberry farming",
      "New Jersey agriculture",
      "DJI Agras T25",
      "RTK GPS precision",
    ],
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "FAA Certifications",
        value: "Part 107 Remote Pilot, Part 137 Agricultural Aircraft Operator",
      },
      {
        "@type": "PropertyValue",
        name: "NJ Licenses",
        value: "DEP Pesticide Applicator (CORE + AERIAL)",
      },
      {
        "@type": "PropertyValue",
        name: "Insurance",
        value: "$2M Commercial General Liability",
      },
      {
        "@type": "PropertyValue",
        name: "Coverage Rate",
        value: "20 acres per hour",
      },
      {
        "@type": "PropertyValue",
        name: "GPS Accuracy",
        value: "2cm RTK precision",
      },
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does drone spraying cost per acre in New Jersey?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AG Drones NJ pricing starts at $16/acre for crop spraying, $18/acre for cover crop seeding, and $8/acre for NDVI field mapping. Volume discounts are available for 50+ acres and seasonal contracts.",
        },
      },
      {
        "@type": "Question",
        name: "What certifications does AG Drones NJ hold?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AG Drones NJ holds FAA Part 107 Remote Pilot certificates, FAA Part 137 Agricultural Aircraft Operator certification (the same required of manned crop dusters), NJ DEP Pesticide Applicator licenses (CORE + AERIAL), and $2M commercial general liability insurance.",
        },
      },
      {
        "@type": "Question",
        name: "What areas in New Jersey does AG Drones NJ serve?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AG Drones NJ serves South Jersey including Burlington, Cumberland, Salem, Atlantic, Gloucester, Camden, and Cape May counties — covering 711,000+ farmland acres and 10,000+ active farms.",
        },
      },
      {
        "@type": "Question",
        name: "What crops can be sprayed with agricultural drones?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AG Drones NJ sprays blueberries, cranberries, tomatoes, peppers, peaches, soybeans, corn, sweet potatoes, and other NJ specialty crops. We apply fungicides, pesticides, herbicides, foliar nutrients, and desiccants.",
        },
      },
      {
        "@type": "Question",
        name: "How does drone spraying compare to traditional methods?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Drone spraying offers 30% chemical savings through precision GPS-guided application, zero soil compaction, access to wet fields and steep terrain, and 100% GPS-tracked coverage reports. Starting at $16/acre, it's competitive with airplane application but with centimeter-level accuracy.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
