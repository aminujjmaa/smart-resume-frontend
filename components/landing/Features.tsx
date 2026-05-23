"use client";
import { BarChart2, FileText, KeySquare, Shield, Target, Wand2 } from "lucide-react";

const features = [
  {
    icon: BarChart2,
    title: "Decision-grade ATS scoring",
    description: "See a clear score tied to keyword match, role alignment, seniority signal, formatting, and bullet strength.",
    color: "text-blue-300",
    metric: "0-100",
  },
  {
    icon: KeySquare,
    title: "Keyword gap intelligence",
    description: "Compare the job description against your resume and identify the terms recruiters and ATS systems are likely to expect.",
    color: "text-teal-300",
    metric: "Live JD match",
  },
  {
    icon: Wand2,
    title: "Bullet rewrites with impact",
    description: "Turn vague responsibilities into outcome-led achievements with stronger verbs, scope, metrics, and business context.",
    color: "text-amber-300",
    metric: "STAR-ready",
  },
  {
    icon: Target,
    title: "Role-specific recommendations",
    description: "Prioritize the fixes that matter for the exact job, from missing tools to weak positioning and unclear seniority.",
    color: "text-emerald-300",
    metric: "Priority fixes",
  },
  {
    icon: FileText,
    title: "Formatting risk checks",
    description: "Catch ATS-hostile layout choices like dense tables, awkward sections, weak headings, and parse-risk content.",
    color: "text-cyan-300",
    metric: "Parse ready",
  },
  {
    icon: Shield,
    title: "Private analysis workspace",
    description: "Keep each analysis organized so you can compare versions, track progress, and prepare tailored applications faster.",
    color: "text-indigo-300",
    metric: "Saved history",
  },
];

export default function Features() {
  return (
    <section id="features" className="section bg-[#070b12]">
      <div className="container-lg mx-auto">
        <div className="mb-14 grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <span className="badge badge-info mb-4">Built for serious applications</span>
            <h2 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">
              A clearer way to improve every resume before you apply.
            </h2>
          </div>
          <p className="text-base leading-8 text-slate-400 md:text-lg">
            The product is designed around the questions that decide whether a resume earns a callback: can it be parsed, does it match the role, and does it prove impact quickly?
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group rounded-lg border border-white/10 bg-white/[0.035] p-5 transition-all duration-300 hover:border-teal-300/25 hover:bg-white/[0.055]"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-slate-950">
                  <f.icon size={19} className={f.color} />
                </div>
                <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-semibold text-slate-300">
                  {f.metric}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{f.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-teal-300/[0.15] bg-teal-300/[0.055] p-5">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Recruiter scan", "Improve the first 8 seconds of readability."],
              ["ATS parsing", "Reduce formatting choices that hide your experience."],
              ["Job match", "Adapt each resume to the role without rewriting from scratch."],
            ].map(([title, copy]) => (
              <div key={title}>
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
