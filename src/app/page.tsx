import Link from "next/link";
import { getCurriculum } from "@/lib/navigation";
import { glossary } from "@/lib/glossary";
import TrackedLink from "@/components/analytics/TrackedLink";
import ScrollDepth from "@/components/analytics/ScrollDepth";
import PageView from "@/components/analytics/PageView";
import HeroSecondaryCta from "@/components/home/HeroSecondaryCta";
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
  Clock,
  ChevronDown,
} from "lucide-react";

type Role = {
  icon: React.ComponentType<{ size?: number }>;
  name: string;
  chapterId: string;
  time: string;
  label: string;
  description: string;
  tools: string;
  color: string;
};

const jbRoles: Role[] = [
  {
    icon: Ear,
    name: "듣기",
    chapterId: "ch02",
    time: "09:00",
    label: "VoE",
    description: "간담회 녹음이 쌓여 있다면 → 5분 만에 VoE 요약",
    tools: "NotebookLM · Gems",
    color: "#5B8DEF",
  },
  {
    icon: MessageCircle,
    name: "말하기",
    chapterId: "ch03",
    time: "10:30",
    label: "Caring Message",
    description: "민감한 피드백 메일에 시간이 오래 걸린다면 → 3분 초안",
    tools: "Gmail · Vids · Gems",
    color: "#4CAF50",
  },
  {
    icon: HelpCircle,
    name: "질문하기",
    chapterId: "ch04",
    time: "11:30",
    label: "Persona Kit",
    description: "인터뷰 질문이 모두에게 똑같다면 → 페르소나 3종 맞춤",
    tools: "Gems · 딥리서치",
    color: "#9C27B0",
  },
  {
    icon: Zap,
    name: "실행하기",
    chapterId: "ch05",
    time: "13:30",
    label: "Action Plan",
    description: "회의 결론이 액션으로 안 떨어진다면 → 담당·기한까지",
    tools: "Gemini · Canvas · AI Studio",
    color: "#E09F3E",
  },
  {
    icon: TrendingUp,
    name: "설득하기",
    chapterId: "ch06",
    time: "15:00",
    label: "Pitch",
    description: "경영진 보고 준비 시간이 부족하다면 → 2시간 안에 초안+슬라이드",
    tools: "딥리서치 · AI Studio · Gems",
    color: "#E91E63",
  },
  {
    icon: Archive,
    name: "축적하기",
    chapterId: "ch07",
    time: "16:30",
    label: "Playbook",
    description: "매번 처음부터 시작한다면 → 팀 자산으로 축적",
    tools: "Canvas · NotebookLM",
    color: "#607D8B",
  },
];

function sumDuration(clips: { durationMin?: number }[]): number {
  return clips.reduce((sum, c) => sum + (c.durationMin ?? 0), 0);
}

