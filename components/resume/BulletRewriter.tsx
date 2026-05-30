"use client";
import { useState } from "react";
import { Copy, RefreshCw, Check, ChevronDown, ChevronUp, Lock, CheckCheck } from "lucide-react";
import { analysisApi } from "@/lib/api";
import { useAuthStore } from "@/store/useAppStore";
import type { BulletImprovement } from "@/types";
import Link from "next/link";

interface Props {
  readonly bullets: BulletImprovement[];
  readonly jobDescription: string;
  readonly resumeText: string;
  readonly onApply: (updatedText: string) => void;
}

export default function BulletRewriter({ bullets, jobDescription, resumeText, onApply }: Props) {
  const [items, setItems] = useState(bullets);
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<Record<number, boolean>>({});
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  // Track which bullets have been applied to the resume text
  const [applied, setApplied] = useState<Record<number, boolean>>({});
  const { user } = useAuthStore();
  const isPremium = user?.plan === "premium";

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
    // If this bullet was already applied, unapply it first since it will change
    if (applied[idx]) {
      setApplied((prev) => ({ ...prev, [idx]: false }));
    }
    try {
      const res = await analysisApi.rewrite({
        bullet_point: items[idx].original,
        job_description: jobDescription,
      });
      setItems((prev) =>
        prev.map((item, i) =>
          i === idx ? { ...item, improved: res.data.improved } : item
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

  /**
   * Apply a single improved bullet to the working resume text.
   * Does a simple string replace: original → improved.
   */
  const applyToResume = (idx: number) => {
    const original = items[idx].original;
    const improved = items[idx].improved;

    // Build current "working" text — start from resumeText,
    // then replay all currently-applied improvements.
    let workingText = resumeText;
    items.forEach((item, i) => {
      if (i !== idx && applied[i]) {
        workingText = workingText.replace(item.original, item.improved);
      }
    });

    // Toggle: if already applied, revert; otherwise apply
    if (applied[idx]) {
      setApplied((prev) => ({ ...prev, [idx]: false }));
      onApply(workingText);
    } else {
      workingText = workingText.replace(original, improved);
      setApplied((prev) => ({ ...prev, [idx]: true }));
      onApply(workingText);
    }
  };

  const applyAll = () => {
    let workingText = resumeText;
    const newApplied: Record<number, boolean> = {};
    items.forEach((item, i) => {
      workingText = workingText.replace(item.original, item.improved);
      newApplied[i] = true;
    });
    setApplied(newApplied);
    onApply(workingText);
  };

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
        return (
          <div
            key={bullet.original}
            className={`card transition-all duration-200 ${isApplied ? "border-emerald-500/30 bg-emerald-500/[0.04]" : ""}`}
          >
            {/* Header */}
            <button
              className="w-full flex items-center justify-between text-left"
              onClick={() => setExpanded((p) => ({ ...p, [idx]: !isExpanded }))}
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  Bullet {idx + 1}
                </span>
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
                {/* Before */}
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
                  <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
                    Original
                  </p>
                  <p className={`text-sm leading-relaxed ${isApplied ? "line-through text-slate-500" : "text-slate-300"}`}>
                    {bullet.original}
                  </p>
                </div>

                {/* After */}
                <div className={`p-4 rounded-xl border transition-all duration-200 ${isApplied ? "bg-emerald-500/10 border-emerald-500/25" : "bg-accent-green/5 border-accent-green/15"}`}>
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <p className="text-xs font-semibold text-accent-green uppercase tracking-wider">
                      AI-Improved
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Copy */}
                      <button
                        id={`bullet-copy-${idx}`}
                        onClick={() => copyToClipboard(bullet.improved, idx)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                        title="Copy improved bullet"
                      >
                        {copied[idx] ? <Check size={11} className="text-accent-green" /> : <Copy size={11} />}
                        {copied[idx] ? "Copied" : "Copy"}
                      </button>

                      {/* Apply to Resume */}
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

                  <p className="text-slate-200 text-sm leading-relaxed">{bullet.improved}</p>

                  {errors[idx] && (
                    <p className="mt-2 text-xs text-red-400 font-medium">{errors[idx]}</p>
                  )}

                  {(bullet.why_stronger?.length || 0) > 0 && (
                    <ul className="mt-3 space-y-1">
                      {bullet.why_stronger?.map((reason) => (
                        <li key={reason} className="flex items-start gap-2 text-xs text-slate-400">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-green" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Evidence chips */}
                {(bullet.evidence_to_add?.length || 0) > 0 && (
                  <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Add if true (strengthens the bullet)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {bullet.evidence_to_add?.map((item) => (
                        <span
                          key={item}
                          className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-slate-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
