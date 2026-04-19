"use client";

import { ReactNode } from "react";
import { Lightbulb, AlertTriangle, Sparkles, AlertCircle } from "lucide-react";
import { useInstructorMode } from "@/hooks/useInstructorMode";

const config = {
  tip: {
    icon: Lightbulb,
    defaultTitle: "팁",
    bgColor: "var(--color-tip-bg)",
    borderColor: "var(--color-tip-border)",
  },
  warning: {
    icon: AlertTriangle,
    defaultTitle: "주의",
    bgColor: "var(--color-warning-bg)",
    borderColor: "var(--color-warning-border)",
  },
  expert: {
    icon: Sparkles,
    defaultTitle: "전문가 팁",
    bgColor: "var(--color-expert-bg)",
    borderColor: "var(--color-expert-border)",
  },
  important: {
    icon: AlertCircle,
    defaultTitle: "중요",
    bgColor: "var(--color-important-bg)",
    borderColor: "var(--color-important-border)",
  },
} as const;

interface HighlightBoxProps {
  type: "tip" | "warning" | "expert" | "important";
  title?: string;
  children: ReactNode;
}

export function HighlightBox({ type, title, children }: HighlightBoxProps) {
  const { active: instructorMode } = useInstructorMode();
  const { icon: Icon, defaultTitle, bgColor, borderColor } = config[type];

  // type="expert"는 강사 전용 가이드이므로 수강생 모드에선 DOM에서 제거.
  // SSR에선 instructorMode가 항상 false → 렌더되지 않음(수강생이 보는 첫 화면 기본값).
  // 강사는 hydration 후 opacity 페이드로 자연스럽게 등장.
  if (type === "expert" && !instructorMode) {
    return null;
  }

  const isInstructorExpert = type === "expert" && instructorMode;

  return (
    <div
      className={`my-6 rounded-xl overflow-hidden ${
        isInstructorExpert ? "instructor-expert" : ""
      }`}
      style={{ backgroundColor: bgColor }}
      data-instructor-only={type === "expert" ? "true" : undefined}
    >
      {/* Top border accent */}
      <div className="h-1" style={{ backgroundColor: borderColor }} />
      <div className="px-5 py-4">
        <div className="mb-2 flex items-center gap-2">
          <Icon size={18} style={{ color: borderColor }} />
          <span className="text-sm font-semibold" style={{ color: borderColor }}>
            {title || defaultTitle}
          </span>
          {isInstructorExpert && (
            <span
              className="ml-auto text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-accent)]/15 text-[var(--color-accent)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              강사 전용 · 수강생 비노출
            </span>
          )}
        </div>
        <div className="text-sm leading-relaxed text-text-secondary">
          {children}
        </div>
      </div>
    </div>
  );
}
