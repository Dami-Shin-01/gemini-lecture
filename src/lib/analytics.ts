// GA4 / Plausible 래퍼. 개인정보·자유입력·선택지 값 절대 전송 금지.
// 행위의 유무·범주만 기록한다.

type Params = Record<string, string | number | boolean>;
type Provider = "ga" | "plausible" | "auto";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: Params }) => void;
    __jb_session_started?: boolean;
  }
}

function getProvider(): Provider {
  const raw = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER;
  if (raw === "ga" || raw === "plausible") return raw;
  return "auto";
}

// Plausible은 숫자/boolean props를 문자열로 보관 — 정규화
function normalizeForPlausible(params: Params): Params {
  const out: Params = {};
  for (const [k, v] of Object.entries(params)) {
    out[k] = typeof v === "string" ? v : String(v);
  }
  return out;
}

function emit(event: string, params: Params) {
  const provider = getProvider();
  const hasGa = typeof window !== "undefined" && typeof window.gtag === "function";
  const hasPlausible =
    typeof window !== "undefined" && typeof window.plausible === "function";

  try {
    if (provider === "ga") {
      if (hasGa) window.gtag?.("event", event, params);
      return;
    }
    if (provider === "plausible") {
      if (hasPlausible)
        window.plausible?.(event, { props: normalizeForPlausible(params) });
      return;
    }
    // auto: 설치된 툴 모두에 보냄. 둘 다 설치된 환경에서는 중복 발생 — 그런 환경은
    // NEXT_PUBLIC_ANALYTICS_PROVIDER로 명시적 분기를 권장한다.
    if (hasGa) window.gtag?.("event", event, params);
    if (hasPlausible)
      window.plausible?.(event, { props: normalizeForPlausible(params) });
  } catch {
    // analytics 실패는 사용자 경험을 방해하면 안 된다
  }
}

export function track(event: string, params: Params = {}): void {
  if (typeof window === "undefined") return;
  if (!window.__jb_session_started) {
    window.__jb_session_started = true;
    emit("session_start", {});
  }
  emit(event, params);
}
