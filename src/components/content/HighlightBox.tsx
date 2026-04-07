import { ReactNode } from "react";
import { Lightbulb, AlertTriangle, Sparkles, AlertCircle } from "lucide-react";

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
  const { icon: Icon, defaultTitle, bgColor, borderColor } = config[type];

  return (
    <div
      className="my-6 rounded-lg p-5"
      style={{
        backgroundColor: bgColor,
        borderLeft: `4px solid ${borderColor}`,
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <Icon size={18} style={{ color: borderColor }} />
        <span className="text-sm font-semibold" style={{ color: borderColor }}>
          {title || defaultTitle}
        </span>
      </div>
      <div className="text-sm leading-relaxed text-text-secondary">
        {children}
      </div>
    </div>
  );
}
