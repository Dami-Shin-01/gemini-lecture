import Link from "next/link";
import { getCurriculum } from "@/lib/navigation";
import {
  BookOpen,
  Wrench,
  Lightbulb,
  Layout,
  Package,
  ArrowRight,
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
    <div className="max-w-[800px] mx-auto px-6 py-16">
      <section className="mb-16">
        <h1 className="text-3xl font-bold text-text-primary mb-3">
          {curriculum.title}
        </h1>
        <p className="text-lg text-text-secondary mb-8">
          {curriculum.subtitle}
        </p>
        <Link
          href="/ch01/clip01"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors"
        >
          시작하기
          <ArrowRight size={18} />
        </Link>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-text-primary mb-6">
          커리큘럼
        </h2>
        <div className="grid gap-4">
          {curriculum.chapters.map((chapter) => {
            const Icon = chapterIcons[chapter.type] || BookOpen;
            return (
              <Link
                key={chapter.id}
                href={`/${chapter.id}/clip01`}
                className="group flex items-start gap-4 p-5 bg-white rounded-xl border border-cream-dark hover:border-accent/30 hover:shadow-sm transition-all"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${chapter.colorTag}15` }}
                >
                  <Icon size={20} style={{ color: chapter.colorTag }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                    {chapter.title}
                  </h3>
                  <p className="text-sm text-text-muted mt-1">
                    {chapter.clips.length}개 클립
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="text-text-muted mt-1 group-hover:text-accent transition-colors"
                />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
