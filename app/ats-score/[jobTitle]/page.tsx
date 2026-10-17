import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ChevronRight, FileText, Search, XCircle } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ScanForm from "@/components/scan/ScanForm";
import { ROLES, getRole, relatedRoles, roleRequirementsText } from "@/lib/seo-data";
import { GUIDES } from "@/lib/guides";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";

type Props = { params: { jobTitle: string } };

// Only roles with real content get a page; anything else is a 404, not a thin auto-generated page.
export const dynamicParams = false;

export function generateStaticParams() {
  return ROLES.map((role) => ({ jobTitle: role.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const role = getRole(params.jobTitle);
  if (!role) return {};
  return {
    title: { absolute: role.metaTitle },
    description: role.metaDescription,
    alternates: { canonical: `/ats-score/${role.slug}` },
    openGraph: { title: role.metaTitle, description: role.metaDescription, url: `/ats-score/${role.slug}`, type: "website" },
  };
}

function SkillGroup({ title, skills }: Readonly<{ title: string; skills: string[] }>) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">{title}</h3>
      <ul className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <li key={skill} className="rounded-md border border-teal-300/20 bg-teal-300/10 px-2.5 py-1 text-sm text-teal-100">
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function RoleAtsCheckerPage({ params }: Props) {
  const role = getRole(params.jobTitle);
  if (!role) notFound();

  const related = relatedRoles(role);
  const guides = GUIDES.filter((g) => g.relatedRoles.includes(role.slug)).slice(0, 3);
  const path = `/ats-score/${role.slug}`;

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "ATS checker", path: "/scan" }, { name: role.role, path }])} />
      {role.faqs.length > 0 && <JsonLd data={faqJsonLd(role.faqs)} />}
      <Navbar />

      <main className="flex-1 px-4 py-12">
        <div className="mx-auto w-full max-w-6xl">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-300">Home</Link>
            <ChevronRight size={12} />
            <Link href="/scan" className="hover:text-slate-300">ATS checker</Link>
            <ChevronRight size={12} />
            <span className="text-slate-300">{role.role}</span>
          </nav>

          <header className="mb-8 max-w-3xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-lg border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-xs font-semibold text-teal-200">
              <Search size={14} /> Free {role.role} resume checker · {role.level}
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">
              {role.role} Resume ATS Checker
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-400 md:text-lg">{role.intro}</p>
          </header>

          <ScanForm idPrefix={`ats-${role.slug}`} role={{ name: role.role, requirements: roleRequirementsText(role) }} />

          <section className="mt-20" aria-labelledby="skills-heading">
            <h2 id="skills-heading" className="font-display text-2xl font-bold text-white md:text-3xl">
              Keywords recruiters search for in {role.role} resumes
            </h2>
            <p className="mt-3 max-w-3xl text-slate-400">
              Use the ones you can genuinely back up — in your skills section and inside the bullets that prove them.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <SkillGroup title="Core skills" skills={role.skills.hard} />
              {role.skills.tools.length > 0 && <SkillGroup title="Tools" skills={role.skills.tools} />}
              {role.skills.soft.length > 0 && <SkillGroup title="Soft skills" skills={role.skills.soft} />}
            </div>
          </section>

          {role.jdSnippet && (
          <section className="mt-16" aria-labelledby="jd-heading">
            <h2 id="jd-heading" className="font-display text-2xl font-bold text-white md:text-3xl">
              What a typical {role.role} job description asks for
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
              <pre className="whitespace-pre-wrap rounded-lg border border-white/10 bg-[#08101c] p-5 font-sans text-sm leading-7 text-slate-300">
                {role.jdSnippet}
              </pre>
              <p className="text-sm leading-7 text-slate-400">
                Every company words this differently. For the most accurate score, paste the actual job description you&apos;re
                applying to in the checker above — the report quotes the exact line each missing keyword comes from.
              </p>
            </div>
          </section>
          )}

          {role.weakVsStrong.length > 0 && (
          <section className="mt-16" aria-labelledby="bullets-heading">
            <h2 id="bullets-heading" className="font-display text-2xl font-bold text-white md:text-3xl">
              Weak vs strong {role.role} resume bullets
            </h2>
            <div className="mt-6 space-y-4">
              {role.weakVsStrong.map((pair) => (
                <div key={pair.weak} className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-5 md:grid-cols-2">
                  <p className="flex gap-3 text-sm leading-6 text-slate-300">
                    <XCircle size={18} className="mt-0.5 shrink-0 text-red-400" aria-label="Weak" />
                    {pair.weak}
                  </p>
                  <p className="flex gap-3 text-sm leading-6 text-white">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" aria-label="Strong" />
                    {pair.strong}
                  </p>
                  <p className="text-xs leading-5 text-slate-500 md:col-span-2">{pair.why}</p>
                </div>
              ))}
            </div>
          </section>
          )}

          {role.mistakes.length > 0 && (
          <section className="mt-16" aria-labelledby="mistakes-heading">
            <h2 id="mistakes-heading" className="font-display text-2xl font-bold text-white md:text-3xl">
              Common {role.role} resume mistakes
            </h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {role.mistakes.map((mistake) => (
                <li key={mistake} className="rounded-lg border border-amber-500/15 bg-amber-500/[0.05] p-5 text-sm leading-6 text-slate-300">
                  {mistake}
                </li>
              ))}
            </ul>
          </section>
          )}

          {role.faqs.length > 0 && (
          <section className="mt-16" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="font-display text-2xl font-bold text-white md:text-3xl">
              {role.role} resume FAQs
            </h2>
            <div className="mt-6 space-y-3">
              {role.faqs.map((faq) => (
                <details key={faq.q} className="group rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <summary className="cursor-pointer list-none font-semibold text-white">{faq.q}</summary>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
          )}

          <section className="mt-16 grid gap-6 md:grid-cols-3">
            <Link
              href={`/resume-examples/${role.slug}`}
              className="card group flex flex-col justify-between border border-brand-500/30 bg-brand-500/[0.06] p-6 md:col-span-1"
            >
              <FileText size={22} className="text-brand-300" />
              <div className="mt-4">
                <p className="font-display text-lg font-bold text-white">See a {role.role} resume example</p>
                <p className="mt-1 text-sm text-slate-400">An ATS-friendly layout you can model yours on.</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-brand-300 group-hover:gap-2 transition-all">
                View example <ArrowRight size={14} />
              </span>
            </Link>
            <div className="md:col-span-2">
              <h2 className="mb-4 font-display text-lg font-bold text-white">Related ATS checkers</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <Link key={r.slug} href={`/ats-score/${r.slug}`} className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-200 hover:border-brand-500/40">
                    {r.role} resume checker
                  </Link>
                ))}
              </div>
              {guides.length > 0 && (
                <>
                  <h2 className="mb-4 mt-8 font-display text-lg font-bold text-white">Guides</h2>
                  <ul className="space-y-2 text-sm">
                    {guides.map((g) => (
                      <li key={g.slug}>
                        <Link href={`/guides/${g.slug}`} className="text-teal-300 hover:underline">{g.title}</Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
