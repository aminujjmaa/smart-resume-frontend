import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

import Providers from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://smartresume.co.in"),
  title: "SmartResume AI | Free ATS Resume Scanner and Resume Score Checker",
  description:
    "Scan your resume for ATS compatibility, missing keywords, formatting risks, and stronger bullet rewrites before you apply.",
  keywords: [
    "ATS resume scanner",
    "resume score checker",
    "AI resume scanner",
    "resume keyword scanner",
    "resume optimization",
    "job application",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SmartResume AI | Free ATS Resume Scanner",
    description: "Check your resume score, keyword match, formatting risks, and bullet strength before you apply.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartResume AI | Free ATS Resume Scanner",
    description: "AI resume scanner with ATS score, keyword gaps, formatting checks, and bullet rewrites.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
