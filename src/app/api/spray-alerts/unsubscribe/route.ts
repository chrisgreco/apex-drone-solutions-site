// GET /api/spray-alerts/unsubscribe?token=...
//
// One-click unsubscribe link in every alert email.
// No login required — the random 24-byte token in the URL is the credential.

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/resources/spray-today?alert=invalid", url.origin));
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("spray_alert_subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .is("unsubscribed_at", null)
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.redirect(new URL("/resources/spray-today?alert=invalid", url.origin));
  }

  return NextResponse.redirect(new URL("/resources/spray-today?alert=unsubscribed", url.origin));
}
