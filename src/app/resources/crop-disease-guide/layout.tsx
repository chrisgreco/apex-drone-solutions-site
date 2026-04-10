import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crop Disease Guide — Identify 30+ Diseases Affecting NJ Farms",
  description:
    "Visual identification guide for crop diseases in New Jersey. Covers blueberry, peach, tomato, pepper, apple, grape, corn, and soybean diseases with symptoms, severity ratings, and treatment timing.",
  alternates: { canonical: "https://agdronesnj.com/resources/crop-disease-guide" },
  openGraph: {
    title: "NJ Crop Disease Identification Guide | AG Drones NJ",
    description:
      "Identify Early Blight, Powdery Mildew, Anthracnose, Brown Rot, and 14+ more crop diseases. Learn symptoms and when to spray.",
    url: "https://agdronesnj.com/resources/crop-disease-guide",
  },
  keywords: [
    "crop disease identification",
    "NJ crop diseases",
    "blueberry disease",
    "peach brown rot",
    "tomato blight",
    "powdery mildew",
    "anthracnose",
    "mummy berry",
    "agricultural disease guide",
    "when to spray crops",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
