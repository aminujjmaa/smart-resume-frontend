import type { AnalysisResult, ResumeAnnotation } from "@/types";

function severityFromImportance(importance: "required" | "preferred"): "high" | "medium" {
  return importance === "required" ? "high" : "medium";
}

export function buildResumeAnnotations(result: AnalysisResult): ResumeAnnotation[] {
  const annotations: ResumeAnnotation[] = [];
  const seenOriginals = new Set<string>();

  // ── Primary source: bullet_suggestions ───────────────────────────────────
  for (const s of result.bullet_suggestions || []) {
    const key = s.original.trim().toLowerCase();
    if (seenOriginals.has(key)) continue;
    seenOriginals.add(key);
    annotations.push({
      original: s.original,
      score: s.needs_user_input ? 40 : 60,
      severity: s.needs_user_input ? "high" : "medium",
      issue: s.reason,
      tags: [s.section],
      improved: s.applicable ? s.rewritten : undefined,
    });
  }

  // ── Fallback: formatting_risks (if no bullet annotations) ────────────────
  if (annotations.length === 0) {
    for (const r of result.formatting_risks || []) {
      const key = r.issue.trim().toLowerCase();
      if (seenOriginals.has(key)) continue;
      seenOriginals.add(key);
      annotations.push({
        original: r.issue,
        score: 35,
        severity: "critical",
        issue: r.why_it_matters,
        tags: ["Formatting"],
        improved: r.fix,
      });
    }
  }

  // ── Fallback: missing required keywords ───────────────────────────────────
  if (annotations.length === 0) {
    for (const kw of (result.missing_keywords || []).filter((k) => k.importance === "required").slice(0, 5)) {
      const key = kw.keyword.toLowerCase();
      if (seenOriginals.has(key)) continue;
      seenOriginals.add(key);
      annotations.push({
        original: kw.jd_evidence || kw.keyword,
        score: 50,
        severity: severityFromImportance(kw.importance),
        issue: `Missing required keyword: "${kw.keyword}"`,
        tags: ["Keywords"],
      });
    }
  }

  return annotations;
}
