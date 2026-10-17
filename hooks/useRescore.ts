"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { analysisApi } from "@/lib/api";
import { track } from "@/lib/analytics";
import type { RescoreResult } from "@/types/growth";

const DEBOUNCE_MS = 1200;

/** Re-scores edited resume text (rule-based, instant) once typing pauses. */
export function useRescore(jobId: string, text: string, originalText: string, enabled: boolean) {
  const [debounced, setDebounced] = useState(text);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(text), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [text]);

  const changed = enabled && debounced.trim().length >= 50 && debounced !== originalText;

  return useQuery<RescoreResult>({
    queryKey: ["rescore", jobId, debounced],
    queryFn: async () => {
      const res = await analysisApi.rescore(jobId, debounced);
      track("rescore", { delta: res.data.delta });
      return res.data;
    },
    enabled: changed,
    staleTime: Infinity,
    retry: false,
    placeholderData: (previous) => previous,
  });
}
