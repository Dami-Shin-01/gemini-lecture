import Image from "next/image";

interface ConceptCardProps {
  title: string;
  oneLiner: string;
  purpose?: string;
  screenshot?: string;
  keyTip?: string;
}

export function ConceptCard({ title, oneLiner, purpose, screenshot, keyTip }: ConceptCardProps) {
  return (
    <div
      className="my-6 rounded-lg border border-cream-dark bg-white shadow-sm"
      style={{ borderLeft: "4px solid var(--color-accent)" }}
    >
      <div className="p-6">
        <h3 className="text-lg font-bold text-text-primary">{title}</h3>
        <p className="mt-1 text-sm text-text-muted">{oneLiner}</p>

        {purpose && (
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">{purpose}</p>
        )}

        {screenshot && (
          <div className="mt-4 overflow-hidden rounded-md border border-cream-dark">
            <Image
              src={screenshot}
              alt={title}
              width={800}
              height={450}
              className="h-auto w-full"
            />
          </div>
        )}

        {keyTip && (
          <div
            className="mt-4 rounded-md px-3 py-2 text-xs font-medium"
            style={{
              backgroundColor: "var(--color-accent-light)",
              color: "var(--color-accent)",
            }}
          >
            {keyTip}
          </div>
        )}
      </div>
    </div>
  );
}
