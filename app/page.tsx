import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import Link from "next/link";
import { ArrowRight, HelpCircle, Search } from "lucide-react";

const roleLinks = [
  "Software Engineer",
  "Product Manager",
  "Data Analyst",
  "Project Manager",
  "Marketing Manager",
  "Business Analyst",
];

const faqs = [
  {
    q: "What is an ATS resume scanner?",
    a: "An ATS resume scanner checks how well your resume can be parsed and matched by applicant tracking systems before a recruiter reviews it.",
  },
  {
    q: "Can I scan a PDF resume?",
    a: "Yes. The upload flow supports PDF, DOCX, TXT, and pasted text, then keeps the original preview visible during the report flow.",
  },
  {
    q: "Should I include a job description?",
    a: "Yes. A job description makes the report more specific because the score can compare your resume against the exact role requirements.",
  },
  {
    q: "Does the tool rewrite bullet points?",
    a: "The report highlights weak bullets and suggests stronger versions with clearer action, scope, and measurable outcomes.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SmartResume AI",
  url: "https://smartresume.co.in",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free ATS resume scanner with keyword gap analysis and AI bullet rewrites",
  },
  description:
    "Check your ATS score instantly. SmartResume AI scans your resume for keyword gaps, formatting issues, and weak bullet points so you land more interviews.",
  featureList: [
    "ATS score checker",
    "Resume keyword gap analysis",
    "AI-powered bullet point rewriter",
    "Formatting risk detection",
    "Free resume enhancer",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default function LandingPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Pricing />

      <section className="section bg-surface-950">
        <div className="container-lg mx-auto">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="badge badge-info mb-4">Role-specific scans</span>
              <h2 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">
                Start with the role you are targeting.
              </h2>
            </div>
            <p className="max-w-md text-base leading-8 text-slate-400">
              Choose a common job family, add your resume, and tailor the report around the language hiring teams expect for that role.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {roleLinks.map((role) => {
              const slug = role.toLowerCase().replace(/\s+/g, "-");
              return (
                <Link
                  key={role}
                  href={`/ats-score/${slug}`}
                  className="group flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.035] px-5 py-4 transition-all hover:border-teal-300/25 hover:bg-white/[0.055]"
                >
                  <span className="flex items-center gap-3 font-semibold text-slate-200">
                    <Search size={17} className="text-teal-300" />
                    {role} ATS scanner
                  </span>
                  <ArrowRight size={16} className="text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-teal-300" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-[#070b12]">
        <div className="container-md mx-auto">
          <div className="mb-10 text-center">
            <span className="badge badge-info mb-4">FAQ</span>
            <h2 className="font-display text-4xl font-bold text-white md:text-5xl">
              Resume scanner questions, answered.
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                <div className="flex gap-3">
                  <HelpCircle size={18} className="mt-1 shrink-0 text-teal-300" />
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">{faq.q}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section hero-bg text-center">
        <div className="container-md mx-auto">
          <h2 className="font-display text-4xl font-bold text-white md:text-5xl">
            Ready to see what your resume is missing?
          </h2>
          <p className="mx-auto mb-8 mt-4 max-w-lg text-lg leading-8 text-slate-300">
            Run a free ATS scan, review the report, and fix the highest-impact gaps before your next application.
          </p>
          <Link href="/scan" className="btn-primary inline-flex px-10 py-4 text-base">
            Scan My Resume Free
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
