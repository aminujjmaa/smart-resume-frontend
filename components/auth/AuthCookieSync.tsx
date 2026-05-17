"use client";

import { useEffect } from "react";
import { syncAuthCookieFromStorage } from "@/lib/authCookie";

/** Keeps middleware-readable cookie in sync for sessions created before cookie auth existed. */
export default function AuthCookieSync() {
  useEffect(() => {
    syncAuthCookieFromStorage();
  }, []);
  return null;
}
