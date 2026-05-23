/* eslint-disable */
"use client";
import Link from "next/link";
import { TrendingUp, Upload, History, ArrowRight, Target, Award, Clock } from "lucide-react";
import { useAuthStore } from "@/store/useAppStore";
import { useQuery } from "@tanstack/react-query";
import { analysisApi } from "@/lib/api";
import type { HistoryItem } from "@/types";

function StatCard({ icon: Icon, label, value, sub, color }: any) {
  return (
    <div className="card flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-slate-400 text-sm">{label}</p>
        <p className="font-display text-2xl font-bold text-white">{value}</p>
        {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  const { user } = useAuthStore();

  const { data: history } = useQuery({
    queryKey: ["history"],
    queryFn: () => analysisApi.history().then((r) => r.data as HistoryItem[]),
  });

  const scores = (history || []).filter((h) => h.ats_score).map((h) => h.ats_score!);
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const bestScore = scores.length ? Math.max(...scores) : 0;

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-1">
          Welcome back{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""} 👋
        </h1>
        <p className="text-slate-400">Here's your resume optimization summary</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard icon={Target}     label="Analyses Done"  value={history?.length || 0}  sub="Total uploads"      color="bg-gradient-to-br from-brand-500 to-blue-600" />
        <StatCard icon={TrendingUp} label="Average Score"  value={avgScore || "—"}        sub="ATS score average"  color="bg-gradient-to-br from-purple-500 to-pink-600" />
        <StatCard icon={Award}      label="Best Score"     value={bestScore || "—"}       sub="Highest ATS score"  color="bg-gradient-to-br from-accent-green to-teal-600" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <Link href="/dashboard/upload" id="dash-upload-cta" className="card group flex items-center gap-5 cursor-pointer">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-500/5 border border-brand-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload size={24} className="text-brand-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">Analyze New Resume</h3>
            <p className="text-slate-400 text-sm">Upload or paste your resume + job description</p>
          </div>
          <ArrowRight size={18} className="text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link href="/dashboard/history" id="dash-history-cta" className="card group flex items-center gap-5 cursor-pointer">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <History size={24} className="text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">View Past Analyses</h3>
            <p className="text-slate-400 text-sm">Track your progress and compare scores</p>
          </div>
          <ArrowRight size={18} className="text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Recent history */}
      {history && history.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white flex items-center gap-2">
              <Clock size={16} className="text-brand-400" /> Recent Analyses
            </h2>
            <Link href="/dashboard/history" className="text-brand-400 text-sm hover:text-brand-300">View all →</Link>
          </div>
          <div className="space-y-3">
            {history.slice(0, 3).map((item) => (
              <Link key={item.id} href={`/dashboard/results/${item.id}`}
                className="flex items-center justify-between p-4 rounded-xl transition-all hover:bg-white/3 border border-transparent hover:border-brand-500/10">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.status === "done" ? "bg-accent-green" : "bg-amber-400"}`} />
                  <span className="text-slate-300 text-sm">Resume #{item.id.slice(0, 8)}</span>
                  <span className="text-slate-500 text-xs">{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  {item.ats_score != null && (
                    <span className="font-display font-bold text-lg gradient-text">{item.ats_score}</span>
                  )}
                  <ArrowRight size={14} className="text-slate-600" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
