import { community, writing } from "@/content/site";
import { Reveal, Section, Tag } from "./primitives";

export function Writing() {
  return (
    <Section
      id="writing"
      index="06"
      title="Writing & community"
      lead="Notes I publish, and the rooms I show up in."
    >
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Writing */}
        <div>
          <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-faint">
            Posts
          </h3>
          <div className="mt-6 space-y-px overflow-hidden rounded-2xl border border-ink-700 bg-ink-700">
            {writing.map((post, i) => (
              <Reveal key={post.title} delay={i * 0.05} className="bg-ink-900">
                <a
                  href={post.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group block p-6 transition-colors duration-400 hover:bg-ink-850"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-sky-soft/80">
                      {post.platform}
                    </span>
                    <span className="nums text-[10px] text-paper-faint">{post.date}</span>
                  </div>
                  <h4 className="mt-3 text-lg font-medium leading-snug text-paper transition-colors duration-300 group-hover:text-gold-400">
                    {post.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-paper-dim">{post.blurb}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </ul>
                </a>
              </Reveal>
            ))}
          </div>

          <p className="mt-5 text-xs leading-relaxed text-paper-faint">
            More in progress — deep dives on hybrid retrieval and pgvector tuning.
          </p>
        </div>

        {/* Community */}
        <div>
          <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-faint">
            Community
          </h3>
          <div className="mt-6 space-y-px overflow-hidden rounded-2xl border border-ink-700 bg-ink-700">
            {community.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05} className="bg-ink-900 p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-sky-soft/80">
                    {item.role}
                  </span>
                  <span className="nums text-[10px] text-paper-faint">{item.date}</span>
                </div>
                <h4 className="mt-3 text-lg font-medium leading-snug text-paper">{item.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-paper-dim">{item.detail}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
