"use client";
import { Brain, CheckCircle, FileText, Upload } from "lucide-react";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload the resume you actually use",
    description: "Start with a PDF, DOCX, TXT file, or pasted text. The same preview stays visible while the report is generated.",
    detail: "File-first workflow",
  },
  {
    icon: Brain,
    number: "02",
    title: "Benchmark it against the role",
    description: "The analysis compares your resume to the target job description, flags gaps, and ranks fixes by importance.",
    detail: "Job-aware scoring",
  },
  {
    icon: CheckCircle,
    number: "03",
    title: "Rewrite with measurable impact",
    description: "Use stronger bullets, better keywords, and cleaner formatting guidance before sending the application.",
    detail: "Apply with clarity",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section bg-surface-950">
      <div className="container-lg mx-auto">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="badge badge-info mb-4">Fast workflow</span>
            <h2 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">
              From raw resume to focused report in three steps.
            </h2>
          </div>
          <p className="max-w-md text-base leading-8 text-slate-400">
            Built for repeated use across many job applications, not a one-off checklist.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-stretch">
          <div className="grid gap-4">
            {steps.map((step) => (
              <div key={step.number} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-teal-300/20 bg-teal-300/10">
                    <step.icon size={21} className="text-teal-200" />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="font-display text-sm font-bold text-slate-500">{step.number}</span>
                      <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-0.5 text-xs font-semibold text-slate-300">
                        {step.detail}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-white/10 bg-[#08101c] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Report queue</p>
                <h3 className="font-display text-xl font-semibold text-white">Application readiness</h3>
              </div>
              <FileText size={22} className="text-blue-300" />
            </div>

            <div className="space-y-3">
              {[
                ["Resume uploaded", "Complete", "text-emerald-300"],
                ["Parsing layout", "Clean", "text-teal-300"],
                ["JD comparison", "12 gaps found", "text-amber-300"],
                ["Rewrite suggestions", "Ready", "text-blue-300"],
              ].map(([label, value, color]) => (
                <div key={label} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3">
                  <span className="text-sm text-slate-300">{label}</span>
                  <span className={`text-sm font-semibold ${color}`}>{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-4">
              <p className="text-sm font-semibold text-emerald-200">Recommended next action</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                Add revenue impact to the latest product launch bullet and include the missing experimentation keyword.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
