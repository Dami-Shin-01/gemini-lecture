import { ImageResponse } from "next/og";

export const alt = "JB's Day with Gemini — 4-hour full course";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#F0ECE4",
          color: "#000000",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#8A8A8A",
            marginBottom: 24,
          }}
        >
          07:00 — 17:00 · Gemini Full Course
        </div>
        <div
          style={{
            fontSize: 120,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.035em",
          }}
        >
          JB&rsquo;s Day,
        </div>
        <div
          style={{
            fontSize: 120,
            fontWeight: 300,
            lineHeight: 1,
            letterSpacing: "-0.035em",
            marginTop: 16,
          }}
        >
          with Gemini.
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#3A3A3A",
            marginTop: 56,
          }}
        >
          4 hours · 28 labs · 5 deliverables
        </div>
        <div
          style={{
            width: 120,
            height: 4,
            background: "#A50034",
            marginTop: 48,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
