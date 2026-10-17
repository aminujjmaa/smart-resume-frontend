#!/usr/bin/env node
/**
 * Validates the content behind the programmatic SEO pages (lib/seo-jobs.json,
 * lib/guides.json): required fields, lengths that fit search snippets, unique
 * titles/descriptions and internal links that resolve. Run: npm run validate:seo
 */
import { readFileSync } from "node:fs";

const roles = JSON.parse(readFileSync(new URL("../lib/seo-jobs.json", import.meta.url)));
const guides = JSON.parse(readFileSync(new URL("../lib/guides.json", import.meta.url)));
const errors = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);

const roleSlugs = new Set(roles.map((r) => r.slug));
const seen = { slug: new Set(), metaTitle: new Set(), metaDescription: new Set() };

function checkUnique(kind, value, where) {
  if (seen[kind].has(value)) fail(where, `duplicate ${kind}`);
  seen[kind].add(value);
}

function checkLength(where, field, value, min, max) {
  if (typeof value !== "string" || value.length < min || value.length > max) {
    fail(where, `${field} must be ${min}-${max} chars (got ${value?.length ?? "missing"})`);
  }
}

function checkCount(where, field, list, min, max) {
  if (!Array.isArray(list) || list.length < min || list.length > max) {
    fail(where, `${field} must have ${min}-${max} items (got ${Array.isArray(list) ? list.length : "missing"})`);
  }
}

for (const r of roles) {
  const where = `role ${r.slug}`;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(r.slug ?? "")) fail(where, "slug must be kebab-case");
  checkUnique("slug", r.slug, where);
  checkUnique("metaTitle", r.metaTitle, where);
  checkUnique("metaDescription", r.metaDescription, where);
  checkLength(where, "metaTitle", r.metaTitle, 30, 65);
  checkLength(where, "metaDescription", r.metaDescription, 110, 165);
  for (const field of ["role", "category", "level", "updatedAt", "intro", "jdSnippet"]) {
    if (!r[field]) fail(where, `missing ${field}`);
  }
  checkCount(where, "skills.hard", r.skills?.hard, 8, 16);
  checkCount(where, "skills.tools", r.skills?.tools, 3, 12);
  checkCount(where, "skills.soft", r.skills?.soft, 3, 8);
  checkCount(where, "weakVsStrong", r.weakVsStrong, 3, 5);
  checkCount(where, "mistakes", r.mistakes, 3, 6);
  checkCount(where, "faqs", r.faqs, 3, 6);
  checkCount(where, "whyItWorks", r.whyItWorks, 3, 5);
  checkCount(where, "related", r.related, 2, 5);
  for (const rel of r.related ?? []) {
    if (!roleSlugs.has(rel) || rel === r.slug) fail(where, `bad related slug ${rel}`);
  }
  const ex = r.example ?? {};
  for (const field of ["name", "contact", "summary", "skills", "education"]) {
    if (!ex[field]) fail(where, `example.${field} missing`);
  }
  checkCount(where, "example.experience", ex.experience, 1, 3);
}

const guideSlugs = new Set();
for (const g of guides) {
  const where = `guide ${g.slug}`;
  if (guideSlugs.has(g.slug)) fail(where, "duplicate slug");
  guideSlugs.add(g.slug);
  checkUnique("metaTitle", g.metaTitle, where);
  checkUnique("metaDescription", g.metaDescription, where);
  checkLength(where, "metaTitle", g.metaTitle, 30, 65);
  checkLength(where, "metaDescription", g.metaDescription, 110, 165);
  checkCount(where, "sections", g.sections, 4, 12);
  checkCount(where, "faqs", g.faqs, 3, 8);
  for (const rel of g.relatedRoles ?? []) {
    if (!roleSlugs.has(rel)) fail(where, `unknown related role ${rel}`);
  }
}

if (errors.length) {
  console.error(`SEO content validation failed (${errors.length}):\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(`SEO content OK: ${roles.length} roles, ${guides.length} guides.`);
