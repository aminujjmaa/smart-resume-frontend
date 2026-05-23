import { BookOpen } from "lucide-react";

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
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
          <BookOpen className="text-brand-500" /> Action Verbs Library
        </h1>
        <p className="text-slate-400">
          Never use &quot;Responsible for&quot; or &quot;Worked on&quot; again. Replace weak verbs with strong, active verbs that signal ownership and impact.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <div key={idx} className="card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">{cat.name}</h2>
            <div className="flex flex-wrap gap-2">
              {cat.verbs.map((verb, vIdx) => (
                <span key={vIdx} className="px-3 py-1.5 bg-surface-800 border border-white/5 rounded-lg text-sm text-slate-300 hover:text-white hover:border-brand-500/50 transition-colors cursor-default">
                  {verb}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
