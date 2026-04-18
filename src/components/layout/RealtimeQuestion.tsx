"use client";

import { MessageSquarePlus } from "lucide-react";
import { track } from "@/lib/analytics";

const QUESTION_URL_FALLBACK = "mailto:nest4000@gmail.com?subject=JB%EC%9D%98%20%ED%95%98%EB%A3%A8%20%EC%A7%88%EB%AC%B8";

function resolveQuestionUrl(): string | null {
  const env = process.env.NEXT_PUBLIC_QUESTION_URL;
  if (env && !env.includes("REPLACE-ME")) return env;
  return QUESTION_URL_FALLBACK;
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
