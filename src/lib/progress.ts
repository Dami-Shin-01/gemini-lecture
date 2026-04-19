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
