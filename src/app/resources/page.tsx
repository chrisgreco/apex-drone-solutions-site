"use client";

import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/FadeIn";
import { GridBackground } from "@/components/ui/grid-background";
import {
  IconLeaf,
  IconTarget,
  IconCalculator,
  IconWheat,
  IconCamera,
  IconBarChart,
  IconArrowRight,
} from "@/components/Icons";

const tools = [
  {
    href: "/resources/crop-disease-guide",
    icon: <IconLeaf className="w-7 h-7" />,
    title: "Crop Disease Guide",
    description:
      "Visual reference for 30+ crop diseases affecting NJ farms. Identify symptoms early and know when to call for drone spraying.",
    tag: "20k+ Disease Images",
    color: "from-red-500/20 to-amber-500/20",
    border: "border-red-500/20 hover:border-red-500/40",
  },
  {
    href: "/resources/pest-identifier",
    icon: <IconTarget className="w-7 h-7" />,
    title: "Pest Identifier",
    description:
      "Identify the 12 most common crop pests in the Mid-Atlantic region. Learn damage patterns and optimal treatment timing.",
    tag: "12 Pest Classes",
    color: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/20 hover:border-amber-500/40",
  },
  {
    href: "/resources/blueberry-yield-calculator",
    icon: <IconCalculator className="w-7 h-7" />,
    title: "Blueberry Yield Calculator",
    description:
      "Estimate your blueberry yield based on environmental factors. Built from real agricultural research data for NJ growers.",
    tag: "NJ Blueberry Data",
    color: "from-blue-500/20 to-indigo-500/20",
    border: "border-blue-500/20 hover:border-blue-500/40",
  },
  {
    href: "/resources/crop-recommender",
    icon: <IconWheat className="w-7 h-7" />,
    title: "Crop Recommender",
    description:
      "Find the best crops for your soil conditions and climate. Data-driven recommendations for South Jersey farmland.",
    tag: "Soil + Weather Data",
    color: "from-green-500/20 to-emerald-500/20",
    border: "border-green-500/20 hover:border-green-500/40",
  },
  {
    href: "/resources/drone-imagery",
    icon: <IconCamera className="w-7 h-7" />,
    title: "Drone Imagery Gallery",
    description:
      "See what agricultural drone surveys actually capture. RGB, multispectral, and NDVI imagery from real farm flights.",
    tag: "RGB + NIR + NDVI",
    color: "from-accent-500/20 to-green-500/20",
    border: "border-accent-500/20 hover:border-accent-500/40",
  },
  {
    href: "/resources/crop-health",
    icon: <IconBarChart className="w-7 h-7" />,
    title: "Crop Health Monitor",
    description:
      "Understand crop stress signals before they become visible. Learn how drone-based monitoring catches problems early.",
    tag: "Stress Detection",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <GridBackground />

      {/* Hero */}
      <section className="section relative">
        <div className="container-narrow mx-auto text-center">
          <FadeIn>
            <p className="text-accent-400 font-mono text-sm tracking-wider uppercase mb-4">
              Free Farming Tools
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Resources for{" "}
              <span className="text-accent-400">NJ Farmers</span>
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Free tools and guides powered by real agricultural data.
              Identify diseases, estimate yields, find the right crops, and
              see what drone technology can do for your operation.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="section !pt-0 relative">
        <div className="container-narrow mx-auto">
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <StaggerItem key={tool.href}>
                <Link
                  href={tool.href}
                  className={`group block glass-card ${tool.border} p-6 transition-all duration-300 hover:translate-y-[-2px]`}
                >
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 text-white`}
                  >
                    {tool.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-white/50 mb-4 leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-accent-400/60 bg-accent-500/10 px-2.5 py-1 rounded-full">
                      {tool.tag}
                    </span>
                    <span className="text-accent-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <IconArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Data Sources */}
      <section className="section !pt-0 relative">
        <div className="container-narrow mx-auto">
          <FadeIn>
            <div className="glass-card p-8 text-center">
              <p className="text-xs font-mono text-white/30 uppercase tracking-wider mb-3">
                Powered By Open Agricultural Data
              </p>
              <p className="text-sm text-white/40 max-w-3xl mx-auto">
                Our tools are built on publicly available agricultural
                research datasets including UAV crop imagery, blueberry yield
                studies, crop recommendation models, pest detection databases,
                and environmental stress analysis. Data sources include Kaggle
                open datasets and USDA agricultural research.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
