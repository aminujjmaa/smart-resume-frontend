"use client";
import { useState, useEffect, useRef } from "react";
import { Copy, RefreshCw, Check, ChevronDown, ChevronUp, Lock, CheckCheck, AlertCircle } from "lucide-react";
import { analysisApi } from "@/lib/api";
import { useAuthStore } from "@/store/useAppStore";
import type { BulletSuggestion } from "@/types";
import Link from "next/link";
import { isPro } from "@/lib/entitlements";

interface Props {
  readonly bullets: BulletSuggestion[];
  readonly jobDescription: string;
  /** The report's id: lets the API use its stored job description when none is in memory. */
  readonly analysisId?: string;
  readonly resumeText: string;
  readonly onApply: (newResumeText: string, originalLine: string, rewrittenLine: string) => void;
  readonly activeHighlight?: string | null;
}

function normalizeLine(val: string) {
  return val.trim().replace(/^(?:[•▪◦\-*]|\d+[.)]) +/, "").replace(/\s+/g, " ").toLowerCase();
}

function fuzzyReplace(text: string, search: string, replacement: string): { newText: string, matched: boolean } {
  if (text.includes(search)) {
    return { newText: text.replace(search, replacement), matched: true };
  }
  const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const tokens = search.trim().split(/\s+/).map(escapeRegex);
  if (tokens.length === 0) return { newText: text, matched: false };
  
  const pattern = new RegExp(tokens.join('\\s+'));
  if (pattern.test(text)) {
    return { newText: text.replace(pattern, replacement), matched: true };
  }
  return { newText: text, matched: false };
}

