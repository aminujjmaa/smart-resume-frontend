"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Edit3, Eye, RotateCcw, RotateCw, Check } from "lucide-react";
import type { ResumeAnnotation } from "@/types";

const MAX_HISTORY = 50;

const severityBorder: Record<string, string> = {
  critical: "border-l-red-500",
  high:     "border-l-orange-500",
  medium:   "border-l-amber-500",
  low:      "border-l-slate-500",
};
const severityBg: Record<string, string> = {
  critical: "bg-red-500/[0.07]",
  high:     "bg-orange-500/[0.07]",
  medium:   "bg-amber-500/[0.06]",
  low:      "bg-slate-500/[0.04]",
};
const severityDot: Record<string, string> = {
  critical: "bg-red-500",
  high:     "bg-orange-500",
  medium:   "bg-amber-400",
  low:      "bg-slate-500",
};

function normalizeLine(val: string) {
  return val.trim().replace(/^(?:[•▪◦\-*]|\d+[.)]) +/, "").replace(/\s+/g, " ").toLowerCase();
}

function findAnnotation(line: string, annotations: ResumeAnnotation[]) {
  const nl = normalizeLine(line);
  if (!nl) return undefined;
  return annotations.find((a) => {
    const na = normalizeLine(a.original);
    return nl === na || nl.includes(na);
  });
}

type ResumeEditorProps = {
  readonly annotations: ResumeAnnotation[];
  readonly text: string;
  readonly onTextChange: (newText: string) => void;
  readonly activeHighlight?: string | null;
  readonly onAnnotationClick?: (annotation: ResumeAnnotation) => void;
  readonly recentlyApplied?: Set<string>;
};

