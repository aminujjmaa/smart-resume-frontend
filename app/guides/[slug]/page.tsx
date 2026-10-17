import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { GUIDES, getGuide } from "@/lib/guides";
import { getRole } from "@/lib/seo-data";
import { SITE } from "@/lib/site";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";

type Props = { params: { slug: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const guide = getGuide(params.slug);
  if (!guide) return {};
  return {
    title: { absolute: guide.metaTitle },
    description: guide.metaDescription,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: { title: guide.metaTitle, description: guide.metaDescription, type: "article", url: `/guides/${guide.slug}` },
  };
}

export default function GuidePage({ params }: Props) {
  const guide = getGuide(params.slug);
  if (!guide) notFound();

  const path = `/guides/${guide.slug}`;
  const roles = guide.relatedRoles.map(getRole).filter((r) => r !== undefined);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    dateModified: guide.updatedAt,
    mainEntityOfPage: `${SITE.url}${path}`,
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }, { name: guide.title, path }])} />
      <JsonLd data={faqJsonLd(guide.faqs)} />
      <Navbar />
      <main className="flex-1 px-6 pt-28 pb-24">
        <article className="mx-auto max-w-3xl text-slate-300 leading-8">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-300">Home</Link>
            <ChevronRight size={12} />
            <Link href="/guides" className="hover:text-slate-300">Guides</Link>
          </nav>
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight text-white">{guide.title}</h1>
          <p className="mt-3 text-sm text-slate-500">
            Updated {guide.updatedAt} · {guide.readingMinutes} min read
          </p>
          <p className="mt-8 rounded-lg border border-teal-300/20 bg-teal-300/[0.06] p-5 text-lg text-slate-200">{guide.summary}</p>

          {guide.sections.map((section) => (
            <section key={section.heading} className="mt-12">
              <h2 className="font-display text-2xl font-bold text-white mb-4">{section.heading}</h2>
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="mb-4">{p}</p>
              ))}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="mb-4 list-disc space-y-2 pl-6">
                  {section.bullets.map((b) => (
                    <li key={b.slice(0, 40)}>{b}</li>
                  ))}
                </ul>
              )}
              {section.example && (
                <div className="mb-4 rounded-lg border border-white/10 bg-[#08101c] p-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">{section.example.label}</p>
                  <p className="whitespace-pre-wrap text-sm text-slate-200">{section.example.text}</p>
                </div>
              )}
            </section>
          ))}

          <section className="mt-12">
            <h2 className="font-display text-2xl font-bold text-white mb-4">FAQs</h2>
            <div className="space-y-3">
              {guide.faqs.map((faq) => (
                <details key={faq.q} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <summary className="cursor-pointer font-semibold text-white">{faq.q}</summary>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          <aside className="mt-12 rounded-lg border border-brand-500/30 bg-brand-500/[0.06] p-6">
            <p className="font-display text-lg font-bold text-white">Check your resume against a real job description</p>
            <p className="mt-1 text-sm text-slate-400">Free ATS score, missing keywords and fixes in under a minute.</p>
            <Link href="/scan" className="btn-primary mt-4 px-5 py-2.5">Scan my resume</Link>
            {roles.length > 0 && (
              <p className="mt-5 text-sm text-slate-400">
                Role checkers:{" "}
                {roles.map((r, i) => (
                  <span key={r.slug}>
                    {i > 0 && " · "}
                    <Link href={`/ats-score/${r.slug}`} className="text-teal-300 hover:underline">{r.role}</Link>
                  </span>
                ))}
              </p>
            )}
          </aside>
        </article>
      </main>
      <Footer />
    </div>
  );
}
