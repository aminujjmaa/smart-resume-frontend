import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { SCORE_CAPS, SCORING_CATEGORIES } from "@/lib/scoring";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "How the ATS Score Works — Our Scoring Method Explained",
  description:
    "Exactly how SmartResume AI scores your resume: 11 rule-based checks worth 100 points, the caps that limit thin resumes, and what AI does and doesn't do.",
  alternates: { canonical: "/how-ats-score-works" },
};

const faqs = [
  {
    q: "Is this the same score a company's ATS gives me?",
    a: "No tool can show you a private employer's internal ranking. Our score measures the things applicant tracking systems and recruiters reliably screen for — parseable formatting, keyword coverage against the job description, and evidence of impact — so improving it improves your odds, but it isn't an employer's verdict.",
  },
  {
    q: "Does AI decide my score?",
    a: "No. The score is calculated by transparent rules, so the same resume and job description always get the same score. AI is only used (on Pro) to write tailored suggestions and rewrites.",
  },
  {
    q: "Why did my score change after I edited one line?",
    a: "Each category responds to specific evidence. Adding a measurable result to a bullet, or a missing keyword that you really have, moves the related category straight away — that's what the instant re-score in the editor shows.",
  },
  {
    q: "Why is my score capped?",
    a: "Very short or untargeted resumes can look good on a few checks without being competitive. Caps stop that; the report tells you which cap applied and how to lift it.",
  },
];

export default function HowAtsScoreWorksPage() {
  const engineeringPoints = SCORING_CATEGORIES.filter((c) => c.engineeringOnly).reduce((sum, c) => sum + c.points, 0);
  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "How the ATS score works", path: "/how-ats-score-works" }])} />
      <JsonLd data={faqJsonLd(faqs)} />
      <Navbar />
      <main className="flex-1 px-6 pt-32 pb-24">
        <article className="mx-auto max-w-4xl text-slate-300 leading-7">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">How the ATS score works</h1>
          <p className="text-lg mb-4">
            Your score out of 100 comes from 11 rule-based checks on your resume and the job description you paste. There is no
            black box: the same inputs always produce the same score, and every report explains which checks cost you points.
          </p>
          <p className="mb-10 text-slate-400">
            The report summarises the checks into three bars — <strong className="text-slate-200">Keyword match</strong>,{" "}
            <strong className="text-slate-200">Experience impact</strong> and <strong className="text-slate-200">Formatting</strong> — and lists each category under “Why this score?”.
          </p>

          <h2 className="font-display text-2xl font-bold text-white mb-4">The 11 checks</h2>
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="p-3">Check</th>
                  <th className="p-3">Points</th>
                  <th className="p-3">What it looks for</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {SCORING_CATEGORIES.map((c) => (
                  <tr key={c.name}>
                    <td className="p-3 font-medium text-white">
                      {c.name}
                      {c.engineeringOnly && <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-400">tech roles</span>}
                    </td>
                    <td className="p-3 text-slate-300">{c.points}</td>
                    <td className="p-3 text-slate-400">{c.checks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="font-display text-2xl font-bold text-white mt-12 mb-4">Fair for non-tech roles</h2>
          <p className="mb-4">
            Three checks ({engineeringPoints} points) only make sense for software and data roles. When your resume and job
            description are for sales, HR, finance, marketing, operations or product roles, those checks are skipped and the
            remaining points are scaled back up to 100 — so an HR executive isn&apos;t marked down for not mentioning Kubernetes.
          </p>

          <h2 className="font-display text-2xl font-bold text-white mt-12 mb-4">Caps that keep scores honest</h2>
          <p className="mb-4">A resume can&apos;t score above these limits while the condition applies. Your report says which one applied.</p>
          <ul className="mb-4 space-y-2">
            {SCORE_CAPS.map((c) => (
              <li key={c.cap} className="flex gap-3">
                <span className="w-12 shrink-0 font-semibold text-white">≤ {c.cap}</span>
                <span className="text-slate-400">{c.when}</span>
              </li>
            ))}
          </ul>

          <h2 className="font-display text-2xl font-bold text-white mt-12 mb-4">Keywords and synonyms</h2>
          <p className="mb-4">
            We pull the skills and requirements out of the job description and look for them — and common synonyms (for example
            “k8s” for Kubernetes or “Tally Prime” for Tally) — in your resume. Every missing keyword in the report quotes the
            line of the job description it came from, so you can judge whether it really applies to you. Never add a skill you
            don&apos;t have.
          </p>

          <h2 className="font-display text-2xl font-bold text-white mt-12 mb-4">What AI does (and doesn&apos;t)</h2>
          <p className="mb-4">
            AI never calculates your score. On Pro, it writes suggestions and bullet rewrites tailored to your resume and the job
            — and it is instructed not to invent metrics, leaving a placeholder for numbers only you can verify.
          </p>

          <h2 className="font-display text-2xl font-bold text-white mt-12 mb-4">Limitations</h2>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-slate-400">
            <li>Image-only (scanned) PDFs can&apos;t be read — export a text-based PDF instead.</li>
            <li>Highly designed, multi-column layouts may be read out of order, by us and by many ATS.</li>
            <li>A high score improves your odds of being shortlisted; it can&apos;t guarantee an interview.</li>
          </ul>

          <h2 className="font-display text-2xl font-bold text-white mt-12 mb-4">FAQ</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <summary className="cursor-pointer font-semibold text-white">{faq.q}</summary>
                <p className="mt-3 text-sm text-slate-400">{faq.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-12">
            <Link href="/scan" className="btn-primary px-6 py-3">Check my resume now</Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
