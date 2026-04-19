"use client";

import { useCallback, useEffect, useState } from "react";
import { track } from "@/lib/analytics";

// 강사 모드 설계 — PR5 Phase A 결정 요약:
// - 기본은 수강생 모드(모든 expert 블록 숨김). 강사만 opt-in.
// - 활성화 경로 2가지:
//   1) URL `?mode=instructor`로 진입하면 LS에 만료시각을 저장하고 쿼리를 제거.
//   2) 치트시트(ch08/c1)의 InstructorToggle 버튼으로 수동 전환.
// - LS 값: `jb:instructor_until` = 만료 시각(ms, Date.now() + 4h).
// - 탭 간 동기화는 storage 이벤트로. 만료 체크는 mount + visibilitychange에서.
// - SSR(/out 빌드)에서는 항상 false로 렌더 → hydration 이후에만 true로 승격.
//   수강생 경로는 flash 없음(항상 false). 강사 경로는 잠깐 깜빡일 수 있으나 허용.

const STORAGE_KEY = "jb:instructor_until";
const TTL_MS = 4 * 60 * 60 * 1000; // 4시간

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

type State = {
  active: boolean;
  until: number; // 0이면 비활성, 0보다 크면 만료 시각(ms)
};

export function useInstructorMode() {
  const [state, setState] = useState<State>({ active: false, until: 0 });

  const enter = useCallback((source: "query" | "toggle") => {
    const until = Date.now() + TTL_MS;
    writeUntil(until);
    setState({ active: true, until });
    try {
      track("instructor_mode_enter", { source, ttl_ms: TTL_MS });
    } catch {
      /* no-op */
    }
  }, []);

  const exit = useCallback(
    (reason: "manual" | "ttl_expire") => {
      writeUntil(0);
      setState({ active: false, until: 0 });
      try {
        track("instructor_mode_exit", { reason });
      } catch {
        /* no-op */
      }
      if (reason === "ttl_expire") {
        try {
          track("instructor_mode_auto_expire", {});
        } catch {
          /* no-op */
        }
      }
    },
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    // URL 진입 처리: ?mode=instructor 또는 ?mode=student
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get("mode");
    if (modeParam === "instructor") {
      enter("query");
      params.delete("mode");
      const qs = params.toString();
      const newUrl =
        window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash;
      window.history.replaceState(null, "", newUrl);
      return;
    }
    if (modeParam === "student") {
      exit("manual");
      params.delete("mode");
      const qs = params.toString();
      const newUrl =
        window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash;
      window.history.replaceState(null, "", newUrl);
      return;
    }

    // 일반 진입: LS 확인
    const until = readUntil();
    const now = Date.now();
    if (until > 0 && until > now) {
      setState({ active: true, until });
    } else if (until > 0) {
      // 만료된 값이 남아 있으면 정리
      exit("ttl_expire");
    }
  }, [enter, exit]);

  // 탭 복귀·storage 이벤트로 상태 동기화
  useEffect(() => {
    if (typeof window === "undefined") return;

    const recheck = () => {
      const until = readUntil();
      const now = Date.now();
      if (until > 0 && until > now) {
        setState((prev) => (prev.active ? prev : { active: true, until }));
      } else {
        setState((prev) => {
          if (!prev.active) return prev;
          try {
            track("instructor_mode_auto_expire", {});
            track("instructor_mode_exit", { reason: "ttl_expire" });
          } catch {
            /* no-op */
          }
          return { active: false, until: 0 };
        });
      }
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) recheck();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") recheck();
    };

    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return { active: state.active, until: state.until, enter, exit };
}
