import Link from "next/link";
import { getCurriculum } from "@/lib/navigation";
import {
  ArrowRight,
  Clock,
  Sparkles,
  Ear,
  MessageCircle,
  HelpCircle,
  Zap,
  TrendingUp,
  Archive,
} from "lucide-react";

const jbRoles = [
  {
    icon: Ear,
    name: "듣기",
    label: "VoE",
    description: "현장의 목소리를 수집하고 패턴을 발견합니다",
    tools: "NotebookLM · Gems",
    color: "#5B8DEF",
  },
  {
    icon: MessageCircle,
    name: "말하기",
    label: "Caring Message",
    description: "관계를 지키면서 메시지를 정확히 전달합니다",
    tools: "Gmail · Vids · Gems",
    color: "#4CAF50",
  },
  {
    icon: HelpCircle,
    name: "질문하기",
    label: "Persona Kit",
    description: "상대에 맞는 질문으로 좋은 답을 끌어냅니다",
    tools: "Gems · 딥리서치",
    color: "#9C27B0",
  },
  {
    icon: Zap,
    name: "실행하기",
    label: "Action Plan",
    description: "논의를 즉시 액션 아이템과 일정으로 연결합니다",
    tools: "Sheets · Gemini",
    color: "#E09F3E",
  },
  {
    icon: TrendingUp,
    name: "설득하기",
    label: "Pitch",
    description: "데이터와 근거로 의사결정자를 움직입니다",
    tools: "딥리서치 · Slides · Gems",
    color: "#E91E63",
  },
  {
    icon: Archive,
    name: "축적하기",
    label: "Playbook",
    description: "오늘의 노하우를 내일 재사용할 자산으로 남깁니다",
    tools: "Canvas · NotebookLM",
    color: "#607D8B",
  },
];

export default function HomePage() {
  const curriculum = getCurriculum();

  return (
    <div className="max-w-[860px] mx-auto px-6 py-16">
      {/* Hero */}
      <section className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
          <Sparkles size={14} />
          인터랙티브 실습 가이드
        </div>
        <h1
          className="text-4xl font-bold text-text-primary mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {curriculum.title}
        </h1>
        <p className="text-lg text-text-secondary mb-3 max-w-[520px] mx-auto">
          {curriculum.subtitle}
        </p>
        <p className="text-sm text-text-muted mb-10 max-w-[480px] mx-auto">
          JB 담당자 김지연의 하루를 따라가며, 현장 간담회 준비부터
          경영진 보고까지 Gemini와 함께 완주합니다.
        </p>
        <Link
          href="/ch01/clip01"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-white rounded-full font-semibold hover:bg-accent-dark transition-colors shadow-sm"
        >
          나의 하루 체험하기
          <ArrowRight size={18} />
        </Link>
      </section>

      {/* JB 역할 소개 */}
      <section className="mb-16">
        <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden">
          <div className="px-8 py-8 sm:px-10 sm:py-10">
            <h2
              className="text-xl font-semibold text-text-primary mb-2 text-center"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              왜 JB에게 AI가 필요한가?
            </h2>
            <p className="text-sm text-text-muted text-center mb-8 max-w-[520px] mx-auto">
              JB는 현장과 경영진 사이에서 <strong className="text-text-primary">듣고, 말하고, 질문하고, 실행하고, 설득하고, 축적하는</strong> 6가지 역할을 동시에 수행합니다.
              한 사람이 팀처럼 일하려면, AI가 파트너가 되어야 합니다.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {jbRoles.map((role) => {
                const Icon = role.icon;
                return (
                  <div
                    key={role.name}
                    className="rounded-xl border border-cream-dark p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: `${role.color}12`,
                          color: role.color,
                        }}
                      >
                        <Icon size={15} />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-text-primary">
                          {role.name}
                        </span>
                        <span className="text-[10px] text-text-muted ml-1">
                          {role.label}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed mb-2">
                      {role.description}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      {role.tools}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 bg-cream rounded-xl px-6 py-4 text-center">
              <p className="text-sm text-text-secondary">
                이 과정에서는 <strong className="text-accent">설명보다 적용, 기능 나열보다 결과물</strong>에 집중합니다.
              </p>
              <p className="text-xs text-text-muted mt-1">
                4시간 후, 간담회 기획안 · 피드백 메시지 · 인터뷰 질문지 · 경영진 보고서 · 팀 백서가 여러분의 손에 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h2
          className="text-xl font-semibold text-text-primary mb-8 text-center"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          오늘의 타임라인
        </h2>
        <div className="relative">
          {/* 세로 타임라인 라인 */}
          <div
            className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-cream-dark"
            aria-hidden="true"
          />

          <div className="grid gap-3">
            {curriculum.chapters.map((chapter, i) => {
              const subtitle = chapter.title.split(" — ")[1] || "";
              const chapterName = chapter.title.split(" — ")[0];

              return (
                <Link
                  key={chapter.id}
                  href={`/${chapter.id}/clip01`}
                  className="group relative flex items-start gap-4 bg-white rounded-2xl border border-cream-dark hover:border-accent/30 hover:shadow-md transition-all p-5 pl-12"
                >
                  {/* 타임라인 노드 */}
                  <div
                    className="absolute left-[18px] top-6 w-3 h-3 rounded-full border-2 z-10"
                    style={{
                      borderColor: chapter.colorTag,
                      backgroundColor: `${chapter.colorTag}30`,
                    }}
                    aria-hidden="true"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <time
                        dateTime={chapter.time}
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${chapter.colorTag}15`,
                          color: chapter.colorTag,
                        }}
                      >
                        {chapter.time}
                      </time>
                      <span className="text-xs text-text-muted">
                        {chapter.timeLabel}
                      </span>
                    </div>
                    <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                      {chapterName}
                    </h3>
                    {subtitle && (
                      <p className="text-sm text-text-muted mt-0.5">
                        {subtitle}
                      </p>
                    )}
                    <p className="text-xs text-text-muted mt-1.5 flex items-center gap-1">
                      <Clock size={12} />
                      {chapter.clips.length}개 실습
                    </p>
                  </div>

                  <ArrowRight
                    size={16}
                    className="text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all mt-1 shrink-0"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
