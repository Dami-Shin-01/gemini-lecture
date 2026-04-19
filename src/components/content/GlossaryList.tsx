import { glossary, tierLabel, type GlossaryTier } from "@/lib/glossary";

const order: GlossaryTier[] = ["basic", "applied", "advanced"];
const sectionKicker: Record<GlossaryTier, string> = {
  basic: "TIER 1 · 기초 — 먼저 만지는 도구",
  applied: "TIER 2 · 응용 — 흐름에 얹는 층",
  advanced: "TIER 3 · 고급 — 튜닝·개발자 영역",
};

export function GlossaryList() {
  return (
    <div className="glossary-list my-6">
      {order.map((tier) => {
        const terms = glossary.filter((t) => t.tier === tier);
        if (terms.length === 0) return null;
        return (
          <section
            key={tier}
            aria-label={`${tierLabel[tier]} 수준 용어`}
            className={`glossary-tier glossary-tier--${tier} mt-10 first:mt-0`}
          >
            <header className="glossary-tier__header mb-3">
              <p className="kicker">{sectionKicker[tier]}</p>
              <h3
                className="text-lg font-semibold text-text-primary mt-1"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {tierLabel[tier]}{" "}
                <span className="text-text-muted text-sm font-normal">
                  · {terms.length}개
                </span>
              </h3>
            </header>
            <ul role="list" className="flex flex-col gap-3">
              {terms.map((t) => (
                <li
                  key={t.id}
                  id={`term-${t.id}`}
                  className="scroll-mt-[calc(var(--nav-offset)+64px)]"
                >
                  <div className="flex items-baseline flex-wrap gap-x-2 mb-1">
                    <span
                      className="text-[17px] font-semibold text-text-primary"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {t.term}
                    </span>
                    <span
                      className="tier-badge"
                      data-tier={t.tier}
                      aria-label={`${tierLabel[t.tier]} 수준 용어`}
                    >
                      {tierLabel[t.tier].toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1.5">
                    {t.usage}
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {t.detail}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
