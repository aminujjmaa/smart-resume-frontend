"use client";
import { useState } from "react";
import { toolsApi } from "@/lib/api";
import { Share2, AlertTriangle, CheckCircle2, Copy, Check } from "lucide-react";
import type { LinkedInResult } from "@/types";

export default function LinkedInPage() {
  const [profileText, setProfileText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LinkedInResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied((p) => ({ ...p, [id]: true }));
    setTimeout(() => setCopied((p) => ({ ...p, [id]: false })), 2000);
  };

  const handleAnalyze = async () => {
    if (!profileText.trim()) {
      setError("Please paste your LinkedIn profile text.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await toolsApi.analyzeLinkedIn({ profile_text: profileText, resume_text: resumeText });
      setResult(res.data);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { detail?: string } } };
      setError(apiError.response?.data?.detail || "Failed to analyze LinkedIn profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
          <Share2 className="text-blue-500" /> LinkedIn Profile Optimizer
        </h1>
        <p className="text-slate-400">
          Paste your LinkedIn About and Experience sections. We will score it and provide SEO-optimized rewrites to increase recruiter discoverability.
        </p>
      </div>

      {!result ? (
        <div className="space-y-6">
          <div className="card p-6">
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              LinkedIn Profile Text <span className="text-red-400">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-3">Copy everything from your Headline, About, and Experience sections.</p>
            <textarea
              className="w-full h-48 bg-surface-900 border border-white/10 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-500/50 resize-none transition-colors"
              placeholder="Paste LinkedIn profile here..."
              value={profileText}
              onChange={(e) => setProfileText(e.target.value)}
            />
          </div>

          <div className="card p-6">
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Resume Text (Optional)
            </label>
            <p className="text-xs text-slate-500 mb-3">Include this to check for consistency between your resume and LinkedIn.</p>
            <textarea
              className="w-full h-32 bg-surface-900 border border-white/10 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-500/50 resize-none transition-colors"
              placeholder="Paste resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn-primary w-full justify-center py-3"
          >
            {loading ? "Analyzing Profile..." : "Analyze Profile"}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Score Header */}
          <div className="card p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle className="text-surface-800" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                <circle
                  className="text-blue-500 transition-all duration-1000 ease-out"
                  strokeWidth="8" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * result.overall_score) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-display font-bold text-white">{result.overall_score}</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Profile Analysis Complete</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{result.summary}</p>
              <div className="flex gap-4 flex-wrap">
                <div className="px-3 py-1.5 rounded-lg bg-surface-800 text-xs">
                  <span className="text-slate-400">Headline:</span> <span className="text-white font-medium">{result.scores.headline}/100</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-surface-800 text-xs">
                  <span className="text-slate-400">About:</span> <span className="text-white font-medium">{result.scores.about}/100</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-surface-800 text-xs">
                  <span className="text-slate-400">Discoverability:</span> <span className="text-white font-medium">{result.scores.discoverability}/100</span>
                </div>
              </div>
            </div>
            <button onClick={() => setResult(null)} className="btn-secondary ml-auto shrink-0">New Analysis</button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Rewrites */}
            <div className="space-y-6">
              <div className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-200">Headline Rewrite</h3>
                  <button onClick={() => copyText(result.headline_rewrite, "headline")} className="text-slate-400 hover:text-white">
                    {copied["headline"] ? <Check size={16} className="text-emerald-400"/> : <Copy size={16}/>}
                  </button>
                </div>
                <div className="p-3 bg-surface-900 border border-white/5 rounded-lg text-sm text-slate-300">
                  {result.headline_rewrite}
                </div>
              </div>

              <div className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-200">About Section Rewrite</h3>
                  <button onClick={() => copyText(result.about_rewrite, "about")} className="text-slate-400 hover:text-white">
                    {copied["about"] ? <Check size={16} className="text-emerald-400"/> : <Copy size={16}/>}
                  </button>
                </div>
                <div className="p-3 bg-surface-900 border border-white/5 rounded-lg text-sm text-slate-300 whitespace-pre-wrap">
                  {result.about_rewrite}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="space-y-6">
              {result.consistency_issues && result.consistency_issues.length > 0 && (
                <div className="card p-5 border-orange-500/20 bg-orange-500/5">
                  <h3 className="font-semibold text-orange-400 mb-3 flex items-center gap-2"><AlertTriangle size={16}/> Resume Consistency</h3>
                  <ul className="space-y-2">
                    {result.consistency_issues.map((issue, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="text-orange-500 shrink-0">•</span>{issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="card p-5">
                <h3 className="font-semibold text-blue-400 mb-3 flex items-center gap-2"><CheckCircle2 size={16}/> Discoverability Tips</h3>
                <ul className="space-y-2">
                  {result.discoverability_tips.map((tip, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-blue-500 shrink-0">•</span>{tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card p-5">
                <h3 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2"><CheckCircle2 size={16}/> Skill Recommendations</h3>
                <div className="flex flex-wrap gap-2">
                  {result.skill_recommendations.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-surface-800 border border-white/5 rounded-md text-xs text-slate-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
