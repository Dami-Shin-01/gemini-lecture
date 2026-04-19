"use client";

import { useCallback, useEffect, useState } from "react";

// 강사 모드 설계 — PR5 Phase A 결정 + QA 반영:
// - 기본은 수강생 모드(모든 expert 블록 숨김). 강사만 opt-in.
// - 활성화 경로 3가지:
//   1) URL `?mode=instructor`로 진입하면 LS에 만료시각을 저장하고 쿼리를 제거.
//   2) 치트시트(ch08/c1)의 InstructorToggle 버튼으로 수동 전환.
//   3) 키보드 단축키 Alt+Shift+I로 토글 (PR10 C2).
// - LS 값: `jb:instructor_until` = 만료 시각(ms, Date.now() + 4h).
// - 탭 간 동기화는 storage 이벤트로. 같은 탭 내 다중 instance는 커스텀 이벤트로.
// - 만료 체크는 mount + visibilitychange에서.
// - SSR(/out 빌드)에서는 항상 false로 렌더 → hydration 이후에만 true로 승격.
// - 공용 PC 이탈 가드 (PR10 C1): 활성 상태에서 15분 무활동 시 자동 exit.
//   activity = mousemove/keydown/click/scroll/touchstart. 강의실 PC에서 강사 이탈 후
//   다음 사용자가 강사 콘텐츠 접하는 위험 차단.

const STORAGE_KEY = "jb:instructor_until";
// TTL: 4시간 — 실강의 4h 운영 기준 (회의 결정 + PR-C 명시).
// 강사가 강의 시작 시 활성 → 강의 종료 시점에 자연 만료. 실강의가 4h를 초과할 경우
// 강사가 URL 쿼리(?mode=instructor) 또는 Alt+Shift+I 단축키로 재활성. 운영 안전성 유지.
const TTL_MS = 4 * 60 * 60 * 1000;
const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15분 무활동 가드
const CHANGE_EVENT = "jb:instructor_change";

// 같은 페이지 로드 내에서 URL 쿼리 처리를 1회만 수행 (여러 instance가 동시에 마운트될 때).
let urlQueryHandled = false;

function readUntil(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

function writeUntil(until: number): void {
  if (typeof window === "undefined") return;
  try {
    if (until <= 0) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, String(until));
    }
  } catch {
    /* no-op */
  }
}

function broadcastChange(): void {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    /* no-op */
  }
}

type State = {
  active: boolean;
  until: number; // 0이면 비활성, 0보다 크면 만료 시각(ms)
};

export function useInstructorMode() {
  const [state, setState] = useState<State>({ active: false, until: 0 });

  const enter = useCallback(() => {
    setState((prev) => {
      if (prev.active) return prev;
      const until = Date.now() + TTL_MS;
      writeUntil(until);
      // 같은 탭 내 다른 instance에 알림
      queueMicrotask(broadcastChange);
      return { active: true, until };
    });
  }, []);

  const exit = useCallback(() => {
    setState((prev) => {
      if (!prev.active) return prev;
      writeUntil(0);
      queueMicrotask(broadcastChange);
      return { active: false, until: 0 };
    });
  }, []);

  // URL 쿼리 + 초기 LS 체크 (마운트 1회).
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 페이지 로드당 1회만 URL 쿼리 처리.
    if (!urlQueryHandled) {
      urlQueryHandled = true;
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get("mode");
      if (modeParam === "instructor" || modeParam === "student") {
        if (modeParam === "instructor") enter();
        else exit();
        params.delete("mode");
        const qs = params.toString();
        const newUrl =
          window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash;
        window.history.replaceState(null, "", newUrl);
        return;
      }
    }

    // 이 instance의 state를 LS와 동기화.
    const until = readUntil();
    const now = Date.now();
    if (until > 0 && until > now) {
      setState((prev) => (prev.active ? prev : { active: true, until }));
    } else if (until > 0) {
      // 만료된 LS 값 → 정리.
      exit();
    }
  }, [enter, exit]);

  // 탭 간/instance 간 동기화.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncFromLS = () => {
      const until = readUntil();
      const now = Date.now();
      if (until > 0 && until > now) {
        setState((prev) => (prev.active ? prev : { active: true, until }));
      } else {
        // LS가 비었거나 만료된 상태 — 로컬 state도 끔.
        setState((prev) => (prev.active ? { active: false, until: 0 } : prev));
      }
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) syncFromLS();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") syncFromLS();
    };
    const onChange = () => syncFromLS();

    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener(CHANGE_EVENT, onChange);
    };
  }, []);

  // C1 — 공용 PC 이탈 가드: active일 때만 idle timer 가동.
  // 15분 무활동 → exit. activity 이벤트로 timer reset.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!state.active) return;

    let idleTimer: number | null = null;

    const resetIdleTimer = () => {
      if (idleTimer !== null) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        exit();
      }, IDLE_TIMEOUT_MS);
    };

    const events: (keyof DocumentEventMap)[] = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
    ];
    events.forEach((evt) =>
      document.addEventListener(evt, resetIdleTimer, { passive: true })
    );
    resetIdleTimer();

    return () => {
      if (idleTimer !== null) window.clearTimeout(idleTimer);
      events.forEach((evt) => document.removeEventListener(evt, resetIdleTimer));
    };
  }, [state.active, exit]);

  // C2 — 키보드 단축키 (Alt+Shift+I) 토글.
  // 인풋·텍스트영역에서 입력 중일 땐 무시. 항상 등록 (active와 무관).
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey || !e.shiftKey) return;
      if (e.key !== "I" && e.key !== "i") return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || target?.isContentEditable) return;
      e.preventDefault();
      if (state.active) exit();
      else enter();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.active, enter, exit]);

  return { active: state.active, until: state.until, enter, exit };
}
