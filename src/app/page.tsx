import Link from "next/link";
import { getCurriculum } from "@/lib/navigation";
import {
  ArrowRight,
  Layers,
  Ear,
  MessageCircle,
  HelpCircle,
  Zap,
  TrendingUp,
  Archive,
  BookMarked,
} from "lucide-react";

const jbRoles = [
  {
    icon: Ear,
    name: "듣기",
    time: "09:00",
    label: "VoE",
    description: "현장의 목소리를 수집하고 패턴을 발견합니다",
    tools: "NotebookLM · Gems",
    color: "#5B8DEF",
  },
  {
    icon: MessageCircle,
    name: "말하기",
    time: "10:30",
    label: "Caring Message",
    description: "관계를 지키면서 메시지를 정확히 전달합니다",
    tools: "Gmail · Vids · Gems",
    color: "#4CAF50",
  },
  {
    icon: HelpCircle,
    name: "질문하기",
    time: "11:30",
    label: "Persona Kit",
    description: "상대에 맞는 질문으로 좋은 답을 끌어냅니다",
    tools: "Gems · 딥리서치",
    color: "#9C27B0",
  },
  {
    icon: Zap,
    name: "실행하기",
    time: "13:30",
    label: "Action Plan",
    description: "논의를 즉시 액션 아이템과 일정으로 연결합니다",
    tools: "Gemini · Canvas · AI Studio",
    color: "#E09F3E",
  },
  {
    icon: TrendingUp,
    name: "설득하기",
    time: "15:00",
    label: "Pitch",
    description: "데이터와 근거로 의사결정자를 움직입니다",
    tools: "딥리서치 · AI Studio · Gems",
    color: "#E91E63",
  },
  {
    icon: Archive,
    name: "축적하기",
    time: "16:30",
    label: "Playbook",
    description: "오늘의 노하우를 내일 재사용할 자산으로 남깁니다",
    tools: "Canvas · NotebookLM",
    color: "#607D8B",
  },
];

