import guides from "./guides.json";

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  example?: { label: string; text: string };
}

export interface Guide {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  updatedAt: string;
  readingMinutes: number;
  summary: string;
  sections: GuideSection[];
  faqs: { q: string; a: string }[];
  relatedRoles: string[];
}

export const GUIDES: Guide[] = guides as Guide[];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
