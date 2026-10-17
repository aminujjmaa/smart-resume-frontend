import { ImageResponse } from "next/og";
import { fetchScoreShare } from "@/lib/serverApi";

export const runtime = "edge";
export const alt = "ATS resume score card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { shareId: string } }) {
  const share = await fetchScoreShare(params.shareId);
  const score = share?.ats_score ?? 0;
  const bars: [string, number][] = share
    ? [
        ["Keyword match", share.score_breakdown.keyword_match_pct],
        ["Experience impact", share.score_breakdown.experience_impact_pct],
        ["Formatting", share.score_breakdown.formatting_score_pct],
      ]
    : [];

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "70px 90px",
          backgroundColor: "#0B1120",
          backgroundImage: "radial-gradient(circle at 15% 0%, #14b8a630 0%, transparent 45%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, color: "#5eead4", letterSpacing: 4 }}>MY ATS RESUME SCORE</div>
          <div style={{ display: "flex", alignItems: "flex-end", marginTop: 10 }}>
            <div style={{ fontSize: 220, fontWeight: 800, lineHeight: 1 }}>{share ? score : "—"}</div>
            <div style={{ fontSize: 60, color: "#64748b", marginBottom: 24, marginLeft: 8 }}>/100</div>
          </div>
          <div style={{ fontSize: 30, color: "#94a3b8", marginTop: 20 }}>Check yours free at smartresume.co.in</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: 420 }}>
          {bars.map(([label, pct]) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#cbd5e1" }}>
                <span>{label}</span>
                <span>{pct}%</span>
              </div>
              <div style={{ display: "flex", height: 16, borderRadius: 8, backgroundColor: "#1e293b", marginTop: 10 }}>
                <div style={{ width: `${pct}%`, height: 16, borderRadius: 8, backgroundImage: "linear-gradient(90deg, #2dd4bf, #4c6ef5)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
