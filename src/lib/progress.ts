// localStorage 래퍼. 서버 사이드에서 안전하게 호출할 수 있도록 항상 window 체크.

const KEY = "jb:progress:v1";

export type ClipProgress = {
  deliverables?: Record<string, boolean>;
  selfcheck?: Record<string, string>;
  ts?: number;
};

export type ProgressState = Record<string, ClipProgress>;

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as ProgressState) : {};
  } catch {
    return {};
  }
}

export function saveClipProgress(clipId: string, patch: ClipProgress): ClipProgress {
  if (typeof window === "undefined") return {};
  const state = loadProgress();
  const prev = state[clipId] ?? {};
  const next: ClipProgress = {
    ...prev,
    ...patch,
    deliverables: { ...(prev.deliverables ?? {}), ...(patch.deliverables ?? {}) },
    selfcheck: { ...(prev.selfcheck ?? {}), ...(patch.selfcheck ?? {}) },
    ts: Date.now(),
  };
  state[clipId] = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // storage quota 등
  }
  return next;
}

export function clearClipProgress(clipId: string): void {
  if (typeof window === "undefined") return;
  const state = loadProgress();
  delete state[clipId];
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function summarize(state: ProgressState) {
  let complete = 0;
  let partial = 0;
  const touchedClips = Object.keys(state);
  for (const key of touchedClips) {
    const p = state[key];
    const dCount = Object.values(p.deliverables ?? {}).filter(Boolean).length;
    const sCount = Object.values(p.selfcheck ?? {}).filter(Boolean).length;
    if (dCount >= 3 && sCount >= 2) complete++;
    else if (dCount > 0 || sCount > 0) partial++;
  }
  return { complete, partial, touched: touchedClips.length };
}

// Chapter 단위 완주 카운트 (B1) — deliverables 전부 체크된 clip 수.
// selfcheck는 옵션이므로 제외하고 deliverables만 기준 (학습자 입장에서 더 도달 가능한 기준).
// fullClipIds: ["ch02/clip01", "ch02/clip02", ...] 형식.
// expectedDeliverablesPerClip: 일반적으로 4 (PR9 A1 표준). 0이면 ANY checked로 완주 간주.
export function getChapterCompletion(
  state: ProgressState,
  fullClipIds: string[],
  expectedDeliverablesPerClip = 4
): { complete: number; total: number } {
  let complete = 0;
  for (const id of fullClipIds) {
    const p = state[id];
    if (!p) continue;
    const dCount = Object.values(p.deliverables ?? {}).filter(Boolean).length;
    if (expectedDeliverablesPerClip === 0 ? dCount > 0 : dCount >= expectedDeliverablesPerClip) {
      complete++;
    }
  }
  return { complete, total: fullClipIds.length };
}
