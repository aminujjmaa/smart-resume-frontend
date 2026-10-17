/**
 * Business details shown on legal and contact pages.
 * TODO(owner): replace every "TODO" value before going live — Razorpay's
 * website review checks that these pages carry real contact details.
 */
export const SITE = {
  name: "SmartResume AI",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://smartresume.co.in",
  legalName: "TODO: registered business or proprietor name",
  supportEmail: "support@smartresume.co.in",
  phone: "TODO: +91 contact number",
  address: "TODO: registered address, city, state, PIN code",
  grievanceOfficer: "TODO: name of grievance officer",
  jurisdiction: "TODO: city",
  policiesUpdated: "17 October 2026",
} as const;
