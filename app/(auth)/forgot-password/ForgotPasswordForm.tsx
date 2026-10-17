"use client";
import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, MailCheck } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { authApi } from "@/lib/api";
import { useFeatures } from "@/hooks/useFeatures";

export default function ForgotPasswordForm() {
  const features = useFeatures();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err: unknown) {
      const apiErr = err as { response?: { status?: number; data?: { detail?: string } } };
      setError(apiErr.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (features && !features.email) {
    return (
      <AuthShell>
        <h1 className="font-display text-2xl font-bold text-white mb-2">Password reset unavailable</h1>
        <p className="text-slate-400 text-sm mb-6">
          Email reset isn&apos;t set up yet. If you signed up with Google, use &ldquo;Continue with Google&rdquo; on the sign-in page.
        </p>
        <Link href="/login" className="btn-primary w-full justify-center py-3">Back to sign in</Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      {sent ? (
        <div className="text-center">
          <MailCheck size={36} className="mx-auto mb-4 text-emerald-400" />
          <h1 className="font-display text-2xl font-bold text-white mb-2">Check your inbox</h1>
          <p className="text-slate-400 text-sm">
            If an account exists for <span className="text-slate-200">{email}</span>, we&apos;ve sent a link to reset
            your password. It expires in 30 minutes.
          </p>
        </div>
      ) : (
        <>
          <h1 className="font-display text-2xl font-bold text-white mb-1">Forgot your password?</h1>
          <p className="text-slate-400 text-sm mb-6">Enter your email and we&apos;ll send you a reset link.</p>
          {error && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="forgot-email">
                Email address
              </label>
              <input
                id="forgot-email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 disabled:opacity-60">
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        </>
      )}
      <Link href="/login" className="mt-6 flex items-center justify-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
        <ArrowLeft size={14} /> Back to sign in
      </Link>
    </AuthShell>
  );
}
