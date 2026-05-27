import { MetadataRoute } from "next";
import { SEO_DATA } from "@/lib/seo-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://smartresume.co.in";

  const ATS_SCORE_SLUGS = SEO_DATA.map(job => job.slug);

  // Core static routes
  const routes = [
    "",
    "/about",
    "/scan",
    "/resume-examples",
    "/action-verbs",
    "/pricing",
    "/login",
    "/signup",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // ATS score role-specific landing pages
  const atsScorePages = ATS_SCORE_SLUGS.map((slug) => ({
    url: `${baseUrl}/ats-score/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // Dynamic programmatic SEO routes
  const resumeExamples = SEO_DATA.map((job) => ({
    url: `${baseUrl}/resume-examples/${job.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...routes, ...atsScorePages, ...resumeExamples];
}
