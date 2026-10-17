import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import BulletCheckerClient from "./BulletCheckerClient";
import { JsonLd, faqJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Resume Bullet Point Checker — Score & Rewrite Your Bullets Free",
  description:
    "Paste your resume bullet points to score each one out of 100 for action verbs, measurable results and clarity — and get a stronger rewrite. Free, no sign-up.",
  alternates: { canonical: "/tools/resume-bullet-checker" },
};

const faqs = [
  {
    q: "What makes a strong resume bullet point?",
    a: "It starts with a specific action verb, says what you did and with what tools, and ends with a measurable result — a number, percentage, rupee amount or time saved.",
  },
  {
    q: "What if I don't have numbers for my work?",
    a: "Estimate honestly from records you have — tickets closed, reports per month, people trained, hours saved. If you truly have no figure, describe the scale or the outcome instead. Never invent numbers.",
  },
  {
    q: "Why are 'responsible for' bullets weak?",
    a: "They describe a duty, not what you achieved. Recruiters skim for ownership and results, so lead with what you did and what changed because of it.",
  },
];

export default function BulletCheckerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <JsonLd data={faqJsonLd(faqs)} />
      <Navbar />
      <main className="flex-1 px-4 pt-28 pb-24">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white">Resume bullet point checker</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-400">
            Paste up to 15 bullets, one per line. Each gets a score out of 100 with what&apos;s missing and a stronger version
            to adapt — with a placeholder wherever a real number belongs.
          </p>
          <div className="mt-10">
            <BulletCheckerClient />
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
