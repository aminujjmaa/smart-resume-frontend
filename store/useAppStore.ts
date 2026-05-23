import { create } from "zustand";
import { persist } from "zustand/middleware";
import { clearAuthCookie, clearLegacyAuthStorage } from "@/lib/authCookie";
import type { User, Analysis, AnalysisStep } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  clearAuth: () => void;
}

interface AnalysisState {
  currentAnalysis: Analysis | null;
  step: AnalysisStep;
  resumeText: string;
  resumeFile: File | null;
  jobDescription: string;
  setCurrentAnalysis: (a: Analysis | null) => void;
  setStep: (s: AnalysisStep) => void;
  setResumeText: (t: string) => void;
  setResumeFile: (f: File | null) => void;
  setJobDescription: (t: string) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        if (typeof window !== "undefined") {
          clearLegacyAuthStorage();
        }
        set({ user, token: null, isAuthenticated: true });
      },
      updateUser: (user) => set({ user }),
      clearAuth: () => {
        if (typeof window !== "undefined") {
          clearLegacyAuthStorage();
          clearAuthCookie();
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "smartresume-auth",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export const useAnalysisStore = create<AnalysisState>()((set) => ({
  currentAnalysis: null,
  step: "idle",
  resumeText: "",
  resumeFile: null,
  jobDescription: "",
  setCurrentAnalysis: (a) => set({ currentAnalysis: a }),
  setStep: (s) => set({ step: s }),
  setResumeText: (t) => set({ resumeText: t }),
  setResumeFile: (f) => set({ resumeFile: f }),
  setJobDescription: (t) => set({ jobDescription: t }),
  reset: () => set({ currentAnalysis: null, step: "idle", resumeText: "", resumeFile: null, jobDescription: "" }),
}));
