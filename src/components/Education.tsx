import { education } from "@/content/site";
import { Reveal, Section } from "./primitives";

export function Education() {
  return (
    <Section id="education" title="Education">
      <div className="overflow-hidden rounded-2xl border border-ink-700">
        {education.map((item, i) => (
          <Reveal
            key={item.credential}
            delay={i * 0.05}
            className={`bg-ink-900 ${i > 0 ? "border-t border-ink-700" : ""}`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 p-7">
              <div className="min-w-0">
                <h3 className="text-lg font-medium text-paper">{item.credential}</h3>
                <p className="mt-1 text-sm text-paper-dim">{item.institution}</p>
              </div>
              <div className="flex items-baseline gap-6">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper-faint">
                  {item.period}
                </span>
                <span className="nums text-lg text-gold-400">{item.score}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
