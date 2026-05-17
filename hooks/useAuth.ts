"use client";
import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/useAppStore";

function safeDashboardRedirect(next: string | null): string {
  if (!next || !next.startsWith("/dashboard")) return "/dashboard";
  return next;
}

export function useAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  const redirectAfterAuth = useCallback(() => {
    const next = searchParams.get("next");
    router.push(safeDashboardRedirect(next));
  }, [router, searchParams]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login({ email, password });
      const { access_token, user: userData } = res.data;
      setAuth(userData, access_token);
      redirectAfterAuth();
    },
    [setAuth, redirectAfterAuth]
  );

  const register = useCallback(
    async (email: string, password: string, full_name?: string) => {
      const res = await authApi.register({ email, password, full_name });
      const { access_token, user: userData } = res.data;
      setAuth(userData, access_token);
      redirectAfterAuth();
    },
    [setAuth, redirectAfterAuth]
  );

  const logout = useCallback(() => {
    clearAuth();
    router.push("/");
  }, [clearAuth, router]);

  return { user, isAuthenticated, login, register, logout };
}
