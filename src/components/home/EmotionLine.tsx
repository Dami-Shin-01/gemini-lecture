"use client";

import { track } from "@/lib/analytics";

const chapters = [
  { id: "ch01", time: "07:00", emotion: "긴장", cx: 78.6, cy: 113, colorTag: "#FFB74D", emoHex: "#9AA6B5" },
  { id: "ch02", time: "09:00", emotion: "집중", cx: 235.7, cy: 90.5, colorTag: "#5B8DEF", emoHex: "#6C8EA8" },
  { id: "ch03", time: "10:30", emotion: "공감", cx: 392.9, cy: 77, colorTag: "#4CAF50", emoHex: "#7FA891" },
  { id: "ch04", time: "11:30", emotion: "호기심", cx: 550, cy: 68, colorTag: "#9C27B0", emoHex: "#A489B8" },
  { id: "ch05", time: "13:30", emotion: "추진", cx: 707.1, cy: 54.5, colorTag: "#E09F3E", emoHex: "#D39E5C" },
  { id: "ch06", time: "15:00", emotion: "설득", cx: 864.3, cy: 60.8, colorTag: "#E91E63", emoHex: "#C97A85" },
  { id: "ch07", time: "16:30", emotion: "안도", cx: 1021.4, cy: 104, colorTag: "#607D8B", emoHex: "#8893A6" },
] as const;

function smoothPath(): string {
  const pts = chapters.map((c) => ({ x: c.cx, y: c.cy }));
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

export default function EmotionLine() {
  const curveD = smoothPath();
  const areaD = `${curveD} L${chapters[chapters.length - 1].cx},160 L${chapters[0].cx},160 Z`;

  return (
    <section className="max-w-[1100px] mx-auto px-6 pb-16">
      <p className="kicker mb-3">하루의 정서 곡선</p>
      <h2 className="section-display mb-8">감정도, 시간을 따라 흐릅니다.</h2>

      <div className="surface rounded-2xl border border-cream-dark p-4 sm:p-6">
        <svg
          viewBox="0 0 1100 160"
          preserveAspectRatio="none"
          role="img"
          aria-labelledby="emotion-line-title emotion-line-desc"
          className="emotion-line"
        >
          <title id="emotion-line-title">JB의 하루 감정 곡선</title>
          <desc id="emotion-line-desc">
            07:00 긴장 · 09:00 집중 · 10:30 공감 · 11:30 호기심 · 13:30 추진 · 15:00 설득 · 16:30 안도
          </desc>

          <defs>
            <linearGradient id="emotion-stroke" x1="0" x2="1" y1="0" y2="0">
              {chapters.map((c, i) => (
                <stop
                  key={c.id}
                  offset={`${(i / (chapters.length - 1)) * 100}%`}
                  stopColor={c.emoHex}
                />
              ))}
            </linearGradient>
            <linearGradient id="emotion-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#888" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#888" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path className="emotion-line__area" d={areaD} fill="url(#emotion-area)" />
          <path className="emotion-line__curve" d={curveD} stroke="url(#emotion-stroke)" />

          <g>
            {chapters.map((c, i) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="emotion-line__dot"
                aria-label={`${c.time} · ${c.emotion} · ${c.id} 섹션으로 이동`}
                onClick={() =>
                  track("emotion_dot_click", {
                    chapter_id: c.id,
                    emotion: c.emotion,
                    position: i + 1,
                  })
                }
              >
                <circle
                  cx={c.cx}
                  cy={c.cy}
                  r={6}
                  fill="var(--color-surface-noon)"
                  stroke={c.colorTag}
                  strokeWidth={2}
                />
              </a>
            ))}
          </g>
        </svg>

        <p className="mt-4 text-center text-xs text-text-muted">
          점을 누르면 해당 시간대 챕터로 이동합니다.
        </p>
      </div>
    </section>
  );
}
