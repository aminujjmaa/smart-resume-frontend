"use client";

import { AlertTriangle, CheckCircle, LineChart, Search } from "lucide-react";

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
  { value: "60 sec", label: "Average report flow" },
  { value: "6", label: "Score categories" },
  { value: "3", label: "Input formats" },
  { value: "24/7", label: "Self-serve review" },
];

export default function Testimonials() {
  return (
    <section className="section bg-surface-950">
      <div className="container-lg mx-auto">
        <div className="mb-14 grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:items-end">
          <div>
            <span className="badge badge-info mb-4">Sample improvements</span>
            <h2 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">
              Show users progress they can understand immediately.
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
                <CheckCircle size={18} className="text-emerald-300" />
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
