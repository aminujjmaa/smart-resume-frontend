// Global TypeScript types for SmartResume AI

export interface User {
  id: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_superuser?: boolean;
  plan: "free" | "premium";
  created_at: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  user: User;
}

// ── Score Breakdown ───────────────────────────────────────────────────────────

export type ScoreGrade = "A" | "B" | "C" | "D" | "F";

export interface ScoreCategory {
  name: string;
  score: number;
  max_score: number;
  grade: ScoreGrade;
  why: string;
  how_to_improve: string;
}

// ── Suggestions & Bullets ────────────────────────────────────────────────────

export type SuggestionSeverity = "critical" | "high" | "medium" | "low";

export interface Suggestion {
  category: string;
  severity: SuggestionSeverity;
  issue: string;
  fix: string;
  example?: string;
  why_it_matters?: string;
  evidence_to_add?: string[];
  strong_example?: string;
}

export interface BulletImprovement {
  original: string;
  improved: string;
  reason?: string;
  why_stronger?: string[];
  evidence_to_add?: string[];
}

export interface BulletFeedback {
  bullet: string;
  score: number;
  weakness_tags: string[];
  feedback: string;
  diagnosis?: string;
  recruiter_perception?: string;
  improvement_strategy?: string;
  strong_alternative?: string;
  evidence_options?: string[];
  why_stronger?: string[];
}

export interface ResumeAnnotation {
  original: string;
  score: number;
  severity: SuggestionSeverity;
  issue: string;
  tags: string[];
  improved?: string;
}

// ── Keywords ─────────────────────────────────────────────────────────────────

export interface KeywordMatch {
  skill: string;
  category: "Hard Skill" | "Soft Skill" | "Other";
  found: boolean;
}

// ── Core Analysis Result ─────────────────────────────────────────────────────

export interface AnalysisResult {
  ats_score: number;
  score_breakdown: ScoreCategory[];
  matched_keywords: string[];
  missing_keywords: string[];
  keyword_matches?: KeywordMatch[];
  suggestions: Suggestion[];
  bullet_improvements: BulletImprovement[];
  bullet_feedback: BulletFeedback[];
  formatting_issues: string[];
  seniority_signal: string;
  role_alignment_summary: string;
  semantic_profile?: Record<string, unknown>;
}

export interface Analysis {
  id: string;
  status: "pending" | "processing" | "done" | "failed";
  ats_score?: number;
  resume_text?: string;
  result_json?: AnalysisResult;
  created_at: string;
  completed_at?: string;
}

export interface HistoryItem {
  id: string;
  status: string;
  ats_score?: number;
  created_at: string;
}

export type AnalysisStep =
  | "idle"
  | "uploading"
  | "parsing"
  | "analyzing"
  | "scoring"
  | "done"
  | "error";

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}

// ── Tools ───────────────────────────────────────────────────────────────────

export interface LinkedInScores {
  overall: number;
  headline: number;
  about: number;
  experience: number;
  skills: number;
  discoverability: number;
}

export interface LinkedInResult {
  overall_score: number;
  scores: LinkedInScores;
  headline_rewrite: string;
  about_rewrite: string;
  skill_recommendations: string[];
  experience_suggestions: string[];
  discoverability_tips: string[];
  consistency_issues: string[];
  summary: string;
}

export interface CoverLetterResult {
  full_letter: string;
  short_email: string;
  key_highlights: string[];
}

export interface NetworkingEmailResult {
  subject: string;
  body: string;
  linkedin_version: string;
}

export interface InterviewQuestion {
  question: string;
  category: string;
  difficulty: string;
  ideal_answer_framework: string;
  example_answer: string;
}

export interface InterviewPrepResult {
  questions: InterviewQuestion[];
  focus_areas: string[];
  preparation_tips: string[];
}

// ── Admin ───────────────────────────────────────────────────────────────────

export interface AdminStats {
  total_users: number;
  premium_users: number;
  total_analyses: number;
}
