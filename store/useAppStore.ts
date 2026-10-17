import { create } from "zustand";
import { persist } from "zustand/middleware";
import { clearAuthCookie, clearLegacyAuthStorage } from "@/lib/authCookie";
import type { User, Analysis, AnalysisStep } from "@/types";

// The JWT lives only in the httpOnly `sr_access_token` cookie set by the API;
// it is never stored in JS-readable storage.
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User) => void;
  updateUser: (user: User) => void;
  clearAuth: () => void;
}

interface AnalysisState {
  currentAnalysis: Analysis | null;
  step: AnalysisStep;
  resumeText: string;
  appliedResumeText: string; // resume text with applied AI improvements
  resumeFile: File | null;
  jobDescription: string;
  setCurrentAnalysis: (a: Analysis | null) => void;
  setStep: (s: AnalysisStep) => void;
  setResumeText: (t: string) => void;
  setAppliedResumeText: (t: string) => void;
  setResumeFile: (f: File | null) => void;
  setJobDescription: (t: string) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (user) => {
        if (globalThis.window !== undefined) {
          clearLegacyAuthStorage();
        }
        set({ user, isAuthenticated: true });
      },
      updateUser: (user) => set({ user }),
      clearAuth: () => {
        if (globalThis.window !== undefined) {
          clearLegacyAuthStorage();
          clearAuthCookie();
        }
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "smartresume-auth",
      version: 2,
      // v1 persisted the JWT in localStorage; drop it on upgrade.
      migrate: (persisted) => {
        const { user = null, isAuthenticated = false } = (persisted ?? {}) as Partial<AuthState>;
        return { user, isAuthenticated };
      },
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export const useAnalysisStore = create<AnalysisState>()((set) => ({
  currentAnalysis: null,
  step: "idle",
  resumeText: "",
  appliedResumeText: "",
  resumeFile: null,
  jobDescription: "",
  setCurrentAnalysis: (a) => set({ currentAnalysis: a }),
  setStep: (s) => set({ step: s }),
  setResumeText: (t) => set({ resumeText: t }),
  setAppliedResumeText: (t) => set({ appliedResumeText: t }),
  setResumeFile: (f) => set({ resumeFile: f }),
  setJobDescription: (t) => set({ jobDescription: t }),
  reset: () => set({ currentAnalysis: null, step: "idle", resumeText: "", appliedResumeText: "", resumeFile: null, jobDescription: "" }),
}));
