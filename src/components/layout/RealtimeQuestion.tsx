"use client";

import { MessageSquarePlus } from "lucide-react";
import { track } from "@/lib/analytics";

// NEXT_PUBLIC_QUESTION_URL 설정 전까지 버튼 자체를 숨긴다.
// 추후 Padlet URL을 env로 주입할 예정.
function resolveQuestionUrl(): string | null {
  const env = process.env.NEXT_PUBLIC_QUESTION_URL;
  if (env && !env.includes("REPLACE-ME")) return env;
  return null;
}

export default function RealtimeQuestion() {
  const QUESTION_URL = resolveQuestionUrl();
  if (!QUESTION_URL) return null;

  return (
    <a
      href={QUESTION_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("realtime_question_open")}
      className="realtime-cta fixed right-4 z-50 inline-flex items-center gap-2 px-4 min-h-[44px] rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-[background-color,color,box-shadow] duration-500"
      style={{
        bottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
      }}
      aria-label="실시간 질문 남기기"
    >
      <MessageSquarePlus size={16} />
      <span className="hidden sm:inline">질문 남기기</span>
    </a>
  );
}
