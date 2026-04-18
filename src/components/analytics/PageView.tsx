"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

type Props = {
  event?: string;
  params?: Record<string, string | number>;
};

/**
 * 페이지 진입 시 한 번만 발화.
 * 동일 path/params로 재마운트 방지 — useEffect deps에 JSON.stringify
 */
export default function PageView({ event = "page_view", params = {} }: Props) {
  const paramsKey = JSON.stringify(params);
  useEffect(() => {
    try {
      track(event, params);
    } catch {
      // analytics 실패 무시
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, paramsKey]);
  return null;
}
