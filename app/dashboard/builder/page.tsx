"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Layout, Code2, SlidersHorizontal, FileDown, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAnalysisStore } from "@/store/useAppStore";
import { downloadPDF, downloadDOCX } from "@/lib/downloadResume";

// React-PDF viewer must be loaded dynamically on the client side only
const PDFPreview = dynamic(() => import("@/components/resume/PDFPreview"), {
  ssr: false,
  loading: () => <div className="flex-1 flex items-center justify-center text-slate-400">Loading PDF engine...</div>,
});

type EditorMode = "latex" | "visual";

type VisualResume = {
  name: string;
  contact: string;
  summary: string;
  skills: string;
  experienceTitle: string;
  experienceBullets: string;
  education: string;
};


// Matches the dummy data used in every TEMPLATE_SAMPLE so that Visual mode
// shows the same resume as the LaTeX sample loaded on first open.
const SAMPLE_VISUAL_DATA: VisualResume = {
  name: "Alex Johnson",
  contact: "alex@example.com | +1 (555) 123-4567 | linkedin.com/in/abcd | github.com/abcd",
  summary: "Software Engineer with 4+ years building distributed systems and production-grade backend applications. Proficient in C++, Python, and systems-level programming with hands-on exposure to TCP/IP, HTTP, WebSockets, IPAM, and AI/ML frameworks.",
  skills: "C++, Python, JavaScript, FastAPI, Django, AsyncIO, Docker, Kafka, Redis, PostgreSQL, MongoDB, OpenSearch, RAG, LangChain, FAISS, PyTorch, JWT, OAuth2, RBAC",
  experienceTitle: "Software Developer — NovaSystems Ltd. (Apr 2024 – Present)",
  experienceBullets: "Architected 40+ FastAPI microservices for CyberRange Pro supporting 10,000+ concurrent users\nDesigned Kafka + Redis event pipelines reducing inter-service latency by 35%\nBuilt SOC Intelligence Platform processing SIEM/SOAR telemetry via Socket.IO\nImplemented JWT/OAuth2, RBAC, and IPAM across multi-tenant environments",
  education: "B.Tech, Computer Science & Engineering — Greenfield Institute of Technology (2020–2024)",
};

// S7780: Use String.raw to avoid escaping backslashes
const TEMPLATE_LATEX_STYLES: Record<string, { accent: string; margin: string; family: string; sectionStyle: string }> = {
  "modern-tech": {
    accent: "2563EB",
    margin: "0.72in",
    family: String.raw`\renewcommand{\familydefault}{\sfdefault}`,
    sectionStyle: String.raw`\large\bfseries\color{accent}`,
  },
  "executive-classic": {
    accent: "111827",
    margin: "0.82in",
    family: String.raw`\renewcommand{\familydefault}{\rmdefault}`,
    sectionStyle: String.raw`\large\bfseries\color{accent}`,
  },
  "data-science": {
    accent: "0F766E",
    margin: "0.68in",
    family: String.raw`\renewcommand{\familydefault}{\sfdefault}`,
    sectionStyle: String.raw`\large\bfseries\color{accent}`,
  },
  "startup-minimal": {
    accent: "E11D48",
    margin: "0.65in",
    family: String.raw`\renewcommand{\familydefault}{\sfdefault}`,
    sectionStyle: String.raw`\large\bfseries\color{accent}`,
  },
  "senior-engineer": {
    accent: "475569",
    margin: "0.7in",
    family: String.raw`\renewcommand{\familydefault}{\sfdefault}`,
    sectionStyle: String.raw`\large\bfseries\color{accent}`,
  },
  "product-manager": {
    accent: "BE123C",
    margin: "0.68in",
    family: String.raw`\renewcommand{\familydefault}{\sfdefault}`,
    sectionStyle: String.raw`\large\bfseries\color{accent}`,
  },
  "devops-infra": {
    accent: "0891B2",
    margin: "0.66in",
    family: String.raw`\renewcommand{\familydefault}{\ttdefault}`,
    sectionStyle: String.raw`\large\bfseries\color{accent}`,
  },
  "career-change": {
    accent: "C2410C",
    margin: "0.7in",
    family: String.raw`\renewcommand{\familydefault}{\sfdefault}`,
    sectionStyle: String.raw`\large\bfseries\color{accent}`,
  },
};

// S7781: Use replaceAll; S7780: String.raw for the replacement
function latexEscape(value: string) {
  return value.replaceAll(/[{}]/g, "").replaceAll("%", String.raw`\%`).trim();
}

function latexTemplateFromVisual(templateId: string, data: VisualResume) {
  const style = TEMPLATE_LATEX_STYLES[templateId] ?? TEMPLATE_LATEX_STYLES["modern-tech"];
  const bullets = data.experienceBullets
    .split("\n")
    .filter((b) => b.trim())
    .map((b) => String.raw`\item ` + latexEscape(b))
    .join("\n");

  // S7780: Use String.raw for the entire LaTeX template literal
  return String.raw`\documentclass[11pt]{article}
\usepackage[margin=${style.margin}]{geometry}
\usepackage{enumitem}
\usepackage{xcolor}
\usepackage{titlesec}
\definecolor{accent}{HTML}{${style.accent}}
${style.family}
\setlist[itemize]{leftmargin=1.25em, itemsep=0.18em, topsep=0.18em}
\titleformat{\section}{${style.sectionStyle}}{}{0em}{}[\vspace{0.15em}\titlerule]
\titlespacing*{\section}{0pt}{0.85em}{0.35em}
\newcommand{\resumeName}[1]{{\LARGE \textbf{#1}}}
\newcommand{\resumeContact}[1]{{\small #1}}
\pagestyle{empty}

\begin{document}

\begin{center}
\resumeName{${latexEscape(data.name)}}\\
\resumeContact{${latexEscape(data.contact)}}
\end{center}

\section*{Summary}
${latexEscape(data.summary)}

\section*{Skills}
${latexEscape(data.skills)}

\section*{Experience}
\subsection*{${latexEscape(data.experienceTitle)}}
\begin{itemize}
${bullets}
\end{itemize}

\section*{Education}
${latexEscape(data.education)}

\end{document}`;
}

