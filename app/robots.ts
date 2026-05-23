import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://smartresume.co.in";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",   // Don't index logged-in user areas
        "/api/",         // Don't crawl Next.js internal APIs
        "/results/",     // Don't index random user result pages (unless linked)
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
