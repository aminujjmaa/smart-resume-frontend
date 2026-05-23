"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, Loader2, AlertCircle, ChevronRight, CheckCircle, Search, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useAnalysisStore } from "@/store/useAppStore";
import ResumePreview from "@/components/resume/ResumePreview";

type InputMode = "file" | "text";

export default function UploadPage() {
  const router = useRouter();
  const [mode, setMode] = useState<InputMode>("file");
  const [file, setFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState("");
  const { resumeText, setResumeText, setResumeFile, setJobDescription } = useAnalysisStore();
  const { submitAnalysis, step, error } = useAnalysis();

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      setFile(accepted[0]);
      setResumeFile(accepted[0]);
    }
  }, [setResumeFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"], "text/plain": [".txt"] },
    maxFiles: 1,
  });

  const isLoading = ["uploading", "parsing", "analyzing", "scoring"].includes(step);

  const steps = [
    { key: "uploading", label: "Uploading file..." },
    { key: "parsing",   label: "Parsing resume content..." },
    { key: "analyzing", label: "AI is analyzing your resume..." },
    { key: "scoring",   label: "Calculating ATS score..." },
  ];
  const currentStepIdx = steps.findIndex((s) => s.key === step);
  const hasResumeInput = Boolean(file || resumeText.trim());

  const handleSubmit = async () => {
    const fd = new FormData();
    if (jobDesc.trim()) {
      fd.append("job_description", jobDesc);
    }
    if (mode === "file" && file) {
      fd.append("resume_file", file);
    } else if (mode === "text" && resumeText.trim()) {
      fd.append("resume_text", resumeText);
    }
    await submitAnalysis(fd);
  };

  const handleInterviewPrepRedirect = () => {
    if (mode === "file" && file) {
      setResumeFile(file);
    } else if (mode === "text" && resumeText.trim()) {
      setResumeText(resumeText);
      setResumeFile(null);
    }
    setJobDescription(jobDesc);
    router.push("/dashboard/interview-prep?auto=1");
  };

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[80vh] animate-fade-in">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <Loader2 size={28} className="text-brand-400 animate-spin" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">Analyzing Your Resume</h2>
            <p className="text-slate-400 text-sm">Our AI is working. This takes about 15 seconds.</p>
          </div>

          <div className="space-y-3">
            {steps.map((s, i) => {
              const state = i < currentStepIdx ? "complete" : i === currentStepIdx ? "active" : "pending";
              return (
                <div key={s.key} className={`step-indicator ${state}`}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border text-xs font-bold transition-all duration-500">
                    {state === "complete" ? "✓" : i + 1}
                  </div>
                  <span className="text-sm font-medium">{s.label}</span>
                  {state === "active" && <Loader2 size={14} className="animate-spin ml-auto" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4 animate-fade-in md:p-8">
      <div className="mb-8 grid gap-6 md:grid-cols-[1fr_340px] md:items-end">
        <div>
          <span className="mb-4 inline-flex items-center gap-2 rounded-lg border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-xs font-semibold text-teal-200">
            <Search size={14} />
            ATS resume scanner
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight text-white">Analyze Your Resume</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">
            Upload your resume, add the target job description, and get a focused report with score, keyword gaps, formatting risks, and rewrite suggestions.
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
          <div className="flex items-start gap-3">
            <Shield size={18} className="mt-0.5 text-teal-300" />
            <div>
              <p className="text-sm font-semibold text-white">Private analysis workspace</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Your original document preview stays available while the report is generated.
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 animate-fade-in">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5 md:p-6">
          <div className="mb-6 flex w-fit gap-1 rounded-lg border border-white/10 bg-slate-950/70 p-1">
            {(["file", "text"] as InputMode[]).map((m) => (
              <button
                key={m}
                id={`upload-mode-${m}`}
                onClick={() => {
                  setMode(m);
                  if (m === "text") {
                    setFile(null);
                    setResumeFile(null);
                  }
                }}
                className={`rounded-lg px-5 py-2 text-sm font-medium transition-all duration-200 ${
                  mode === m ? "bg-teal-400/20 text-teal-100" : "text-slate-400 hover:text-white"
                }`}
              >
                {m === "file" ? "Upload File" : "Paste Text"}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {mode === "file" ? (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300">Resume File</label>
                {file ? (
                  <div className="flex items-center gap-4 rounded-lg border border-teal-300/20 bg-teal-300/10 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-teal-300/20 bg-slate-950">
                      <FileText size={18} className="text-teal-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button onClick={() => { setFile(null); setResumeFile(null); }} className="text-slate-500 transition-colors hover:text-red-400" aria-label="Remove resume file">
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
                    <input {...getInputProps()} id="resume-file-input" />
                    <Upload size={32} className="mx-auto mb-3 text-teal-300" />
                    <p className="mb-1 font-medium text-white">
                      {isDragActive ? "Drop it here" : "Drag and drop your resume"}
                    </p>
                    <p className="text-sm text-slate-500">or <span className="cursor-pointer text-teal-300">browse files</span></p>
                    <p className="mt-3 text-xs text-slate-600">PDF, DOCX, or TXT. Max 5MB.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300">Resume Text</label>
                <textarea
                  id="resume-text-input"
                  className="input min-h-56 resize-y"
                  placeholder="Paste your full resume text here..."
                  value={resumeText}
                  onChange={(e) => {
                    setResumeFile(null);
                    setResumeText(e.target.value);
                  }}
                />
              </div>
            )}

            <div>
              <label className="mb-3 block text-sm font-medium text-slate-300">
                Job Description <span className="font-normal text-slate-500">(Optional, recommended)</span>
              </label>
              <textarea
                id="job-description-input"
                className="input min-h-48 resize-y"
                placeholder="Paste the full job description here..."
                value={jobDesc}
                onChange={(e) => {
                  setJobDesc(e.target.value);
                  setJobDescription(e.target.value);
                }}
              />
              <p className="mt-2 text-xs text-slate-600">A complete job description makes keyword and role-alignment scoring more accurate.</p>
            </div>

            <button
              id="analyze-submit-btn"
              onClick={handleSubmit}
              disabled={!hasResumeInput}
              className="btn-primary w-full justify-center py-4 text-base disabled:cursor-not-allowed disabled:opacity-40"
            >
              Analyze My Resume
              <ChevronRight size={18} />
            </button>

            <button
              onClick={handleInterviewPrepRedirect}
              disabled={!hasResumeInput}
              className="btn-secondary w-full justify-center py-3 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Predict Interview Questions (Trending + High Chance)
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-8 lg:self-start">
          {hasResumeInput ? (
            <ResumePreview file={file} text={mode === "text" ? resumeText : ""} />
          ) : (
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-teal-300/20 bg-teal-300/10">
                <FileText size={20} className="text-teal-300" />
              </div>
              <h2 className="font-display text-xl font-semibold text-white">Resume preview</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Upload a file or paste text to preview the resume before running the analysis.
              </p>
            </div>
          )}

          <div className="rounded-lg border border-white/10 bg-[#08101c] p-5">
            <h2 className="font-display text-lg font-semibold text-white">Your report will include</h2>
            <div className="mt-4 space-y-3">
              {[
                "ATS score with category breakdown",
                "Matched and missing job keywords",
                "Formatting and parsing risk checks",
                "Priority fixes and bullet rewrites",
                "Predicted interview questions (trending + high-likelihood)",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle size={16} className="mt-0.5 shrink-0 text-emerald-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
