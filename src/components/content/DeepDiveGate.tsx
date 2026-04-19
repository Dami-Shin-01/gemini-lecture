"use client";

import { useCallback } from "react";
import TrackedLink from "@/components/analytics/TrackedLink";
import { track } from "@/lib/analytics";
import { Target, CheckCircle, Clock, ArrowRight, ChevronDown } from "lucide-react";

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

function setDeepState(clipId: string, state: "open" | "closed") {
  try {
    window.localStorage.setItem(
      `jb:deep-dive-open:${clipId}`,
      state === "open" ? "true" : "false"
    );
  } catch {
    // 저장 실패는 사용자 경험 영향 없음
  }
  document
    .querySelectorAll<HTMLDetailsElement>(
      `details[data-deep-section][data-clip-id="${clipId}"]`
    )
    .forEach((d) => {
      d.open = state === "open";
    });
}

export default function DeepDiveGate({
  note,
  durationMin,
  fallbackHint = "기본 실습만 원한다면 이 심화 섹션을 건너뛰어도 챕터 목표는 달성됩니다.",
  skipHref,
  clipId,
}: Props) {
  const onContinue = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (clipId) {
        track("deepgate_continue_click", { clip_id: clipId });
        setDeepState(clipId, "open");
      } else {
        track("deepgate_continue_click");
      }
      // 첫 Section 또는 deep-dive-body로 스크롤
      const firstSection = clipId
        ? document.querySelector<HTMLDetailsElement>(
            `details[data-deep-section][data-clip-id="${clipId}"]`
          )
        : null;
      const target =
        firstSection ?? document.getElementById("deep-dive-body");
      if (target) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        });
        if (target instanceof HTMLElement) {
          target.focus({ preventScroll: true });
        }
      }
    },
    [clipId]
  );

  const onSkip = useCallback(() => {
    if (clipId) setDeepState(clipId, "closed");
  }, [clipId]);

  return (
    <aside
      role="region"
      aria-label="심화 실습 안내"
      className="mb-8 rounded-lg p-4 sm:p-5"
      style={{
        backgroundColor: "color-mix(in srgb, var(--color-time-accent) 8%, transparent)",
        border: "1px solid color-mix(in srgb, var(--color-time-accent) 30%, transparent)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Target
          size={18}
          className="shrink-0"
          style={{ color: "var(--color-time-accent)" }}
          aria-hidden="true"
        />
        <p className="kicker !text-[11px]">DEEP DIVE · 심화 실습 안내</p>
      </div>

      <ul className="flex flex-col gap-2 text-sm mb-4">
        <li className="flex items-start gap-2">
          <span
            className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "var(--color-time-accent)" }}
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
            size={14}
            className="mt-1 shrink-0 text-[var(--color-tag-practice)]"
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
              size={14}
              className="mt-1 shrink-0 text-text-muted"
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
            onClick={onSkip}
            className="inline-flex items-center gap-1 min-h-[44px] px-3 rounded-full border border-cream-dark text-text-secondary hover:text-text-primary hover:bg-cream-dark/40 transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            기본 경로 먼저 끝내고 돌아오기
            <ArrowRight size={14} />
          </TrackedLink>
        )}
        <a
          href="#deep-dive-body"
          onClick={onContinue}
          className="inline-flex items-center gap-1 min-h-[44px] px-3 rounded-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          심화 그대로 시작
          <ChevronDown size={14} />
        </a>
      </div>
    </aside>
  );
}
