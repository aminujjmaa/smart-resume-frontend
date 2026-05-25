import { type Metadata } from "next";
import ScanClient from "./ScanClient";

export const metadata: Metadata = {
  title: "Free ATS Resume Scanner — Check Your ATS Score Instantly | SmartResume AI",
  description:
    "Upload your resume and get your ATS score in seconds. Find missing keywords, formatting issues, and weak bullet points before you apply. 100% free, no sign-up needed.",
  keywords: [
    "check ATS score resume",
    "free ATS resume scanner",
    "ATS resume checker",
    "resume score checker free",
    "ATS score checker online",
    "check resume ATS compatibility",
    "resume keyword checker",
    "enhance resume free",
    "improve resume online",
    "ATS resume test",
  ],
  alternates: { canonical: "/scan" },
  openGraph: {
    title: "Free ATS Resume Scanner — Check Your Score Now",
    description: "Get your ATS score instantly. Discover keyword gaps and formatting risks before your next application.",
  },
};

export default function ScanPage() {
  return <ScanClient />;
}
