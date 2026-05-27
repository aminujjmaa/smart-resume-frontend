import axios from "axios";
import { useAuthStore } from "@/store/useAppStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

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
      globalThis.window.location.href = "/login";
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
};

// ── Razorpay ─────────────────────────────────────────
export const razorpayApi = {
  createOrder: (amount: number, currency = "INR") =>
    apiClient.post("/razorpay/create-order", { amount, currency }),
  verifyPayment: (data: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => apiClient.post("/razorpay/verify-payment", data),
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
