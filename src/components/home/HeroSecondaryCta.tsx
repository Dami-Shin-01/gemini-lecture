"use client";

import { useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { track } from "@/lib/analytics";

export default function HeroSecondaryCta() {
  const onClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    track("hero_secondary_click", { anchor: "jb-roles" });
    const target = document.getElementById("jb-roles");
    if (target) {
      e.preventDefault();
      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
      }
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
      target.focus({ preventScroll: true });
    }
  }, []);

  return (
    <a
      href="#jb-roles"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 min-h-[44px] px-3 text-sm text-text-secondary hover:text-text-primary transition-colors rounded-full outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
    >
      내 역할부터 골라볼래요
      <ChevronDown size={16} className="motion-safe:animate-pulse" />
    </a>
  );
}
