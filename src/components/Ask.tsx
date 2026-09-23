"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ask, corpusSize, tokenize, type AskResult } from "@/lib/retrieval";
import { Reveal, Section } from "./primitives";

const SUGGESTIONS = [
  "What RAG work have you done?",
  "Have you worked in healthcare?",
  "Which LLM providers have you used?",
  "What is JobPilot?",
  "Have you been to hackathons?",
  "Do you know Kubernetes?",
];

/** Wrap words in the passage that matched the query. */
function Highlighted({ text, terms }: { text: string; terms: string[] }) {
  const set = new Set(terms);
  return (
    <>
      {text.split(/(\s+)/).map((part, i) => {
        const token = tokenize(part)[0];
        return token && set.has(token) ? (
          <mark key={i} className="rounded-sm bg-gold-400/20 px-0.5 text-paper">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}

function Chip({ children, dim = false }: { children: string; dim?: boolean }) {
  return (
    <span
      className={`rounded border px-1.5 py-0.5 font-mono text-[11px] ${
        dim ? "border-ink-700 text-paper-faint" : "border-gold-400/40 text-gold-400"
      }`}
    >
      {children}
    </span>
  );
}

export function Ask() {
  const reduced = useReducedMotion();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<AskResult | null>(null);
  const [asked, setAsked] = useState("");
  const [focused, setFocused] = useState<number | null>(null);
  const [runId, setRunId] = useState(0);

  function run(question: string) {
    const q = question.trim();
    if (!q) return;
    setQuery(q);
    setAsked(q);
    setFocused(null);
    setResult(ask(q));
    setRunId((n) => n + 1);
  }

  // Each pipeline step appears a beat after the last, so you can follow it.
  const step = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, x: -6 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: i * 0.18, duration: 0.3 },
        };

  const top = result?.hits[0]?.score ?? 1;

  return (
    <Section
      id="ask"
      title="Ask my portfolio"
      lead="A small version of the retrieval systems I build at work, running entirely in your browser. Ask it something about me and it'll show you which passages it found, how they scored, and where each part of the answer came from. If the answer isn't on this site, it says so instead of guessing."
    >
      <Reveal>
        <div className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-900">
          {/* Header strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-700 px-5 py-3 font-mono text-[11px] text-paper-faint">
            <span>
              <span className="text-gold-400">●</span> retriever: BM25 + synonym expansion
            </span>
            <span>{corpusSize()} passages indexed from this site · no LLM</span>
          </div>

          <div className="p-5 sm:p-7">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                run(query);
              }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="ask-input" className="sr-only">
                Ask a question about Astha
              </label>
              <input
                id="ask-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. What have you built with pgvector?"
                autoComplete="off"
                className="w-full flex-1 rounded-lg border border-ink-700 bg-ink-850 px-4 py-3 text-sm text-paper placeholder:text-paper-faint transition-colors duration-300 focus:border-gold-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!query.trim()}
                className="rounded-lg bg-gold-400 px-5 py-3 text-sm font-semibold text-ink-950 transition-colors duration-300 hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Ask
              </button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => run(s)}
                  className="rounded-full border border-ink-700 px-3 py-1.5 text-xs text-paper-dim transition-colors duration-300 hover:border-gold-400 hover:text-gold-400"
                >
                  {s}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key={runId}
                  initial={reduced ? undefined : { opacity: 0 }}
                  animate={reduced ? undefined : { opacity: 1 }}
                  exit={reduced ? undefined : { opacity: 0 }}
                  className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.15fr]"
                >
                  {/* Pipeline trace */}
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-faint">
                      What happened
                    </p>
                    <ol className="mt-4 space-y-4 border-l border-ink-700 pl-5 text-sm">
                      <motion.li {...step(0)}>
                        <p className="text-paper-dim">1. Split your question into search terms</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {result.queryTerms.length ? (
                            result.queryTerms.map((t) => <Chip key={t}>{t}</Chip>)
                          ) : (
                            <span className="text-xs text-paper-faint">(nothing searchable)</span>
                          )}
                        </div>
                      </motion.li>
                      <motion.li {...step(1)}>
                        <p className="text-paper-dim">2. Added related terms, weighted at half</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {result.expandedTerms.length ? (
                            result.expandedTerms.map((t) => (
                              <Chip key={t} dim>
                                {t}
                              </Chip>
                            ))
                          ) : (
                            <span className="text-xs text-paper-faint">(none needed)</span>
                          )}
                        </div>
                      </motion.li>
                      <motion.li {...step(2)}>
                        <p className="text-paper-dim">
                          3. Scored all {result.corpusSize} passages with BM25 and{" "}
                          {result.hits.length
                            ? `kept the top ${result.hits.length}`
                            : "found no matches"}
                        </p>
                        <p className="nums mt-1 text-xs text-paper-faint">
                          took {result.ms < 1 ? "<1" : result.ms.toFixed(1)} ms
                        </p>
                      </motion.li>
                      <motion.li {...step(3)}>
                        <p className="text-paper-dim">
                          4. {result.answer.length
                            ? "Built the answer from the best-matching sentences, with sources"
                            : "Nothing matched well enough, so it didn't answer"}
                        </p>
                      </motion.li>
                    </ol>
                  </div>

                  {/* Answer + sources */}
                  <motion.div {...step(4)}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-faint">
                      Answer to “{asked}”
                    </p>
                    <div className="mt-4 rounded-xl border border-ink-700 bg-ink-850 p-5 text-sm leading-relaxed text-paper">
                      {result.answer.length ? (
                        <p>
                          {result.answer.map((a) => (
                            <span key={a.cite}>
                              {a.sentence}{" "}
                              <button
                                type="button"
                                onClick={() => setFocused(a.cite)}
                                aria-label={`Show source ${a.cite}`}
                                className="nums align-super text-[10px] text-gold-400 hover:underline"
                              >
                                [{a.cite}]
                              </button>{" "}
                            </span>
                          ))}
                        </p>
                      ) : (
                        <p className="text-paper-dim">
                          I couldn&apos;t find that on this site, so I won&apos;t guess. Try asking
                          about my projects, experience or skills, or{" "}
                          <a href="#contact" className="text-gold-400 underline-offset-2 hover:underline">
                            ask me directly
                          </a>
                          .
                        </p>
                      )}
                    </div>

                    {result.hits.length ? (
                      <ul className="mt-4 space-y-2">
                        {result.hits.map((hit, i) => (
                          <li
                            key={hit.chunk.id}
                            className={`rounded-xl border p-4 transition-colors duration-300 ${
                              focused === i + 1
                                ? "border-gold-400 bg-ink-850"
                                : "border-ink-700"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3 font-mono text-[11px]">
                              <span className="text-paper-dim">
                                <span className="text-gold-400">[{i + 1}]</span> {hit.chunk.source}
                              </span>
                              <span className="nums text-paper-faint">{hit.score.toFixed(2)}</span>
                            </div>
                            <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink-800">
                              <motion.div
                                className="h-full rounded-full bg-gold-400"
                                initial={reduced ? false : { width: 0 }}
                                animate={{ width: `${(hit.score / top) * 100}%` }}
                                transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                              />
                            </div>
                            <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-paper-dim">
                              <Highlighted text={hit.chunk.text} terms={hit.matched} />
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-paper-faint">
          This demo only does keyword retrieval, so it can quote this site but not reason beyond it.
          The production systems I work on add pgvector embeddings, hybrid dense + sparse search and
          an LLM on top.
        </p>
      </Reveal>
    </Section>
  );
}
