/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { CheckCircle2, Lock, Target, FileText } from "lucide-react";
import Link from "next/link";
import type { Analysis, AnalysisResult } from "@/types";

function pctToGradient(pct: number): string {
  if (pct >= 70) return "from-emerald-500 to-emerald-400";
  if (pct >= 45) return "from-amber-500 to-amber-400";
  return "from-red-500 to-red-400";
}

// FREE: Flat score breakdown bar
function ScoreBarRow({ label, pct }: { readonly label: string; readonly pct: number }) {
  const color = pctToGradient(pct);
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-slate-200">{label}</span>
        <span className="text-xs text-slate-400">{pct}%</span>
      </div>
      <div className="w-full bg-surface-800 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full bg-gradient-to-r ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PublicResultsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  // Resume text is never returned for anonymous reports; preview what this browser submitted.
  const { resumeFile, resumeText } = useAnalysisStore();

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
  const previewText = analysis.resume_text || resumeText;

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
            <div className="card p-5">
              <ScoreBarRow label="Keyword Match" pct={result.score_breakdown?.keyword_match_pct ?? 0} />
              <ScoreBarRow label="Experience Impact" pct={result.score_breakdown?.experience_impact_pct ?? 0} />
              <ScoreBarRow label="Formatting & ATS" pct={result.score_breakdown?.formatting_score_pct ?? 0} />
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
                    <span key={kw.keyword} className="badge badge-missing text-xs">{kw.keyword}</span>
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

            {(previewText || resumeFile) && (
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
                    text={previewText}
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
