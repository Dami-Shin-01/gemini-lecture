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
  /** Checkpoint deliverables 개수(없으면 0). GA dimension 용. */
  checkpointDeliverables?: number;
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
