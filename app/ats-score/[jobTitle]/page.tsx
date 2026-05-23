"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  FileText,
  Loader2,
  Search,
  Shield,
  Upload,
  X,
} from "lucide-react";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useAnalysisStore } from "@/store/useAppStore";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ResumePreview from "@/components/resume/ResumePreview";

type InputMode = "file" | "text";
type StepState = "complete" | "active" | "pending";
type DropzoneRootGetter = ReturnType<typeof useDropzone>["getRootProps"];
type DropzoneInputGetter = ReturnType<typeof useDropzone>["getInputProps"];

const ANALYSIS_STEPS = [
  { key: "uploading", label: "Uploading file..." },
  { key: "parsing", label: "Parsing resume content..." },
  { key: "analyzing", label: "AI is analyzing your resume..." },
  { key: "scoring", label: "Calculating ATS score..." },
];

const REPORT_ITEMS = [
  "ATS score with category breakdown",
  "Matched and missing job keywords",
  "Formatting and parsing risk checks",
  "Priority fixes and bullet rewrites",
];

function formatJobTitle(slug = "") {
  return decodeURIComponent(slug)
    .replaceAll("-", " ")
    .replaceAll(/\b\w/g, (letter) => letter.toUpperCase());
}

function getStepState(index: number, currentIndex: number): StepState {
  if (index < currentIndex) return "complete";
  if (index === currentIndex) return "active";
  return "pending";
}

