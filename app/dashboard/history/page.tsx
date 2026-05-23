/* eslint-disable */
"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Clock, ArrowRight, Target, AlertCircle } from "lucide-react";
import { analysisApi } from "@/lib/api";
import type { HistoryItem } from "@/types";

export default function HistoryPage() {
  const { data: history, isLoading, error } = useQuery<HistoryItem[]>({
    queryKey: ["history"],
    queryFn: () => analysisApi.history().then((r) => r.data),
  });

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2">Analysis History</h1>
        <p className="text-slate-400">Track your resume improvements over time</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mb-4" />
          <p className="text-slate-400">Loading history...</p>
        </div>
      ) : error ? (
        <div className="card text-center p-12">
          <AlertCircle size={32} className="text-red-400 mx-auto mb-4" />
          <p className="text-red-400 font-medium mb-2">Failed to load history</p>
          <p className="text-slate-500 text-sm">Please try refreshing the page</p>
        </div>
      ) : !history || history.length === 0 ? (
        <div className="card text-center p-16 border-dashed">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-6">
            <Target size={24} className="text-brand-400" />
          </div>
          <h2 className="font-display text-xl font-bold text-white mb-2">No analyses yet</h2>
          <p className="text-slate-400 mb-6 max-w-sm mx-auto">
            You haven't analyzed any resumes yet. Upload your first resume to see it here.
          </p>
          <Link href="/dashboard/upload" className="btn-primary inline-flex">
            Analyze Resume Now
          </Link>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="p-4 pl-6">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">ATS Score</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <Clock size={16} className="text-slate-500 group-hover:text-brand-400 transition-colors" />
                        <div>
                          <p className="text-sm font-medium text-slate-200">
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(item.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {item.status === "done" ? (
                        <span className="badge badge-matched text-xs">Completed</span>
                      ) : item.status === "failed" ? (
                        <span className="badge badge-missing text-xs">Failed</span>
                      ) : (
                        <span className="badge badge-info text-xs">Processing</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {item.ats_score != null ? (
                        <span className={`font-display font-bold text-lg ${
                          item.ats_score >= 80 ? "text-brand-400" :
                          item.ats_score >= 60 ? "text-accent-green" :
                          item.ats_score >= 40 ? "text-amber-400" : "text-red-400"
                        }`}>
                          {item.ats_score}
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {item.status === "done" ? (
                        <Link
                          href={`/dashboard/results/${item.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-white transition-all bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20"
                        >
                          View Results <ArrowRight size={14} />
                        </Link>
                      ) : (
                        <span className="text-slate-500 text-xs">Not available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
