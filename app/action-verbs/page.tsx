import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "Resume Action Verbs Library | SmartResume AI",
  description: "Replace weak verbs like 'Managed' and 'Responsible for' with strong, impactful action verbs that signal ownership and drive ATS scores higher.",
  keywords: ["resume action verbs", "strong resume verbs", "words to use instead of managed", "resume writing tips"],
  alternates: { canonical: "/action-verbs" },
};

export default function ActionVerbsPage() {
  const categories = [
    {
      name: "Leadership & Management",
      verbs: ["Spearheaded", "Orchestrated", "Directed", "Mentored", "Cultivated", "Pioneered", "Championed", "Guided", "Supervised", "Overhauled"]
    },
    {
      name: "Achievement & Impact",
      verbs: ["Accelerated", "Maximized", "Surpassed", "Outperformed", "Optimized", "Transformed", "Generated", "Revitalized", "Boosted", "Slashed"]
    },
    {
      name: "Technical & Engineering",
      verbs: ["Architected", "Engineered", "Deployed", "Refactored", "Programmed", "Configured", "Integrated", "Automated", "Migrated", "Provisioned"]
    },
    {
      name: "Problem Solving",
      verbs: ["Resolved", "Diagnosed", "Troubleshot", "Untangled", "Deciphered", "Mitigated", "Reconciled", "Investigated", "Remedied", "Overcame"]
    },
    {
      name: "Communication & Teamwork",
      verbs: ["Collaborated", "Facilitated", "Negotiated", "Presented", "Advocated", "Mediated", "Liaised", "Authored", "Consulted", "Conveyed"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface-900">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-sm font-bold tracking-wider mb-6">
              <BookOpen size={16} /> Free Resume Tool
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              The Ultimate Action Verbs Library
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Never use &quot;Responsible for&quot; or &quot;Worked on&quot; again. Replace weak phrases with strong, active verbs that signal ownership and impact to hiring managers.
            </p>
          </div>
        </section>

        {/* Verbs Library Grid */}
        <section className="px-6 pb-24 relative z-10">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.name} className="card p-6 border border-white/5 bg-white/[0.02]">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  {cat.name}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {cat.verbs.map((verb) => (
                    <span 
                      key={verb} 
                      className="px-3 py-1.5 bg-surface-800 border border-white/10 rounded-lg text-sm text-slate-300 hover:text-white hover:border-brand-500/50 transition-colors cursor-default"
                    >
                      {verb}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="max-w-4xl mx-auto mt-16 p-8 md:p-12 rounded-2xl border border-brand-500/20 bg-brand-500/10 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to put these verbs to work?</h3>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto">
              Use our AI resume builder to automatically scan your bullet points and suggest the perfect action verbs based on your industry.
            </p>
            <Link href="/register" className="btn-primary inline-flex px-8 py-4 text-base">
              Build Your Resume For Free <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
