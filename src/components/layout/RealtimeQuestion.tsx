import { MessageSquarePlus } from "lucide-react";

const QUESTION_URL =
  process.env.NEXT_PUBLIC_QUESTION_URL ?? "https://padlet.com/REPLACE-ME";

export default function RealtimeQuestion() {
  return (
    <a
      href={QUESTION_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-accent text-white text-sm font-semibold shadow-lg hover:bg-accent-dark hover:shadow-xl transition-all"
      aria-label="실시간 질문 남기기"
    >
      <MessageSquarePlus size={16} />
      <span className="hidden sm:inline">질문 남기기</span>
    </a>
  );
}
