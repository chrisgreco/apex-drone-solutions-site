// src/app/api/tfrs/route.ts

import { NextResponse } from "next/server";
import { fetchRegionalTfrs } from "@/lib/tfrs";

export const revalidate = 600; // 10 minutes

export async function GET() {
  const tfrs = await fetchRegionalTfrs(["NJ", "PA", "DE", "NY"]);

  return NextResponse.json({
    tfrs,
    count: tfrs.length,
    lastChecked: new Date().toISOString(),
  });
}
