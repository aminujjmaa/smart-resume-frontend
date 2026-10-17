import { type Metadata } from "next";
import Link from "next/link";
import { Search, Shield } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ScanForm from "@/components/scan/ScanForm";
import { ANON_DAILY_SCANS } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Free ATS Resume Checker — Get Your ATS Score Instantly",
  description:
    "Upload your resume and a job description to get your ATS score, missing keywords, formatting risks and the top fixes to make. Free, no sign-up needed.",
  alternates: { canonical: "/scan" },
  openGraph: {
    title: "Free ATS Resume Checker — Check Your Score Now",
    description: "Get your ATS score instantly. Find keyword gaps and formatting risks before your next application.",
  },
};

export default function ScanPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <Navbar />
      <main className="flex-1 py-20 px-4">
        <div className="mx-auto max-w-6xl animate-fade-in">
          <div className="mb-10 grid gap-6 md:grid-cols-[1fr_340px] md:items-end">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-lg border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-xs font-semibold text-teal-200">
                <Search size={14} /> Free ATS resume checker — no sign-up needed
              </span>
              <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">Get Your Free ATS Score</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">
                Upload your resume, add the job description you&apos;re targeting, and see your score, the keywords you&apos;re
                missing and exactly what to fix. Not sure how scoring works?{" "}
                <Link href="/how-ats-score-works" className="text-teal-300 hover:underline">See the method</Link>.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <div className="flex items-start gap-3">
                <Shield size={18} className="mt-0.5 text-teal-300" />
                <div>
                  <p className="text-sm font-semibold text-white">Free · private</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    {ANON_DAILY_SCANS} full reports a day without an account. Scans run without an account are deleted after 7 days.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <ScanForm idPrefix="scan" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
