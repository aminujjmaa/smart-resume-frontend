import { useState } from "react";
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Lightbulb, UserRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { BulletFeedback } from "@/types";

export default function BulletFeedbackList({ feedbackList }: { feedbackList: BulletFeedback[] }) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-4">
      {feedbackList.map((item, idx) => {
        const isExpanded = expanded[idx] ?? true;
        const pct = item.score;
        const color =
          pct >= 80 ? "text-emerald-400" :
          pct >= 60 ? "text-amber-400" :
          "text-red-400";
        
        return (
          <div key={idx} className="card">
            <button
              className="w-full flex items-center justify-between mb-0 text-left"
              onClick={() => setExpanded((p) => ({ ...p, [idx]: !isExpanded }))}
            >
              <div className="flex items-center gap-3">
                <span className={`font-mono font-bold ${color}`}>{item.score}/100</span>
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Bullet {idx + 1}</span>
              </div>
              {isExpanded ? <ChevronUp size={15} className="text-slate-500" /> : <ChevronDown size={15} className="text-slate-500" />}
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-4 pb-2">
                    <div className="p-3 rounded-lg bg-surface-900 border border-white/5">
                      <p className="text-slate-300 text-sm leading-relaxed">{item.bullet}</p>
                    </div>
                    
                    {item.weakness_tags && item.weakness_tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.weakness_tags.map(tag => (
                          <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded border border-orange-500/30 bg-orange-500/10 text-orange-400 font-semibold">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="rounded-lg border border-orange-500/20 bg-orange-500/10 p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-300">
                        <AlertCircle size={16} />
                        Diagnosis
                      </div>
                      <p className="text-sm leading-relaxed text-slate-300">{item.diagnosis || item.feedback}</p>
                    </div>

                    {item.recruiter_perception && (
                      <div className="rounded-lg border border-blue-400/20 bg-blue-400/10 p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-200">
                          <UserRound size={16} />
                          How a recruiter reads it
                        </div>
                        <p className="text-sm leading-relaxed text-slate-300">{item.recruiter_perception}</p>
                      </div>
                    )}

                    {item.improvement_strategy && (
                      <div className="rounded-lg border border-teal-400/20 bg-teal-400/10 p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-200">
                          <Lightbulb size={16} />
                          How to improve it
                        </div>
                        <p className="text-sm leading-relaxed text-slate-300">{item.improvement_strategy}</p>
                      </div>
                    )}

                    {(item.evidence_options?.length || 0) > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Realistic evidence to look for</p>
                        <div className="flex flex-wrap gap-2">
                          {item.evidence_options?.map((option) => (
                            <span key={option} className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-slate-300">
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.strong_alternative && (
                      <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-200">
                          <CheckCircle2 size={16} />
                          Stronger version
                        </div>
                        <p className="text-sm leading-relaxed text-slate-200">{item.strong_alternative}</p>
                        {(item.why_stronger?.length || 0) > 0 && (
                          <ul className="mt-3 space-y-1">
                            {item.why_stronger?.map((reason) => (
                              <li key={reason} className="flex items-start gap-2 text-xs text-slate-400">
                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-300" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
