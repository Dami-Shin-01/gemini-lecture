const KEY = "jb:retro:v1";

export type RetroState = {
  summary_viewed_at?: number;
  moment_chapter?: string;
  pin_clip?: string;
  pledge?: string;
  updated_at?: number;
};

export function loadRetro(): RetroState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as RetroState) : {};
  } catch {
    return {};
  }
}

export function saveRetro(patch: RetroState): RetroState {
  if (typeof window === "undefined") return {};
  const state = { ...loadRetro(), ...patch, updated_at: Date.now() };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore quota
  }
  return state;
}
