import Link from "next/link";
import { Zap } from "lucide-react";

/** Centered logo + card layout shared by the auth pages. */
export default function AuthShell({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-6">
      <div className="w-full max-w-md animate-fade-in">
        <Link href="/" className="flex items-center justify-center gap-2 mb-10 font-display font-bold text-xl">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="gradient-text">SmartResume</span>
          <span className="text-white">AI</span>
        </Link>
        <div className="card">{children}</div>
      </div>
    </div>
  );
}
