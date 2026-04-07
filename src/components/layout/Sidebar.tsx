"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Wrench,
  Lightbulb,
  Layout,
  Package,
  ChevronDown,
  GitCompare,
  PanelLeftOpen,
  PanelLeftClose,
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

export default function Sidebar({ curriculum }: { curriculum: Curriculum }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [openChapters, setOpenChapters] = useState<Set<string>>(new Set());

  useEffect(() => {
    const match = pathname.match(/^\/(ch\d+)\//);
    if (match) {
      setOpenChapters((prev) => new Set(prev).add(match[1]));
    }
  }, [pathname]);

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

  // 현재 활성 챕터 찾기
  const activeChapterMatch = pathname.match(/^\/(ch\d+)\//);
  const activeChapterId = activeChapterMatch ? activeChapterMatch[1] : null;

  return (
    <aside
      className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-sidebar-bg z-40 transition-all duration-300 ease-in-out ${
        expanded ? "w-[280px]" : "w-[64px]"
      }`}
    >
      {/* Header */}
      <div className={`border-b border-white/10 ${expanded ? "px-5 py-5" : "px-0 py-5"}`}>
        {expanded ? (
          <div className="flex items-center justify-between">
            <Link href="/" className="block flex-1">
              <h1 className="text-white text-sm font-bold leading-tight">
                {curriculum.title}
              </h1>
            </Link>
            <button
              onClick={() => setExpanded(false)}
              className="p-1.5 rounded-md text-sidebar-text hover:text-white hover:bg-sidebar-hover transition-colors"
            >
              <PanelLeftClose size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setExpanded(true)}
            className="w-full flex justify-center p-1.5 text-sidebar-text hover:text-white transition-colors"
          >
            <PanelLeftOpen size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll py-2">
        {curriculum.chapters.map((chapter, chapterIndex) => {
          const isOpen = openChapters.has(chapter.id);
          const isActiveChapter = activeChapterId === chapter.id;

          return (
            <div key={chapter.id}>
              {/* Collapsed: chapter icon only */}
              {!expanded ? (
                <button
                  onClick={() => {
                    setExpanded(true);
                    if (!isOpen) toggleChapter(chapter.id);
                  }}
                  className={`w-full flex flex-col items-center gap-1 py-3 transition-colors hover:bg-sidebar-hover ${
                    isActiveChapter ? "bg-white/10" : ""
                  }`}
                  title={chapter.title}
                >
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold text-white"
                    style={{
                      backgroundColor: isActiveChapter
                        ? chapter.colorTag
                        : "transparent",
                      border: isActiveChapter
                        ? "none"
                        : `2px solid ${chapter.colorTag}`,
                      color: isActiveChapter ? "white" : chapter.colorTag,
                    }}
                  >
                    {chapterIndex + 1}
                  </span>
                </button>
              ) : (
                /* Expanded: full chapter row */
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
              )}

              {/* Clips list (expanded only) */}
              {expanded && isOpen && (
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
                        <Icon size={14} className="shrink-0 opacity-60" />
                        <span className="flex-1 truncate">{clip.title}</span>
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
  );
}
