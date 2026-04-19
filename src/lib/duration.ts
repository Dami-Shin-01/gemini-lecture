import type { Clip, Chapter } from "@/lib/types";

// durationMin 이원화 배경:
// - 같은 clip이라도 "처음 따라 하는 사람"과 "이미 해봤는데 다시 참고하러 온 사람"의
//   실제 소요가 다르다. 실습 설명·프롬프트 복붙·확인 단계가 2회차부터 대폭 줄기 때문.
// - 기본값(firstTimeMin 미지정 시 durationMin 폴백)은 초회 기준이다. 홈/챕터 카드는
//   초회 분을 기본 표기하고, 재수강 값이 다를 때만 "재수강 Y분"을 병기한다.
// - reuseMin은 curriculum.json에서 clip별로 수동 지정한다. 경험칙 비율:
//   · 리서치/탐색 clip(딥리서치·벤치마크): 초회의 ≈40% (아웃풋을 이미 알고 있음)
//   · 프롬프트 복붙/실습 clip: 초회의 ≈50% (Gems/템플릿 재사용)
//   · 의사결정/회고 clip: 초회의 ≈70% (매번 내용이 달라져 단축 폭이 작음)
// 이 비율은 강한 룰이 아니라 참고치. 측정 데이터가 쌓이면 재조정한다.

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
