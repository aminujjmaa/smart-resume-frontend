/**
 * Shared resume download utilities.
 *
 * Path 1 — Template Builder: caller passes latexSource directly.
 * Path 2 — Upload & Optimize: caller passes resumeText (plain text);
 *           we build an ATS-safe LaTeX document from it.
 */

import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Packer,
  AlignmentType,
  BorderStyle,
} from "docx";
import { apiClient } from "./api";

// ── PDF via LaTeX compile endpoint ────────────────────────────────────────────

/**
 * Compile a LaTeX string server-side and download the resulting PDF.
 * Requires the user to be authenticated (the backend enforces it).
 */
export async function downloadPDF(latexSource: string, filename = "resume.pdf") {
  const response = await apiClient.post(
    "/latex/compile",
    { source: latexSource },
    { responseType: "blob", withCredentials: true }
  );
  const blob = new Blob([response.data], { type: "application/pdf" });
  triggerDownload(blob, filename);
}

// ── DOCX client-side generation ───────────────────────────────────────────────

/**
 * Build a clean DOCX document from plain resume text lines and download it.
 */
export async function downloadDOCX(resumeText: string, filename = "resume.docx") {
  const lines = resumeText.split("\n");
  const children: Paragraph[] = [];

  // Find first non-empty line index once (avoids O(n²) indexOf per line)
  const firstNonEmptyIdx = lines.findIndex((l) => l.trim() !== "");

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Empty line → spacer paragraph
    if (!trimmed) {
      children.push(new Paragraph({ spacing: { after: 60 } }));
      return;
    }

    // Name line (first non-empty)
    if (idx === firstNonEmptyIdx) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, bold: true, size: 32 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
        })
      );
      return;
    }

    // Contact line (contains @ or | or phone pattern)
    if (trimmed.includes("@") || trimmed.includes("|") || /\+\d/.test(trimmed)) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, size: 18, color: "475569" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
        })
      );
      return;
    }

    // Section header: ALL CAPS, short, no bullet prefix
    if (
      trimmed === trimmed.toUpperCase() &&
      trimmed.length < 40 &&
      !trimmed.startsWith("•") &&
      !trimmed.startsWith("-") &&
      !trimmed.startsWith("*")
    ) {
      children.push(
        new Paragraph({
          text: trimmed,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 80 },
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 6, color: "2563EB" },
          },
        })
      );
      return;
    }

    // Bullet points
    if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: trimmed.replace(/^[•\-*]\s*/, ""), size: 20 }),
          ],
          bullet: { level: 0 },
          spacing: { after: 40 },
        })
      );
      return;
    }

    // Regular body line
    children.push(
      new Paragraph({
        children: [new TextRun({ text: trimmed, size: 20 })],
        spacing: { after: 40 },
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 900, right: 900 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  triggerDownload(blob, filename);
}

// ── Minimal LaTeX builder for plain resume text ───────────────────────────────

/**
 * Wrap plain resume text in a minimal ATS-safe LaTeX template.
 * Bullet grouping is handled correctly — consecutive bullets are placed
 * inside a single itemize environment instead of one-per-bullet.
 */
export function buildLatexFromText(resumeText: string): string {
  const rawLines = resumeText.split("\n");

  // Classify lines before escaping so bullet/header detection works on
  // original characters (•, -, etc.), not on escaped LaTeX sequences.
  type LineKind = "name" | "contact" | "header" | "bullet" | "body" | "empty";
  const classified: { kind: LineKind; text: string }[] = [];

  const firstNonEmptyIdx = rawLines.findIndex((l) => l.trim() !== "");

  rawLines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      classified.push({ kind: "empty", text: "" });
      return;
    }
    if (idx === firstNonEmptyIdx) {
      classified.push({ kind: "name", text: trimmed });
      return;
    }
    if (trimmed === trimmed.toUpperCase() && trimmed.length < 40) {
      classified.push({ kind: "header", text: trimmed });
      return;
    }
    if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
      classified.push({ kind: "bullet", text: trimmed.replace(/^[•\-*]\s*/, "") });
      return;
    }
    classified.push({ kind: "body", text: trimmed });
  });

  // Build LaTeX body, grouping consecutive bullets into one itemize block
  const bodyParts: string[] = [];
  let i = 0;
  while (i < classified.length) {
    const { kind, text } = classified[i];

    if (kind === "empty") {
      bodyParts.push(String.raw`\vspace{0.12cm}`);
      i++;
    } else if (kind === "name") {
      bodyParts.push(String.raw`{\LARGE\bfseries ${escapeLatex(text)}}\\[0.15cm]`);
      i++;
    } else if (kind === "header") {
      bodyParts.push(String.raw`\section*{${escapeLatex(text)}}`);
      i++;
    } else if (kind === "bullet") {
      // Collect all consecutive bullets
      const bullets: string[] = [];
      while (i < classified.length && classified[i].kind === "bullet") {
        bullets.push(String.raw`  \item ${escapeLatex(classified[i].text)}`);
        i++;
      }
      bodyParts.push(
        "\\begin{itemize}[leftmargin=1.2em,topsep=0.05em,itemsep=0.04em,parsep=0em]\n" +
          bullets.join("\n") +
          "\n\\end{itemize}"
      );
    } else {
      // body
      bodyParts.push(String.raw`{\small ${escapeLatex(text)}}\\[0.08cm]`);
      i++;
    }
  }

  const body = bodyParts.join("\n");

  return String.raw`\documentclass[10.5pt,letterpaper]{article}
\usepackage[margin=0.75in]{geometry}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage{xcolor}
\definecolor{accent}{HTML}{2563EB}
\pagestyle{empty}
\setlength{\parindent}{0pt}
\titleformat{\section}{\bfseries\normalsize\color{accent}}{}{0pt}{}[{\color{accent}\titlerule[0.5pt]}]
\titlespacing{\section}{0pt}{0.5em}{0.25em}
\begin{document}
${body}
\end{document}`;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function escapeLatex(text: string): string {
  return text
    .replaceAll("\\", String.raw`\textbackslash{}`)
    .replaceAll("%", String.raw`\%`)
    .replaceAll("&", String.raw`\&`)
    .replaceAll("#", String.raw`\#`)
    .replaceAll("$", String.raw`\$`)
    .replaceAll("_", String.raw`\_`)
    .replaceAll("^", String.raw`\^{}`)
    .replaceAll("~", String.raw`\~{}`)
    .replaceAll("{", String.raw`\{`)
    .replaceAll("}", String.raw`\}`);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
