/* eslint-disable */
"use client";

import { useState, useCallback } from "react";
import { Loader2, Zap } from "lucide-react";
import { razorpayApi, authApi } from "@/lib/api";
import { useAuthStore } from "@/store/useAppStore";

// Razorpay global type declaration
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutButtonProps {
  /** Amount in paise. Default: 99900 (₹999) */
  amount?: number;
  currency?: string;
  /** Label shown on the button. Default: "Upgrade to Pro" */
  label?: string;
  className?: string;
  id?: string;
  onSuccess?: () => void;
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

export default function RazorpayCheckoutButton({
  amount = 99900,  // Default: ₹999 in paise
  currency = "INR",
  label = "Upgrade to Pro",
  className = "",
  onSuccess,
}: RazorpayCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { user, updateUser } = useAuthStore();

  const handlePayment = useCallback(async () => {
    setErrorMsg("");
    setIsLoading(true);

    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setErrorMsg("Failed to load payment gateway. Please check your internet connection.");
        return;
      }

      // 2. Create order on backend
      const orderRes = await razorpayApi.createOrder(amount, currency);
      const { order_id, amount: orderAmount, currency: orderCurrency } = orderRes.data;

      // 3. Open Razorpay modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
        amount: orderAmount,
        currency: orderCurrency,
        name: "SmartResume AI",
        description: "Pro Plan – Unlimited AI Resume Features",
        order_id,
        prefill: {
          name: user?.full_name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#4C6EF5",
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 4. Verify payment signature on backend
            await razorpayApi.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            // 5. Refresh user data to reflect new plan
            const me = await authApi.me();
            updateUser(me.data);

            onSuccess?.();
          } catch (err: any) {
            setErrorMsg(
              err?.response?.data?.detail ||
                "Payment verification failed. Please contact support with your payment ID: " +
                  response.razorpay_payment_id
            );
          } finally {
            setIsLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response: any) => {
        setErrorMsg(
          `Payment failed: ${response.error.description || "Unknown error"}. Please try again.`
        );
        setIsLoading(false);
      });

      rzp.open();
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.detail || "Could not initiate payment. Please try again."
      );
      setIsLoading(false);
    }
  }, [amount, currency, user, onSuccess, updateUser]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <button
        id="razorpay-checkout-btn"
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
      {errorMsg && (
        <p className="text-red-400 text-sm text-center px-2">{errorMsg}</p>
      )}
    </div>
  );
}
