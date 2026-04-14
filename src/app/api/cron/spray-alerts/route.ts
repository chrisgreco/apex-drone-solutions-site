// GET /api/cron/spray-alerts
//
// Daily alerts dispatcher. Despite the historical path name ("spray-alerts"),
// this cron sends ALL alert types based on each subscriber's preferences:
//
//   - Frost / freeze warnings against crop-stage kill thresholds
//   - Disease pressure alerts for HIGH / EXTREME infection risk
//   - Chill-complete one-time notification (dormant season)
//   - Spray-window opportunities (>=2h GO window in next 24h)
//
// For each subscriber:
//   1. Fetch /api/crop-intel for their farm.
//   2. Evaluate candidate alerts in priority order.
//   3. Consult farm_alert_sends to skip anything we sent in the past 18 hours
//      for that same alert_type (per-type cooldown).
//   4. Send at most one email per run. Record the send.
//
// Authentication via CRON_SECRET (Authorization header for Vercel Cron, or
// ?secret= query for manual testing).

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResend, FROM_EMAIL, SITE_URL } from "@/lib/email/resend";
import {
  windowOpenEmail,
  frostWarningEmail,
  diseaseAlertEmail,
  chillCompleteEmail,
} from "@/lib/email/templates";
import { findNextGoWindow, type SprayForecast } from "@/lib/spray-decision";
import {
  CROPS,
  frostThresholdFor,
  STAGE_LABEL,
  type CropId,
  type CropStage,
} from "@/lib/farm-intel/crops";
import type { CropIntelResponse } from "@/app/api/crop-intel/route";

export const runtime = "nodejs";
export const maxDuration = 60;

// -------- Types --------

type Subscriber = {
  id: string;
  email: string;
  farm_name: string | null;
  latitude: number;
  longitude: number;
  location_label: string | null;
  unsubscribe_token: string;
  crop_primary: CropId | null;
  crop_stage: CropStage | null;
  alert_prefs: Record<string, boolean>;
};

type SendRecord = { alert_type: string; sent_at: string };

type AlertType =
  | "spray_window_open"
  | "frost_warning"
  | "disease_pressure"
  | "chill_complete";

// -------- Helpers --------

function formatLocalDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    hour: "numeric",
    timeZone: "America/New_York",
  });
}

async function fetchIntel(
  baseUrl: string,
  s: Subscriber
): Promise<CropIntelResponse | SprayForecast | null> {
  if (s.crop_primary) {
    const url = new URL("/api/crop-intel", baseUrl);
    url.searchParams.set("lat", String(s.latitude));
    url.searchParams.set("lon", String(s.longitude));
    url.searchParams.set("label", s.location_label ?? "");
    url.searchParams.set("crop", s.crop_primary);
    if (s.crop_stage) url.searchParams.set("stage", s.crop_stage);
    try {
      const res = await fetch(url.toString(), { cache: "no-store" });
      if (!res.ok) return null;
      return (await res.json()) as CropIntelResponse;
    } catch {
      return null;
    }
  }
  // Subscribers without a crop set (legacy spray-only) — fall back to forecast only
  const url = new URL("/api/spray-forecast", baseUrl);
  url.searchParams.set("lat", String(s.latitude));
  url.searchParams.set("lon", String(s.longitude));
  url.searchParams.set("label", s.location_label ?? "");
  try {
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as SprayForecast;
  } catch {
    return null;
  }
}

function getForecast(intel: CropIntelResponse | SprayForecast): SprayForecast {
  return "forecast" in intel ? intel.forecast : intel;
}

function hasRecent(sends: SendRecord[], type: AlertType, hours: number): boolean {
  const cutoff = Date.now() - hours * 3600_000;
  return sends.some((s) => s.alert_type === type && new Date(s.sent_at).getTime() >= cutoff);
}

// -------- Alert evaluators (return a ready-to-send email + metadata, or null) --------

type Candidate = {
  type: AlertType;
  subject: string;
  text: string;
  summary: Record<string, unknown>;
};

