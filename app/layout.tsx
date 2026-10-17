import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

import Providers from "./providers";
import { SITE } from "@/lib/site";
import { JsonLd } from "@/lib/jsonld";

const DEFAULT_TITLE = "SmartResume AI | Free ATS Resume Checker & Score";
const DEFAULT_DESCRIPTION =
  "Check your resume's ATS score free. Find missing keywords from the job description, formatting risks and weak bullets — and fix them before you apply. No sign-up needed.";

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: DEFAULT_TITLE, template: "%s | SmartResume AI" },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE.name,
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    type: "website",
    siteName: SITE.name,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: "Free ATS resume checker: score, missing keywords and fixes in under a minute.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  email: SITE.supportEmail,
  areaServed: "IN",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body className="antialiased">
        <JsonLd data={organizationJsonLd} />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
