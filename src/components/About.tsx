import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { profile } from "@/content/site";
import { Reveal, Section } from "./primitives";

/** Only render the photo once the file is actually in /public. */
function hasPhoto() {
  return fs.existsSync(path.join(process.cwd(), "public", profile.photo));
}

export function About() {
  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <Section id="about" title="About">
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
            <div className="relative mb-7 aspect-[4/5] overflow-hidden rounded-xl border border-ink-700 bg-ink-850">
              {hasPhoto() ? (
                <Image
                  src={profile.photo}
                  alt={`Photo of ${profile.name}`}
                  fill
                  sizes="(min-width: 1024px) 360px, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center font-display text-6xl italic text-paper-faint">
                  {initials}
                </div>
              )}
            </div>
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
