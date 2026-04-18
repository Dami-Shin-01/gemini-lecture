// GA4 / Plausible 래퍼. 개인정보·자유입력·선택지 값 절대 전송 금지.
// 행위의 유무·범주만 기록한다.

type Params = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: Params }) => void;
  }
}

export function track(event: string, params: Params = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", event, params);
    window.plausible?.(event, { props: params });
  } catch {
    // analytics 실패는 사용자 경험을 방해하면 안 된다
  }
}
