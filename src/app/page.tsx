import Link from "next/link";
import { getCurriculum } from "@/lib/navigation";
import {
  BookOpen,
  Wrench,
  Lightbulb,
  Layout,
  Package,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const chapterIcons: Record<string, React.ElementType> = {
  concept: BookOpen,
  practice: Wrench,
  framework: Lightbulb,
  overview: Layout,
  tool: Package,
  project: Package,
};

export default function HomePage() {
  const curriculum = getCurriculum();

  return (
    <div className="max-w-[860px] mx-auto px-6 py-16">
      {/* Hero */}
      <section className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
          <Sparkles size={14} />
          인터랙티브 가이드북
        </div>
        <h1
          className="text-4xl font-bold text-text-primary mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {curriculum.title}
        </h1>
        <p className="text-lg text-text-secondary mb-10 max-w-[500px] mx-auto">
          {curriculum.subtitle}
        </p>
        <Link
          href="/ch01/clip01"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-white rounded-full font-semibold hover:bg-accent-dark transition-colors shadow-sm"
        >
          시작하기
          <ArrowRight size={18} />
        </Link>
      </section>

      {/* Chapters */}
      <section>
        <h2
          className="text-xl font-semibold text-text-primary mb-8 text-center"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          커리큘럼
        </h2>
        <div className="grid gap-4">
          {curriculum.chapters.map((chapter, i) => {
            const Icon = chapterIcons[chapter.type] || BookOpen;
            return (
              <Link
                key={chapter.id}
                href={`/${chapter.id}/clip01`}
                className="group relative flex items-center gap-5 bg-white rounded-2xl border border-cream-dark hover:border-accent/30 hover:shadow-md transition-all overflow-hidden"
              >
                {/* Left color accent */}
                <div
                  className="w-1.5 self-stretch shrink-0 rounded-l-2xl"
                  style={{ backgroundColor: chapter.colorTag }}
                />
                <div className="flex items-center gap-4 flex-1 py-5 pr-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{
                      backgroundColor: `${chapter.colorTag}15`,
                      color: chapter.colorTag,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                      {chapter.title}
                    </h3>
                    <p className="text-sm text-text-muted mt-0.5">
                      {chapter.clips.length}개 클립
                    </p>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
