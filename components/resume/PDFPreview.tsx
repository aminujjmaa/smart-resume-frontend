"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Download, RefreshCw, ToggleLeft, ToggleRight, AlertCircle, Terminal } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

type CompileStatus = "idle" | "compiling" | "done" | "error";

interface CompileState {
  status: CompileStatus;
  blobUrl: string | null;
  error: string | null;
  /** LaTeX source that is currently rendered in the iframe */
  compiledContent: string;
}

// S6759: Mark props as read-only
interface PDFPreviewProps {
  readonly content: string;
  readonly templateId: string;
}

// ── Helpers extracted to reduce cognitive complexity (S3776) ─────────────────

function recompileButtonClass(isCompiling: boolean, isOutdated: boolean): string {
  if (isCompiling) return "bg-brand-500/30 text-white/40 cursor-not-allowed";
  if (isOutdated)  return "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-700/30";
  return "bg-surface-800 hover:bg-surface-700 text-slate-200 border border-white/10";
}

function downloadButtonClass(disabled: boolean): string {
  if (disabled) return "bg-white/5 text-slate-500 cursor-not-allowed border border-white/8";
  return "bg-brand-500 hover:bg-brand-400 text-white shadow-lg";
}

// S3358: Extracted from nested ternary in status chip className
function statusChipClass(isCompiling: boolean, status: CompileStatus): string {
  if (isCompiling)           return "border-brand-500/40 bg-brand-500/10 text-brand-300";
  if (status === "done")     return "border-emerald-500/30 bg-emerald-500/8 text-emerald-400";
  if (status === "error")    return "border-rose-500/30 bg-rose-500/8 text-rose-400";
  return "border-white/8 text-slate-500";
}

// S3358: Extracted from nested ternary in status chip text
function statusChipText(isCompiling: boolean, status: CompileStatus): string {
  if (isCompiling)           return "● compiling";
  if (status === "done")     return "✓ compiled";
  if (status === "error")    return "✗ error";
  return "○ ready";
}

