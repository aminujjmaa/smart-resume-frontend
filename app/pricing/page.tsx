import { type Metadata } from "next";
import Link from "next/link";
import { Check, X, Zap, HelpCircle } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "Pricing | SmartResume AI — Free ATS Resume Scanner",
  description:
    "SmartResume AI is free to use. Upgrade to Premium for unlimited scans, AI bullet rewrites, LinkedIn optimization, and cover letter generation.",
  keywords: [
    "resume checker pricing",
    "ATS scanner free",
    "resume optimizer price",
    "AI resume tool cost",
    "free resume enhancer",
  ],
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  const faqs = [
    {
      q: "What's the difference between Free and Premium?",
      a: "Free gives you a basic ATS score and 2 resume uploads. Premium unlocks unlimited uploads, line-by-line AI bullet rewriting, LinkedIn profile optimization, Cover Letter generation, and priority support."
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes! You can easily cancel your Premium subscription at any time from your dashboard settings. You will retain access until the end of your billing cycle."
    },
    {
      q: "How does the AI bullet rewriter work?",
      a: "We use a fine-tuned LLM model combined with our proprietary ATS scoring engine. It analyzes your bullet points, compares them against top-tier tech resumes, and rewrites them using the STAR method with quantifiable metrics."
    },
    {
      q: "Do you offer refunds?",
      a: "We offer a 7-day money-back guarantee. If you're not seeing more interviews after using our premium features, just email our support team for a full refund."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface-900">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="pt-32 pb-16 px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Invest in your career. <br className="hidden md:block" />
              <span className="gradient-text">Land the job faster.</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Join 10,000+ professionals who upgraded their resumes and got hired at top tech companies.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="px-6 pb-24 relative z-10">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Free */}
            <div className="card p-8 border border-white/5 bg-surface-800">
              <h2 className="text-2xl font-bold text-white mb-2">Basic</h2>
              <p className="text-slate-400 mb-6">For entry-level job seekers.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-slate-400">/forever</span>
              </div>
              <Link href="/register" className="btn-secondary w-full justify-center mb-8">
                Get Started for Free
              </Link>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-300">
                  <Check size={20} className="text-emerald-400" />
                  <span>2 Resume Uploads per month</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <Check size={20} className="text-emerald-400" />
                  <span>Basic ATS Score (0-100)</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <Check size={20} className="text-emerald-400" />
                  <span>Keyword Analysis</span>
                </li>
                <li className="flex items-center gap-3 text-slate-500 line-through">
                  <X size={20} className="text-slate-600" />
                  <span>AI Bullet Rewrites</span>
                </li>
                <li className="flex items-center gap-3 text-slate-500 line-through">
                  <X size={20} className="text-slate-600" />
                  <span>LinkedIn Profile Optimizer</span>
                </li>
                <li className="flex items-center gap-3 text-slate-500 line-through">
                  <X size={20} className="text-slate-600" />
                  <span>Cover Letter Generator</span>
                </li>
              </ul>
            </div>

            {/* Premium */}
            <div className="card p-8 border-brand-500/30 bg-gradient-to-b from-brand-500/10 to-surface-800 relative">
              <div className="absolute -top-4 inset-x-0 flex justify-center">
                <span className="px-3 py-1 bg-brand-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-brand-500/20">
                  Most Popular
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                Premium <Zap size={20} className="text-brand-400" />
              </h2>
              <p className="text-slate-400 mb-6">For ambitious professionals.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-white">₹999</span>
                <span className="text-slate-400">/month</span>
              </div>
              <Link href="/register" className="btn-primary w-full justify-center mb-8">
                Upgrade to Premium
              </Link>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-200 font-medium">
                  <Check size={20} className="text-emerald-400" />
                  <span>Unlimited Resume Uploads</span>
                </li>
                <li className="flex items-center gap-3 text-slate-200 font-medium">
                  <Check size={20} className="text-emerald-400" />
                  <span>Advanced ATS Scoring Breakdown</span>
                </li>
                <li className="flex items-center gap-3 text-brand-300 font-medium">
                  <Check size={20} className="text-brand-400" />
                  <span>Line-by-Line AI Bullet Rewrites</span>
                </li>
                <li className="flex items-center gap-3 text-brand-300 font-medium">
                  <Check size={20} className="text-brand-400" />
                  <span>LinkedIn Profile Optimizer</span>
                </li>
                <li className="flex items-center gap-3 text-brand-300 font-medium">
                  <Check size={20} className="text-brand-400" />
                  <span>AI Cover Letter Generator</span>
                </li>
                <li className="flex items-center gap-3 text-brand-300 font-medium">
                  <Check size={20} className="text-brand-400" />
                  <span>Networking Email Templates</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="py-16 border-y border-white/5 bg-surface-800/50">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h3 className="text-slate-400 font-medium mb-8">Trusted by candidates who got hired at:</h3>
            <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
              {/* Fake logos for design */}
              <div className="text-xl font-bold font-serif">Google</div>
              <div className="text-xl font-bold font-sans tracking-tighter">amazon</div>
              <div className="text-xl font-bold italic">Meta</div>
              <div className="text-xl font-bold font-mono">NETFLIX</div>
              <div className="text-xl font-bold">Microsoft</div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
              <p className="text-slate-400">Everything you need to know about the product and billing.</p>
            </div>
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