function evaluateFrost(s: Subscriber, intel: CropIntelResponse): Candidate | null {
  if (!s.alert_prefs.frost) return null;
  if (!s.crop_primary) return null;

  const next24 = intel.forecast.hourly.slice(0, 24);
  if (next24.length === 0) return null;
  const minHour = next24.reduce((min, h) => (h.tempF < min.tempF ? h : min));

  const stage = s.crop_stage ?? CROPS[s.crop_primary].stages[0];
  const t = frostThresholdFor(s.crop_primary, stage);
  if (!t) return null;
  if (minHour.tempF > t.damageF) return null;

  const { subject, text } = frostWarningEmail({
    unsubscribeToken: s.unsubscribe_token,
    farmName: s.farm_name,
    locationLabel: s.location_label ?? `${s.latitude.toFixed(2)}, ${s.longitude.toFixed(2)}`,
    cropName: CROPS[s.crop_primary].name,
    stageLabel: STAGE_LABEL[stage],
    minF: minHour.tempF,
    killF: t.killF,
    damageF: t.damageF,
    whenLocal: formatLocalDateTime(minHour.time),
  });

  return {
    type: "frost_warning",
    subject,
    text,
    summary: {
      min_f: minHour.tempF,
      when: minHour.time,
      damage_f: t.damageF,
      kill_f: t.killF,
      stage,
    },
  };
}

function evaluateDisease(s: Subscriber, intel: CropIntelResponse): Candidate | null {
  if (!s.alert_prefs.disease) return null;
  if (!("diseases" in intel)) return null;
  const hit = intel.diseases.find((d) => d.risk === "high" || d.risk === "extreme");
  if (!hit) return null;

  const { subject, text } = diseaseAlertEmail({
    unsubscribeToken: s.unsubscribe_token,
    farmName: s.farm_name,
    locationLabel: s.location_label ?? `${s.latitude.toFixed(2)}, ${s.longitude.toFixed(2)}`,
    diseaseName: hit.name,
    riskLabel: hit.risk.toUpperCase(),
    headline: hit.headline,
    detail: hit.detail,
    recommendation: hit.recommendation,
    eventStartLocal: hit.nextEvent ? formatLocalDateTime(hit.nextEvent.startIso) : null,
    eventWetHours: hit.nextEvent?.wetHours ?? null,
    eventAvgTempF: hit.nextEvent?.avgTempF ?? null,
  });

  return {
    type: "disease_pressure",
    subject,
    text,
    summary: {
      disease: hit.disease,
      risk: hit.risk,
      event_start: hit.nextEvent?.startIso ?? null,
    },
  };
}

function evaluateChill(s: Subscriber, intel: CropIntelResponse): Candidate | null {
  if (!s.alert_prefs.chill) return null;
  if (!s.crop_primary) return null;
  const chill = intel.chill;
  if (!chill) return null;
  if (!chill.bloomPrediction.chillComplete) return null;
  // Only fire right around completion (within 80h over) to avoid stale
  const over = chill.hours - chill.chillRequired;
  if (over < 0 || over > 80) return null;

  const { subject, text } = chillCompleteEmail({
    unsubscribeToken: s.unsubscribe_token,
    farmName: s.farm_name,
    locationLabel: s.location_label ?? `${s.latitude.toFixed(2)}, ${s.longitude.toFixed(2)}`,
    cropName: CROPS[s.crop_primary].name,
    variety: chill.variety,
    hoursAccumulated: chill.hours,
    hoursRequired: chill.chillRequired,
    bloomDate: chill.bloomPrediction.date,
  });

  return {
    type: "chill_complete",
    subject,
    text,
    summary: { hours: chill.hours, required: chill.chillRequired, variety: chill.variety },
  };
}

function evaluateSprayWindow(
  s: Subscriber,
  intel: CropIntelResponse | SprayForecast
): Candidate | null {
  if (!s.alert_prefs.spray_window) return null;
  const forecast = getForecast(intel);
  const next24 = forecast.hourly.slice(0, 24);
  const window = findNextGoWindow(next24, 2);
  if (!window) return null;
  const startHour = next24[window.startIdx];
  const endHour = next24[window.endIdx];
  const avgWind =
    next24.slice(window.startIdx, window.endIdx + 1).reduce((acc, h) => acc + h.windMph, 0) /
    window.hours;

  const { subject, text } = windowOpenEmail({
    unsubscribeToken: s.unsubscribe_token,
    farmName: s.farm_name,
    locationLabel:
      s.location_label ?? `${s.latitude.toFixed(2)}, ${s.longitude.toFixed(2)}`,
    windowStart: formatLocalDateTime(startHour.time),
    windowEnd: formatLocalDateTime(endHour.time),
    windowHours: window.hours,
    summary: `Avg wind ${avgWind.toFixed(0)} mph, ${
      startHour.shortForecast.toLowerCase() || "clear"
    }`,
  });

  return {
    type: "spray_window_open",
    subject,
    text,
    summary: {
      start: startHour.time,
      end: endHour.time,
      hours: window.hours,
      avg_wind_mph: avgWind,
    },
  };
}