// S3358: Extracted from nested ternary in viewer area
type ViewerState = "error-no-blob" | "has-blob" | "loading";
function resolveViewerState(status: CompileStatus, blobUrl: string | null): ViewerState {
  if (status === "error" && !blobUrl) return "error-no-blob";
  if (blobUrl)                        return "has-blob";
  return "loading";
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PDFPreview({ content, templateId }: PDFPreviewProps) {
  const [autoCompile, setAutoCompile] = useState(true);
  const [showLog, setShowLog] = useState(false);
  const [compileLog, setCompileLog] = useState("");
  const [state, setState] = useState<CompileState>({
    status: "idle",
    blobUrl: null,
    error: null,
    compiledContent: "",
  });

  const prevBlobRef = useRef<string | null>(null);

  // ── Core compile function ──────────────────────────────────────────────────
  const compile = useCallback(async (source: string) => {
    if (!source.trim()) return;

    setState((s) => ({ ...s, status: "compiling", error: null }));
    setCompileLog("");

    try {
      const res = await fetch(`${API_BASE}/latex/compile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });

      if (!res.ok) {
        let detail = `HTTP ${res.status}`;
        try {
          const body = await res.json() as { detail?: string };
          detail = body?.detail ?? detail;
        } catch { /* ignore parse error */ }
        setCompileLog(detail);
        setState((s) => ({ ...s, status: "error", error: detail }));
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (prevBlobRef.current) URL.revokeObjectURL(prevBlobRef.current);
      prevBlobRef.current = url;

      setState({ status: "done", blobUrl: url, error: null, compiledContent: source });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error — is the backend running?";
      setCompileLog(msg);
      setState((s) => ({ ...s, status: "error", error: msg }));
    }
  }, []);

  // Compile on first mount
  useEffect(() => {
    compile(content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-compile when templateId changes
  useEffect(() => {
    compile(content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);
  // Auto-compile with debounce
  useEffect(() => {
    if (!autoCompile) return undefined;
    const t = setTimeout(() => compile(content), 1000);
    return () => clearTimeout(t);
  }, [content, autoCompile, compile]);
  // Cleanup blob on unmount
  useEffect(() => () => { if (prevBlobRef.current) URL.revokeObjectURL(prevBlobRef.current); }, []);

  // S7762: Use link.remove() instead of document.body.removeChild(link)
  const handleDownload = () => {
    if (!state.blobUrl) return;
    const link = document.createElement("a");
    link.href = state.blobUrl;
    link.download = `Resume_${templateId}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const isOutdated = content !== state.compiledContent && state.status !== "compiling";
  const isCompiling = state.status === "compiling";
  const viewerState = resolveViewerState(state.status, state.blobUrl);

  return (
    <div className="flex-1 flex flex-col h-full w-full relative bg-[#1a1a2e]">
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-white/8 bg-surface-950/70 shrink-0">
        <div className="flex items-center gap-2">
          {/* Recompile */}
          <button
            onClick={() => compile(content)}
            disabled={isCompiling}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${recompileButtonClass(isCompiling, isOutdated)}`}
          >
            <RefreshCw size={14} className={isCompiling ? "animate-spin" : ""} />
            {isCompiling ? "Compiling…" : "Recompile"}
          </button>

          {/* Auto-compile toggle */}
          <button
            onClick={() => setAutoCompile((v) => !v)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border border-white/8 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {autoCompile
              ? <ToggleRight size={18} className="text-brand-400" />
              : <ToggleLeft size={18} className="text-slate-500" />}
            Auto-compile
          </button>

          {/* Pending indicator */}
          {isOutdated && !isCompiling && (
            <span className="text-xs text-amber-400 flex items-center gap-1">
              {/* S6772: explicit space removed — gap-1 handles spacing */}
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-pulse" />
              <span>Changes pending</span>
            </span>
          )}

          {/* Compiler status chip — S3358: extracted to helper functions */}
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${statusChipClass(isCompiling, state.status)}`}>
            {statusChipText(isCompiling, state.status)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Log button */}
          {(state.status === "error" || compileLog) && (
            <button
              onClick={() => setShowLog((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-rose-500/30 bg-rose-500/8 text-rose-400 hover:bg-rose-500/15 transition-colors"
            >
              <Terminal size={13} />
              <span>{showLog ? "Hide" : "Show"} log</span>
            </button>
          )}

          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={!state.blobUrl || isCompiling}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${downloadButtonClass(!state.blobUrl || isCompiling)}`}
          >
            <Download size={14} />
            Export PDF
          </button>
        </div>
      </div>

      {/* ── Compiler log panel ── */}
      {showLog && compileLog && (
        <div className="shrink-0 max-h-40 overflow-auto bg-black/80 border-b border-rose-500/20 px-4 py-3">
          <pre className="text-xs text-rose-300 font-mono whitespace-pre-wrap leading-relaxed">
            {compileLog}
          </pre>
        </div>
      )}

      {/* ── PDF Viewer ── */}
      <div className="flex-1 overflow-hidden relative p-4">
        {/* Compiling overlay */}
        {isCompiling && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg">
            <div className="flex flex-col items-center gap-3 text-white">
              <RefreshCw size={26} className="animate-spin text-brand-400" />
              <span className="text-sm font-medium">Compiling with pdflatex…</span>
            </div>
          </div>
        )}

        {/* S3358: No nested ternaries — use resolved viewerState enum */}
        {viewerState === "error-no-blob" && (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
            <AlertCircle size={32} className="text-rose-400" />
            <div>
              <p className="text-rose-300 font-semibold text-sm mb-1">Compilation failed</p>
              <p className="text-slate-500 text-xs max-w-sm leading-relaxed">{state.error?.slice(0, 200)}</p>
            </div>
            <button
              onClick={() => setShowLog(true)}
              className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 transition-colors"
            >
              View full error log
            </button>
            <button
              onClick={() => compile(content)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {viewerState === "has-blob" && (
          <iframe
            key={state.blobUrl}
            src={`${state.blobUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full rounded-lg shadow-2xl bg-white"
            style={{ border: "none" }}
            title="PDF Preview"
          />
        )}

        {viewerState === "loading" && (
          <div className="h-full flex items-center justify-center gap-3 text-slate-500">
            <RefreshCw size={22} className="animate-spin text-brand-500" />
            <span className="text-sm">Starting compiler…</span>
          </div>
        )}
      </div>
    </div>
  );
}
