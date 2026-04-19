# Contributing — JB 강의 사이트 콘텐츠 가이드

이 문서는 신규 clip 추가·기존 clip 수정 시 따를 콘텐츠 작성 패턴을 정리합니다. 페르소나 리뷰 사이클(웹/UX/마케터/교육기획자/수강생 윤서영)에서 누적된 결정 사항을 반영했습니다.

---

## 1. HighlightBox — `tip` vs `expert` 사용 기준

`<HighlightBox type="tip" | "warning" | "expert" | "important">`

### 분류 기준 (PR5/PR6 결정)

| Type | 가시성 | 사용 시점 |
|---|---|---|
| `tip` | **수강생 항상 가시** | 학습자가 진행 판단·실무 적용에 직접 영향. "어디까지 하면 충분", "왜 이렇게", "내 업무에 어떻게" |
| `expert` | **강사 모드에서만 가시** (URL `?mode=instructor` + 4h TTL) | 강사 운영 판단 전용. 시간 조절, 수강생 반응 안내, 진행 메타 |
| `warning` | 항상 가시 | 사전 요구사항·계정·보안·환경 제약 (예: 유료 계정 필요) |
| `important` | 항상 가시 | 콘텐츠 핵심 강조. 자주 쓰지 말 것 |

### 분리 기준 — "수강생에게도 영향 있나"

> 강사가 "이렇게 안내하세요" 톤이면 `expert`.
> 학습자가 "아 이렇게 하는구나" 인식하면 `tip`.

**예시** (PR6 ch05/c4 결정):
- 기존: `<HighlightBox type="expert">` "Sheets까지 끝내면 핵심 달성, Canvas는 옵션" — 강사 톤이지만 **수강생도 알아야 안심**
- 변경 후: 두 박스로 분리
  - `tip` "여기까지로도 이 클립의 핵심은 달성됩니다" (수강생용)
  - `expert` "강사 팁 — 시간 조절" (강사 운영용)

`expert` 분류 시 자문: *"수강생이 이 안내를 못 보면 학습 진행에 직접 손실이 생기는가?"* — Yes면 `tip` 또는 분리.

---

## 2. Checkpoint — Deliverables 작성 패턴

`<Checkpoint clipId="..." deliverables={[...]} handoff="..." />`

### 4-deliverable 표준 패턴 (PR9 A1 적용)

각 clip은 **4개의 deliverable**로 구성. 학습자가 체크박스로 진행 확인.

1. **즉시 산출물** — 이번 clip에서 만든 아티팩트 (URL, 파일, 메모)
2. **연결 자산** — 다음 clip 또는 챕터에서 재사용할 결과물
3. **루틴/적용 메모** — 반복 사용할 패턴, 템플릿, 캘린더 등록
4. **이번 주 적용 (Transfer Prompt)** — `이번 주 적용 — [챕터 표준 카피]` 형식

### Transfer Prompt 챕터별 표준 카피 (4번째 항목)

| 챕터 | 표준 4번째 deliverable |
|---|---|
| ch01 사전 준비 | "이번 주 적용 — 다음 출근일 아침 30분 안에, 오늘 본 흐름 1번 직접 재현" |
| ch02 듣기 | "이번 주 적용 — 이번 주 우리 팀 회의·녹음·설문 1건에 본 도구 적용" |
| ch03 말하기 | "이번 주 적용 — 이번 주 메일·공지·피드백 1건 작성에 본 흐름 활용" |
| ch04 질문하기 | "이번 주 적용 — 다음 인터뷰·조사 1건 준비에 페르소나·딥리서치 활용" |
| ch05 실행하기 | "이번 주 적용 — 다음 회의/프로젝트 1건의 액션·자료에 본 도구 적용" |
| ch06 설득하기 | "이번 주 적용 — 다음 보고/임원 미팅 1건 준비에 본 흐름 적용" |
| ch07 축적하기 | "이번 주 적용 — 이번 주 안에 우리 팀 백서·공유 자산 1개 시작" |

### handoff 작성 (옵션)

- 다음 clip이 있으면 자연스러운 연결 한 줄 (예: "다음 클립: 배경 자료 딥리서치로 간담회 준비를 마무리합니다.")
- 챕터 마지막 clip이면 다음 챕터 예고 (예: "다음 챕터(ch06): 이 타임라인을 경영진 보고 덱에 삽입할 준비를 합니다.")
- 본편 마지막(ch07/c3)이면 회고 또는 치트시트로 안내

### curriculum.json 동기화

