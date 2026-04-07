"use client";

import { useState, useEffect, useCallback } from "react";

type FontSize = "sm" | "md" | "lg";

export function useFontSize() {
  const [fontSize, setFontSize] = useState<FontSize>("md");

  useEffect(() => {
    const saved = localStorage.getItem("fontSize") as FontSize | null;
    if (saved && ["sm", "md", "lg"].includes(saved)) {
      setFontSize(saved);
      document.documentElement.className = document.documentElement.className
        .replace(/font-(sm|md|lg)/g, "")
        .trim();
      document.documentElement.classList.add(`font-${saved}`);
    }
  }, []);

  const changeFontSize = useCallback((size: FontSize) => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
    document.documentElement.className = document.documentElement.className
      .replace(/font-(sm|md|lg)/g, "")
      .trim();
    document.documentElement.classList.add(`font-${size}`);
  }, []);

  return { fontSize, changeFontSize };
}
