import Link from "next/link";
import { FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function ResumeExamplesPage() {
  const examples = [
    {
      role: "Software Engineer",
      level: "Mid-Senior",
      focus: "Backend & Systems",
      score: 92,
      points: [
        "Uses strong action verbs (Architected, Scaled)",
        "Quantifies impact (reduced latency by 40%)",
        "Clear technical skills section"
      ]
    },
    {
      role: "Product Manager",
      level: "Senior",
      focus: "B2B SaaS",
      score: 94,
      points: [
        "Highlights ARR growth and adoption metrics",
        "Shows cross-functional leadership",
        "Focuses on product outcomes, not just output"
      ]
    },
    {
      role: "Data Scientist",
      level: "Entry-Level",
      focus: "Machine Learning",
      score: 88,
      points: [
        "Details specific models used (XGBoost, PyTorch)",
        "Links to GitHub portfolio projects",
        "Emphasizes business value of models"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface-900">
      <Navbar />
      
      <main className="flex-1">
        <section className="pt-32 pb-16 px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Resume Examples That Pass the ATS
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              See what a 90+ score looks like. These resume structures have successfully landed interviews at top tech companies.
            </p>
          </div>
        </section>

        <section className="px-6 pb-24 relative z-10">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {examples.map((ex, i) => (
              <div key={i} className="card p-8 flex flex-col h-full border border-white/5 hover:border-brand-500/30 transition-colors">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full">
                      {ex.level}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 text-sm font-bold">
                      <FileText size={14} /> Score: {ex.score}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{ex.role}</h2>
                  <p className="text-slate-400 text-sm">{ex.focus}</p>
                </div>
                
                <div className="mb-8 flex-1">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">Why it works:</h3>
                  <ul className="space-y-3">
                    {ex.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link href="/register" className="btn-secondary w-full justify-center group">
                  Build yours now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