export default function HomePage() {
  const curriculum = getCurriculum();
  const timeChapters = curriculum.chapters.filter((ch) => ch.phase !== "archive");
  const archiveChapter = curriculum.chapters.find((ch) => ch.phase === "archive");

  return (
    <div>
      {/* ── Hero ─────────────────────────── */}
      <section className="relative max-w-[1100px] mx-auto px-6 pt-16 pb-10 sm:pt-24 sm:pb-14">
        <p className="kicker mb-6">07:00 → 17:00 · 하루 여정</p>
        <h1 className="hero-display mb-8 max-w-[14ch]">
          JB의 <span className="accent-weight">하루</span>,
          <br />
          Gemini와 함께.
        </h1>
        <p className="text-[17px] sm:text-lg text-text-secondary max-w-[620px] mb-3 leading-relaxed">
          {curriculum.subtitle}
        </p>
        <p className="text-sm text-text-muted mb-10 max-w-[540px]">
          JB 담당자 김지연의 하루를 따라가며, 간담회 준비부터 경영진 보고까지
          Gemini로 완주합니다.
        </p>
        <Link
          href="/ch01/clip01"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-white rounded-full font-semibold hover:bg-accent-dark transition-colors shadow-sm"
        >
          07:00부터 시작하기
          <ArrowRight size={18} />
        </Link>
      </section>

      {/* ── Dayscape — 하루 지도 ───────────── */}
      <section className="max-w-[1100px] mx-auto px-6 pb-16">
        <p className="kicker mb-3">하루 지도</p>
        <h2 className="section-display mb-8">
          시간이 흐르면서, 도구가 바뀝니다.
        </h2>
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-[26px] h-[2px] bg-[var(--color-cream-dark)]"
          />
          <ol className="relative flex items-start justify-between gap-2">
            {timeChapters.map((chapter) => {
              const shortTitle = chapter.title.split(" — ")[0];
              return (
                <li key={chapter.id} className="flex flex-col items-center text-center flex-1 min-w-0">
                  <span
                    className="text-[10px] sm:text-[11px] text-text-muted tabular-nums mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {chapter.time}
                  </span>
                  <Link
                    href={`#${chapter.id}`}
                    className="relative w-[14px] h-[14px] rounded-full border-2 z-10 block"
                    style={{
                      borderColor: chapter.colorTag,
                      backgroundColor: `${chapter.colorTag}30`,
                    }}
                    aria-label={`${chapter.time} ${shortTitle} 섹션으로 이동`}
                  />
                  <span className="mt-2 text-[11px] sm:text-xs font-medium text-text-primary truncate max-w-full px-1">
                    {shortTitle}
                  </span>
                  <span className="text-[10px] text-text-muted mt-0.5 hidden sm:block truncate max-w-full px-1">
                    {chapter.timeLabel}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── Why AI · 6 역할 ──────────────── */}
      <section className="max-w-[1100px] mx-auto px-6 pb-16">
        <div className="text-center mb-10">
          <p className="kicker mb-3">왜 AI가 필요한가</p>
          <h2 className="section-display mx-auto max-w-[22ch]">
            한 사람이 팀처럼 일하려면, AI가 파트너가 되어야 합니다.
          </h2>
          <p className="text-sm text-text-muted max-w-[560px] mx-auto mt-4">
            JB는 현장과 경영진 사이에서{" "}
            <strong className="text-text-primary">
              듣고, 말하고, 질문하고, 실행하고, 설득하고, 축적하는
            </strong>{" "}
            6가지 역할을 동시에 수행합니다.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {jbRoles.map((role, i) => {
            const Icon = role.icon;
            const alt = i % 2 === 1;
            return (
              <div
                key={role.name}
                className={`ticket-card ${alt ? "ticket-card--alt" : ""} p-4 flex items-start gap-3`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${role.color}14`,
                    color: role.color,
                  }}
                  aria-hidden="true"
                >
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-text-primary">{role.name}</span>
                    <span
                      className="text-[10px] tabular-nums text-text-muted"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {role.time}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-muted mb-1.5 uppercase tracking-wider">
                    {role.label}
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed mb-2">
                    {role.description}
                  </p>
                  <p className="text-[10px] text-text-muted">{role.tools}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 surface rounded-xl px-6 py-4 text-center border border-cream-dark">
          <p className="text-sm text-text-secondary">
            이 과정에서는{" "}
            <strong className="text-text-primary underline decoration-[var(--color-accent)] decoration-2 underline-offset-4">
              설명보다 적용, 기능 나열보다 결과물
            </strong>
            에 집중합니다.
          </p>
          <p className="text-xs text-text-muted mt-1">
            4시간 후, 간담회 기획안 · 피드백 메시지 · 인터뷰 질문지 · 경영진 보고서 · 팀 백서가 여러분의 손에 있습니다.
          </p>
        </div>
      </section>

      {/* ── 챕터 상세 (시간순) ────────────── */}
      <section className="max-w-[860px] mx-auto px-6 pb-24">
        <p className="kicker mb-3">오늘의 타임라인</p>
        <h2 className="section-display mb-10">
          한 장면씩, 손으로 체험합니다.
        </h2>

        <div className="flex flex-col gap-6">
          {timeChapters.map((chapter, i) => {
            const subtitle = chapter.title.split(" — ")[1] || "";
            const chapterName = chapter.title.split(" — ")[0];
            const number = String(i + 1).padStart(2, "0");
            const nextChapter = timeChapters[i + 1];
            const showLunchDivider =
              chapter.id === "ch04" && nextChapter?.id === "ch05";

            return (
              <div
                key={chapter.id}
                id={chapter.id}
                data-chapter-id={chapter.id}
                className="scroll-mt-[88px]"
              >
                <Link
                  href={`/${chapter.id}/clip01`}
                  className={`group ticket-card ${i % 2 === 1 ? "ticket-card--alt" : ""} flex items-stretch overflow-hidden`}
                >
                  <div className="flex-1 p-6 sm:p-7">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="text-[11px] tabular-nums font-semibold tracking-wider"
                        style={{
                          fontFamily: "var(--font-heading)",
                          color: chapter.colorTag,
                        }}
                      >
                        {chapter.time}
                      </span>
                      <span className="kicker !text-[10px]">{chapter.timeLabel}</span>
                    </div>
                    <h3
                      className="text-xl sm:text-[1.375rem] font-semibold text-text-primary mb-2"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {chapterName}
                    </h3>
                    {subtitle && (
                      <p className="text-sm text-text-secondary mb-3 max-w-[48ch]">
                        {subtitle}
                      </p>
                    )}
                    <p className="text-xs text-text-muted flex items-center gap-1.5">
                      <Layers size={12} />
                      {chapter.clips.length}개 실습
                      <ArrowRight
                        size={14}
                        className="ml-2 text-text-muted group-hover:translate-x-0.5 transition-transform"
                      />
                    </p>
                  </div>
                  <div className="ticket-stamp">
                    <span className="ticket-stamp__num">{number}</span>
                    <span className="ticket-stamp__label">CH</span>
                  </div>
                </Link>

                {showLunchDivider && (
                  <div
                    role="separator"
                    aria-label="점심 시간"
                    className="flex items-center gap-3 my-2 px-1"
                  >
                    <span
                      className="text-[11px] tabular-nums font-semibold text-text-muted"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      12:00
                    </span>
                    <div className="flex-1 h-px bg-[var(--color-cream-dark)]" />
                    <span className="text-[11px] text-text-muted">점심 · 한 숨 고르기</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {archiveChapter && (
          <div className="mt-14">
            <div className="border-t border-cream-dark pt-6 mb-4">
              <p className="kicker">참고서가 · Reference Shelf</p>
            </div>
            <Link
              href={`/${archiveChapter.id}/clip01`}
              className="group ticket-card flex items-center gap-4 p-5"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: `${archiveChapter.colorTag}18`,
                  color: archiveChapter.colorTag,
                }}
                aria-hidden="true"
              >
                <BookMarked size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text-primary mb-0.5" style={{ fontFamily: "var(--font-heading)" }}>
                  실전 치트시트
                </h3>
                <p className="text-sm text-text-muted">
                  AI 도구 모음 · Workspace 연계 가이드 · 프롬프트 레시피북
                </p>
              </div>
              <ArrowRight
                size={16}
                className="text-text-muted group-hover:translate-x-0.5 transition-transform shrink-0"
              />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
