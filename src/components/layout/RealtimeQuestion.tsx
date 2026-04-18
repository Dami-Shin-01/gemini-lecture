"use client";

import { MessageSquarePlus } from "lucide-react";
import { track } from "@/lib/analytics";

const QUESTION_URL = process.env.NEXT_PUBLIC_QUESTION_URL;

export default function RealtimeQuestion() {
  if (!QUESTION_URL || QUESTION_URL.includes("REPLACE-ME")) return null;

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
