export type GlossaryTier = "basic" | "applied" | "advanced";

export type GlossaryTerm = {
  id: string;
  term: string;
  short: string; // 홈 카드용 1줄 설명
  usage: string; // 홈 카드용 "언제 쓰는지"
  detail: string; // 치트시트용 2~4줄 설명
  tier: GlossaryTier;
};

export const glossary: GlossaryTerm[] = [
  {
    id: "gemini",
    term: "Gemini",
    tier: "basic",
    short: "Google의 멀티모달 AI 비서",
    usage: "일반 대화 · 초안 작성 · 빠른 리서치",
    detail:
      "텍스트·이미지·음성을 함께 이해하는 Google의 대표 AI. 사이트·문서·코드를 다루며 Canvas와 Workspace에 연결됩니다.",
  },
  {
    id: "notebooklm",
    term: "NotebookLM",
    tier: "basic",
    short: "내가 올린 문서만 근거로 답하는 리서치 도구",
    usage: "간담회 속기록 · 설문 · 정책 문서 분석",
    detail:
      "업로드한 소스에만 기반해 답하는 RAG 기반 도구. 출처 앵커가 자동 표시돼 경영진 보고·컴플라이언스에 유리합니다.",
  },
  {
    id: "gems",
    term: "Gems",
    tier: "basic",
    short: "특정 역할로 고정한 맞춤 Gemini",
    usage: "반복 업무 자동화 · 페르소나 인터뷰",
    detail:
      "지시사항·말투·금지사항을 미리 고정해둔 맞춤 Gemini 인스턴스. VoE 분석가 · 페르소나 인터뷰어 같은 반복 업무에 적합합니다.",
  },
  {
    id: "canvas",
    term: "Canvas",
    tier: "basic",
    short: "Gemini 안의 문서·웹 편집 작업실",
    usage: "보고서 초안 · 공유 페이지 · 긴 글",
    detail:
      "Gemini 대화 안에서 문서나 웹페이지를 AI와 함께 편집하는 공간. 피드백을 즉시 반영하고 다른 형식으로 전환할 수 있습니다.",
  },
  {
    id: "workspace",
    term: "Workspace 연계",
    tier: "applied",
    short: "Gmail·Docs·Drive와 Gemini의 연결",
    usage: "메일 초안 · 문서 요약 · 자료 공유",
    detail:
      "Google Workspace(Gmail/Docs/Drive/Slides)와 Gemini가 주고받도록 연결하는 설정. 기존 업무 흐름에 AI를 붙이는 출발점입니다.",
  },
  {
    id: "deep-research",
    term: "딥리서치",
    tier: "applied",
    short: "웹 전반을 자동 탐색해 보고서로 정리",
    usage: "벤치마크 · 시장 조사 · 배경 리서치",
    detail:
      "Deep Research 모드. 여러 웹 출처를 자동으로 수집·정리해 링크가 포함된 리서치 보고서 형태로 제공합니다.",
  },
  {
    id: "system-instruction",
    term: "System Instruction",
    tier: "applied",
    short: "모델에게 주는 역할·말투·금지사항",
    usage: "Gem 제작 · AI Studio 튜닝",
    detail:
      "대화 상단에 미리 고정해두는 지시문. 모델의 페르소나·말투·답변 금지사항을 정의합니다.",
  },
  {
    id: "grounding",
    term: "Grounding (출처 앵커)",
    tier: "applied",
    short: "답변이 어느 문서·문장에서 왔는지 추적",
    usage: "경영진 보고 · 컴플라이언스",
    detail:
      "모델 답변의 각 문장이 어느 소스에서 왔는지 표시하는 기능. NotebookLM의 핵심 가치로, 환각을 현저히 줄입니다.",
  },
  {
    id: "google-slides",
    term: "Google Slides",
    tier: "applied",
    short: "Gemini 사이드 패널이 붙은 프레젠테이션",
    usage: "경영진 덱 · 공용 템플릿 · Canvas export 대상",
    detail:
      "Workspace의 프레젠테이션 도구. 우측 Gemini 사이드 패널로 슬라이드 구성 제안·이미지 생성·스피커 노트 자동 작성이 가능하고, Canvas에서 만든 초안을 '템플릿 적용하여 내보내기'로 회사 공식 덱에 정식 이관하는 마지막 관문 역할을 합니다.",
  },
  {
    id: "google-vids",
    term: "Google Vids",
    tier: "applied",
    short: "프롬프트로 장면·스크립트·미디어를 구성하는 AI 영상 도구",
    usage: "오프닝 영상 · 타운홀 인트로 · 내부 공지 영상",
    detail:
      "Workspace의 AI 영상 제작 도구. 프롬프트로 장면 구성·내레이션·자막·스톡 이미지 배치를 받아냅니다. 엔터프라이즈 Workspace 에디션에서만 노출되며, 접근이 막히면 Slides 자동 재생 또는 Canvas 영상 요약으로 대체합니다.",
  },
  {
    id: "ai-studio",
    term: "AI Studio",
    tier: "advanced",
    short: "Gemini API 테스트·튜닝 콘솔",
    usage: "덱 자동 생성 · 프롬프트 정밀 조정",
    detail:
      "System Instruction과 Temperature를 직접 조정해 모델 동작을 튜닝하는 개발자용 콘솔. Function Calling 같은 고급 기능도 실험 가능합니다.",
  },
  {
    id: "temperature",
    term: "Temperature",
    tier: "advanced",
    short: "답변의 일관성 ↔ 창의성 비율",
    usage: "일관성이 필요한 요약은 낮게, 발산이 필요한 카피는 높게",
    detail:
      "0에 가까울수록 같은 답이 일관되게 나오고, 1에 가까울수록 다채로워집니다. 과업 성격에 맞게 고릅니다.",
  },
];

export const tierLabel: Record<GlossaryTier, string> = {
  basic: "기초",
  applied: "응용",
  advanced: "고급",
};
