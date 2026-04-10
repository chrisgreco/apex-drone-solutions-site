// src/app/api/conditions/route.ts

import { NextResponse } from "next/server";
import {
  NJ_BBOX,
  EONET_CATEGORIES,
  normalizeEvents,
  type EonetResponse,
  type ConditionEvent,
} from "@/lib/eonet";

export const revalidate = 900; // 15 minutes

export async function GET() {
  try {
    const url = new URL("https://eonet.gsfc.nasa.gov/api/v3/events");
    url.searchParams.set("status", "open");
    url.searchParams.set("category", EONET_CATEGORIES);
    url.searchParams.set(
      "bbox",
      `${NJ_BBOX.west},${NJ_BBOX.south},${NJ_BBOX.east},${NJ_BBOX.north}`
    );

    const res = await fetch(url.toString(), { next: { revalidate: 900 } });

    if (!res.ok) {
      return NextResponse.json(
        { events: [], error: "EONET API unavailable", lastChecked: new Date().toISOString() },
        { status: 200 }
      );
    }

    const data: EonetResponse = await res.json();
    const events: ConditionEvent[] = normalizeEvents(data);

    return NextResponse.json({
      events,
      lastChecked: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { events: [], error: "Failed to fetch conditions", lastChecked: new Date().toISOString() },
      { status: 200 }
    );
  }
}
