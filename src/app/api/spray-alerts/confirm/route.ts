// GET /api/spray-alerts/confirm?token=...
//
// Clicked from the confirmation email. Uses service_role to flip
// `confirmed = true` on the matching subscriber, then redirects to a friendly page.

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
    .update({
      confirmed: true,
      confirmed_at: new Date().toISOString(),
      confirmation_token: null,
    })
    .eq("confirmation_token", token)
    .is("unsubscribed_at", null)
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.redirect(new URL("/resources/spray-today?alert=invalid", url.origin));
  }

  return NextResponse.redirect(new URL("/resources/spray-today?alert=confirmed", url.origin));
}
