# 강사 온보딩 — JB 강의 사이트 운영 가이드

이 문서는 본 사이트로 강의를 진행하는 강사용 운영 매뉴얼입니다. 회의 결정 + 5인 페르소나 합의를 반영합니다.

---

## 0. 핵심 원칙

> **사이트 = 최신 단일 소스 (Single Source of Truth)**
> 콘텐츠 수정·예시 교체·강사 팁 추가 등 모든 변경은 사이트(`content/curriculum.json` + MDX)에서 먼저 발생합니다. PDF 슬라이드를 별도로 만들 경우, 사이트 내용을 기준으로 파생합니다. **PDF가 사이트와 다르면 사이트가 정답입니다.**

이유 (curriculum-planner 권고):
- 사이트 강사 모드(URL toggle / Alt+Shift+I / 4h TTL / idle 가드)가 라이브 진행 중 실시간 참조 도구로 작동
- PDF는 배포 후 소유권 이전 — 강사가 콘텐츠 업데이트할 수 있는 유일한 채널이 사이트
- 강사별로 PDF를 따로 들고 다니면 버전 드리프트 위험

---

## 1. 강사 모드 진입 — 3가지 경로

### 경로 1: URL 쿼리 (가장 자주 쓰는 방법)
- 강의 시작 전 강의용 노트북에서 사이트 진입 시 URL에 `?mode=instructor` 추가
- 예: `https://gemini-lecture-jb.vercel.app/ch01/clip01?mode=instructor`
- 진입 즉시 4시간 TTL 시작, URL 쿼리는 자동 제거 (브라우저 히스토리 깔끔)

### 경로 2: 키보드 단축키 — `Alt + Shift + I`
- 어느 페이지에서나 토글 가능
- 입력란(`<input>`, `<textarea>`)에서는 작동 X (충돌 방지)
- 강의 중 강사 콘텐츠 빠르게 토글할 때 유용

### 경로 3: 치트시트 토글 버튼
- `/ch08/clip01` (실전 치트시트) 페이지 말미에 InstructorToggle 버튼
- 마우스로 명시적 전환 — 강의 시작 직전 정착감 있게 활성화

---

## 2. 강사 모드 동작 사양

### TTL: 4시간
- 실강의 4h 운영 기준 (회의 결정)
- 강의 시작 시 활성 → 강의 종료 시점에 자연 만료
- **4h 초과 강의 시**: 단축키(Alt+Shift+I) 또는 URL 쿼리로 재활성

### Idle 가드: 15분
- 활성 상태에서 15분 무활동(mousemove/keydown/click/scroll/touchstart) 시 자동 exit
- **공용 강의실 PC에서 강사 이탈 후 다음 사용자가 강사 콘텐츠 접하는 위험 차단**
- 강의 중 활동 있으면 timer reset

### 표시 위치
- 우측 하단: 강사 모드 활성 인디케이터 (체류 시간 표시)
- expert HighlightBox: 강사 모드에서만 가시 (수강생 화면 영향 X)

---

## 3. 콘텐츠 매체 분리 (PDF·패들렛 운영)

### PDF 슬라이드 (선택)
- 회의 원안: 16:9 PDF 메인 → 사용자 결정으로 **사이트가 메인**, PDF는 보조 자료
- 만들 경우 `content/curriculum.json` + MDX 본문에서 파생
- **사이트 수정 → PDF 동기화 체크리스트 필요** (콘텐츠 수정 1건 = 두 매체 모두 갱신)

### 패들렛 (실시간 질문)
- 운영 권고: **강사별 개별 board 복제** (회의 결정)
- 사이트의 `NEXT_PUBLIC_QUESTION_URL` 환경변수로 board URL 주입
- 미설정 시 fallback URL(`https://padlet.com/dashboard`)로 진입 — 강사 board 안내 필요
- 권장: 강의 시작 시 강사가 본인 board QR/링크를 화면에 별도 공유

---

## 4. 강의 진행 시 사이트 동선

### 강의 시작 전 (10분)
1. 강의용 노트북에서 사이트 진입 (URL `?mode=instructor` 또는 단축키)
2. 우측 하단 "강사 모드 켜짐" 인디케이터 확인
3. `/field-materials-pack` 페이지에서 NotebookLM 노트북·원본 자료 4종·Gem 5종 미리보기 안내
4. (옵션) 강사 본인의 패들렛 board URL을 칠판/슬라이드에 공유

### 강의 중
- 챕터 진입 = `/chXX/clipNN` (또는 GNB dot 클릭)
- ClipTabs에서 현재 clip 위치 확인
- 강사 모드 켜져 있으면 expert 박스가 본문에 자동 노출
- **장시간 화면 비활성 시 idle 가드(15분)로 자동 exit** — 다시 단축키로 재활성

### 강의 종료
- 4h TTL 자연 만료 (별도 행동 불필요)
- 또는 단축키 / 인디케이터의 "지금 해제" 버튼으로 즉시 종료

---

## 5. 콘텐츠 변경 워크플로

콘텐츠 수정·예시 교체·신규 clip 추가는 [`CONTRIBUTING.md`](./CONTRIBUTING.md) 참조.

### 빠른 수정 시
- `content/curriculum.json` (메타데이터: title·stage·period 등)
- `content/<chapterId>/<clipId>.mdx` (본문)
- 둘 다 수정 후 `npm run build`로 34/34 static 통과 확인

### 큰 변경 시
- 페르소나 리뷰 사이클 권장 (CONTRIBUTING.md 9. 섹션)
- 합의 결렬 항목은 별 PR로 이연

---

## 6. 잘못 알기 쉬운 것 (FAQ)

**Q. 강사 모드를 켰는데 expert 박스가 안 보입니다.**
- A. 페이지 새로고침. 또는 우측 하단 인디케이터 확인 (없으면 모드 비활성). 단축키 다시 눌러보세요.

**Q. 4시간이 넘는 강의는 어떻게 진행하나요?**
- A. 4h TTL 만료 시 단축키(`Alt+Shift+I`)로 재활성. 또는 URL에 `?mode=instructor` 다시 진입.

**Q. 학습자가 강사 콘텐츠를 봤다고 합니다.**
- A. 가능성 1: 학습자가 직접 URL 쿼리를 알고 사용 (의도적). 가능성 2: 강사 본인 PC에서 학습자가 idle 가드 만료 전 봄. **공용 PC 강의 후 반드시 인디케이터의 "지금 해제" 클릭 권장.**

**Q. PDF와 사이트 내용이 다를 때 어느 게 맞나요?**
- A. **사이트가 정답.** PDF는 만든 시점의 스냅샷. 사이트는 최신 콘텐츠 단일 소스.

**Q. 다른 기업 강의에 재활용 가능한가요?**
- A. 네. 사이트는 기업 중립 (5대 기업 사례 = 공개 정보 기반). 기업 특화 카피·이모티콘 등은 PDF·패들렛에서 추가 처리. 사이트 코드는 수정 없이 어느 기업에도 적용 가능.

---

## 7. 운영 문제 보고

코드·데이터·UI 버그는 GitHub Issue로:
- https://github.com/Dami-Shin-01/gemini-lecture/issues

콘텐츠 수정 권장은 PR로:
- 페르소나 리뷰 사이클 거친 후 머지 (CONTRIBUTING.md 9. 섹션)
