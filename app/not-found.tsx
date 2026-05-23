import Link from "next/link";
import { Search, Home, ArrowRight } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center mb-8 animate-pulse">
          <Search size={40} className="text-brand-400" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-4 tracking-tight">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-200 mb-6">
          Page not found
        </h2>
        
        <p className="text-slate-400 max-w-md mx-auto mb-10 text-lg leading-relaxed">
          It looks like the link you followed is broken, or the page has been moved. Don't worry, your resume is safe!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/" className="btn-secondary px-8 py-4 text-base">
            <Home size={18} className="mr-2" />
            Back to Home
          </Link>
          <Link href="/dashboard/upload" className="btn-primary px-8 py-4 text-base shadow-glow">
            Scan Your Resume
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
