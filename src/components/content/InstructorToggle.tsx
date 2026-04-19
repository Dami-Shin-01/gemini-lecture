"use client";

import { useInstructorMode } from "@/hooks/useInstructorMode";

export default function InstructorToggle() {
  const { active, until, exit } = useInstructorMode();

  // 수강생 모드에서는 토글 자체가 보이지 않아야 한다. URL 쿼리(?mode=instructor)가 유일한
  // 진입 경로이며, 강사가 진입해서 active가 된 뒤에만 이 섹션이 노출되고 거기서 "해제"가 가능하다.
  // (1차 리뷰: 수강생이 치트시트 말미에서 "강사용 설정" 버튼을 보고 눌러서 혼란을 겪음)
  if (!active) return null;

  const remainingMin = until > 0 ? Math.max(0, Math.round((until - Date.now()) / 60000)) : 0;

  return (
    <div className="my-6 ticket-card ticket-card--alt p-5">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="kicker mb-1">강사 전용 · 수강생 화면엔 영향 없음</p>
          <h3
            className="text-[1.125rem] font-semibold text-text-primary mb-1"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            강사 모드 켜짐
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            본문의 <strong className="text-text-primary">강사 팁</strong> 블록이 화면에 표시됩니다. 남은 시간: <strong className="text-text-primary tabular-nums">{remainingMin}분</strong>. 4시간 TTL 만료 시 자동 해제되며, 아래 버튼으로 즉시 해제할 수도 있습니다. URL에 <code className="text-[0.85em]">?mode=student</code>를 붙여 해제도 가능합니다.
          </p>
        </div>
        <div className="shrink-0">
          <button
            type="button"
            role="switch"
            aria-checked={true}
            onClick={() => exit()}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-full text-sm font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] transition-colors"
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: "#fff" }}
              aria-hidden="true"
            />
            지금 해제
          </button>
        </div>
      </div>
    </div>
  );
}
