"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { analysisApi } from "@/lib/api";
import { useAnalysisStore, useAuthStore } from "@/store/useAppStore";
import ATSScoreRing from "@/components/resume/ATSScoreRing";
import BulletRewriter from "@/components/resume/BulletRewriter";
import ResumePreview from "@/components/resume/ResumePreview";
import SkillTable from "@/components/resume/SkillTable";
import { buildResumeAnnotations } from "@/lib/resumeAnnotations";
import { downloadPDF, downloadDOCX, buildLatexFromText } from "@/lib/downloadResume";
import {
  ArrowLeft, AlertTriangle, ChevronDown, ChevronUp,
  FileText, Download, FileDown, Loader2, BookOpen, UserCheck, Search, Wand2,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import type { Analysis, AnalysisResult, ScoreCategory, Suggestion, SuggestionSeverity } from "@/types";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 26 } },
};

const gradeColors: Record<string, string> = {
  A: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  B: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  C: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  D: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  F: "bg-red-500/15 text-red-400 border-red-500/30",
};
const severityColors: Record<SuggestionSeverity, string> = {
  critical: "border-red-500/40 bg-red-500/5",
  high: "border-orange-500/40 bg-orange-500/5",
  medium: "border-amber-500/40 bg-amber-500/5",
  low: "border-slate-500/20 bg-surface-800/50",
};
const severityBadge: Record<SuggestionSeverity, string> = {
  critical: "bg-red-500/20 text-red-400",
  high: "bg-orange-500/20 text-orange-400",
  medium: "bg-amber-500/20 text-amber-400",
  low: "bg-slate-500/20 text-slate-400",
};

