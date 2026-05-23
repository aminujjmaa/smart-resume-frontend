"use client";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import { toolsApi } from "@/lib/api";
import { MessageSquare, AlertCircle, Upload, FileText, X } from "lucide-react";
import type { InterviewPrepResult, InterviewQuestion } from "@/types";
import { useDropzone } from "react-dropzone";
import { useAnalysisStore } from "@/store/useAppStore";
import { useSearchParams } from "next/navigation";

type ResumeInputMode = "text" | "file";

function inferTopics(question: { question: string; category: string }) {
  const text = `${question.category} ${question.question}`.toLowerCase();
  const topics = new Set<string>();
  if (text.includes("python")) topics.add("Python");
  if (/(sql|database|postgres|mysql|schema|index|query)/.test(text)) topics.add("Database");
  if (/(api|backend|fastapi|django|flask|microservice|rest)/.test(text)) topics.add("Backend/API");
  if (/(aws|docker|kubernetes|deploy|devops|cloud)/.test(text)) topics.add("Cloud/DevOps");
  if (/(behavioral|stakeholder|conflict|feedback|lead|ownership)/.test(text)) topics.add("Behavioral");
  if (/(system design|architecture|scal|latency|throughput)/.test(text)) topics.add("System Design");
  if (topics.size === 0) topics.add(question.category || "General");
  return Array.from(topics);
}

