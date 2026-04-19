"use client";

import { useCallback, useEffect, useRef } from "react";
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
  const openedAtRef = useRef<number | null>(null);
  // Refs instead of state: ensures the toggle handler reads the latest value
  // synchronously within the same microtask tick, avoiding the race where
  // setInitialized(true) commits after the native toggle event fires.
  const initializedRef = useRef(false);
  const suppressNextToggleRef = useRef(false);
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
      // Setting `.open` programmatically fires a native toggle event.
      // Suppress exactly that next event so it is not counted as user-opened.
      suppressNextToggleRef.current = true;
      el.open = shouldOpen;
      if (shouldOpen) openedAtRef.current = performance.now();
    }
    initializedRef.current = true;
  }, [storageKey]);

  const onToggle = useCallback(
    (e: React.SyntheticEvent<HTMLDetailsElement>) => {
      if (!initializedRef.current) return;
      if (suppressNextToggleRef.current) {
        suppressNextToggleRef.current = false;
        return;
      }
      const el = e.currentTarget;
      if (el.open) {
        openedAtRef.current = performance.now();
        track("deep_section_open", {
          ...(clipId ? { clip_id: clipId } : {}),
          ...(id ? { section_id: id } : {}),
        });
      } else {
        const dwell =
          openedAtRef.current !== null
            ? Math.min(
                Math.round(performance.now() - openedAtRef.current),
                10 * 60 * 1000
              )
            : 0;
        openedAtRef.current = null;
        track("deep_section_close", {
          ...(clipId ? { clip_id: clipId } : {}),
          ...(id ? { section_id: id } : {}),
          dwell_ms: dwell,
        });
      }
    },
    [clipId, id]
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
