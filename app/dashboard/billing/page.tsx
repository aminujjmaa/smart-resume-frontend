"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Check, CreditCard, Loader2, Zap } from "lucide-react";
import RazorpayCheckoutButton from "@/components/billing/RazorpayCheckoutButton";
import { authApi, razorpayApi } from "@/lib/api";
import { formatPaise, PLANS, PRICING_FINE_PRINT, PRO_PERIOD, PRO_PRICE } from "@/lib/pricing";
import { useAuthStore } from "@/store/useAppStore";
import type { SubscriptionSummary } from "@/types";

function formatDate(value?: string | null): string {
  return value ? format(new Date(value), "d MMM yyyy") : "—";
}

function planHeadline(sub: SubscriptionSummary): string {
  if (!sub.is_premium) return "Free";
  if (sub.subscription_status === "legacy") return "Pro (lifetime)";
  return "Pro";
}

function planDetail(sub: SubscriptionSummary): string {
  if (sub.subscription_status === "legacy") {
    return "You bought lifetime Pro before subscriptions existed — it never expires.";
  }
  if (!sub.is_premium) {
    return `You're on the free plan. Pro adds AI suggestions, rewrites and tools for ${PRO_PRICE}/${PRO_PERIOD}.`;
  }
  if (sub.cancel_at_period_end) {
    return `Auto-renewal is off. Pro stays active until ${formatDate(sub.plan_expires_at)}.`;
  }
  if (sub.subscription_status === "pending") {
    return "Your last renewal payment failed and Razorpay is retrying. Update your payment method from the Razorpay email to keep Pro.";
  }
  return `Renews automatically for ${formatPaise(sub.price_paise)} on ${formatDate(sub.current_period_end)}.`;
}

export default function BillingPage() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();
  const [message, setMessage] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const { data: sub, isLoading } = useQuery<SubscriptionSummary>({
    queryKey: ["subscription"],
    queryFn: () => razorpayApi.getSubscription().then((r) => r.data),
  });

  const refresh = async (summary?: SubscriptionSummary) => {
    if (summary) queryClient.setQueryData(["subscription"], summary);
    await queryClient.invalidateQueries({ queryKey: ["subscription"] });
    const me = await authApi.me();
    updateUser(me.data);
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await razorpayApi.cancelSubscription();
      await refresh(res.data);
      setMessage("Auto-renewal cancelled. You keep Pro until the end of the current period.");
    } catch {
      setMessage("Couldn't cancel right now. Please try again or contact support.");
    } finally {
      setCancelling(false);
      setConfirmCancel(false);
    }
  };

  if (isLoading || !sub) {
    return (
      <div className="p-8 flex items-center gap-3 text-slate-400">
        <Loader2 className="animate-spin" size={18} /> Loading billing…
      </div>
    );
  }

  const pro = PLANS.find((p) => p.id === "pro");
  const canCancel =
    sub.is_premium && !sub.cancel_at_period_end && sub.subscription_status !== "legacy" &&
    ["active", "authenticated", "resumed", "pending"].includes(sub.subscription_status ?? "");

  return (
    <div className="p-8 max-w-4xl animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2">Billing & Plan</h1>
        <p className="text-slate-400">Your plan, renewal date and payment history.</p>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-md bg-brand-500/10 border border-brand-500/20 text-brand-300">{message}</div>
      )}

      <div className="card mb-8 p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-display text-xl font-bold text-white">Current plan: {planHeadline(sub)}</h2>
              {sub.is_premium && (
                <span className="badge badge-matched flex items-center gap-1">
                  <Zap size={12} /> Active
                </span>
              )}
            </div>
            <p className="text-slate-400 text-sm max-w-xl">{planDetail(sub)}</p>
          </div>

          {!sub.is_premium && (
            <div className="shrink-0 w-full md:w-64">
              <RazorpayCheckoutButton
                id="billing-upgrade-plan-btn"
                label={`Get Pro — ${PRO_PRICE}/${PRO_PERIOD}`}
                onSuccess={async (summary) => {
                  await refresh(summary);
                  setMessage("Payment confirmed — welcome to Pro! All Pro tools are unlocked.");
                }}
              />
            </div>
          )}

          {canCancel && !confirmCancel && (
            <button type="button" className="btn-secondary shrink-0" onClick={() => setConfirmCancel(true)}>
              Cancel auto-renewal
            </button>
          )}
          {canCancel && confirmCancel && (
            <div className="shrink-0 flex flex-col gap-2 md:items-end">
              <p className="text-sm text-slate-300">Stop renewing? You keep Pro until {formatDate(sub.current_period_end)}.</p>
              <div className="flex gap-2">
                <button type="button" className="btn-secondary" onClick={() => setConfirmCancel(false)}>
                  Keep Pro
                </button>
                <button type="button" className="btn-primary" onClick={handleCancel} disabled={cancelling}>
                  {cancelling ? "Cancelling…" : "Yes, cancel"}
                </button>
              </div>
            </div>
          )}
        </div>

        {!sub.is_premium && pro && (
          <ul className="mt-8 pt-8 border-t border-white/10 grid gap-3 sm:grid-cols-2">
            {pro.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                <Check size={16} className="text-accent-green mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-6 text-xs text-slate-500">{PRICING_FINE_PRINT}</p>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">Payment history</h3>
          <CreditCard size={20} className="text-slate-400" />
        </div>
        {sub.payments.length === 0 ? (
          <p className="p-6 text-sm text-slate-400">No payments yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 pl-6">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sub.payments.map((p) => (
                <tr key={p.razorpay_payment_id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 pl-6 text-sm text-slate-300">{formatDate(p.paid_at ?? p.created_at)}</td>
                  <td className="p-4 text-sm text-slate-300">{formatPaise(p.amount)}</td>
                  <td className="p-4 text-sm text-slate-400 uppercase">{p.method ?? "—"}</td>
                  <td className="p-4 pr-6">
                    <span className={`badge text-xs ${p.status === "failed" ? "badge-missing" : "badge-matched"}`}>
                      {p.status === "captured" ? "Paid" : p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
