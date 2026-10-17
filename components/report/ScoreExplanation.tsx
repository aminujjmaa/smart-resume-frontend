"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Info } from "lucide-react";
import type { AnalysisResult } from "@/types";

function barColor(ratio: number): string {
  if (ratio >= 0.75) return "bg-emerald-400";
  if (ratio >= 0.5) return "bg-amber-400";
  return "bg-red-400";
}

/** "Why this score?" — every category's points plus any caps, straight from the rule engine. */
export default function ScoreExplanation({ result }: { readonly result: AnalysisResult }) {
  const [open, setOpen] = useState<string | null>(null);
  const categories = result.category_scores ?? [];
  const caps = result.caps_applied ?? [];
  if (categories.length === 0) return null;

  const total = categories.reduce((sum, c) => sum + c.score, 0);
  const max = categories.reduce((sum, c) => sum + c.max_score, 0);
  const weakest = [...categories].sort((a, b) => a.score / a.max_score - b.score / b.max_score);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5" aria-labelledby="why-score-heading">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 id="why-score-heading" className="font-display text-lg font-bold text-white">Why this score?</h2>
          <p className="mt-1 text-xs text-slate-400">
            {total}/{max} points across {categories.length} checks
            {max < 100 ? " (engineering-only checks skipped for this role, rescaled to 100)" : ""}.{" "}
            <Link href="/how-ats-score-works" className="text-teal-300 hover:underline">How scoring works</Link>
          </p>
        </div>
      </div>

      {caps.length > 0 && (
        <div className="mb-4 space-y-2">
          {caps.map((cap) => (
            <p key={cap.reason} className="flex gap-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.07] p-3 text-xs leading-5 text-amber-100">
              <Info size={14} className="mt-0.5 shrink-0" />
              {cap.reason}
            </p>
          ))}
        </div>
      )}

      <ul className="space-y-2">
        {weakest.map((c) => {
          const ratio = c.max_score ? c.score / c.max_score : 0;
          const isOpen = open === c.name;
          return (
            <li key={c.name} className="rounded-lg border border-white/5 bg-surface-950/40">
              <button
                type="button"
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
                onClick={() => setOpen(isOpen ? null : c.name)}
                aria-expanded={isOpen}
              >
                <span className="flex-1 text-sm text-slate-200">{c.name}</span>
                <span className="w-16 text-right text-xs tabular-nums text-slate-400">
                  {c.score}/{c.max_score}
                </span>
                <span className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-800">
                  <span className={`block h-full ${barColor(ratio)}`} style={{ width: `${Math.round(ratio * 100)}%` }} />
                </span>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="space-y-2 px-3 pb-3 text-xs leading-5">
                  <p className="text-slate-400">{c.why}</p>
                  <p className="text-teal-200">{c.how_to_improve}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
