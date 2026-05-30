"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Rocket, X } from "lucide-react";

const BANNER_KEY = "smartresume_ph_banner_dismissed";

export default function LaunchBanner() {
  // Start hidden to avoid SSR mismatch, then sync with localStorage
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(BANNER_KEY) === "true";
    if (!dismissed) setVisible(true);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(BANNER_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="launch-banner relative z-50 flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-medium text-white">
      <div className="flex items-center gap-2">
        <Rocket
          size={15}
          className="shrink-0 text-orange-300 animate-bounce"
          style={{ animationDuration: "1.8s" }}
        />
        <span className="text-slate-200">
          🎉 We&apos;re live on{" "}
          <span className="font-bold text-orange-300">Product Hunt</span> today!
        </span>
        <a
          href="https://www.producthunt.com/posts/smartresume-ai"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full bg-orange-500/20 border border-orange-400/30 px-3 py-0.5 text-xs font-bold text-orange-200 hover:bg-orange-500/30 transition-all duration-200"
        >
          Support us
          <ArrowRight size={11} />
        </a>
      </div>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss banner"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
      >
        <X size={14} />
      </button>
    </div>
  );
}
