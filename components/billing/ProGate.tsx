"use client";
import Link from "next/link";
import { Lock, Check } from "lucide-react";
import { useAuthStore } from "@/store/useAppStore";
import { isPro } from "@/lib/entitlements";
import { PLANS, PRO_PERIOD, PRO_PRICE } from "@/lib/pricing";

/** Renders children for Pro users; everyone else sees what Pro includes and how to get it. */
export default function ProGate({ children }: { readonly children: React.ReactNode }) {
  const { user } = useAuthStore();
  if (isPro(user)) return <>{children}</>;

  const pro = PLANS.find((p) => p.id === "pro");
  return (
    <div className="p-8 max-w-2xl animate-fade-in">
      <div className="card p-8">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
          <Lock size={20} />
        </div>
        <h1 className="font-display text-2xl font-bold text-white mb-2">This is a Pro tool</h1>
        <p className="text-slate-400 mb-6">
          Pro is {PRO_PRICE}/{PRO_PERIOD}, renews monthly and can be cancelled anytime.
        </p>
        <ul className="space-y-2 mb-8">
          {pro?.features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm text-slate-200">
              <Check size={16} className="mt-0.5 shrink-0 text-emerald-300" />
              {f}
            </li>
          ))}
        </ul>
        <Link href="/dashboard/billing" className="btn-primary w-full justify-center">
          Upgrade to Pro
        </Link>
      </div>
    </div>
  );
}
