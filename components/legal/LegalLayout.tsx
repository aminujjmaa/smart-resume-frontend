import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { SITE } from "@/lib/site";

interface LegalLayoutProps {
  readonly title: string;
  readonly intro?: string;
  readonly children: React.ReactNode;
}

/** Shared shell for policy pages: readable column, consistent heading and list styles. */
export default function LegalLayout({ title, intro, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <Navbar />
      <main className="flex-1 px-6 pt-32 pb-24">
        <article className="mx-auto max-w-3xl text-slate-300 leading-7 [&_a]:text-brand-400 [&_a:hover]:underline [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_li]:mb-1.5 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6">
          <h1 className="font-display text-4xl font-bold text-white mb-3">{title}</h1>
          <p className="text-sm text-slate-500 mb-8">Last updated: {SITE.policiesUpdated}</p>
          {intro && <p className="text-lg text-slate-300">{intro}</p>}
          {children}
        </article>
      </main>
      <Footer />
    </div>
  );
}
