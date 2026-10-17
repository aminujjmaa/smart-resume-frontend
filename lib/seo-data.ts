import roles from "./seo-jobs.json";

export interface RoleBulletRewrite {
  weak: string;
  strong: string;
  why: string;
}

export interface RoleFAQ {
  q: string;
  a: string;
}

export interface RoleExampleResume {
  name: string;
  contact: string;
  summary: string;
  experience: { title: string; bullets: string[] }[];
  skills: string;
  education: string;
}

/** One role page: /ats-score/[slug] (checker + guidance) and /resume-examples/[slug]. */
export interface RoleSEO {
  slug: string;
  role: string;
  category: string;
  level: string;
  updatedAt: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  skills: { hard: string[]; tools: string[]; soft: string[] };
  jdSnippet: string;
  weakVsStrong: RoleBulletRewrite[];
  mistakes: string[];
  faqs: RoleFAQ[];
  related: string[];
  whyItWorks: string[];
  example: RoleExampleResume;
}

export const ROLES: RoleSEO[] = roles as RoleSEO[];

const BY_SLUG = new Map(ROLES.map((role) => [role.slug, role]));

export function getRole(slug: string): RoleSEO | undefined {
  return BY_SLUG.get(slug);
}

export function relatedRoles(role: RoleSEO): RoleSEO[] {
  return role.related.map((slug) => BY_SLUG.get(slug)).filter((r): r is RoleSEO => Boolean(r));
}

export function rolesByCategory(): [string, RoleSEO[]][] {
  const groups = new Map<string, RoleSEO[]>();
  for (const role of ROLES) {
    groups.set(role.category, [...(groups.get(role.category) ?? []), role]);
  }
  return Array.from(groups.entries());
}

/**
 * A job-description stand-in built from the role's skills, used when someone
 * scans from a role page without pasting a real JD. Phrased as requirement
 * lines so the backend keyword extractor treats them as required/preferred.
 */
export function roleRequirementsText(role: RoleSEO): string {
  return [
    `Target role: ${role.role}`,
    `Required skills: ${role.skills.hard.join(", ")}`,
    role.skills.tools.length ? `Required tools: ${role.skills.tools.join(", ")}` : "",
    role.skills.soft.length ? `Preferred: ${role.skills.soft.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
