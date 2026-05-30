import { CheckCircle2, XCircle } from "lucide-react";
import type { KeywordMatch } from "@/types";

export default function SkillTable({ title, skills }: Readonly<{ title: string; skills: KeywordMatch[] }>) {
  if (!skills || skills.length === 0) return null;
  return (
    <div className="card overflow-hidden mb-6">
      <div className="bg-surface-900/50 px-4 py-3 border-b border-white/5">
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-surface-800/30 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Skill</th>
              <th className="px-4 py-3 font-medium text-center w-32">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {skills.map((s) => (
              <tr key={s.skill} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 font-medium">{s.skill}</td>
                <td className="px-4 py-3 text-center">
                  {s.found ? (
                    <span className="inline-flex items-center justify-center w-full gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 size={12} /> Found
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-full gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400 border border-red-500/20">
                      <XCircle size={12} /> Missing
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
