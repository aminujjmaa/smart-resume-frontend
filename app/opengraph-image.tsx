import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "SmartResume AI - Free ATS Resume Scanner";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B1120", // surface-950 equivalent
          backgroundImage:
            "radial-gradient(circle at 50% -20%, #14b8a630 0%, transparent 50%), radial-gradient(circle at -20% 50%, #8b5cf620 0%, transparent 40%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "32px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #14b8a6, #9333ea)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "16px",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "white",
                margin: 0,
                letterSpacing: "-0.05em",
              }}
            >
              SmartResume <span style={{ color: "#14b8a6" }}>AI</span>
            </h1>
          </div>
          
          <h2
            style={{
              fontSize: "64px",
              fontWeight: "900",
              color: "white",
              textAlign: "center",
              margin: "0 0 20px 0",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            The Ultimate <br />
            ATS Resume Scanner
          </h2>
          
          <p
            style={{
              fontSize: "24px",
              color: "#94a3b8", // slate-400
              margin: 0,
              maxWidth: "600px",
              textAlign: "center",
            }}
          >
            Check your score, find keyword gaps, and rewrite your bullets to land more interviews.
          </p>
        </div>
        
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            color: "#64748b",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          smartresume.co.in
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
