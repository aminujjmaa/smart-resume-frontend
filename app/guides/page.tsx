import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { GUIDES } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Resume Guides for Freshers & Job Seekers in India",
  description:
    "Practical, no-fluff guides on ATS-friendly resumes, Naukri profiles, campus placements, CGPA and gaps — written for job seekers in India.",
  alternates: { canonical: "/guides" },
};

export default function GuidesIndexPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <Navbar />
      <main className="flex-1 px-6 pt-32 pb-24">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Resume guides</h1>
          <p className="max-w-2xl text-lg text-slate-400 mb-12">
            Straight answers to the questions Indian freshers and early-career professionals ask most about getting shortlisted.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {GUIDES.map((guide) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`} className="card group flex flex-col p-6 hover:border-brand-500/40">
                <BookOpen size={20} className="text-teal-300" />
                <h2 className="mt-4 font-display text-xl font-bold text-white group-hover:text-brand-300">{guide.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-400">{guide.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-brand-300">
                  {guide.readingMinutes} min read <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
