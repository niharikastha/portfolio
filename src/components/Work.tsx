"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { projects, type Project } from "@/content/site";
import Link from "next/link";
import { Reveal, RichText, Section, Tag } from "./primitives";
import { PipelineDiagram } from "./PipelineDiagram";

type Filter = "featured" | "all" | "personal" | "client";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "all", label: "Everything" },
  { key: "personal", label: "Personal" },
  { key: "client", label: "Client" },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduced = useReducedMotion();

  return (
    <motion.article
      layout={!reduced}
      initial={reduced ? undefined : { opacity: 0, y: 16 }}
      animate={reduced ? undefined : { opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -8 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-ink-700 bg-ink-900 p-7 transition-colors duration-500 hover:border-ink-600 sm:p-9"
    >
      {/* Hover sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gold-500/0 blur-3xl transition-all duration-700 group-hover:bg-gold-500/[0.07]"
      />

      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-medium tracking-tight text-paper">{project.name}</h3>
              {project.kind === "client" ? (
                <span className="rounded border border-ink-600 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                  Client
                </span>
              ) : null}
            </div>
            <p className="mt-1.5 font-display text-lg italic text-gold-400">{project.tagline}</p>
          </div>

          {project.metric ? (
            <div className="shrink-0 text-right">
              <div className="nums text-2xl font-medium leading-none text-paper">
                {project.metric.value}
              </div>
              <div className="mt-1 text-[11px] leading-tight text-paper-faint">
                {project.metric.label}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-paper-faint">
          <span>{project.period}</span>
          <span aria-hidden className="text-ink-600">
            ·
          </span>
          <span className="text-sky-soft/80">{project.domain}</span>
        </div>

        <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-paper-dim">
          {project.problem}
        </p>

        <ul className="mt-6 space-y-2.5">
          {project.highlights.map((h) => (
            <li key={h} className="flex gap-3 text-[15px] leading-relaxed text-paper-dim">
              <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-gold-500" />
              <span>
                <RichText text={h} />
              </span>
            </li>
          ))}
        </ul>

        {project.caseStudy && project.slug === "jobpilot" ? (
          <div className="mt-7">
            <PipelineDiagram steps={project.caseStudy.pipeline} compact />
          </div>
        ) : null}

        <ul className="mt-7 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </ul>

        {project.kind === "client" ? (
          <p className="mt-6 border-t border-ink-800 pt-5 text-xs leading-relaxed text-paper-faint">
            Built at Hyscaler for a client. Source and internal architecture are proprietary —
            happy to walk through the design decisions in a conversation.
          </p>
        ) : project.links?.length || project.caseStudy ? (
          <div className="mt-6 flex flex-wrap gap-5 border-t border-ink-800 pt-5">
            {project.caseStudy ? (
              <Link
                href={`/work/${project.slug}`}
                className="link-underline font-mono text-xs uppercase tracking-[0.14em] text-gold-400 transition-colors duration-300 hover:text-gold-300"
              >
                Read case study →
              </Link>
            ) : null}
            {project.links?.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer noopener"
                className="link-underline font-mono text-xs uppercase tracking-[0.14em] text-paper transition-colors duration-300 hover:text-gold-400"
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}

export function Work() {
  const [filter, setFilter] = useState<Filter>("featured");

  const visible = useMemo(() => {
    if (filter === "all") return projects;
    if (filter === "featured") return projects.filter((p) => p.featured);
    return projects.filter((p) => p.kind === filter);
  }, [filter]);

  return (
    <Section
      id="work"
      title="Selected work"
      lead="Four client products from Hyscaler and a few things I've built on my own. The numbers come from the live products."
    >
      <Reveal>
        <div role="tablist" aria-label="Filter projects" className="mb-10 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.key)}
                className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-all duration-300 ${
                  active
                    ? "border-gold-400 bg-gold-400 text-ink-950"
                    : "border-ink-700 text-paper-dim hover:border-ink-600 hover:text-paper"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </Reveal>

      <motion.div layout className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}
