const TOKEN_COOKIE = "sr_access_token";
const LEGACY_TOKEN_COOKIE = "access_token";

export function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${LEGACY_TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function clearLegacyAuthStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  document.cookie = `${LEGACY_TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function syncAuthCookieFromStorage() {
  clearLegacyAuthStorage();
}
