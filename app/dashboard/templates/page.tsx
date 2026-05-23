"use client";
import { useState, useEffect } from "react";
import {
  Lock, Star, Zap, Search, FileText, ChevronRight, Eye, Pencil, X,
  CheckCircle2
} from "lucide-react";
import { useAuthStore } from "@/store/useAppStore";
import Link from "next/link";

// ── Template Data ──────────────────────────────────────────────────────────────

interface Template {
  id: string;
  name: string;
  category: string;
  tags: string[];
  isPremium: boolean;
  atsScore: number;
  description: string;
  bestFor: string;
}

const TEMPLATES: Template[] = [
  {
    id: "modern-tech",
    name: "Modern Tech",
    category: "Software Engineering",
    tags: ["Engineering", "SWE", "Backend", "Frontend"],
    isPremium: false,
    atsScore: 98,
    description: "Clean single-column layout optimized for tech roles.",
    bestFor: "Software Engineers, Full-Stack Developers",
  },
  {
    id: "executive-classic",
    name: "Executive Classic",
    category: "Management",
    tags: ["Leadership", "Management", "Director", "VP"],
    isPremium: false,
    atsScore: 96,
    description: "Professional layout with emphasis on leadership impact.",
    bestFor: "Engineering Managers, Directors, VPs, CTOs",
  },
  {
    id: "data-science",
    name: "Data Science Pro",
    category: "Data & ML",
    tags: ["Data Science", "ML", "AI", "Analytics"],
    isPremium: false,
    atsScore: 97,
    description: "Two-column layout with a dedicated Technical Skills matrix.",
    bestFor: "Data Scientists, ML Engineers, AI Researchers",
  },
  {
    id: "startup-minimal",
    name: "Startup Minimal",
    category: "General",
    tags: ["Startup", "Product", "Generalist"],
    isPremium: false,
    atsScore: 95,
    description: "Ultra-clean, impact-first design for fast-paced roles.",
    bestFor: "Product Managers, Startup Founders",
  },
  {
    id: "senior-engineer",
    name: "Senior Engineer",
    category: "Software Engineering",
    tags: ["Senior", "Staff", "Principal", "Architecture"],
    isPremium: true,
    atsScore: 99,
    description: "Highlights Architecture Decisions and Technical Leadership.",
    bestFor: "Senior Engineers, Staff, Principal, Architects",
  },
  {
    id: "product-manager",
    name: "Product Leader",
    category: "Product",
    tags: ["Product", "PM", "Product Management"],
    isPremium: true,
    atsScore: 97,
    description: "Dedicated Metrics Dashboard to showcase product outcomes.",
    bestFor: "Product Managers, Group PMs, CPOs",
  },
  {
    id: "devops-infra",
    name: "DevOps / SRE",
    category: "Infrastructure",
    tags: ["DevOps", "SRE", "Cloud", "Infrastructure"],
    isPremium: true,
    atsScore: 98,
    description: "Infrastructure-first with System Reliability breakdowns.",
    bestFor: "DevOps Engineers, SREs, Platform Engineers",
  },
  {
    id: "career-change",
    name: "Career Pivot",
    category: "Career Change",
    tags: ["Career Change", "Bootcamp", "Transition"],
    isPremium: false,
    atsScore: 93,
    description: "Leads with Skills & Projects to minimise role-change bias.",
    bestFor: "Bootcamp Grads, Career Changers",
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(TEMPLATES.map((t) => t.category)))];

const CATEGORY_COUNTS: Record<string, number> = CATEGORIES.reduce((acc, cat) => {
  acc[cat] = cat === "All" ? TEMPLATES.length : TEMPLATES.filter((t) => t.category === cat).length;
  return acc;
}, {} as Record<string, number>);

// ── Document thumbnail previews ─────────────────────────────────────────────

