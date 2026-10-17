import { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/", // signed-in area
        "/api/", // API proxy
        "/results/", // individual scan reports
        "/score/", // shared score cards (noindex)
      ],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
