"use client";

interface Props {
  score: number;
  size?: number;
}

function getScoreColor(score: number) {
  if (score >= 75) return { stroke: "#10b981", text: "text-accent-green", label: "Good" };
  if (score >= 50) return { stroke: "#f59e0b", text: "text-amber-400", label: "Average" };
  return { stroke: "#ef4444", text: "text-red-400", label: "Needs Work" };
}

export default function ATSScoreRing({ score, size = 160 }: Readonly<Props>) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const { stroke, text, label } = getScoreColor(score);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 120 120" className="-rotate-90">
          {/* Track */}
          <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          {/* Progress */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              filter: `drop-shadow(0 0 8px ${stroke}60)`,
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-display text-4xl font-bold ${text}`}>{score}</span>
          <span className="text-slate-500 text-xs">/100</span>
        </div>
      </div>
      <div className="text-center">
        <p className={`font-semibold ${text}`}>{label}</p>
        <p className="text-slate-500 text-xs">ATS Score</p>
      </div>
    </div>
  );
}
