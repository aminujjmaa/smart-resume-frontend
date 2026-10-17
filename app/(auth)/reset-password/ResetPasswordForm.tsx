"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { authApi } from "@/lib/api";

export default function ResetPasswordForm() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // The token arrives in the URL fragment so it never reaches server logs.
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    setToken(params.get("token"));
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (!token) return;
    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { detail?: string | { msg: string }[] } } };
      const detail = apiErr.response?.data?.detail;
      setError(typeof detail === "string" ? detail : detail?.[0]?.msg || "Could not reset your password.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthShell>
        <div className="text-center">
          <CheckCircle2 size={36} className="mx-auto mb-4 text-emerald-400" />
          <h1 className="font-display text-2xl font-bold text-white mb-2">Password updated</h1>
          <p className="text-slate-400 text-sm mb-6">You can now sign in with your new password.</p>
          <Link href="/login" className="btn-primary w-full justify-center py-3">Sign in</Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <h1 className="font-display text-2xl font-bold text-white mb-1">Choose a new password</h1>
      <p className="text-slate-400 text-sm mb-6">At least 8 characters, with a letter and a number.</p>
      {token === null || error ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20">
          <AlertCircle size={16} className="shrink-0" />
          {error || (
            <span>
              This reset link is missing its token. <Link href="/forgot-password" className="underline">Request a new link</Link>.
            </span>
          )}
        </div>
      ) : null}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="reset-password">
            New password
          </label>
          <input
            id="reset-password"
            type="password"
            className="input"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="reset-confirm">
            Confirm password
          </label>
          <input
            id="reset-confirm"
            type="password"
            className="input"
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <button type="submit" disabled={loading || !token} className="btn-primary w-full justify-center py-3.5 disabled:opacity-60">
          {loading ? "Saving…" : "Update password"}
        </button>
      </form>
    </AuthShell>
  );
}
