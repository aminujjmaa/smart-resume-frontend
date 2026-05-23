/* eslint-disable */
"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAppStore";
import { Check, Zap, CreditCard, Clock, Loader2 } from "lucide-react";
import { authApi, billingApi } from "@/lib/api";

export default function BillingPage() {
  const { user, updateUser } = useAuthStore();
  const isPremium = user?.plan === "premium";
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("success") === "true") {
        const verifyCheckout = async () => {
          setSuccessMsg("Payment received. Verifying your account status...");
          const sessionId = urlParams.get("session_id");
          const isMockCheckout = urlParams.get("mock") === "true";

          if (sessionId) {
            await billingApi.getCheckoutSessionStatus(sessionId);
          } else if (isMockCheckout) {
            await billingApi.getCheckoutSessionStatus("mock");
          }

          const me = await authApi.me();
          updateUser(me.data);
          setSuccessMsg(
            me.data?.plan === "premium"
              ? "Payment successful! Your account has been upgraded to Pro."
              : "Payment is still processing. Please refresh in a moment."
          );
        };

        verifyCheckout().catch(() => {
          setSuccessMsg("We could not verify the payment yet. Please refresh in a moment.");
        });
      } else if (urlParams.get("canceled") === "true") {
        setSuccessMsg("Checkout canceled.");
      }
    }
  }, [updateUser]);

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      const res = await billingApi.createCheckoutSession();
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error("Failed to create checkout session", error);
      alert("Failed to initiate checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2">Billing & Plan</h1>
        <p className="text-slate-400">Manage your subscription and payment methods</p>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-md bg-brand-500/10 border border-brand-500/20 text-brand-400">
          {successMsg}
        </div>
      )}

      {/* Current Plan Card */}
      <div className="card mb-8 p-8 relative overflow-hidden">
        {isPremium && (
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        )}

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-display text-xl font-bold text-white">
                Current Plan: {isPremium ? "Pro" : "Free"}
              </h2>
              {isPremium && (
                <span className="badge badge-matched flex items-center gap-1">
                  <Zap size={12} /> Active
                </span>
              )}
            </div>
            <p className="text-slate-400 text-sm">
              {isPremium
                ? "You have full access to all features. Your next billing date is Dec 12, 2024."
                : "You are on the free plan with limited analyses. Upgrade to unlock all features."}
            </p>
          </div>

          <button
            type="button"
            className={`btn-${isPremium ? "secondary" : "primary"} shrink-0`}
            disabled={isLoading}
            onClick={isPremium ? undefined : handleUpgrade}
          >
            {isPremium ? "Manage Subscription" : "Upgrade to Pro"}
          </button>
        </div>

        {/* Usage Stats (Demo) */}
        {!isPremium && (
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Monthly Usage</span>
              <span className="text-sm font-medium text-slate-300">2 / 3 Analyses</span>
            </div>
            <div className="w-full bg-surface-800 rounded-full h-2 mb-2">
              <div className="h-2 rounded-full bg-brand-500" style={{ width: "66%" }} />
            </div>
            <p className="text-xs text-slate-500">Resets on Nov 1, 2024</p>
          </div>
        )}
      </div>

      {/* Upgrade Options (if free) */}
      {!isPremium && (
        <div className="mb-8">
          <h3 className="font-display text-lg font-bold text-white mb-4">Available Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pro Plan */}
            <div className="card relative overflow-hidden" style={{ border: "1px solid rgba(76,110,245,0.4)" }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full translate-x-8 -translate-y-8" />
              <div className="mb-4">
                <span className="badge bg-brand-500/20 text-brand-400 mb-3 border border-brand-500/30">Most Popular</span>
                <h4 className="font-display text-xl font-bold text-white">Pro</h4>
                <div className="flex items-end gap-1 mt-2">
                  <span className="font-display text-4xl font-bold text-white">$19</span>
                  <span className="text-slate-400 pb-1">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "Unlimited resume analyses",
                  "Advanced ATS scoring",
                  "Unlimited AI bullet rewrites",
                  "PDF & DOCX upload",
                  "History tracking & comparison",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                    <Check size={16} className="text-accent-green mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button 
                id="billing-upgrade-btn" 
                className="btn-primary w-full justify-center"
                onClick={handleUpgrade}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Upgrade Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoices */}
      {isPremium && (
        <div className="card p-0 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-white">Billing History</h3>
            <CreditCard size={20} className="text-slate-400" />
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 pl-6">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { date: "Oct 12, 2024", amount: "$19.00", status: "Paid" },
                { date: "Sep 12, 2024", amount: "$19.00", status: "Paid" },
              ].map((inv, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 pl-6 text-sm text-slate-300">{inv.date}</td>
                  <td className="p-4 text-sm text-slate-300">{inv.amount}</td>
                  <td className="p-4">
                    <span className="badge badge-matched text-xs">{inv.status}</span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <a href="#" className="text-brand-400 text-sm hover:underline">Download</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