function LoadingView({ currentStepIdx }: Readonly<{ currentStepIdx: number }>) {
  return (
    <div className="w-full max-w-md mt-12 animate-fade-in">
      <div className="text-center mb-10">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
          <Loader2 size={28} className="text-brand-400 animate-spin" />
        </div>
        <h2 className="font-display text-2xl font-bold text-white mb-2">Analyzing Your Resume</h2>
        <p className="text-slate-400 text-sm">Our AI is working. This takes about 15 seconds.</p>
      </div>

      <div className="space-y-3">
        {ANALYSIS_STEPS.map((step, index) => {
          const state = getStepState(index, currentStepIdx);
          return (
            <div key={step.key} className={`step-indicator ${state}`}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border text-xs font-bold transition-all duration-500">
                {state === "complete" ? "✓" : index + 1}
              </div>
              <span className="text-sm font-medium">{step.label}</span>
              {state === "active" && <Loader2 size={14} className="animate-spin ml-auto" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PageHeader({ jobTitle }: Readonly<{ jobTitle: string }>) {
  return (
    <div className="mb-8 grid gap-6 md:grid-cols-[1fr_340px] md:items-end">
      <div>
        <span className="mb-4 inline-flex items-center gap-2 rounded-lg border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-xs font-semibold text-teal-200">
          <Search size={14} />
          Role-specific ATS scanner
        </span>
        <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl capitalize">
          Free ATS Resume Scanner for {jobTitle}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
          Upload your resume, compare it against a {jobTitle} role, and see the keyword gaps, formatting risks, and rewrite opportunities before you apply.
        </p>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
        <div className="flex items-start gap-3">
          <Shield size={18} className="mt-0.5 text-teal-300" />
          <div>
            <p className="text-sm font-semibold text-white">Built for fast tailoring</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Add a full job description for a sharper role match report.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeToggle({
  mode,
  onModeChange,
}: Readonly<{
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
}>) {
  return (
    <div className="mb-6 flex w-fit gap-1 rounded-lg border border-white/10 bg-slate-950/70 p-1">
      {(["file", "text"] as InputMode[]).map((nextMode) => (
        <button
          key={nextMode}
          onClick={() => onModeChange(nextMode)}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition-all duration-200 ${
            mode === nextMode ? "bg-teal-400/20 text-teal-100" : "text-slate-400 hover:text-white"
          }`}
        >
          {nextMode === "file" ? "Upload File" : "Paste Text"}
        </button>
      ))}
    </div>
  );
}

function FileResumeInput({
  file,
  getInputProps,
  getRootProps,
  isDragActive,
  onFileClear,
}: Readonly<{
  file: File | null;
  getInputProps: DropzoneInputGetter;
  getRootProps: DropzoneRootGetter;
  isDragActive: boolean;
  onFileClear: () => void;
}>) {
  return (
    <div className="space-y-4">
      {file ? (
        <>
          <p className="block text-sm font-medium text-slate-300">Resume File</p>
          <div className="flex items-center gap-4 rounded-lg border border-teal-300/20 bg-teal-300/10 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-teal-300/20 bg-slate-950">
              <FileText size={18} className="text-teal-300" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
            <button
              onClick={onFileClear}
              className="text-slate-500 transition-colors hover:text-red-400"
              aria-label="Remove resume file"
            >
              <X size={18} />
            </button>
          </div>
        </>
      ) : (
        <>
          <label htmlFor="seo-resume-file-input" className="block text-sm font-medium text-slate-300">
            Resume File
          </label>
          <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
            <input {...getInputProps()} id="seo-resume-file-input" />
            <Upload size={32} className="mx-auto mb-3 text-teal-300" />
            <p className="mb-1 font-medium text-white">
              {isDragActive ? "Drop it here" : "Drag and drop your resume"}
            </p>
            <p className="text-sm text-slate-500">
              or <span className="cursor-pointer text-teal-300">browse files</span>
            </p>
            <p className="mt-3 text-xs text-slate-600">PDF, DOCX, or TXT. Max 5MB.</p>
          </div>
        </>
      )}
    </div>
  );
}

function TextResumeInput({
  resumeText,
  onResumeTextChange,
}: Readonly<{
  resumeText: string;
  onResumeTextChange: (value: string) => void;
}>) {
  return (
    <div className="space-y-4">
      <label htmlFor="seo-resume-text-input" className="block text-sm font-medium text-slate-300">
        Resume Text
      </label>
      <textarea
        id="seo-resume-text-input"
        className="input min-h-56 resize-y"
        placeholder="Paste your full resume text here..."
        value={resumeText}
        onChange={(event) => onResumeTextChange(event.target.value)}
      />
    </div>
  );
}

function ResumeInput(props: Readonly<{
  file: File | null;
  getInputProps: DropzoneInputGetter;
  getRootProps: DropzoneRootGetter;
  isDragActive: boolean;
  mode: InputMode;
  resumeText: string;
  onFileClear: () => void;
  onResumeTextChange: (value: string) => void;
}>) {
  if (props.mode === "file") {
    return (
      <FileResumeInput
        file={props.file}
        getInputProps={props.getInputProps}
        getRootProps={props.getRootProps}
        isDragActive={props.isDragActive}
        onFileClear={props.onFileClear}
      />
    );
  }

  return (
    <TextResumeInput
      resumeText={props.resumeText}
      onResumeTextChange={props.onResumeTextChange}
    />
  );
}

function InputPanel({
  error,
  file,
  getInputProps,
  getRootProps,
  hasResumeInput,
  isDragActive,
  jobDesc,
  mode,
  resumeText,
  onFileClear,
  onJobDescChange,
  onModeChange,
  onResumeTextChange,
  onSubmit,
}: Readonly<{
  error: string | null;
  file: File | null;
  getInputProps: DropzoneInputGetter;
  getRootProps: DropzoneRootGetter;
  hasResumeInput: boolean;
  isDragActive: boolean;
  jobDesc: string;
  mode: InputMode;
  resumeText: string;
  onFileClear: () => void;
  onJobDescChange: (value: string) => void;
  onModeChange: (mode: InputMode) => void;
  onResumeTextChange: (value: string) => void;
  onSubmit: () => void;
}>) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5 md:p-6">
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-fade-in">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      <ModeToggle mode={mode} onModeChange={onModeChange} />

      <div className="space-y-6">
        <ResumeInput
          file={file}
          getInputProps={getInputProps}
          getRootProps={getRootProps}
          isDragActive={isDragActive}
          mode={mode}
          resumeText={resumeText}
          onFileClear={onFileClear}
          onResumeTextChange={onResumeTextChange}
        />

        <div>
          <label htmlFor="seo-job-description-input" className="mb-3 block text-sm font-medium text-slate-300">
            Job Description <span className="font-normal text-slate-500">(Optional, recommended)</span>
          </label>
          <textarea
            id="seo-job-description-input"
            className="input min-h-48 resize-y"
            placeholder="Paste the full job description here..."
            value={jobDesc}
            onChange={(event) => onJobDescChange(event.target.value)}
          />
          <p className="mt-2 text-xs text-slate-600">A complete job description makes keyword and role-alignment scoring more accurate.</p>
        </div>

        <button
          onClick={onSubmit}
          disabled={!hasResumeInput}
          className="btn-primary w-full justify-center py-4 text-base disabled:cursor-not-allowed disabled:opacity-40"
        >
          Get My Free Score
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function PreviewPanel({
  file,
  hasResumeInput,
  jobTitle,
  mode,
  resumeText,
}: Readonly<{
  file: File | null;
  hasResumeInput: boolean;
  jobTitle: string;
  mode: InputMode;
  resumeText: string;
}>) {
  return (
    <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
      {hasResumeInput ? (
        <ResumePreview file={file} text={mode === "text" ? resumeText : ""} />
      ) : (
        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-teal-300/20 bg-teal-300/10">
            <FileText size={20} className="text-teal-300" />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Resume preview</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Upload a resume to preview the original document before the report runs.
          </p>
        </div>
      )}

      <div className="rounded-lg border border-white/10 bg-[#08101c] p-5">
        <h2 className="font-display text-lg font-semibold text-white">{jobTitle} report includes</h2>
        <div className="mt-4 space-y-3">
          {REPORT_ITEMS.map((item) => (
            <div key={item} className="flex items-start gap-3 text-sm text-slate-300">
              <CheckCircle size={16} className="mt-0.5 shrink-0 text-emerald-300" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default function SEOUploadPage() {
  const { jobTitle } = useParams<{ jobTitle: string }>();
  const decodedJobTitle = formatJobTitle(jobTitle);

  const [mode, setMode] = useState<InputMode>("file");
  const [file, setFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState("");
  const { resumeText, setResumeText, setResumeFile } = useAnalysisStore();
  const { submitAnalysis, step, error } = useAnalysis();

  useEffect(() => {
    if (decodedJobTitle) {
      setJobDesc((current) => current || `Job Title: ${decodedJobTitle}\n\n[Paste the full job description here...]`);
    }
  }, [decodedJobTitle]);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      setFile(accepted[0]);
      setResumeFile(accepted[0]);
    }
  }, [setResumeFile]);

  const handleFileClear = useCallback(() => {
    setFile(null);
    setResumeFile(null);
  }, [setResumeFile]);

  const handleModeChange = useCallback((nextMode: InputMode) => {
    setMode(nextMode);
    if (nextMode === "text") {
      handleFileClear();
    }
  }, [handleFileClear]);

  const handleResumeTextChange = useCallback((value: string) => {
    setResumeFile(null);
    setResumeText(value);
  }, [setResumeFile, setResumeText]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
  });

  const isLoading = ["uploading", "parsing", "analyzing", "scoring"].includes(step);
  const currentStepIdx = ANALYSIS_STEPS.findIndex((analysisStep) => analysisStep.key === step);
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

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center py-12 px-4">
        {isLoading ? (
          <LoadingView currentStepIdx={currentStepIdx} />
        ) : (
          <div className="w-full max-w-6xl animate-fade-in">
            <PageHeader jobTitle={decodedJobTitle} />

            <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
              <InputPanel
                error={error}
                file={file}
                getInputProps={getInputProps}
                getRootProps={getRootProps}
                hasResumeInput={hasResumeInput}
                isDragActive={isDragActive}
                jobDesc={jobDesc}
                mode={mode}
                resumeText={resumeText}
                onFileClear={handleFileClear}
                onJobDescChange={setJobDesc}
                onModeChange={handleModeChange}
                onResumeTextChange={handleResumeTextChange}
                onSubmit={handleSubmit}
              />
              <PreviewPanel
                file={file}
                hasResumeInput={hasResumeInput}
                jobTitle={decodedJobTitle}
                mode={mode}
                resumeText={resumeText}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
