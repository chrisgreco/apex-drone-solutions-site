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

export function windowOpenEmail(opts: {
  unsubscribeToken: string;
  farmName: string | null;
  locationLabel: string;
  windowStart: string;
  windowEnd: string;
  windowHours: number;
  summary: string;
}) {
  const unsubUrl = `${SITE_URL}/api/spray-alerts/unsubscribe?token=${opts.unsubscribeToken}`;
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

—
Unsubscribe: ${unsubUrl}
`;
  return { subject, text };
}
