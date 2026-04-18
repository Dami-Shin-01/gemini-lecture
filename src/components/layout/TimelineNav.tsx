"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from "react";
import { BookMarked } from "lucide-react";
import type { Curriculum, Chapter, TimePhase } from "@/lib/types";
import { track } from "@/lib/analytics";

type Props = {
  curriculum: Curriculum;
};

const FALLBACK_PHASE: TimePhase = "noon";

// SSR safe
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function TimelineNav({ curriculum }: Props) {
  const pathname = usePathname();

  const timeChapters = useMemo(
    () => curriculum.chapters.filter((ch) => ch.phase !== "archive"),
    [curriculum]
  );
  const archiveChapter = useMemo(
    () => curriculum.chapters.find((ch) => ch.phase === "archive") ?? null,
    [curriculum]
  );
  const allNavChapters = useMemo(
    () => (archiveChapter ? [...timeChapters, archiveChapter] : timeChapters),
    [timeChapters, archiveChapter]
  );

  const isHome = pathname === "/";
  const urlChapterId = useMemo(() => {
    const match = pathname.match(/^\/(ch\d+)(?:\/|$)/);
    return match ? match[1] : null;
  }, [pathname]);

  const [activeId, setActiveId] = useState<string | null>(() => {
    if (urlChapterId) return urlChapterId;
    return isHome ? timeChapters[0]?.id ?? null : null;
  });

  const trackRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const registerItem = useCallback((id: string, el: HTMLAnchorElement | null) => {
    if (el) itemRefs.current.set(id, el);
    else itemRefs.current.delete(id);
  }, []);

  useEffect(() => {
    if (urlChapterId) {
      setActiveId(urlChapterId);
    }
  }, [urlChapterId]);

  useEffect(() => {
    if (!isHome || typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const id = visible[0].target.getAttribute("data-chapter-id");
          if (id) setActiveId((prev) => (prev === id ? prev : id));
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    const targets = document.querySelectorAll<HTMLElement>("[data-chapter-id]");
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [isHome]);

  // body[data-time] + data-ready 관리. 첫 페인트에서는 transition 억제.
  useIsomorphicLayoutEffect(() => {
    const body = document.body;
    if (!activeId) {
      body.dataset.time = FALLBACK_PHASE;
    } else {
      const chapter = curriculum.chapters.find((c) => c.id === activeId);
      body.dataset.time = chapter?.phase ?? FALLBACK_PHASE;
    }
  }, [activeId, curriculum.chapters]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      document.body.dataset.ready = "true";
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // 활성 아이템을 트랙 내부에서만 가로 센터링 (페이지 전체 스크롤 영향 차단)
  useEffect(() => {
    const track = trackRef.current;
    const el = activeId ? itemRefs.current.get(activeId) : null;
    if (!track || !el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2;
    track.scrollTo({
      left: Math.max(0, target),
      behavior: reduce ? "auto" : "smooth",
    });
  }, [activeId]);

  const activeIndexInTime = timeChapters.findIndex((c) => c.id === activeId);
  const isArchiveActive = activeId !== null && archiveChapter?.id === activeId;
  const progressPercent = isArchiveActive
    ? 100
    : activeIndexInTime >= 0
    ? ((activeIndexInTime + 0.5) / timeChapters.length) * 100
    : 0;

  const handleChapterClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, chapter: Chapter) => {
      track("timeline_nav_click", {
        chapter_id: chapter.id,
        from: isHome ? "home" : "clip",
      });
      // 현재 챕터를 다시 클릭한 경우 — 위치 파괴 방지
      if (!isHome && chapter.id === urlChapterId) {
        e.preventDefault();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        return;
      }
      if (isHome && chapter.phase !== "archive") {
        e.preventDefault();
        const target = document.querySelector(`[data-chapter-id="${chapter.id}"]`);
        if (target) {
          const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          target.scrollIntoView({
            behavior: reduce ? "auto" : "smooth",
            block: "start",
          });
          setActiveId(chapter.id);
        }
      }
    },
    [isHome, urlChapterId]
  );

  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLAnchorElement>, chapter: Chapter) => {
      if (
        e.key !== "ArrowLeft" &&
        e.key !== "ArrowRight" &&
        e.key !== "Home" &&
        e.key !== "End"
      ) {
        return;
      }
      e.preventDefault();
      const list = allNavChapters;
      const idx = list.findIndex((c) => c.id === chapter.id);
      if (idx === -1) return;
      let next = idx;
      if (e.key === "ArrowLeft") next = Math.max(0, idx - 1);
      if (e.key === "ArrowRight") next = Math.min(list.length - 1, idx + 1);
      if (e.key === "Home") next = 0;
      if (e.key === "End") next = list.length - 1;
      const target = list[next];
      const el = itemRefs.current.get(target.id);
      el?.focus();
    },
    [allNavChapters]
  );

  return (
    <nav
      className="timeline-nav w-full"
      role="navigation"
      aria-label="하루 타임라인"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-3 focus:py-2 focus:rounded focus:text-sm"
      >
        본문으로 건너뛰기
      </a>

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-6 h-[64px] lg:h-[72px]">
          <Link
            href="/"
            className="shrink-0 text-sm sm:text-[15px] font-semibold tracking-tight inline-flex items-center min-h-[44px] px-1"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            JB의 하루
          </Link>

          <ol
            ref={trackRef}
            role="list"
            className="timeline-track flex-1 flex items-center gap-1 sm:gap-3 overflow-x-auto no-scrollbar"
            style={{ scrollSnapType: "x proximity" }}
          >
            {timeChapters.map((chapter, i) => {
              const isActive = chapter.id === activeId;
              const isPast = activeIndexInTime >= 0 && i < activeIndexInTime;
              const shortTitle = chapter.title.split(" — ")[0];
              const targetHref = isHome ? `#${chapter.id}` : `/${chapter.id}/clip01`;
              return (
                <li key={chapter.id} className="shrink-0" style={{ scrollSnapAlign: "center" }}>
                  <Link
                    ref={(el) => registerItem(chapter.id, el)}
                    href={targetHref}
                    onClick={(e) => handleChapterClick(e, chapter)}
                    onKeyDown={(e) => handleKey(e, chapter)}
                    aria-current={isActive ? (isHome ? "step" : "page") : undefined}
                    className="group relative flex flex-col items-center gap-0.5 px-2.5 py-2 min-h-[52px] min-w-[44px] rounded outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
                    title={`${chapter.time ?? ""} · ${chapter.title} · 실습 ${chapter.clips.length}개`}
                  >
                    <span
                      className="text-[10px] sm:text-[11px] tabular-nums tracking-wide"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: isActive ? "var(--color-text-primary)" : "var(--color-text-muted)",
                        fontWeight: isActive ? 700 : 500,
                      }}
                    >
                      {chapter.time}
                    </span>
                    <span
                      aria-hidden="true"
                      className="timeline-dot-wrap w-5 h-5 flex items-center justify-center my-0.5"
                    >
                      <span
                        className="rounded-full border-2 transition-all"
                        style={{
                          width: isActive ? 14 : 10,
                          height: isActive ? 14 : 10,
                          borderColor: chapter.colorTag,
                          backgroundColor: isActive
                            ? chapter.colorTag
                            : isPast
                            ? `${chapter.colorTag}80`
                            : "transparent",
                        }}
                      />
                    </span>
                    <span
                      className="text-[11px] sm:text-xs whitespace-nowrap"
                      style={{
                        color: isActive ? "var(--color-text-primary)" : "var(--color-text-muted)",
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {shortTitle}
                    </span>
                  </Link>
                </li>
              );
            })}

            {archiveChapter && (
              <li
                className="shrink-0 pl-2 sm:pl-4 border-l border-[var(--color-cream-dark)] ml-1"
                style={{ scrollSnapAlign: "end" }}
              >
                <Link
                  ref={(el) => registerItem(archiveChapter.id, el)}
                  href={`/${archiveChapter.id}/clip01`}
                  onClick={(e) => handleChapterClick(e, archiveChapter)}
                  onKeyDown={(e) => handleKey(e, archiveChapter)}
                  aria-current={archiveChapter.id === activeId ? "page" : undefined}
                  className="flex flex-col items-center gap-0.5 px-2.5 py-2 min-h-[52px] min-w-[44px] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)] rounded"
                  title="실전 치트시트 · 언제든 꺼내 보는 참고서가"
                  style={{
                    color:
                      archiveChapter.id === activeId
                        ? "var(--color-text-primary)"
                        : "var(--color-text-muted)",
                  }}
                >
                  <span
                    className="text-[10px] sm:text-[11px] opacity-70"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    참고
                  </span>
                  <span
                    aria-hidden="true"
                    className="timeline-dot-wrap w-5 h-5 flex items-center justify-center my-0.5"
                  >
                    <BookMarked size={14} />
                  </span>
                  <span
                    className="text-[11px] sm:text-xs whitespace-nowrap"
                    style={{ fontWeight: archiveChapter.id === activeId ? 600 : 400 }}
                  >
                    치트시트
                  </span>
                </Link>
              </li>
            )}
          </ol>
        </div>

        <div
          className="timeline-progress"
          style={{ width: `${progressPercent}%` }}
          aria-hidden="true"
        />
      </div>
    </nav>
  );
}
