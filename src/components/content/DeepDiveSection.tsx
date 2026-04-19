"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { track } from "@/lib/analytics";

interface Props {
  title: string;
  id?: string;
  clipId?: string;
  children: React.ReactNode;
}

export function DeepDiveSection({ title, id, clipId, children }: Props) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [initialized, setInitialized] = useState(false);
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
    if (shouldOpen !== null && detailsRef.current) {
      detailsRef.current.open = shouldOpen;
    }
    setInitialized(true);
  }, [storageKey]);

  const onToggle = useCallback(
    (e: React.SyntheticEvent<HTMLDetailsElement>) => {
      if (!initialized) return;
      const el = e.currentTarget;
      const state = el.open ? "open" : "close";
      track(`deep_section_${state}`, {
        ...(clipId ? { clip_id: clipId } : {}),
        ...(id ? { section_id: id } : {}),
      });
    },
    [initialized, clipId, id]
  );

  return (
    <details
      ref={detailsRef}
      id={id ? `deep-${id}` : undefined}
      data-deep-section
      data-clip-id={clipId ?? ""}
      data-section-id={id ?? ""}
      className="deep-section"
      onToggle={onToggle}
    >
      <summary>
        <ChevronRight size={16} className="deep-chevron shrink-0" aria-hidden="true" />
        <span className="flex flex-col">
          <span className="kicker">심화</span>
          <span
            className="text-lg font-semibold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </span>
        </span>
      </summary>
      <div className="deep-section__body mt-3">{children}</div>
    </details>
  );
}
