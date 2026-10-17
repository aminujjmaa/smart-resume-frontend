import { type Metadata } from "next";
import { HelpCircle } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import PlanCards from "@/components/pricing/PlanCards";
import { ANON_DAILY_SCANS, FREE_DAILY_SCANS, PRO_PERIOD, PRO_PRICE, REFUND_WINDOW_DAYS } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Pricing — Free ATS Resume Scanner, Pro ₹99/month",
  description: `Scan your resume free (${ANON_DAILY_SCANS} scans a day, no sign-up). Pro is ${PRO_PRICE}/${PRO_PERIOD} for AI suggestions, bullet rewrites, cover letters, LinkedIn review and interview prep.`,
  alternates: { canonical: "/pricing" },
};

const faqs = [
  {
    q: "What do I get for free?",
    a: `Without signing up you get ${ANON_DAILY_SCANS} full ATS reports a day: score breakdown, missing keywords quoted from the job description, formatting risks, your top fixes and suggested bullet rewrites. A free account raises that to ${FREE_DAILY_SCANS} scans a day and adds the editor with instant re-scoring, downloads and history.`,
  },
  {
    q: "What does Pro add?",
    a: "AI-written suggestions tailored to your resume and target job on every scan, one-click AI bullet rewrites, a cover letter generator, LinkedIn profile review, interview prep, networking emails and the premium resume templates.",
  },
  {
    q: "How does billing work?",
    a: `Pro costs ${PRO_PRICE} per ${PRO_PERIOD} and renews automatically through Razorpay (UPI, cards, netbanking). Cancel anytime from Billing — you keep Pro until the end of the period you've paid for, and you won't be charged again.`,
  },
  {
    q: "Do you offer refunds?",
    a: `Yes. If Pro isn't right for you, email us within ${REFUND_WINDOW_DAYS} days of your first payment for a full refund. See the refund policy for details.`,
  },
  {
    q: "How is the ATS score calculated?",
    a: "The score comes from transparent, rule-based checks — keyword coverage against the job description, measurable impact in your bullets, and formatting that applicant tracking systems can parse. AI is only used to write suggestions, never to invent your score.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navbar />

      <main className="flex-1">
        <section className="pt-32 pb-16 px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              The full ATS report is free.
              <br className="hidden md:block" />
              <span className="gradient-text"> Pro is {PRO_PRICE}/{PRO_PERIOD}.</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Find out why your resume isn&apos;t getting shortlisted, fix it, and only pay if you want AI help tailoring every application.
            </p>
          </div>
        </section>

        <section className="px-6 pb-24 relative z-10">
          <PlanCards />
        </section>

        <section className="py-24 px-6 border-t border-white/5">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Frequently asked questions</h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.q} className="card p-6">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-start gap-3">
                    <HelpCircle className="text-brand-500 shrink-0 mt-0.5" size={20} />
                    {faq.q}
                  </h3>
                  <p className="text-slate-400 leading-relaxed pl-8">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
