"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { analysisApi } from "@/lib/api";
import { useAnalysisStore, useAuthStore } from "@/store/useAppStore";
import type { Analysis } from "@/types";

const POLL_INTERVAL = 1500; // ms
const MAX_POLLS = 40;

export function useAnalysis() {
  const router = useRouter();
  const { setCurrentAnalysis, setStep, currentAnalysis, step } = useAnalysisStore();
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => () => stopPolling(), [stopPolling]);

  const pollResult = useCallback(
    (jobId: string) => {
      stopPolling();
      let count = 0;
      pollRef.current = setInterval(async () => {
        count++;
        if (count > MAX_POLLS) {
          stopPolling();
          setStep("error");
          setError("Analysis timed out. Please try again.");
          return;
        }
        try {
          const res = await analysisApi.getResult(jobId);
          const analysis: Analysis = res.data;
          setCurrentAnalysis(analysis);

          if (analysis.status === "done") {
            stopPolling();
            setStep("done");
            const { isAuthenticated } = useAuthStore.getState();
            if (isAuthenticated) {
              router.push(`/dashboard/results/${jobId}`);
            } else {
              router.push(`/results/${jobId}`);
            }
          } else if (analysis.status === "failed") {
            stopPolling();
            setStep("error");
            setError("Analysis failed. Please try again.");
          } else if (analysis.status === "processing") {
            setStep("analyzing");
          }
        } catch {
          stopPolling();
          setStep("error");
          setError("Connection error. Please try again.");
        }
      }, POLL_INTERVAL);
    },
    [router, setCurrentAnalysis, setStep, stopPolling]
  );

  const submitAnalysis = useCallback(
    async (formData: FormData) => {
      setError(null);
      setStep("uploading");
      try {
        setStep("parsing");
        const res = await analysisApi.submit(formData);
        const analysis: Analysis = res.data;
        setCurrentAnalysis(analysis);
        setStep("analyzing");
        pollResult(analysis.id);
      } catch (err: unknown) {
        stopPolling();
        setStep("error");
        const apiErr = err as { response?: { data?: { detail?: string } } };
        setError(apiErr?.response?.data?.detail || "Submission failed. Please try again.");
      }
    },
    [setCurrentAnalysis, setStep, pollResult, stopPolling]
  );

  return { submitAnalysis, currentAnalysis, step, error, stopPolling };
}
