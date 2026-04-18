import { glossary } from "@/lib/glossary";

export function GlossaryList() {
  return (
    <div className="my-6 flex flex-col gap-5">
      {glossary.map((t) => (
        <section
          key={t.id}
          id={`term-${t.id}`}
          className="scroll-mt-[calc(var(--nav-offset)+64px)] border-l-2 border-cream-dark pl-4"
        >
          <h3
            className="text-lg font-semibold text-text-primary mb-1"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t.term}
          </h3>
          <p className="text-[11px] text-text-muted uppercase tracking-wider mb-2">
            {t.usage}
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">{t.detail}</p>
        </section>
      ))}
    </div>
  );
}
