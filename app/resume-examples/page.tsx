import { type Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { SEO_DATA } from "@/lib/seo-data";

export const metadata: Metadata = {
  title: "ATS-Friendly Resume Examples | SmartResume AI",
  description:
    "See real resume examples that scored 90+ on ATS scanners. Browse by job title and learn exactly why they pass automated filters.",
  keywords: [
    "ATS resume examples",
    "ATS friendly resume sample",
    "resume examples that pass ATS",
    "good resume example",
    "resume template ATS",
    "resume sample software engineer",
    "resume sample product manager",
  ],
  alternates: { canonical: "/resume-examples" },
};

export default function ResumeExamplesPage() {
  // Group jobs by category
  const groupedJobs = SEO_DATA.reduce((acc, job) => {
    if (!acc[job.category]) {
      acc[job.category] = [];
    }
    acc[job.category].push(job);
    return acc;
  }, {} as Record<string, typeof SEO_DATA>);

  const categories = Object.keys(groupedJobs).sort();

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
          <div className="max-w-6xl mx-auto space-y-20">
            {categories.map((category) => (
              <div key={category}>
                <h2 className="text-3xl font-display font-bold text-white mb-8 border-b border-white/10 pb-4">
                  {category} Resumes
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {groupedJobs[category].map((ex) => (
                    <div key={ex.slug} className="card p-8 flex flex-col h-full border border-white/5 hover:border-brand-500/30 transition-colors bg-white/[0.02]">
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full">
                            {ex.level}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-400 text-sm font-bold">
                            <FileText size={14} /> Score: {ex.score}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white leading-snug mt-4">{ex.h1.split(" Resume")[0]}</h3>
                      </div>
                      
                      <div className="mb-8 flex-1">
                        <p className="text-sm text-slate-400 line-clamp-3 mb-4">
                          {ex.description}
                        </p>
                        <ul className="space-y-3">
                          {ex.whyItWorks.slice(0, 2).map((pt) => (
                            <li key={pt} className="flex items-start gap-2 text-sm text-slate-300">
                              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Link href={`/resume-examples/${ex.slug}`} className="btn-secondary w-full justify-center group mt-auto">
                        View Resume <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
