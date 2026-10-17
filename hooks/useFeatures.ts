"use client";
import { useQuery } from "@tanstack/react-query";
import { metaApi } from "@/lib/api";

export interface Features {
  email: boolean;
  payments: boolean;
  google: boolean;
}

/** Optional integrations configured on the API; hide UI for anything that's off. */
export function useFeatures(): Features | undefined {
  const { data } = useQuery<Features>({
    queryKey: ["features"],
    queryFn: () => metaApi.features().then((r) => r.data),
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
  return data;
}
