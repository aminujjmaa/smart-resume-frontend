"use client";
import Link from "next/link";
import { ArrowRight, BarChart2, CheckCircle, Clock, FileText, Search, Shield, TrendingUp } from "lucide-react";

const proofPoints = [
  { icon: Clock, text: "Score in under 60 seconds" },
  { icon: Shield, text: "Private resume review" },
  { icon: FileText, text: "PDF, DOCX, and text support" },
];

const reportRows = [
  { label: "Keyword match", value: "82%", tone: "bg-emerald-400" },
  { label: "Experience impact", value: "74%", tone: "bg-blue-400" },
  { label: "ATS formatting", value: "92%", tone: "bg-teal-400" },
];

export default function Hero() {
  return (
    <section className="hero-bg relative px-4 pt-28 pb-16 sm:px-6 md:pt-32">
      <div className="container-lg relative z-10 mx-auto animate-fade-in">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-lg border border-teal-400/20 bg-teal-400/10 px-3 py-2 text-sm font-medium text-teal-200">
            <Search size={14} />
            AI resume scanner for ATS-heavy hiring funnels
          </div>

          <h1 className="font-display text-5xl font-bold leading-[1.02] text-white md:text-7xl">
            AI Resume Scanner Built for More Interviews
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-xl">
            Upload your resume, paste a job description, and get a recruiter-ready report with ATS score, keyword gaps, formatting risks, and stronger bullet rewrites.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/dashboard/upload" id="hero-cta-primary" className="btn-primary px-8 py-4 text-base">
              Scan My Resume Free
              <ArrowRight size={18} />
            </Link>
            <a href="#report-preview" className="btn-secondary px-8 py-4 text-base">
              View sample report
            </a>
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 text-sm text-slate-300 sm:grid-cols-3">
            {proofPoints.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2">
                <Icon size={15} className="text-teal-300" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div id="report-preview" className="mx-auto mt-14 max-w-6xl animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="overflow-hidden rounded-lg border border-white/[0.12] bg-slate-950/80 shadow-2xl shadow-slate-950/70">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.035] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="hidden text-xs font-medium text-slate-400 sm:block">SmartResume AI / ATS report</div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.35fr]">
              <div className="border-b border-white/10 bg-white/[0.025] p-5 lg:border-b-0 lg:border-r">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">Uploaded resume</p>
                    <h2 className="mt-1 font-display text-xl font-semibold text-white">Senior Product Manager</h2>
                  </div>
                  <span className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">PDF</span>
                </div>

                <div className="space-y-3 rounded-lg border border-white/10 bg-white/[0.025] p-4">
                  <div className="h-4 w-2/3 rounded bg-slate-300/90" />
                  <div className="h-2 w-5/6 rounded bg-slate-600/70" />
                  <div className="h-2 w-4/6 rounded bg-slate-600/70" />
                  <div className="pt-3">
                    <div className="mb-2 h-3 w-28 rounded bg-slate-400/80" />
                    <div className="space-y-2">
                      <div className="h-2 w-full rounded bg-slate-700" />
                      <div className="h-2 w-11/12 rounded bg-slate-700" />
                      <div className="h-2 w-10/12 rounded bg-slate-700" />
                    </div>
                  </div>
                  <div className="pt-3">
                    <div className="mb-2 h-3 w-24 rounded bg-slate-400/80" />
                    <div className="space-y-2">
                      <div className="h-2 w-full rounded bg-slate-700" />
                      <div className="h-2 w-9/12 rounded bg-slate-700" />
                      <div className="h-2 w-10/12 rounded bg-slate-700" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 md:p-6">
                <div className="grid gap-4 md:grid-cols-[180px_1fr]">
                  <div className="rounded-lg border border-teal-400/20 bg-teal-400/10 p-5 text-center">
                    <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-[10px] border-teal-300/80 bg-slate-950">
                      <div>
                        <p className="font-display text-4xl font-bold text-white">87</p>
                        <p className="text-xs font-semibold text-teal-200">ATS Score</p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs leading-5 text-slate-300">Strong match. Add two missing cloud keywords to improve ranking.</p>
                  </div>

                  <div className="space-y-4">
                    {reportRows.map((row) => (
                      <div key={row.label} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-200">{row.label}</span>
                          <span className="font-semibold text-white">{row.value}</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800">
                          <div className={`h-2 rounded-full ${row.tone}`} style={{ width: row.value }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                      <CheckCircle size={16} className="text-emerald-300" />
                      Matched keywords
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Roadmap", "A/B testing", "SQL", "Stakeholders"].map((kw) => (
                        <span key={kw} className="badge badge-matched">{kw}</span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                      <TrendingUp size={16} className="text-amber-300" />
                      Missing keywords
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Experimentation", "Revenue", "Lifecycle"].map((kw) => (
                        <span key={kw} className="badge badge-missing">{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-lg border border-blue-400/20 bg-blue-400/10 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-100">
                    <BarChart2 size={16} />
                    Suggested rewrite
                  </div>
                  <p className="text-sm leading-6 text-slate-300">
                    Led onboarding improvements that reduced activation time by 31% and increased trial-to-paid conversion across two enterprise segments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
