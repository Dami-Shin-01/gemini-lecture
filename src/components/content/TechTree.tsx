import { ChevronRight, ChevronDown } from "lucide-react";

interface Level {
  level: number;
  title: string;
  description: string;
  items: string[];
  current?: boolean;
}

interface TechTreeProps {
  levels: Level[];
}

export function TechTree({ levels }: TechTreeProps) {
  return (
    <div className="my-6 flex flex-col items-stretch gap-2 md:flex-row md:items-start">
      {levels.map((lvl, i) => (
        <div key={lvl.level} className="flex flex-col items-center md:flex-row md:flex-1">
          {/* Card */}
          <div
            className="w-full rounded-lg border-2 p-5"
            style={{
              borderColor: lvl.current
                ? "var(--color-accent)"
                : "var(--color-cream-dark)",
              backgroundColor: lvl.current
                ? "var(--color-accent-light)"
                : "white",
            }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
                style={{ backgroundColor: "var(--color-accent)" }}
              >
                Lv.{lvl.level}
              </span>
              {lvl.current && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-white">
                  현재 단계
                </span>
              )}
            </div>
            <h4 className="font-semibold text-text-primary">{lvl.title}</h4>
            <p className="mt-1 text-xs leading-relaxed text-text-secondary">
              {lvl.description}
            </p>
            <ul className="mt-3 space-y-1">
              {lvl.items.map((item, j) => (
                <li key={j} className="flex items-start gap-1.5 text-xs text-text-secondary">
                  <span className="mt-0.5 text-accent">&#8226;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Arrow between cards */}
          {i < levels.length - 1 && (
            <div className="flex shrink-0 items-center justify-center py-2 text-text-muted md:px-2 md:py-0">
              <ChevronRight size={24} className="hidden md:block" />
              <ChevronDown size={24} className="block md:hidden" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
