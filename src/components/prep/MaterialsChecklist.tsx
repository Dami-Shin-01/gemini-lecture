"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics";
import { loadMaterialsReady, setMaterialsReady } from "@/lib/materials";

const ITEMS = [
  "NotebookLM 공유 노트북을 내 계정에 복제했어요",
  "원본 소스 4종(간담회·제보·설문·답변이력)을 훑어봤어요",
  "이 실습의 자료는 가상 샘플입니다 — 사내 실데이터는 별도 보안 정책 확인 후 업로드하겠습니다",
] as const;

export default function MaterialsChecklist() {
  const [checks, setChecks] = useState<boolean[]>([false, false, false]);
  const allDone = checks.every(Boolean);
  const uid = useId();
  const [hydrated, setHydrated] = useState(false);
  const readyFiredRef = useRef(false);

  useEffect(() => {
    // 이미 준비 완료한 사용자는 체크 상태로 복원
    if (loadMaterialsReady()) {
      setChecks([true, true, true]);
      readyFiredRef.current = true; // 재방문 시 이벤트 중복 방지
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const done = checks.every(Boolean);
    setMaterialsReady(done);
    if (done && !readyFiredRef.current) {
      readyFiredRef.current = true;
      track("materials_pack_ready", { items_count: ITEMS.length });
    }
  }, [checks, hydrated]);

  const toggle = useCallback((i: number) => {
    setChecks((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }, []);

  return (
    <section
      aria-labelledby={`${uid}-legend`}
      className="mt-10 surface rounded-2xl border border-cream-dark p-6 sm:p-8"
    >
      <p id={`${uid}-legend`} className="kicker mb-2">
        자료 받았어요 체크리스트
      </p>
      <h2 className="section-display !text-xl mb-5">준비 완료 확인</h2>

      <fieldset className="border-0 p-0">
        <legend className="sr-only">실습 준비 확인</legend>
        <ul role="list" className="flex flex-col gap-2.5">
          {ITEMS.map((label, i) => {
            const inputId = `${uid}-c-${i}`;
            return (
              <li key={i}>
                <label
                  htmlFor={inputId}
                  className="flex items-start gap-2.5 min-h-[44px] cursor-pointer"
                >
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={checks[i]}
                    onChange={() => toggle(i)}
                    className="mt-1 w-4 h-4 accent-[var(--color-accent)]"
                  />
                  <span className="text-sm text-text-primary leading-relaxed">{label}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <div
        role="status"
        aria-live="polite"
        className="mt-6 min-h-[56px] flex items-center"
      >
        {allDone ? (
          <div className="flex flex-wrap items-center gap-3 w-full">
            <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-tag-practice)] font-medium">
              <CheckCircle2 size={16} />
              준비 완료. 실습을 시작할 수 있어요.
            </span>
            <Link
              href="/ch02/clip01"
              className="ml-auto inline-flex items-center gap-1.5 min-h-[44px] px-5 rounded-full bg-[var(--color-accent)] text-white text-sm font-semibold hover:bg-[var(--color-accent-dark)] transition-colors"
            >
              ch02 듣기 시작하기
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <span className="text-xs text-text-muted">
            3가지를 모두 체크하면 실습 시작 링크가 나타납니다.
          </span>
        )}
      </div>
    </section>
  );
}
