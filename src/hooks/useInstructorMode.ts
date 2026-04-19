"use client";

import { useCallback, useEffect, useState } from "react";
import { track } from "@/lib/analytics";

// 강사 모드 설계 — PR5 Phase A 결정 + QA 반영:
// - 기본은 수강생 모드(모든 expert 블록 숨김). 강사만 opt-in.
// - 활성화 경로 2가지:
//   1) URL `?mode=instructor`로 진입하면 LS에 만료시각을 저장하고 쿼리를 제거.
//   2) 치트시트(ch08/c1)의 InstructorToggle 버튼으로 수동 전환.
// - LS 값: `jb:instructor_until` = 만료 시각(ms, Date.now() + 4h).
// - 탭 간 동기화는 storage 이벤트로. 같은 탭 내 다중 instance는 커스텀 이벤트로.
// - 만료 체크는 mount + visibilitychange에서.
// - SSR(/out 빌드)에서는 항상 false로 렌더 → hydration 이후에만 true로 승격.
//
// QA(PR5 1차 리뷰) 반영:
// - enter는 inactive→active 전이에만 이벤트 발화 (중복 카운트 방지)
// - exit는 active→inactive 전이에만 이벤트 발화
// - auto_expire 별도 이벤트 제거 → exit의 `reason: "ttl_expire"` 단일 경로로 통합
// - URL 쿼리 처리는 module-level flag로 페이지 로드당 1회만 처리

const STORAGE_KEY = "jb:instructor_until";
const TTL_MS = 4 * 60 * 60 * 1000; // 4시간
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

  const enter = useCallback((source: "query" | "toggle") => {
    setState((prev) => {
      if (prev.active) return prev; // 이미 active면 no-op, 이벤트도 발화 X
      const until = Date.now() + TTL_MS;
      writeUntil(until);
      try {
        track("instructor_mode_enter", { source });
      } catch {
        /* no-op */
      }
      // 같은 탭 내 다른 instance에 알림
      queueMicrotask(broadcastChange);
      return { active: true, until };
    });
  }, []);

  const exit = useCallback((reason: "manual" | "ttl_expire") => {
    setState((prev) => {
      if (!prev.active) return prev; // 이미 inactive면 no-op
      writeUntil(0);
      try {
        track("instructor_mode_exit", { reason });
      } catch {
        /* no-op */
      }
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
        if (modeParam === "instructor") enter("query");
        else exit("manual");
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
      // 만료된 LS 값 → ttl_expire로 정리 (이벤트 1회).
      exit("ttl_expire");
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
        // exit()을 호출하면 (이미 active인 경우) ttl_expire 이벤트 1회 발화.
        // 이미 inactive면 no-op.
        setState((prev) => {
          if (!prev.active) return prev;
          try {
            track("instructor_mode_exit", { reason: "ttl_expire" });
          } catch {
            /* no-op */
          }
          return { active: false, until: 0 };
        });
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

  return { active: state.active, until: state.until, enter, exit };
}
