import { AlertTriangle, CheckCircle2, ListChecks, Sparkles, Target, Wand2 } from "lucide-react";
import type { AnalysisResult, MissingKeyword } from "@/types";

function SectionTitle({ icon, children }: { readonly icon: React.ReactNode; readonly children: React.ReactNode }) {
  return (
    <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-white">
      {icon}
      {children}
    </h2>
  );
}

function MissingKeywords({ jdProvided, missing }: { readonly jdProvided: boolean; readonly missing: MissingKeyword[] }) {
  if (!jdProvided) {
    return <p className="text-sm text-slate-400">Paste a job description when you scan to see exactly which keywords you&apos;re missing.</p>;
  }
  if (missing.length === 0) {
    return (
      <p className="flex items-center gap-2 text-sm text-emerald-300">
        <CheckCircle2 size={16} /> Your resume covers every key term we found in the job description.
      </p>
    );
  }
  return (
    <div className="space-y-2">
      {missing.map((kw) => (
        <div key={kw.keyword} className="flex flex-col gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
          <span className="w-48 shrink-0 font-semibold text-white">{kw.keyword}</span>
          <span className={`w-fit rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${kw.importance === "required" ? "bg-red-500/15 text-red-300" : "bg-amber-500/15 text-amber-300"}`}>
            {kw.importance}
          </span>
          {kw.jd_evidence && kw.jd_evidence !== kw.keyword && <span className="text-xs italic text-slate-400">“{kw.jd_evidence}”</span>}
        </div>
      ))}
      <p className="pt-1 text-xs text-slate-500">Only add a keyword if it&apos;s genuinely true for you — then prove it inside a bullet, not just the skills list.</p>
    </div>
  );
}

/** The full, read-only report every visitor gets for free. */
export default function FreeReport({ result }: { readonly result: AnalysisResult }) {
  const required = (result.missing_keywords ?? []).filter((k) => k.importance === "required");
  const preferred = (result.missing_keywords ?? []).filter((k) => k.importance === "preferred");
  const jdProvided = !(result.missing_keywords ?? []).some((k) => k.keyword.toLowerCase().includes("not provided"));

  return (
    <div className="space-y-10">
      {(result.priority_fixes?.length ?? 0) > 0 && (
        <section>
          <SectionTitle icon={<ListChecks size={20} className="text-teal-300" />}>Your top fixes</SectionTitle>
          <ol className="space-y-3">
            {result.priority_fixes.map((fix, i) => (
              <li key={fix} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-200">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-400/15 text-xs font-bold text-teal-200">
                  {i + 1}
                </span>
                {fix}
              </li>
            ))}
          </ol>
        </section>
      )}

      <section>
        <SectionTitle icon={<Target size={20} className="text-red-300" />}>Missing keywords</SectionTitle>
        <MissingKeywords jdProvided={jdProvided} missing={[...required, ...preferred]} />
      </section>



      {(result.formatting_risks?.length ?? 0) > 0 && (
        <section>
          <SectionTitle icon={<AlertTriangle size={20} className="text-amber-300" />}>Formatting risks</SectionTitle>
          <div className="space-y-3">
            {result.formatting_risks.map((risk) => (
              <div key={risk.issue} className="rounded-xl border border-amber-500/15 bg-amber-500/[0.04] p-4">
                <p className="font-semibold text-white">{risk.issue}</p>
                {risk.why_it_matters && <p className="mt-1 text-sm text-slate-400">{risk.why_it_matters}</p>}
                {risk.fix && <p className="mt-2 text-sm text-teal-200">Fix: {risk.fix}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {(result.bullet_suggestions?.length ?? 0) > 0 && (
        <section>
          <SectionTitle icon={<Wand2 size={20} className="text-brand-300" />}>Stronger versions of your bullets</SectionTitle>
          <div className="space-y-3">
            {result.bullet_suggestions.map((b) => (
              <div key={b.original} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm text-slate-400 line-through decoration-red-400/60">{b.original}</p>
                <p className="mt-2 text-sm font-medium text-white">{b.rewritten}</p>
                <p className="mt-2 text-xs text-slate-500">{b.reason}</p>
              </div>
            ))}
          </div>
          {result.suggestions_source !== "ai" && (
            <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <Sparkles size={13} className="text-brand-300" />
              Rule-based suggestions. Pro writes tailored AI rewrites for every bullet.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
