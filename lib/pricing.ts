/**
 * Single source of truth for prices, limits and plan features shown anywhere
 * on the site. Keep in sync with the backend (PRO_PRICE_PAISE, daily limits).
 */

export const PRO_PRICE_PAISE = 9900;
export const PRO_PRICE = "₹99";
export const PRO_PERIOD = "month";
export const ANON_DAILY_SCANS = 3;
export const FREE_DAILY_SCANS = 10;
export const REFUND_WINDOW_DAYS = 7;

export interface Plan {
  id: "guest" | "free" | "pro";
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: string[];
  cta: { label: string; href: string };
  highlighted?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "guest",
    name: "Quick scan",
    price: "₹0",
    period: "no sign-up",
    tagline: "See where your resume stands in under a minute.",
    features: [
      `${ANON_DAILY_SCANS} scans a day`,
      "ATS score with keyword, impact and formatting breakdown",
      "Missing keywords quoted from the job description",
      "Formatting risks and your top 3 fixes",
      "Suggested bullet rewrites",
    ],
    cta: { label: "Scan my resume", href: "/scan" },
  },
  {
    id: "free",
    name: "Free account",
    price: "₹0",
    period: "forever",
    tagline: "Fix your resume and watch the score move.",
    features: [
      `${FREE_DAILY_SCANS} scans a day`,
      "Everything in Quick scan",
      "Edit your resume and re-score instantly",
      "Download as PDF or DOCX",
      "Scan history",
      "Resume builder with free templates",
    ],
    cta: { label: "Create free account", href: "/signup" },
  },
  {
    id: "pro",
    name: "Pro",
    price: PRO_PRICE,
    period: `/${PRO_PERIOD}`,
    tagline: "AI help tailored to every application.",
    features: [
      "Everything in Free",
      "AI-written suggestions on every scan",
      "One-click AI bullet rewrites",
      "Cover letter generator",
      "LinkedIn profile review",
      "Interview prep and networking emails",
      "All premium resume templates",
    ],
    cta: { label: `Get Pro for ${PRO_PRICE}/${PRO_PERIOD}`, href: "/signup?next=/dashboard/billing" },
    highlighted: true,
  },
];

export const PRICING_FINE_PRINT =
  `Prices in Indian Rupees. Pro renews every ${PRO_PERIOD} until you cancel — cancel anytime from Billing and keep Pro until the end of the period you paid for.`;

export function formatPaise(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}
