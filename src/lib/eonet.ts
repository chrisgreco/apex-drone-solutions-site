// src/lib/eonet.ts

// ─── Types ──────────────────────────────────────────────────

export interface EonetGeometry {
  magnitudeValue: number | null;
  magnitudeUnit: string | null;
  date: string;
  type: "Point" | "Polygon";
  coordinates: [number, number] | [number, number][];
}

export interface EonetCategory {
  id: string;
  title: string;
}

export interface EonetEvent {
  id: string;
  title: string;
  description: string | null;
  link: string;
  closed: string | null;
  categories: EonetCategory[];
  geometry: EonetGeometry[];
}

export interface EonetResponse {
  title: string;
  description: string;
  events: EonetEvent[];
}

// Normalized event for our UI
export interface ConditionEvent {
  id: string;
  title: string;
  description: string | null;
  category: string;
  coordinates: [number, number]; // [lng, lat]
  magnitude: number | null;
  magnitudeUnit: string | null;
  date: string;
  link: string;
}

// ─── Category Config ────────────────────────────────────────

export const CATEGORY_CONFIG: Record<
  string,
  { label: string; color: string; glow: string; cta: string }
> = {
  severeStorms: {
    label: "Severe Storm",
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.5)",
    cta: "Schedule Post-Storm Assessment",
  },
  floods: {
    label: "Flood",
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.5)",
    cta: "Request Drainage & Field Survey",
  },
  wildfires: {
    label: "Wildfire",
    color: "#ef4444",
    glow: "rgba(239,68,68,0.5)",
    cta: "Request Smoke Impact Survey",
  },
  drought: {
    label: "Drought",
    color: "#fbbf24",
    glow: "rgba(251,191,36,0.5)",
    cta: "Book Crop Stress Survey",
  },
  tempExtremes: {
    label: "Temperature Extreme",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.5)",
    cta: "Schedule Frost/Heat Damage Assessment",
  },
};

// NJ bounding box (with buffer)
export const NJ_BBOX = {
  west: -75.6,
  south: 38.9,
  east: -73.9,
  north: 41.4,
};

export const EONET_CATEGORIES = Object.keys(CATEGORY_CONFIG).join(",");

// ─── Fetch Helper ───────────────────────────────────────────

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
}

export function normalizeEvents(data: EonetResponse): ConditionEvent[] {
  return data.events
    .filter((e) => e.geometry.length > 0)
    .map((e) => {
      const latest = e.geometry[e.geometry.length - 1];
      const coords: [number, number] =
        latest.type === "Point"
          ? (latest.coordinates as [number, number])
          : (latest.coordinates as [number, number][])[0];

      return {
        id: e.id,
        title: decodeHtmlEntities(e.title),
        description: e.description ? decodeHtmlEntities(e.description) : null,
        category: e.categories[0]?.id ?? "unknown",
        coordinates: coords,
        magnitude: latest.magnitudeValue,
        magnitudeUnit: latest.magnitudeUnit,
        date: latest.date,
        link: e.link,
      };
    });
}
