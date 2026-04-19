import { getCurriculum } from "./navigation";

// Checkpoint 메타 단일 출처 = curriculum.json의 `checkpointDeliverables` (개수).
//
// 원칙 (PR4 → PR6 이관 완료):
// - 커버리지는 24/24 (모든 본편 clip). ch01~ch07의 모든 clip은 Checkpoint를
//   가져야 한다. 수강생이 "다음으로" 흐름을 잃지 않도록, 재수강용 체크리스트를
//   남기도록, 그리고 deliverable 수가 progress bar의 분모가 되기 때문에 예외 없음.
// - DeepDiveSection은 Checkpoint 생략 사유가 되지 않는다. 심화 섹션은
//   opt-in 가림막일 뿐, 클립 자체의 완료 기준과는 독립이다.
// - 신규 clip 추가 시 curriculum.json의 해당 clip에 `checkpointDeliverables: N`을
//   기록한다. MDX `<Checkpoint deliverables={[...]} />` 배열 길이와 N이 일치해야 한다.

function findClip(chapterId: string, clipId: string) {
  const chapter = getCurriculum().chapters.find((c) => c.id === chapterId);
  return chapter?.clips.find((c) => c.id === clipId) ?? null;
}

export function getDeliverableCount(chapterId: string, clipId: string): number {
  return findClip(chapterId, clipId)?.checkpointDeliverables ?? 0;
}

export function hasCheckpoint(chapterId: string, clipId: string): boolean {
  return getDeliverableCount(chapterId, clipId) > 0;
}
