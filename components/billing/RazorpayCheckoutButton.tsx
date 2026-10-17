/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import { Loader2, Zap } from "lucide-react";
import { razorpayApi, authApi } from "@/lib/api";
import { useAuthStore } from "@/store/useAppStore";
import { PRO_PERIOD, PRO_PRICE } from "@/lib/pricing";
import type { SubscriptionSummary } from "@/types";

// Razorpay global type declaration
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutButtonProps {
  /** Label shown on the button. Default: "Upgrade to Pro" */
  label?: string;
  className?: string;
  id?: string;
  onSuccess?: (summary: SubscriptionSummary) => void;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function apiErrorDetail(err: any, fallback: string): string {
  const detail = err?.response?.data?.detail;
  return typeof detail === "string" ? detail : fallback;
}

/** Starts the ₹99/month Pro subscription in Razorpay Checkout and verifies it server-side. */
export default function RazorpayCheckoutButton({
  label = "Upgrade to Pro",
  className = "",
  id,
  onSuccess,
}: RazorpayCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { user, updateUser } = useAuthStore();

  const handlePayment = useCallback(async () => {
    setErrorMsg("");
    setIsLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setErrorMsg("Failed to load payment gateway. Please check your internet connection.");
        setIsLoading(false);
        return;
      }

      // 1. Create (or reuse) the subscription on our backend — the price comes from the plan.
      const subRes = await razorpayApi.createSubscription();
      const { subscription_id, key_id } = subRes.data as { subscription_id: string; key_id: string };

      // 2. Razorpay Checkout collects the first payment and sets up auto-renewal.
      const options = {
        key: key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        subscription_id,
        name: "SmartResume AI",
        description: `Pro – ${PRO_PRICE}/${PRO_PERIOD}, renews monthly`,
        prefill: {
          name: user?.full_name || "",
          email: user?.email || "",
        },
        theme: { color: "#4C6EF5" },
        modal: {
          ondismiss: () => setIsLoading(false),
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_subscription_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 3. Verify the signature server-side; this grants Pro immediately.
            const verified = await razorpayApi.verifySubscription(response);
            const me = await authApi.me();
            updateUser(me.data);
            onSuccess?.(verified.data as SubscriptionSummary);
          } catch (err: any) {
            setErrorMsg(
              apiErrorDetail(
                err,
                `We received your payment but couldn't confirm it yet. It usually updates within a minute — refresh this page. Payment ID: ${response.razorpay_payment_id}`
              )
            );
          } finally {
            setIsLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        setErrorMsg(`Payment failed: ${response.error?.description || "Unknown error"}. Please try again.`);
        setIsLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      setErrorMsg(apiErrorDetail(err, "Could not start checkout. Please try again."));
      setIsLoading(false);
    }
  }, [user, onSuccess, updateUser]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <button
        id={id ?? "razorpay-checkout-btn"}
        type="button"
        className={`btn-primary w-full justify-center ${className}`}
        onClick={handlePayment}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Zap size={16} className="mr-2" />
            {label}
          </>
        )}
      </button>
      {errorMsg && <p className="text-red-400 text-sm text-center px-2">{errorMsg}</p>}
    </div>
  );
}