export default function InterviewPrepPage() {
  const searchParams = useSearchParams();
  const {
    resumeText: storedResumeText,
    resumeFile: storedResumeFile,
    jobDescription: storedJobDescription,
  } = useAnalysisStore();
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeMode, setResumeMode] = useState<ResumeInputMode>("text");
  const [jobDescription, setJobDescription] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InterviewPrepResult | null>(null);
  const [error, setError] = useState("");
  const [autoRequested, setAutoRequested] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("All");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setResumeFile(acceptedFiles[0]);
      setError("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
  });

  const handleGenerate = useCallback(async () => {
    const hasTextResume = resumeMode === "text" && resumeText.trim();
    const hasFileResume = resumeMode === "file" && resumeFile;
    if (!hasTextResume && !hasFileResume) {
      setError("Please add your resume text or upload a resume file.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res =
        resumeMode === "file" && resumeFile
          ? await (() => {
              const formData = new FormData();
              formData.append("resume_file", resumeFile);
              formData.append("job_description", jobDescription);
              if (roleTitle.trim()) formData.append("role_title", roleTitle);
              return toolsApi.generateInterviewPrepWithUpload(formData);
            })()
          : await toolsApi.generateInterviewPrep({
              resume_text: resumeText,
              ...(jobDescription.trim() ? { job_description: jobDescription } : {}),
              ...(roleTitle.trim() ? { role_title: roleTitle } : {}),
            });
      setResult(res.data);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { detail?: string } } };
      setError(apiError.response?.data?.detail || "Failed to generate interview prep.");
    } finally {
      setLoading(false);
    }
  }, [jobDescription, resumeFile, resumeMode, resumeText, roleTitle]);

  useEffect(() => {
    if (autoRequested || searchParams.get("auto") !== "1") return;

    setAutoRequested(true);
    if (!storedResumeText && !storedResumeFile) {
      return;
    }

    setJobDescription(storedJobDescription || "");
    if (storedResumeFile) {
      setResumeMode("file");
      setResumeFile(storedResumeFile);
    } else if (storedResumeText) {
      setResumeMode("text");
      setResumeText(storedResumeText);
    }
  }, [autoRequested, searchParams, storedJobDescription, storedResumeFile, storedResumeText]);

  useEffect(() => {
    if (!autoRequested || result || loading) return;
    if (!(resumeText.trim() || resumeFile)) return;
    void handleGenerate();
  }, [autoRequested, handleGenerate, loading, result, resumeFile, resumeText]);

  const handleShowMoreQuestions = useCallback(async () => {
    if (loadingMore || !result) return;
    setLoadingMore(true);
    setError("");
    try {
      const existingQuestions = result.questions.map((q) => q.question);
      const res =
        resumeMode === "file" && resumeFile
          ? await (() => {
              const formData = new FormData();
              formData.append("resume_file", resumeFile);
              if (jobDescription.trim()) formData.append("job_description", jobDescription);
              if (roleTitle.trim()) formData.append("role_title", roleTitle);
              formData.append("desired_count", "10");
              formData.append("exclude_questions_json", JSON.stringify(existingQuestions));
              return toolsApi.generateInterviewPrepWithUpload(formData);
            })()
          : await toolsApi.generateInterviewPrep({
              resume_text: resumeText,
              ...(jobDescription.trim() ? { job_description: jobDescription } : {}),
              ...(roleTitle.trim() ? { role_title: roleTitle } : {}),
              desired_count: 10,
              exclude_questions: existingQuestions,
            });

      const incoming: InterviewQuestion[] = res.data.questions || [];
      const currentSet = new Set(existingQuestions.map((q) => q.toLowerCase()));
      const uniqueIncoming = incoming.filter((q: InterviewQuestion) => !currentSet.has(q.question.toLowerCase()));
      if (uniqueIncoming.length === 0) {
        setError("No more unique questions available right now. Try refining role/job description for more.");
      } else {
        setResult({
          ...result,
          questions: [...result.questions, ...uniqueIncoming],
          focus_areas: res.data.focus_areas?.length ? res.data.focus_areas : result.focus_areas,
          preparation_tips: res.data.preparation_tips?.length ? res.data.preparation_tips : result.preparation_tips,
        });
      }
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { detail?: string } } };
      setError(apiError.response?.data?.detail || "Failed to fetch more interview questions.");
    } finally {
      setLoadingMore(false);
    }
  }, [jobDescription, loadingMore, result, resumeFile, resumeMode, resumeText, roleTitle]);

  const topicOptions = result
    ? ["All", ...Array.from(new Set(result.questions.flatMap((q) => inferTopics({ question: q.question, category: q.category }))))]
    : ["All"];

  const filteredQuestions = result
    ? result.questions.filter((q) => {
        if (selectedTopic === "All") return true;
        return inferTopics({ question: q.question, category: q.category }).includes(selectedTopic);
      })
    : [];

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
          <MessageSquare className="text-orange-500" /> AI Interview Prep
        </h1>
        <p className="text-slate-400">
          Paste your resume or upload a resume file with the target job description. We&apos;ll generate the exact questions they&apos;ll likely ask you and provide ideal answer frameworks.
        </p>
      </div>

      {!result ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex w-fit gap-1 rounded-lg border border-white/10 bg-slate-950/70 p-1 mb-4">
                {(["text", "file"] as ResumeInputMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setResumeMode(mode);
                      setError("");
                    }}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      resumeMode === mode ? "bg-orange-500/20 text-orange-100" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {mode === "text" ? "Paste Text" : "Upload File"}
                  </button>
                ))}
              </div>

              {resumeMode === "text" ? (
                <>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Resume Text <span className="text-red-400">*</span></label>
                  <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} className="w-full min-h-[200px] bg-surface-900 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:border-brand-500/50 outline-none transition-colors resize-none" placeholder="Paste your full resume here..."></textarea>
                </>
              ) : (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-300">Resume File <span className="text-red-400">*</span></label>
                  {resumeFile ? (
                    <div className="flex items-center gap-4 rounded-lg border border-orange-500/20 bg-orange-500/10 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-orange-500/20 bg-slate-950">
                        <FileText size={18} className="text-orange-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{resumeFile.name}</p>
                        <p className="text-xs text-slate-500">{(resumeFile.size / 1024).toFixed(0)} KB</p>
                      </div>
                      <button onClick={() => setResumeFile(null)} className="text-slate-500 transition-colors hover:text-red-400" aria-label="Remove resume file">
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
                      <input {...getInputProps()} />
                      <Upload size={30} className="mx-auto mb-3 text-orange-300" />
                      <p className="mb-1 font-medium text-white">
                        {isDragActive ? "Drop your resume here" : "Drag and drop your resume"}
                      </p>
                      <p className="text-sm text-slate-500">or <span className="cursor-pointer text-orange-300">browse files</span></p>
                      <p className="mt-3 text-xs text-slate-600">PDF, DOCX, or TXT</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="card p-6">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Target Role</label>
              <p className="text-xs text-slate-500 mb-2">Optional but recommended for sharper role-specific questions.</p>
              <input type="text" value={roleTitle} onChange={e => setRoleTitle(e.target.value)} placeholder="e.g. Senior Frontend Engineer" className="w-full bg-surface-900 border border-white/10 rounded-lg p-3 text-sm text-slate-200 focus:border-brand-500/50 outline-none transition-colors" />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="card p-6">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Job Description</label>
              <p className="text-xs text-slate-500 mb-2">Optional, but improves question relevance and interview focus areas.</p>
              <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} className="w-full min-h-[300px] bg-surface-900 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:border-brand-500/50 outline-none transition-colors resize-none" placeholder="Paste the job description here..."></textarea>
            </div>
            
            {error && <p className="text-red-400 text-sm px-2">{error}</p>}
            <button onClick={handleGenerate} disabled={loading} className="btn-primary w-full justify-center py-4 text-base">
              {loading ? "Analyzing Requirements..." : "Generate Interview Prep"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <button onClick={() => setResult(null)} className="btn-secondary mb-4">← Create Another</button>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><AlertCircle className="text-orange-500"/> Predicted Questions</h2>
              <div className="card p-4">
                <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Topics</p>
                <div className="flex flex-wrap gap-2">
                  {topicOptions.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setSelectedTopic(topic)}
                      className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                        selectedTopic === topic
                          ? "bg-orange-500/20 text-orange-200 border-orange-500/30"
                          : "bg-surface-900 text-slate-400 border-white/10 hover:text-white"
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {filteredQuestions.map((q, i) => (
                <div key={i} className="card p-6 border-orange-500/10">
                  <div className="flex items-start justify-between mb-3 gap-4">
                    <h3 className="text-lg font-semibold text-white">{q.question}</h3>
                    <div className="flex gap-2 shrink-0">
                      <span className="px-2 py-1 bg-surface-900 border border-white/5 rounded text-xs text-slate-400 uppercase tracking-wider">{q.category}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                        q.difficulty === "Hard" ? "bg-red-500/20 text-red-400" :
                        q.difficulty === "Medium" ? "bg-orange-500/20 text-orange-400" :
                        "bg-emerald-500/20 text-emerald-400"
                      }`}>{q.difficulty}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">Ideal Framework</p>
                      <p className="text-sm text-slate-300 leading-relaxed">{q.ideal_answer_framework}</p>
                    </div>
                    <div className="p-4 bg-surface-900 border border-white/5 rounded-lg">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Example Answer (Using your experience)</p>
                      <p className="text-sm text-slate-300 leading-relaxed italic">&quot;{q.example_answer}&quot;</p>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={handleShowMoreQuestions}
                disabled={loadingMore}
                className="btn-secondary w-full justify-center py-3"
              >
                {loadingMore ? "Loading More Questions..." : "Show More Questions"}
              </button>
            </div>

            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="font-semibold text-slate-200 mb-4">Key Focus Areas</h3>
                <ul className="space-y-3">
                  {result.focus_areas.map((area, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-orange-500 mt-1 shrink-0">•</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card p-6">
                <h3 className="font-semibold text-slate-200 mb-4">General Prep Tips</h3>
                <ul className="space-y-3">
                  {result.preparation_tips.map((tip, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-500 mt-1 shrink-0">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
