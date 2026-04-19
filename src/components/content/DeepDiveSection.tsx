"use client";

import { useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";

interface Props {
  title: string;
  id?: string;
  clipId?: string;
  children: React.ReactNode;
}

export function DeepDiveSection({ title, id, clipId, children }: Props) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const storageKey = clipId ? `jb:deep-dive-open:${clipId}` : null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const deepParam = params.get("deep");
    let shouldOpen: boolean | null = null;
    if (deepParam === "open") shouldOpen = true;
    else if (deepParam === "closed") shouldOpen = false;
    else if (storageKey) {
      const stored = window.localStorage.getItem(storageKey);
      if (stored === "true") shouldOpen = true;
      if (stored === "false") shouldOpen = false;
    }
    const el = detailsRef.current;
    if (shouldOpen !== null && el && el.open !== shouldOpen) {
      el.open = shouldOpen;
    }
  }, [storageKey]);

  return (
    <details
      ref={detailsRef}
      id={id ? `deep-${id}` : undefined}
      data-deep-section
      data-clip-id={clipId ?? ""}
      data-section-id={id ?? ""}
      className="deep-section"
    >
      <summary className="min-h-[44px]">
        <ChevronRight size={16} className="deep-chevron shrink-0 mt-1" aria-hidden="true" />
        <span className="flex flex-col">
          <span className="kicker">심화</span>
          <span
            className="text-[1.25rem] sm:text-[1.375rem] font-medium leading-tight"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
          >
            {title}
          </span>
        </span>
      </summary>
      <div className="deep-section__body mt-3">{children}</div>
    </details>
  );
}
