"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { publicToolsApi } from "@/lib/api";
import { track } from "@/lib/analytics";
import type { BulletCheckResult } from "@/types/growth";

const CHECK_LABELS: Record<string, string> = {
  strong_verb: "Starts with a strong action verb",
  measurable_result: "Has a measurable result",
  outcome_language: "Says what improved",
  context: "Names the system, tool or scope",
  no_weak_phrases: "No weak phrases (“responsible for”, “helped”)",
  good_length: "8–35 words",
};

function scoreColor(score: number): string {
  if (score >= 75) return "text-emerald-300 border-emerald-400/30 bg-emerald-400/10";
  if (score >= 45) return "text-amber-300 border-amber-400/30 bg-amber-400/10";
  return "text-red-300 border-red-400/30 bg-red-400/10";
}

export default function BulletCheckerClient() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<BulletCheckResult[] | null>(null);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await publicToolsApi.bulletCheck(input);
      setResults(res.data.results);
      setAverage(res.data.average_score);
      track("tool_used", { tool: "bullet_check", bullets: res.data.results.length });
    } catch (err) {
      const e = err as { response?: { status?: number } };
      setError(e.response?.status === 429 ? "You've used this tool a lot in the last hour — please try again later." : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
        <label htmlFor="bullets-input" className="mb-3 block text-sm font-medium text-slate-300">Your bullet points (one per line)</label>
        <textarea
          id="bullets-input"
          className="input min-h-48 resize-y font-mono text-sm"
          placeholder={"Responsible for maintaining the company website\nHelped the sales team with lead generation"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={6000}
        />
        <button type="button" onClick={run} disabled={input.trim().length < 10 || loading} className="btn-primary mt-4 justify-center px-8 py-3 disabled:opacity-40">
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Check my bullets"}
        </button>
        {error && <p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}
      </div>

      {results && (
        <div className="space-y-4" aria-live="polite">
          <p className="text-sm text-slate-400">
            Average score: <span className="font-bold text-white">{average}/100</span> across {results.length} bullets
          </p>
          {results.map((r) => (
            <div key={r.bullet} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-start gap-4">
                <span className={`shrink-0 rounded-lg border px-2.5 py-1 text-sm font-bold ${scoreColor(r.score)}`}>{r.score}</span>
                <p className="text-sm text-slate-200">{r.bullet}</p>
              </div>
              <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
                {Object.entries(r.checks).map(([key, ok]) => (
                  <li key={key} className="flex items-center gap-2 text-xs text-slate-400">
                    {ok ? <CheckCircle2 size={13} className="text-emerald-400" /> : <XCircle size={13} className="text-red-400" />}
                    {CHECK_LABELS[key] ?? key}
                  </li>
                ))}
              </ul>
              {r.rewrite && (
                <div className="mt-4 rounded-lg border border-teal-300/20 bg-teal-300/[0.06] p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-200">Stronger version</p>
                  <p className="mt-1 text-sm text-white">{r.rewrite}</p>
                </div>
              )}
              <p className="mt-3 text-xs text-slate-500">Verbs to try: {r.suggested_verbs.join(", ")}</p>
            </div>
          ))}
          <Link href="/scan" className="btn-primary inline-flex px-6 py-3">
            Check my whole resume <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
