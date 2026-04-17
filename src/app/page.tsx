import Link from "next/link";
import { getCurriculum } from "@/lib/navigation";
import {
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const curriculum = getCurriculum();

  return (
    <div className="max-w-[860px] mx-auto px-6 py-16">
      {/* Hero */}
      <section className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
          <Sparkles size={14} />
          인터랙티브 실습 가이드
        </div>
        <h1
          className="text-4xl font-bold text-text-primary mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {curriculum.title}
        </h1>
        <p className="text-lg text-text-secondary mb-3 max-w-[520px] mx-auto">
          {curriculum.subtitle}
        </p>
        <p className="text-sm text-text-muted mb-10 max-w-[480px] mx-auto">
          JB 담당자 김지연의 하루를 따라가며, 현장 간담회 준비부터
          경영진 보고까지 Gemini와 함께 완주합니다.
        </p>
        <Link
          href="/ch01/clip01"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-white rounded-full font-semibold hover:bg-accent-dark transition-colors shadow-sm"
        >
          나의 하루 체험하기
          <ArrowRight size={18} />
        </Link>
      </section>

      {/* Timeline */}
      <section>
        <h2
          className="text-xl font-semibold text-text-primary mb-8 text-center"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          오늘의 타임라인
        </h2>
        <div className="relative">
          {/* 세로 타임라인 라인 */}
          <div
            className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-cream-dark"
            aria-hidden="true"
          />

          <div className="grid gap-3">
            {curriculum.chapters.map((chapter, i) => {
              const subtitle = chapter.title.split(" — ")[1] || "";
              const chapterName = chapter.title.split(" — ")[0];

              return (
                <Link
                  key={chapter.id}
                  href={`/${chapter.id}/clip01`}
                  className="group relative flex items-start gap-4 bg-white rounded-2xl border border-cream-dark hover:border-accent/30 hover:shadow-md transition-all p-5 pl-12"
                >
                  {/* 타임라인 노드 */}
                  <div
                    className="absolute left-[18px] top-6 w-3 h-3 rounded-full border-2 z-10"
                    style={{
                      borderColor: chapter.colorTag,
                      backgroundColor: `${chapter.colorTag}30`,
                    }}
                    aria-hidden="true"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <time
                        dateTime={chapter.time}
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${chapter.colorTag}15`,
                          color: chapter.colorTag,
                        }}
                      >
                        {chapter.time}
                      </time>
                      <span className="text-xs text-text-muted">
                        {chapter.timeLabel}
                      </span>
                    </div>
                    <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                      {chapterName}
                    </h3>
                    {subtitle && (
                      <p className="text-sm text-text-muted mt-0.5">
                        {subtitle}
                      </p>
                    )}
                    <p className="text-xs text-text-muted mt-1.5 flex items-center gap-1">
                      <Clock size={12} />
                      {chapter.clips.length}개 실습
                    </p>
                  </div>

                  <ArrowRight
                    size={16}
                    className="text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all mt-1 shrink-0"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
