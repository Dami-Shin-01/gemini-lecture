"use client";

import TrackedLink from "@/components/analytics/TrackedLink";
import { Target, CheckCircle, Clock, ArrowRight } from "lucide-react";

interface Props {
  /** curriculum.json의 deepDiveNote — 얻는 것 설명 */
  note?: string;
  /** 예상 소요시간(분) */
  durationMin?: number;
  /** 기본 실습 대안 경로 문구 */
  fallbackHint?: string;
  /** 건너뛰어 이동할 다음 clip 경로 (없으면 CTA 비노출) */
  skipHref?: string;
  /** 현재 clip 식별자 (analytics용) */
  clipId?: string;
}

export default function DeepDiveGate({
  note,
  durationMin,
  fallbackHint = "기본 실습만 원한다면 이 심화 섹션을 건너뛰어도 챕터 목표는 달성됩니다.",
  skipHref,
  clipId,
}: Props) {
  return (
    <aside
      role="region"
      aria-label="심화 실습 안내"
      className="mb-8 pl-5 py-4 border-l-4"
      style={{ borderLeftColor: "var(--color-time-accent)" }}
    >
      <p className="kicker mb-3">DEEP DIVE · 심화 실습 안내</p>

      <ul className="flex flex-col gap-2 text-sm mb-4">
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
              {note ?? "이 클립에서만 다루는 한 단계 더 깊은 실습입니다."}
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

      <div className="flex flex-wrap items-center gap-3 text-xs">
        {skipHref && (
          <TrackedLink
            href={skipHref}
            event="deepgate_fallback_click"
            eventParams={clipId ? { clip_id: clipId } : {}}
            className="inline-flex items-center gap-1 min-h-[44px] px-3 rounded-full border border-cream-dark text-text-secondary hover:text-text-primary hover:bg-cream-dark/40 transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            기본 실습으로 건너뛰기
            <ArrowRight size={14} />
          </TrackedLink>
        )}
        <a
          href="#deep-dive-body"
          onClick={(e) => {
            e.preventDefault();
            const body = document.getElementById("deep-dive-body");
            if (body) {
              const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
              body.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
              body.focus({ preventScroll: true });
            }
          }}
          className="inline-flex items-center gap-1 min-h-[44px] px-3 text-text-muted hover:text-[var(--color-accent)] transition-colors"
        >
          심화 그대로 읽기 ↓
        </a>
      </div>
    </aside>
  );
}
