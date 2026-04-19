"use client";

import { useEffect, useState } from "react";
import { useInstructorMode } from "@/hooks/useInstructorMode";

function formatRemaining(ms: number): string {
  if (ms <= 0) return "00:00";
  const totalMin = Math.max(0, Math.floor(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function InstructorModeIndicator() {
  const { active, until, exit } = useInstructorMode();
  const [now, setNow] = useState<number>(() => Date.now());

  // 분 단위로만 다시 계산 — 초마다 렌더할 필요 없음.
  useEffect(() => {
    if (!active) return;
    const t = window.setInterval(() => setNow(Date.now()), 30 * 1000);
    return () => window.clearInterval(t);
  }, [active]);

  // 탭 title에 [강사 모드] prefix, 해제 시 원복.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const original = document.title;
    if (active && !document.title.startsWith("[강사 모드] ")) {
      document.title = `[강사 모드] ${original}`;
    }
    return () => {
      if (document.title.startsWith("[강사 모드] ")) {
        document.title = document.title.replace(/^\[강사 모드\] /, "");
      }
    };
  }, [active]);

  if (!active) return null;

  const remaining = Math.max(0, until - now);

  return (
    <>
      {/* 화면 상단 얇은 red 라인 — 빔 투사 시 수강생 주의를 끌지 않으면서 강사 본인 인지 가능 */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[2px] z-[60]"
        style={{ backgroundColor: "var(--color-focus)" }}
      />
      {/* 우측 하단 텍스트 뱃지 — ticket-card 톤으로 */}
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-4 right-4 z-[60] ticket-card ticket-card--alt px-3 py-2 flex items-center gap-2 text-[11px]"
        style={{ backgroundColor: "var(--color-surface-noon)" }}
      >
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: "var(--color-focus)" }}
          aria-hidden="true"
        />
        <span
          className="font-semibold tabular-nums tracking-wider"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-focus)" }}
        >
          강사 모드 · {formatRemaining(remaining)}
        </span>
        <button
          type="button"
          onClick={() => exit("manual")}
          className="ml-1 text-text-muted hover:text-text-primary min-h-[24px] px-1.5 underline-offset-2 hover:underline"
          aria-label="강사 모드 해제"
        >
          해제
        </button>
      </div>
    </>
  );
}
