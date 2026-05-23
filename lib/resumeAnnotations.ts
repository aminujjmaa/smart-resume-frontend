import type { AnalysisResult, ResumeAnnotation, SuggestionSeverity } from "@/types";

function severityForScore(score: number): SuggestionSeverity {
  if (score < 45) return "critical";
  if (score < 60) return "high";
  if (score < 80) return "medium";
  return "low";
}

export function buildResumeAnnotations(result: AnalysisResult): ResumeAnnotation[] {
  const improvementsByOriginal = new Map(
    (result.bullet_improvements || []).map((item) => [item.original.trim().toLowerCase(), item.improved])
  );

  return (result.bullet_feedback || [])
    .filter((item) => item.score < 80 || (item.weakness_tags || []).length > 0)
    .map((item) => ({
      original: item.bullet,
      score: item.score,
      severity: severityForScore(item.score),
      issue: item.feedback,
      tags: item.weakness_tags || [],
      improved: improvementsByOriginal.get(item.bullet.trim().toLowerCase()),
    }));
}
