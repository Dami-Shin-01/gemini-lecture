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

            <nav className="py-3">
              {curriculum.chapters.map((chapter) => {
                const isOpen = openChapters.has(chapter.id);
                const isActiveChapter = pathname.startsWith(`/${chapter.id}/`);

                return (
                  <div key={chapter.id}>
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full flex items-center gap-2.5 px-5 py-2.5 text-left hover:bg-sidebar-hover transition-colors"
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: chapter.colorTag }}
                      />
                      <span
                        className={`text-sm flex-1 ${
                          isActiveChapter
                            ? "text-white font-medium"
                            : "text-sidebar-text"
                        }`}
                      >
                        {chapter.title}
                      </span>
                      <ChevronDown
                        size={14}
                        className={`text-sidebar-text transition-transform ${
                          isOpen ? "rotate-0" : "-rotate-90"
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="pb-1">
                        {chapter.clips.map((clip) => {
                          const clipPath = `/${chapter.id}/${clip.id}`;
                          const isActive = pathname === clipPath;
                          const Icon = clipIcons[clip.type] || BookOpen;

                          return (
                            <Link
                              key={clip.id}
                              href={clipPath}
                              className={`flex items-center gap-2.5 pl-10 pr-4 py-2 text-sm transition-colors ${
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
                              <span className="text-xs opacity-40 shrink-0">
                                {clip.duration}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </aside>
        </>
      )}
    </div>
  );
}
