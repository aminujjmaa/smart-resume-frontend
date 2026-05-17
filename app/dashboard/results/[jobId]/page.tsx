/* eslint-disable */
"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { analysisApi } from "@/lib/api";
import { useAnalysisStore } from "@/store/useAppStore";
import ATSScoreRing from "@/components/resume/ATSScoreRing";
import BulletRewriter from "@/components/resume/BulletRewriter";
import BulletFeedbackList from "@/components/resume/BulletFeedbackList";
import ResumePreview from "@/components/resume/ResumePreview";
import { buildResumeAnnotations } from "@/lib/resumeAnnotations";
import {
  ArrowLeft, AlertTriangle, CheckCircle2, Lightbulb, Download,
  RefreshCw, ChevronDown, ChevronUp, Zap, Target, TrendingUp, FileText
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import type { Analysis, AnalysisResult, ScoreCategory, Suggestion, SuggestionSeverity } from "@/types";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// ── Grade badge ───────────────────────────────────────────────────────────────
const gradeColors: Record<string, string> = {
  A: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  B: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  C: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  D: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  F: "bg-red-500/15 text-red-400 border-red-500/30",
};

const severityColors: Record<SuggestionSeverity, string> = {
  critical: "border-red-500/40 bg-red-500/5",
  high:     "border-orange-500/40 bg-orange-500/5",
  medium:   "border-amber-500/40 bg-amber-500/5",
  low:      "border-slate-500/20 bg-surface-800/50",
};

const severityBadge: Record<SuggestionSeverity, string> = {
  critical: "bg-red-500/20 text-red-400",
  high:     "bg-orange-500/20 text-orange-400",
  medium:   "bg-amber-500/20 text-amber-400",
  low:      "bg-slate-500/20 text-slate-400",
};

// ── Score Breakdown Card ──────────────────────────────────────────────────────
function ScoreCategoryCard({ cat }: { cat: ScoreCategory }) {
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
        <div className="mt-3 pt-3 border-t border-white/5 space-y-2 animate-fade-in">
          <p className="text-xs text-slate-400"><span className="text-slate-300 font-medium">Why:</span> {cat.why}</p>
          <p className="text-xs text-slate-400"><span className="text-slate-300 font-medium">How to improve:</span> {cat.how_to_improve}</p>
        </div>
      )}
    </div>
  );
}