export default function BulletRewriter({ bullets, jobDescription, analysisId, resumeText, onApply, activeHighlight }: Props) {
  const [items, setItems] = useState(bullets);
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<Record<number, boolean>>({});
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [applied, setApplied] = useState<Record<number, boolean>>({});
  const { user } = useAuthStore();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Auto-scroll to and highlight the card that matches activeHighlight
  useEffect(() => {
    if (!activeHighlight) return;
    const idx = items.findIndex(
      (b) => normalizeLine(b.original) === normalizeLine(activeHighlight)
    );
    if (idx !== -1 && cardRefs.current[idx]) {
      cardRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "center" });
      setExpanded((p) => ({ ...p, [idx]: true }));
    }
  }, [activeHighlight, items]);
  const isPremium = isPro(user);

  const appliedCount = Object.values(applied).filter(Boolean).length;

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [idx]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [idx]: false })), 2000);
  };

  const regenerate = async (idx: number) => {
    if (!isPremium) return;
    setLoading((prev) => ({ ...prev, [idx]: true }));
    setErrors((prev) => ({ ...prev, [idx]: "" }));
    if (applied[idx]) setApplied((prev) => ({ ...prev, [idx]: false }));
    try {
      const res = await analysisApi.rewrite({
        bullet_point: items[idx].original,
        job_description: jobDescription || undefined,
        analysis_id: jobDescription ? undefined : analysisId,
      });
      setItems((prev) =>
        prev.map((item, i) =>
          i === idx ? { ...item, rewritten: res.data.improved } : item
        )
      );
    } catch (e: unknown) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      let msg = "Rewrite failed. Please try again.";
      if (status === 403) msg = "Upgrade to Pro to regenerate bullets with AI.";
      else if (status === 429) msg = "Too many requests. Please wait a moment.";
      setErrors((prev) => ({ ...prev, [idx]: msg }));
    } finally {
      setLoading((prev) => ({ ...prev, [idx]: false }));
    }
  };

  const applyToResume = (idx: number) => {
    const original = items[idx].original;
    const rewritten = items[idx].rewritten;
    
    if (applied[idx]) {
      // Un-apply
      const { newText, matched } = fuzzyReplace(resumeText, rewritten, original);
      if (matched) {
        setApplied((prev) => ({ ...prev, [idx]: false }));
        onApply(newText, rewritten, original);
      } else {
        alert("Could not find the applied text to undo. You may have manually edited it.");
      }
    } else {
      // Apply
      const { newText, matched } = fuzzyReplace(resumeText, original, rewritten);
      if (matched) {
        setApplied((prev) => ({ ...prev, [idx]: true }));
        onApply(newText, original, rewritten);
      } else {
        alert("Could not find the original text to apply. You may have manually edited it.");
      }
    }
  };

  const applyAll = () => {
    let currentText = resumeText;
    const newApplied: Record<number, boolean> = { ...applied };
    let lastOriginal = "";
    let lastRewritten = "";
    
    items.forEach((item, i) => {
      if (item.applicable && !applied[i]) {
        const { newText, matched } = fuzzyReplace(currentText, item.original, item.rewritten);
        if (matched) {
          currentText = newText;
          newApplied[i] = true;
          lastOriginal = item.original;
          lastRewritten = item.rewritten;
        }
      }
    });
    
    setApplied(newApplied);
    if (lastOriginal) {
      onApply(currentText, lastOriginal, lastRewritten);
    }
  };

  if (!items.length) return null;

  return (
    <div className="space-y-4">
      {/* Apply All banner */}
      {appliedCount > 0 ? (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-4 py-3">
          <span className="flex items-center gap-2 text-sm font-medium text-emerald-300">
            <CheckCheck size={16} />
            {appliedCount} of {items.length} improvement{appliedCount === 1 ? "" : "s"} applied to your resume
          </span>
          <span className="text-xs text-emerald-400/70">Download will include these changes</span>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <span className="text-sm text-slate-400">
            Apply improvements to update your resume before downloading.
          </span>
          <button
            onClick={applyAll}
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-brand-500/10"
          >
            Apply All
          </button>
        </div>
      )}

      {items.map((bullet, idx) => {
        const isExpanded = expanded[idx] ?? true;
        const isApplied = applied[idx] ?? false;
        const isActiveHighlight = !!activeHighlight && normalizeLine(bullet.original) === normalizeLine(activeHighlight);
        return (
          <div
            key={bullet.original}
            ref={(el) => { cardRefs.current[idx] = el; }}
            className={`card transition-all duration-300 ${
              isApplied ? "border-emerald-500/30 bg-emerald-500/[0.04]" : ""
            } ${
              isActiveHighlight ? "ring-2 ring-brand-400/40 shadow-[0_0_16px_rgba(99,102,241,0.18)]" : ""
            }`}
          >
            {/* Header */}
            <button
              className="w-full flex items-center justify-between text-left"
              onClick={() => setExpanded((p) => ({ ...p, [idx]: !isExpanded }))}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  {bullet.section} · Bullet {idx + 1}
                </span>
                {bullet.needs_user_input && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/25 px-2 py-0.5 rounded-full">
                    <AlertCircle size={9} /> Add metric
                  </span>
                )}
                {isApplied && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 rounded-full">
                    <Check size={9} /> Applied
                  </span>
                )}
              </div>
              {isExpanded ? (
                <ChevronUp size={15} className="text-slate-500" />
              ) : (
                <ChevronDown size={15} className="text-slate-500" />
              )}
            </button>

            {isExpanded && (
              <div className="mt-4 space-y-4 animate-fade-in">
                {/* Reason */}
                <p className="text-xs text-slate-500 italic">{bullet.reason}</p>

                {/* Before */}
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
                  <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Original</p>
                  <p className={`text-sm leading-relaxed ${isApplied ? "line-through text-slate-500" : "text-slate-300"}`}>
                    {bullet.original}
                  </p>
                </div>

                {/* After */}
                <div className={`p-4 rounded-xl border transition-all duration-200 ${isApplied ? "bg-emerald-500/10 border-emerald-500/25" : "bg-accent-green/5 border-accent-green/15"}`}>
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <p className="text-xs font-semibold text-accent-green uppercase tracking-wider">
                      {bullet.needs_user_input ? "Rewritten — add metric below" : "AI-Improved"}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Copy */}
                      <button
                        id={`bullet-copy-${idx}`}
                        onClick={() => copyToClipboard(bullet.rewritten, idx)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                        title="Copy rewritten bullet"
                      >
                        {copied[idx] ? <Check size={11} className="text-accent-green" /> : <Copy size={11} />}
                        {copied[idx] ? "Copied" : "Copy"}
                      </button>

                      {/* Apply */}
                      {bullet.applicable && (
                        <button
                          id={`bullet-apply-${idx}`}
                          onClick={() => applyToResume(idx)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            isApplied
                              ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                              : "bg-brand-500/15 border border-brand-500/25 text-brand-300 hover:bg-brand-500/25"
                          }`}
                          title={isApplied ? "Click to undo" : "Apply this improvement to your resume"}
                        >
                          {isApplied ? (
                            <><CheckCheck size={11} /> Applied</>
                          ) : (
                            <><Check size={11} /> Apply</>
                          )}
                        </button>
                      )}

                      {/* Regenerate (Pro only) */}
                      {isPremium ? (
                        <button
                          id={`bullet-regen-${idx}`}
                          onClick={() => regenerate(idx)}
                          disabled={loading[idx]}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all disabled:opacity-50"
                          style={{ background: "rgba(255,255,255,0.05)" }}
                          title="Regenerate with AI"
                        >
                          <RefreshCw size={11} className={loading[idx] ? "animate-spin" : ""} />
                          {loading[idx] ? "…" : "Regen"}
                        </button>
                      ) : (
                        <Link
                          href="/dashboard/billing"
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-amber-400/70 hover:text-amber-300 transition-all"
                          style={{ background: "rgba(245,158,11,0.06)" }}
                          title="Upgrade to Pro to regenerate"
                        >
                          <Lock size={11} /> Pro
                        </Link>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-200 text-sm leading-relaxed">{bullet.rewritten}</p>

                  {errors[idx] && (
                    <p className="mt-2 text-xs text-red-400 font-medium">{errors[idx]}</p>
                  )}

                  {bullet.needs_user_input && (
                    <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <p className="text-xs text-amber-300 font-medium">
                        ⚠️ Add a real metric here — check your logs, tickets, or project records for the actual number.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
