"use client";

import Link from "next/link";
import { Check, Shield, Zap } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "For one-off checks and first-time resume scans.",
    features: [
      "Basic ATS score",
      "Keyword match report",
      "Resume text and file upload",
      "Starter improvement suggestions",
    ],
    cta: "Scan free",
    href: "/dashboard/upload",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For active job seekers tailoring resumes every week.",
    features: [
      "Unlimited analyses",
      "Advanced category scoring",
      "Full bullet rewrite workflow",
      "History and comparison tools",
      "Download-ready optimization",
      "Priority processing",
    ],
    cta: "Start Pro",
    href: "/signup?plan=pro",
    highlighted: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section bg-[#070b12]">
      <div className="container-lg mx-auto">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="badge badge-info mb-4">Simple pricing</span>
          <h2 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">
            Start with a scan. Upgrade when you are applying at volume.
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-400">
            Use the free scanner to find the biggest gaps, then unlock the full workflow when you are tailoring multiple applications.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-lg border p-6 ${
                plan.highlighted
                  ? "border-teal-300/30 bg-teal-300/[0.06] shadow-2xl shadow-teal-950/20"
                  : "border-white/10 bg-white/[0.035]"
              }`}
            >
              {plan.highlighted && (
                <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-xs font-bold text-teal-100">
                  <Zap size={13} />
                  Most useful for active search
                </div>
              )}

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-white">{plan.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{plan.description}</p>
                </div>
                {!plan.highlighted && <Shield size={22} className="text-slate-500" />}
              </div>

              <div className="mt-8 flex items-end gap-1">
                <span className="font-display text-5xl font-bold text-white">{plan.price}</span>
                <span className="pb-2 text-slate-400">{plan.period}</span>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check size={16} className="mt-0.5 shrink-0 text-emerald-300" />
                    <span className="text-slate-200">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                id={`pricing-cta-${plan.name.toLowerCase()}`}
                className={`mt-8 w-full justify-center ${plan.highlighted ? "btn-primary" : "btn-secondary"}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          No credit card needed for the free scan. Cancel Pro anytime.
        </p>
      </div>
    </section>
  );
}
