import { Resend } from "resend";

/**
 * Shared Resend client. Keyed off RESEND_API_KEY env var.
 * Emails send from the FROM_EMAIL env var (must be verified in Resend dashboard).
 */

let _client: Resend | null = null;

export function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set");
  }
  if (!_client) _client = new Resend(process.env.RESEND_API_KEY);
  return _client;
}

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "AG Drones NJ <alerts@agdronesnj.com>";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://agdronesnj.com";
