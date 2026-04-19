"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Clipboard, ArrowRight } from "lucide-react";
import PageView from "@/components/analytics/PageView";
import { track } from "@/lib/analytics";
import { loadProgress, summarize, type ProgressState } from "@/lib/progress";
import { loadRetro, saveRetro, type RetroState } from "@/lib/retro";
import curriculum from "../../../content/curriculum.json";
import type { Curriculum } from "@/lib/types";

const data = curriculum as Curriculum;

const timeChapters = data.chapters.filter((c) => c.phase !== "archive");
const allClips = data.chapters.flatMap((c) =>
  c.clips.map((clip) => ({ chapterId: c.id, chapterName: c.title.split(" — ")[0], clipId: clip.id, title: clip.title }))
);

export default function RetrospectiveClient() {
  const [progress, setProgress] = useState<ProgressState>({});
  const [retro, setRetro] = useState<RetroState>({});
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
    setRetro(loadRetro());
  }, []);

  const stats = useMemo(() => summarize(progress), [progress]);
  const hasData = stats.touched > 0;

  const selectMoment = useCallback((chapterId: string) => {
    const next = saveRetro({ moment_chapter: chapterId });
    setRetro(next);
    setToast("저장됨");
    window.setTimeout(() => setToast(null), 1200);
  }, []);

  const pinClip = useCallback((value: string) => {
    const next = saveRetro({ pin_clip: value });
    setRetro(next);
    track("retrospective_pin", { clip_id: value });
    setToast("핀 저장됨");
    window.setTimeout(() => setToast(null), 1200);
  }, []);

  const updatePledge = useCallback((value: string) => {
    setRetro((prev) => ({ ...prev, pledge: value }));
  }, []);

  const persistPledge = useCallback(() => {
    const next = saveRetro({ pledge: retro.pledge ?? "" });
    setRetro(next);
    setToast("저장됨");
    window.setTimeout(() => setToast(null), 1200);
  }, [retro.pledge]);

  const copyPledge = useCallback(async () => {
    const text = retro.pledge?.trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setToast("다짐이 복사되었습니다");
      window.setTimeout(() => setToast(null), 1600);
    } catch {
      setToast("복사 실패 — 수동 선택 복사해 주세요");
      window.setTimeout(() => setToast(null), 2000);
    }
  }, [retro.pledge]);

  return (
    <div className="max-w-[860px] mx-auto px-6 py-16">
      <PageView event="retrospective_view" params={{ has_data: hasData ? 1 : 0 }} />

      <p className="kicker mb-3">17:30 · 오늘의 회고</p>
      <h1 className="hero-display !text-[clamp(2.5rem,5vw,4rem)] mb-8">
        오늘 한 일이, <span className="accent-weight">내일의 방법</span>이 됩니다.
      </h1>

      {!hasData ? (
        <div className="surface rounded-2xl border border-cream-dark p-8 text-center">
          <p className="text-text-primary mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            아직 기록이 없습니다.
          </p>
          <p className="text-sm text-text-muted mb-6">
            첫 실습을 완주하면 여기에 오늘 하루가 요약됩니다.
          </p>
          <Link
            href="/ch01/clip01"
            className="inline-flex items-center gap-2 px-5 min-h-[44px] bg-[var(--color-accent)] text-white rounded-full text-sm font-semibold hover:bg-[var(--color-accent-dark)] transition-colors"
          >
            07:00부터 시작하기
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <section className="ticket-card p-6 mb-8">
          <p className="kicker mb-2">하루 요약</p>
          <p className="text-sm text-text-secondary mb-3">
            오늘 <strong className="text-text-primary">{stats.touched}</strong>개 실습에 손을 댔고,
            그중 <strong className="text-text-primary">{stats.complete}</strong>개를 완주했습니다.
          </p>
          <div className="flex items-center gap-3">
            <div
              className="flex-1 h-2 rounded-full overflow-hidden bg-cream-dark"
              role="img"
              aria-label={`완주 ${stats.complete}, 부분 ${stats.partial}, 터치 ${stats.touched}`}
            >
              <div
                className="h-full bg-[var(--color-accent)]"
                style={{
                  width: `${stats.touched ? (stats.complete / stats.touched) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-xs text-text-muted tabular-nums">
              {stats.complete}/{stats.touched}
            </span>
          </div>
        </section>
      )}

      <section className="mb-10">
        <p className="kicker mb-2">가장 쓸모 있었던 순간</p>
        <h2 className="section-display !text-xl mb-4">오늘 어느 챕터가 제일 와닿았나요?</h2>
        <fieldset className="flex flex-wrap gap-2" aria-label="가장 쓸모 있었던 챕터">
          {timeChapters.map((c) => {
            const selected = retro.moment_chapter === c.id;
            const short = c.title.split(" — ")[0];
            return (
              <label
                key={c.id}
                className={`inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-full border text-sm cursor-pointer transition-colors ${
                  selected
                    ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                    : "border-cream-dark text-text-secondary hover:bg-cream-dark/40"
                }`}
              >
                <input
                  type="radio"
                  name="moment"
                  value={c.id}
                  checked={selected}
                  onChange={() => selectMoment(c.id)}
                  className="sr-only"
                />
                <span className="tabular-nums text-[11px] opacity-80">{c.time}</span>
                <span>{short}</span>
              </label>
            );
          })}
        </fieldset>
      </section>

      <section className="mb-10">
        <p className="kicker mb-2">다음 주에 다시 해볼 1가지</p>
        <h2 className="section-display !text-xl mb-4">어떤 실습을 다음 방문 시 이어가고 싶나요?</h2>
        <label htmlFor="pin-clip" className="sr-only">
          다시 해볼 클립
        </label>
        <select
          id="pin-clip"
          value={retro.pin_clip ?? ""}
          onChange={(e) => pinClip(e.target.value)}
          className="w-full min-h-[48px] px-4 rounded-lg border border-cream-dark bg-[var(--color-surface-noon)] text-sm outline-none focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
        >
          <option value="">— 선택 —</option>
          {allClips.map((c) => (
            <option key={`${c.chapterId}/${c.clipId}`} value={`${c.chapterId}/${c.clipId}`}>
              {c.chapterName} · {c.title}
            </option>
          ))}
        </select>
        {retro.pin_clip && (
          <p className="mt-2 text-xs text-text-muted">
            다음 홈 방문 시 히어로에 이 클립이 배지로 뜹니다.
          </p>
        )}
      </section>

      <section className="mb-10">
        <p className="kicker mb-2">공유 가능한 다짐</p>
        <h2 className="section-display !text-xl mb-4">
          나는 내일 __를 Gemini로 합니다.
        </h2>
        <textarea
          value={retro.pledge ?? ""}
          onChange={(e) => updatePledge(e.target.value.slice(0, 120))}
          onBlur={persistPledge}
          maxLength={120}
          rows={3}
          aria-describedby="pledge-help pledge-count"
          className="w-full p-3 rounded-lg border border-cream-dark bg-[var(--color-surface-noon)] text-sm leading-relaxed outline-none focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
          placeholder="예: 매주 금요일 15분, VoE 요약을 Gemini로 정리한다."
        />
        <div className="mt-1.5 flex items-center justify-between text-[11px]">
          <span id="pledge-help" className="text-text-muted">
            120자 이내 · 브라우저에만 저장됩니다.
          </span>
          <span id="pledge-count" className="text-text-muted tabular-nums" aria-live="polite">
            {(retro.pledge ?? "").length} / 120
          </span>
        </div>
        <div className="mt-3">
          <button
            type="button"
            onClick={copyPledge}
            disabled={!retro.pledge?.trim()}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-full border border-cream-dark text-sm text-text-secondary hover:text-[var(--color-accent)] hover:bg-cream-dark/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Clipboard size={14} />
            다짐 복사
          </button>
        </div>
      </section>

      <div role="status" aria-live="polite" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
        {toast && (
          <span className="inline-block px-4 py-2 rounded-full bg-black/80 text-white text-xs shadow-lg">
            {toast}
          </span>
        )}
      </div>
    </div>
  );
}
