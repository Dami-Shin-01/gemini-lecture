import TrackedLink from "@/components/analytics/TrackedLink";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ClipNavigation } from "@/lib/types";

interface BottomNavProps {
  navigation: ClipNavigation;
}

export default function BottomNav({ navigation }: BottomNavProps) {
  const { prev, next } = navigation;

  return (
    <nav
      className="border-t border-cream-dark px-4 sm:px-6 py-3 flex items-stretch gap-3 mt-auto"
      aria-label="클립 이동"
    >
      <div className="flex-1">
        {prev && (
          <TrackedLink
            href={`/${prev.chapter.id}/${prev.clip.id}`}
            event="bottom_nav_click"
            eventParams={{
              direction: "prev",
              to_clip: `${prev.chapter.id}/${prev.clip.id}`,
            }}
            className="group flex items-center gap-2 min-h-[44px] px-3 rounded-md text-sm text-text-secondary hover:text-[var(--color-accent)] hover:bg-cream-dark/40 transition-colors outline-none focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
          >
            <ChevronLeft size={16} className="shrink-0" />
            <span className="flex flex-col text-left min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-text-muted">
                이전
              </span>
              <span className="truncate">{prev.clip.title}</span>
            </span>
          </TrackedLink>
        )}
      </div>

      <div className="flex-1 flex justify-end">
        {next && (
          <TrackedLink
            href={`/${next.chapter.id}/${next.clip.id}`}
            event="bottom_nav_click"
            eventParams={{
              direction: "next",
              to_clip: `${next.chapter.id}/${next.clip.id}`,
            }}
            className="group flex items-center gap-2 min-h-[44px] px-3 rounded-md text-sm text-text-secondary hover:text-[var(--color-accent)] hover:bg-cream-dark/40 transition-colors outline-none focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
          >
            <span className="flex flex-col text-right min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-text-muted">
                다음
              </span>
              <span className="truncate">{next.clip.title}</span>
            </span>
            <ChevronRight size={16} className="shrink-0" />
          </TrackedLink>
        )}
      </div>
    </nav>
  );
}
