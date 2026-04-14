// GET  /api/alert-preferences?token=...  → { email, farm_name, location_label, crop_primary, alert_prefs }
// PATCH /api/alert-preferences          body: { token, alert_prefs }
//
// Token auth uses the unsubscribe_token already on every farm_profiles row.
// No login needed — it's a 48-byte random hex token that only the subscriber
// sees (delivered via email). Same pattern as one-click unsubscribe links.

import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const PrefsSchema = z
  .object({
    spray_window: z.boolean().optional(),
    frost: z.boolean().optional(),
    disease: z.boolean().optional(),
    chill: z.boolean().optional(),
    pollination: z.boolean().optional(),
  })
  .passthrough();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("farm_profiles")
    .select(
      "email, farm_name, location_label, crop_primary, crop_variety, crop_stage, acres, alert_prefs, confirmed, unsubscribed_at"
    )
    .eq("unsubscribe_token", token)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }
  if (data.unsubscribed_at) {
    return NextResponse.json({ error: "Unsubscribed" }, { status: 410 });
  }

  return NextResponse.json(data);
}

export async function PATCH(req: Request) {
  let body: { token?: unknown; alert_prefs?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const token = typeof body.token === "string" ? body.token : null;
  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  let prefs: z.infer<typeof PrefsSchema>;
  try {
    prefs = PrefsSchema.parse(body.alert_prefs ?? {});
  } catch {
    return NextResponse.json({ error: "Invalid alert_prefs" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("farm_profiles")
    .update({ alert_prefs: prefs })
    .eq("unsubscribe_token", token)
    .is("unsubscribed_at", null)
    .select("id, alert_prefs")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, alert_prefs: data.alert_prefs });
}