// ── Per-template sample documents (fully dummy data, 8 distinct styles) ────────
const TEMPLATE_SAMPLES: Record<string, string> = {

  // ── 1. Modern Tech — blue accent, sans-serif, paracol environments ───────────
  "modern-tech": String.raw`\documentclass[10.5pt, letterpaper]{article}
\usepackage[ignoreheadfoot,top=1.2cm,bottom=0.8cm,left=1cm,right=1cm,footskip=1.0cm]{geometry}
\usepackage{titlesec}\usepackage{tabularx}\usepackage{array}
\usepackage[dvipsnames]{xcolor}\usepackage{enumitem}\usepackage{fontawesome5}
\usepackage{amsmath}\usepackage[colorlinks=true,urlcolor=primaryColor]{hyperref}
\usepackage[pscoord]{eso-pic}\usepackage{calc}\usepackage{bookmark}
\usepackage{lastpage}\usepackage{changepage}\usepackage{paracol}\usepackage{needspace}
\definecolor{primaryColor}{RGB}{37, 99, 235}
\pagestyle{empty}\setcounter{secnumdepth}{0}\setlength{\parindent}{0pt}
\setlength{\topskip}{0pt}\setlength{\columnsep}{0cm}
\titleformat{\section}{\bfseries\large}{}{0pt}{}[\vspace{1pt}\titlerule]
\titlespacing{\section}{-1pt}{0.2cm}{0.15cm}\renewcommand\labelitemi{$\circ$}
\newenvironment{highlights}{\begin{itemize}[topsep=0.05cm,parsep=0.05cm,partopsep=0pt,itemsep=0pt,leftmargin=0.4cm + 10pt]}{\end{itemize}}
\newenvironment{onecolentry}{\begin{adjustwidth}{0.2cm}{0.2cm}}{\end{adjustwidth}}
\newenvironment{twocolentry}[2][]{\onecolentry\def\secondColumn{#2}\setcolumnwidth{\fill,4.5cm}\begin{paracol}{2}}{\switchcolumn\raggedleft\secondColumn\end{paracol}\endonecolentry}
\newenvironment{header}{\setlength{\topsep}{0pt}\par\kern\topsep\centering\linespread{1.2}}{\par\kern\topsep}
\begin{document}
\begin{header}
    \textbf{\fontsize{22pt}{22pt}\selectfont Alex Johnson} \\[0.08cm]
    \mbox{\footnotesize San Francisco, CA} \kern0.25cm
    \mbox{\href{mailto:alex@example.com}{\footnotesize alex@example.com}} \kern0.25cm
    \mbox{\href{tel:+15551234567}{\footnotesize +1 (555) 123-4567}} \kern0.25cm
    \mbox{\href{https://linkedin.com/in/abcd}{\footnotesize LinkedIn}} \kern0.25cm
    \mbox{\href{https://github.com/abcd}{\footnotesize GitHub}}
\end{header}
\vspace{0.3cm}
\section{Summary}
\begin{onecolentry}
Software Engineer with 4+ years building distributed systems and production-grade backend applications. Proficient in C++, Python, and systems-level programming with hands-on exposure to TCP/IP, HTTP, WebSockets, IPAM, and AI/ML frameworks.
\end{onecolentry}
\vspace{0.25cm}
\section{Experience}
\begin{twocolentry}{\textit{Apr 2024 -- Present}}
\textbf{Software Developer --- NovaSystems Ltd.}\\ \textit{Python, C++, FastAPI, Kafka, Redis, PostgreSQL, Docker}
\end{twocolentry}
\begin{onecolentry}\begin{highlights}
\item Architected 40+ FastAPI microservices for the \textbf{CyberRange Pro} platform supporting 10,000+ concurrent users.
\item Designed Kafka + Redis event pipelines reducing inter-service latency by 35\%.
\item Built SOC Intelligence Platform backend processing SIEM/SOAR telemetry via Socket.IO.
\item Implemented JWT/OAuth2, RBAC, and IPAM services across multi-tenant environments.
\end{highlights}\end{onecolentry}
\vspace{0.15cm}
\begin{twocolentry}{\textit{Nov 2023 -- Mar 2024}}
\textbf{AI Engineer --- DataBridge AI}\\ \textit{FastAPI, LangChain, FAISS, Redis, PyTorch}
\end{twocolentry}
\begin{onecolentry}\begin{highlights}
\item Built RAG systems with PostgreSQL and MongoDB for enterprise Q\&A across legal and finance domains.
\item Reduced LLM calls by 50\% via Redis+FAISS caching, improving latency by 40\%.
\end{highlights}\end{onecolentry}
\vspace{0.25cm}
\section{Projects}
\begin{twocolentry}{\href{https://github.com/abcd}{\textit{GitHub}}}
\textbf{FinBot --- RAG Financial Q\&A} \\ \textit{FastAPI, LangChain, FAISS, Redis}
\end{twocolentry}
\begin{onecolentry}\begin{highlights}
\item 35\% better semantic retrieval via FAISS + transformer embeddings over keyword baselines.
\item Sub-second response at scale via Redis caching; 50\% reduction in LLM API costs.
\end{highlights}\end{onecolentry}
\vspace{0.25cm}
\section{Skills}
\begin{onecolentry}
\textbf{Languages:} C++, Python, JavaScript \hspace{0.4cm} \textbf{Backend:} FastAPI, Django, AsyncIO, Celery\\
\textbf{Infra:} Docker, Kafka, Redis, Kubernetes \hspace{0.4cm} \textbf{AI/ML:} RAG, LangChain, FAISS, PyTorch\\
\textbf{Databases:} PostgreSQL, MongoDB, OpenSearch \hspace{0.4cm} \textbf{Security:} JWT, OAuth2, RBAC
\end{onecolentry}
\vspace{0.2cm}
\section{Education}
\begin{twocolentry}{\textit{2020 -- 2024}}
\textbf{Greenfield Institute of Technology} \\ \textit{B.Tech, Computer Science \& Engineering}
\end{twocolentry}
\end{document}`,

  // ── 2. Executive Classic — dark serif, centered formal header ─────────────────
  "executive-classic": String.raw`\documentclass[11pt, letterpaper]{article}
\usepackage[top=1.4cm,bottom=1cm,left=1.2cm,right=1.2cm]{geometry}
\usepackage{titlesec}\usepackage{enumitem}\usepackage[T1]{fontenc}
\usepackage{lmodern}\usepackage{xcolor}\usepackage[colorlinks=true,urlcolor=black]{hyperref}
\definecolor{headcolor}{RGB}{17,24,39}
\pagestyle{empty}\setlength{\parindent}{0pt}
\renewcommand{\familydefault}{\rmdefault}
\titleformat{\section}{\bfseries\normalsize\scshape}{}{0pt}{}[{\color{headcolor}\titlerule[0.6pt]}]
\titlespacing{\section}{0pt}{0.5em}{0.3em}
\newcommand{\entry}[4]{\textbf{#1} \hfill {\small\textit{#2}}\\ {\small\textit{#3}} \hfill {\small #4}\\}
\begin{document}
{\centering
{\fontsize{24pt}{24pt}\selectfont\bfseries\scshape Alex Johnson}\\[0.15cm]
{\small San Francisco, CA \enspace\textbar\enspace
\href{mailto:alex@example.com}{alex@example.com} \enspace\textbar\enspace
+1 (555) 123-4567 \enspace\textbar\enspace
\href{https://linkedin.com/in/abcd}{LinkedIn} \enspace\textbar\enspace
\href{https://github.com/abcd}{GitHub}}\\[0.1cm]
{\color{headcolor}\rule{\linewidth}{0.8pt}}\\[0.05cm]
}
\section{Professional Summary}
Seasoned Software Engineer with 4+ years delivering distributed backend systems and production-grade microservices. Expert in Python, C++, and event-driven architecture with hands-on experience in AI/ML integration, IPAM, and cloud infrastructure.
\section{Professional Experience}
\entry{Software Developer}{NovaSystems Ltd.}{Python, C++, FastAPI, Kafka, Redis, PostgreSQL, Docker}{Apr 2024 -- Present}
\begin{itemize}[leftmargin=1.5em,topsep=0.1em,itemsep=0.05em,parsep=0em]
\item Architected 40+ FastAPI microservices for the CyberRange Pro platform, supporting 10,000+ concurrent users.
\item Designed Kafka and Redis event pipelines that cut inter-service latency by 35\%.
\item Delivered SOC Intelligence Platform processing SIEM/SOAR telemetry in air-gapped environments.
\item Implemented JWT/OAuth2, RBAC, and IPAM services for multi-tenant environments.
\end{itemize}
\vspace{0.3em}
\entry{AI Engineer}{DataBridge AI}{FastAPI, LangChain, FAISS, Redis, PostgreSQL, PyTorch}{Nov 2023 -- Mar 2024}
\begin{itemize}[leftmargin=1.5em,topsep=0.1em,itemsep=0.05em,parsep=0em]
\item Designed RAG systems enabling semantic Q\&A across legal, finance, and HR document corpora.
\item Reduced LLM API costs by 50\% and improved latency by 40\% via FAISS + Redis caching.
\item Increased document retrieval throughput 3$\times$ through optimised chunking and embedding pipelines.
\end{itemize}
\section{Key Projects}
\textbf{FinBot} --- RAG Financial Q\&A Engine \hfill \href{https://github.com/abcd}{\textit{github.com/abcd}}\\
\textbf{DocFlow} --- Intelligent Document Processing Pipeline \hfill \textit{FastAPI, PyTorch, PostgreSQL, MinIO}
\section{Technical Skills}
\textbf{Languages:} C++, Python, JavaScript \quad\textbf{Backend:} FastAPI, Django, AsyncIO, Celery, REST APIs\\
\textbf{Data:} PostgreSQL, MongoDB, OpenSearch, Redis \quad\textbf{AI/ML:} RAG, LangChain, FAISS, PyTorch\\
\textbf{Infrastructure:} Docker, Kafka, Linux, Git \quad\textbf{Security:} JWT, OAuth2, RBAC
\section{Education}
\entry{B.Tech, Computer Science \& Engineering}{Greenfield Institute of Technology}{}{2020 -- 2024}
\end{document}`,

  // ── 3. Data Science Pro — teal two-column sidebar ─────────────────────────────
  "data-science": String.raw`\documentclass[10pt]{article}
\usepackage[top=0cm,bottom=0cm,left=0cm,right=0cm,noheadfoot]{geometry}
\usepackage{paracol}\usepackage{xcolor}\usepackage{enumitem}
\usepackage{titlesec}\usepackage[colorlinks=true,urlcolor=white]{hyperref}
\usepackage{changepage}\usepackage{lmodern}\usepackage[T1]{fontenc}
\definecolor{sidebar}{RGB}{15,118,110}\definecolor{sidetext}{RGB}{204,251,241}
\definecolor{accent}{RGB}{15,118,110}
\pagestyle{empty}\setlength{\parindent}{0pt}\setlength{\columnsep}{0pt}
\titleformat{\section}{\bfseries\small\color{accent}}{}{0pt}{}[{\color{accent}\titlerule[0.5pt]}]
\titlespacing{\section}{0pt}{0.4em}{0.2em}
\begin{document}
\setcolumnwidth{5.6cm,\fill}
\begin{paracol}{2}
%-- LEFT SIDEBAR
{\color{white}\pagecolor{sidebar}
\begin{adjustwidth}{0.5cm}{0.3cm}
\vspace{0.7cm}
{\fontsize{18pt}{18pt}\selectfont\bfseries\color{white} Alex\\Johnson}\\[0.2cm]
{\small\color{sidetext} San Francisco, CA}\\[0.05cm]
{\small\color{sidetext}\href{mailto:alex@example.com}{alex@example.com}}\\[0.05cm]
{\small\color{sidetext}\href{tel:+15551234567}{+1 (555) 123-4567}}\\[0.05cm]
{\small\color{sidetext}\href{https://linkedin.com/in/abcd}{linkedin.com/alexjohnson}}\\[0.05cm]
{\small\color{sidetext}\href{https://github.com/abcd}{github.com/abcd}}\\[0.3cm]
{\bfseries\small\color{sidetext} TECHNICAL SKILLS}\\[-0.05cm]
{\color{sidetext}\rule{\linewidth}{0.4pt}}\\[0.15cm]
{\small\color{white}\textbf{Languages}}\\ {\small\color{sidetext} C++, Python, JavaScript}\\[0.15cm]
{\small\color{white}\textbf{Backend}}\\ {\small\color{sidetext} FastAPI, Django, AsyncIO}\\[0.15cm]
{\small\color{white}\textbf{AI/ML}}\\ {\small\color{sidetext} RAG, LangChain, FAISS,\\PyTorch, Transformers}\\[0.15cm]
{\small\color{white}\textbf{Databases}}\\ {\small\color{sidetext} PostgreSQL, MongoDB,\\OpenSearch, Redis}\\[0.15cm]
{\small\color{white}\textbf{DevOps}}\\ {\small\color{sidetext} Docker, Kafka, Linux, Git}\\[0.3cm]
{\bfseries\small\color{sidetext} EDUCATION}\\[-0.05cm]
{\color{sidetext}\rule{\linewidth}{0.4pt}}\\[0.15cm]
{\small\color{white}\textbf{B.Tech --- CS\&E}}\\ {\small\color{sidetext} Greenfield Institute\\2020 -- 2024}\\[0.3cm]
{\bfseries\small\color{sidetext} CERTIFICATIONS}\\[-0.05cm]
{\color{sidetext}\rule{\linewidth}{0.4pt}}\\[0.1cm]
{\small\color{sidetext} Deep Learning Spec.\\DeepLearning.AI (Coursera)}\\[0.1cm]
{\small\color{sidetext} Supervised ML\\Stanford (Coursera)}
\vspace{0.7cm}
\end{adjustwidth}
}
\switchcolumn
%-- RIGHT MAIN CONTENT
\begin{adjustwidth}{0.4cm}{0.4cm}
\vspace{0.7cm}
\section{Summary}
{\small Software Engineer with 4+ years building distributed ML systems and production RAG pipelines. Expert in Python, FAISS, and LangChain with deep experience in vector search, PostgreSQL, and cloud-native architectures.}
\vspace{0.3cm}
\section{Experience}
{\small\textbf{Software Developer --- NovaSystems Ltd.} \hfill \textit{Apr 2024 -- Present}}\\
{\footnotesize\textit{Python, C++, FastAPI, Kafka, Redis, PostgreSQL, MongoDB, Docker}}
\begin{itemize}[leftmargin=1em,topsep=0.1em,itemsep=0.04em,parsep=0em,label=$\circ$]
\item {\small Architected 40+ FastAPI microservices for CyberRange Pro, 10,000+ concurrent users.}
\item {\small Designed Kafka + Redis pipelines reducing inter-service latency by 35\%.}
\item {\small SOC Intelligence Platform for SIEM/SOAR telemetry in air-gapped networks.}
\item {\small JWT/OAuth2, RBAC, and IPAM services across multi-tenant environments.}
\end{itemize}
{\small\textbf{AI Engineer --- DataBridge AI} \hfill \textit{Nov 2023 -- Mar 2024}}\\
{\footnotesize\textit{FastAPI, LangChain, FAISS, Redis, PostgreSQL, PyTorch}}
\begin{itemize}[leftmargin=1em,topsep=0.1em,itemsep=0.04em,parsep=0em,label=$\circ$]
\item {\small Production-grade RAG for enterprise Q\&A across legal, finance, and HR domains.}
\item {\small 50\% LLM cost reduction and 40\% latency improvement via FAISS + Redis caching.}
\item {\small 3$\times$ retrieval throughput improvement through chunking and embedding optimisation.}
\end{itemize}
\vspace{0.3cm}
\section{Projects}
{\small\textbf{FinBot} --- RAG Financial Q\&A \hfill \href{https://github.com/abcd}{\textit{GitHub}}}
\begin{itemize}[leftmargin=1em,topsep=0.05em,itemsep=0.04em,parsep=0em,label=$\circ$]
\item {\small 35\% better semantic retrieval via FAISS + transformer embeddings.}
\item {\small Sub-second responses; 50\% LLM cost reduction via Redis caching.}
\end{itemize}
{\small\textbf{DocFlow} --- Document Processing Pipeline \hfill \textit{FastAPI, PyTorch, MinIO}}
\begin{itemize}[leftmargin=1em,topsep=0.05em,itemsep=0.04em,parsep=0em,label=$\circ$]
\item {\small Multi-format ingestion (PDF, DOCX, HTML) for 10,000+ document corpus.}
\item {\small Cross-encoder reranking: +28\% top-3 retrieval precision over baseline FAISS.}
\end{itemize}
\vspace{0.3cm}
\end{adjustwidth}
\end{paracol}
\end{document}`,

  // ── 4. Startup Minimal — rose accent, ultra-clean impact-first ────────────────
  "startup-minimal": String.raw`\documentclass[10.5pt, letterpaper]{article}
\usepackage[top=1.1cm,bottom=0.9cm,left=1.1cm,right=1.1cm]{geometry}
\usepackage{titlesec}\usepackage{enumitem}\usepackage{xcolor}
\usepackage[colorlinks=true,urlcolor=accent]{hyperref}\usepackage{lmodern}
\definecolor{accent}{RGB}{225,29,72}
\pagestyle{empty}\setlength{\parindent}{0pt}\renewcommand{\familydefault}{\sfdefault}
\titleformat{\section}{\bfseries\normalsize\color{accent}}{}{0pt}{}{}
\titlespacing{\section}{0pt}{0.55em}{0.15em}
\newcommand{\sep}{{\color{accent} \textbullet\ }}
\begin{document}
{\fontsize{26pt}{26pt}\selectfont\textbf{Alex Johnson}}\\[0.1cm]
{\small\href{mailto:alex@example.com}{alex@example.com} \sep +1 (555) 123-4567 \sep \href{https://linkedin.com/in/abcd}{LinkedIn} \sep \href{https://github.com/abcd}{GitHub}}\\[0.05cm]
{\color{accent}\rule{\linewidth}{1.5pt}}
\vspace{0.2cm}
\section{IMPACT}
Software Engineer with 4+ years shipping distributed systems at scale. Expert in Python, C++, and event-driven architecture. Led backend teams building platforms for 10,000+ concurrent users. Deep experience in AI/ML RAG pipelines, reducing LLM costs by 50\%.
\vspace{0.2cm}
\section{EXPERIENCE}
\textbf{Software Developer} \hfill {\color{accent}\textit{NovaSystems Ltd. | Apr 2024 -- Present}}\\
{\footnotesize Python, C++, FastAPI, Kafka, Redis, PostgreSQL, MongoDB, Docker}
\begin{itemize}[leftmargin=1.2em,topsep=0.1em,itemsep=0.06em,parsep=0em,label={\color{accent}$\rightarrow$}]
\item Architected 40+ FastAPI microservices for CyberRange Pro; 10,000+ concurrent users, 99.9\% uptime.
\item Kafka + Redis event pipelines cutting cross-service latency by 35\%.
\item SOC Intelligence Platform for air-gapped SIEM/SOAR environments.
\item JWT/OAuth2, RBAC, and IPAM across multi-tenant deployments.
\end{itemize}
\vspace{0.2em}
\textbf{AI Engineer} \hfill {\color{accent}\textit{DataBridge AI | Nov 2023 -- Mar 2024}}\\
{\footnotesize FastAPI, LangChain, FAISS, Redis, PostgreSQL, PyTorch}
\begin{itemize}[leftmargin=1.2em,topsep=0.1em,itemsep=0.06em,parsep=0em,label={\color{accent}$\rightarrow$}]
\item Production RAG for enterprise Q\&A; legal, finance, and HR domains.
\item 50\% LLM cost reduction + 40\% latency improvement via FAISS + Redis.
\item 3$\times$ retrieval throughput via optimised chunking and embedding workflows.
\end{itemize}
\vspace{0.2cm}
\section{PROJECTS}
\textbf{FinBot} --- RAG Financial Q\&A \hfill {\footnotesize FastAPI, LangChain, FAISS, Redis}\\
$\rightarrow$ 35\% semantic retrieval gain | 50\% LLM cost cut via Redis caching | sub-second P95 responses
\vspace{0.1em}\\
\textbf{DocFlow} --- Document Pipeline \hfill {\footnotesize FastAPI, PyTorch, PostgreSQL, MinIO}\\
$\rightarrow$ 10,000+ doc corpus | sub-200ms retrieval | +28\% top-3 precision with cross-encoder reranking
\vspace{0.2cm}
\section{SKILLS}
\textbf{Languages:} C++, Python, JS \quad \textbf{Backend:} FastAPI, Django, AsyncIO \quad \textbf{AI/ML:} RAG, LangChain, FAISS, PyTorch\\
\textbf{Data:} PostgreSQL, MongoDB, OpenSearch \quad \textbf{Infra:} Docker, Kafka, Redis \quad \textbf{Security:} JWT, OAuth2, RBAC
\vspace{0.2cm}
\section{EDUCATION}
\textbf{B.Tech, Computer Science \& Engineering} --- Greenfield Institute of Technology \hfill \textit{2020 -- 2024}
\end{document}`,

  // ── 5. Senior Engineer — slate band header, two-zone layout ──────────────────
  "senior-engineer": String.raw`\documentclass[10.5pt, letterpaper]{article}
\usepackage[top=0cm,bottom=0.8cm,left=0cm,right=0cm]{geometry}
\usepackage{titlesec}\usepackage{enumitem}\usepackage{xcolor}
\usepackage{changepage}\usepackage[colorlinks=true,urlcolor=accent]{hyperref}
\usepackage{lmodern}\usepackage[T1]{fontenc}
\definecolor{headerBg}{RGB}{51,65,85}\definecolor{accent}{RGB}{71,85,105}
\pagestyle{empty}\setlength{\parindent}{0pt}\renewcommand{\familydefault}{\sfdefault}
\titleformat{\section}{\bfseries\small\color{accent}}{}{0pt}{}[{\color{accent}\titlerule[0.5pt]}]
\titlespacing{\section}{0pt}{0.5em}{0.25em}
\begin{document}
% Header band
{\color{white}\pagecolor{headerBg}
\begin{adjustwidth}{1cm}{1cm}
\vspace{0.6cm}
{\fontsize{22pt}{22pt}\selectfont\bfseries\color{white} Alex Johnson}\\[0.1cm]
{\small\color{gray!60!white}
\href{mailto:alex@example.com}{alex@example.com} \enspace|\enspace
+1 (555) 123-4567 \enspace|\enspace
\href{https://linkedin.com/in/abcd}{LinkedIn} \enspace|\enspace
\href{https://github.com/abcd}{GitHub} \enspace|\enspace San Francisco, CA}\\[0.15cm]
{\footnotesize\color{gray!60!white} Software Developer $\cdot$ Distributed Systems $\cdot$ AI/ML Backend $\cdot$ Security}
\vspace{0.5cm}
\end{adjustwidth}
}
\nopagecolor
\begin{adjustwidth}{1cm}{1cm}
\vspace{0.4cm}
\section{PROFESSIONAL PROFILE}
{\small Software Engineer with 4+ years building production-grade distributed systems. Deep expertise in FastAPI microservices, event-driven architecture (Kafka/Redis), AI/ML RAG pipelines, and multi-tenant security. Proven track record driving 35--50\% performance improvements.}
\vspace{0.15cm}
\section{EXPERIENCE}
{\small\textbf{Software Developer --- NovaSystems Ltd.} \hfill \textit{Apr 2024 -- Present}}\\
{\footnotesize\textit{Stack: Python, C++, FastAPI, Kafka, Redis, PostgreSQL, MongoDB, OpenSearch, Docker, Socket.IO}}
\begin{itemize}[leftmargin=1.2em,topsep=0.1em,itemsep=0.05em,parsep=0em,label={\color{accent}$\triangleright$}]
\item {\small Architected 40+ FastAPI microservices for CyberRange Pro platform; 10,000+ concurrent users at scale.}
\item {\small Kafka + Redis event pipelines: 35\% latency reduction, fault-tolerant async at 100K events/day.}
\item {\small SOC Intelligence Platform: SIEM/SOAR telemetry processing in air-gapped environments.}
\item {\small JWT/OAuth2, RBAC, and IPAM: automated subnet allocation and multi-tenant conflict resolution.}
\end{itemize}
\vspace{0.15cm}
{\small\textbf{AI Engineer --- DataBridge AI} \hfill \textit{Nov 2023 -- Mar 2024}}\\
{\footnotesize\textit{Stack: FastAPI, LangChain, FAISS, Redis, PostgreSQL, MongoDB, PyTorch}}
\begin{itemize}[leftmargin=1.2em,topsep=0.1em,itemsep=0.05em,parsep=0em,label={\color{accent}$\triangleright$}]
\item {\small Production RAG for enterprise Q\&A across legal, finance, and HR domains.}
\item {\small 50\% LLM call reduction + 40\% latency gain via Redis caching and FAISS vector search.}
\item {\small 3$\times$ retrieval throughput via chunking/embedding optimisation; 30\% API cost reduction.}
\end{itemize}
\vspace{0.15cm}
\section{PROJECTS}
{\small\textbf{FinBot} --- RAG Financial Q\&A \hfill \href{https://github.com/abcd}{\textit{GitHub}}}
\begin{itemize}[leftmargin=1.2em,topsep=0.05em,itemsep=0.04em,parsep=0em,label={\color{accent}$\triangleright$}]
\item {\small FAISS + transformer pipeline; 35\% semantic retrieval improvement over keyword baselines.}
\item {\small Redis caching: 50\% fewer LLM calls, sub-second P95 at 1,000 concurrent users.}
\end{itemize}
\vspace{0.1cm}
{\small\textbf{DocFlow} --- Document Processing Pipeline \hfill \textit{FastAPI, PyTorch, PostgreSQL, MinIO}}
\begin{itemize}[leftmargin=1.2em,topsep=0.05em,itemsep=0.04em,parsep=0em,label={\color{accent}$\triangleright$}]
\item {\small Multi-format ingestion (PDF, DOCX, HTML); 10,000+ doc corpus, sub-200ms retrieval.}
\item {\small Cross-encoder reranking: +28\% top-3 precision over vanilla FAISS.}
\end{itemize}
\vspace{0.15cm}
\section{SKILLS}
{\small\textbf{Languages:} C++, Python, JS \enspace\textbf{Backend:} FastAPI, Django, AsyncIO, gRPC, Celery \enspace\textbf{Infra:} Docker, Kafka, Redis, Kubernetes}\\
{\small\textbf{AI/ML:} RAG, LangChain, FAISS, Transformers, PyTorch \enspace\textbf{Data:} PostgreSQL, MongoDB, OpenSearch \enspace\textbf{Sec:} JWT, OAuth2, RBAC}
\vspace{0.15cm}
\section{EDUCATION}
{\small\textbf{B.Tech, Computer Science \& Engineering} --- Greenfield Institute of Technology \hfill \textit{2020 -- 2024}}
\end{adjustwidth}
\end{document}`,

  // ── 6. Product Leader — deep pink, KPI metrics row ───────────────────────────
  "product-manager": String.raw`\documentclass[10.5pt, letterpaper]{article}
\usepackage[top=1.1cm,bottom=0.8cm,left=1.1cm,right=1.1cm]{geometry}
\usepackage{titlesec}\usepackage{enumitem}\usepackage{xcolor}\usepackage{tabularx}
\usepackage[colorlinks=true,urlcolor=accent]{hyperref}
\definecolor{accent}{RGB}{190,18,60}\definecolor{accentLight}{RGB}{255,228,230}
\pagestyle{empty}\setlength{\parindent}{0pt}\renewcommand{\familydefault}{\sfdefault}
\titleformat{\section}{\bfseries\normalsize\color{accent}}{}{0pt}{}[{\color{accent}\titlerule[0.8pt]}]
\titlespacing{\section}{0pt}{0.5em}{0.25em}
\begin{document}
{\colorbox{accentLight}{\parbox{\dimexpr\linewidth-2\fboxsep}{\vspace{0.3cm}\hspace{0.3cm}
{\fontsize{22pt}{22pt}\selectfont\bfseries Alex Johnson}\\[0.05cm]
\hspace{0.3cm}{\small\color{accent}\textbf{Software Engineer $\cdot$ Backend Systems $\cdot$ AI/ML}}\\[0.1cm]
\hspace{0.3cm}{\footnotesize \href{mailto:alex@example.com}{alex@example.com} \enspace|\enspace +1 (555) 123-4567 \enspace|\enspace \href{https://linkedin.com/in/abcd}{LinkedIn} \enspace|\enspace San Francisco, CA}\vspace{0.3cm}}}}
\vspace{0.2cm}
% KPI row
\begin{tabularx}{\linewidth}{XXXX}
{\centering\colorbox{accentLight}{\parbox{\linewidth}{\centering\vspace{0.15cm}{\large\bfseries\color{accent}40+}\\{\footnotesize Microservices Built}\vspace{0.15cm}}}} &
{\centering\colorbox{accentLight}{\parbox{\linewidth}{\centering\vspace{0.15cm}{\large\bfseries\color{accent}35\%}\\{\footnotesize Latency Reduction}\vspace{0.15cm}}}} &
{\centering\colorbox{accentLight}{\parbox{\linewidth}{\centering\vspace{0.15cm}{\large\bfseries\color{accent}50\%}\\{\footnotesize LLM Cost Cut}\vspace{0.15cm}}}} &
{\centering\colorbox{accentLight}{\parbox{\linewidth}{\centering\vspace{0.15cm}{\large\bfseries\color{accent}3x}\\{\footnotesize Retrieval Throughput}\vspace{0.15cm}}}}
\end{tabularx}
\vspace{0.25cm}
\section{Summary}
{\small Software Engineer with 4+ years building distributed backend systems and AI-powered applications. Expert at driving measurable performance gains: 35\% latency cuts, 50\% cost reductions, and 3$\times$ throughput improvements.}
\section{Experience}
{\small\textbf{Software Developer --- NovaSystems Ltd.} \hfill {\color{accent}\textit{Apr 2024 -- Present}}}\\
{\footnotesize\textit{Python, C++, FastAPI, Kafka, Redis, PostgreSQL, MongoDB, Docker}}
\begin{itemize}[leftmargin=1.3em,topsep=0.1em,itemsep=0.05em,parsep=0em,label={\color{accent}\textbullet}]
\item {\small Architected 40+ FastAPI microservices for CyberRange Pro supporting 10,000+ concurrent users.}
\item {\small Kafka + Redis event-driven pipelines: 35\% latency reduction across distributed components.}
\item {\small SOC Intelligence Platform: SIEM/SOAR telemetry in air-gapped environments via Socket.IO.}
\item {\small JWT/OAuth2, RBAC, and IPAM for multi-tenant IP allocation and conflict resolution.}
\end{itemize}
{\small\textbf{AI Engineer --- DataBridge AI} \hfill {\color{accent}\textit{Nov 2023 -- Mar 2024}}}\\
{\footnotesize\textit{FastAPI, LangChain, FAISS, Redis, PyTorch}}
\begin{itemize}[leftmargin=1.3em,topsep=0.1em,itemsep=0.05em,parsep=0em,label={\color{accent}\textbullet}]
\item {\small Production RAG for legal, finance, and HR enterprise Q\&A.}
\item {\small 50\% LLM cost cut + 40\% latency improvement; 5,000+ daily active queries.}
\item {\small 3$\times$ throughput via chunking/embedding optimisation; 30\% API cost reduction.}
\end{itemize}
\section{Projects}
\textbf{FinBot} \hfill {\footnotesize FastAPI, LangChain, FAISS, Redis} \\ {\small 35\% semantic retrieval gain $\cdot$ 50\% LLM cost cut via Redis $\cdot$ sub-second P95 responses}\\
\textbf{DocFlow} \hfill {\footnotesize FastAPI, PyTorch, PostgreSQL, MinIO} \\ {\small 10K+ doc corpus $\cdot$ sub-200ms retrieval $\cdot$ +28\% top-3 precision via cross-encoder reranking}
\section{Skills}
{\small\textbf{Languages:} C++, Python, JS \quad\textbf{Backend:} FastAPI, Django, AsyncIO, Celery \quad\textbf{Infra:} Docker, Kafka, Redis}\\
{\small\textbf{AI/ML:} RAG, LangChain, FAISS, PyTorch \quad\textbf{Data:} PostgreSQL, MongoDB, OpenSearch \quad\textbf{Security:} JWT, OAuth2}
\section{Education}
{\small\textbf{B.Tech, Computer Science \& Engineering} --- Greenfield Institute of Technology \hfill \textit{2020 -- 2024}}
\end{document}`,

  // ── 7. DevOps / SRE — dark header box, cyan accent, monospace ────────────────
  "devops-infra": String.raw`\documentclass[10.5pt, letterpaper]{article}
\usepackage[top=0cm,bottom=0.8cm,left=0cm,right=0cm]{geometry}
\usepackage{titlesec}\usepackage{enumitem}\usepackage{xcolor}\usepackage{changepage}
\usepackage[colorlinks=true,urlcolor=cyan]{hyperref}\usepackage{lmodern}\usepackage[T1]{fontenc}
\definecolor{darkbg}{RGB}{2,6,23}\definecolor{cyanbg}{RGB}{8,145,178}\definecolor{cyantext}{RGB}{103,232,249}
\pagestyle{empty}\setlength{\parindent}{0pt}\renewcommand{\familydefault}{\ttdefault}
\titleformat{\section}{\bfseries\small\color{cyanbg}}{}{0pt}{}[{\color{cyanbg}\titlerule[0.5pt]}]
\titlespacing{\section}{0pt}{0.5em}{0.25em}
\begin{document}
% Dark terminal-style header
{\color{white}\pagecolor{darkbg}
\begin{adjustwidth}{0.8cm}{0.8cm}
\vspace{0.5cm}
{\color{cyantext}\fontsize{8pt}{8pt}\selectfont\texttt{\$ whoami}}\\[0.05cm]
{\fontsize{20pt}{20pt}\selectfont\bfseries\color{white} Alex Johnson}\\[0.1cm]
{\small\color{cyantext} DevOps | SRE | Backend Systems | AI Infrastructure}\\[0.1cm]
{\footnotesize\color{gray}
\href{mailto:alex@example.com}{alex@example.com} \enspace|\enspace
+1 (555) 123-4567 \enspace|\enspace
\href{https://linkedin.com/in/abcd}{LinkedIn} \enspace|\enspace
\href{https://github.com/abcd}{GitHub} \enspace|\enspace San Francisco, CA}
\vspace{0.4cm}
\end{adjustwidth}
}
\nopagecolor
\begin{adjustwidth}{0.8cm}{0.8cm}
\vspace{0.3cm}
\section{SUMMARY}
{\small\rmfamily Software Engineer with 4+ years building distributed infrastructure, AI pipelines, and cloud-native systems. Expert in Python, C++, Kafka, Docker, and Redis. Track record of 35\%+ latency reductions and 50\%+ cost savings at production scale.}
\vspace{0.1cm}
\section{EXPERIENCE}
{\small\textbf{Software Developer --- NovaSystems Ltd.} \hfill {\color{cyanbg}\textit{Apr 2024 -- Present}}}\\
{\footnotesize\color{cyanbg}\textit{[Python] [C++] [FastAPI] [Kafka] [Redis] [PostgreSQL] [MongoDB] [Docker] [Socket.IO]}}
\begin{itemize}[leftmargin=1.2em,topsep=0.1em,itemsep=0.05em,parsep=0em,label={\color{cyanbg}>}]
\item {\small\rmfamily Architected 40+ FastAPI microservices for CyberRange Pro; 10,000+ concurrent users.}
\item {\small\rmfamily Kafka + Redis event pipelines: 35\% inter-service latency reduction.}
\item {\small\rmfamily SOC Intelligence Platform for air-gapped SIEM/SOAR environments.}
\item {\small\rmfamily JWT/OAuth2, RBAC, and IPAM for automated subnet management.}
\end{itemize}
{\small\textbf{AI Engineer --- DataBridge AI} \hfill {\color{cyanbg}\textit{Nov 2023 -- Mar 2024}}}\\
{\footnotesize\color{cyanbg}\textit{[FastAPI] [LangChain] [FAISS] [Redis] [PostgreSQL] [PyTorch]}}
\begin{itemize}[leftmargin=1.2em,topsep=0.1em,itemsep=0.05em,parsep=0em,label={\color{cyanbg}>}]
\item {\small\rmfamily Production RAG for enterprise Q\&A; legal, finance, and HR.}
\item {\small\rmfamily 50\% LLM cost cut + 40\% latency improvement via FAISS + Redis.}
\item {\small\rmfamily 3$\times$ retrieval throughput through chunking/embedding optimisation.}
\end{itemize}
\vspace{0.1cm}
\section{PROJECTS}
{\small\textbf{FinBot} \hfill {\footnotesize\color{cyanbg}[FastAPI] [FAISS] [Redis] [LangChain]}}\\
{\small\rmfamily 35\% semantic retrieval gain $\cdot$ 50\% LLM cost cut $\cdot$ sub-second P95 at 1K concurrent users}
\vspace{0.1em}\\
{\small\textbf{DocFlow} \hfill {\footnotesize\color{cyanbg}[FastAPI] [PyTorch] [PostgreSQL] [MinIO]}}\\
{\small\rmfamily 10K+ doc corpus $\cdot$ sub-200ms retrieval $\cdot$ +28\% top-3 precision via reranking}
\vspace{0.1cm}
\section{SKILLS}
{\small\rmfamily\textbf{Languages:} C++, Python, Bash, JS \quad\textbf{Infra:} Docker, Kubernetes, Kafka, Redis, Linux, Git}\\
{\small\rmfamily\textbf{Backend:} FastAPI, gRPC, AsyncIO \quad\textbf{AI/ML:} RAG, FAISS, LangChain, PyTorch}\\
{\small\rmfamily\textbf{Data:} PostgreSQL, MongoDB, OpenSearch \quad\textbf{Security:} JWT, OAuth2, RBAC, SOC-2}
\vspace{0.1cm}
\section{EDUCATION}
{\small\rmfamily\textbf{B.Tech, CS\&E} --- Greenfield Institute of Technology \hfill \textit{2020 -- 2024}}
\end{adjustwidth}
\end{document}`,

  // ── 8. Career Pivot — orange left-border accent, skills-first ────────────────
  "career-change": String.raw`\documentclass[10.5pt, letterpaper]{article}
\usepackage[top=1.1cm,bottom=0.9cm,left=1.2cm,right=1.1cm]{geometry}
\usepackage{titlesec}\usepackage{enumitem}\usepackage{xcolor}\usepackage{tabularx}
\usepackage[colorlinks=true,urlcolor=accent]{hyperref}\usepackage{lmodern}
\definecolor{accent}{RGB}{194,65,12}
\pagestyle{empty}\setlength{\parindent}{0pt}\renewcommand{\familydefault}{\sfdefault}
\titleformat{\section}{\bfseries\normalsize\color{accent}}{}{0pt}{}[{\color{accent}\titlerule[0.7pt]}]
\titlespacing{\section}{0pt}{0.5em}{0.2em}
\newcommand{\sideaccent}{{\color{accent}\vrule width 3pt}\hspace{0.4em}}
\begin{document}
{\fontsize{24pt}{24pt}\selectfont\bfseries Alex Johnson}\\[0.1cm]
{\small\href{mailto:alex@example.com}{alex@example.com} \enspace|\enspace +1 (555) 123-4567 \enspace|\enspace \href{https://linkedin.com/in/abcd}{LinkedIn} \enspace|\enspace \href{https://github.com/abcd}{GitHub} \enspace|\enspace San Francisco, CA}\\
{\color{accent}\rule{\linewidth}{1pt}}
\vspace{0.15cm}
\section{Summary}
{\small Career-focused Software Engineer with 4+ years building distributed systems and AI-powered backends. Rapidly adapted expertise to ML engineering, reducing LLM costs 50\% and latency 40\%. Strong portfolio of shipped production systems across cybersecurity, finance, and enterprise AI.}
\vspace{0.1cm}
\section{Core Skills}
\begin{tabularx}{\linewidth}{XXX}
{\footnotesize\textbf{\color{accent} Backend Dev}\newline FastAPI, Django, AsyncIO\newline REST APIs, gRPC, Celery} &
{\footnotesize\textbf{\color{accent} AI / ML Eng}\newline RAG, LangChain, FAISS\newline Transformers, PyTorch} &
{\footnotesize\textbf{\color{accent} Infrastructure}\newline Docker, Kafka, Redis\newline PostgreSQL, MongoDB}
\end{tabularx}
\vspace{0.15cm}
\section{Projects}
\sideaccent\textbf{FinBot} --- RAG Financial Q\&A \hfill {\footnotesize FastAPI, LangChain, FAISS, Redis}
\begin{itemize}[leftmargin=1.5em,topsep=0.05em,itemsep=0.05em,parsep=0em,label=$\circ$]
\item {\small 35\% semantic retrieval improvement over keyword baselines using FAISS + transformers.}
\item {\small 50\% LLM cost reduction via Redis caching; sub-second P95 at 1,000 concurrent users.}
\end{itemize}
\sideaccent\textbf{DocFlow} --- Document Processing Pipeline \hfill {\footnotesize FastAPI, PyTorch, MinIO}
\begin{itemize}[leftmargin=1.5em,topsep=0.05em,itemsep=0.05em,parsep=0em,label=$\circ$]
\item {\small Multi-format ingestion (PDF, DOCX, HTML) for 10,000+ doc corpus; sub-200ms retrieval.}
\item {\small +28\% top-3 retrieval precision via cross-encoder reranking over vanilla FAISS.}
\end{itemize}
\vspace{0.1cm}
\section{Experience}
\sideaccent\textbf{Software Developer --- NovaSystems Ltd.} \hfill {\color{accent}\textit{Apr 2024 -- Present}}\\
{\footnotesize\textit{Python, C++, FastAPI, Kafka, Redis, PostgreSQL, MongoDB, Docker}}
\begin{itemize}[leftmargin=1.5em,topsep=0.1em,itemsep=0.05em,parsep=0em,label=$\circ$]
\item {\small Architected 40+ FastAPI microservices for CyberRange Pro; 10,000+ concurrent users.}
\item {\small Kafka + Redis pipelines reducing cross-service latency by 35\%.}
\item {\small SOC Intelligence Platform for SIEM/SOAR telemetry in air-gapped environments.}
\item {\small JWT/OAuth2, RBAC, and IPAM across multi-tenant deployments.}
\end{itemize}
\sideaccent\textbf{AI Engineer --- DataBridge AI} \hfill {\color{accent}\textit{Nov 2023 -- Mar 2024}}\\
{\footnotesize\textit{FastAPI, LangChain, FAISS, Redis, PostgreSQL, PyTorch}}
\begin{itemize}[leftmargin=1.5em,topsep=0.1em,itemsep=0.05em,parsep=0em,label=$\circ$]
\item {\small Production RAG for enterprise Q\&A across legal, finance, and HR domains.}
\item {\small 50\% LLM cost cut + 40\% latency gain; 3$\times$ retrieval throughput improvement.}
\end{itemize}
\vspace{0.1cm}
\section{Education}
{\small\textbf{B.Tech, Computer Science \& Engineering} --- Greenfield Institute of Technology \hfill \textit{2020 -- 2024}}
\end{document}`,

}; // end TEMPLATE_SAMPLES




