"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

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

/** Section wrapper: consistent rhythm, and a numbered eyebrow heading. */
export function Section({
  id,
  index,
  title,
  lead,
  children,
}: {
  id: string;
  index: string;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="flex items-baseline gap-4">
            <span className="nums text-xs text-gold-400">{index}</span>
            <h2
              id={`${id}-heading`}
              className="font-mono text-xs uppercase tracking-[0.22em] text-paper-dim"
            >
              {title}
            </h2>
          </div>
          <div className="rule-fade mt-5" />
          {lead ? (
            <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-paper-dim">
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
