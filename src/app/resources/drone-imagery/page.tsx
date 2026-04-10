"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/FadeIn";
import { GridBackground } from "@/components/ui/grid-background";
import {
  IconCamera,
  IconMap,
  IconTarget,
  IconBarChart,
  IconArrowRight,
  IconCheckCircle,
  IconDrone,
  IconSun,
  IconLeaf,
  IconNavigation,
} from "@/components/Icons";

/* ------------------------------------------------------------------ */
/*  Filter categories                                                  */
/* ------------------------------------------------------------------ */

type ImageryType = "All" | "RGB" | "Multispectral" | "NDVI" | "Thermal";

const filters: ImageryType[] = [
  "All",
  "RGB",
  "Multispectral",
  "NDVI",
  "Thermal",
];

/* ------------------------------------------------------------------ */
/*  Gallery data                                                       */
/* ------------------------------------------------------------------ */

interface ImageryCard {
  id: number;
  type: "RGB" | "Multispectral" | "NDVI" | "Thermal";
  title: string;
  description: string;
  altitude: string;
  resolution: string;
  sensor: string;
}

const galleryItems: ImageryCard[] = [
  {
    id: 1,
    type: "RGB",
    title: "Blueberry Field - 120ft AGL",
    description:
      "Standard aerial view revealing row spacing uniformity and bare soil patches between blueberry bushes. Visible canopy gaps indicate areas needing replanting.",
    altitude: "120 ft",
    resolution: "1.2 cm/px",
    sensor: "DJI Mavic 3M RGB",
  },
  {
    id: 2,
    type: "NDVI",
    title: "Soybean Canopy - NDVI Analysis",
    description:
      "Normalized Difference Vegetation Index map quantifying crop vigor. Deep green zones show peak photosynthetic activity; yellow-red areas flag nitrogen deficiency.",
    altitude: "200 ft",
    resolution: "2.0 cm/px",
    sensor: "MicaSense RedEdge-P",
  },
  {
    id: 3,
    type: "Thermal",
    title: "Peach Orchard - Heat Stress Map",
    description:
      "Infrared thermal capture detecting canopy temperature differentials. Hot spots along the southern rows indicate irrigation blockage and water stress.",
    altitude: "150 ft",
    resolution: "5.0 cm/px",
    sensor: "DJI Zenmuse H20T",
  },
  {
    id: 4,
    type: "Multispectral",
    title: "Cranberry Bog - 5-Band Capture",
    description:
      "Red, Green, Blue, Red Edge, and NIR bands captured simultaneously. False-color composite highlights chlorophyll concentration differences invisible to the naked eye.",
    altitude: "180 ft",
    resolution: "2.5 cm/px",
    sensor: "MicaSense RedEdge-P",
  },
  {
    id: 5,
    type: "RGB",
    title: "Corn Field - Growth Stage V6",
    description:
      "High-resolution mosaic stitched from 847 overlapping images. Row emergence uniformity is clearly visible, with a stand count accuracy of 98.2%.",
    altitude: "100 ft",
    resolution: "0.8 cm/px",
    sensor: "DJI Mavic 3M RGB",
  },
  {
    id: 6,
    type: "NDVI",
    title: "Vineyard - Vigor Zones",
    description:
      "NDVI-derived vigor map segmented into management zones. Low-vigor vines (red) correlate with compacted soil from old tractor paths. Enables variable-rate fertilization.",
    altitude: "160 ft",
    resolution: "1.8 cm/px",
    sensor: "MicaSense RedEdge-P",
  },
  {
    id: 7,
    type: "Thermal",
    title: "Blueberry Block - Frost Risk",
    description:
      "Pre-dawn thermal survey mapping micro-climate cold pockets. Low-lying areas between rows show 4-6 degrees F colder — frost damage risk zones for spring bloom protection.",
    altitude: "130 ft",
    resolution: "4.5 cm/px",
    sensor: "DJI Zenmuse H20T",
  },
  {
    id: 8,
    type: "Multispectral",
    title: "Tomato Field - Disease Detection",
    description:
      "Near-infrared reflectance anomaly detection. Stressed plant cells reflect less NIR light — highlighting early blight infection 5-7 days before visible symptoms appear.",
    altitude: "140 ft",
    resolution: "2.2 cm/px",
    sensor: "MicaSense RedEdge-P",
  },
  {
    id: 9,
    type: "RGB",
    title: "Sweet Potato Rows - Aerial Survey",
    description:
      "Orthomosaic map generated from flight grid pattern. Weed encroachment clearly visible along field edges and between rows, enabling targeted spot-spray missions.",
    altitude: "110 ft",
    resolution: "1.0 cm/px",
    sensor: "DJI Mavic 3M RGB",
  },
  {
    id: 10,
    type: "NDVI",
    title: "Pepper Greenhouse - Canopy Index",
    description:
      "Indoor NDVI scan through greenhouse polycarbonate. Plants in rows 12-18 show reduced vigor from inadequate ventilation. Actionable data for HVAC adjustment.",
    altitude: "40 ft",
    resolution: "0.5 cm/px",
    sensor: "MicaSense RedEdge-P",
  },
  {
    id: 11,
    type: "Thermal",
    title: "Irrigation Pivot - Leak Detection",
    description:
      "Thermal differential scan of center pivot coverage area. Cool streak at 147 degrees indicates a leaking nozzle. Wet soil detected 20ft beyond intended radius.",
    altitude: "250 ft",
    resolution: "6.0 cm/px",
    sensor: "DJI Zenmuse H20T",
  },
  {
    id: 12,
    type: "Multispectral",
    title: "Cover Crop Mix - Species Mapping",
    description:
      "Multi-band analysis differentiating clover, rye, and radish in a cover crop mix. Red Edge band separates species with 91% classification accuracy for termination timing.",
    altitude: "170 ft",
    resolution: "2.3 cm/px",
    sensor: "MicaSense RedEdge-P",
  },
  {
    id: 13,
    type: "RGB",
    title: "Orchard Canopy - Tree Count",
    description:
      "Machine-learning-ready aerial imagery for automated tree detection. Individual canopy segmentation enables precise tree count, spacing analysis, and missing tree identification.",
    altitude: "200 ft",
    resolution: "1.5 cm/px",
    sensor: "DJI Mavic 3M RGB",
  },
  {
    id: 14,
    type: "NDVI",
    title: "Wheat Field - Yield Prediction",
    description:
      "Late-season NDVI correlated with historical yield data. Biomass estimation model predicts 52 bu/ac average with high-vigor zones exceeding 60 bu/ac.",
    altitude: "220 ft",
    resolution: "2.5 cm/px",
    sensor: "MicaSense RedEdge-P",
  },
];

