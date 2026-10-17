"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { analysisApi } from "@/lib/api";
import { useAnalysisStore, useAuthStore } from "@/store/useAppStore";
import type { Analysis } from "@/types";
import { track } from "@/lib/analytics";

// Poll quickly at first, then back off; AI enhancement can take ~40s under load.
const POLL_DELAYS_MS = [1000, 1500, 2000, 3000, 4000, 5000];
const MAX_WAIT_MS = 3 * 60 * 1000;
const MAX_CONSECUTIVE_NETWORK_ERRORS = 3;

export function useAnalysis() {
  const router = useRouter();
  const { setCurrentAnalysis, setStep, currentAnalysis, step } = useAnalysisStore();
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearTimeout(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => () => stopPolling(), [stopPolling]);

  const pollResult = useCallback(
    (jobId: string) => {
      stopPolling();
      const startedAt = Date.now();
      let attempt = 0;
      let networkErrors = 0;

      const fail = (message: string) => {
        stopPolling();
        setStep("error");
        setError(message);
      };

      const tick = async () => {
        if (Date.now() - startedAt > MAX_WAIT_MS) {
          fail("This is taking longer than usual. Please try again in a minute.");
          return;
        }
        try {
          const res = await analysisApi.getResult(jobId);
          networkErrors = 0;
          const analysis: Analysis = res.data;
          setCurrentAnalysis(analysis);

          if (analysis.status === "done") {
            stopPolling();
            setStep("done");
            track("scan_completed", { score: analysis.ats_score ?? null });
            const { isAuthenticated } = useAuthStore.getState();
            router.push(isAuthenticated ? `/dashboard/results/${jobId}` : `/results/${jobId}`);
            return;
          }
          if (analysis.status === "failed") {
            fail("Analysis failed. Please try again.");
            return;
          }
          if (analysis.status === "processing") setStep("analyzing");
        } catch {
          networkErrors += 1;
          if (networkErrors >= MAX_CONSECUTIVE_NETWORK_ERRORS) {
            fail("Connection error. Please check your internet and try again.");
            return;
          }
        }
        const delay = POLL_DELAYS_MS[Math.min(attempt, POLL_DELAYS_MS.length - 1)];
        attempt += 1;
        pollRef.current = setTimeout(tick, delay);
      };

      pollRef.current = setTimeout(tick, POLL_DELAYS_MS[0]);
    },
    [router, setCurrentAnalysis, setStep, stopPolling]
  );

  const submitAnalysis = useCallback(
    async (formData: FormData) => {
      setError(null);
      setLimitReached(false);
      setStep("uploading");
      track("scan_submitted", { with_jd: formData.has("job_description"), file: formData.has("resume_file") });
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
        const apiErr = err as { response?: { status?: number; data?: { detail?: unknown } } };
        if (apiErr.response?.status === 429) {
          setLimitReached(true);
          track("scan_limit_hit");
        }
        const detail = apiErr.response?.data?.detail;
        setError(typeof detail === "string" ? detail : "Submission failed. Please try again.");
      }
    },
    [setCurrentAnalysis, setStep, pollResult, stopPolling]
  );

  return { submitAnalysis, currentAnalysis, step, error, limitReached, stopPolling };
}
