// src/app/api/drought/route.ts

import { NextResponse } from "next/server";
import { fetchRegionalDrought } from "@/lib/drought";

export const revalidate = 86400; // 24 hours — USDM updates weekly

export async function GET() {
  const states = await fetchRegionalDrought();

  return NextResponse.json({
    states,
    lastChecked: new Date().toISOString(),
  });
}
