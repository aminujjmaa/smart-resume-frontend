import seoJobs from "./seo-jobs.json";

export interface JobTitleSEO {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  level: string;
  score: number;
  whyItWorks: string[];
  category: string;
  dummyData: {
    name: string;
    contact: string;
    summary: string;
    experience: { title: string; bullets: string[] }[];
    skills: string;
    education: string;
  };
}

export const SEO_DATA: JobTitleSEO[] = seoJobs as JobTitleSEO[];

export function getJobTitleSEO(slug: string): JobTitleSEO | undefined {
  return SEO_DATA.find((item) => item.slug === slug);
}
