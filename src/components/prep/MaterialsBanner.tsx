"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { loadMaterialsReady } from "@/lib/materials";

export default function MaterialsBanner() {
  const [ready, setReady] = useState<boolean | null>(null);

  useEffect(() => {
    setReady(loadMaterialsReady());
  }, []);

  if (ready === null) return null;

  if (ready) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mb-6 flex items-center gap-2 p-3 rounded-lg border border-dashed border-cream-dark text-xs text-text-muted"
      >
        <CheckCircle2 size={14} className="text-[var(--color-tag-practice)]" />
        자료 패키지 준비 완료
        <Link
          href="/field-materials-pack"
          className="ml-auto inline-flex items-center gap-1 min-h-[32px] px-2 rounded text-text-secondary hover:text-[var(--color-accent)] transition-colors"
        >
          다시 보기
          <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  return (
    <aside
      aria-label="실습 자료 팩 준비 안내"
      className="mb-8 rounded-lg border-l-4 p-4 sm:p-5"
      style={{
        backgroundColor: "var(--color-important-bg)",
        borderLeftColor: "var(--color-important-border)",
      }}
    >
      <p className="kicker mb-2">시작 전 준비 · 3분</p>
      <p className="text-sm text-text-primary mb-3 leading-relaxed">
        이 실습은 <strong>공유 자료 팩</strong>이 필요합니다.
        NotebookLM 공유 노트북·원본 소스 4종·Gem 인스트럭션을 받아 오세요.
      </p>
      <Link
        href="/field-materials-pack"
        className="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-full bg-[var(--color-accent)] text-white text-sm font-semibold hover:bg-[var(--color-accent-dark)] transition-colors"
      >
        자료 팩 열기
        <ArrowRight size={14} />
      </Link>
    </aside>
  );
}
