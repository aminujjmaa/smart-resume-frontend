import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { fetchScoreShare } from "@/lib/serverApi";

type Props = { params: { shareId: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const share = await fetchScoreShare(params.shareId);
  const title = share ? `My resume scored ${share.ats_score}/100 on the ATS check` : "ATS score card";
  return {
    title,
    description: "Check your own resume's ATS score free — missing keywords, formatting risks and fixes in under a minute.",
    robots: { index: false, follow: true },
  };
}

function Bar({ label, pct }: { readonly label: string; readonly pct: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-surface-800">
        <div className="h-2 rounded-full bg-gradient-to-r from-teal-400 to-brand-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default async function ScoreSharePage({ params }: Props) {
  const share = await fetchScoreShare(params.shareId);
  if (!share) notFound();
  const b = share.score_breakdown;

  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <Navbar />
      <main className="flex-1 px-6 pt-32 pb-24">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-sm uppercase tracking-widest text-teal-300">ATS score card</p>
          <p className="mt-4 font-display text-8xl font-bold text-white">
            {share.ats_score}
            <span className="text-3xl text-slate-500">/100</span>
          </p>
          <div className="mt-10 space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left">
            <Bar label="Keyword match" pct={b.keyword_match_pct} />
            <Bar label="Experience impact" pct={b.experience_impact_pct} />
            <Bar label="Formatting" pct={b.formatting_score_pct} />
          </div>
          <p className="mt-8 text-slate-400">How does your resume compare? Get your score, missing keywords and top fixes — free.</p>
          <Link href="/scan" className="btn-primary mt-6 inline-flex px-8 py-4 text-base">
            Check my resume <ArrowRight size={18} />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
