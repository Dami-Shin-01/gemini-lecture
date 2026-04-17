"use client";

import { useFontSize } from "@/hooks/useFontSize";

interface HeaderProps {
  chapterTitle: string;
  chapterTime?: string;
  clipTitle: string;
}

export default function Header({ chapterTitle, chapterTime, clipTitle }: HeaderProps) {
  const { fontSize, changeFontSize } = useFontSize();

  return (
    <header className="sticky top-0 z-30 bg-cream border-b border-cream-dark px-6 py-3 flex items-center justify-between">
      <nav className="text-sm text-text-muted flex items-center gap-2">
        {chapterTime && (
          <time
            dateTime={chapterTime}
            className="px-1.5 py-0.5 rounded bg-accent/10 text-accent text-xs font-semibold"
          >
            {chapterTime}
          </time>
        )}
        <span>{chapterTitle}</span>
        <span className="mx-1">&gt;</span>
        <span className="text-text-primary font-medium">{clipTitle}</span>
      </nav>

      <div className="flex items-center gap-1">
        {(["sm", "md", "lg"] as const).map((size) => (
          <button
            key={size}
            onClick={() => changeFontSize(size)}
            className={`px-2 py-1 rounded text-sm transition-colors ${
              fontSize === size
                ? "bg-accent text-white"
                : "text-text-secondary hover:bg-cream-dark"
            }`}
          >
            {size === "sm" ? "A-" : size === "md" ? "A" : "A+"}
          </button>
        ))}
      </div>
    </header>
  );
}
