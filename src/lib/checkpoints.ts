// Checkpoint가 장착된 clip 식별자 집합. MDX에 `<Checkpoint />`가 있는 clip만 포함.
// PR5에서 curriculum.json의 `checkpointDeliverables` 필드로 이관 예정.

const CHECKPOINT_CLIPS: ReadonlySet<string> = new Set([
  "ch01/clip01",
  "ch01/clip02",
  "ch01/clip03",
  "ch02/clip01",
  "ch02/clip02",
  "ch02/clip03",
  "ch02/clip04",
  "ch03/clip01",
  "ch03/clip02",
  "ch03/clip03",
  "ch04/clip01",
  "ch04/clip02",
  "ch05/clip01",
  "ch05/clip02",
  "ch05/clip04",
  "ch06/clip03",
  "ch06/clip04",
  "ch07/clip01",
  "ch07/clip02",
  "ch07/clip03",
]);

const DEFAULT_DELIVERABLES = 3;

export function getDeliverableCount(chapterId: string, clipId: string): number {
  return CHECKPOINT_CLIPS.has(`${chapterId}/${clipId}`) ? DEFAULT_DELIVERABLES : 0;
}

export function hasCheckpoint(chapterId: string, clipId: string): boolean {
  return CHECKPOINT_CLIPS.has(`${chapterId}/${clipId}`);
}