// ── Suggestion Card ───────────────────────────────────────────────────────────
function SuggestionCard({ s }: { s: Suggestion }) {
  const [open, setOpen] = useState(false);
  const sev = (s.severity || "medium") as SuggestionSeverity;
  return (
    <div className={`rounded-xl border p-4 cursor-pointer ${severityColors[sev]}`} onClick={() => setOpen(!open)}>
      <div className="flex items-start gap-3">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${severityBadge[sev]}`}>
          {sev}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{s.category}</span>
            {open ? <ChevronUp size={13} className="text-slate-500 shrink-0" /> : <ChevronDown size={13} className="text-slate-500 shrink-0" />}
          </div>
          <p className="text-sm text-slate-200 mt-1 leading-relaxed">{s.issue}</p>
        </div>
      </div>
      {open && (
        <div className="mt-3 pt-3 border-t border-white/5 space-y-2 animate-fade-in">
          {s.why_it_matters && (
            <p className="text-xs text-slate-300"><span className="font-medium text-blue-300">Why it matters:</span> {s.why_it_matters}</p>
          )}
          <p className="text-xs text-slate-300"><span className="font-medium text-brand-400">Fix:</span> {s.fix}</p>
          {(s.evidence_to_add?.length || 0) > 0 && (
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Evidence to add if true</p>
              <div className="flex flex-wrap gap-1.5">
                {s.evidence_to_add?.map((item) => (
                  <span key={item} className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-slate-300">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          {s.example && (
            <div className="rounded-lg bg-surface-900/80 border border-white/5 p-3">
              <p className="text-xs text-slate-500 font-medium mb-1">EXAMPLE</p>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">{s.example}</p>
            </div>
          )}
          {s.strong_example && (
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
              <p className="text-xs text-emerald-300 font-medium mb-1">STRONG VERSION</p>
              <p className="text-xs text-slate-200 leading-relaxed">{s.strong_example}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { jobDescription, resumeFile } = useAnalysisStore();

  const { data: analysis, isLoading, error } = useQuery<Analysis>({
    queryKey: ["analysis", jobId],
    queryFn: () => analysisApi.getResult(jobId).then((r) => r.data),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status || status === "done" || status === "failed") return false;
      return 3000;
    },
    enabled: !!jobId,
    staleTime: 5000,
  });

  if (isLoading || analysis?.status === "processing" || analysis?.status === "pending") {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400">Analyzing your resume…</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-400">Failed to load results. <Link href="/dashboard/upload" className="underline">Try again</Link></p>
      </div>
    );
  }

  const result = analysis.result_json as AnalysisResult;
  if (!result) return null;

  const criticalSuggestions = result.suggestions?.filter(s => s.severity === "critical") || [];
  const otherSuggestions = result.suggestions?.filter(s => s.severity !== "critical") || [];
  const resumeAnnotations = buildResumeAnnotations(result);

  return (
    <div className="mx-auto flex flex-col xl:flex-row max-w-7xl gap-8 p-4 md:p-8">
      {/* Analysis Results */}
      <div className="flex-1 min-w-0 order-2 xl:order-1">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Back */}
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm transition-colors w-fit">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      {/* Hero Score Row */}
      <motion.div variants={itemVariants} className="card mb-6 flex flex-col md:flex-row items-center gap-8">
        <ATSScoreRing score={result.ats_score} size={160} />
        <div className="flex-1 w-full">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h1 className="font-display text-2xl font-bold text-white">Analysis Complete</h1>
            {result.seniority_signal && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/25">
                {result.seniority_signal}
              </span>
            )}
          </div>
          {result.role_alignment_summary && (
            <p className="text-slate-400 text-sm mb-4 leading-relaxed max-w-xl">{result.role_alignment_summary}</p>
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
        <Link href="/dashboard/upload" id="results-reanalyze-btn"
          className="btn-secondary text-sm shrink-0 flex items-center gap-2">
          <RefreshCw size={14} /> Re-analyze
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Score Breakdown */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
            <Target size={15} /> Score Breakdown
          </div>
          <div className="space-y-2">
            {result.score_breakdown?.map((cat) => (
              <ScoreCategoryCard key={cat.name} cat={cat} />
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
            <CheckCircle2 size={15} /> Keyword Analysis
          </div>
          <div className="card p-4 space-y-4 h-fit">
            {(result.matched_keywords?.length || 0) > 0 && (
              <div>
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
        </div>
      </motion.div>

      {/* Critical Suggestions */}
      {criticalSuggestions.length > 0 && (
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold uppercase tracking-wider text-red-400">
            <Zap size={15} /> Critical Issues — Fix These First
          </div>
          <div className="space-y-3">
            {criticalSuggestions.map((s, i) => <SuggestionCard key={i} s={s} />)}
          </div>
        </motion.div>
      )}

      {/* Other Suggestions */}
      {otherSuggestions.length > 0 && (
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold uppercase tracking-wider text-amber-400">
            <Lightbulb size={15} /> Improvement Suggestions
          </div>
          <div className="space-y-3">
            {otherSuggestions.map((s, i) => <SuggestionCard key={i} s={s} />)}
          </div>
        </motion.div>
      )}

      {/* Formatting Issues */}
      {(result.formatting_issues?.length || 0) > 0 && (
        <motion.div variants={itemVariants} className="card mb-6">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold uppercase tracking-wider text-orange-400">
            <AlertTriangle size={15} /> Formatting Issues
          </div>
          <ul className="space-y-2">
            {result.formatting_issues.map((issue, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="text-orange-400 mt-0.5 shrink-0">•</span>
                {issue}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* AI Bullet Rewrites */}
      {(result.bullet_improvements?.length || 0) > 0 && (
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold uppercase tracking-wider text-brand-400">
            <TrendingUp size={15} /> AI-Improved Bullet Points
          </div>
          <BulletRewriter bullets={result.bullet_improvements} jobDescription={jobDescription} />
        </motion.div>
      )}

      {/* Line-by-Line Bullet Feedback */}
      {(result.bullet_feedback?.length || 0) > 0 && (
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold uppercase tracking-wider text-orange-400">
            <Target size={15} /> Line-by-Line Bullet Feedback
          </div>
          <BulletFeedbackList feedbackList={result.bullet_feedback} />
        </motion.div>
      )}

      {/* Download CTA */}
      <motion.div variants={itemVariants} className="card flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-white mb-1">Download Optimized Resume</h3>
          <p className="text-slate-400 text-sm">Get a clean version with all AI improvements applied</p>
        </div>
        <button
          id="download-resume-btn"
          type="button"
          className="btn-primary shrink-0"
          onClick={() => {
            const text = analysis.resume_text || "";
            if (!text.trim()) return;
            const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "resume.txt";
            a.click();
            URL.revokeObjectURL(url);
          }}
          disabled={!analysis.resume_text?.trim()}
        >
          <Download size={16} /> Download Resume
        </button>
      </motion.div>
      </motion.div>
    </div>

      {/* Original Resume */}
      <aside className="w-full xl:w-[440px] shrink-0 xl:sticky xl:top-8 xl:self-start order-1 xl:order-2">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-surface-950/70 px-4 py-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-300">
                <FileText size={15} /> Original Document
              </div>
              <p className="mt-1 text-sm text-slate-400">
                Weak lines are highlighted with exact fixes.
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
            text={analysis.resume_text || ""}
            title="Resume Markup"
          />
        </div>
      </aside>
  </div>
);
}
