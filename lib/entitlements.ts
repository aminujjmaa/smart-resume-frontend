import type { User } from "@/types";

/** Pro access as decided by the API (subscription, legacy lifetime, or admin). */
export function isPro(user: User | null | undefined): boolean {
  return Boolean(user?.is_premium);
}