`content/curriculum.json` 해당 clip의 `checkpointDeliverables: 4` 필드 확인. 수치가 MDX의 deliverables 배열 길이와 일치해야 홈 chapter 카드 결과물 합산이 정확.

---

## 3. 콘텐츠 컴포넌트 사용 시점

### `<BeforeAfter />` — Show, Don't Tell

- **위치**: 도입(scene 설명) 직후, 본 학습 단계 진입 전
- **목적**: AI 도입의 효과를 즉시 시각화
- **구성**:
  ```mdx
  <BeforeAfter
    clipId="ch0X/clipNN"
    before={{ label: "AI 없이", meta: "...", prompt: "...", result: "..." }}
    after={{ label: "Gemini와", meta: "...", prompt: "...", result: "..." }}
  />
  ```
- **meta**: 시간 표기 금지 (PR7에서 일괄 제거). "프롬프트 1회", "재사용 가능", "수작업 vs 자동" 같은 정성 표현 사용

### `<StepByStep />` — 절차적 학습

- **위치**: BeforeAfter 다음, 실제 학습자 행동 단계
- **steps 배열 길이**: 3~6 단계 권장. 7개 이상이면 단계 통합 또는 sub-step 검토
- **description**: 1~2문장. 클릭 위치·프롬프트 형식·예상 결과 명시

### `<PromptBlock />` — 복사 가능한 프롬프트

- **위치**: StepByStep 직후 (해당 step의 프롬프트가 길 때)
- **title**: "○○ 프롬프트" 형식
- **본문**: ` `` ` 텍스트 블록. 변수는 `[변수명]` 또는 `___` 형식

### `<DeepDiveSection />` — opt-in 심화

- **위치**: 본 학습 완료 후, Checkpoint 이전
- **clipId·id 속성** 둘 다 지정 (LS 키 `jb:deep-dive-open:<clipId>` 동기화용)
- **목적**: 수강생이 시간 부족 시 건너뛸 수 있는 심화 콘텐츠
- DEEP DIVE 챕터 전체(ch02/c4 RAG, ch05/c4 AI Studio, ch06/c4 System Instruction, ch07/c3 통합 파이프라인)는 별도 처리

### `<DeepDiveGate />` — clip 전체가 심화일 때

- **위치**: clip 페이지 자동 삽입 (curriculum.json `deepDive: true` 시)
- **수정 불필요** — 메타데이터(deepDiveNote)만 작성

### `<ComparisonTable />` — 다중 항목 비교

- **위치**: 개념 도입부 또는 도구 선택 가이드
- **rows**: 3~7행 권장. 그 이상은 가독성 저하

---

## 4. curriculum.json 신규 clip 추가 체크리스트

`content/curriculum.json`의 해당 chapter `clips` 배열에 항목 추가 시:

### 필수 필드
- [ ] `id`: `clipNN` (NN = 2자리 숫자, 챕터 내 순서)
- [ ] `title`: 학습자 노출 제목
- [ ] `type`: `"practice" | "overview" | "concept" | ...` (Clip 타입 enum)

### 권장 필드
- [ ] `firstTimeMin`: 초회 수강 시간(분). UI 미노출이지만 데이터 보존용
- [ ] `reuseMin`: 재수강 시간(분). 생략 시 firstTimeMin과 동일 간주
- [ ] `checkpointDeliverables`: **4** (PR9 A1 표준). MDX의 Checkpoint deliverables 배열 길이와 일치
- [ ] `deepDive`: `true`이면 DeepDiveGate 자동 삽입
- [ ] `deepDiveNote`: deepDive=true일 때 학습자 안내 한 줄

### 선택 필드 (PR9 A3 적용 챕터만)
- [ ] `stage`: `"기초 실습" | "실습 응용" | "심화"` — ch02/04/05/06에서 ClipTabs 뱃지로 표시

### MDX 파일
- [ ] `content/<chapterId>/<clipId>.mdx` 생성
- [ ] `# 제목` (curriculum.json title과 일치)
- [ ] 도입 scene 한 문단 → BeforeAfter → StepByStep → PromptBlock → (옵션) DeepDiveSection → "내 업무에 적용하기" tip → Checkpoint
- [ ] frontmatter는 사용 안 함 (frontmatter 없이 MDX 본문 시작)
- [ ] 시간 표기 금지 (`> ⏱`, "약 N분", "N분 내외" 등 — PR7 결정)

---

## 5. 단계 표시 라벨 (`stage` 필드) 결정 기준

PR9 A3에서 도입. **모든 챕터에 적용 X**, 자연스러운 단계 흐름이 있는 챕터에만.

