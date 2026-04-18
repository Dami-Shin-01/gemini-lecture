"use client";

import { useCallback, useId, useRef, useState } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { track } from "@/lib/analytics";

interface Side {
  label: string;
  prompt: string;
  result?: string;
  meta?: string; // 예: "약 25분 · 6단계"
}

interface BeforeAfterProps {
  before: Side;
  after: Side;
  /** 기본 true. false면 기존 2분할 정적 뷰. */
  interactive?: boolean;
  /** GA 발화 시 clip 식별자 (선택) */
  clipId?: string;
}

function SideBlock({
  side,
  variant,
  dim,
}: {
  side: Side;
  variant: "before" | "after";
  dim?: boolean;
}) {
  const isBefore = variant === "before";
  return (
    <div
      className="flex-1 rounded-lg border p-5 transition-opacity"
      style={{
        borderColor: isBefore ? "var(--color-before-border, var(--color-cream-dark))" : "var(--color-accent)",
        backgroundColor: isBefore
          ? "var(--color-before-bg, var(--color-cream))"
          : "var(--color-accent-light)",
        opacity: dim ? 0.6 : 1,
      }}
    >
      <span
        className="mb-3 inline-block rounded-full px-3 py-0.5 text-xs font-semibold"
        style={{
          backgroundColor: isBefore
            ? "var(--color-before-border, var(--color-cream-dark))"
            : "var(--color-accent)",
          color: isBefore
            ? "var(--color-before-text, var(--color-text-secondary))"
            : "#fff",
        }}
      >
        {side.label}
      </span>
      {side.meta && (
        <p className="mt-1 text-[11px] uppercase tracking-wider text-text-muted tabular-nums">
          {side.meta}
        </p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-text-primary">{side.prompt}</p>
      {side.result && (
        <div
          className="mt-3 rounded-md p-3 text-xs leading-relaxed text-text-secondary"
          style={{ backgroundColor: "var(--color-ba-result-bg)" }}
        >
          {side.result}
        </div>
      )}
    </div>
  );
}

function StaticBeforeAfter({ before, after }: Pick<BeforeAfterProps, "before" | "after">) {
  return (
    <div className="my-6 flex flex-col items-center gap-4 md:flex-row">
      <SideBlock side={before} variant="before" />
      <div className="flex shrink-0 items-center justify-center text-text-muted">
        <ArrowRight size={24} className="hidden md:block" />
        <ArrowDown size={24} className="block md:hidden" />
      </div>
      <SideBlock side={after} variant="after" />
    </div>
  );
}

function InteractiveBeforeAfter({
  before,
  after,
  clipId,
}: Pick<BeforeAfterProps, "before" | "after" | "clipId">) {
  const [active, setActive] = useState<"before" | "after">("before");
  const [focused, setFocused] = useState<"before" | "after">("before");
  const uid = useId();
  const tabBefore = `${uid}-tab-before`;
  const tabAfter = `${uid}-tab-after`;
  const panelBefore = `${uid}-panel-before`;
  const panelAfter = `${uid}-panel-after`;

  const tabRefs = useRef<{ before: HTMLButtonElement | null; after: HTMLButtonElement | null }>({
    before: null,
    after: null,
  });

  const switchTo = useCallback(
    (next: "before" | "after") => {
      setActive(next);
      setFocused(next);
      track("before_after_toggle", { to: next, ...(clipId ? { clip_id: clipId } : {}) });
    },
    [clipId]
  );

  const handleKey = (e: React.KeyboardEvent<HTMLButtonElement>, self: "before" | "after") => {
    const other = self === "before" ? "after" : "before";
    if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
      e.preventDefault();
      setFocused(other);
      tabRefs.current[other]?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      switchTo(self);
    }
  };

  return (
    <div className="my-6">
      <div
        role="tablist"
        aria-label="비교 보기 전환"
        className="inline-flex items-center gap-1 p-1 rounded-full bg-[var(--color-cream-dark)]/40 mb-4"
      >
        {(["before", "after"] as const).map((key) => {
          const isActive = active === key;
          const label = key === "before" ? before.label || "AI 없이" : after.label || "Gemini와";
          const tabId = key === "before" ? tabBefore : tabAfter;
          const panelId = key === "before" ? panelBefore : panelAfter;
          return (
            <button
              key={key}
              ref={(el) => {
                tabRefs.current[key] = el;
              }}
              role="tab"
              id={tabId}
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={focused === key ? 0 : -1}
              onClick={() => switchTo(key)}
              onKeyDown={(e) => handleKey(e, key)}
              className={`min-h-[44px] px-4 text-xs sm:text-sm rounded-full transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${
                isActive
                  ? "bg-[var(--color-accent)] text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={panelBefore}
        aria-labelledby={tabBefore}
        hidden={active !== "before"}
      >
        <SideBlock side={before} variant="before" />
      </div>
      <div
        role="tabpanel"
        id={panelAfter}
        aria-labelledby={tabAfter}
        hidden={active !== "after"}
      >
        <SideBlock side={after} variant="after" />
      </div>

      <p className="mt-3 text-[11px] text-text-muted">
        탭을 바꿔 동일 상황에서 AI가 어떤 차이를 만드는지 비교하세요.
      </p>
    </div>
  );
}

export function BeforeAfter({
  before,
  after,
  interactive = true,
  clipId,
}: BeforeAfterProps) {
  if (interactive === false) {
    return <StaticBeforeAfter before={before} after={after} />;
  }
  return <InteractiveBeforeAfter before={before} after={after} clipId={clipId} />;
}
