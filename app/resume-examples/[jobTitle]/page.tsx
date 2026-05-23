import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { SEO_DATA, getJobTitleSEO } from "@/lib/seo-data";

type Props = {
  params: { jobTitle: string };
};

export async function generateStaticParams() {
  return SEO_DATA.map((job) => ({
    jobTitle: job.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = getJobTitleSEO(params.jobTitle);
  if (!job) return {};

  return {
    title: job.title,
    description: job.description,
    keywords: job.keywords,
    openGraph: {
      title: job.title,
      description: job.description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: job.title,
      description: job.description,
    },
  };
}

export default function ResumeExamplePage({ params }: Props) {
  const job = getJobTitleSEO(params.jobTitle);

  if (!job) {
    notFound();
  }

  // Generate structured data for Google (JobPosting or Article)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: job.h1,
    description: job.description,
    author: {
      "@type": "Organization",
      name: "SmartResume AI",
      url: "https://smartresume.co.in"
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-900">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="flex-1 pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Context and CTAs */}
          <div className="space-y-8 sticky top-32">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-sm font-bold tracking-wider mb-4">
                {job.level} • Score: {job.score}/100
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                {job.h1}
              </h1>
              <p className="mt-4 text-xl text-slate-400">
                {job.description}
              </p>
            </div>

            <div className="card p-6 border border-white/5 bg-white/[0.02]">
              <h3 className="font-bold text-white mb-4">Why this resume works:</h3>
              <ul className="space-y-4">
                {job.whyItWorks.map((point, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-300">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 pt-4">
              <Link href="/register" className="btn-primary w-full justify-center py-4 text-lg">
                Build a resume like this <ArrowRight size={20} />
              </Link>
              <p className="text-center text-sm text-slate-500">
                Free to try. No credit card required.
              </p>
            </div>
          </div>

          {/* Right Column: Visual Mock Resume */}
          <div className="bg-white rounded-xl shadow-2xl p-8 md:p-12 text-slate-900 font-sans transform md:rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="border-b border-slate-300 pb-4 mb-4 text-center">
              <h2 className="text-3xl font-bold uppercase tracking-tight text-slate-900 mb-1">{job.dummyData.name}</h2>
              <p className="text-sm text-slate-600">{job.dummyData.contact}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase text-brand-600 border-b border-brand-200 pb-1 mb-2">Professional Summary</h3>
              <p className="text-sm leading-relaxed text-slate-700">{job.dummyData.summary}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase text-brand-600 border-b border-brand-200 pb-1 mb-2">Experience</h3>
              {job.dummyData.experience.map((exp, i) => (
                <div key={i} className="mb-4">
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{exp.title}</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {exp.bullets.map((bullet, j) => (
                      <li key={j} className="text-sm text-slate-700 leading-relaxed">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase text-brand-600 border-b border-brand-200 pb-1 mb-2">Skills</h3>
              <p className="text-sm text-slate-700">{job.dummyData.skills}</p>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase text-brand-600 border-b border-brand-200 pb-1 mb-2">Education</h3>
              <p className="text-sm text-slate-700">{job.dummyData.education}</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