/* ------------------------------------------------------------------ */
/*  Imagery type styles & badge colors                                 */
/* ------------------------------------------------------------------ */

const badgeColors: Record<ImageryCard["type"], string> = {
  RGB: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Multispectral: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  NDVI: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Thermal: "bg-red-500/20 text-red-300 border-red-500/30",
};

const filterColors: Record<ImageryType, string> = {
  All: "bg-accent-500 text-white",
  RGB: "bg-emerald-500 text-white",
  Multispectral: "bg-violet-500 text-white",
  NDVI: "bg-yellow-500 text-black",
  Thermal: "bg-red-500 text-white",
};

/* ------------------------------------------------------------------ */
/*  Placeholder imagery div styles (CSS-only simulations)              */
/* ------------------------------------------------------------------ */

function ImageryPlaceholder({ type, title }: { type: ImageryCard["type"]; title: string }) {
  const baseClasses =
    "relative w-full h-[220px] rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]";

  if (type === "RGB") {
    return (
      <div className={baseClasses}>
        {/* Aerial farm view simulation */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-green-700 to-emerald-900" />
        {/* Row patterns */}
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 18px,
            rgba(101,67,33,0.6) 18px,
            rgba(101,67,33,0.6) 22px
          )`,
        }} />
        {/* Irregular canopy patches */}
        <div className="absolute top-[15%] left-[10%] w-[30%] h-[25%] rounded-full bg-green-600/50 blur-xl" />
        <div className="absolute top-[45%] left-[50%] w-[35%] h-[30%] rounded-full bg-green-500/40 blur-xl" />
        <div className="absolute top-[20%] left-[60%] w-[20%] h-[20%] rounded-full bg-emerald-600/50 blur-lg" />
        {/* Bare soil patch */}
        <div className="absolute bottom-[20%] left-[30%] w-[15%] h-[15%] rounded-full bg-amber-800/40 blur-md" />
        {/* Grid overlay to simulate ortho tiles */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
        {/* Scan line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-accent-400/60" />
        <PlaceholderLabel label="RGB CAPTURE" />
      </div>
    );
  }

  if (type === "Multispectral") {
    return (
      <div className={baseClasses}>
        {/* Channel-split band look */}
        <div className="absolute inset-0 flex">
          <div className="flex-1 bg-gradient-to-b from-red-900 via-red-700 to-red-900 opacity-80" />
          <div className="flex-1 bg-gradient-to-b from-green-900 via-green-600 to-green-900 opacity-80" />
          <div className="flex-1 bg-gradient-to-b from-blue-900 via-blue-600 to-blue-900 opacity-80" />
          <div className="flex-1 bg-gradient-to-b from-red-800 via-pink-600 to-red-900 opacity-60" />
          <div className="flex-1 bg-gradient-to-b from-purple-900 via-violet-500 to-purple-900 opacity-70" />
        </div>
        {/* Noise pattern overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,100,100,0.4) 0%, transparent 40%),
            radial-gradient(circle at 60% 60%, rgba(100,255,100,0.4) 0%, transparent 35%),
            radial-gradient(circle at 80% 20%, rgba(100,100,255,0.4) 0%, transparent 30%)`,
        }} />
        {/* Band label lines */}
        <div className="absolute top-2 left-0 right-0 flex justify-around">
          {["R", "G", "B", "RE", "NIR"].map((band) => (
            <span key={band} className="text-[9px] font-mono text-white/50 tracking-widest">
              {band}
            </span>
          ))}
        </div>
        {/* Horizontal scan lines */}
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(255,255,255,0.15) 3px,
            rgba(255,255,255,0.15) 4px
          )`,
        }} />
        <PlaceholderLabel label="5-BAND CAPTURE" />
      </div>
    );
  }

  if (type === "NDVI") {
    return (
      <div className={baseClasses}>
        {/* Classic NDVI color ramp: red -> yellow -> green */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(135deg,
            #d73027 0%,
            #f46d43 12%,
            #fdae61 25%,
            #fee08b 37%,
            #d9ef8b 50%,
            #a6d96a 62%,
            #66bd63 75%,
            #1a9850 87%,
            #006837 100%
          )`,
        }} />
        {/* Irregular zones to simulate field variation */}
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[35%] rounded-[40%] bg-[#1a9850]/60 blur-xl" />
        <div className="absolute top-[50%] left-[55%] w-[30%] h-[30%] rounded-[40%] bg-[#d73027]/40 blur-xl" />
        <div className="absolute top-[30%] left-[35%] w-[25%] h-[25%] rounded-[40%] bg-[#fee08b]/50 blur-lg" />
        <div className="absolute top-[60%] left-[15%] w-[20%] h-[20%] rounded-[40%] bg-[#66bd63]/60 blur-lg" />
        {/* Scale bar */}
        <div className="absolute bottom-3 right-3 flex flex-col items-end gap-0.5">
          <div className="flex h-3 w-24 rounded-sm overflow-hidden border border-white/20">
            <div className="flex-1 bg-[#d73027]" />
            <div className="flex-1 bg-[#fdae61]" />
            <div className="flex-1 bg-[#fee08b]" />
            <div className="flex-1 bg-[#a6d96a]" />
            <div className="flex-1 bg-[#1a9850]" />
          </div>
          <div className="flex justify-between w-24">
            <span className="text-[8px] font-mono text-white/60">-0.2</span>
            <span className="text-[8px] font-mono text-white/60">1.0</span>
          </div>
        </div>
        <PlaceholderLabel label="NDVI INDEX" />
      </div>
    );
  }

  // Thermal
  return (
    <div className={baseClasses}>
      {/* Blue-to-red heat map */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(160deg,
          #0d0887 0%,
          #3b049a 15%,
          #7201a8 25%,
          #a52c60 40%,
          #d44842 55%,
          #ed7953 65%,
          #fbb61a 80%,
          #f0f921 100%
        )`,
      }} />
      {/* Hot spots */}
      <div className="absolute top-[25%] left-[20%] w-[20%] h-[20%] rounded-full bg-[#f0f921]/50 blur-xl" />
      <div className="absolute top-[55%] left-[60%] w-[25%] h-[25%] rounded-full bg-[#fbb61a]/40 blur-xl" />
      {/* Cool zones */}
      <div className="absolute top-[40%] left-[40%] w-[30%] h-[25%] rounded-full bg-[#3b049a]/40 blur-xl" />
      <div className="absolute top-[15%] left-[65%] w-[18%] h-[18%] rounded-full bg-[#0d0887]/50 blur-lg" />
      {/* Temperature scale */}
      <div className="absolute bottom-3 right-3 flex flex-col items-end gap-0.5">
        <div className="flex h-3 w-24 rounded-sm overflow-hidden border border-white/20">
          <div className="flex-1 bg-[#0d0887]" />
          <div className="flex-1 bg-[#7201a8]" />
          <div className="flex-1 bg-[#d44842]" />
          <div className="flex-1 bg-[#fbb61a]" />
          <div className="flex-1 bg-[#f0f921]" />
        </div>
        <div className="flex justify-between w-24">
          <span className="text-[8px] font-mono text-white/60">60F</span>
          <span className="text-[8px] font-mono text-white/60">105F</span>
        </div>
      </div>
      <PlaceholderLabel label="THERMAL IR" />
    </div>
  );
}

function PlaceholderLabel({ label }: { label: string }) {
  return (
    <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-mono text-white/70 tracking-widest border border-white/10">
      {label}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  How It Works - imagery type explainers                             */
/* ------------------------------------------------------------------ */

const imageryTypes = [
  {
    icon: <IconCamera className="w-6 h-6" />,
    title: "RGB - Standard Visual",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/20",
    description:
      "High-resolution visible-light photography stitched into orthomosaic maps. What you see with your eyes, but from 100-400ft with centimeter-level detail.",
    reveals: [
      "Crop stand counts and row spacing uniformity",
      "Weed pressure and bare soil exposure",
      "Physical damage from storms or pests",
      "Drainage patterns and erosion",
    ],
  },
  {
    icon: <IconTarget className="w-6 h-6" />,
    title: "Multispectral - Beyond Visible Light",
    color: "text-violet-400",
    borderColor: "border-violet-500/20",
    description:
      "Five discrete spectral bands (R, G, B, Red Edge, NIR) captured simultaneously. Each band reveals different plant tissue properties invisible to the naked eye.",
    reveals: [
      "Early stress detection 5-10 days before visible symptoms",
      "Chlorophyll concentration mapping",
      "Species differentiation in mixed plantings",
      "Soil moisture estimation from surface reflectance",
    ],
  },
  {
    icon: <IconLeaf className="w-6 h-6" />,
    title: "NDVI - Vegetation Index",
    color: "text-yellow-400",
    borderColor: "border-yellow-500/20",
    description:
      "Computed from NIR and Red bands: (NIR - Red) / (NIR + Red). Quantifies photosynthetic activity on a -1 to +1 scale. The gold standard for crop health assessment.",
    reveals: [
      "Quantified crop vigor across entire fields",
      "Variable-rate fertilizer prescription zones",
      "Yield prediction models from biomass estimation",
      "Season-over-season trend comparison",
    ],
  },
  {
    icon: <IconSun className="w-6 h-6" />,
    title: "Thermal - Heat Mapping",
    color: "text-red-400",
    borderColor: "border-red-500/20",
    description:
      "Infrared thermal radiometry measuring canopy and soil surface temperatures. Temperature differentials as small as 0.1 degrees F are detectable.",
    reveals: [
      "Water stress before wilting occurs",
      "Irrigation system malfunctions and leaks",
      "Frost pocket identification for cold protection",
      "Disease hotspots from metabolic heat changes",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  DJI T25 camera specs                                               */
/* ------------------------------------------------------------------ */

const cameraSpecs = [
  { label: "PRIMARY SENSOR", value: "1/2\" CMOS", detail: "48MP RGB" },
  { label: "MULTISPECTRAL", value: "4x 2MP", detail: "G/R/RE/NIR" },
  { label: "GSD @ 120ft", value: "1.2 cm/px", detail: "RGB mode" },
  { label: "IMAGE FORMAT", value: "JPEG + TIFF", detail: "16-bit radiometric" },
  { label: "CAPTURE RATE", value: "0.7s interval", detail: "time or distance trigger" },
  { label: "FOV", value: "84 degrees", detail: "wide-angle" },
  { label: "SPECTRAL BANDS", value: "5 bands", detail: "R, G, B, RE, NIR" },
  { label: "RADIOMETRIC CALIB", value: "YES", detail: "sunlight sensor included" },
];

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function DroneImageryPage() {
  const [activeFilter, setActiveFilter] = useState<ImageryType>("All");

  const filteredItems =
    activeFilter === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.type === activeFilter);

  return (
    <>
      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="relative bg-primary-950 overflow-hidden min-h-[55vh] flex items-center">
        <GridBackground />
        <div className="container-narrow mx-auto px-5 py-24 md:py-32 relative z-10">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Drone Imagery Gallery
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.08] text-white max-w-4xl">
              What Our Drones{" "}
              <span className="text-accent-400">See</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-5 text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed">
              Explore the imagery types captured during agricultural drone surveys.
              From standard RGB photography to thermal infrared, every pixel tells
              a story about your crop health.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-6 text-sm font-mono text-white/40">
              <span className="flex items-center gap-2">
                <IconCamera className="w-4 h-4 text-accent-400" />
                4 imagery types
              </span>
              <span className="flex items-center gap-2">
                <IconMap className="w-4 h-4 text-accent-400" />
                Sub-centimeter resolution
              </span>
              <span className="flex items-center gap-2">
                <IconBarChart className="w-4 h-4 text-accent-400" />
                Actionable analytics
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FILTER TABS + GALLERY                                       */}
      {/* ============================================================ */}
      <section className="section bg-primary-950 relative">
        <div className="container-narrow mx-auto px-5">
          {/* Filter tabs */}
          <FadeIn>
            <div className="flex flex-wrap gap-2 mb-10">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border ${
                    activeFilter === f
                      ? `${filterColors[f]} border-transparent shadow-lg`
                      : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/70"
                  }`}
                >
                  {f}
                  {f !== "All" && (
                    <span className="ml-2 text-xs opacity-60">
                      ({galleryItems.filter((i) => i.type === f).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </FadeIn>

          {/* Gallery grid */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <StaggerItem key={item.id}>
                <div className="glass-card group p-0 overflow-hidden">
                  {/* Placeholder imagery */}
                  <ImageryPlaceholder type={item.type} title={item.title} />

                  {/* Card content */}
                  <div className="p-5">
                    {/* Badge */}
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider border ${badgeColors[item.type]} mb-3`}
                    >
                      {item.type.toUpperCase()}
                    </span>

                    <h3 className="text-white font-bold text-sm leading-snug mb-2">
                      {item.title}
                    </h3>
                    <p className="text-white/50 text-xs leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-white/30">
                      <span>ALT: {item.altitude}</span>
                      <span>RES: {item.resolution}</span>
                      <span>SENSOR: {item.sensor.split(" ").pop()}</span>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {filteredItems.length === 0 && (
            <div className="text-center py-16 text-white/30 font-mono text-sm">
              No imagery found for this filter.
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  HOW IT WORKS - IMAGERY TYPE EXPLAINERS                      */}
      {/* ============================================================ */}
      <section className="section bg-primary-950 relative border-t border-white/5">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Four Ways to See Your Farm
            </h2>
            <p className="text-white/50 max-w-2xl mb-12">
              Each imagery type reveals different information about your crops.
              Together, they provide a complete picture of field health that no
              single sensor can achieve alone.
            </p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {imageryTypes.map((img) => (
              <StaggerItem key={img.title}>
                <div className={`glass-card h-full border-l-2 ${img.borderColor}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={img.color}>{img.icon}</div>
                    <h3 className="text-white font-bold text-lg">{img.title}</h3>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">
                    {img.description}
                  </p>
                  <p className="text-[10px] font-mono text-accent-400 tracking-wider uppercase mb-2">
                    What it reveals:
                  </p>
                  <ul className="space-y-1.5">
                    {img.reveals.map((r) => (
                      <li
                        key={r}
                        className="flex items-start gap-2 text-white/40 text-xs"
                      >
                        <IconCheckCircle className="w-3.5 h-3.5 text-accent-500 mt-0.5 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  DJI T25 CAMERA SPECS                                        */}
      {/* ============================================================ */}
      <section className="section bg-primary-950 relative border-t border-white/5">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">
              // Camera Capabilities
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              DJI T25 Imaging System
            </h2>
            <p className="text-white/50 max-w-2xl mb-10">
              Our DJI Agras T25 is equipped with an integrated multispectral
              imaging array that captures all four imagery types in a single flight
              pass, eliminating the need for separate survey missions.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="glass-card">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cameraSpecs.map((spec) => (
                  <div key={spec.label} className="text-center p-3">
                    <p className="text-[10px] font-mono text-white/30 tracking-wider mb-1">
                      {spec.label}
                    </p>
                    <p className="text-xl font-bold text-accent-400 font-mono">
                      {spec.value}
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">{spec.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/5">
                <div className="flex flex-wrap gap-4 justify-center">
                  {[
                    "Automatic exposure bracketing",
                    "GPS-tagged every frame",
                    "Radiometric calibration panel included",
                    "Compatible with Pix4D, DroneDeploy, OpenDroneMap",
                  ].map((feat) => (
                    <span
                      key={feat}
                      className="flex items-center gap-1.5 text-xs text-white/40"
                    >
                      <IconCheckCircle className="w-3.5 h-3.5 text-accent-500" />
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA                                                         */}
      {/* ============================================================ */}
      <section className="section bg-primary-950 relative border-t border-white/5">
        <div className="container-narrow mx-auto px-5 text-center">
          <FadeIn>
            <IconDrone className="w-10 h-10 text-accent-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              See Your Farm from a New Perspective
            </h2>
            <p className="text-white/50 max-w-xl mx-auto mb-8">
              Book a drone survey and get actionable imagery data for your fields.
              From crop health analysis to irrigation audits, we turn aerial data
              into better farm decisions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
                Book a Drone Survey
                <IconArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/services" className="btn-secondary inline-flex items-center gap-2">
                View Services
                <IconNavigation className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