// Priority order: safety first, then profit, then opportunity.
const EVALUATORS: Array<
  (s: Subscriber, intel: CropIntelResponse | SprayForecast) => Candidate | null
> = [
  (s, i) => ("diseases" in i ? evaluateFrost(s, i) : null),
  (s, i) => ("diseases" in i ? evaluateDisease(s, i) : null),
  (s, i) => ("diseases" in i ? evaluateChill(s, i) : null),
  (s, i) => evaluateSprayWindow(s, i),
];

// Per-type cooldowns in hours
const COOLDOWN_HOURS: Record<AlertType, number> = {
  frost_warning: 18,
  disease_pressure: 72, // don't hammer repeatedly for same outbreak
  chill_complete: 24 * 365, // effectively one-shot per season
  spray_window_open: 20,
};

// -------- Route --------

export async function GET(req: Request) {
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
    .from("farm_profiles")
    .select(
      "id, email, farm_name, latitude, longitude, location_label, unsubscribe_token, crop_primary, crop_stage, alert_prefs"
    )
    .eq("confirmed", true)
    .is("unsubscribed_at", null);

  if (error) {
    console.error("[cron] fetch subscribers failed", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  const subscribers = (subs ?? []) as Subscriber[];
  const baseUrl = url.origin;
  const results: Array<{ id: string; action: string; detail?: string }> = [];

  for (const s of subscribers) {
    // Look up the last 3 days of sends for this subscriber (cheap enough at our scale).
    const { data: sendRows } = await supabase
      .from("farm_alert_sends")
      .select("alert_type, sent_at")
      .eq("farm_profile_id", s.id)
      .gte("sent_at", new Date(Date.now() - 3 * 24 * 3600_000).toISOString());
    const sends = (sendRows ?? []) as SendRecord[];

    const intel = await fetchIntel(baseUrl, s);
    if (!intel) {
      results.push({ id: s.id, action: "skip", detail: "no_intel" });
      continue;
    }

    // Walk evaluators; send the first matching one not on cooldown.
    let sent = false;
    for (const evaluate of EVALUATORS) {
      const candidate = evaluate(s, intel);
      if (!candidate) continue;
      if (hasRecent(sends, candidate.type, COOLDOWN_HOURS[candidate.type])) {
        continue;
      }

      try {
        const sendResult = await getResend().emails.send({
          from: FROM_EMAIL,
          to: s.email,
          subject: candidate.subject,
          text: candidate.text,
          headers: {
            "List-Unsubscribe": `<${SITE_URL}/api/spray-alerts/unsubscribe?token=${s.unsubscribe_token}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        });

        await supabase.from("farm_alert_sends").insert({
          farm_profile_id: s.id,
          alert_type: candidate.type,
          forecast_summary: candidate.summary,
          resend_message_id: sendResult.data?.id ?? null,
        });

        await supabase
          .from("farm_profiles")
          .update({
            last_alert_sent_at: new Date().toISOString(),
          })
          .eq("id", s.id);

        results.push({ id: s.id, action: "sent", detail: candidate.type });
        sent = true;
        break;
      } catch (e) {
        console.error("[cron] send failed", s.id, candidate.type, e);
        results.push({ id: s.id, action: "error", detail: String(e) });
        break;
      }
    }
    if (!sent && results[results.length - 1]?.id !== s.id) {
      results.push({ id: s.id, action: "nothing_to_send" });
    }
  }

  return NextResponse.json({
    ok: true,
    checked: subscribers.length,
    sent: results.filter((r) => r.action === "sent").length,
    details: results,
  });
}
