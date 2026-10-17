"use client";
import { useState } from "react";
import { toolsApi } from "@/lib/api";
import { Network, Check, Copy } from "lucide-react";
import type { NetworkingEmailResult } from "@/types";

export default function NetworkingEmailPage() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [targetName, setTargetName] = useState("");
  const [emailType, setEmailType] = useState("cold_outreach");
  const [jobDescription, setJobDescription] = useState("");
  const [userBackground, setUserBackground] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NetworkingEmailResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied((p) => ({ ...p, [id]: true }));
    setTimeout(() => setCopied((p) => ({ ...p, [id]: false })), 2000);
  };

  const handleGenerate = async () => {
    if (!company.trim() || !role.trim() || !userBackground.trim()) {
      setError("Please fill in the required fields: Company, Role, and Background.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await toolsApi.generateNetworkingEmail({
        company,
        role,
        target_name: targetName,
        email_type: emailType,
        job_description: jobDescription,
        user_background: userBackground,
        goal,
      });
      setResult(res.data);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { detail?: string } } };
      setError(apiError.response?.data?.detail || "Failed to generate networking email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
          <Network className="text-teal-500" /> Networking Email Generator
        </h1>
        <p className="text-slate-400">
          Generate high-converting cold emails and LinkedIn DMs to get referrals, schedule coffee chats, or follow up on applications.
        </p>
      </div>

      {!result ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="card p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Target Company <span className="text-red-400">*</span></label>
                <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Stripe" className="w-full bg-surface-900 border border-white/10 rounded-lg p-3 text-sm text-slate-200 focus:border-brand-500/50 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Target Role <span className="text-red-400">*</span></label>
                <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Product Manager" className="w-full bg-surface-900 border border-white/10 rounded-lg p-3 text-sm text-slate-200 focus:border-brand-500/50 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Contact Name (Optional)</label>
                <input type="text" value={targetName} onChange={e => setTargetName(e.target.value)} placeholder="e.g. John Doe" className="w-full bg-surface-900 border border-white/10 rounded-lg p-3 text-sm text-slate-200 focus:border-brand-500/50 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Email Type</label>
                <select value={emailType} onChange={e => setEmailType(e.target.value)} className="w-full bg-surface-900 border border-white/10 rounded-lg p-3 text-sm text-slate-200 focus:border-brand-500/50 outline-none transition-colors">
                  <option value="cold_outreach">Cold Outreach (General)</option>
                  <option value="coffee_chat">Coffee Chat Request</option>
                  <option value="referral_request">Referral Request</option>
                  <option value="follow_up">Follow Up</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="card p-6">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Your Background <span className="text-red-400">*</span></label>
              <p className="text-xs text-slate-500 mb-3">Briefly describe your experience (e.g. &quot;3 YOE in B2B SaaS marketing&quot;).</p>
              <textarea value={userBackground} onChange={e => setUserBackground(e.target.value)} className="w-full min-h-[100px] bg-surface-900 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:border-brand-500/50 outline-none transition-colors resize-none" placeholder="Your background..."></textarea>
            </div>
            <div className="card p-6">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Job Description / JD (Optional)</label>
              <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} className="w-full min-h-[140px] bg-surface-900 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:border-brand-500/50 outline-none transition-colors resize-none" placeholder="Paste the JD here..."></textarea>
            </div>
            <div className="card p-6">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Specific Goal (Optional)</label>
              <p className="text-xs text-slate-500 mb-3">Any specific ask? (e.g. &quot;Ask if they have 15 mins next Tuesday&quot;).</p>
              <textarea value={goal} onChange={e => setGoal(e.target.value)} className="w-full min-h-[80px] bg-surface-900 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:border-brand-500/50 outline-none transition-colors resize-none" placeholder="Specific goal..."></textarea>
            </div>
            
            {error && <p className="text-red-400 text-sm px-2">{error}</p>}
            <button onClick={handleGenerate} disabled={loading} className="btn-primary w-full justify-center py-4 text-base">
              {loading ? "Drafting Email..." : "Generate Templates"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <button onClick={() => setResult(null)} className="btn-secondary mb-4">← Create Another</button>
          
          <div className="card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-200">Subject Line</h3>
              <button onClick={() => copyText(result.subject, "subject")} className="text-slate-400 hover:text-white">
                {copied["subject"] ? <Check size={16} className="text-emerald-400"/> : <Copy size={16}/>}
              </button>
            </div>
            <div className="p-3 bg-surface-900 border border-white/5 rounded-lg text-sm text-slate-300 font-medium">
              {result.subject}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-200">Email Body</h3>
                <button onClick={() => copyText(result.body, "body")} className="text-slate-400 hover:text-white">
                  {copied["body"] ? <Check size={16} className="text-emerald-400"/> : <Copy size={16}/>}
                </button>
              </div>
              <div className="p-4 bg-surface-900 border border-white/5 rounded-xl text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {result.body}
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-200">LinkedIn DM Version</h3>
                <button onClick={() => copyText(result.linkedin_version, "linkedin")} className="text-slate-400 hover:text-white">
                  {copied["linkedin"] ? <Check size={16} className="text-emerald-400"/> : <Copy size={16}/>}
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-3">Under 300 characters for LinkedIn connection requests.</p>
              <div className="p-4 bg-surface-900 border border-white/5 rounded-xl text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {result.linkedin_version}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
