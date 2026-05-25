import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

import Providers from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://smartresume.co.in"),
  title: "SmartResume AI | Free ATS Resume Scanner & Resume Score Checker",
  description:
    "Check your ATS score instantly. SmartResume AI scans your resume for keyword gaps, formatting issues, and weak bullet points so you land more interviews. Free, no sign-up needed.",
  keywords: [
    // Core high-intent
    "check ATS score resume",
    "ATS resume checker free",
    "free ATS resume scanner",
    "resume score checker",
    "ATS score checker",
    // Enhance / improve variants
    "enhance CV",
    "improve resume",
    "enhance resume",
    "resume enhancer",
    "CV enhancer",
    "AI resume enhancer",
    "resume optimizer",
    "resume improvement tool",
    // Builder / maker variants
    "ATS resume builder",
    "ATS friendly resume",
    "resume keyword checker",
    "resume keyword scanner",
    // Broader searches
    "AI resume scanner",
    "resume checker",
    "CV checker",
    "resume review tool",
    "best resume checker",
    "online resume checker",
    "resume analysis tool",
    "job application resume",
  ],

  openGraph: {
    title: "SmartResume AI | Free ATS Resume Scanner & Score Checker",
    description:
      "Instantly check your ATS resume score. Find missing keywords, formatting risks, and get AI-powered bullet rewrites — completely free.",
    type: "website",
    siteName: "SmartResume AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartResume AI | Free ATS Resume Scanner",
    description:
      "Check your ATS score free. Find keyword gaps, fix formatting, and get AI bullet rewrites — no sign-up required.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
