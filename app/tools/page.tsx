import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ListChecks, Search, Target } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "Free Resume Tools — Keyword Extractor, Bullet Checker, ATS Score",
  description:
    "Free resume tools, no sign-up: extract keywords from any job description, score your resume bullets, and check your full ATS score.",
  alternates: { canonical: "/tools" },
};

const TOOLS = [
  {
    href: "/tools/jd-keyword-extractor",
    icon: <Target size={22} className="text-teal-300" />,
    title: "Job description keyword extractor",
    body: "Paste a job description and see the skills and tools it screens for — required vs preferred, with the line each came from.",
  },
  {
    href: "/tools/resume-bullet-checker",
    icon: <ListChecks size={22} className="text-teal-300" />,
    title: "Resume bullet point checker",
    body: "Score each bullet out of 100 for action verbs, measurable results and clarity — and get a stronger rewrite.",
  },
  {
    href: "/scan",
    icon: <Search size={22} className="text-teal-300" />,
    title: "Full ATS resume checker",
    body: "Upload your resume with a job description for your ATS score, missing keywords, formatting risks and top fixes.",
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <Navbar />
      <main className="flex-1 px-6 pt-32 pb-24">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Free resume tools</h1>
          <p className="max-w-2xl text-lg text-slate-400 mb-12">No sign-up, no credit card. Built on the same engine as our ATS score.</p>
          <div className="grid gap-6 md:grid-cols-3">
            {TOOLS.map((tool) => (
              <Link key={tool.href} href={tool.href} className="card group flex flex-col p-6 hover:border-brand-500/40">
                {tool.icon}
                <h2 className="mt-4 font-display text-xl font-bold text-white group-hover:text-brand-300">{tool.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-400">{tool.body}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-brand-300">
                  Open tool <ArrowRight size={14} />
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