export default function ResumeEditor({
  annotations,
  text,
  onTextChange,
  activeHighlight,
  onAnnotationClick,
  recentlyApplied = new Set(),
}: ResumeEditorProps) {
  const [mode, setMode]             = useState<"preview" | "edit">("preview");
  const [editText, setEditText]     = useState(text);
  const [history, setHistory]       = useState<string[]>([text]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const textareaRef                  = useRef<HTMLTextAreaElement>(null);
  const activeRef                    = useRef<HTMLButtonElement>(null);

  // Keep editText fresh when text changes from applied suggestions
  useEffect(() => { setEditText(text); }, [text]);

  // Scroll active highlight into view
  useEffect(() => {
    if (activeHighlight && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeHighlight]);

  const enterEdit = useCallback(() => {
    setEditText(text);
    setMode("edit");
    setTimeout(() => textareaRef.current?.focus(), 60);
  }, [text]);

  const exitEdit = useCallback(() => {
    if (editText !== text) {
      onTextChange(editText);
      setHistory((prev) => {
        const next = [...prev.slice(0, historyIdx + 1), editText];
        return next.slice(-MAX_HISTORY);
      });
      setHistoryIdx((i) => Math.min(i + 1, MAX_HISTORY - 1));
    }
    setMode("preview");
  }, [editText, text, onTextChange, historyIdx]);

  const undo = useCallback(() => {
    if (historyIdx <= 0) return;
    const t = history[historyIdx - 1];
    onTextChange(t);
    setEditText(t);
    setHistoryIdx((i) => i - 1);
  }, [history, historyIdx, onTextChange]);

  const redo = useCallback(() => {
    if (historyIdx >= history.length - 1) return;
    const t = history[historyIdx + 1];
    onTextChange(t);
    setEditText(t);
    setHistoryIdx((i) => i + 1);
  }, [history, historyIdx, onTextChange]);

  const lines = useMemo(() => text.split(/\r?\n/), [text]);

  return (
    <div className="rounded-2xl border border-white/10 bg-surface-900/60 overflow-hidden flex flex-col">
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-white/10 bg-surface-950/60 shrink-0">
        {/* Mode toggle */}
        <div className="flex items-center gap-0.5 bg-surface-800 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => mode === "edit" && exitEdit()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              mode === "preview" ? "bg-surface-700 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye size={11} /> Preview
          </button>
          <button
            type="button"
            onClick={() => mode === "preview" && enterEdit()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              mode === "edit" ? "bg-brand-500/25 text-brand-300" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Edit3 size={11} /> Edit
          </button>
        </div>

        {/* Undo / Redo / Done */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={undo}
            disabled={historyIdx === 0}
            title="Undo"
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
          >
            <RotateCcw size={13} />
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={historyIdx >= history.length - 1}
            title="Redo"
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
          >
            <RotateCw size={13} />
          </button>
          {mode === "edit" && (
            <button
              type="button"
              onClick={exitEdit}
              className="ml-1 btn-primary text-xs px-3 py-1.5"
            >
              Done
            </button>
          )}
        </div>
      </div>

      {/* ── Edit mode: textarea ── */}
      {mode === "edit" && (
        <div className="overflow-y-auto max-h-[680px] bg-slate-100 p-8">
          <div className="max-w-[21cm] mx-auto bg-white min-h-[29.7cm] shadow-md p-0 font-sans border border-slate-200">
            <textarea
              ref={textareaRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full h-full min-h-[29.7cm] p-10 bg-transparent text-slate-800 text-[13px] leading-relaxed resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>
        </div>
      )}

      {/* ── Preview mode: annotated lines ── */}
      {mode === "preview" && (
        <div className="overflow-y-auto max-h-[680px] bg-slate-100 p-8">
          <div className="max-w-[21cm] mx-auto bg-white min-h-[29.7cm] shadow-md p-10 font-sans text-[13px] leading-relaxed space-y-0.5 text-slate-800 border border-slate-200">
            {lines.map((line, i) => {
              const annotation = findAnnotation(line, annotations);
              const key = `${i}-${line.slice(0, 20)}`;
              
              const isHeader = line.length > 2 && line.length < 50 && line === line.toUpperCase();
              const isBullet = /^[•▪◦\-*]/.test(line.trim());
              const isSectionStart = isHeader ? "font-bold text-slate-900 mt-5 mb-2 border-b border-slate-200 pb-1" : "";
              const bulletIndent = isBullet ? "ml-4" : "";

              const justApplied = recentlyApplied.has(line) || recentlyApplied.has(line.trim());

              if (!annotation) {
                return (
                  <div key={key} className={`whitespace-pre-wrap break-words px-3 py-1 rounded transition-all duration-500 ${isSectionStart} ${bulletIndent} ${justApplied ? "bg-emerald-500/20 ring-1 ring-emerald-500 text-emerald-100" : ""}`}>
                    {line || "\u00A0"}
                  </div>
                );
              }

            const sev = annotation.severity as string;
            const isActive = !!activeHighlight && normalizeLine(annotation.original) === normalizeLine(activeHighlight);
            // justApplied is already defined above

            return (
              <button
                type="button"
                key={key}
                ref={isActive ? activeRef : null}
                aria-label={`Issue: ${annotation.issue}`}
                className={[
                  "relative w-full text-left rounded-lg border-l-2 pl-3 pr-3 py-2 cursor-pointer transition-all duration-200 group text-slate-900",
                  severityBorder[sev] ?? "border-l-slate-400",
                  justApplied ? "bg-emerald-500/10 ring-1 ring-emerald-500/30" : (severityBg[sev] ?? "bg-slate-100"),
                  isActive ? "ring-1 ring-brand-400/50 shadow-[0_0_12px_rgba(99,102,241,0.15)]" : "hover:brightness-95",
                  isSectionStart, bulletIndent
                ].join(" ")}
                onClick={() => onAnnotationClick?.(annotation)}
              >
                <div className="flex items-start gap-2">
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${severityDot[sev] ?? "bg-slate-400"}`} />
                  <span className="whitespace-pre-wrap break-words flex-1">{line}</span>
                  {justApplied && <Check size={12} className="text-emerald-500 shrink-0 mt-1" />}
                </div>

                {/* Hover tooltip — visibility via CSS group-hover */}
                <div className="absolute left-4 bottom-full mb-2 z-50 hidden group-hover:block pointer-events-none">
                  <div className="max-w-xs bg-surface-800 border border-white/15 rounded-xl shadow-2xl p-3 animate-fade-in">
                    <p className="text-xs font-semibold text-slate-100 mb-1">{annotation.issue}</p>
                    {annotation.improved && (
                      <p className="text-xs text-emerald-300 leading-4">
                        <span className="font-bold">Fix: </span>{annotation.improved}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-500 mt-1.5">Click to see full suggestion →</p>
                  </div>
                </div>
              </button>
            );
          })}
          </div>
        </div>
      )}
    </div>
  );
}
