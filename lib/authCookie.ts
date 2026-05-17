const TOKEN_COOKIE = "access_token";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function setAuthCookie(token: string) {
  if (typeof document === "undefined") return;
  const encoded = encodeURIComponent(token);
  document.cookie = `${TOKEN_COOKIE}=${encoded}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function syncAuthCookieFromStorage() {
  if (typeof window === "undefined") return;
  const token = localStorage.getItem("access_token");
  if (token) setAuthCookie(token);
}
