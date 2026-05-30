import type { AnalysisResult, ResumeAnnotation, SuggestionSeverity } from "@/types";

function severityForScore(score: number): SuggestionSeverity {
  if (score < 45) return "critical";
  if (score < 60) return "high";
  if (score < 80) return "medium";
  return "low";
}

function severityFromSuggestion(sev: string | undefined): SuggestionSeverity {
  if (sev === "critical") return "critical";
  if (sev === "high") return "high";
  if (sev === "medium") return "medium";
  return "low";
}

function buildFallbackAnnotations(result: AnalysisResult, seenOriginals: Set<string>): ResumeAnnotation[] {
  const annotations: ResumeAnnotation[] = [];
  for (const s of result.suggestions || []) {
    const snippet = s.example || s.strong_example;
    if (!snippet) continue;
    const key = snippet.trim().toLowerCase();
    if (seenOriginals.has(key)) continue;
    seenOriginals.add(key);
    
    let score = 65;
    if (s.severity === "critical") score = 30;
    else if (s.severity === "high") score = 50;

    annotations.push({
      original: snippet,
      score,
      severity: severityFromSuggestion(s.severity),
      issue: s.issue,
      tags: [s.category],
      improved: s.strong_example && s.strong_example !== snippet ? s.strong_example : undefined,
    });
  }
  return annotations;
}

export function buildResumeAnnotations(result: AnalysisResult): ResumeAnnotation[] {
  const annotations: ResumeAnnotation[] = [];
  const seenOriginals = new Set<string>();

  const improvementsByOriginal = new Map(
    (result.bullet_improvements || []).map((item) => [
      item.original.trim().toLowerCase(),
      item.improved,
    ])
  );

  // ── Primary source: bullet_feedback (line-by-line scored bullets) ─────────
  for (const item of result.bullet_feedback || []) {
    if (item.score >= 80 && (item.weakness_tags || []).length === 0) continue;
    const key = item.bullet.trim().toLowerCase();
    seenOriginals.add(key);
    annotations.push({
      original: item.bullet,
      score: item.score,
      severity: severityForScore(item.score),
      issue: item.feedback,
      tags: item.weakness_tags || [],
      improved: improvementsByOriginal.get(key),
    });
  }

  // ── Fallback source: suggestions (if bullet_feedback is empty) ────────────
  if (annotations.length === 0) {
    annotations.push(...buildFallbackAnnotations(result, seenOriginals));
  }

  return annotations;
}
