"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Trash2 } from "lucide-react";
import { track } from "@/lib/analytics";
import {
  loadProgress,
  saveClipProgress,
  clearClipProgress,
  type ClipProgress,
} from "@/lib/progress";
import curriculum from "../../../content/curriculum.json";
import type { Curriculum } from "@/lib/types";

type CheckpointProps = {
  clipId: string;
  deliverables?: string[];
  handoff?: string;
};

const DEFAULT_DELIVERABLES = [
  "이번 클립의 산출물 저장",
  "다음 클립에서 재사용할 결과 북마크",
  "내 업무에 응용할 포인트 메모",
];

const SELFCHECK_OPTIONS = [
  { value: "not_yet", label: "아직" },
  { value: "rough", label: "혼자면 헤맬 듯" },
  { value: "fluent", label: "자신 있음" },
] as const;

function findNextClip(clipId: string): { href: string; title: string } | null {
  const data = curriculum as Curriculum;
  const [chId, clId] = clipId.split("/");
  const chapter = data.chapters.find((c) => c.id === chId);
  if (!chapter) return null;
  const idx = chapter.clips.findIndex((c) => c.id === clId);
  if (idx === -1) return null;
  // same chapter next clip
  if (idx + 1 < chapter.clips.length) {
    const next = chapter.clips[idx + 1];
    return { href: `/${chapter.id}/${next.id}`, title: next.title };
  }
  // next chapter first clip
  const chapterIdx = data.chapters.findIndex((c) => c.id === chId);
  const nextChapter = data.chapters[chapterIdx + 1];
  if (nextChapter && nextChapter.clips[0]) {
    return {
      href: `/${nextChapter.id}/${nextChapter.clips[0].id}`,
      title: nextChapter.clips[0].title,
    };
  }
  return null;
}

