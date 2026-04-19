// Checkpoint가 장착된 clip 식별자 집합. MDX에 `<Checkpoint />`가 있는 clip만 포함.
//
// 원칙 (PR4 QA에서 결정됨):
// - **커버리지는 24/24 (모든 본편 clip)**. ch01~ch07의 모든 clip은 Checkpoint를
//   가져야 한다. 수강생이 "다음으로" 흐름을 잃지 않도록, 재수강용 체크리스트를
//   남기도록, 그리고 deliverable 수가 progress bar의 분모가 되기 때문에 예외 없음.
// - **DeepDiveSection은 Checkpoint 생략 사유가 되지 않는다.** 심화 섹션은
//   opt-in 가림막일 뿐, 클립 자체의 완료 기준과는 독립이다.
// - MDX에 `<Checkpoint>`를 추가할 때마다 이 Set에도 등록한다. PR5에서
//   curriculum.json의 `checkpointDeliverables` 필드로 이관 예정이며, 그때
//   이 Set은 제거된다.

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
  "ch04/clip03",
  "ch05/clip01",
  "ch05/clip02",
  "ch05/clip03",
  "ch05/clip04",
  "ch06/clip01",
  "ch06/clip02",
  "ch06/clip03",
  "ch06/clip04",
  "ch07/clip01",
  "ch07/clip02",
  "ch07/clip03",
]);

// 3은 Checkpoint 컴포넌트의 DEFAULT_DELIVERABLES와 동일한 값.
// 산출물 3개는 "기본 저장 1개 + 다음 클립 연결용 자산 1개 + 업무 적용 메모 1개"
// 패턴으로 설계되어 있다. MDX에서 4개 이상을 명시하면 실제 개수를 취한다 (Checkpoint 컴포넌트의 deliverables prop 기반).
const DEFAULT_DELIVERABLES = 3;

export function getDeliverableCount(chapterId: string, clipId: string): number {
  return CHECKPOINT_CLIPS.has(`${chapterId}/${clipId}`) ? DEFAULT_DELIVERABLES : 0;
}

export function hasCheckpoint(chapterId: string, clipId: string): boolean {
  return CHECKPOINT_CLIPS.has(`${chapterId}/${clipId}`);
}
