"use client";

import Link from "next/link";
import { Search, Zap } from "lucide-react";

const productLinks = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Resume examples", href: "/resume-examples" },
];

const scanLinks = [
  { label: "Software Engineer scanner", href: "/ats-score/software-engineer" },
  { label: "Product Manager scanner", href: "/ats-score/product-manager" },
  { label: "Data Analyst scanner", href: "/ats-score/data-analyst" },
  { label: "Business Analyst scanner", href: "/ats-score/business-analyst" },
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
              ATS resume scanning, keyword gap analysis, formatting checks, and AI bullet rewrites for job seekers who want a sharper application.
            </p>
            <Link href="/dashboard/upload" className="btn-secondary mt-6 px-4 py-2 text-sm">
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
            <h4 className="mb-4 text-sm font-semibold text-white">Popular scans</h4>
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
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><a href="#" className="hover:text-white">Privacy</a></li>
              <li><a href="#" className="hover:text-white">Terms</a></li>
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
