"use client";
import { useState } from "react";
import { toolsApi } from "@/lib/api";
import { Mail, Check, Copy } from "lucide-react";
import type { CoverLetterResult } from "@/types";

export default function CoverLetterPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CoverLetterResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied((p) => ({ ...p, [id]: true }));
    setTimeout(() => setCopied((p) => ({ ...p, [id]: false })), 2000);
  };

  const handleGenerate = async () => {
    if (!resumeText.trim() || !jobDescription.trim() || !companyName.trim() || !roleTitle.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await toolsApi.generateCoverLetter({
        resume_text: resumeText,
        job_description: jobDescription,
        company_name: companyName,
        role_title: roleTitle,
        tone
      });
      setResult(res.data);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { detail?: string } } };
      setError(apiError.response?.data?.detail || "Failed to generate cover letter.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
          <Mail className="text-purple-500" /> AI Cover Letter Generator
        </h1>
        <p className="text-slate-400">
          Generate a highly customized cover letter that perfectly aligns your experience with the job description.
        </p>
      </div>

      {!result ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="card p-6">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Resume Text <span className="text-red-400">*</span>
              </label>
              <textarea
                className="w-full h-48 bg-surface-900 border border-white/10 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-500/50 resize-none transition-colors"
                placeholder="Paste your full resume here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>
            <div className="card p-6">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Job Description <span className="text-red-400">*</span>
              </label>
              <textarea
                className="w-full h-48 bg-surface-900 border border-white/10 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-500/50 resize-none transition-colors"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className="w-full bg-surface-900 border border-white/10 rounded-lg p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-500/50"
                  placeholder="e.g. Acme Corp"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Role Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className="w-full bg-surface-900 border border-white/10 rounded-lg p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-500/50"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Tone
                </label>
                <select
                  className="w-full bg-surface-900 border border-white/10 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-brand-500/50"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option value="professional">Professional</option>
                  <option value="confident">Confident & Direct</option>
                  <option value="friendly">Friendly & Enthusiastic</option>
                  <option value="executive">Executive</option>
                  <option value="entry-level">Entry-Level</option>
                </select>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm px-2">{error}</p>}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-primary w-full justify-center py-4"
            >
              {loading ? "Generating Cover Letter..." : "Generate Cover Letter"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <button onClick={() => setResult(null)} className="btn-secondary mb-4">← Create Another</button>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-200">Full Cover Letter</h3>
                  <button onClick={() => copyText(result.full_letter, "full")} className="text-slate-400 hover:text-white">
                    {copied["full"] ? <Check size={16} className="text-emerald-400"/> : <Copy size={16}/>}
                  </button>
                </div>
                <div className="p-4 bg-surface-900 border border-white/5 rounded-xl text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {result.full_letter}
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-200">Short Email Version</h3>
                  <button onClick={() => copyText(result.short_email, "short")} className="text-slate-400 hover:text-white">
                    {copied["short"] ? <Check size={16} className="text-emerald-400"/> : <Copy size={16}/>}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mb-3">Perfect for cold outreach or when emailing the hiring manager directly.</p>
                <div className="p-4 bg-surface-900 border border-white/5 rounded-xl text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {result.short_email}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="font-semibold text-purple-400 mb-4">Key Highlights Emphasized</h3>
                <ul className="space-y-3">
                  {result.key_highlights.map((hl, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-purple-500 mt-1 shrink-0">•</span>
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
