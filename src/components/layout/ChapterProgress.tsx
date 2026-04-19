"use client";

import { useEffect, useState } from "react";
import { loadProgress, getChapterCompletion } from "@/lib/progress";

type Props = {
  /** 현재 챕터 내 모든 clip의 fullId 배열 */
  clipIds: string[];
  /** 완주 기준 (PR9 A1 표준 = 4) */
  expectedDeliverablesPerClip?: number;
};

/**
 * Clip 페이지 ClipTabs 아래에 sticky 진행률 바 (B1).
 * 챕터 완주 비율을 시각적으로 표시. SSR에선 0% (미렌더 X — 레이아웃 시프트 방지).
 * progress 0이면 invisible 처리 (공간은 유지).
 */
export default function ChapterProgress({
  clipIds,
  expectedDeliverablesPerClip = 4,
}: Props) {
  const [completion, setCompletion] = useState<{ complete: number; total: number }>({
    complete: 0,
    total: clipIds.length,
  });

  useEffect(() => {
    const state = loadProgress();
    setCompletion(getChapterCompletion(state, clipIds, expectedDeliverablesPerClip));

    // localStorage 변경 시 자동 갱신 (다른 탭에서 변화 + 같은 탭 progress 갱신)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "jb:progress:v1") {
        setCompletion(getChapterCompletion(loadProgress(), clipIds, expectedDeliverablesPerClip));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [clipIds, expectedDeliverablesPerClip]);

  const percent = completion.total > 0 ? (completion.complete / completion.total) * 100 : 0;
  const visible = percent > 0;

  return (
    <div
      className="sticky top-[calc(var(--nav-offset)+44px+44px)] z-10 h-[3px] bg-[var(--color-cream-dark)]/40"
      role="progressbar"
      aria-valuenow={completion.complete}
      aria-valuemin={0}
      aria-valuemax={completion.total}
      aria-label={`챕터 완주 진행률: ${completion.complete}/${completion.total} 클립`}
      title={visible ? `${completion.complete}/${completion.total} 완주` : "아직 완주한 클립이 없습니다"}
    >
      <div
        className="h-full bg-[var(--color-tag-practice)] transition-[width] duration-300 ease-out"
        style={{ width: `${percent}%`, opacity: visible ? 1 : 0 }}
      />
    </div>
  );
}
