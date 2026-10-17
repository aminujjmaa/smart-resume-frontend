"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AlertCircle, CheckCircle, ChevronRight, FileText, Loader2, Upload, X } from "lucide-react";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useAnalysisStore } from "@/store/useAppStore";
import ResumePreview from "@/components/resume/ResumePreview";

type InputMode = "file" | "text";
type StepState = "complete" | "active" | "pending";
type DropzoneRootGetter = ReturnType<typeof useDropzone>["getRootProps"];
type DropzoneInputGetter = ReturnType<typeof useDropzone>["getInputProps"];

const ANALYSIS_STEPS = [
  { key: "uploading", label: "Uploading your resume" },
  { key: "parsing", label: "Reading sections and bullets" },
  { key: "analyzing", label: "Running ATS checks and keyword matching" },
  { key: "scoring", label: "Writing your fixes" },
];

const REPORT_ITEMS = [
  "ATS score with keyword, impact and formatting breakdown",
  "Missing keywords quoted from the job description",
  "Formatting risks that trip up applicant tracking systems",
  "Your top 3 fixes and suggested bullet rewrites",
];

export interface ScanRole {
  /** Display name, e.g. "Data Analyst". */
  name: string;
  /** Used as the comparison target when the user doesn't paste a job description. */
  requirements: string;
}

interface ScanFormProps {
  /** Prefix for element ids so several pages can keep stable, unique ids. */
  readonly idPrefix: string;
  readonly role?: ScanRole;
}

function getStepState(index: number, currentIndex: number): StepState {
  if (index < currentIndex) return "complete";
  if (index === currentIndex) return "active";
  return "pending";
}

