/**
 * Public description of the scoring model — keep in sync with
 * backend/app/services/hybrid_ats.py (category max points, caps, display groups).
 */

export interface ScoringCategory {
  name: string;
  points: number;
  group: "Keyword match" | "Experience impact" | "Formatting" | "Depth";
  engineeringOnly?: boolean;
  checks: string;
}

export const SCORING_CATEGORIES: ScoringCategory[] = [
  { name: "ATS Parseability", points: 12, group: "Formatting", checks: "Standard section headers, readable contact details, no table/column layouts or image placeholders, enough text to parse." },
  { name: "Recruiter Readability", points: 10, group: "Experience impact", checks: "Bullets that open with a clear action verb instead of “responsible for” or “worked on”." },
  { name: "Repetitive Words", points: 4, group: "Formatting", checks: "Variety in the verbs that open your bullets." },
  { name: "Technical Depth", points: 12, group: "Depth", checks: "Recognised skills and tools — and whether your bullets show them being used, not just listed." },
  { name: "Semantic Relevance", points: 10, group: "Keyword match", checks: "Share of the job description's key terms (and their common synonyms) found in your resume." },
  { name: "Impact Quantification", points: 10, group: "Experience impact", checks: "Bullets with a measurable result — %, ₹, counts, time saved — and outcome language." },
  { name: "Architecture Maturity", points: 10, group: "Depth", engineeringOnly: true, checks: "Design decisions such as scalability, caching, queues or distributed systems, shown in context." },
  { name: "Ownership Signals", points: 8, group: "Experience impact", checks: "Bullets that make clear what you personally led, built or delivered." },
  { name: "Role Alignment", points: 10, group: "Keyword match", checks: "Whether the job's key terms appear in your experience bullets, not only in the skills list." },
  { name: "Engineering Complexity", points: 8, group: "Depth", engineeringOnly: true, checks: "The hard part of the work: data volume, performance, reliability, integrations." },
  { name: "Production Readiness Signals", points: 6, group: "Depth", engineeringOnly: true, checks: "Deployment, monitoring, testing and security experience." },
];

export const SCORE_CAPS: { cap: number; when: string }[] = [
  { cap: 58, when: "Fewer than 30% of the job description's key terms appear anywhere in the resume." },
  { cap: 68, when: "Fewer than 2 achievement bullets." },
  { cap: 70, when: "Under 150 words." },
  { cap: 72, when: "No experience or projects section." },
  { cap: 84, when: "Under 250 words." },
  { cap: 86, when: "No skills section." },
  { cap: 92, when: "No education section." },
];
