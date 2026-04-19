import { ImageResponse } from "next/og";

export const alt = "JB의 하루 — 감정이 데이터가 되는 하루";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

const PRETENDARD_REGULAR =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Regular.ttf";
const PRETENDARD_BOLD =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Bold.ttf";

async function loadKoreanFonts(): Promise<
  | { regular: ArrayBuffer; bold: ArrayBuffer }
  | null
> {
  try {
    const [r, b] = await Promise.all([fetch(PRETENDARD_REGULAR), fetch(PRETENDARD_BOLD)]);
    if (!r.ok || !b.ok) return null;
    const [regular, bold] = await Promise.all([r.arrayBuffer(), b.arrayBuffer()]);
    return { regular, bold };
  } catch {
    return null;
  }
}

// 감정 곡선 미니어처 좌표 (viewBox 600x300)
const EMOTION_POINTS = [
  { cx: 50, cy: 210, color: "#9AA6B5" }, // 07:00 긴장
  { cx: 142, cy: 165, color: "#6C8EA8" }, // 09:00 집중
  { cx: 234, cy: 140, color: "#7FA891" }, // 10:30 공감
  { cx: 326, cy: 125, color: "#A489B8" }, // 11:30 호기심
  { cx: 418, cy: 100, color: "#D39E5C" }, // 13:30 추진
  { cx: 510, cy: 112, color: "#C97A85" }, // 15:00 설득
  { cx: 570, cy: 195, color: "#8893A6" }, // 16:30 안도
];

function smoothPath() {
  let d = `M${EMOTION_POINTS[0].cx},${EMOTION_POINTS[0].cy}`;
  for (let i = 0; i < EMOTION_POINTS.length - 1; i++) {
    const p0 = EMOTION_POINTS[i - 1] ?? EMOTION_POINTS[i];
    const p1 = EMOTION_POINTS[i];
    const p2 = EMOTION_POINTS[i + 1];
    const p3 = EMOTION_POINTS[i + 2] ?? p2;
    const cp1x = p1.cx + (p2.cx - p0.cx) / 6;
    const cp1y = p1.cy + (p2.cy - p0.cy) / 6;
    const cp2x = p2.cx - (p3.cx - p1.cx) / 6;
    const cp2y = p2.cy - (p3.cy - p1.cy) / 6;
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.cx},${p2.cy}`;
  }
  return d;
}

function renderEnglishFallback() {
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

export default async function Image() {
  const fonts = await loadKoreanFonts();

  if (!fonts) {
    return renderEnglishFallback();
  }

  const curveD = smoothPath();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#F0ECE4",
          color: "#000000",
          fontFamily: "Pretendard",
        }}
      >
        {/* 좌측 40% 텍스트 */}
        <div
          style={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px 32px 72px 72px",
          }}
        >
          <div
            style={{
              fontSize: 26,
              letterSpacing: "0.14em",
              color: "#8A8A8A",
              marginBottom: 24,
              fontWeight: 400,
            }}
          >
            07:00 → 17:30 · JB의 하루
          </div>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: "-0.035em",
              color: "#0A0A0A",
            }}
          >
            감정이 데이터가
          </div>
          <div
            style={{
              fontSize: 84,
              fontWeight: 400,
              lineHeight: 0.95,
              letterSpacing: "-0.035em",
              color: "#0A0A0A",
              marginTop: 4,
            }}
          >
            되는 하루
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#3A3A3A",
              marginTop: 40,
              fontWeight: 400,
            }}
          >
            4시간 · 28 실습 · 5 산출물 · 회고로 닫힘
          </div>
          <div
            style={{
              width: 120,
              height: 4,
              background: "#A50034",
              marginTop: 40,
            }}
          />
        </div>

        {/* 우측 60% 감정 곡선 */}
        <div
          style={{
            width: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 48px",
          }}
        >
          <svg
            width="600"
            height="300"
            viewBox="0 0 600 300"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="emo" x1="0" x2="1" y1="0" y2="0">
                {EMOTION_POINTS.map((p, i) => (
                  <stop
                    key={i}
                    offset={`${(i / (EMOTION_POINTS.length - 1)) * 100}%`}
                    stopColor={p.color}
                  />
                ))}
              </linearGradient>
              <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#888" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#888" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`${curveD} L${EMOTION_POINTS[EMOTION_POINTS.length - 1].cx},280 L${EMOTION_POINTS[0].cx},280 Z`}
              fill="url(#area)"
            />
            <path
              d={curveD}
              stroke="url(#emo)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {EMOTION_POINTS.map((p, i) => (
              <circle
                key={i}
                cx={p.cx}
                cy={p.cy}
                r={8}
                fill="#FFFFFF"
                stroke={p.color}
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Pretendard",
          data: fonts.regular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Pretendard",
          data: fonts.bold,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
