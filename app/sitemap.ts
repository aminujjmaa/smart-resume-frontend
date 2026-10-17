import { MetadataRoute } from "next";
import { ROLES } from "@/lib/seo-data";
import { GUIDES } from "@/lib/guides";
import { SITE } from "@/lib/site";

// Bump when the content of these static pages materially changes.
const STATIC_PAGES_UPDATED = "2026-10-17";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/scan", priority: 0.95 },
    { path: "/how-ats-score-works", priority: 0.7 },
    { path: "/resume-examples", priority: 0.8 },
    { path: "/guides", priority: 0.8 },
    { path: "/action-verbs", priority: 0.6 },
    { path: "/pricing", priority: 0.7 },
    { path: "/about", priority: 0.4 },
    { path: "/contact", priority: 0.3 },
    { path: "/privacy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
    { path: "/refund-policy", priority: 0.2 },
    { path: "/shipping-policy", priority: 0.2 },
  ];

  return [
    ...staticPages.map(({ path, priority }) => ({
      url: `${SITE.url}${path}`,
      lastModified: STATIC_PAGES_UPDATED,
      priority,
    })),
    ...ROLES.flatMap((role) => [
      { url: `${SITE.url}/ats-score/${role.slug}`, lastModified: role.updatedAt, priority: 0.85 },
      { url: `${SITE.url}/resume-examples/${role.slug}`, lastModified: role.updatedAt, priority: 0.7 },
    ]),
    ...GUIDES.map((guide) => ({ url: `${SITE.url}/guides/${guide.slug}`, lastModified: guide.updatedAt, priority: 0.75 })),
  ];
}
