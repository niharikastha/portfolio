import { experience } from "@/content/site";
import { Reveal, RichText, Section, Tag } from "./primitives";

export function Experience() {
  return (
    <Section id="experience" index="02" title="Experience">
      <div className="space-y-16">
        {experience.map((job) => (
          <Reveal key={job.company}>
            <article className="grid gap-8 lg:grid-cols-[1fr_2fr]">
              <header className="lg:sticky lg:top-28 lg:self-start">
                <h3 className="text-3xl font-medium tracking-tight text-paper">{job.company}</h3>
                <p className="mt-2 font-display text-xl italic text-gold-400">{job.role}</p>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-paper-faint">
                  {job.period}
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-paper-faint">
                  {job.location}
                </p>

                <div className="mt-7">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-faint">
                    Products shipped
                  </p>
                  <ul className="mt-3 space-y-2">
                    {job.products.map((p) => (
                      <li key={p.name} className="flex items-baseline justify-between gap-3 border-b border-ink-800 pb-2">
                        <span className="text-sm font-medium text-paper">{p.name}</span>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                          {p.domain}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </header>

              <div>
                <p className="text-pretty leading-relaxed text-paper-dim">{job.summary}</p>

                <ul className="mt-8 space-y-5">
                  {job.highlights.map((h, i) => (
                    <li key={h} className="flex gap-5">
                      <span
                        aria-hidden
                        className="nums shrink-0 pt-1 text-[11px] text-gold-500"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-pretty leading-relaxed text-paper-dim">
                        <RichText text={h} />
                      </p>
                    </li>
                  ))}
                </ul>

                <ul className="mt-9 flex flex-wrap gap-2">
                  {job.stack.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
