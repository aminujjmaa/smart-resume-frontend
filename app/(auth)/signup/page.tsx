"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Zap, ArrowRight, AlertCircle, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const requirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Contains a number", test: (p: string) => /\d/.test(p) },
  { label: "Contains a letter", test: (p: string) => /[a-zA-Z]/.test(p) },
];

function SignupContent() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordValid = requirements.every((req) => req.test(password));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordValid) {
      setError("Please meet all password requirements before signing up.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register(email, password, name);
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { detail?: string } } };
      setError(apiErr?.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-10 font-display font-bold text-xl">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="gradient-text">SmartResume</span>
          <span className="text-white">AI</span>
        </Link>

        <div className="card">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-white mb-1">Create your account</h1>
            <p className="text-slate-400 text-sm">Start optimizing your resume for free</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 animate-fade-in">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="signup-name">
                Full name
              </label>
              <input
                id="signup-name"
                type="text"
                className="input"
                placeholder="Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="signup-email">
                Email address
              </label>
              <input
                id="signup-email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="signup-password">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPass ? "text" : "password"}
                  className="input pr-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password strength */}
              {password.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {requirements.map((req) => {
                    const met = req.test(password);
                    return (
                      <div key={req.label} className={`flex items-center gap-2 text-xs transition-colors ${met ? "text-accent-green" : "text-slate-500"}`}>
                        <Check size={12} className={met ? "opacity-100" : "opacity-30"} />
                        {req.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              id="signup-submit"
              type="submit"
              disabled={loading || !passwordValid}
              className="btn-primary w-full justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <>Create Free Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-4">
            By signing up you agree to our{" "}
            <a href="#" className="text-brand-400">Terms</a> and{" "}
            <a href="#" className="text-brand-400">Privacy Policy</a>
          </p>

          <p className="text-center text-sm text-slate-400 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function SignupFallback() {
  return (
    <div className="min-h-screen hero-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupFallback />}>
      <SignupContent />
    </Suspense>
  );
}
