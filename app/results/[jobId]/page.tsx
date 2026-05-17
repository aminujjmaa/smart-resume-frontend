/* eslint-disable */
"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { analysisApi } from "@/lib/api";
import { useAnalysisStore } from "@/store/useAppStore";
import ATSScoreRing from "@/components/resume/ATSScoreRing";
import ResumePreview from "@/components/resume/ResumePreview";
import { buildResumeAnnotations } from "@/lib/resumeAnnotations";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { CheckCircle2, Lock, Target, ChevronDown, ChevronUp, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Analysis, AnalysisResult, ScoreCategory } from "@/types";

// ── Grade badge (matches dashboard page) ─────────────────────────────────────
const gradeColors: Record<string, string> = {
  A: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  B: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  C: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  D: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  F: "bg-red-500/15 text-red-400 border-red-500/30",
};

// FREE: Show score category with grade but collapse the improvement advice (that's premium)
function FreeScoreCategoryCard({ cat }: { cat: ScoreCategory }) {
  const [open, setOpen] = useState(false);
  const pct = (cat.score / cat.max_score) * 100;
  const barColor =
    pct >= 80 ? "from-emerald-500 to-emerald-400" :
    pct >= 60 ? "from-blue-500 to-blue-400" :
    pct >= 40 ? "from-amber-500 to-amber-400" :
    "from-red-500 to-red-400";

  return (
    <div className="card p-4 cursor-pointer hover:border-white/10 transition-all duration-200" onClick={() => setOpen(!open)}>
      <div className="flex items-center gap-3">
        <span className={`w-8 h-8 rounded-lg border text-xs font-bold flex items-center justify-center shrink-0 ${gradeColors[cat.grade] || gradeColors.F}`}>
          {cat.grade}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-slate-200">{cat.name}</span>
            <span className="text-xs text-slate-400 shrink-0 ml-2">{cat.score}/{cat.max_score}</span>
          </div>
          <div className="w-full bg-surface-800 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full bg-gradient-to-r ${barColor} transition-all duration-700`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        {open ? <ChevronUp size={14} className="text-slate-500 shrink-0" /> : <ChevronDown size={14} className="text-slate-500 shrink-0" />}
      </div>
      {open && (
        <div className="mt-3 pt-3 border-t border-white/5 animate-fade-in">
          <p className="text-xs text-slate-400"><span className="text-slate-300 font-medium">Why:</span> {cat.why}</p>
          {/* How to improve is locked */}
          <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-500/10 border border-brand-500/20">
            <Lock size={12} className="text-brand-400 shrink-0" />
            <p className="text-xs text-brand-300 font-medium">Upgrade to Pro to see exactly how to fix this category</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PublicResultsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { resumeFile } = useAnalysisStore();

  const { data: analysis, isLoading, error } = useQuery<Analysis>({
    queryKey: ["analysis", jobId],
    queryFn: () => analysisApi.getResult(jobId).then((r) => r.data),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status || status === "done" || status === "failed") return false;
      return 3000;
    },
    staleTime: 5000,
    enabled: !!jobId,
  });

  if (isLoading || analysis?.status === "processing" || analysis?.status === "pending") {
    return (
      <div className="min-h-screen bg-surface-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mb-4" />
          <p className="text-slate-400">Analyzing your resume…</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-surface-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-400">Failed to load results. <Link href="/" className="underline">Try again</Link></p>
        </div>
        <Footer />
      </div>
    );
  }

  const result = analysis.result_json as AnalysisResult;
  if (!result) return null;
  const resumeAnnotations = buildResumeAnnotations(result);

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4 flex justify-center">
        <div className="w-full max-w-7xl animate-fade-in">

          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-white mb-2">Your Free ATS Score Report</h1>
            <p className="text-slate-400">See exactly why your resume scores what it does — category by category.</p>
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_440px]">
            <div className="min-w-0">
          {/* Hero Score */}
          <div className="card mb-8 flex flex-col md:flex-row items-center gap-8">
            <ATSScoreRing score={result.ats_score} size={160} />
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h2 className="font-display text-2xl font-bold text-white">Analysis Complete</h2>
                {result.seniority_signal && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/25">
                    {result.seniority_signal}
                  </span>
                )}
              </div>
              {result.role_alignment_summary && (
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{result.role_alignment_summary}</p>
              )}
              <div className="w-full bg-surface-800 rounded-full h-2 mb-3">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-purple-500 transition-all duration-1000"
                  style={{ width: `${result.ats_score}%` }}
                />
              </div>
              <div className="flex gap-4 text-sm flex-wrap">
                <span className="text-emerald-400 font-semibold">{result.matched_keywords?.length || 0} keywords matched</span>
                <span className="text-red-400 font-semibold">{result.missing_keywords?.length || 0} keywords missing</span>
              </div>
            </div>
          </div>

          {/* FREE: Score Breakdown — this is the core hook */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
              <Target size={15} /> Score Breakdown — Free
            </div>
            <div className="space-y-2">
              {result.score_breakdown?.map((cat) => (
                <FreeScoreCategoryCard key={cat.name} cat={cat} />
              ))}
            </div>
          </div>

          {/* FREE: Keywords */}
          <div className="card mb-8">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
              <CheckCircle2 size={15} /> Keyword Analysis — Free
            </div>
            {(result.matched_keywords?.length || 0) > 0 && (
              <div className="mb-4">
                <p className="text-xs text-emerald-400 font-medium mb-2">✓ Matched Keywords</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.matched_keywords.map((kw) => (
                    <span key={kw} className="badge badge-matched text-xs">{kw}</span>
                  ))}
                </div>
              </div>
            )}
            {(result.missing_keywords?.length || 0) > 0 && (
              <div>
                <p className="text-xs text-red-400 font-medium mb-2">✗ Missing Keywords</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.missing_keywords.map((kw) => (
                    <span key={kw} className="badge badge-missing text-xs">{kw}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* LOCKED: The Pro paywall */}
          <div className="relative rounded-2xl overflow-hidden border border-white/5">
            {/* Blurred background preview */}
            <div className="absolute inset-0 bg-surface-900 opacity-40 z-0 select-none pointer-events-none p-8" aria-hidden="true">
              <div className="space-y-3">
                <div className="h-16 w-full bg-red-500/10 border border-red-500/20 rounded-xl" />
                <div className="h-16 w-full bg-amber-500/10 border border-amber-500/20 rounded-xl" />
                <div className="h-24 w-full bg-amber-500/10 border border-amber-500/20 rounded-xl" />
                <div className="h-20 w-full bg-slate-500/10 border border-white/5 rounded-xl" />
              </div>
            </div>

            {/* Lock CTA */}
            <div className="relative z-10 bg-gradient-to-t from-surface-950 via-surface-950/95 to-transparent pt-24 pb-14 px-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center mb-5">
                <Lock size={28} className="text-brand-400" />
              </div>
              <h3 className="font-display text-3xl font-bold text-white mb-3">Unlock the Full Playbook</h3>
              <p className="text-slate-300 max-w-md mb-2 text-base leading-relaxed">
                You scored <span className="text-white font-semibold">{result.ats_score}/100</span>.
                {result.ats_score < 60
                  ? " That score means most ATS systems are filtering you out before a recruiter even sees your name."
                  : " Good start — but there's still room to push into the top 10% of applicants."}
              </p>
              <p className="text-slate-400 text-sm mb-8">
                Upgrade to unlock recruiter-grade AI suggestions, STAR-method bullet rewrites, and the downloadable optimized resume.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/signup" className="btn-primary text-base px-8 py-4 shadow-glow">
                  Unlock Full Analysis — $19/mo
                </Link>
                <Link href="/signup" className="btn-secondary text-base px-8 py-4">
                  Try Free — No Credit Card
                </Link>
              </div>
              <p className="text-xs text-slate-500 mt-4">Cancel anytime · Takes 60 seconds to sign up</p>
            </div>
          </div>

            </div>

            {analysis.resume_text && (
              <aside className="min-w-0 xl:sticky xl:top-8 xl:self-start">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20">
                  <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-surface-950/70 px-4 py-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-300">
                        <FileText size={15} /> Original Document
                      </div>
                      <p className="mt-1 text-sm text-slate-400">
                        Resume lines with issues are highlighted here.
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-200">
                      {resumeAnnotations.length} issues
                    </span>
                  </div>
                  <ResumePreview
                    annotations={resumeAnnotations}
                    className="rounded-none border-0 bg-transparent"
                    file={resumeFile}
                    showHeader={false}
                    text={analysis.resume_text}
                    title="Resume Markup"
                  />
                </div>
              </aside>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
