import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NJ Disease Pressure Forecast — Live Infection Risk for Blueberry, Peach, Apple, Tomato",
  description:
    "Live 7-day disease infection risk for NJ farmers: mummy berry, brown rot, fire blight, late blight, bacterial spot, and early blight. Powered by Milholland, Mills, Johnson, and Cougarblight models using NOAA + Open-Meteo data.",
  alternates: { canonical: "https://agdronesnj.com/resources/disease-pressure" },
  openGraph: {
    title: "NJ Disease Pressure Forecast",
    description:
      "Free 7-day infection risk for NJ blueberry, peach, apple, tomato, and pepper. Mummy berry, brown rot, fire blight, late blight and more — Extension-grade models.",
    url: "https://agdronesnj.com/resources/disease-pressure",
  },
  keywords: [
    "mummy berry forecast NJ",
    "brown rot forecast peach",
    "fire blight risk apple",
    "late blight tomato NJ",
    "bacterial spot pepper",
    "blueberry disease NJ",
    "Milholland mummy berry model",
    "Cougarblight fire blight",
    "NJ disease infection risk",
    "NEWA alternative NJ",
    "agricultural disease forecast",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
