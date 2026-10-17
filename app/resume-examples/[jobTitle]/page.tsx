import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ROLES, getRole, relatedRoles } from "@/lib/seo-data";
import { SITE } from "@/lib/site";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";

type Props = { params: { jobTitle: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return ROLES.map((role) => ({ jobTitle: role.slug }));
}

function titleFor(role: string) {
  return `${role} Resume Example (ATS-Friendly, India)`;
}

function descriptionFor(role: string, level: string) {
  return `An ATS-friendly ${role} resume example for ${level.toLowerCase()} candidates in India, with the bullet style, keywords and layout recruiters shortlist.`;
}

export function generateMetadata({ params }: Props): Metadata {
  const role = getRole(params.jobTitle);
  if (!role) return {};
  const title = titleFor(role.role);
  const description = descriptionFor(role.role, role.level);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/resume-examples/${role.slug}` },
    openGraph: { title, description, type: "article", url: `/resume-examples/${role.slug}` },
  };
}

export default function ResumeExamplePage({ params }: Props) {
  const role = getRole(params.jobTitle);
  if (!role) notFound();

  const path = `/resume-examples/${role.slug}`;
  const example = role.example;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: titleFor(role.role),
    description: descriptionFor(role.role, role.level),
    dateModified: role.updatedAt,
    mainEntityOfPage: `${SITE.url}${path}`,
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-900">
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Resume examples", path: "/resume-examples" }, { name: role.role, path }])} />
      <Navbar />

      <main className="flex-1 pt-28 pb-24 px-6">
        <nav aria-label="Breadcrumb" className="mx-auto mb-8 flex max-w-5xl items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300">Home</Link>
          <ChevronRight size={12} />
          <Link href="/resume-examples" className="hover:text-slate-300">Resume examples</Link>
          <ChevronRight size={12} />
          <span className="text-slate-300">{role.role}</span>
        </nav>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8 md:sticky md:top-28">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-sm font-bold tracking-wider mb-4">
                {role.category} · {role.level}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">{role.role} Resume Example</h1>
              <p className="mt-4 text-lg text-slate-400">{role.intro}</p>
            </div>

            <div className="card p-6 border border-white/5 bg-white/[0.02]">
              <h2 className="font-bold text-white mb-4">Why this resume works</h2>
              <ul className="space-y-4">
                {role.whyItWorks.map((point) => (
                  <li key={point} className="flex gap-3 text-slate-300">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <Link href={`/ats-score/${role.slug}`} className="btn-primary w-full justify-center py-4 text-lg">
                Check my {role.role} resume <ArrowRight size={20} />
              </Link>
              <p className="text-center text-sm text-slate-500">Free ATS score and missing keywords — no sign-up needed.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-2xl p-8 md:p-12 text-slate-900 font-sans">
            <div className="border-b border-slate-300 pb-4 mb-4 text-center">
              <h2 className="text-3xl font-bold uppercase tracking-tight text-slate-900 mb-1">{example.name}</h2>
              <p className="text-sm text-slate-600">{example.contact}</p>
            </div>
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase text-brand-600 border-b border-brand-200 pb-1 mb-2">Professional Summary</h3>
              <p className="text-sm leading-relaxed text-slate-700">{example.summary}</p>
            </div>
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase text-brand-600 border-b border-brand-200 pb-1 mb-2">Experience</h3>
              {example.experience.map((exp) => (
                <div key={exp.title} className="mb-4">
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{exp.title}</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {exp.bullets.map((bullet) => (
                      <li key={bullet} className="text-sm text-slate-700 leading-relaxed">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase text-brand-600 border-b border-brand-200 pb-1 mb-2">Skills</h3>
              <p className="text-sm text-slate-700">{example.skills}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase text-brand-600 border-b border-brand-200 pb-1 mb-2">Education</h3>
              <p className="text-sm text-slate-700">{example.education}</p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-24 border-t border-white/10 pt-16">
          <h2 className="text-2xl font-bold text-white mb-8">More resume examples</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedRoles(role).slice(0, 3).map((related) => (
              <Link
                key={related.slug}
                href={`/resume-examples/${related.slug}`}
                className="card p-6 bg-white/[0.02] border border-white/5 hover:border-brand-500/50 hover:bg-white/[0.05] transition-all group"
              >
                <div className="text-brand-400 text-sm font-bold mb-2">{related.category}</div>
                <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">{related.role}</h3>
                <p className="text-slate-400 text-sm mt-2 line-clamp-2">{related.intro}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
