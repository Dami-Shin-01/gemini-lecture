"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

type Props = {
  page: string;
};

export default function ScrollDepth({ page }: Props) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fired = new Set<number>();
    let ticking = false;

    function compute() {
      ticking = false;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = (window.scrollY / scrollable) * 100;
      for (const threshold of [50, 100]) {
        if (pct >= threshold && !fired.has(threshold)) {
          fired.add(threshold);
          track(`scroll_${threshold}`, { page });
        }
      }
    }

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    compute();
    return () => window.removeEventListener("scroll", onScroll);
  }, [page]);

  return null;
}
