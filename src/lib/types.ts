export interface Clip {
  id: string;
  title: string;
  duration?: string;
  type: "overview" | "concept" | "framework" | "comparison" | "practice" | "tool" | "challenge";
}

export interface Chapter {
  id: string;
  title: string;
  time: string;
  timeLabel: string;
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
