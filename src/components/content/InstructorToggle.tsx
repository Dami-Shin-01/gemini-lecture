"use client";

import { useInstructorMode } from "@/hooks/useInstructorMode";

export default function InstructorToggle() {
  const { active, until, enter, exit } = useInstructorMode();

  const remainingMin =
    active && until > 0 ? Math.max(0, Math.round((until - Date.now()) / 60000)) : 0;

  return (
    <div className="my-6 ticket-card ticket-card--alt p-5">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="kicker mb-1">강사 전용 · 수강생 화면엔 영향 없음</p>
          <h3
            className="text-[1.125rem] font-semibold text-text-primary mb-1"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            강사 모드
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            켜면 본문의 <strong className="text-text-primary">강사 팁</strong> 블록이 화면에 표시됩니다. 4시간 후 자동 해제되며, 강의 종료 시 직접 해제할 수도 있습니다. URL에 <code className="text-[0.85em]">?mode=instructor</code>를 붙여 진입해도 됩니다.
          </p>
        </div>
        <div className="shrink-0">
          <button
            type="button"
            role="switch"
            aria-checked={active}
            onClick={() => (active ? exit("manual") : enter("toggle"))}
            className={`inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-full text-sm font-semibold transition-colors ${
              active
                ? "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]"
                : "border border-cream-dark text-text-secondary hover:bg-cream-dark/40"
            }`}
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{
                backgroundColor: active ? "#fff" : "var(--color-text-muted)",
              }}
              aria-hidden="true"
            />
            {active ? `켜짐 · ${remainingMin}분 남음` : "강사 모드 켜기"}
          </button>
        </div>
      </div>
    </div>
  );
}