function LoadingView({ currentStepIdx }: Readonly<{ currentStepIdx: number }>) {
  return (
    <div className="mx-auto w-full max-w-md py-12 animate-fade-in" aria-live="polite">
      <div className="text-center mb-10">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
          <Loader2 size={28} className="text-brand-400 animate-spin" />
        </div>
        <h2 className="font-display text-2xl font-bold text-white mb-2">Scoring your resume</h2>
        <p className="text-slate-400 text-sm">This usually takes 10–30 seconds.</p>
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

function ModeToggle({ idPrefix, mode, onModeChange }: Readonly<{ idPrefix: string; mode: InputMode; onModeChange: (mode: InputMode) => void }>) {
  return (
    <div className="mb-6 flex w-fit gap-1 rounded-lg border border-white/10 bg-slate-950/70 p-1" role="tablist">
      {(["file", "text"] as InputMode[]).map((nextMode) => (
        <button
          key={nextMode}
          id={`${idPrefix}-mode-${nextMode}`}
          type="button"
          role="tab"
          aria-selected={mode === nextMode}
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
  idPrefix,
  file,
  getInputProps,
  getRootProps,
  isDragActive,
  onFileClear,
}: Readonly<{
  idPrefix: string;
  file: File | null;
  getInputProps: DropzoneInputGetter;
  getRootProps: DropzoneRootGetter;
  isDragActive: boolean;
  onFileClear: () => void;
}>) {
  if (file) {
    return (
      <div className="space-y-4">
        <p className="block text-sm font-medium text-slate-300">Resume File</p>
        <div className="flex items-center gap-4 rounded-lg border border-teal-300/20 bg-teal-300/10 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-teal-300/20 bg-slate-950">
            <FileText size={18} className="text-teal-300" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{file.name}</p>
            <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB</p>
          </div>
          <button type="button" onClick={onFileClear} className="text-slate-500 transition-colors hover:text-red-400" aria-label="Remove resume file">
            <X size={18} />
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <label htmlFor={`${idPrefix}-resume-file-input`} className="block text-sm font-medium text-slate-300">
        Resume File
      </label>
      <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
        <input {...getInputProps()} id={`${idPrefix}-resume-file-input`} />
        <Upload size={32} className="mx-auto mb-3 text-teal-300" />
        <p className="mb-1 font-medium text-white">{isDragActive ? "Drop it here" : "Drag and drop your resume"}</p>
        <p className="text-sm text-slate-500">
          or <span className="cursor-pointer text-teal-300">browse files</span>
        </p>
        <p className="mt-3 text-xs text-slate-600">PDF, DOCX or TXT · max 5 MB</p>
      </div>
    </div>
  );
}

function PreviewPanel({
  file,
  hasResumeInput,
  mode,
  resumeText,
  role,
}: Readonly<{ file: File | null; hasResumeInput: boolean; mode: InputMode; resumeText: string; role?: ScanRole }>) {
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
          <p className="mt-2 text-sm leading-6 text-slate-400">Upload a file or paste text to preview it before the scan runs.</p>
        </div>
      )}
      <div className="rounded-lg border border-white/10 bg-[#08101c] p-5">
        <h2 className="font-display text-lg font-semibold text-white">
          {role ? `Your ${role.name} report includes` : "Your free report includes"}
        </h2>
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

/** Resume upload/paste + optional job description → starts a scan. Shared by /scan and role pages. */
export default function ScanForm({ idPrefix, role }: ScanFormProps) {
  const [mode, setMode] = useState<InputMode>("file");
  const [file, setFile] = useState<File | null>(null);
  const { resumeText, setResumeText, setResumeFile, jobDescription, setJobDescription } = useAnalysisStore();
  const { submitAnalysis, step, error } = useAnalysis();

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) {
        setFile(accepted[0]);
        setResumeFile(accepted[0]);
      }
    },
    [setResumeFile]
  );

  const clearFile = useCallback(() => {
    setFile(null);
    setResumeFile(null);
  }, [setResumeFile]);

  const handleModeChange = useCallback(
    (nextMode: InputMode) => {
      setMode(nextMode);
      if (nextMode === "text") clearFile();
    },
    [clearFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
  });

  const isLoading = ANALYSIS_STEPS.some((s) => s.key === step);
  const currentStepIdx = ANALYSIS_STEPS.findIndex((s) => s.key === step);
  const hasResumeInput = Boolean(file || resumeText.trim());

  const handleSubmit = async () => {
    const fd = new FormData();
    const jd = jobDescription.trim() || role?.requirements || "";
    if (jd) fd.append("job_description", jd);
    if (mode === "file" && file) {
      fd.append("resume_file", file);
    } else if (mode === "text" && resumeText.trim()) {
      fd.append("resume_text", resumeText);
    }
    await submitAnalysis(fd);
  };

  if (isLoading) return <LoadingView currentStepIdx={currentStepIdx} />;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5 md:p-6">
        {error && (
          <div role="alert" className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-fade-in">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        <ModeToggle idPrefix={idPrefix} mode={mode} onModeChange={handleModeChange} />

        <div className="space-y-6">
          {mode === "file" ? (
            <FileResumeInput
              idPrefix={idPrefix}
              file={file}
              getInputProps={getInputProps}
              getRootProps={getRootProps}
              isDragActive={isDragActive}
              onFileClear={clearFile}
            />
          ) : (
            <div className="space-y-4">
              <label htmlFor={`${idPrefix}-resume-text-input`} className="block text-sm font-medium text-slate-300">
                Resume Text
              </label>
              <textarea
                id={`${idPrefix}-resume-text-input`}
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
            <label htmlFor={`${idPrefix}-job-description-input`} className="mb-3 block text-sm font-medium text-slate-300">
              Job Description <span className="font-normal text-slate-500">(optional, recommended)</span>
            </label>
            <textarea
              id={`${idPrefix}-job-description-input`}
              className="input min-h-48 resize-y"
              placeholder={
                role
                  ? `Paste a ${role.name} job description from Naukri, LinkedIn or a company site...`
                  : "Paste the full job description here..."
              }
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <p className="mt-2 text-xs text-slate-500">
              {role
                ? `No job description handy? We'll compare your resume against common ${role.name} requirements.`
                : "A job description makes keyword matching much more accurate."}
            </p>
          </div>

          <button
            id={`${idPrefix}-submit-btn`}
            type="button"
            onClick={handleSubmit}
            disabled={!hasResumeInput}
            className="btn-primary w-full justify-center py-4 text-base disabled:cursor-not-allowed disabled:opacity-40"
          >
            Get My Free ATS Score
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <PreviewPanel file={file} hasResumeInput={hasResumeInput} mode={mode} resumeText={resumeText} role={role} />
    </div>
  );
}
