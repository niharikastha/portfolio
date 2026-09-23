import { skills } from "@/content/site";
import { isTool } from "@/lib/tech";
import { Reveal, Section, Tag } from "./primitives";
import { TechStack } from "./TechStack";

export function Skills() {
  return (
    <Section
      id="skills"
      title="Stack"
      lead="The tools I use most, grouped roughly by area. Hover a logo for its name."
    >
      <div className="grid gap-px overflow-hidden rounded-2xl border border-ink-700 bg-ink-700 sm:grid-cols-2">
        {skills.map((group, i) => (
          <Reveal key={group.group} delay={i * 0.06} className="bg-ink-900 p-7">
            <div className="flex items-baseline gap-3">
              <span className="nums text-[11px] text-gold-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper">
                {group.group}
              </h3>
            </div>
            {group.items.some(isTool) ? (
              <TechStack items={group.items.filter(isTool)} className="mt-5" />
            ) : null}
            {group.items.some((item) => !isTool(item)) ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items
                  .filter((item) => !isTool(item))
                  .map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
              </ul>
            ) : null}
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
