"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { publicToolsApi } from "@/lib/api";
import { track } from "@/lib/analytics";
import { useAnalysisStore } from "@/store/useAppStore";
import type { JdKeyword } from "@/types/growth";

function apiError(err: unknown): string {
  const e = err as { response?: { status?: number; data?: { detail?: unknown } } };
  if (e.response?.status === 429) return "You've used this tool a lot in the last hour — please try again later.";
  return typeof e.response?.data?.detail === "string" ? e.response.data.detail : "Something went wrong. Please try again.";
}

export default function JdKeywordClient() {
  const router = useRouter();
  const { setJobDescription } = useAnalysisStore();
  const [jd, setJd] = useState("");
  const [keywords, setKeywords] = useState<JdKeyword[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await publicToolsApi.jdKeywords(jd);
      setKeywords(res.data.keywords);
      track("tool_used", { tool: "jd_keywords", count: res.data.keywords.length });
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  const checkResume = () => {
    setJobDescription(jd);
    router.push("/scan");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
        <label htmlFor="jd-input" className="mb-3 block text-sm font-medium text-slate-300">Job description</label>
        <textarea
          id="jd-input"
          className="input min-h-80 resize-y"
          placeholder="Paste the full job description here..."
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          maxLength={20000}
        />
        <button type="button" onClick={run} disabled={jd.trim().length < 40 || loading} className="btn-primary mt-4 w-full justify-center py-3 disabled:opacity-40">
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Extract keywords"}
        </button>
        {error && <p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}
      </div>

      <div className="rounded-lg border border-white/10 bg-[#08101c] p-5" aria-live="polite">
        {keywords === null ? (
          <p className="text-sm text-slate-500">Keywords will appear here.</p>
        ) : keywords.length === 0 ? (
          <p className="text-sm text-slate-400">We couldn&apos;t find clear skill keywords. Try pasting the full posting, including the requirements section.</p>
        ) : (
          <>
            <p className="mb-4 text-sm text-slate-400">{keywords.length} keywords found</p>
            <ul className="space-y-2">
              {keywords.map((k) => (
                <li key={k.keyword} className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white">{k.keyword}</span>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${k.importance === "required" ? "bg-red-500/15 text-red-300" : "bg-amber-500/15 text-amber-300"}`}>
                      {k.importance}
                    </span>
                    <span className="text-[11px] text-slate-500">{k.category}</span>
                  </div>
                  {k.evidence && k.evidence !== k.keyword && <p className="mt-1 text-xs italic text-slate-400">“{k.evidence}”</p>}
                </li>
              ))}
            </ul>
            <button type="button" onClick={checkResume} className="btn-primary mt-5 w-full justify-center py-3">
              Check my resume against this job <ArrowRight size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
