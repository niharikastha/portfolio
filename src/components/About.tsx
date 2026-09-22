import { profile } from "@/content/site";
import { Reveal, Section } from "./primitives";

export function About() {
  return (
    <Section id="about" index="03" title="About">
      <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {profile.about.map((para, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <p
                className={
                  i === 0
                    ? "text-pretty text-xl leading-relaxed text-paper sm:text-2xl sm:leading-relaxed"
                    : "text-pretty leading-relaxed text-paper-dim"
                }
              >
                {para}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <aside className="rounded-2xl border border-ink-700 bg-ink-900 p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-faint">
              At a glance
            </p>
            <dl className="mt-5 space-y-4 text-sm">
              {[
                ["Role", profile.role],
                ["Experience", "~3 years"],
                ["Based in", profile.location],
                ["Focus", "RAG · LLM systems · Node"],
                ["Open to", "Remote & hybrid"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-ink-800 pb-3 last:border-0 last:pb-0">
                  <dt className="text-paper-faint">{k}</dt>
                  <dd className="text-right font-medium text-paper">{v}</dd>
                </div>
              ))}
            </dl>

            <a
              href={profile.resumePath}
              download
              className="mt-7 block rounded-full border border-ink-600 py-2.5 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors duration-300 hover:border-gold-400 hover:text-gold-400"
            >
              Download résumé
            </a>
          </aside>
        </Reveal>
      </div>
    </Section>
  );
}
