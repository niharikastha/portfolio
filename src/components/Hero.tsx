import { metrics, profile } from "@/content/site";
import { Counter } from "./Counter";

/**
 * Server component. The entrance animation is pure CSS (`.rise`), so the hero
 * is visible and readable before — or entirely without — client JavaScript.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44">
      {/* Ambient glow — keeps the dark field from reading flat */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gold-500/[0.07] blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-0 h-[380px] w-[520px] rounded-full bg-sky-soft/[0.05] blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        {profile.available ? (
          <div className="rise mb-10 flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper-dim">
              {profile.availableLabel}
            </span>
          </div>
        ) : null}

        <h1 className="text-balance text-[clamp(2.6rem,7.5vw,5.75rem)] font-medium leading-[0.98] tracking-[-0.03em]">
          {profile.headline.map((line, i) => (
            <span key={line} className="rise block" style={{ animationDelay: `${0.08 + i * 0.1}s` }}>
              {line}
            </span>
          ))}
        </h1>

        <div
          className="rise mt-9 flex flex-wrap items-center gap-x-4 gap-y-2"
          style={{ animationDelay: "0.32s" }}
        >
          <span className="font-display text-2xl italic text-gold-400">{profile.role}</span>
          <span aria-hidden className="hidden text-ink-600 sm:inline">
            /
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-paper-faint">
            {profile.location}
          </span>
        </div>

        <p
          className="rise mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-paper-dim sm:text-xl"
          style={{ animationDelay: "0.4s" }}
        >
          {profile.subhead}
        </p>

        <div
          className="rise mt-11 flex flex-wrap items-center gap-3"
          style={{ animationDelay: "0.5s" }}
        >
          <a
            href="#work"
            className="group rounded-full bg-paper px-6 py-3 text-sm font-semibold text-ink-950 transition-all duration-300 hover:bg-gold-400"
          >
            View selected work
            <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
          <a
            href={profile.resumePath}
            download
            className="rounded-full border border-ink-600 px-6 py-3 text-sm font-medium text-paper transition-colors duration-300 hover:border-gold-400 hover:text-gold-400"
          >
            Download résumé
          </a>
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-full border border-ink-600 px-6 py-3 text-sm font-medium text-paper transition-colors duration-300 hover:border-gold-400 hover:text-gold-400"
          >
            GitHub
          </a>
        </div>

        {/* Metric band — the numbers a recruiter should see in the first 3 seconds */}
        <dl
          className="rise mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink-700 bg-ink-700 lg:grid-cols-4"
          style={{ animationDelay: "0.62s" }}
        >
          {metrics.map((m) => (
            <div
              key={m.label}
              className="bg-ink-900 p-6 transition-colors duration-500 hover:bg-ink-850"
            >
              <dd className="text-[clamp(1.9rem,4vw,2.9rem)] font-medium leading-none tracking-tight text-paper">
                <Counter value={m.value} suffix={m.suffix} />
              </dd>
              <dt className="mt-3 text-sm font-medium text-paper">{m.label}</dt>
              <p className="mt-2 text-xs leading-relaxed text-paper-faint">{m.detail}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
