"use client";

import Link from "next/link";
import { Search, Zap } from "lucide-react";

const productLinks = [
  { label: "Free ATS checker", href: "/scan" },
  { label: "How the score works", href: "/how-ats-score-works" },
  { label: "Resume examples", href: "/resume-examples" },
  { label: "Guides", href: "/guides" },
  { label: "Pricing", href: "/pricing" },
];

const scanLinks = [
  { label: "Software Engineer", href: "/ats-score/software-engineer" },
  { label: "Data Analyst", href: "/ats-score/data-analyst" },
  { label: "Business Analyst", href: "/ats-score/business-analyst" },
  { label: "Product Manager", href: "/ats-score/product-manager" },
  { label: "Sales Executive", href: "/ats-score/sales-executive" },
  { label: "Financial Analyst", href: "/ats-score/financial-analyst" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#05070b] px-4 py-14 sm:px-6">
      <div className="container-lg mx-auto">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_0.8fr_0.9fr_0.8fr]">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2 font-display text-xl font-bold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-teal-500">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-white">SmartResume</span>
              <span className="text-teal-300">AI</span>
            </Link>
            <p className="max-w-sm text-sm leading-6 text-slate-400">
              Free ATS resume checks, keyword gap analysis and formatting fixes for job seekers in India — with AI help on Pro.
            </p>
            <Link href="/scan" className="btn-secondary mt-6 px-4 py-2 text-sm">
              <Search size={15} />
              Run free scan
            </Link>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Product</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              {productLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Resume checkers</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              {scanLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              <li><Link href="/refund-policy" className="hover:text-white">Refunds & cancellation</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-white">Shipping & delivery</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-sm text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} SmartResume AI. All rights reserved.</p>
          <p>Built for faster, clearer resume decisions.</p>
        </div>
      </div>
    </footer>
  );
}
