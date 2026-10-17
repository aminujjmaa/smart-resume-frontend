// Types for the growth features: instant re-score, quotas, free tools, share cards.
import type { CategoryScore, MissingKeyword, ScoreBreakdown, ScoreCap } from "@/types";

export interface RescoreResult {
  ats_score: number;
  previous_score: number | null;
  delta: number;
  score_breakdown: ScoreBreakdown;
  matched_keywords: string[];
  missing_keywords: MissingKeyword[];
  category_scores: CategoryScore[];
  caps_applied: ScoreCap[];
}

export interface ScanQuota {
  tier: "anon" | "free" | "pro";
  limit: number;
  used: number;
  remaining: number;
  resets_in_seconds: number;
}

export interface JdKeyword {
  keyword: string;
  category: "Hard Skill" | "Soft Skill" | "Other";
  importance: "required" | "preferred";
  evidence: string;
}

export interface BulletCheckResult {
  bullet: string;
  score: number;
  checks: Record<string, boolean>;
  issues: string[];
  suggested_verbs: string[];
  rewrite: string | null;
  needs_user_input: boolean;
}

export interface ScoreShareCard {
  share_id: string;
  ats_score: number;
  score_breakdown: ScoreBreakdown;
  score_domain: string | null;
  created_at: string;
}
