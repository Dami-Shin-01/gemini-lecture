import TrackedLink from "@/components/analytics/TrackedLink";
import type { Chapter } from "@/lib/types";

type Props = {
  chapter: Chapter;
  currentClipId: string;
};

export default function ClipTabs({ chapter, currentClipId }: Props) {
  const clips = chapter.clips;
  if (clips.length <= 1) return null;

  return (
    <nav
      aria-label={`${chapter.title.split(" — ")[0]} 챕터 내 클립`}
      className="surface border-b border-cream-dark sticky top-[calc(var(--nav-offset)+44px)] z-20"
    >
      <ol
        role="list"
        className="flex items-center gap-1 overflow-x-auto no-scrollbar px-4 sm:px-6 py-2 max-w-[1200px] mx-auto"
      >
        {clips.map((clip, idx) => {
          const isActive = clip.id === currentClipId;
          const href = `/${chapter.id}/${clip.id}`;
          return (
            <li key={clip.id} className="shrink-0">
              <TrackedLink
                href={href}
                event="clip_tab_click"
                eventParams={{
                  chapter_id: chapter.id,
                  clip_id: clip.id,
                  from_clip_id: currentClipId,
                }}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex items-center gap-2 min-h-[40px] px-3 rounded-full text-xs sm:text-[13px] transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${
                  isActive
                    ? "bg-[var(--color-accent)] text-white"
                    : "text-text-secondary hover:bg-cream-dark/60"
                }`}
              >
                <span
                  className="tabular-nums opacity-70"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="truncate max-w-[220px] sm:max-w-[320px]">
                  {clip.title}
                </span>
                {clip.deepDive && (
                  <span
                    className={`shrink-0 text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded ${
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-[var(--color-accent)]/15 text-[var(--color-accent)]"
                    }`}
                    title={clip.deepDiveNote || "심화 실습"}
                  >
                    DEEP
                  </span>
                )}
                {clip.durationMin && (
                  <span
                    className={`shrink-0 text-[10px] tabular-nums ${
                      isActive ? "opacity-90" : "opacity-60"
                    }`}
                  >
                    {clip.durationMin}분
                  </span>
                )}
              </TrackedLink>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
