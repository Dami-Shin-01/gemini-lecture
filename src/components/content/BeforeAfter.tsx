import { ArrowRight, ArrowDown } from "lucide-react";

interface Side {
  label: string;
  prompt: string;
  result?: string;
}

interface BeforeAfterProps {
  before: Side;
  after: Side;
}

function SideBlock({ side, variant }: { side: Side; variant: "before" | "after" }) {
  const isBefore = variant === "before";

  return (
    <div
      className="flex-1 rounded-lg border p-5"
      style={{
        borderColor: isBefore ? "var(--color-cream-dark)" : "var(--color-accent)",
        backgroundColor: isBefore ? "var(--color-cream)" : "var(--color-accent-light)",
      }}
    >
      <span
        className="mb-3 inline-block rounded-full px-3 py-0.5 text-xs font-semibold"
        style={{
          backgroundColor: isBefore ? "var(--color-cream-dark)" : "var(--color-accent)",
          color: isBefore ? "var(--color-text-secondary)" : "#fff",
        }}
      >
        {side.label}
      </span>
      <p className="mt-2 text-sm leading-relaxed text-text-primary">{side.prompt}</p>
      {side.result && (
        <div className="mt-3 rounded-md bg-white/60 p-3 text-xs leading-relaxed text-text-secondary">
          {side.result}
        </div>
      )}
    </div>
  );
}

export function BeforeAfter({ before, after }: BeforeAfterProps) {
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