function PreviewModernTech() {
  return (
    <div className="w-full h-full bg-white p-4 flex flex-col gap-1.5 font-sans">
      <div className="h-3 w-28 bg-slate-900 rounded-sm mb-0.5" />
      <div className="h-1.5 w-36 bg-slate-300 rounded-sm" />
      <div className="mt-2 h-px bg-blue-600 w-full" />
      <div className="h-1.5 w-14 bg-blue-600 rounded-sm mt-1.5" />
      {["s1", "s2", "s3", "s4"].map((k, idx) => (
        <div key={k} className="h-1 rounded-sm bg-slate-200" style={{ width: `${[28, 36, 32, 20][idx] * 3}px` }} />
      ))}
      <div className="h-1.5 w-20 bg-blue-600 rounded-sm mt-2" />
      {["e1", "e2", "e3", "e4"].map((k, idx) => (
        <div key={k} className="h-1 rounded-sm bg-slate-200" style={{ width: `${[36, 28, 34, 30][idx] * 3}px` }} />
      ))}
      <div className="h-1.5 w-16 bg-blue-600 rounded-sm mt-2" />
      <div className="flex gap-1 flex-wrap mt-0.5">
        {["t1", "t2", "t3", "t4"].map(k => <div key={k} className="h-3 w-10 rounded bg-blue-50 border border-blue-100" />)}
      </div>
    </div>
  );
}

function PreviewExecutiveClassic() {
  return (
    <div className="w-full h-full bg-white p-4 flex flex-col gap-1.5">
      <div className="flex flex-col items-center mb-2">
        <div className="h-3 w-24 bg-slate-900 rounded-sm" />
        <div className="h-1.5 w-32 bg-slate-400 rounded-sm mt-1" />
        <div className="mt-2 h-px bg-slate-900 w-full" />
      </div>
      <div className="h-1.5 w-16 bg-slate-700 rounded-sm" />
      {["a1", "a2", "a3"].map((k, idx) => (
        <div key={k} className="h-1 rounded-sm bg-slate-200" style={{ width: `${[36, 32, 28][idx] * 3}px` }} />
      ))}
      <div className="h-1.5 w-20 bg-slate-700 rounded-sm mt-2" />
      {["b1", "b2", "b3", "b4"].map((k, idx) => (
        <div key={k} className="h-1 rounded-sm bg-slate-200" style={{ width: `${[34, 28, 36, 26][idx] * 3}px` }} />
      ))}
    </div>
  );
}

function PreviewDataScience() {
  return (
    <div className="w-full h-full bg-white flex overflow-hidden">
      <div className="w-[36%] bg-teal-700 p-3 flex flex-col gap-1.5">
        <div className="h-2.5 w-14 bg-white rounded-sm" />
        <div className="h-1 w-16 bg-teal-200 rounded-sm" />
        <div className="mt-2 h-1.5 w-10 bg-teal-200 rounded-sm" />
        {[0, 1, 2].map(i => <div key={i} className="h-1 rounded-sm bg-teal-300/60 w-full" />)}
        <div className="mt-2 h-1.5 w-10 bg-teal-200 rounded-sm" />
        {[0, 1].map(i => <div key={i} className="h-1 rounded-sm bg-teal-300/60 w-4/5" />)}
      </div>
      <div className="flex-1 p-3 flex flex-col gap-1.5">
        <div className="h-1.5 w-16 bg-teal-700 rounded-sm" />
        {["r1", "r2", "r3"].map((k, idx) => (
          <div key={k} className="h-1 rounded-sm bg-slate-200" style={{ width: `${[34, 28, 36][idx] * 3}px` }} />
        ))}
        <div className="h-1.5 w-14 bg-teal-700 rounded-sm mt-2" />
        {["r4", "r5", "r6"].map((k, idx) => (
          <div key={k} className="h-1 rounded-sm bg-slate-200" style={{ width: `${[30, 28, 26][idx] * 3}px` }} />
        ))}
      </div>
    </div>
  );
}