### 적용 챕터 (현재 4개)
- **ch02 듣기** (4 clips)
- **ch04 질문하기** (3 clips)
- **ch05 실행하기** (4 clips)
- **ch06 설득하기** (4 clips)

### 비적용 챕터
- **ch01 사전 준비** — 체크리스트 성격. 단계 흐름이 아닌 독립적 준비 항목들
- **ch03 말하기** — clip 간 도구 다양성(Gmail/Vids/Gems)이 단계 분류와 직각
- **ch07 축적하기** — 실습 → 통합 구조. 단계 라벨로 표현하기 어색함
- **ch08 치트시트** — 참고 자료 모음

### 라벨 3종 (curriculum-planner 권고)
- `"기초 실습"` — 챕터의 첫 도구·개념 등장. 직접 따라하는 단계
- `"실습 응용"` — 첫 도구를 변형·확장. 자기 사례 입력
- `"심화"` — DEEP DIVE 또는 챕터 종합 응용

### 신규 챕터 추가 시
1. clip 흐름이 자연스러운 단계 패턴인가? (Yes → 적용)
2. 4-clip 챕터: 기초 / 기초 / 응용 / 심화 또는 기초 / 응용 / 응용 / 심화 등 변주 가능
3. 라벨이 학습 단계와 어긋나면 **적용 X**

---

## 6. GNB 도구 마커 mapping (TimelineNav.tsx)

`src/components/layout/TimelineNav.tsx`의 `CHAPTER_TOOL` 객체.

### 현재 매핑
```ts
const CHAPTER_TOOL = {
  ch01: { Icon: Sparkles, label: "Gemini" },
  ch02: { Icon: BookOpen, label: "NotebookLM" },
  ch03: { Icon: Mail, label: "Gmail · Gems" },
  ch04: { Icon: Search, label: "딥리서치 · Gems" },
  ch05: { Icon: Cpu, label: "AI Studio" },
  ch06: { Icon: Cpu, label: "AI Studio" },
  ch07: { Icon: BookOpen, label: "NotebookLM" },
};
```

### 신규 챕터 추가 시
1. 챕터의 **primary tool** 1개 선정 (curriculum.json `tools` 배열의 첫 항목 기준)
2. lucide-react에서 의미 매칭 아이콘 선택:
   - Gemini 일반: `Sparkles`
   - NotebookLM: `BookOpen`
   - AI Studio: `Cpu`
   - Gmail: `Mail`
   - 딥리서치: `Search`
   - Canvas: `PenLine` 또는 `LayoutGrid`
   - Vids: `Video`
3. label은 도구명 1~2개. 두 개면 `·` 구분
4. `CHAPTER_TOOL`에 `chXX: { Icon, label }` 항목 추가

---

## 7. 페르소나 리뷰 사이클 (PR 반영 시)

대규모 콘텐츠/UX 변경은 5인 페르소나 리뷰 권장:
- **웹디자이너** — 시각·일관성·반응형
- **UX디자이너** — 학습자 동선·접근성
- **마케터** — Hero·전환·메시지 일관성 (현재 분석 채널 없음 = GA4 제거)
- **교육기획자** — 커리큘럼 일관성·챕터 정체성
- **수강생 윤서영 페르소나** — 학습자 직접 체험

권고 합의도가 높은 항목만 반영. 합의 결렬 항목은 PR 본문에 명시 이연.

---

## 부록 — 자주 나오는 결정 패턴

### "이 콘텐츠를 ch01에 둘까, ch02로 옮길까?"
- **just-in-time**이 default. 학습자가 그 도구·개념을 즉시 사용하는 시점에 노출
- advance organizer로 미리 노출하려면 "이름 + 한 줄" 수준 (PR8 Materials Pack Gems 결정)
- 본문 중간에 다른 챕터 콘텐츠를 길게 끼워넣으면 narrative break (PR8 ch01/c2 Gems 미리보기 결정)

### "deliverable 4개가 너무 많지 않나?"
- 4개는 PR9 표준. 1·2·3은 산출물·연결·루틴, 4번은 transfer prompt
- 학습자가 모두 체크해야 하는 강제 X — 진행률 분모로만 작동

### "DEEP DIVE clip을 별도로 둘까, 본 clip의 DeepDiveSection으로 둘까?"
- 챕터 전체가 심화 주제 → 별도 clip + curriculum.json `deepDive: true`
- 챕터 본 흐름 안의 옵션 심화 → DeepDiveSection 컴포넌트 (학습자가 토글)
