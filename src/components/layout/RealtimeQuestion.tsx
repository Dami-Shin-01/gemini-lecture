"use client";

import { MessageSquarePlus } from "lucide-react";

// 강의 중 실시간 질문 채널 (Padlet 등). 우하단 fixed 버튼.
// 우선순위: NEXT_PUBLIC_QUESTION_URL env > FALLBACK_URL > 미노출
//
// FALLBACK_URL: env 미설정 시에도 버튼이 보이도록 임시 URL.
// 강의 운영 시 실제 Padlet/Slack/Discord URL로 교체 권장 (코드 수정 또는 env 주입).
const FALLBACK_URL = "https://padlet.com/dashboard";

function resolveQuestionUrl(): string | null {
  const env = process.env.NEXT_PUBLIC_QUESTION_URL;
  if (env && !env.includes("REPLACE-ME")) return env;
  return FALLBACK_URL;
}

export default function RealtimeQuestion() {
  const QUESTION_URL = resolveQuestionUrl();
  if (!QUESTION_URL) return null;

  return (
    <a
      href={QUESTION_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="realtime-cta fixed right-4 z-50 inline-flex items-center gap-2 px-4 min-h-[44px] rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-[background-color,color,box-shadow] duration-500"
      style={{
        bottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
      }}
      aria-label="실시간 질문 남기기"
    >
      <MessageSquarePlus size={16} aria-hidden="true" />
      <span className="hidden sm:inline">질문 남기기</span>
    </a>
  );
}
