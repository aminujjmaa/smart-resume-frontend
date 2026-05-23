"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Eye, ExternalLink, FileText, Sparkles } from "lucide-react";
import type { ResumeAnnotation, SuggestionSeverity } from "@/types";

type ResumePreviewProps = {
  annotations?: ResumeAnnotation[];
  className?: string;
  file?: File | null;
  showHeader?: boolean;
  text?: string;
  title?: string;
};

const TEXT_PREVIEW_LIMIT = 9000;

const severityStyles: Record<SuggestionSeverity, string> = {
  critical: "border-red-500/40 bg-red-500/10",
  high: "border-orange-500/40 bg-orange-500/10",
  medium: "border-amber-500/40 bg-amber-500/10",
  low: "border-slate-500/30 bg-slate-500/10",
};

const severityText: Record<SuggestionSeverity, string> = {
  critical: "text-red-300",
  high: "text-orange-300",
  medium: "text-amber-300",
  low: "text-slate-300",
};

function formatFileType(file: File) {
  const name = file.name.toLowerCase();
  if (file.type === "application/pdf" || name.endsWith(".pdf")) return "PDF";
  if (file.type === "text/plain" || name.endsWith(".txt")) return "TXT";
  if (name.endsWith(".docx")) return "DOCX";
  return "Resume file";
}

