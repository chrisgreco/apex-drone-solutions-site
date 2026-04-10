// src/app/api/conditions/route.ts

import { NextResponse } from "next/server";
import {
  REGION_BBOX,
  EONET_CATEGORIES,
  normalizeEvents,
  type EonetResponse,
  type ConditionEvent,
} from "@/lib/eonet";
import { fetchNwsAlerts } from "@/lib/weather-alerts";

export const revalidate = 300; // 5 minutes (NWS updates frequently)

async function fetchEonetEvents(): Promise<ConditionEvent[]> {
  try {
    const url = new URL("https://eonet.gsfc.nasa.gov/api/v3/events");
    url.searchParams.set("status", "open");
    url.searchParams.set("category", EONET_CATEGORIES);
    url.searchParams.set(
      "bbox",
      `${REGION_BBOX.west},${REGION_BBOX.south},${REGION_BBOX.east},${REGION_BBOX.north}`
    );

    const res = await fetch(url.toString(), { next: { revalidate: 900 } });
    if (!res.ok) return [];

    const data: EonetResponse = await res.json();
    const allEvents = normalizeEvents(data);

    // Only show events from the last 30 days — EONET keeps stale "open" events
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return allEvents.filter((e) => new Date(e.date).getTime() > thirtyDaysAgo);
  } catch {
    return [];
  }
}

export async function GET() {
  // Fetch EONET and NWS in parallel — neither blocks the other
  const [eonetEvents, nwsEvents] = await Promise.all([
    fetchEonetEvents(),
    fetchNwsAlerts(["NJ", "PA", "DE", "NY"]).catch(() => []),
  ]);

  // Merge, sort by date (newest first)
  const events = [...eonetEvents, ...nwsEvents].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return NextResponse.json({
    events,
    sources: {
      eonet: eonetEvents.length,
      nws: nwsEvents.length,
    },
    lastChecked: new Date().toISOString(),
  });
}
