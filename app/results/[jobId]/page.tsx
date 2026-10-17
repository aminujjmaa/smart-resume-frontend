"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Sparkles, Target } from "lucide-react";
import { analysisApi } from "@/lib/api";
import { useAnalysisStore, useAuthStore } from "@/store/useAppStore";
import ATSScoreRing from "@/components/resume/ATSScoreRing";
import ResumePreview from "@/components/resume/ResumePreview";
import FreeReport from "@/components/report/FreeReport";
import ScoreExplanation from "@/components/report/ScoreExplanation";
import ShareButton from "@/components/report/ShareButton";
import { buildResumeAnnotations } from "@/lib/resumeAnnotations";
import { FREE_DAILY_SCANS, PRO_PERIOD, PRO_PRICE } from "@/lib/pricing";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import type { Analysis, AnalysisResult } from "@/types";

function pctToGradient(pct: number): string {
  if (pct >= 70) return "from-emerald-500 to-emerald-400";
  if (pct >= 45) return "from-amber-500 to-amber-400";
  return "from-red-500 to-red-400";
}

function ScoreBarRow({ label, pct }: { readonly label: string; readonly pct: number }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-slate-200">{label}</span>
        <span className="text-xs text-slate-400">{pct}%</span>
      </div>
      <div className="w-full bg-surface-800 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full bg-gradient-to-r ${pctToGradient(pct)} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StatusScreen({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-950 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">{children}</div>
      <Footer />
    </div>
  );
}

function errorStatus(error: unknown): number | undefined {
  return (error as { response?: { status?: number } } | null)?.response?.status;
}

/** What to do next: free account for editing + re-scoring, Pro for AI. */
function NextSteps({ jobId, signedIn }: { readonly jobId: string; readonly signedIn: boolean }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {!signedIn && (
        <div className="rounded-2xl border border-teal-300/25 bg-teal-300/[0.06] p-6">
          <p className="font-display text-lg font-bold text-white">Fix it and watch your score move</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Create a free account to edit your resume with instant re-scoring, download it as PDF or DOCX, and get{" "}
            {FREE_DAILY_SCANS} scans a day. This report moves into your account automatically.
          </p>
          <Link href={`/signup?next=/dashboard/results/${jobId}`} className="btn-primary mt-4 inline-flex px-5 py-2.5 text-sm">
            Sign up free <ArrowRight size={15} />
          </Link>
        </div>
      )}
      <div className="rounded-2xl border border-brand-500/25 bg-brand-500/[0.06] p-6">
        <p className="flex items-center gap-2 font-display text-lg font-bold text-white">
          <Sparkles size={18} className="text-brand-300" /> AI help with every application
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Pro writes tailored AI suggestions and bullet rewrites for each job, plus cover letters, LinkedIn review and
          interview prep — {PRO_PRICE}/{PRO_PERIOD}, cancel anytime.
        </p>
        <Link href={signedIn ? "/dashboard/billing" : "/signup?next=/dashboard/billing"} className="btn-secondary mt-4 inline-flex px-5 py-2.5 text-sm">
          See Pro
        </Link>
      </div>
    </div>
  );
}

export default function PublicResultsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  // Resume text is never returned for anonymous reports; preview what this browser submitted.
  const { resumeFile, resumeText } = useAnalysisStore();
  const { isAuthenticated } = useAuthStore();

  const { data: analysis, isLoading, error } = useQuery<Analysis>({
    queryKey: ["analysis", jobId],
    queryFn: () => analysisApi.getResult(jobId).then((r) => r.data),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status || status === "done" || status === "failed") return false;
      return 2000;
    },
    retry: (count, err) => errorStatus(err) !== 403 && errorStatus(err) !== 404 && count < 2,
    staleTime: 5000,
    enabled: !!jobId,
  });

  if (isLoading || analysis?.status === "processing" || analysis?.status === "pending") {
    return (
      <StatusScreen>
        <div className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
        <p className="text-slate-400">Scoring your resume…</p>
      </StatusScreen>
    );
  }

  if (errorStatus(error) === 403) {
    return (
      <StatusScreen>
        <p className="max-w-md text-slate-300">
          This report is private to the browser that created it. If it&apos;s yours, open it from the same browser — or sign in
          to see reports saved to your account.
        </p>
        <Link href="/scan" className="btn-primary px-6 py-3">Run a new free scan</Link>
      </StatusScreen>
    );
  }

  if (error || !analysis || analysis.status === "failed" || !analysis.result_json) {
    return (
      <StatusScreen>
        <p className="text-red-400">We couldn&apos;t load this report.</p>
        <Link href="/scan" className="btn-primary px-6 py-3">Try a new scan</Link>
      </StatusScreen>
    );
  }

  const result = analysis.result_json as AnalysisResult;
  const resumeAnnotations = buildResumeAnnotations(result);
  const previewText = analysis.resume_text || resumeText;

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4 flex justify-center">
        <div className="w-full max-w-7xl animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-white mb-2">Your free ATS report</h1>
            <p className="text-slate-400">Your score, why you got it, and exactly what to fix — in priority order.</p>
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="min-w-0 space-y-8">
              <div className="card flex flex-col md:flex-row items-center gap-8">
                <ATSScoreRing score={result.ats_score} size={160} />
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    {result.seniority_signal && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/25">
                        {result.seniority_signal}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-xs text-emerald-300">
                      <CheckCircle2 size={14} /> {result.matched_keywords?.length || 0} keywords matched
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-red-300">
                      <Target size={14} /> {result.missing_keywords?.length || 0} missing
                    </span>
                  </div>
                  <ScoreBarRow label="Keyword match" pct={result.score_breakdown?.keyword_match_pct ?? 0} />
                  <ScoreBarRow label="Experience impact" pct={result.score_breakdown?.experience_impact_pct ?? 0} />
                  <ScoreBarRow label="Formatting & ATS" pct={result.score_breakdown?.formatting_score_pct ?? 0} />
                  <div className="mt-4">
                    <ShareButton jobId={jobId} score={result.ats_score} />
                  </div>
                </div>
              </div>

              <NextSteps jobId={jobId} signedIn={isAuthenticated} />

              <FreeReport result={result} />
            </div>

            <aside className="min-w-0 space-y-6 xl:sticky xl:top-8 xl:self-start">
              <ScoreExplanation result={result} />
              {(previewText || resumeFile) && (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20">
                  <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-surface-950/70 px-4 py-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-300">
                        <FileText size={15} /> Your resume
                      </div>
                      <p className="mt-1 text-sm text-slate-400">Lines with issues are highlighted.</p>
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
                    title="Resume markup"
                  />
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
