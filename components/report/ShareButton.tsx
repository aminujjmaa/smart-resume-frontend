"use client";
import { useState } from "react";
import { Check, Copy, ExternalLink, Loader2, MessageCircle, Share2 } from "lucide-react";
import { analysisApi } from "@/lib/api";
import { track } from "@/lib/analytics";

/** Opt-in public score card: shares the score only, never resume content. */
export default function ShareButton({ jobId, score }: { readonly jobId: string; readonly score: number }) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const create = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await analysisApi.share(jobId);
      setUrl(`${window.location.origin}/score/${res.data.share_id}`);
      track("share_created", { score });
    } catch {
      setError("Couldn't create a share link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!url) {
    return (
      <div className="flex flex-col gap-1">
        <button type="button" onClick={create} disabled={loading} className="btn-secondary text-sm gap-2">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Share2 size={14} />}
          Share my score
        </button>
        <p className="text-[11px] text-slate-500">Only your score is shared — never your resume.</p>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }

  const message = `My resume scored ${score}/100 on the SmartResume AI ATS checker. Check yours free:`;
  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        className="btn-secondary text-sm gap-2"
        href={`https://wa.me/?text=${encodeURIComponent(`${message} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle size={14} /> WhatsApp
      </a>
      <a
        className="btn-secondary text-sm gap-2"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ExternalLink size={14} /> LinkedIn
      </a>
      <button type="button" onClick={copy} className="btn-secondary text-sm gap-2">
        {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
