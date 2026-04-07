import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ClipNavigation } from "@/lib/types";

interface BottomNavProps {
  navigation: ClipNavigation;
}

export default function BottomNav({ navigation }: BottomNavProps) {
  const { prev, next } = navigation;

  return (
    <nav className="border-t border-cream-dark px-6 py-4 flex items-center justify-between mt-auto">
      <div className="flex-1">
        {prev && (
          <Link
            href={`/${prev.chapter.id}/${prev.clip.id}`}
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors"
          >
            <ChevronLeft size={16} />
            <span className="truncate max-w-[200px]">{prev.clip.title}</span>
          </Link>
        )}
      </div>

      <div className="flex-1 text-right">
        {next && (
          <Link
            href={`/${next.chapter.id}/${next.clip.id}`}
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors ml-auto"
          >
            <span className="truncate max-w-[200px]">{next.clip.title}</span>
            <ChevronRight size={16} />
          </Link>
        )}
      </div>
    </nav>
  );
}
