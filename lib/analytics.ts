import { track as vercelTrack } from "@vercel/analytics";

/**
 * Conversion events (Vercel Analytics custom events). Never put personal data
 * (emails, names, resume text) in properties.
 */
export type AnalyticsEvent =
  | "scan_submitted"
  | "scan_completed"
  | "scan_limit_hit"
  | "signup_completed"
  | "rescore"
  | "download"
  | "checkout_opened"
  | "subscription_activated"
  | "subscription_cancelled"
  | "share_created"
  | "email_report"
  | "tool_used"
  | "pro_gate_viewed";

type EventProps = Record<string, string | number | boolean | null>;

export function track(event: AnalyticsEvent, props?: EventProps): void {
  try {
    vercelTrack(event, props);
  } catch {
    // Analytics must never break the product.
  }
}
