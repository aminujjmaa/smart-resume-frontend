import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import JdKeywordClient from "./JdKeywordClient";
import { JsonLd, faqJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Job Description Keyword Extractor — Free ATS Keyword Finder",
  description:
    "Paste any job description to find the skills and keywords ATS and recruiters screen for — required vs preferred, with the exact line each came from. Free.",
  alternates: { canonical: "/tools/jd-keyword-extractor" },
};

const faqs = [
  {
    q: "How do I find keywords in a job description?",
    a: "Look for the skills, tools and qualifications listed under requirements, and terms repeated across the posting. This tool does that automatically and quotes the line each keyword comes from so you can check it.",
  },
  {
    q: "Should I add every keyword to my resume?",
    a: "No — only the ones that are true for you. Put each one where you can prove it: inside an experience or project bullet, not just in the skills list.",
  },
  {
    q: "What's the difference between required and preferred keywords?",
    a: "Required keywords come from lines like 'must have' or 'requirements'; preferred ones come from 'good to have', 'nice to have' or 'bonus' lines. Prioritise the required ones.",
  },
];

export default function JdKeywordExtractorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <JsonLd data={faqJsonLd(faqs)} />
      <Navbar />
      <main className="flex-1 px-4 pt-28 pb-24">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white">Job description keyword extractor</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-400">
            Paste a job description from Naukri, LinkedIn or a company careers page. You&apos;ll see the keywords it screens for,
            whether each is required or preferred, and the exact line it came from.
          </p>
          <div className="mt-10">
            <JdKeywordClient />
          </div>
          <section className="mt-16 max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-white mb-4">FAQs</h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details key={faq.q} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <summary className="cursor-pointer font-semibold text-white">{faq.q}</summary>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
