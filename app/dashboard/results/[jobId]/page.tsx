"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { analysisApi } from "@/lib/api";
import { useAnalysisStore } from "@/store/useAppStore";
import ATSScoreRing from "@/components/resume/ATSScoreRing";
import BulletRewriter from "@/components/resume/BulletRewriter";
import ResumeEditor from "@/components/resume/ResumeEditor";
import SkillTable from "@/components/resume/SkillTable";
import { buildResumeAnnotations } from "@/lib/resumeAnnotations";
import { downloadPDFFromText, downloadDOCX } from "@/lib/downloadResume";
import {
  ArrowLeft, AlertTriangle, ChevronDown, ChevronUp,
  FileText, Download, FileDown, Loader2, BookOpen, Zap, Search,
  Wand2, ShieldAlert, Edit3,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, Variants } from "framer-motion";
import type {
  Analysis, AnalysisResult, MissingKeyword,
  FormattingRisk, ResumeAnnotation,
} from "@/types";

// ── Animation variants ─────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 25 } },
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function pctToGradient(pct: number) {
  if (pct >= 70) return "from-emerald-500 to-emerald-400";
  if (pct >= 45) return "from-amber-500 to-amber-400";
  return "from-red-500 to-red-400";
}



// ── Score bar ──────────────────────────────────────────────────────────────────
function ScoreBar({ label, pct }: { readonly label: string; readonly pct: number }) {
  const color = pctToGradient(pct);
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-xs text-slate-300">{label}</span>
        <span className="text-xs text-slate-500">{pct}%</span>
      </div>
      <div className="w-full bg-surface-800 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full bg-gradient-to-r ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Section nav pill ───────────────────────────────────────────────────────────
function NavPill({ label, icon, onClick, active }: {
  readonly label: string;
  readonly icon: React.ReactNode;
  readonly onClick: () => void;
  readonly active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all ${
        active
          ? "bg-brand-500/15 text-brand-300 border border-brand-500/25"
          : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ── Download dropdown ──────────────────────────────────────────────────────────
function DownloadDropdown({ resumeText }: { readonly resumeText: string }) {
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState<"pdf" | "docx" | null>(null);
  const ref                    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handlePDF = async () => {
    setLoading("pdf"); setOpen(false);
    try { await downloadPDFFromText(resumeText, "smartresume-optimized.pdf"); }
    catch { alert("PDF generation failed."); }
    finally { setLoading(null); }
  };

  const handleDOCX = async () => {
    setLoading("docx"); setOpen(false);
    try { await downloadDOCX(resumeText, "smartresume-optimized.docx"); }
    catch { alert("DOCX generation failed."); }
    finally { setLoading(null); }
  };

  function getDownloadLabel(): string {
    if (loading === "pdf") return "Generating PDF…";
    if (loading === "docx") return "Generating DOCX…";
    return "Download Resume";
  }
  const btnLabel = getDownloadLabel();

  return (
    <div className="relative" ref={ref}>
      <button
        id="results-download-btn"
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={!!loading}
        className="btn-primary shrink-0 gap-2 text-sm"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        {btnLabel}
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-white/10 bg-slate-900 shadow-2xl z-50 overflow-hidden animate-fade-in">
          <button onClick={handlePDF} className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-white/5 transition-colors">
            <FileDown size={15} className="text-red-400 shrink-0" />
            <div className="text-left">
              <p className="font-medium">Download PDF</p>
              <p className="text-xs text-slate-500">ATS-friendly single-column PDF</p>
            </div>
          </button>
          <div className="h-px bg-white/5 mx-3" />
          <button onClick={handleDOCX} className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-white/5 transition-colors">
            <FileDown size={15} className="text-blue-400 shrink-0" />
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

// ── Formatting risk card ───────────────────────────────────────────────────────
function FormattingRiskCard({ risk, isActive, onActivate }: {
  readonly risk: FormattingRisk;
  readonly isActive?: boolean;
  readonly onActivate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      className={`rounded-xl border p-4 w-full text-left mb-2 border-orange-500/30 bg-orange-500/5 transition-all ${isActive ? "ring-2 ring-brand-500" : ""}`}
      onClick={() => { setOpen(!open); onActivate?.(); }}
    >
      <div className="flex items-start gap-3">
        <ShieldAlert size={15} className="text-orange-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Formatting Risk</span>
            {open ? <ChevronUp size={12} className="text-slate-500 shrink-0" /> : <ChevronDown size={12} className="text-slate-500 shrink-0" />}
          </div>
          <p className="text-sm text-slate-200 mt-1 leading-relaxed">{risk.issue}</p>
        </div>
      </div>
      {open && (
        <div className="mt-3 pt-3 border-t border-white/5 space-y-2 animate-fade-in">
          <p className="text-xs text-slate-300"><span className="font-medium text-blue-300">Why it matters: </span>{risk.why_it_matters}</p>
          <p className="text-xs text-slate-300"><span className="font-medium text-brand-400">Fix: </span>{risk.fix}</p>
        </div>
      )}
    </button>
  );
}

// ── Missing keyword row ────────────────────────────────────────────────────────
function MissingKeywordRow({ kw }: { readonly kw: MissingKeyword }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
          kw.importance === "required"
            ? "bg-red-500/15 text-red-400 border-red-500/25"
            : "bg-amber-500/15 text-amber-400 border-amber-500/25"
        }`}>
          {kw.importance}
        </span>
        <span className="text-sm font-medium text-slate-200">{kw.keyword}</span>
      </div>
      <span className="text-xs text-slate-500 italic shrink-0 max-w-[160px] text-right">
        &ldquo;{kw.jd_evidence}&rdquo;
      </span>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { jobDescription, appliedResumeText, setAppliedResumeText } = useAnalysisStore();

  // Right-panel state
  const [activeTab,       setActiveTab]       = useState<"fixes" | "keywords" | "bullets">("bullets");
  const [activeCategory,  setActiveCategory]  = useState<string | null>(null);
  // Editor sync state
  const [activeHighlight,  setActiveHighlight]  = useState<string | null>(null);
  const [recentlyApplied,  setRecentlyApplied]  = useState<Set<string>>(new Set());

  // Section refs for scroll-to
  const fixesRef    = useRef<HTMLDivElement>(null);
  const kwRef       = useRef<HTMLDivElement>(null);
  const bulletsRef  = useRef<HTMLDivElement>(null);
  const skillsRef   = useRef<HTMLDivElement>(null);

  const { data: analysis, isLoading, error } = useQuery<Analysis>({
    queryKey: ["analysis", jobId],
    queryFn:  () => analysisApi.getResult(jobId).then((r) => r.data),
    refetchInterval: (query) => {
      const s = query.state.data?.status;
      if (!s || s === "done" || s === "failed") return false;
      return 3000;
    },
    enabled: !!jobId,
    staleTime: 5000,
  });

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleAnnotationClick = useCallback((annotation: ResumeAnnotation) => {
    setActiveHighlight(annotation.original);
    // Determine which tab to open
    setActiveTab("bullets"); // default
    setActiveCategory(annotation.tags?.[0] ?? null);
  }, []);

  const handleApply = useCallback((updatedText: string, originalLine: string, rewrittenLine: string) => {
    setAppliedResumeText(updatedText);
    setRecentlyApplied((prev) => new Set(Array.from(prev).concat(rewrittenLine)));
    setTimeout(() => {
      setRecentlyApplied((prev) => {
        const next = new Set(prev);
        next.delete(rewrittenLine);
        return next;
      });
    }, 2500);
  }, [setAppliedResumeText]);

  const handleEditorTextChange = useCallback((newText: string) => {
    setAppliedResumeText(newText);
  }, [setAppliedResumeText]);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Loading / error states ───────────────────────────────────────────────────
  if (isLoading || analysis?.status === "processing" || analysis?.status === "pending") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
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

  const annotations  = buildResumeAnnotations(result);
  const resumeText   = analysis.resume_text || "";
  const workingText  = appliedResumeText || resumeText;

  const hardSkills      = result.keyword_matches?.filter((k) => k.category === "Hard Skill") || [];
  const softSkills      = result.keyword_matches?.filter((k) => k.category === "Soft Skill") || [];
  const otherKeywords   = result.keyword_matches?.filter((k) => k.category === "Other") || [];
  const requiredMissing = (result.missing_keywords || []).filter((k) => k.importance === "required");
  const preferredMissing = (result.missing_keywords || []).filter((k) => k.importance === "preferred");

  const hasFixes    = (result.formatting_risks?.length || 0) > 0;
  const hasKeywords = (result.missing_keywords?.length || 0) > 0;
  const hasBullets  = (result.bullet_suggestions?.length || 0) > 0;

  return (
    <div className="flex min-h-screen bg-surface-950">

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* LEFT SIDEBAR — Score + Navigation                                     */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <aside className="hidden xl:flex flex-col w-[264px] shrink-0 border-r border-white/8 sticky top-0 h-screen overflow-y-auto p-4 gap-5">
        {/* Score ring */}
        <div className="flex flex-col items-center pt-4">
          <ATSScoreRing score={result.ats_score} size={140} />
          {result.seniority_signal && (
            <span className="mt-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/20">
              {result.seniority_signal}
            </span>
          )}
        </div>

        {/* Breakdown bars */}
        <div className="card p-4">
          <ScoreBar label="Keyword Match"    pct={result.score_breakdown?.keyword_match_pct ?? 0} />
          <ScoreBar label="Experience Impact" pct={result.score_breakdown?.experience_impact_pct ?? 0} />
          <ScoreBar label="Formatting & ATS" pct={result.score_breakdown?.formatting_score_pct ?? 0} />
        </div>

        {/* Section navigation */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-3 mb-2">Sections</p>
          {hasBullets  && <NavPill label="Bullet Rewrites"   icon={<AlertTriangle size={13} />} onClick={() => { setActiveTab("bullets"); scrollTo(bulletsRef); }} active={activeTab === "bullets"} />}
          {hasKeywords && <NavPill label="Missing Keywords"  icon={<Wand2 size={13} />}          onClick={() => { setActiveTab("keywords"); scrollTo(kwRef); }}      active={activeTab === "keywords"} />}
          {hasFixes    && <NavPill label="Formatting Risks"  icon={<ShieldAlert size={13} />}    onClick={() => { setActiveTab("fixes"); scrollTo(fixesRef); }}      active={activeTab === "fixes"} />}
          <NavPill       label="Skills Match"       icon={<BookOpen size={13} />}     onClick={() => scrollTo(skillsRef)} />
        </div>

        {/* Back link */}
        <div className="mt-auto pt-4 border-t border-white/8">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-white text-xs transition-colors">
            <ArrowLeft size={13} /> Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* CENTER — Live Resume Editor                                           */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 min-w-0 flex flex-col p-4 md:p-6 gap-4">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="xl:hidden flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
              <ArrowLeft size={15} /> Dashboard
            </Link>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-300">
              <FileText size={14} />
              <span>Live Resume Editor</span>
            </div>
            <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-200">
              {annotations.length} issues
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/dashboard/upload" id="results-reanalyze-btn" className="btn-secondary text-sm flex items-center gap-2">
              <Search size={13} /> Scan Again
            </Link>
            {resumeText && <DownloadDropdown resumeText={workingText} />}
          </div>
        </div>

        {/* Hint banner */}
        <div className="flex items-center gap-2 rounded-xl border border-brand-500/20 bg-brand-500/5 px-4 py-2.5 text-xs text-brand-200">
          <Edit3 size={13} className="shrink-0 text-brand-400" />
          <span>Click any <span className="font-semibold text-white">highlighted line</span> to see the suggestion in the panel. Switch to <span className="font-semibold text-white">Edit mode</span> to make your own changes.</span>
        </div>

        {/* Editor */}
        <ResumeEditor
          text={workingText}
          annotations={annotations}
          onTextChange={handleEditorTextChange}
          activeHighlight={activeHighlight}
          onAnnotationClick={handleAnnotationClick}
          recentlyApplied={recentlyApplied}
        />

        {/* Skills (bottom of center) */}
        <div ref={skillsRef} className="mt-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BookOpen size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Skills Match</h2>
              <p className="text-xs text-slate-400">Matched vs missing keywords.</p>
            </div>
          </div>
          <SkillTable title="Hard Skills"    skills={hardSkills} />
          <SkillTable title="Soft Skills"    skills={softSkills} />
          <SkillTable title="Other Keywords" skills={otherKeywords} />
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* RIGHT PANEL — Tabbed Suggestions                                      */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <aside className="hidden lg:flex flex-col w-[380px] shrink-0 border-l border-white/8 sticky top-0 h-screen overflow-y-auto">
        {/* Tab bar */}
        <div className="flex border-b border-white/10 bg-surface-950/80 sticky top-0 z-10">
          {hasBullets && (
            <button
              type="button"
              onClick={() => { setActiveTab("bullets"); scrollTo(bulletsRef); }}
              className={`flex-1 py-3 text-xs font-semibold transition-colors ${activeTab === "bullets" ? "text-brand-300 border-b-2 border-brand-400" : "text-slate-500 hover:text-slate-300"}`}
            >
              ✍ Bullets {result.bullet_suggestions?.length ? `(${result.bullet_suggestions.length})` : ""}
            </button>
          )}
          {hasKeywords && (
            <button
              type="button"
              onClick={() => { setActiveTab("keywords"); scrollTo(kwRef); }}
              className={`flex-1 py-3 text-xs font-semibold transition-colors ${activeTab === "keywords" ? "text-brand-300 border-b-2 border-brand-400" : "text-slate-500 hover:text-slate-300"}`}
            >
              🔑 Keywords {requiredMissing.length ? `(${requiredMissing.length}!)` : ""}
            </button>
          )}
          {hasFixes && (
            <button
              type="button"
              onClick={() => { setActiveTab("fixes"); scrollTo(fixesRef); }}
              className={`flex-1 py-3 text-xs font-semibold transition-colors ${activeTab === "fixes" ? "text-brand-300 border-b-2 border-brand-400" : "text-slate-500 hover:text-slate-300"}`}
            >
              ⚡ Fixes {result.formatting_risks?.length ? `(${result.formatting_risks.length})` : ""}
            </button>
          )}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-4">

          {/* Priority Fixes (always shown at top of bullets tab) */}
          {activeTab === "bullets" && (result.priority_fixes?.length || 0) > 0 && (
            <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-5">
              <div className="card p-4 border-brand-500/25 bg-brand-500/5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={14} className="text-brand-400" />
                  <h3 className="text-sm font-bold text-white">Priority Fixes</h3>
                </div>
                <ol className="space-y-2">
                  {result.priority_fixes.map((fix, i) => (
                    <li key={fix} className="flex items-start gap-2">
                      <span className="shrink-0 w-4 h-4 rounded-full bg-brand-500/20 text-brand-400 text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                      <p className="text-xs text-slate-200 leading-relaxed">{fix}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          )}

          {/* Bullets tab */}
          {activeTab === "bullets" && hasBullets && (
            <div ref={bulletsRef}>
              <BulletRewriter
                bullets={result.bullet_suggestions}
                jobDescription={jobDescription}
                resumeText={workingText}
                onApply={handleApply}
                activeHighlight={activeHighlight}
              />
            </div>
          )}

          {/* Keywords tab */}
          {activeTab === "keywords" && (
            <div ref={kwRef}>
              {requiredMissing.length > 0 && (
                <div className="mb-4 card p-4">
                  <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3">Required ({requiredMissing.length})</p>
                  {requiredMissing.map((kw) => <MissingKeywordRow key={kw.keyword} kw={kw} />)}
                </div>
              )}
              {preferredMissing.length > 0 && (
                <div className="card p-4">
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">Preferred ({preferredMissing.length})</p>
                  {preferredMissing.map((kw) => <MissingKeywordRow key={kw.keyword} kw={kw} />)}
                </div>
              )}
            </div>
          )}

          {/* Fixes tab */}
          {activeTab === "fixes" && hasFixes && (
            <div ref={fixesRef}>
              {result.formatting_risks.map((risk) => (
                <FormattingRiskCard
                  key={risk.issue}
                  risk={risk}
                  isActive={activeCategory === risk.issue}
                  onActivate={() => setActiveCategory(risk.issue)}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {activeTab === "bullets" && !hasBullets && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertTriangle size={28} className="text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm">No bullet rewrites needed.</p>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile: suggestions below editor */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-white/10 bg-surface-950/95 backdrop-blur-sm">
        <div className="flex">
          {hasBullets   && <button type="button" onClick={() => setActiveTab("bullets")}  className={`flex-1 py-3 text-xs font-semibold ${activeTab === "bullets"  ? "text-brand-300" : "text-slate-500"}`}>✍ Bullets</button>}
          {hasKeywords  && <button type="button" onClick={() => setActiveTab("keywords")} className={`flex-1 py-3 text-xs font-semibold ${activeTab === "keywords" ? "text-brand-300" : "text-slate-500"}`}>🔑 Keywords</button>}
          {hasFixes     && <button type="button" onClick={() => setActiveTab("fixes")}    className={`flex-1 py-3 text-xs font-semibold ${activeTab === "fixes"    ? "text-brand-300" : "text-slate-500"}`}>⚡ Fixes</button>}
        </div>
      </div>
    </div>
  );
}
