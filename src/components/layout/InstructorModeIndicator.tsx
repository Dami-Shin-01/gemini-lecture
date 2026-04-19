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

  // 분 단위 표시이므로 60s 간격으로 충분.
  useEffect(() => {
    if (!active) return;
    const t = window.setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => window.clearInterval(t);
  }, [active]);

  // 탭 title에 [강사 모드] prefix, 해제 시 원복.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (active && !document.title.startsWith("[강사 모드] ")) {
      document.title = `[강사 모드] ${document.title}`;
    }
    return () => {
      if (document.title.startsWith("[강사 모드] ")) {
        document.title = document.title.replace(/^\[강사 모드\] /, "");
      }
    };
  }, [active]);

  const remaining = active ? Math.max(0, until - now) : 0;

  // aria-live 컨테이너는 항상 렌더된다 — AT가 모드 변경 시점을 announce하려면
  // 노드가 먼저 존재해야 하기 때문. 내부 콘텐츠만 active/inactive로 토글.
  // (UX 리뷰 H1: `return null`로 nodes를 지우면 first-mount announce 누락)
  return (
    <>
      {/* 화면 상단 얇은 red 라인 — 강사 본인 인지용. 수강생도 보이지만 폭이 2px라 무해 */}
      {active && (
        <div
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 h-[2px] z-[60]"
          style={{ backgroundColor: "var(--color-focus)" }}
        />
      )}
      {/* 우측 하단 ticket-card 뱃지 */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-4 right-4 z-[60] pointer-events-none"
      >
        {active && (
          <div
            className="ticket-card ticket-card--alt px-3 py-2 flex items-center gap-2 text-[11px] pointer-events-auto"
            style={{ backgroundColor: "var(--color-surface-noon)" }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--color-focus)" }}
              aria-hidden="true"
            />
            <span
              className="font-semibold tabular-nums tracking-wider"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-focus)",
              }}
            >
              <span className="sr-only">강사 모드 켜짐. 남은 시간 </span>
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
        )}
      </div>
    </>
  );
}
