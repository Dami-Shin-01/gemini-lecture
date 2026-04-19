import type { Clip, Chapter } from "@/lib/types";

/** clip 첫 수강 기준 분. firstTimeMin 우선, 없으면 durationMin 폴백. */
export function firstTime(clip: Clip): number {
  return clip.firstTimeMin ?? clip.durationMin ?? 0;
}

/** clip 재수강 기준 분. reuseMin 있으면 그 값, 없으면 firstTime과 동일. */
export function reuseTime(clip: Clip): number {
  return clip.reuseMin ?? firstTime(clip);
}

/** 챕터 전체 초회 합산 */
export function sumFirstTime(clips: Clip[]): number {
  return clips.reduce((sum, c) => sum + firstTime(c), 0);
}

/** 챕터 전체 재수강 합산 */
export function sumReuseTime(clips: Clip[]): number {
  return clips.reduce((sum, c) => sum + reuseTime(c), 0);
}

/** 첫 수강과 재수강이 다른지 (표시에 "처음 X · 재수강 Y" 이중 표기할지 판단) */
export function hasReuseDelta(clips: Clip[]): boolean {
  const first = sumFirstTime(clips);
  const reuse = sumReuseTime(clips);
  return first !== reuse && reuse > 0;
}

export function chapterTotal(chapter: Chapter): { firstTime: number; reuseTime: number; hasDelta: boolean } {
  return {
    firstTime: sumFirstTime(chapter.clips),
    reuseTime: sumReuseTime(chapter.clips),
    hasDelta: hasReuseDelta(chapter.clips),
  };
}
