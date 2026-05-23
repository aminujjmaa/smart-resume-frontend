"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, Search, X, Zap } from "lucide-react";
import { useAuthStore } from "@/store/useAppStore";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-white/10 shadow-lg" : "bg-slate-950/40 backdrop-blur-md"
      }`}
    >
      <div className="container-lg mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-teal-500">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-white">SmartResume</span>
          <span className="text-teal-300">AI</span>
        </Link>

        <div className="hidden items-center gap-7 text-sm font-medium text-slate-400 md:flex">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <Link href="/dashboard" className="btn-primary text-sm">Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-sm">Sign in</Link>
              <Link href="/dashboard/upload" className="btn-primary text-sm">
                <Search size={15} />
                Scan Free
              </Link>
            </>
          )}
        </div>

        <button className="text-slate-400 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="glass flex flex-col gap-4 border-t border-white/10 px-6 py-4 md:hidden animate-fade-in">
          <a href="#features" className="text-slate-400 hover:text-white py-2">Features</a>
          <a href="#how-it-works" className="text-slate-400 hover:text-white py-2">How it works</a>
          <a href="#pricing" className="text-slate-400 hover:text-white py-2">Pricing</a>
          <hr className="border-white/10" />
          {isAuthenticated ? (
            <Link href="/dashboard" className="btn-primary text-sm justify-center">Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="text-slate-300 text-center py-2">Sign in</Link>
              <Link href="/dashboard/upload" className="btn-primary text-sm justify-center">Scan Free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