export default function BuilderPage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId") ?? "modern-tech";
  const { resumeText } = useAnalysisStore();
  const [editorMode, setEditorMode] = useState<EditorMode>("latex");
  const [visualData, setVisualData] = useState<VisualResume>(SAMPLE_VISUAL_DATA);
  // Load template-specific sample on first open
  const [latexCode, setLatexCode] = useState(
    () => TEMPLATE_SAMPLES[templateId] ?? TEMPLATE_SAMPLES["modern-tech"]
  );

  // visualDirty tracks whether the user has edited any visual field.
  // Until they do, the template-specific SAMPLE stays visible even if
  // the effect fires (e.g. on Strict Mode double-invoke).
  const visualDirty = useRef(false);

  /** Marks the visual form as edited and updates the data. */
  function updateVisual(patch: Partial<VisualResume>) {
    visualDirty.current = true;
    setVisualData((prev) => ({ ...prev, ...patch }));
  }

  useEffect(() => {
    if (resumeText?.trim()) {
      const condensed = resumeText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 18);
      // resumeText injection also counts as a user edit
      visualDirty.current = true;
      setVisualData((prev) => ({
        ...prev,
        summary: condensed.slice(0, 2).join(" "),
        experienceBullets: condensed.slice(2, 8).join("\n"),
      }));
    }
  }, [resumeText]);

  // Regenerate LaTeX from visual fields whenever the user has made an edit.
  // Works regardless of which tab is currently shown, so switching back to
  // the LaTeX tab always reflects the latest visual state.
  useEffect(() => {
    if (!visualDirty.current) return;
    const latex = latexTemplateFromVisual(templateId, visualData);
    setLatexCode(latex);
  }, [templateId, visualData]);

  const [dlLoading, setDlLoading] = useState<"pdf" | "docx" | null>(null);

  const handleBuilderPDF = async () => {
    setDlLoading("pdf");
    try { await downloadPDF(latexCode, `resume-${templateId}.pdf`); }
    catch { alert("PDF generation failed. Make sure you are logged in."); }
    finally { setDlLoading(null); }
  };

  const handleBuilderDOCX = async () => {
    setDlLoading("docx");
    try {
      // Build plain text from visual fields for DOCX
      const text = [
        visualData.name,
        visualData.contact,
        "",
        "SUMMARY",
        visualData.summary,
        "",
        "EXPERIENCE",
        visualData.experienceTitle,
        ...visualData.experienceBullets.split("\n").map(b => `• ${b}`),
        "",
        "SKILLS",
        visualData.skills,
        "",
        "EDUCATION",
        visualData.education,
      ].join("\n");
      await downloadDOCX(text, `resume-${templateId}.docx`);
    } catch { alert("DOCX generation failed."); }
    finally { setDlLoading(null); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-surface-950">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-surface-950/50 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/templates" className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="h-6 w-px bg-white/10" />
          <h1 className="font-semibold text-white flex items-center gap-2">
            <Layout size={16} className="text-brand-400" />
            Overleaf-Style Resume Builder
          </h1>
          <span className="text-xs bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2 py-0.5 rounded ml-2">
            Template: {templateId}
          </span>
        </div>
        {/* Download buttons */}
        <div className="flex items-center gap-2">
          <button
            id="builder-download-pdf"
            onClick={handleBuilderPDF}
            disabled={!!dlLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-500/20 border border-brand-500/30 text-brand-300 hover:bg-brand-500/30 transition-colors disabled:opacity-50"
          >
            {dlLoading === "pdf" ? <Loader2 size={12} className="animate-spin" /> : <FileDown size={12} />}
            PDF
          </button>
          <button
            id="builder-download-docx"
            onClick={handleBuilderDOCX}
            disabled={!!dlLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {dlLoading === "docx" ? <Loader2 size={12} className="animate-spin" /> : <FileDown size={12} />}
            DOCX
          </button>
        </div>
      </div>

      {/* Split Pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor (Left) */}
        <div className="w-1/2 flex flex-col border-r border-white/10 bg-surface-900 overflow-hidden">
          <div className="px-4 py-2 border-b border-white/5 bg-surface-950/50 flex justify-between items-center shrink-0 gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditorMode("latex")}
                className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${editorMode === "latex"
                  ? "bg-brand-500/20 text-brand-300 border-brand-500/40"
                  : "bg-transparent text-slate-400 border-white/10"
                  }`}
              >
                <span className="inline-flex items-center gap-1"><Code2 size={13} /> LaTeX</span>
              </button>
              <button
                onClick={() => setEditorMode("visual")}
                className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${editorMode === "visual"
                  ? "bg-brand-500/20 text-brand-300 border-brand-500/40"
                  : "bg-transparent text-slate-400 border-white/10"
                  }`}
              >
                <span className="inline-flex items-center gap-1"><SlidersHorizontal size={13} /> Visual</span>
              </button>
            </div>
            <span className="text-xs text-slate-500">Template-aware editing</span>
          </div>
          {editorMode === "latex" ? (
            <textarea
              className="flex-1 w-full bg-transparent p-6 text-sm text-slate-200 font-mono resize-none focus:outline-none leading-relaxed"
              value={latexCode}
              onChange={(e) => setLatexCode(e.target.value)}
              spellCheck={false}
              placeholder="Write LaTeX resume code here..."
            />
          ) : (
            <div className="flex-1 overflow-auto p-5 space-y-4">
              <div>
                <label htmlFor="vf-name" className="text-xs text-slate-400 mb-1 block">Full Name</label>
                <input id="vf-name" className="input py-2.5" value={visualData.name}
                  onChange={(e) => updateVisual({ name: e.target.value })} />
              </div>
              <div>
                <label htmlFor="vf-contact" className="text-xs text-slate-400 mb-1 block">Contact</label>
                <input id="vf-contact" className="input py-2.5" value={visualData.contact}
                  onChange={(e) => updateVisual({ contact: e.target.value })} />
              </div>
              <div>
                <label htmlFor="vf-summary" className="text-xs text-slate-400 mb-1 block">Summary</label>
                <textarea id="vf-summary" className="input min-h-24" value={visualData.summary}
                  onChange={(e) => updateVisual({ summary: e.target.value })} />
              </div>
              <div>
                <label htmlFor="vf-skills" className="text-xs text-slate-400 mb-1 block">Skills (comma-separated)</label>
                <input id="vf-skills" className="input py-2.5" value={visualData.skills}
                  onChange={(e) => updateVisual({ skills: e.target.value })} />
              </div>
              <div>
                <label htmlFor="vf-exp-title" className="text-xs text-slate-400 mb-1 block">Experience Header</label>
                <input id="vf-exp-title" className="input py-2.5" value={visualData.experienceTitle}
                  onChange={(e) => updateVisual({ experienceTitle: e.target.value })} />
              </div>
              <div>
                <label htmlFor="vf-exp-bullets" className="text-xs text-slate-400 mb-1 block">Experience Bullets (one per line)</label>
                <textarea id="vf-exp-bullets" className="input min-h-28" value={visualData.experienceBullets}
                  onChange={(e) => updateVisual({ experienceBullets: e.target.value })} />
              </div>
              <div>
                <label htmlFor="vf-education" className="text-xs text-slate-400 mb-1 block">Education</label>
                <input id="vf-education" className="input py-2.5" value={visualData.education}
                  onChange={(e) => updateVisual({ education: e.target.value })} />
              </div>
            </div>
          )}
        </div>

        {/* Live PDF Preview (Right) */}
        <div className="w-1/2 bg-slate-800 flex flex-col relative overflow-hidden">
          <PDFPreview content={latexCode} templateId={templateId} />
        </div>
      </div>
    </div>
  );
}
