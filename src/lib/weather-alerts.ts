// src/lib/weather-alerts.ts
//
// NOAA National Weather Service alerts API
// https://api.weather.gov/alerts/active?area=NJ,PA,DE,NY
// Free, no API key required. Returns GeoJSON.

import type { ConditionEvent } from "./eonet";

// ─── Types ──────────────────────────────────────────────────

export interface NwsAlertFeature {
  id: string;
  type: "Feature";
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  } | null;
  properties: {
    id: string;
    event: string; // e.g. "Tornado Warning", "Flood Warning", "Frost Advisory"
    severity: "Minor" | "Moderate" | "Severe" | "Extreme" | "Unknown";
    urgency: "Immediate" | "Expected" | "Future" | "Past" | "Unknown";
    headline: string;
    description: string;
    areaDesc: string;
    effective: string;
    onset: string | null;
    expires: string;
    ends: string | null;
    senderName: string;
  };
}

export interface NwsAlertsResponse {
  type: "FeatureCollection";
  features: NwsAlertFeature[];
}

// ─── Event → Category Mapping ───────────────────────────────
//
// Maps NWS event names to our existing category config keys.
// Events not in this map fall through to a generic "weatherAlert" category.

const EVENT_CATEGORY_MAP: Record<string, string> = {
  // Severe storms
  "Tornado Warning": "severeStorms",
  "Tornado Watch": "severeStorms",
  "Severe Thunderstorm Warning": "severeStorms",
  "Severe Thunderstorm Watch": "severeStorms",
  "Hurricane Warning": "severeStorms",
  "Hurricane Watch": "severeStorms",
  "Tropical Storm Warning": "severeStorms",
  "Tropical Storm Watch": "severeStorms",
  "High Wind Warning": "severeStorms",
  "High Wind Watch": "severeStorms",
  "Wind Advisory": "severeStorms",
  "Winter Storm Warning": "severeStorms",
  "Blizzard Warning": "severeStorms",

  // Floods
  "Flood Warning": "floods",
  "Flood Watch": "floods",
  "Flash Flood Warning": "floods",
  "Flash Flood Watch": "floods",
  "Coastal Flood Warning": "floods",
  "Coastal Flood Watch": "floods",
  "Coastal Flood Advisory": "floods",
  "River Flood Warning": "floods",
  "Areal Flood Warning": "floods",

  // Wildfires
  "Fire Warning": "wildfires",
  "Red Flag Warning": "wildfires",
  "Fire Weather Watch": "wildfires",

  // Temperature extremes
  "Excessive Heat Warning": "tempExtremes",
  "Heat Advisory": "tempExtremes",
  "Freeze Warning": "tempExtremes",
  "Frost Advisory": "tempExtremes",
  "Hard Freeze Warning": "tempExtremes",
  "Wind Chill Warning": "tempExtremes",
  "Wind Chill Advisory": "tempExtremes",
  "Extreme Cold Warning": "tempExtremes",
};

function categorizeEvent(event: string): string {
  return EVENT_CATEGORY_MAP[event] ?? "weatherAlert";
}

// ─── Geometry Extraction ────────────────────────────────────
//
// NWS features can be Polygon or MultiPolygon. We need a representative
// point [lng, lat] for map markers.

function extractCentroid(
  geometry: NwsAlertFeature["geometry"]
): [number, number] | null {
  if (!geometry) return null;

  let ring: number[][];
  if (geometry.type === "Polygon") {
    ring = (geometry.coordinates as number[][][])[0];
  } else {
    // MultiPolygon — use first polygon's outer ring
    ring = (geometry.coordinates as number[][][][])[0][0];
  }

  if (!ring || ring.length === 0) return null;

  // Simple centroid of outer ring
  let sumLng = 0;
  let sumLat = 0;
  for (const [lng, lat] of ring) {
    sumLng += lng;
    sumLat += lat;
  }
  return [sumLng / ring.length, sumLat / ring.length];
}

// ─── Normalizer ─────────────────────────────────────────────

export function normalizeNwsAlerts(
  data: NwsAlertsResponse
): ConditionEvent[] {
  const events: ConditionEvent[] = [];
  for (const f of data.features) {
    const props = f.properties;
    const coords = extractCentroid(f.geometry);
    if (!coords) continue;

    events.push({
      source: "nws",
      id: props.id,
      title: `${props.event} — ${props.areaDesc.split(";")[0].trim()}`,
      description: props.headline,
      category: categorizeEvent(props.event),
      coordinates: coords,
      magnitude: null,
      magnitudeUnit: null,
      date: props.effective,
      link: `https://api.weather.gov/alerts/${encodeURIComponent(props.id)}`,
      severity: props.severity,
      areaDesc: props.areaDesc,
      expires: props.expires,
    });
  }
  return events;
}

// ─── Fetch ──────────────────────────────────────────────────

export async function fetchNwsAlerts(
  states: string[] = ["NJ", "PA", "DE", "NY"]
): Promise<ConditionEvent[]> {
  const url = `https://api.weather.gov/alerts/active?area=${states.join(",")}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "agdronesnj.com (info@agdronesnj.com)",
      Accept: "application/geo+json",
    },
    next: { revalidate: 300 }, // 5 minutes — NWS updates frequently
  });

  if (!res.ok) return [];

  const data: NwsAlertsResponse = await res.json();
  return normalizeNwsAlerts(data);
}