function normalizeLine(value: string) {
  return value
    .trim()
    .replace(/^(?:[•▪◦\-\*]|\d+[\.)])\s+/, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function findAnnotation(line: string, annotations: ResumeAnnotation[]) {
  const normalizedLine = normalizeLine(line);
  if (!normalizedLine) return undefined;

  return annotations.find((annotation) => {
    const normalizedOriginal = normalizeLine(annotation.original);
    return normalizedLine === normalizedOriginal || normalizedLine.includes(normalizedOriginal);
  });
}

function AnnotatedTextPreview({
  annotations,
  text,
}: Readonly<{
  annotations: ResumeAnnotation[];
  text: string;
}>) {
  const visibleText = text.length > TEXT_PREVIEW_LIMIT ? text.slice(0, TEXT_PREVIEW_LIMIT) : text;
  const lines = visibleText.split(/\r?\n/);
  const matchedOriginals = new Set(
    lines
      .map((line) => findAnnotation(line, annotations)?.original)
      .filter(Boolean)
  );
  const unmatchedAnnotations = annotations.filter((annotation) => !matchedOriginals.has(annotation.original));

  return (
    <div className="max-h-[640px] overflow-auto p-5 text-sm leading-relaxed text-slate-200">
      {annotations.length > 0 && (
        <div className="mb-4 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-300" />
            <div>
              <p className="text-sm font-semibold text-amber-100">
                {matchedOriginals.size}/{annotations.length} issues are highlighted in the resume below
              </p>
              <p className="mt-1 text-xs leading-5 text-amber-100/70">
                These callouts are matched to exact bullets from the parsed resume text.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-1 font-sans">
        {lines.map((line, index) => {
          const annotation = findAnnotation(line, annotations);
          const key = `${index}-${line.slice(0, 20)}`;

          if (!annotation) {
            return (
              <div key={key} className="whitespace-pre-wrap break-words rounded-md px-3 py-1.5 text-slate-300">
                {line || " "}
              </div>
            );
          }

          return (
            <div key={key} className={`rounded-lg border px-3 py-3 ${severityStyles[annotation.severity]}`}>
              <div className="whitespace-pre-wrap break-words font-medium text-white">{line}</div>
              <div className="mt-3 space-y-3 border-t border-white/10 pt-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-xs font-bold ${severityText[annotation.severity]}`}>
                    {annotation.score}/100
                  </span>
                  {annotation.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-white/10 bg-surface-950/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-start gap-2 text-xs leading-5 text-slate-200">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-300" />
                  <p>{annotation.issue}</p>
                </div>
                {annotation.improved && (
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                    <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                      <Sparkles size={13} /> Suggested rewrite
                    </div>
                    <p className="text-xs leading-5 text-emerald-50">{annotation.improved}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {text.length > TEXT_PREVIEW_LIMIT && (
        <div className="mt-4 rounded-lg border border-white/10 bg-surface-950/80 p-3 text-xs text-slate-400">
          Preview truncated.
        </div>
      )}

      {unmatchedAnnotations.length > 0 && (
        <div className="mt-4 rounded-lg border border-white/10 bg-surface-950/80 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Additional issues from parsed bullets
          </p>
          <div className="space-y-3">
            {unmatchedAnnotations.map((annotation) => (
              <div key={annotation.original} className={`rounded-lg border p-3 ${severityStyles[annotation.severity]}`}>
                <p className="text-sm font-medium text-white">{annotation.original}</p>
                <p className="mt-2 text-xs leading-5 text-slate-200">{annotation.issue}</p>
                {annotation.improved && (
                  <p className="mt-2 rounded-md border border-emerald-500/20 bg-emerald-500/10 p-2 text-xs leading-5 text-emerald-50">
                    {annotation.improved}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResumePreview({
  annotations = [],
  className = "",
  file,
  showHeader = true,
  text = "",
  title = "Resume Preview",
}: Readonly<ResumePreviewProps>) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileText, setFileText] = useState("");

  const cleanText = useMemo(() => (text || fileText).trim(), [fileText, text]);
  const isPdf = file && (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"));
  const isTextFile = file && (file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt"));

  useEffect(() => {
    if (!file || !isPdf) {
      setFileUrl(null);
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    setFileUrl(nextUrl);

    return () => URL.revokeObjectURL(nextUrl);
  }, [file, isPdf]);

  useEffect(() => {
    if (!file || !isTextFile) {
      setFileText("");
      return;
    }

    let cancelled = false;
    const reader = new FileReader();
    reader.onload = () => {
      if (!cancelled) setFileText(String(reader.result || ""));
    };
    reader.readAsText(file);

    return () => {
      cancelled = true;
    };
  }, [file, isTextFile]);

  if (!file && !cleanText) return null;

  return (
    <section className={`overflow-hidden rounded-lg border border-white/10 bg-surface-900/80 ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2 min-w-0">
            <Eye size={16} className="text-brand-400 shrink-0" />
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-white">{title}</h2>
              {file && (
                <p className="text-xs text-slate-500 truncate">
                  {file.name} · {formatFileType(file)} · {(file.size / 1024).toFixed(0)} KB
                </p>
              )}
            </div>
          </div>
          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary text-xs px-3 py-2 shrink-0"
              aria-label="Open resume preview in a new tab"
            >
              <ExternalLink size={14} /> Open
            </a>
          )}
        </div>
      )}

      {annotations.length > 0 && cleanText ? (
        <AnnotatedTextPreview annotations={annotations} text={cleanText} />
      ) : fileUrl ? (
        <iframe
          src={fileUrl}
          title="Uploaded resume preview"
          className="h-[560px] w-full bg-white"
        />
      ) : cleanText ? (
        <pre className="max-h-[560px] overflow-auto whitespace-pre-wrap break-words p-5 text-sm leading-relaxed text-slate-200 font-sans">
          {cleanText.length > TEXT_PREVIEW_LIMIT ? `${cleanText.slice(0, TEXT_PREVIEW_LIMIT)}\n\nPreview truncated.` : cleanText}
        </pre>
      ) : (
        <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
          <FileText size={28} className="mb-3 text-slate-500" />
          <p className="text-sm font-medium text-slate-300">Preview is available after analysis</p>
          <p className="mt-1 max-w-sm text-xs text-slate-500">
            Browser preview is not available for this file type, but the parsed resume text will appear on the results page.
          </p>
        </div>
      )}
    </section>
  );
}
