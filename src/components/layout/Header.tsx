"use client";

import { useFontSize } from "@/hooks/useFontSize";

interface HeaderProps {
  chapterTitle: string;
  clipTitle: string;
}

export default function Header({ chapterTitle, clipTitle }: HeaderProps) {
  const { fontSize, changeFontSize } = useFontSize();

  return (
    <header className="sticky top-[64px] lg:top-[72px] z-30 surface border-b border-cream-dark px-6 py-2.5 flex items-center justify-between gap-3">
      <nav className="text-xs sm:text-sm text-text-muted truncate" aria-label="현재 위치">
        <span className="hidden sm:inline">{chapterTitle}</span>
        <span className="hidden sm:inline mx-2">›</span>
        <span className="text-text-primary font-medium truncate">{clipTitle}</span>
      </nav>

      <div className="flex items-center gap-1 shrink-0">
        {(["sm", "md", "lg"] as const).map((size) => (
          <button
            key={size}
            onClick={() => changeFontSize(size)}
            className={`min-w-[44px] min-h-[44px] px-2 rounded text-sm transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${
              fontSize === size
                ? "bg-accent text-white"
                : "text-text-secondary hover:bg-cream-dark"
            }`}
            aria-label={`글자 크기 ${size === "sm" ? "작게" : size === "md" ? "보통" : "크게"}`}
            aria-pressed={fontSize === size}
          >
            {size === "sm" ? "A-" : size === "md" ? "A" : "A+"}
          </button>
        ))}
      </div>
    </header>
  );
}
