// GET /api/cron/spray-alerts
//
// Vercel Cron entrypoint — runs daily at 5 AM ET (see vercel.json).
// For each confirmed subscriber, fetch the next 24h forecast, find the next
// GO window of ≥ 2 hours, and email them if one exists.
//
// Authenticated by CRON_SECRET — Vercel sends it in the Authorization header.

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResend, FROM_EMAIL, SITE_URL } from "@/lib/email/resend";
import { windowOpenEmail } from "@/lib/email/templates";
import { findNextGoWindow, type SprayForecast } from "@/lib/spray-decision";

export const runtime = "nodejs";
export const maxDuration = 60;

type Subscriber = {
  id: string;
  email: string;
  farm_name: string | null;
  latitude: number;
  longitude: number;
  location_label: string | null;
  unsubscribe_token: string;
  last_alert_sent_at: string | null;
  alerts_sent_count: number;
};

function formatWindowTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    hour: "numeric",
    timeZone: "America/New_York",
  });
}

async function fetchForecast(
  baseUrl: string,
  lat: number,
  lon: number,
  label: string
): Promise<SprayForecast | null> {
  const url = new URL("/api/spray-forecast", baseUrl);
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("label", label);
  try {
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as SprayForecast;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  // Auth: Vercel Cron sends "Authorization: Bearer <CRON_SECRET>".
  // Allow local manual triggers with ?secret=<CRON_SECRET> for testing.
  const authHeader = req.headers.get("authorization") ?? "";
  const url = new URL(req.url);
  const querySecret = url.searchParams.get("secret");
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  if (authHeader !== `Bearer ${expected}` && querySecret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: subs, error } = await supabase
    .from("spray_alert_subscribers")
    .select(
      "id, email, farm_name, latitude, longitude, location_label, unsubscribe_token, last_alert_sent_at, alerts_sent_count"
    )
    .eq("confirmed", true)
    .is("unsubscribed_at", null);

  if (error) {
    console.error("[cron/spray-alerts] fetch subscribers failed", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  const baseUrl = url.origin;
  const subscribers = (subs ?? []) as Subscriber[];
  const results: Array<{ id: string; status: string; reason?: string }> = [];

  for (const s of subscribers) {
    // Rate limit: don't email the same subscriber more than once per 20 hours.
    if (s.last_alert_sent_at) {
      const hoursSince =
        (Date.now() - new Date(s.last_alert_sent_at).getTime()) / (1000 * 60 * 60);
      if (hoursSince < 20) {
        results.push({ id: s.id, status: "skipped", reason: "recent_alert" });
        continue;
      }
    }

    const forecast = await fetchForecast(
      baseUrl,
      s.latitude,
      s.longitude,
      s.location_label ?? ""
    );
    if (!forecast) {
      results.push({ id: s.id, status: "skipped", reason: "no_forecast" });
      continue;
    }

    // Only look at the next 24 hours
    const next24 = forecast.hourly.slice(0, 24);
    const window = findNextGoWindow(next24, 2);
    if (!window) {
      results.push({ id: s.id, status: "no_window" });
      continue;
    }

    const startHour = next24[window.startIdx];
    const endHour = next24[window.endIdx];
    const avgWind =
      next24
        .slice(window.startIdx, window.endIdx + 1)
        .reduce((acc, h) => acc + h.windMph, 0) / window.hours;

    const summary = `Avg wind ${avgWind.toFixed(0)} mph, ${startHour.shortForecast.toLowerCase() || "clear"}`;

    const { subject, text } = windowOpenEmail({
      unsubscribeToken: s.unsubscribe_token,
      farmName: s.farm_name,
      locationLabel: s.location_label ?? `${s.latitude.toFixed(2)}, ${s.longitude.toFixed(2)}`,
      windowStart: formatWindowTime(startHour.time),
      windowEnd: formatWindowTime(endHour.time),
      windowHours: window.hours,
      summary,
    });

    try {
      const sendResult = await getResend().emails.send({
        from: FROM_EMAIL,
        to: s.email,
        subject,
        text,
        headers: {
          "List-Unsubscribe": `<${SITE_URL}/api/spray-alerts/unsubscribe?token=${s.unsubscribe_token}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });

      await supabase
        .from("spray_alert_subscribers")
        .update({
          last_alert_sent_at: new Date().toISOString(),
          alerts_sent_count: s.alerts_sent_count + 1,
        })
        .eq("id", s.id);

      await supabase.from("spray_alert_sends").insert({
        subscriber_id: s.id,
        alert_type: "window_open",
        forecast_summary: {
          window_hours: window.hours,
          start: startHour.time,
          end: endHour.time,
          avg_wind_mph: avgWind,
        },
        resend_message_id: sendResult.data?.id ?? null,
      });

      results.push({ id: s.id, status: "sent" });
    } catch (e) {
      console.error("[cron/spray-alerts] send failed", s.id, e);
      results.push({ id: s.id, status: "failed", reason: String(e) });
    }
  }

  return NextResponse.json({
    ok: true,
    checked: subscribers.length,
    sent: results.filter((r) => r.status === "sent").length,
    skipped: results.filter((r) => r.status !== "sent").length,
    results,
  });
}
