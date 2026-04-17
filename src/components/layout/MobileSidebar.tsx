"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  BookOpen,
  Wrench,
  Lightbulb,
  Layout,
  Package,
  ChevronDown,
  GitCompare,
} from "lucide-react";
import type { Curriculum } from "@/lib/types";

const clipIcons: Record<string, React.ElementType> = {
  concept: BookOpen,
  practice: Wrench,
  framework: Lightbulb,
  overview: Layout,
  tool: Package,
  comparison: GitCompare,
};

export default function MobileSidebar({
  curriculum,
}: {
  curriculum: Curriculum;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [openChapters, setOpenChapters] = useState<Set<string>>(new Set());

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const match = pathname.match(/^\/(ch\d+)\//);
    if (match) {
      setOpenChapters((prev) => new Set(prev).add(match[1]));
    }
  }, [pathname]);

  const close = useCallback(() => setIsOpen(false), []);

  function toggleChapter(chapterId: string) {
    setOpenChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  }

  const currentChapterIndex = curriculum.chapters.findIndex((ch) =>
    pathname.startsWith(`/${ch.id}/`)
  );

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-3 left-4 z-50 p-2 rounded-lg bg-cream-dark text-text-primary"
        aria-label="메뉴 열기"
      >
        <Menu size={20} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={close}
          />
          <aside className="fixed left-0 top-0 w-[280px] h-screen bg-sidebar-bg z-50 overflow-y-auto sidebar-scroll">
            <div className="px-5 py-6 border-b border-white/10 flex items-center justify-between">
              <Link href="/" onClick={close}>
                <h1 className="text-white text-base font-bold">
                  {curriculum.title}
                </h1>
              </Link>
              <button
                onClick={close}
                className="text-sidebar-text p-1"
                aria-label="메뉴 닫기"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="py-3" aria-label="학습 타임라인">
              <ol className="relative">
                {curriculum.chapters.map((chapter, index) => {
                  const isChapterOpen = openChapters.has(chapter.id);
                  const isActiveChapter = pathname.startsWith(`/${chapter.id}/`);
                  const isPast = currentChapterIndex > index;
                  const isLast = index === curriculum.chapters.length - 1;

                  return (
                    <li key={chapter.id} className="relative">
                      {!isLast && (
                        <div
                          className={`absolute left-[29px] top-[36px] bottom-0 w-0.5 ${
                            isPast ? "bg-accent/60" : "bg-white/10"
                          }`}
                          aria-hidden="true"
                        />
                      )}

                      <button
                        onClick={() => toggleChapter(chapter.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-sidebar-hover transition-colors ${
                          isActiveChapter ? "bg-white/5" : ""
                        }`}
                        aria-expanded={isChapterOpen}
                        aria-current={isActiveChapter ? "step" : undefined}
                      >
                        <div
                          className={`w-3 h-3 rounded-full shrink-0 border-2 relative z-10 ${
                            isActiveChapter
                              ? "bg-accent border-accent shadow-[0_0_8px_rgba(165,0,52,0.3)]"
                              : isPast
                              ? "bg-accent/60 border-accent/60"
                              : "border-white/30 bg-sidebar-bg"
                          }`}
                          aria-hidden="true"
                        />

                        <span
                          className={`text-sm flex-1 truncate ${
                            isActiveChapter
                              ? "text-white font-medium"
                              : "text-sidebar-text"
                          }`}
                        >
                          {chapter.title.split(" — ")[0]}
                        </span>

                        <ChevronDown
                          size={14}
                          className={`text-sidebar-text transition-transform shrink-0 ${
                            isChapterOpen ? "rotate-0" : "-rotate-90"
                          }`}
                        />
                      </button>

                      {isChapterOpen && (
                        <div className="pb-1">
                          {chapter.clips.map((clip) => {
                            const clipPath = `/${chapter.id}/${clip.id}`;
                            const isActive = pathname === clipPath;
                            const Icon = clipIcons[clip.type] || BookOpen;

                            return (
                              <Link
                                key={clip.id}
                                href={clipPath}
                                className={`flex items-center gap-2.5 pl-[52px] pr-4 py-2 text-sm transition-colors ${
                                  isActive
                                    ? "bg-white/10 text-white border-l-2 border-accent"
                                    : "text-sidebar-text hover:bg-sidebar-hover hover:text-white"
                                }`}
                              >
                                <Icon
                                  size={14}
                                  className="shrink-0 opacity-60"
                                />
                                <span className="flex-1 truncate">
                                  {clip.title}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          </aside>
        </>
      )}
    </div>
  );
}
