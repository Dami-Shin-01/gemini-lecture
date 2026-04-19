const KEY = "jb:materials-ready";

export function loadMaterialsReady(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(KEY) === "true";
  } catch {
    return false;
  }
}

export function setMaterialsReady(ready: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (ready) window.localStorage.setItem(KEY, "true");
    else window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export type MaterialsItem =
  | "notebook"
  | "source-interview"
  | "source-anonymous"
  | "source-survey"
  | "source-answers"
  | "source-issue-csv"
  | "gem-voe"
  | "gem-persona-senior"
  | "gem-persona-mid"
  | "gem-persona-mz"
  | "gem-reviewer";
