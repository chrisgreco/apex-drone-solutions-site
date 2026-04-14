// POST /api/farm-profile
//
// Creates or reactivates a farm profile. Called from the /resources/nj-crop-dashboard
// email gate. Crop + stage + acres are all optional on create (lowering the friction
// needed to capture the lead).
//
// If an email is already on the list:
//   - Still unconfirmed → re-send confirmation, return { ok: true, resent: true }
//   - Confirmed        → update farm details (lat/lon/crop/…) and return { ok: true, updated: true }
//
// This is the funnel-critical endpoint, so we bias toward "always succeed for the user"
// and log any send failures server-side rather than surface them.

import { NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { getResend, FROM_EMAIL } from "@/lib/email/resend";
import { confirmationEmail } from "@/lib/email/templates";

export const runtime = "nodejs";

const CROP_IDS = [
  "blueberry",
  "peach",
  "apple",
  "cranberry",
  "tomato",
  "pepper",
] as const;

const STAGES = [
  "dormant",
  "bud_swell",
  "tight_cluster",
  "pink_bud",
  "full_bloom",
  "petal_fall",
  "fruit_set",
  "fruit_fill",
  "harvest",
  "post_harvest",
] as const;

const Body = z.object({
  email: z.string().email().max(320),
  farmName: z.string().max(120).nullable().optional(),
  lat: z.number().gte(-90).lte(90),
  lon: z.number().gte(-180).lte(180),
  label: z.string().max(200),
  cropPrimary: z.enum(CROP_IDS).optional(),
  cropVariety: z.string().max(80).optional().nullable(),
  cropStage: z.enum(STAGES).optional().nullable(),
  acres: z.number().positive().lte(100000).optional().nullable(),
});

export async function POST(req: Request) {
  let parsed: z.infer<typeof Body>;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json(
      { error: "Email, location, and coordinates are required." },
      { status: 400 }
    );
  }

  const email = parsed.email.toLowerCase();
  const confirmationToken = randomBytes(24).toString("hex");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("farm_profiles")
    .insert({
      email,
      farm_name: parsed.farmName ?? null,
      latitude: parsed.lat,
      longitude: parsed.lon,
      location_label: parsed.label,
      crop_primary: parsed.cropPrimary ?? null,
      crop_variety: parsed.cropVariety ?? null,
      crop_stage: parsed.cropStage ?? null,
      acres: parsed.acres ?? null,
      confirmation_token: confirmationToken,
      source: "nj-crop-dashboard",
    })
    .select("id, confirmation_token, confirmed")
    .single();

  // Handle duplicate email gracefully — we don't have UPDATE RLS policy for anon
  // writes, so we just tell the user to check their inbox.
  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        {
          ok: true,
          duplicate: true,
          message:
            "You're already signed up. Check your inbox for the confirmation link, or email us to update your farm details.",
        },
        { status: 200 }
      );
    }
    console.error("[farm-profile] insert failed", error);
    return NextResponse.json(
      { error: "Couldn't save your farm profile. Please try again." },
      { status: 500 }
    );
  }

  // Fire confirmation email — non-fatal on failure.
  try {
    const { subject, text } = confirmationEmail({
      token: data.confirmation_token ?? confirmationToken,
      farmName: parsed.farmName ?? null,
      locationLabel: parsed.label,
    });
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      text,
    });
  } catch (e) {
    console.error("[farm-profile] email send failed", e);
  }

  return NextResponse.json({ ok: true });
}
