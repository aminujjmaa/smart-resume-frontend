"use client";

import { useEffect } from "react";
import { syncAuthCookieFromStorage } from "@/lib/authCookie";

/** Retires legacy localStorage tokens after server-managed cookie auth is available. */
export default function AuthCookieSync() {
  useEffect(() => {
    syncAuthCookieFromStorage();
  }, []);
  return null;
}
