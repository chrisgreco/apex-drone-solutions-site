// POST /api/spray-alerts/subscribe
//
// Public endpoint — anon Supabase client can insert into spray_alert_subscribers
// via RLS policy. We then send a confirmation email via Resend.

import { NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { getResend, FROM_EMAIL } from "@/lib/email/resend";
import { confirmationEmail } from "@/lib/email/templates";

export const runtime = "nodejs";

const Body = z.object({
  email: z.string().email().max(320),
  farmName: z.string().max(120).nullable().optional(),
  lat: z.number().gte(-90).lte(90),
  lon: z.number().gte(-180).lte(180),
  label: z.string().max(200),
});

export async function POST(req: Request) {
  let parsed: z.infer<typeof Body>;
  try {
    const json = await req.json();
    parsed = Body.parse(json);
  } catch {
    return NextResponse.json(
      { error: "Invalid request — email, lat, lon, and label are required." },
      { status: 400 }
    );
  }

  const confirmationToken = randomBytes(24).toString("hex");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("farm_profiles")
    .insert({
      email: parsed.email.toLowerCase(),
      farm_name: parsed.farmName ?? null,
      latitude: parsed.lat,
      longitude: parsed.lon,
      location_label: parsed.label,
      confirmation_token: confirmationToken,
      source: "spray-today",
    })
    .select("id, confirmation_token")
    .single();

  if (error) {
    // Unique-index violation when the email is already subscribed
    if (error.code === "23505") {
      return NextResponse.json(
        {
          error:
            "That email is already on the list. Check your inbox for the confirmation link, or contact us if you need to update your location.",
        },
        { status: 409 }
      );
    }
    console.error("[subscribe] insert failed", error);
    return NextResponse.json(
      { error: "Couldn't save your subscription. Please try again." },
      { status: 500 }
    );
  }

  // Send confirmation email. Failure here is non-fatal to the user — we log and
  // still return success so they know they're signed up.
  try {
    const { subject, text } = confirmationEmail({
      token: data.confirmation_token ?? confirmationToken,
      farmName: parsed.farmName ?? null,
      locationLabel: parsed.label,
    });
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: parsed.email,
      subject,
      text,
    });
  } catch (e) {
    console.error("[subscribe] email send failed", e);
  }

  return NextResponse.json({ ok: true });
}
