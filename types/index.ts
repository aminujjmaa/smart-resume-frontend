// Global TypeScript types for SmartResume AI

export interface User {
  id: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_superuser?: boolean;
  plan: "free" | "premium";
  /** Use this (via lib/entitlements isPro) to unlock Pro UI — `plan` alone ignores expiry. */
  is_premium: boolean;
  subscription_status?: string | null;
  plan_expires_at?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean;
  created_at: string;
}

export interface BillingPayment {
  razorpay_payment_id: string;
  amount: number;
  currency: string;
  status: string;
  method?: string | null;
  paid_at?: string | null;
  created_at?: string | null;
}

export interface SubscriptionSummary {
  is_premium: boolean;
  plan: string;
  subscription_status?: string | null;
  plan_expires_at?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end: boolean;
  price_paise: number;
  payments: BillingPayment[];
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  user: User;
}

// ── Score Breakdown (flat three-number summary) ──────────────────────────────────

export interface ScoreBreakdown {
  keyword_match_pct: number;
  experience_impact_pct: number;
  formatting_score_pct: number;
}

// ── Missing Keywords ──────────────────────────────────────────────────────────

export interface MissingKeyword {
  keyword: string;
  jd_evidence: string;
  importance: "required" | "preferred";
}

// ── Formatting Risks ──────────────────────────────────────────────────────────

export interface FormattingRisk {
  issue: string;
  why_it_matters: string;
  fix: string;
}

// ── Bullet Suggestions ────────────────────────────────────────────────────────

export interface BulletSuggestion {
  section: string;
  original: string;
  rewritten: string;
  reason: string;
  needs_user_input: boolean;
  applicable: boolean;
}

export interface ResumeAnnotation {
  original: string;
  score: number;
  severity: "critical" | "high" | "medium" | "low";
  issue: string;
  tags: string[];
  improved?: string;
}

// ── Keywords (hard/soft/other table) ────────────────────────────────────────

export interface KeywordMatch {
  skill: string;
  category: "Hard Skill" | "Soft Skill" | "Other";
  found: boolean;
}

// ── Core Analysis Result ─────────────────────────────────────────────────────

export interface AnalysisResult {
  ats_score: number;
  score_breakdown: ScoreBreakdown;
  matched_keywords: string[];
  missing_keywords: MissingKeyword[];
  keyword_matches?: KeywordMatch[];
  formatting_risks: FormattingRisk[];
  bullet_suggestions: BulletSuggestion[];
  priority_fixes: string[];
  seniority_signal: string;
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
