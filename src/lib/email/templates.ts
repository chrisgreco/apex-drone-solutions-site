/**
 * Plain-text email templates for spray alerts.
 * Plain text is intentional: high deliverability, no HTML rendering issues
 * across farmer email clients (lots of AOL / legacy Outlook still out there).
 */

import { SITE_URL } from "./resend";

export function confirmationEmail(opts: {
  token: string;
  farmName: string | null;
  locationLabel: string;
}) {
  const confirmUrl = `${SITE_URL}/api/spray-alerts/confirm?token=${opts.token}`;
  const farm = opts.farmName ? ` for ${opts.farmName}` : "";
  const subject = "Confirm your AG Drones NJ spray alerts";
  const text = `Thanks for signing up for spray alerts${farm}.

Confirm your email to start receiving daily forecasts for ${opts.locationLabel}:

${confirmUrl}

If you didn't sign up, just ignore this email — you won't hear from us again.

— AG Drones NJ
${SITE_URL}
`;
  return { subject, text };
}

/**
 * Shared footer + header builder so every alert email has the same
 * unsubscribe and manage-preferences links.
 */
function alertFooter(unsubscribeToken: string): string {
  return `\n—\nManage alerts: ${SITE_URL}/resources/alert-preferences?token=${unsubscribeToken}\nUnsubscribe: ${SITE_URL}/api/spray-alerts/unsubscribe?token=${unsubscribeToken}\n`;
}

export function windowOpenEmail(opts: {
  unsubscribeToken: string;
  farmName: string | null;
  locationLabel: string;
  windowStart: string;
  windowEnd: string;
  windowHours: number;
  summary: string;
}) {
  const sprayUrl = `${SITE_URL}/resources/spray-today`;
  const farm = opts.farmName ? ` at ${opts.farmName}` : "";
  const subject = `Spray window opens ${opts.windowStart}${farm}`;

  const text = `Good spray conditions are forecast${farm} (${opts.locationLabel}):

Window:  ${opts.windowStart} – ${opts.windowEnd}
Length:  ${opts.windowHours} hours
Summary: ${opts.summary}

See the full forecast and hour-by-hour conditions:
${sprayUrl}

Book a drone spray with us while the window is open — reply to this email or call.

— AG Drones NJ
${SITE_URL}
${alertFooter(opts.unsubscribeToken)}`;
  return { subject, text };
}

export function frostWarningEmail(opts: {
  unsubscribeToken: string;
  farmName: string | null;
  locationLabel: string;
  cropName: string;
  stageLabel: string;
  minF: number;
  killF: number;
  damageF: number;
  whenLocal: string;
}) {
  const farm = opts.farmName ? ` at ${opts.farmName}` : "";
  const severity = opts.minF <= opts.killF ? "FREEZE KILL" : "Frost damage";
  const subject = `${severity} risk tonight${farm} — ${Math.round(opts.minF)}°F`;
  const text = `Frost warning for ${opts.locationLabel}${farm}:

Forecast low:     ${Math.round(opts.minF)}°F at ${opts.whenLocal}
Crop / stage:     ${opts.cropName} · ${opts.stageLabel}
Damage threshold: ${opts.damageF}°F
Kill threshold:   ${opts.killF}°F

${
  opts.minF <= opts.killF
    ? "This is below the kill point for your stage. Run wind machines, overhead irrigation, or orchard heaters if you have them. Consider harvesting any market-ready fruit tonight."
    : "This is below the damage point for your stage. Monitor closely and prepare frost protection."
}

Full 7-day forecast: ${SITE_URL}/resources/frost-watch

— AG Drones NJ
${SITE_URL}
${alertFooter(opts.unsubscribeToken)}`;
  return { subject, text };
}

export function diseaseAlertEmail(opts: {
  unsubscribeToken: string;
  farmName: string | null;
  locationLabel: string;
  diseaseName: string;
  riskLabel: string;
  headline: string;
  detail: string;
  recommendation: string;
  eventStartLocal: string | null;
  eventWetHours: number | null;
  eventAvgTempF: number | null;
}) {
  const farm = opts.farmName ? ` at ${opts.farmName}` : "";
  const subject = `${opts.diseaseName} risk ${opts.riskLabel}${farm}`;
  const eventBlock =
    opts.eventStartLocal && opts.eventWetHours && opts.eventAvgTempF
      ? `Predicted infection event: ${opts.eventStartLocal}\nConditions: ${opts.eventWetHours}h leaf wetness @ ${Math.round(opts.eventAvgTempF)}°F avg\n\n`
      : "";
  const text = `Disease pressure alert for ${opts.locationLabel}${farm}:

${opts.headline}

${opts.detail}

${eventBlock}Recommendation:
${opts.recommendation}

See full disease pressure forecast:
${SITE_URL}/resources/disease-pressure

Can't spray yourself? We fly Part 137 drone applications across South Jersey —
reply to this email to book a targeted pass before the event hits.

— AG Drones NJ
${SITE_URL}
${alertFooter(opts.unsubscribeToken)}`;
  return { subject, text };
}

export function chillCompleteEmail(opts: {
  unsubscribeToken: string;
  farmName: string | null;
  locationLabel: string;
  cropName: string;
  variety: string;
  hoursAccumulated: number;
  hoursRequired: number;
  bloomDate: string | null;
}) {
  const farm = opts.farmName ? ` at ${opts.farmName}` : "";
  const subject = `Chill requirement met — ${opts.cropName} ${opts.variety}${farm}`;
  const bloomLine = opts.bloomDate ? `Bloom ETA: ${opts.bloomDate}\n` : "";
  const text = `Your ${opts.variety} ${opts.cropName.toLowerCase()} have hit their chill requirement:

Accumulated: ${opts.hoursAccumulated}h (Utah model)
Required:    ${opts.hoursRequired}h
${bloomLine}Location:    ${opts.locationLabel}${farm}

Bud break is coming fast. Time to:
  - Finish dormant-season pruning
  - Plan your pre-bloom delayed-dormant oil + copper application
  - Scout for overwintered pests and cankers

Chill tracker: ${SITE_URL}/resources/chill-hours

— AG Drones NJ
${SITE_URL}
${alertFooter(opts.unsubscribeToken)}`;
  return { subject, text };
}
