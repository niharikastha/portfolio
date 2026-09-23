"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { kickers } from "@/content/site";

/** Bold a **wrapped** span inside content strings, so data stays plain text. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold text-paper">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/** Fades and lifts children in once, when they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Section wrapper: consistent rhythm and a readable heading. */
export function Section({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          {kickers[id] ? <Kicker text={kickers[id]} /> : null}
          <h2
            id={`${id}-heading`}
            className="font-display text-[clamp(2rem,4.5vw,3.1rem)] font-bold leading-tight tracking-[-0.03em] text-paper"
          >
            {title}
          </h2>
          <div className="rule-fade mt-6" />
          {lead ? (
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-paper-dim">
              {lead}
            </p>
          ) : null}
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

/** Small monospace chip used for tech stacks and tags. */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <li className="rounded-full border border-ink-700 bg-ink-850 px-3 py-1 font-mono text-[11px] tracking-wide text-paper-dim transition-colors duration-300 hover:border-gold-500/60 hover:text-paper">
      {children}
    </li>
  );
}

/** A margin note in red pen, with a little arrow curling down to the heading. */
export function Kicker({ text }: { text: string }) {
  return (
    <p className="mb-1 flex -rotate-2 items-end gap-1.5 font-hand text-xl text-pen">
      <span>{text}</span>
      <svg aria-hidden width="30" height="22" viewBox="0 0 30 22" fill="none" className="translate-y-2">
        <path
          d="M2 3c9 0 17 3 20 12m0 0-5-2m5 2 2-5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </p>
  );
}

/** Like RichText, but **wrapped** phrases get a highlighter swipe instead of bold. */
export function MarkedText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <mark key={i} className="marker bg-transparent text-paper">
            {part.slice(2, -2)}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