function ScoreCategoryCard({
  cat,
  resumeText,
  isActive,
  onActivate,
}: {
  readonly cat: ScoreCategory;
  readonly resumeText?: string;
  readonly isActive?: boolean;
  readonly onActivate?: () => void;
}) {
  const [resolving, setResolving] = useState(false);
  const [resolution, setResolution] = useState<{ resolution: string, before_example?: string | null, after_example?: string | null } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthStore();
  const isPremium = user?.plan === "premium";

  const pct = (cat.score / cat.max_score) * 100;

  let barColor = "from-red-500 to-red-400";
  if (pct >= 80) barColor = "from-emerald-500 to-emerald-400";
  else if (pct >= 60) barColor = "from-blue-500 to-blue-400";
  else if (pct >= 40) barColor = "from-amber-500 to-amber-400";

  const handleFixWithAI = async () => {
    if (!isPremium) {
      setError("Premium feature. Please upgrade to use AI resolution.");
      return;
    }
    setResolving(true);
    setError(null);
    try {
      const res = await analysisApi.resolveIssue({
        category: cat.name,
        issue: cat.why,
        how_to_improve: cat.how_to_improve,
        resume_text: resumeText
      });
      setResolution(res.data);
    } catch (err: any) {
      if (err.response?.status === 403) setError("Premium feature. Please upgrade.");
      else setError("Failed to generate AI resolution. Please try again.");
    } finally {
      setResolving(false);
    }
  };

  return (
    <div
      className={`card p-4 text-left w-full block mb-3 border bg-slate-900/50 cursor-pointer transition-colors ${isActive ? 'border-brand-500 shadow-[0_0_15px_rgba(56,189,248,0.2)]' : 'border-white/5 hover:border-white/15'}`}
      onClick={onActivate}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className={`w-8 h-8 rounded-lg border text-xs font-bold flex items-center justify-center shrink-0 ${gradeColors[cat.grade] || gradeColors.F}`}>
          {cat.grade}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-slate-200">{cat.name}</span>
            <span className="text-xs text-slate-400 shrink-0 ml-2">{cat.score}/{cat.max_score}</span>
          </div>
          <div className="w-full bg-surface-800 rounded-full h-1.5">
            <div className={`h-1.5 rounded-full bg-gradient-to-r ${barColor} transition-all duration-700`} style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Reasoning</span>
          <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{cat.why}</p>
        </div>

        {!resolution && (
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">How to Improve</span>
            <p className="text-sm text-brand-300 leading-relaxed">{cat.how_to_improve}</p>
          </div>
        )}

        {resolution && (
          <div className="mt-4 p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 animate-fade-in">
            <div className="flex items-center gap-2 mb-2 text-brand-400">
              <Wand2 size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">AI Resolution Plan</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed mb-3">{resolution.resolution}</p>

            {resolution.before_example && resolution.after_example && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div className="bg-slate-900/80 rounded-lg p-3 border border-red-500/20">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">Original Resume Snippet</span>
                  <p className="text-xs text-slate-300 italic">"{resolution.before_example}"</p>
                </div>
                <div className="bg-slate-900/80 rounded-lg p-3 border border-emerald-500/20">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">Suggested Rewrite</span>
                  <p className="text-xs text-emerald-100">{resolution.after_example}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

        {!resolution && (
          <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
            <button
              onClick={handleFixWithAI}
              disabled={resolving}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-brand-500/20 text-brand-400 hover:text-brand-300 transition-colors text-xs font-medium border border-white/5 hover:border-brand-500/30 disabled:opacity-50"
            >
              {resolving ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
              Fix with AI {isPremium ? "" : "👑"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SuggestionCard({
  s,
  isActive,
  onActivate,
}: {
  readonly s: Suggestion;
  readonly isActive?: boolean;
  readonly onActivate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const sev = (s.severity || "medium") as SuggestionSeverity;

  return (
    <button
      type="button"
      className={`rounded-xl border p-4 cursor-pointer block w-full text-left mb-3 ${severityColors[sev]} transition-all ${isActive ? 'ring-2 ring-brand-500 shadow-[0_0_15px_rgba(56,189,248,0.2)]' : ''}`}
      onClick={() => {
        setOpen(!open);
        if (onActivate) onActivate();
      }}
    >
      <div className="flex items-start gap-3">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${severityBadge[sev]}`}>{sev}</span>
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
          {s.why_it_matters && <p className="text-xs text-slate-300"><span className="font-medium text-blue-300">Why it matters: </span>{s.why_it_matters}</p>}
          <p className="text-xs text-slate-300"><span className="font-medium text-brand-400">Fix: </span>{s.fix}</p>
          {s.example && (
            <div className="rounded-lg bg-slate-800/50 border border-slate-700/50 p-3 mt-2 mb-2">
              <p className="text-xs text-slate-400 font-medium mb-1">YOUR RESUME</p>
              <p className="text-xs text-slate-300 leading-relaxed italic">"{s.example}"</p>
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
    </button>
  );
}

// ── Download Dropdown ─────────────────────────────────────────────────────────
function DownloadDropdown({ resumeText }: { readonly resumeText: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<"pdf" | "docx" | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handlePDF = async () => {
    setLoading("pdf");
    setOpen(false);
    try {
      const latex = buildLatexFromText(resumeText);
      await downloadPDF(latex, "smartresume-optimized.pdf");
    } catch {
      alert("PDF generation failed. Make sure you are logged in.");
    } finally {
      setLoading(null);
    }
  };

  const handleDOCX = async () => {
    setLoading("docx");
    setOpen(false);
    try {
      await downloadDOCX(resumeText, "smartresume-optimized.docx");
    } catch {
      alert("DOCX generation failed. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  let buttonText = "Download Resume";
  if (loading === "pdf") buttonText = "Generating PDF…";
  else if (loading === "docx") buttonText = "Generating DOCX…";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="results-download-btn"
        onClick={() => setOpen(!open)}
        disabled={!!loading}
        className="btn-primary shrink-0 gap-2"
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
        {buttonText}
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40 z-50 overflow-hidden animate-fade-in">
          <button onClick={handlePDF} className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-white/5 transition-colors">
            <FileDown size={16} className="text-red-400 shrink-0" />
            <div className="text-left">
              <p className="font-medium">Download PDF</p>
              <p className="text-xs text-slate-500">ATS-ready LaTeX PDF</p>
            </div>
          </button>
          <div className="h-px bg-white/5 mx-3" />
          <button onClick={handleDOCX} className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-white/5 transition-colors">
            <FileDown size={16} className="text-blue-400 shrink-0" />
            <div className="text-left">
              <p className="font-medium">Download DOCX</p>
              <p className="text-xs text-slate-500">Microsoft Word format</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { jobDescription, resumeFile, appliedResumeText, setAppliedResumeText } = useAnalysisStore();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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

  const resumeAnnotations = buildResumeAnnotations(result);
  const resumeText = analysis.resume_text || "";
  const workingText = appliedResumeText || resumeText;

  // JOBSCAN CLONE: Grouping the categories
  const atsFindingNames = new Set([
    "ATS Parseability", "Technical Depth", "Engineering Complexity",
    "Architecture Maturity", "Production Readiness Signals", "Role Alignment", "Semantic Relevance"
  ]);

  const recruiterFindingNames = new Set([
    "Impact Quantification", "Recruiter Readability", "Repetitive Words", "Ownership Signals"
  ]);

  const atsFindings = result.score_breakdown?.filter(cat => atsFindingNames.has(cat.name)) || [];
  const recruiterFindings = result.score_breakdown?.filter(cat => recruiterFindingNames.has(cat.name)) || [];

  const atsSuggestions = result.suggestions?.filter(s => atsFindingNames.has(s.category) || s.category === "Formatting" || s.category === "Role Fit") || [];
  const recruiterSuggestions = result.suggestions?.filter(s => !atsFindingNames.has(s.category) && s.category !== "Formatting" && s.category !== "Role Fit") || [];

  const hardSkills = result.keyword_matches?.filter(k => k.category === "Hard Skill") || [];
  const softSkills = result.keyword_matches?.filter(k => k.category === "Soft Skill") || [];
  const otherKeywords = result.keyword_matches?.filter(k => k.category === "Other") || [];

  return (
    <div className="flex flex-col xl:flex-row max-w-7xl mx-auto gap-0 xl:gap-8 p-4 md:p-6">
      {/* ── Left: Jobscan Style Report ── */}
      <div className="flex-1 min-w-0 order-2 xl:order-1">
        <motion.div variants={containerVariants} initial="hidden" animate="show">

          {/* Top Bar */}
          <motion.div variants={itemVariants} className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-3 flex-wrap">
              <Link href="/dashboard/upload" id="results-reanalyze-btn" className="btn-secondary text-sm flex items-center gap-2">
                <Search size={14} /> Scan Again
              </Link>
              {resumeText && <DownloadDropdown resumeText={workingText} />}
            </div>
          </motion.div>

          {/* 1. MATCH RATE (Hero) */}
          <motion.div variants={itemVariants} className="flex flex-col items-center justify-center mb-10 text-center py-6">
            <h1 className="font-display text-3xl font-bold text-white mb-2">Match Rate</h1>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
              This score represents how well your resume matches the job description based on ATS guidelines and recruiter preferences.
            </p>
            <ATSScoreRing score={result.ats_score} size={220} />
            {result.role_alignment_summary && (
              <p className="text-brand-300 text-sm mt-6 font-medium bg-brand-500/10 px-4 py-2 rounded-lg border border-brand-500/20 max-w-lg mx-auto">
                {result.role_alignment_summary}
              </p>
            )}
          </motion.div>

          {/* 2. ATS FINDINGS */}
          <motion.div variants={itemVariants} className="mb-10">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Search size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">ATS Findings</h2>
                <p className="text-sm text-slate-400">Searchability, parsing, and exact keyword matches.</p>
              </div>
            </div>
            <div className="space-y-3">
              {atsFindings.map(cat => (
                <ScoreCategoryCard
                  key={cat.name}
                  cat={cat}
                  resumeText={resumeText}
                  isActive={activeCategory === cat.name}
                  onActivate={() => setActiveCategory(cat.name)}
                />
              ))}
              {atsSuggestions.map((s) => (
                <SuggestionCard
                  key={s.issue}
                  s={s}
                  isActive={activeCategory === s.category}
                  onActivate={() => setActiveCategory(s.category)}
                />
              ))}
            </div>
          </motion.div>

          {/* 3. RECRUITER FINDINGS */}
          <motion.div variants={itemVariants} className="mb-10">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <UserCheck size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Recruiter Findings</h2>
                <p className="text-sm text-slate-400">Best practices, measurable results, and readability.</p>
              </div>
            </div>
            <div className="space-y-3">
              {recruiterFindings.map(cat => (
                <ScoreCategoryCard
                  key={cat.name}
                  cat={cat}
                  resumeText={resumeText}
                  isActive={activeCategory === cat.name}
                  onActivate={() => setActiveCategory(cat.name)}
                />
              ))}
              {recruiterSuggestions.map((s) => (
                <SuggestionCard
                  key={s.issue}
                  s={s}
                  isActive={activeCategory === s.category}
                  onActivate={() => setActiveCategory(s.category)}
                />
              ))}
            </div>
          </motion.div>

          {/* 4. SKILLS MATCH */}
          <motion.div variants={itemVariants} className="mb-10">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <BookOpen size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Skills Match</h2>
                <p className="text-sm text-slate-400">Missing these keywords lowers your match rate.</p>
              </div>
            </div>

            <SkillTable title="Hard Skills" skills={hardSkills} />
            <SkillTable title="Soft Skills" skills={softSkills} />
            <SkillTable title="Other Keywords" skills={otherKeywords} />
          </motion.div>

          {/* 5. BULLET REWRITES */}
          {(result.bullet_improvements?.length || 0) > 0 && (
            <motion.div variants={itemVariants} className="mb-10">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">AI Bullet Rewrites</h2>
                  <p className="text-sm text-slate-400">STAR-method improvements for your weakest points.</p>
                </div>
              </div>
              <BulletRewriter
                bullets={result.bullet_improvements}
                jobDescription={jobDescription}
                resumeText={resumeText}
                onApply={(updatedText) => setAppliedResumeText(updatedText)}
              />
            </motion.div>
          )}

        </motion.div>
      </div>

      {/* ── Right: Sticky Annotated Resume ── */}
      <aside className="w-full xl:w-[420px] shrink-0 xl:sticky xl:top-8 xl:self-start order-1 xl:order-2">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-surface-950/70 px-4 py-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-300">
                <FileText size={15} /> Annotated Resume
              </div>
              <p className="mt-1 text-sm text-slate-400">Issues are highlighted inline.</p>
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
            text={resumeText}
            title="Resume Markup"
            activeCategory={activeCategory}
          />
        </div>
      </aside>
    </div>
  );
}