function PreviewStartupMinimal() {
  return (
    <div className="w-full h-full bg-white p-4 flex flex-col gap-2">
      <div className="h-3.5 w-24 bg-slate-900 rounded-sm" />
      <div className="h-1.5 w-32 bg-slate-300 rounded-sm" />
      {[0, 1, 2].map(row => (
        <div key={row} className="flex gap-2 mt-1">
          <div className="h-1.5 w-10 bg-rose-600 rounded-sm mt-0.5 shrink-0" />
          <div className="flex-1 border-l border-slate-200 pl-2 flex flex-col gap-1">
            <div className="h-1 bg-slate-200 rounded-sm w-full" />
            <div className="h-1 bg-slate-200 rounded-sm w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PreviewSeniorEngineer() {
  return (
    <div className="w-full h-full bg-white p-3 flex flex-col gap-1.5">
      <div className="border-t-4 border-slate-600 bg-slate-100 p-2 flex justify-between items-center mb-1">
        <div>
          <div className="h-2.5 w-20 bg-slate-900 rounded-sm" />
          <div className="h-1 w-24 bg-slate-400 rounded-sm mt-1" />
        </div>
      </div>
      <div className="flex gap-2 flex-1">
        <div className="flex-1 border-r border-slate-200 pr-2 flex flex-col gap-1">
          <div className="h-1.5 w-12 bg-slate-600 rounded-sm" />
          {[0, 1, 2].map(i => <div key={i} className="h-1 bg-slate-200 rounded-sm w-full" />)}
          <div className="h-1.5 w-14 bg-slate-600 rounded-sm mt-1" />
          {[0, 1].map(i => <div key={i} className="h-1 bg-slate-200 rounded-sm w-4/5" />)}
        </div>
        <div className="w-14 flex flex-col gap-1">
          <div className="h-1.5 w-full bg-slate-600 rounded-sm" />
          {[0, 1, 2].map(i => <div key={i} className="h-1 bg-slate-200 rounded-sm w-full" />)}
        </div>
      </div>
    </div>
  );
}

function PreviewProductManager() {
  return (
    <div className="w-full h-full bg-white p-3 flex flex-col gap-1.5">
      <div className="bg-rose-50 border-b-2 border-pink-700 p-2 mb-1">
        <div className="h-2.5 w-20 bg-pink-900 rounded-sm" />
        <div className="h-1 w-28 bg-pink-300 rounded-sm mt-1" />
      </div>
      <div className="grid grid-cols-3 gap-1 mb-1">
        {[0, 1, 2].map(i => <div key={i} className="h-7 rounded border border-rose-200 bg-rose-50" />)}
      </div>
      <div className="h-1.5 w-14 bg-pink-700 rounded-sm" />
      {[0, 1, 2].map(i => <div key={i} className="h-1 bg-slate-200 rounded-sm w-full" />)}
    </div>
  );
}

function PreviewDevOps() {
  return (
    <div className="w-full h-full bg-white p-3 flex flex-col gap-1.5">
      <div className="bg-slate-950 p-2 mb-1 rounded-sm">
        <div className="h-2.5 w-22 bg-cyan-300 rounded-sm" />
        <div className="h-1 w-28 bg-slate-400 rounded-sm mt-1" />
      </div>
      <div className="h-1.5 w-14 bg-cyan-600 rounded-sm" />
      {[0, 1, 2].map(i => <div key={i} className="h-1 bg-slate-200 rounded-sm w-full" />)}
      <div className="h-1.5 w-16 bg-cyan-600 rounded-sm mt-1" />
      {[0, 1].map(i => <div key={i} className="h-1 bg-slate-200 rounded-sm w-4/5" />)}
    </div>
  );
}

function PreviewCareerPivot() {
  return (
    <div className="w-full h-full bg-white p-3 flex flex-col gap-1.5">
      <div className="border-l-4 border-orange-600 bg-orange-50 p-2 mb-1">
        <div className="h-2.5 w-20 bg-orange-900 rounded-sm" />
        <div className="h-1 w-28 bg-orange-200 rounded-sm mt-1" />
      </div>
      <div className="h-1.5 w-14 bg-orange-600 rounded-sm" />
      {[0, 1, 2].map(i => <div key={i} className="h-1 bg-slate-200 rounded-sm w-full" />)}
      <div className="h-1.5 w-16 bg-orange-600 rounded-sm mt-1" />
      {[0, 1].map(i => <div key={i} className="h-1 bg-slate-200 rounded-sm w-4/5" />)}
    </div>
  );
}

const PREVIEWS: Record<string, () => JSX.Element> = {
  "modern-tech": PreviewModernTech,
  "executive-classic": PreviewExecutiveClassic,
  "data-science": PreviewDataScience,
  "startup-minimal": PreviewStartupMinimal,
  "senior-engineer": PreviewSeniorEngineer,
  "product-manager": PreviewProductManager,
  "devops-infra": PreviewDevOps,
  "career-change": PreviewCareerPivot,
};

// ── Template Gallery Card ─────────────────────────────────────────────────────

interface TemplateCardProps {
  readonly template: Template;
  readonly isPremiumUser: boolean;
  readonly onPreview: (t: Template) => void;
}

function TemplateCard({ template, isPremiumUser, onPreview }: TemplateCardProps) {
  const isLocked = template.isPremium && !isPremiumUser;
  const Preview = PREVIEWS[template.id] ?? PreviewModernTech;

  return (
    <div className="group flex flex-col cursor-pointer">
      {/* A4 document thumbnail */}
      <div
        className="relative overflow-hidden rounded-md shadow-lg"
        style={{ aspectRatio: "210 / 297" }}  /* A4 ratio */
      >
        {/* Paper content */}
        <div className="absolute inset-0">
          <Preview />
        </div>

        {/* Locked blur overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center gap-1 z-10">
            <div className="bg-amber-500/90 rounded-full p-2">
              <Lock size={18} className="text-white" />
            </div>
            <span className="text-white text-xs font-bold tracking-wide mt-1">PRO</span>
          </div>
        )}

        {/* Hover overlay — Overleaf-style */}
        {!isLocked && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-3 z-10">
            <Link
              href={`/dashboard/builder?templateId=${template.id}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-colors shadow-lg w-40 justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Pencil size={14} /> Open Editor
            </Link>
            <button
              onClick={() => onPreview(template)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors border border-white/20 w-40 justify-center"
            >
              <Eye size={14} /> Preview
            </button>
          </div>
        )}

        {/* ATS score badge */}
        <div className="absolute bottom-2 right-2 z-20 bg-black/70 backdrop-blur-sm rounded px-1.5 py-0.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <CheckCircle2 size={9} className="text-emerald-400" />
          <span className="text-white text-[10px] font-bold">{template.atsScore}% ATS</span>
        </div>

        {/* Pro badge */}
        {template.isPremium && (
          <div className="absolute top-2 left-2 z-20 bg-amber-500/90 rounded px-1.5 py-0.5 flex items-center gap-1">
            <Star size={9} className="text-white" fill="white" />
            <span className="text-white text-[10px] font-bold">PRO</span>
          </div>
        )}

        {/* Border ring on hover */}
        <div className="absolute inset-0 rounded-md ring-0 group-hover:ring-2 group-hover:ring-brand-500 transition-all duration-200 pointer-events-none" />
      </div>

      {/* Template name below thumbnail — like Overleaf */}
      <div className="mt-2.5 px-0.5">
        <p className="text-sm font-semibold text-white truncate group-hover:text-brand-400 transition-colors">
          {template.name}
        </p>
        <p className="text-xs text-slate-500 truncate">{template.bestFor.split(",")[0]}</p>
      </div>

      {/* Locked CTA */}
      {isLocked && (
        <Link
          href="/dashboard/billing"
          className="mt-2 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
        >
          <Zap size={11} /> Upgrade to unlock
        </Link>
      )}
    </div>
  );
}

// ── Preview Modal ─────────────────────────────────────────────────────────────

interface PreviewModalProps {
  readonly template: Template;
  readonly onClose: () => void;
}

function PreviewModal({ template, onClose }: PreviewModalProps) {
  const Preview = PREVIEWS[template.id] ?? PreviewModernTech;

  // S6847: handle Escape via effect instead of attaching to dialog element
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    // S6819: native <dialog> — no event handlers on the element itself
    <dialog
      open
      aria-label={`Preview ${template.name}`}
      className="fixed inset-0 m-0 p-0 w-full h-full max-w-none max-h-none bg-transparent flex items-center justify-center z-50 border-0"
    >
      {/* S6847/S1082: use a native <button> for the backdrop so click + keyboard are both handled */}
      <button
        type="button"
        aria-label="Close preview"
        className="absolute inset-0 w-full h-full bg-black/75 backdrop-blur-sm cursor-default"
        onClick={onClose}
      />

      {/* Modal panel — no onClick needed, it sits on top of the backdrop button */}
      <div className="relative bg-surface-900 rounded-2xl border border-white/10 shadow-2xl flex gap-8 p-8 max-w-3xl w-full mx-4 z-10">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1"
        >
          <X size={20} />
        </button>

        {/* Large A4 preview */}
        <div
          className="rounded-lg overflow-hidden shadow-2xl shrink-0"
          style={{ width: 240, aspectRatio: "210 / 297" }}
        >
          <Preview />
        </div>

        {/* Info panel */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-white font-display">{template.name}</h2>
            {template.isPremium && (
              <span className="bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold px-2 py-0.5 rounded">
                PRO
              </span>
            )}
          </div>
          <p className="text-slate-500 text-xs mb-4">{template.category}</p>
          <p className="text-slate-300 text-sm leading-relaxed mb-5">{template.description}</p>

          <div className="mb-5">
            <p className="text-xs text-slate-500 mb-2 uppercase tracking-widest font-semibold">Best for</p>
            <p className="text-slate-200 text-sm">{template.bestFor}</p>
          </div>

          <div className="mb-6">
            <p className="text-xs text-slate-500 mb-2 uppercase tracking-widest font-semibold">ATS Score</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${template.atsScore}%` }}
                />
              </div>
              <span className="text-emerald-400 text-sm font-bold">{template.atsScore}%</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-8">
            {template.tags.map((tag) => (
              <span key={tag} className="text-xs bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded-md">
                {tag}
              </span>
            ))}
          </div>

          <Link
            href={`/dashboard/builder?templateId=${template.id}`}
            className="btn-primary justify-center mt-auto"
          >
            <Pencil size={15} /> Open in Editor
          </Link>
        </div>
      </div>
    </dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TemplatesPage() {
  const { user } = useAuthStore();
  const isPremiumUser = user?.plan === "premium";
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const filtered = TEMPLATES.filter((t) => {
    const matchesCategory = activeCategory === "All" || t.category === activeCategory;
    const matchesSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden animate-fade-in">
      {/* ── Left Sidebar ── */}
      <aside className="w-56 shrink-0 border-r border-white/8 bg-surface-950/60 flex flex-col py-6 px-3 overflow-y-auto">
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest px-3 mb-3">
          Categories
        </p>
        <nav className="flex flex-col gap-0.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={[
                "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                activeCategory === cat
                  ? "bg-brand-500/15 text-brand-300 border border-brand-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5",
              ].join(" ")}
            >
              <span className="flex items-center gap-2">
                {activeCategory === cat && <ChevronRight size={13} className="text-brand-400" />}
                {cat}
              </span>
              <span
                className={[
                  "text-xs rounded-full px-1.5 py-0.5",
                  activeCategory === cat ? "bg-brand-500/20 text-brand-300" : "bg-white/5 text-slate-500",
                ].join(" ")}
              >
                {CATEGORY_COUNTS[cat]}
              </span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 px-2">
          {!isPremiumUser && (
            <Link
              href="/dashboard/billing"
              className="block p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 text-center hover:bg-amber-500/12 transition-colors"
            >
              <Zap size={16} className="text-amber-400 mx-auto mb-1" />
              <p className="text-amber-300 text-xs font-semibold">Unlock Pro Templates</p>
              <p className="text-slate-500 text-[10px] mt-0.5">3 exclusive templates</p>
            </Link>
          )}
        </div>
      </aside>

      {/* ── Main Gallery ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky top bar */}
        <div className="flex items-center justify-between gap-4 px-8 py-4 border-b border-white/8 shrink-0 bg-surface-950/40 backdrop-blur-sm">
          <div>
            <h1 className="font-display text-xl font-bold text-white">Resume Templates</h1>
            <p className="text-slate-500 text-xs mt-0.5">
              {filtered.length} template{filtered.length === 1 ? "" : "s"}
              {activeCategory === "All" ? "" : ` in ${activeCategory}`}
            </p>
          </div>
          {/* Search */}
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              className="input py-2 pl-9 pr-4 text-sm"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-8 py-7">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <FileText size={36} className="mb-3 opacity-30" />
              <p>No templates found for <strong className="text-slate-300">&quot;{search}&quot;</strong></p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filtered.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isPremiumUser={isPremiumUser}
                  onPreview={setPreviewTemplate}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Preview Modal */}
      {previewTemplate && (
        <PreviewModal template={previewTemplate} onClose={() => setPreviewTemplate(null)} />
      )}
    </div>
  );
}
