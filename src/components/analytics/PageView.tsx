"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

type Props = {
  event?: string;
  params?: Record<string, string | number>;
  // 재방문 추적용 localStorage 키. 주어지면 is_reuse: 0|1을 params에 합쳐 전송하고
  // 첫 방문 시 LS에 플래그를 기록한다. clip_view 같은 클립 단위 이벤트에 사용.
  reuseKey?: string;
};

/**
 * 페이지 진입 시 한 번만 발화.
 * 동일 path/params로 재마운트 방지 — useEffect deps에 JSON.stringify
 */
export default function PageView({ event = "page_view", params = {}, reuseKey }: Props) {
  const paramsKey = JSON.stringify(params);
  useEffect(() => {
    try {
      let isReuse = 0;
      if (reuseKey && typeof window !== "undefined") {
        try {
          const seen = window.localStorage.getItem(reuseKey);
          isReuse = seen ? 1 : 0;
          if (!seen) {
            window.localStorage.setItem(reuseKey, String(Date.now()));
          }
        } catch {
          // storage 접근 실패 무시 (Safari Private 등)
        }
      }
      const payload = reuseKey ? { ...params, is_reuse: isReuse } : params;
      track(event, payload);
    } catch {
      // analytics 실패 무시
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, paramsKey, reuseKey]);
  return null;
}
