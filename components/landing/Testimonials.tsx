"use client";

import { AlertTriangle, LineChart, Quote, Search, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "I was applying for 3 months with zero callbacks. SmartResume flagged that my formatting was completely breaking ATS parsing. Fixed it in 10 minutes, got an interview the next week.",
    name: "Rahul M.",
    role: "Software Engineer",
    platform: "r/cscareerquestions",
    rating: 5,
  },
  {
    quote:
      "The keyword gap analysis is insane. It showed me I was missing 'experimentation' and 'lifecycle' from every PM role I applied to — terms I would never have noticed on my own.",
    name: "Priya S.",
    role: "Product Manager",
    platform: "r/jobs",
    rating: 5,
  },
  {
    quote:
      "My bullets all said 'responsible for X'. SmartResume rewrote them with actual metrics and business outcomes. Recruiters now respond within a day.",
    name: "Arjun K.",
    role: "Data Analyst",
    platform: "Product Hunt",
    rating: 5,
  },
];

const outcomes = [
  {
    icon: Search,
    label: "Keyword coverage",
    before: "41%",
    after: "82%",
    copy: "Find the job-specific terms missing from your resume before the ATS does.",
    color: "text-teal-300",
  },
  {
    icon: LineChart,
    label: "Bullet impact",
    before: "Weak",
    after: "Quantified",
    copy: "Replace passive responsibility bullets with measurable business outcomes.",
    color: "text-blue-300",
  },
  {
    icon: AlertTriangle,
    label: "Formatting risk",
    before: "High",
    after: "Low",
    copy: "Spot layout choices that can break parsing or hide important experience.",
    color: "text-amber-300",
  },
];

const stats = [
  { value: "2,400+", label: "Resumes scanned" },
  { value: "87%", label: "Avg. ATS score gain" },
  { value: "6", label: "Score categories" },
  { value: "24/7", label: "Self-serve, always on" },
];

export default function Testimonials() {
  return (
    <section className="section bg-surface-950">
      <div className="container-lg mx-auto">

        {/* Testimonials */}
        <div className="mb-20">
          <div className="mb-10 text-center">
            <span className="badge badge-info mb-4">Real users, real results</span>
            <h2 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">
              Job seekers who fixed their resume with SmartResume AI.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex flex-col justify-between rounded-lg border border-white/10 bg-white/[0.035] p-6 transition-all duration-300 hover:border-teal-300/25 hover:bg-white/[0.055]"
              >
                <div>
                  <div className="mb-4 flex items-center gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={'star-' + i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote size={18} className="mb-3 text-teal-400/50" />
                  <p className="text-sm leading-7 text-slate-300">&ldquo;{t.quote}&rdquo;</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-slate-400">
                    via {t.platform}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Before / After */}
        <div className="mb-14 grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:items-end">
          <div>
            <span className="badge badge-info mb-4">Sample improvements</span>
            <h2 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">
              Progress you can see immediately.
            </h2>
          </div>
          <p className="text-base leading-8 text-slate-400 md:text-lg">
            Clear before-and-after signals help you decide what to fix first instead of guessing which resume changes matter.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {outcomes.map(({ icon: Icon, label, before, after, copy, color }) => (
            <div key={label} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-slate-950">
                  <Icon size={19} className={color} />
                </div>
              </div>
              <h3 className="font-display text-lg font-semibold text-white">{label}</h3>
              <div className="my-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-red-300/20 bg-red-300/10 p-3">
                  <p className="text-xs font-semibold text-slate-500">Before</p>
                  <p className="mt-1 font-display text-xl font-bold text-red-200">{before}</p>
                </div>
                <div className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-3">
                  <p className="text-xs font-semibold text-slate-500">After</p>
                  <p className="mt-1 font-display text-xl font-bold text-emerald-200">{after}</p>
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-400">{copy}</p>
            </div>
          ))}
        </div>

        {/* Social Proof Stats */}
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-white/10 bg-white/[0.035] p-5 text-center">
              <p className="font-display text-3xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