export default function HomePage() {
  const curriculum = getCurriculum();
  const timeChapters = curriculum.chapters.filter((ch) => ch.phase !== "archive");
  const archiveChapter = curriculum.chapters.find((ch) => ch.phase === "archive");
  const totalMinutes = timeChapters.reduce(
    (sum, ch) => sum + sumDuration(ch.clips),
    0
  );
  const totalHours = Math.round(totalMinutes / 60);
  const totalClips = timeChapters.reduce((sum, ch) => sum + ch.clips.length, 0);

  const roleChapterMinutes = (chapterId: string): number => {
    const ch = curriculum.chapters.find((c) => c.id === chapterId);
    return ch ? sumDuration(ch.clips) : 0;
  };
  const roleChapterClipCount = (chapterId: string): number => {
    const ch = curriculum.chapters.find((c) => c.id === chapterId);
    return ch ? ch.clips.length : 0;
  };

  return (
    <div>
      <PageView event="page_view" params={{ page: "home" }} />
      <ScrollDepth page="home" />

      {/* ── Hero ─────────────────────────── */}
      <section className="relative max-w-[1100px] mx-auto px-6 pt-14 pb-10 sm:pt-20 sm:pb-14">
        <p className="kicker mb-6">07:00 → 17:00 · 하루 여정</p>
        <h1 className="hero-display mb-6 max-w-[14ch]">
          오늘 당신의 <span className="accent-weight">하루</span>,
          <br />
          Gemini와 함께.
        </h1>
        <p className="text-[17px] sm:text-lg text-text-secondary max-w-[640px] mb-4 leading-relaxed">
          4시간 뒤,{" "}
          <strong className="text-text-primary">
            간담회 기획안 · 피드백 메시지 · 인터뷰 질문지 · 경영진 보고서 · 팀 백서
          </strong>
          가 손에 있습니다.
        </p>
        <p className="text-sm text-text-muted mb-10 max-w-[560px]">
          JB(담당자) 김지연의 하루를 따라가며, 현장 간담회 준비부터 경영진 보고까지 Gemini로 완주합니다.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <TrackedLink
            href="/ch01/clip01"
            event="hero_cta_click"
            eventParams={{ target: "ch01/clip01" }}
            className="inline-flex items-center justify-center gap-2 px-7 min-h-[48px] bg-[var(--color-accent)] text-white rounded-full font-semibold hover:bg-[var(--color-accent-dark)] transition-colors shadow-sm"
          >
            07:00부터 시작하기 · 5분
            <ArrowRight size={18} />
          </TrackedLink>
          <HeroSecondaryCta />
          <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
            <Clock size={14} />총 {totalHours}시간 · {totalClips}개 실습
          </span>
        </div>
      </section>

      {/* ── Glossary — 자주 나오는 도구 (상위 5개만) ─────── */}
      <section
        id="jb-tools-glossary"
        className="max-w-[1100px] mx-auto px-6 pb-16 scroll-mt-[calc(var(--nav-offset)+16px)]"
      >
        <p className="kicker mb-3">처음 듣는 이름이 있나요?</p>
        <h2 className="section-display mb-8">
          이 과정에서 자주 나오는 도구 {glossary.length}개
        </h2>
        <ul
          role="list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {glossary.slice(0, 5).map((t) => (
            <li key={t.id}>
              <TrackedLink
                href={`/ch08/clip01#term-${t.id}`}
                event="glossary_card_click"
                eventParams={{ term: t.id }}
                className="surface rounded-lg border border-cream-dark p-4 flex flex-col gap-1.5 group hover:border-[color-mix(in_srgb,var(--color-accent)_30%,transparent)] transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              >
                <h3
                  className="text-[15px] font-semibold text-text-primary"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {t.term}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">{t.short}</p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">
                  {t.usage}
                </p>
              </TrackedLink>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center justify-center">
          <Link
            href="/ch08/clip01"
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-[var(--color-accent)] transition-colors min-h-[44px] px-3"
          >
            나머지 {glossary.length - 5}개 포함 전체 보기
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Dayscape — 하루 지도 ───────────── */}
      <section className="max-w-[1100px] mx-auto px-6 pb-16">
        <p className="kicker mb-3">하루 지도</p>
        <h2 className="section-display mb-8">시간이 흐르면서, 도구가 바뀝니다.</h2>
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-[32px] h-[2px] bg-[var(--color-cream-dark)]"
          />
          <ol className="relative flex items-start justify-between gap-0">
            {timeChapters.map((chapter, i) => {
              const shortTitle = chapter.title.split(" — ")[0];
              const nextChapter = timeChapters[i + 1];
              const needsLunchHint = chapter.id === "ch04" && nextChapter?.id === "ch05";
              return (
                <li
                  key={chapter.id}
                  className="flex flex-col items-center text-center flex-1 min-w-0 relative"
                >
                  <span
                    className="text-[10px] sm:text-[11px] text-text-muted tabular-nums mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {chapter.time}
                  </span>
                  <Link
                    href={`#${chapter.id}`}
                    className="relative z-10 flex items-center justify-center w-[44px] h-[44px] rounded-full outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                    aria-label={`${chapter.time} ${shortTitle} 섹션으로 이동`}
                  >
                    <span
                      className="w-[14px] h-[14px] rounded-full border-2 block"
                      style={{
                        borderColor: chapter.colorTag,
                        backgroundColor: `${chapter.colorTag}30`,
                      }}
                      aria-hidden="true"
                    />
                  </Link>
                  <span className="mt-1 text-[11px] sm:text-xs font-medium text-text-primary truncate max-w-full px-1">
                    {shortTitle}
                  </span>
                  <span className="text-[10px] text-text-muted mt-0.5 hidden sm:block truncate max-w-full px-1">
                    {chapter.timeLabel}
                  </span>
                  {needsLunchHint && (
                    <span
                      aria-hidden="true"
                      className="absolute top-[28px] -right-2 text-[9px] text-text-muted whitespace-nowrap tabular-nums bg-[var(--color-time-noon)] px-1 rounded"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      12:00
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
        <p className="mt-6 text-xs text-text-muted text-center sm:hidden">
          ← 좌우로 스크롤해서 전체 시간축 보기
        </p>
      </section>

      {/* ── Why AI · 6 역할 ──────────────── */}
      <section
        id="jb-roles"
        className="max-w-[1100px] mx-auto px-6 pb-16 scroll-mt-[calc(var(--nav-offset)+16px)]"
      >
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {jbRoles.map((role, i) => {
            const Icon = role.icon;
            const alt = i % 2 === 1;
            const mins = roleChapterMinutes(role.chapterId);
            const clipCount = roleChapterClipCount(role.chapterId);
            return (
              <TrackedLink
                key={role.name}
                href={`/${role.chapterId}/clip01`}
                event="role_card_click"
                eventParams={{ role: role.chapterId, chapter_id: role.chapterId }}
                className={`ticket-card ${
                  alt ? "ticket-card--alt" : ""
                } p-4 flex items-start gap-3 group outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]`}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${role.color}18`,
                    color: role.color,
                  }}
                  aria-hidden="true"
                >
                  <Icon size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-text-primary">
                      {role.name}
                    </span>
                    <span
                      className="text-[10px] tabular-nums text-text-muted"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {role.time}
                    </span>
                    <span className="ml-auto text-[10px] text-text-muted group-hover:text-[var(--color-accent)] transition-colors">
                      →
                    </span>
                  </div>
                  <p className="text-[10px] text-text-muted mb-1.5 uppercase tracking-wider">
                    {role.label}
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed mb-2">
                    {role.description}
                  </p>
                  <p className="text-[10px] text-text-muted flex items-center gap-2 flex-wrap">
                    <span>{role.tools}</span>
                    {mins > 0 && (
                      <span className="tabular-nums">
                        · {mins}분 · {clipCount}개 실습 · 첫 클립부터
                      </span>
                    )}
                  </p>
                </div>
              </TrackedLink>
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
        <h2 className="section-display mb-10">한 장면씩, 손으로 체험합니다.</h2>

        <div className="flex flex-col gap-6">
          {timeChapters.map((chapter, i) => {
            const subtitle = chapter.title.split(" — ")[1] || "";
            const chapterName = chapter.title.split(" — ")[0];
            const number = String(i + 1).padStart(2, "0");
            const chapterMinutes = sumDuration(chapter.clips);
            const nextChapter = timeChapters[i + 1];
            const showLunchDivider =
              chapter.id === "ch04" && nextChapter?.id === "ch05";

            return (
              <div
                key={chapter.id}
                id={chapter.id}
                data-chapter-id={chapter.id}
                className="scroll-mt-[calc(var(--nav-offset)+16px)]"
              >
                <TrackedLink
                  href={`/${chapter.id}/clip01`}
                  event="chapter_card_click"
                  eventParams={{ chapter_id: chapter.id, position: i + 1 }}
                  className={`group ticket-card ${
                    i % 2 === 1 ? "ticket-card--alt" : ""
                  } flex items-stretch overflow-hidden outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]`}
                >
                  <div className="flex-1 p-6 sm:p-7 min-h-[112px]">
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
                    <p className="text-xs text-text-muted flex items-center gap-3 flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <Layers size={12} />
                        {chapter.clips.length}개 실습
                      </span>
                      {chapterMinutes > 0 && (
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <Clock size={12} />
                          {chapterMinutes}분
                        </span>
                      )}
                      <ArrowRight
                        size={14}
                        className="ml-auto text-text-muted group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)] transition-all"
                      />
                    </p>
                  </div>
                  <div className="ticket-stamp">
                    <span className="ticket-stamp__num">{number}</span>
                    <span className="ticket-stamp__label">CH</span>
                  </div>
                </TrackedLink>

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
            <TrackedLink
              href={`/${archiveChapter.id}/clip01`}
              event="archive_enter"
              eventParams={{ from: "home" }}
              className="group ticket-card flex items-center gap-4 p-5 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: `${archiveChapter.colorTag}20`,
                  color: archiveChapter.colorTag,
                }}
                aria-hidden="true"
              >
                <BookMarked size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="font-semibold text-text-primary mb-0.5"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
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
            </TrackedLink>
          </div>
        )}
      </section>
    </div>
  );
}
