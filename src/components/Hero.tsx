import type { CSSProperties } from "react";
import Image from "next/image";
import { experience, gallery, metrics, profile } from "@/content/site";
import { publicFileExists } from "@/lib/publicFile";
import { Counter } from "./Counter";
import { MarkedText } from "./primitives";
import { RotatingPhrase } from "./RotatingPhrase";
import { TechStack } from "./TechStack";

/** A strip of washi tape holding the polaroid down. */
function Tape({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`absolute z-10 h-7 w-24 bg-[repeating-linear-gradient(45deg,rgb(255_214_140/0.55)_0_6px,rgb(255_226_170/0.45)_6px_12px)] shadow-sm backdrop-blur-[1px] ${className}`}
    />
  );
}

/**
 * Server component. Text animates in with CSS (`.rise`), so the hero reads fine
 * before or without client JS; only the rotating phrase needs hydration.
 */
export function Hero() {
  const job = experience[0];
  const photo = publicFileExists(profile.photo) ? profile.photo : null;
  const behind = gallery.find((g) => g.tag === "GDG");
  const behindSrc = behind && publicFileExists(`/gallery/${behind.file}`) ? `/gallery/${behind.file}` : null;

  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40">
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          {job ? (
            <p className="rise inline-flex items-center gap-2.5 rounded-full border border-ink-700 bg-ink-900/80 py-1.5 pr-4 pl-3 text-xs text-paper-dim backdrop-blur">
              {profile.available ? (
                <span className="relative flex h-2 w-2" title={profile.availableLabel}>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
              ) : null}
              <span>
                {job.role} <span className="text-paper-faint">@</span>{" "}
                <span className="font-semibold tracking-wide text-paper uppercase">{job.company}</span>
              </span>
            </p>
          ) : null}

          <h1
            className="rise mt-8 text-[clamp(2.5rem,6.4vw,4.9rem)] leading-[1.04] font-bold tracking-[-0.04em] text-paper"
            style={{ animationDelay: "0.08s" }}
          >
            {profile.heroLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <span className="block text-[1.08em] tracking-normal">
              <RotatingPhrase phrases={profile.heroPhrases} />
            </span>
          </h1>

          <p
            className="rise mt-8 max-w-xl text-pretty text-lg leading-relaxed text-paper-dim"
            style={{ animationDelay: "0.2s" }}
          >
            <MarkedText text={profile.subhead} />
          </p>

          {profile.now ? (
            <p
              className="rise mt-5 flex max-w-xl items-baseline gap-3 text-sm text-paper-dim"
              style={{ animationDelay: "0.28s" }}
            >
              <span className="shrink-0 -rotate-3 font-hand text-lg text-pen">now →</span>
              <span>
                {profile.now}
                {profile.nowUpdated ? (
                  <span className="text-paper-faint"> · {profile.nowUpdated}</span>
                ) : null}
              </span>
            </p>
          ) : null}

          <div className="rise mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "0.36s" }}>
            <a
              href="#work"
              className="group rounded-full bg-paper px-6 py-3 text-sm font-semibold text-ink-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_0_-2px_var(--color-pen)]"
            >
              See my work
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="#ask"
              className="rounded-full border border-ink-600 px-6 py-3 text-sm font-medium text-paper transition-colors duration-300 hover:border-pen hover:text-pen"
            >
              Ask my portfolio
            </a>
          </div>

          <div className="rise mt-12" style={{ animationDelay: "0.44s" }}>
            <p className="mb-3 -rotate-1 font-hand text-xl text-paper-dim">My builder stack</p>
            <TechStack items={profile.builderStack} />
          </div>
        </div>

        {/* The polaroid */}
        <div className="rise relative mx-auto w-full max-w-[340px] lg:mr-0" style={{ animationDelay: "0.2s" }}>
          {behindSrc ? (
            <div
              aria-hidden
              className="absolute top-6 -left-10 hidden w-[78%] -rotate-6 rounded-sm bg-[#f6f1e7] p-2.5 pb-10 shadow-xl sm:block"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-ink-850">
                <Image src={behindSrc} alt="" fill sizes="260px" className="object-cover opacity-90" />
              </div>
            </div>
          ) : null}

          <figure className="group relative rotate-3 rounded-sm bg-[#fbf8f1] p-3.5 pb-4 shadow-[0_24px_50px_-12px_rgb(0_0_0/0.55)] transition-transform duration-500 ease-out hover:rotate-0 hover:scale-[1.02]">
            <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-3" />
            <div className="relative aspect-[4/5] overflow-hidden bg-[#e9e4d8]">
              {photo ? (
                <Image
                  src={photo}
                  alt={`Photo of ${profile.name}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 320px, 80vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl font-bold text-[#b9b2a3]">
                  {profile.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </div>
              )}
            </div>
            <figcaption className="mt-3 text-center font-hand text-xl text-[#2b2b33]">
              {profile.photoCaption}
            </figcaption>
          </figure>

          {/* Doodles: a star and a curly arrow pointing at the photo */}
          <svg
            aria-hidden
            viewBox="0 0 40 40"
            className="absolute -top-7 -right-4 h-10 w-10 text-pen"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path className="draw" style={{ "--len": 90, animationDelay: "0.9s" } as CSSProperties} d="M20 4v10M20 26v10M4 20h10M26 20h10M9 9l6 6M25 25l6 6M31 9l-6 6M15 25l-6 6" />
          </svg>
          <div aria-hidden className="absolute -bottom-12 -left-6 hidden items-end gap-1 text-pen sm:flex">
            <svg viewBox="0 0 70 50" className="h-12 w-16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path
                className="draw"
                style={{ "--len": 130, animationDelay: "1.1s" } as CSSProperties}
                d="M4 44c10-2 20-8 24-18 3-8-4-12-8-6-4 7 6 12 16 8 10-4 17-12 24-22m0 0-8 1m8-1-1 8"
              />
            </svg>
            <span className="mb-1 -rotate-6 font-hand text-base">that&apos;s me!</span>
          </div>
        </div>
      </div>

      {/* Metric band */}
      <div className="relative mx-auto max-w-6xl px-6">
        <p
          className="rise mt-24 mb-3 -rotate-1 font-hand text-lg text-pen"
          style={{ animationDelay: "0.5s" }}
        >
          from four client products ↓
        </p>
        <dl
          className="rise grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink-700 bg-ink-700 lg:grid-cols-4"
          style={{ animationDelay: "0.56s" }}
        >
          {metrics.map((m) => (
            <div key={m.label} className="bg-ink-900 p-6 transition-colors duration-500 hover:bg-ink-850">
              <dd className="text-[clamp(1.9rem,4vw,2.9rem)] leading-none font-bold tracking-tight text-paper">
                <Counter value={m.value} suffix={m.suffix} />
              </dd>
              <dt className="mt-3 text-sm font-medium text-paper">{m.label}</dt>
              <p className="mt-2 text-xs leading-relaxed text-paper-faint">{m.detail}</p>
            </div>
          ))}
        </dl>
        <p
          className="rise mt-5 font-mono text-[11px] tracking-[0.16em] text-paper-faint uppercase"
          style={{ animationDelay: "0.62s" }}
        >
          {profile.metricsNote}
        </p>
      </div>
    </section>
  );
}
