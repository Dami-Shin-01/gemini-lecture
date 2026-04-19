"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { loadProgress, getChapterCompletion } from "@/lib/progress";

type Props = {
  /** 챕터 내 모든 clip의 fullId 배열 (예: ["ch02/clip01", "ch02/clip02"]) */
  clipIds: string[];
  /** 완주 기준 (PR9 A1 표준 = 4) */
  expectedDeliverablesPerClip?: number;
};

/**
 * 홈 chapter 카드에 "X/Y 완주" 표시 (B1).
 * SSR에선 미렌더, hydration 후 localStorage 읽어 X/Y 표시.
 * X = 0이면 미노출 (학습 시작 안 한 상태).
 */
export default function ChapterCompletion({
  clipIds,
  expectedDeliverablesPerClip = 4,
}: Props) {
  const [completion, setCompletion] = useState<{ complete: number; total: number } | null>(
    null
  );

  useEffect(() => {
    const state = loadProgress();
    setCompletion(getChapterCompletion(state, clipIds, expectedDeliverablesPerClip));
  }, [clipIds, expectedDeliverablesPerClip]);

  if (!completion || completion.complete === 0) return null;

  return (
    <span
      role="img"
      className="inline-flex items-center gap-1 tabular-nums text-text-secondary"
      aria-label={`이 챕터에서 ${completion.complete}개 클립 완주, 총 ${completion.total}개`}
    >
      <CheckCircle2
        size={12}
        className="text-[var(--color-tag-practice)]"
        aria-hidden="true"
      />
      {completion.complete}/{completion.total} 완주
    </span>
  );
}
