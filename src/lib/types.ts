export interface Clip {
  id: string;
  title: string;
  duration?: string;
  durationMin?: number;
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
