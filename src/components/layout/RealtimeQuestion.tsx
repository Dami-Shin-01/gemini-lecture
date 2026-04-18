import { MessageSquarePlus } from "lucide-react";

const QUESTION_URL =
  process.env.NEXT_PUBLIC_QUESTION_URL ?? "https://padlet.com/REPLACE-ME";

export default function RealtimeQuestion() {
  return (
    <a
      href={QUESTION_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="realtime-cta fixed right-4 z-50 inline-flex items-center gap-2 px-4 py-3 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-[background-color,color,box-shadow] duration-500"
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
