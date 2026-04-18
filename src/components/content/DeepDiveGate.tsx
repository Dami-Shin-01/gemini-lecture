import { Target, CheckCircle, Clock } from "lucide-react";

interface Props {
  /** curriculum.json의 deepDiveNote — 얻는 것 설명 */
  note?: string;
  /** 예상 소요시간(분) */
  durationMin?: number;
  /** 기본 실습 대안 경로 안내 문구 (없으면 기본값) */
  fallbackHint?: string;
}

export default function DeepDiveGate({
  note,
  durationMin,
  fallbackHint = "기본 실습만 원한다면 이 심화 섹션을 건너뛰어도 챕터 목표는 달성됩니다.",
}: Props) {
  return (
    <aside
      className="deep-gate mb-8 rounded-lg border-l-4 p-4 sm:p-5"
      style={{
        backgroundColor: "var(--color-warning-bg)",
        borderLeftColor: "var(--color-time-accent)",
      }}
      aria-label="심화 실습 안내"
    >
      <p className="kicker mb-3">DEEP DIVE · 심화 실습 안내</p>

      <ul className="flex flex-col gap-2 text-sm">
        <li className="flex items-start gap-2">
          <Target
            size={16}
            className="mt-0.5 shrink-0"
            style={{ color: "var(--color-time-accent)" }}
            aria-hidden="true"
          />
          <span>
            <span className="text-text-muted text-[11px] uppercase tracking-wider block mb-0.5">
              얻는 것
            </span>
            <span className="text-text-primary leading-relaxed">
              {note ?? "R&D 수준의 원리·튜닝·출처 추적을 실습합니다."}
            </span>
          </span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle
            size={16}
            className="mt-0.5 shrink-0 text-[var(--color-tag-practice)]"
            aria-hidden="true"
          />
          <span>
            <span className="text-text-muted text-[11px] uppercase tracking-wider block mb-0.5">
              건너뛰어도 잃지 않는 것
            </span>
            <span className="text-text-secondary leading-relaxed">{fallbackHint}</span>
          </span>
        </li>
        {durationMin && (
          <li className="flex items-start gap-2">
            <Clock
              size={16}
              className="mt-0.5 shrink-0 text-text-muted"
              aria-hidden="true"
            />
            <span>
              <span className="text-text-muted text-[11px] uppercase tracking-wider block mb-0.5">
                예상 소요
              </span>
              <span className="text-text-primary tabular-nums">{durationMin}분 내외</span>
            </span>
          </li>
        )}
      </ul>
    </aside>
  );
}
