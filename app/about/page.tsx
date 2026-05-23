import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "About Us | SmartResume AI",
  description: "Learn about SmartResume AI, our mission to democratize the job hunt, and how our advanced ATS resume scanner helps candidates land more interviews.",
  keywords: ["about smartresume ai", "ats scanner mission", "resume builder company"],
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Leveling the Playing Field in Hiring
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              SmartResume AI was built to give every job seeker access to the same advanced algorithms that recruiters use to filter them out.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-6 pb-24 relative z-10">
          <div className="max-w-3xl mx-auto space-y-12">
            
            <div className="prose prose-invert prose-lg">
              <h2 className="text-2xl font-bold text-white mb-4">The Problem</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                Did you know that over 75% of resumes are rejected by an Applicant Tracking System (ATS) before a human ever reads them? Hiring managers rely on these automated systems to filter out candidates who don't perfectly match their exact keyword criteria.
              </p>
              <p className="text-slate-300 leading-relaxed mb-6">
                This means incredibly talented people are missing out on life-changing opportunities simply because their resume wasn't formatted correctly, or because they used a synonym instead of the exact keyword the ATS was looking for.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4 mt-12">Our Mission</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                At SmartResume AI, we believe that your career shouldn't be blocked by a robot. We built a reverse-engineered ATS scanner that analyzes your resume exactly how the corporate filters do.
              </p>
              
              <div className="bg-surface-900 border border-white/10 rounded-xl p-8 my-8">
                <h3 className="text-xl font-bold text-white mb-4">How we help you win:</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={20} />
                    <span><strong>ATS Scoring:</strong> We tell you exactly how well your resume parses and scores against your target job.</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={20} />
                    <span><strong>Keyword Gaps:</strong> We highlight the exact missing keywords you need to add to pass the automated filters.</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={20} />
                    <span><strong>AI Rewrites:</strong> Our proprietary AI automatically rewrites your weak bullet points using the STAR method and strong action verbs.</span>
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-white mb-4">Who We Are</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                SmartResume AI is a team of former recruiters, engineers, and data scientists who understand the hiring pipeline inside and out. We've seen firsthand how broken the modern application process is, and we're building the tools to fix it for candidates worldwide.
              </p>
            </div>

            {/* CTA Banner */}
            <div className="mt-16 p-8 md:p-12 rounded-2xl border border-brand-500/20 bg-brand-500/10 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Stop guessing. Start landing interviews.</h3>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                Upload your resume right now and let our AI scanner show you exactly what you've been missing.
              </p>
              <Link href="/register" className="btn-primary inline-flex px-8 py-4 text-base">
                Get Your Free ATS Score <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
