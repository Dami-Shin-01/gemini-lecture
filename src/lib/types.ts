export interface Clip {
  id: string;
  title: string;
  duration?: string;
  /** @deprecated firstTimeMin로 마이그레이션 중. 런타임 폴백으로만 사용. */
  durationMin?: number;
  /** 초회(첫 수강) 기준 소요시간(분) */
  firstTimeMin?: number;
  /** 재수강 시 소요시간(분). 생략 시 firstTimeMin과 동일 간주. */
  reuseMin?: number;
  /** Checkpoint deliverables 개수(없으면 0). 홈 chapter 카드 결과물 뱃지의 합산 단위. */
  checkpointDeliverables?: number;
  /** 학습 단계 라벨 (옵션) — 적용 챕터 ch02/04/05/06만 사용. ClipTabs에 작은 뱃지로 표시.
   * curriculum-planner 평가에 따라 자연스러운 이론→실습→심화 흐름이 있는 챕터에만 적용. */
  stage?: "기초 실습" | "실습 응용" | "심화";
  type: "overview" | "concept" | "framework" | "comparison" | "practice" | "tool" | "challenge";
  deepDive?: boolean;
  deepDiveNote?: string;
}

export type TimePhase = "morning" | "noon" | "evening" | "archive";

export interface Chapter {
  id: string;
  title: string;
  time?: string;
  timeLabel?: string;
  phase?: TimePhase;
  colorTag: string;
  type: "overview" | "concept" | "framework" | "practice" | "tool" | "project";
  clips: Clip[];
}

export interface Curriculum {
  title: string;
  subtitle: string;
  chapters: Chapter[];
}

export interface ClipNavigation {
  prev: { chapter: Chapter; clip: Clip } | null;
  next: { chapter: Chapter; clip: Clip } | null;
  current: { chapter: Chapter; clip: Clip };
}
