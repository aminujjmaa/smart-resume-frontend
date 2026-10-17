import type { ScoreShareCard } from "@/types/growth";

/** API base for server-side fetches (server components, OG images). */
function serverApiBase(): string {
  if (process.env.BACKEND_URL) return `${process.env.BACKEND_URL.replace(/\/$/, "")}/api/v1`;
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
}

export async function fetchScoreShare(shareId: string): Promise<ScoreShareCard | null> {
  if (!/^[A-Za-z0-9_-]{1,16}$/.test(shareId)) return null;
  try {
    const res = await fetch(`${serverApiBase()}/share/${shareId}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return (await res.json()) as ScoreShareCard;
  } catch {
    return null;
  }
}
