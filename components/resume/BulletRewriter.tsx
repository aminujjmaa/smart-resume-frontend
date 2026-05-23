"use client";
import { useState } from "react";
import { Copy, RefreshCw, Check, ChevronDown, ChevronUp } from "lucide-react";
import { analysisApi } from "@/lib/api";
import type { BulletImprovement } from "@/types";

interface Props {
  bullets: BulletImprovement[];
  jobDescription: string;
}

export default function BulletRewriter({ bullets, jobDescription }: Props) {
  const [items, setItems] = useState(bullets);
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<Record<number, boolean>>({});
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [idx]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [idx]: false })), 2000);
  };

  const regenerate = async (idx: number) => {
    setLoading((prev) => ({ ...prev, [idx]: true }));
    try {
      const res = await analysisApi.rewrite({
        bullet_point: items[idx].original,
        job_description: jobDescription,
      });
      setItems((prev) => prev.map((item, i) => i === idx ? { ...item, improved: res.data.improved } : item));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading((prev) => ({ ...prev, [idx]: false }));
    }
  };

  return (
    <div className="space-y-4">
      {items.map((bullet, idx) => {
        const isExpanded = expanded[idx] ?? true;
        return (
          <div key={idx} className="card">
            {/* Header */}
            <button
              className="w-full flex items-center justify-between mb-0 text-left"
              onClick={() => setExpanded((p) => ({ ...p, [idx]: !isExpanded }))}
            >
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Bullet {idx + 1}</span>
              {isExpanded ? <ChevronUp size={15} className="text-slate-500" /> : <ChevronDown size={15} className="text-slate-500" />}
            </button>

            {isExpanded && (
              <div className="mt-4 space-y-4 animate-fade-in">
                {/* Before */}
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
                  <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Before</p>
                  <p className="text-slate-300 text-sm leading-relaxed">{bullet.original}</p>
                </div>

                {/* After */}
                <div className="p-4 rounded-xl bg-accent-green/5 border border-accent-green/15">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-accent-green uppercase tracking-wider">After (AI Improved)</p>
                    <div className="flex items-center gap-2">
                      <button
                        id={`bullet-copy-${idx}`}
                        onClick={() => copyToClipboard(bullet.improved, idx)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                        title="Copy"
                      >
                        {copied[idx] ? <Check size={12} className="text-accent-green" /> : <Copy size={12} />}
                        {copied[idx] ? "Copied!" : "Copy"}
                      </button>
                      <button
                        id={`bullet-regen-${idx}`}
                        onClick={() => regenerate(idx)}
                        disabled={loading[idx]}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-brand-400 hover:text-brand-300 transition-all disabled:opacity-50"
                        style={{ background: "rgba(76,110,245,0.08)" }}
                        title="Regenerate"
                      >
                        <RefreshCw size={12} className={loading[idx] ? "animate-spin" : ""} />
                        {loading[idx] ? "Rewriting..." : "Regenerate"}
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed">{bullet.improved}</p>
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

                {(bullet.evidence_to_add?.length || 0) > 0 && (
                  <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Verify or add if true</p>
                    <div className="flex flex-wrap gap-2">
                      {bullet.evidence_to_add?.map((item) => (
                        <span key={item} className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-slate-300">
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
