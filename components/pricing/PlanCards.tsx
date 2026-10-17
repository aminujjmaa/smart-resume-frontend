import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { PLANS, PRICING_FINE_PRINT } from "@/lib/pricing";

/** The three plans, rendered from lib/pricing so every page shows the same offer. */
export default function PlanCards() {
  return (
    <>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-lg border p-6 ${
              plan.highlighted
                ? "border-teal-300/30 bg-teal-300/[0.06] shadow-2xl shadow-teal-950/20"
                : "border-white/10 bg-white/[0.035]"
            }`}
          >
            {plan.highlighted && (
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-lg border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-xs font-bold text-teal-100">
                <Zap size={13} />
                For active job search
              </div>
            )}
            <h3 className="font-display text-2xl font-bold text-white">{plan.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{plan.tagline}</p>
            <div className="mt-6 flex items-end gap-1">
              <span className="font-display text-5xl font-bold text-white">{plan.price}</span>
              <span className="pb-2 text-slate-400">{plan.period}</span>
            </div>
            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <Check size={16} className="mt-0.5 shrink-0 text-emerald-300" />
                  <span className="text-slate-200">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href={plan.cta.href}
              id={`pricing-cta-${plan.id}`}
              className={`mt-8 w-full justify-center ${plan.highlighted ? "btn-primary" : "btn-secondary"}`}
            >
              {plan.cta.label}
            </Link>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-slate-500">{PRICING_FINE_PRINT}</p>
    </>
  );
}
