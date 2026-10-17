import axios from "axios";
import { useAuthStore } from "@/store/useAppStore";

const API_URL = process.env.NODE_ENV === "production" ? (process.env.NEXT_PUBLIC_API_URL || "/api/v1") : "/api/v1";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Handle 401 — clear token and redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && globalThis.window !== undefined) {
      useAuthStore.getState().clearAuth();
      const { pathname } = globalThis.window.location;
      if (pathname.startsWith("/dashboard")) {
        globalThis.window.location.href = `/login?next=${encodeURIComponent(pathname)}`;
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ─────────────────────────────────────────────
export const authApi = {
  register: (data: { email: string; password: string; full_name?: string }) =>
    apiClient.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    apiClient.post("/auth/login", data),
  me: () => apiClient.get("/auth/me"),
  logout: () => apiClient.post("/auth/logout"),
  forgotPassword: (email: string) => apiClient.post("/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) =>
    apiClient.post("/auth/reset-password", { token, password }),
};

// ── Meta ─────────────────────────────────────────────
export const metaApi = {
  features: () => apiClient.get("/meta/features"),
};

// ── Analysis ─────────────────────────────────────────
export const analysisApi = {
  submit: (formData: FormData) =>
    apiClient.post("/analyze", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getResult: (jobId: string) => apiClient.get(`/analyze/result/${jobId}`),
  rewrite: (data: { bullet_point: string; job_description: string }) =>
    apiClient.post("/analyze/rewrite", data),
  history: () => apiClient.get("/analyze/history"),
  resolveIssue: (data: {
    category: string;
    issue: string;
    how_to_improve: string;
    resume_text?: string;
  }) => apiClient.post("/analyze/resolve-issue", data),
};

// ── Razorpay ─────────────────────────────────────────
export const razorpayApi = {
  getSubscription: () => apiClient.get("/razorpay/subscription"),
  createSubscription: () => apiClient.post("/razorpay/subscription"),
  verifySubscription: (data: {
    razorpay_payment_id: string;
    razorpay_subscription_id: string;
    razorpay_signature: string;
  }) => apiClient.post("/razorpay/subscription/verify", data),
  cancelSubscription: () => apiClient.post("/razorpay/subscription/cancel"),
};

// ── Tools ────────────────────────────────────────────
export const toolsApi = {
  analyzeLinkedIn: (data: { profile_text: string; resume_text?: string }) =>
    apiClient.post("/linkedin/analyze", data),
  generateCoverLetter: (data: { resume_text: string; job_description: string; company_name: string; role_title: string; tone?: string }) =>
    apiClient.post("/tools/cover-letter", data),
  generateNetworkingEmail: (data: { email_type: string; target_name?: string; company: string; role: string; job_description?: string; user_background: string; goal?: string }) =>
    apiClient.post("/tools/networking-email", data),
  generateInterviewPrep: (data: { resume_text: string; job_description?: string; role_title?: string; desired_count?: number; exclude_questions?: string[] }) =>
    apiClient.post("/tools/interview-prep", data),
  generateInterviewPrepWithUpload: (formData: FormData) =>
    apiClient.post("/tools/interview-prep-upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// ── Admin ────────────────────────────────────────────
export const adminApi = {
  getStats: () => apiClient.get("/admin/stats"),
  getUsers: (params?: { skip?: number; limit?: number }) => apiClient.get("/admin/users", { params }),
};

// ── LaTeX ────────────────────────────────────────────
export const latexApi = {
  compile: (source: string) =>
    apiClient.post("/latex/compile", { source }, { responseType: "blob", withCredentials: true }),
};