export function Checkpoint({
  clipId,
  deliverables = DEFAULT_DELIVERABLES,
  handoff,
}: CheckpointProps) {
  const [state, setState] = useState<ClipProgress>({});
  const [toast, setToast] = useState<string | null>(null);
  const [submittedAll, setSubmittedAll] = useState(false);
  const toastTimerRef = useRef<number | null>(null);
  const uid = useId();
  const nextClip = useMemo(() => findNextClip(clipId), [clipId]);

  useEffect(() => {
    const all = loadProgress();
    setState(all[clipId] ?? {});
    const dCount = Object.values(all[clipId]?.deliverables ?? {}).filter(Boolean).length;
    const sCount = Object.values(all[clipId]?.selfcheck ?? {}).filter(Boolean).length;
    if (dCount >= deliverables.length && sCount >= 2) setSubmittedAll(true);
  }, [clipId, deliverables.length]);

  const showToast = useCallback((message: string = "저장됨") => {
    setToast(message);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 1600);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const onDeliverableChange = useCallback(
    (index: number, checked: boolean) => {
      const patch: ClipProgress = {
        deliverables: { [String(index)]: checked },
      };
      const next = saveClipProgress(clipId, patch);
      setState(next);
      showToast();
      const dCount = Object.values(next.deliverables ?? {}).filter(Boolean).length;
      const sCount = Object.values(next.selfcheck ?? {}).filter(Boolean).length;
      if (!submittedAll && dCount >= deliverables.length && sCount >= 2) {
        setSubmittedAll(true);
        track("checkpoint_submit", {
          clip_id: clipId,
          fields: "all",
          deliverables_checked: dCount,
          selfcheck_completed: sCount,
        });
      }
    },
    [clipId, deliverables.length, showToast, submittedAll]
  );

  const onSelfcheckChange = useCallback(
    (qKey: string, value: string) => {
      const patch: ClipProgress = {
        selfcheck: { [qKey]: value },
      };
      const next = saveClipProgress(clipId, patch);
      setState(next);
      showToast();
      const dCount = Object.values(next.deliverables ?? {}).filter(Boolean).length;
      const sCount = Object.values(next.selfcheck ?? {}).filter(Boolean).length;
      if (!submittedAll && dCount >= deliverables.length && sCount >= 2) {
        setSubmittedAll(true);
        track("checkpoint_submit", {
          clip_id: clipId,
          fields: "all",
          deliverables_checked: dCount,
          selfcheck_completed: sCount,
        });
      }
    },
    [clipId, deliverables.length, showToast, submittedAll]
  );

  const onClear = useCallback(() => {
    const ok = window.confirm("이 클립의 체크포인트 기록을 지웁니다. 복구할 수 없습니다.");
    if (!ok) return;
    clearClipProgress(clipId);
    setState({});
    setSubmittedAll(false);
    showToast("지웠습니다");
  }, [clipId, showToast]);

  return (
    <aside
      className="checkpoint mt-12 pt-6 border-t border-dashed border-cream-dark"
      aria-label="체크포인트"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="kicker">체크포인트 · 이 클립에서 만든 것</p>
        <button
          type="button"
          onClick={onClear}
          className="text-[11px] text-text-muted hover:text-[var(--color-accent)] inline-flex items-center gap-1 min-h-[32px] px-2 rounded outline-none focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
          aria-label="이 클립 체크포인트 지우기"
        >
          <Trash2 size={12} />
          지우기
        </button>
      </div>

      <fieldset className="mb-5 border-0 p-0">
        <legend className="text-[11px] uppercase tracking-wider text-text-muted mb-2">
          ① 산출물 체크
        </legend>
        <ul role="list" className="flex flex-col gap-1.5">
          {deliverables.map((item, i) => {
            const checked = state.deliverables?.[String(i)] ?? false;
            const inputId = `${uid}-d-${i}`;
            return (
              <li key={i}>
                <label
                  htmlFor={inputId}
                  className="flex items-start gap-2 min-h-[36px] py-1 cursor-pointer"
                >
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onDeliverableChange(i, e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[var(--color-accent)]"
                  />
                  <span className="text-sm text-text-secondary leading-relaxed">{item}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <fieldset className="mb-5 border-0 p-0">
        <legend className="text-[11px] uppercase tracking-wider text-text-muted mb-2">
          ② 스스로 점검 2문항
        </legend>
        {[
          { key: "q1", question: "동료에게 이 과정을 설명할 수 있나요?" },
          { key: "q2", question: "내 업무에 응용할 그림이 보이나요?" },
        ].map(({ key, question }) => (
          <div key={key} className="mb-3 last:mb-0">
            <p className="text-sm text-text-primary mb-1.5">{question}</p>
            <div role="radiogroup" aria-label={question} className="flex flex-wrap gap-2">
              {SELFCHECK_OPTIONS.map((opt) => {
                const selected = state.selfcheck?.[key] === opt.value;
                const inputId = `${uid}-${key}-${opt.value}`;
                return (
                  <label
                    key={opt.value}
                    htmlFor={inputId}
                    className={`inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-full border text-xs cursor-pointer transition-colors ${
                      selected
                        ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                        : "border-cream-dark text-text-secondary hover:bg-cream-dark/40"
                    }`}
                  >
                    <input
                      id={inputId}
                      type="radio"
                      name={`${uid}-${key}`}
                      value={opt.value}
                      checked={selected}
                      onChange={() => onSelfcheckChange(key, opt.value)}
                      className="sr-only"
                    />
                    {opt.label}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </fieldset>

      {nextClip && (
        <div className="mt-5 pt-4 border-t border-cream-dark">
          <p className="text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
            ③ 다음으로
          </p>
          {handoff && (
            <p className="text-xs text-text-secondary mb-2">{handoff}</p>
          )}
          <Link
            href={nextClip.href}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-full bg-[var(--color-accent)] text-white text-sm font-medium hover:bg-[var(--color-accent-dark)] transition-colors"
          >
            {nextClip.title}
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-[10px] text-text-muted">
        <span>이 기록은 브라우저에만 저장됩니다.</span>
        <span role="status" aria-live="polite" className="min-h-[16px]">
          {toast}
        </span>
      </div>
    </aside>
  );
}
