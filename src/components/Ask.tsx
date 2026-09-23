"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ask, corpusSize, llmHits, tokenize, type AskResult } from "@/lib/retrieval";
import type { EvalResult } from "@/lib/evals";
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

/** Render "[n]" markers in streamed LLM text as clickable citations. */
function CitedText({ text, onCite }: { text: string; onCite: (n: number) => void }) {
  return (
    <>
      {text.split(/(\[\d+\])/).map((part, i) => {
        const m = part.match(/^\[(\d+)\]$/);
        return m ? (
          <button
            key={i}
            type="button"
            onClick={() => onCite(Number(m[1]))}
            aria-label={`Show source ${m[1]}`}
            className="nums align-super text-[10px] text-gold-400 hover:underline"
          >
            {part}
          </button>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}

function EvalCard({ evals }: { evals: EvalResult }) {
  const pct = Math.round((evals.passed / evals.total) * 100);
  return (
    <details className="group mt-6 rounded-2xl border border-ink-700 bg-ink-900 p-5 sm:p-6">
      <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-faint">
            Eval · re-run on every build
          </p>
          <p className="mt-2 text-sm text-paper-dim">
            {evals.total} test questions, each with the source that should come back first, plus
            out-of-scope ones it should refuse.
          </p>
        </div>
        <div className="flex items-center gap-6 font-mono text-xs">
          <span>
            <span className="nums text-2xl text-paper">{evals.passed}</span>
            <span className="text-paper-faint">/{evals.total} pass ({pct}%)</span>
          </span>
          <span className="text-paper-faint">
            answerable {evals.answerable.passed}/{evals.answerable.total} · refusals{" "}
            {evals.refusals.passed}/{evals.refusals.total}
          </span>
          <span aria-hidden className="text-gold-400 transition-transform duration-300 group-open:rotate-90">
            →
          </span>
        </div>
      </summary>
      {evals.failures.length ? (
        <div className="mt-5 border-t border-ink-800 pt-4">
          <p className="text-xs text-paper-faint">
            Where it still gets it wrong. I&apos;m leaving these visible, since knowing where
            retrieval fails is the point of an eval:
          </p>
          <ul className="mt-3 space-y-2 font-mono text-[11px]">
            {evals.failures.map((f) => (
              <li key={f.q} className="text-paper-dim">
                “{f.q}” → expected <span className="text-paper">{f.expected}</span>, got{" "}
                <span className="text-gold-400">{f.got}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </details>
  );
}

type Mode = "keyword" | "ai";

export function Ask({ llmEnabled, evals }: { llmEnabled: boolean; evals: EvalResult }) {
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<Mode>("keyword");
  const [aiText, setAiText] = useState("");
  const [aiState, setAiState] = useState<"idle" | "streaming" | "done" | "error">("idle");
  const abortRef = useRef<AbortController | null>(null);
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
    if (mode === "ai") void streamAnswer(q);
  }

  async function streamAnswer(q: string) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setAiText("");
    setAiState("streaming");
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
        signal: controller.signal,
      });
      if (!res.body) throw new Error("no body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        setAiText((t) => t + decoder.decode(value, { stream: true }));
      }
      setAiState(res.ok ? "done" : "error");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setAiText("Couldn't reach AI mode. The keyword answer still works.");
      setAiState("error");
    }
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

  const top = result?.hits[0]?.score || 1;
  // In LLM mode, show exactly the passages the model was given.
  const shown = result ? (mode === "ai" ? llmHits(result) : result.hits) : [];
  const background = shown.filter((h) => h.background).length;

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
              {mode === "ai" ? " → Gemini" : ""}
            </span>
            {llmEnabled ? (
              <div role="radiogroup" aria-label="Answer mode" className="flex gap-1">
                {(
                  [
                    ["keyword", "Keyword only"],
                    ["ai", "With Gemini"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={mode === key}
                    onClick={() => {
                      setMode(key);
                      if (key === "ai" && asked) void streamAnswer(asked);
                    }}
                    className={`rounded px-2 py-1 transition-colors duration-300 ${
                      mode === key ? "bg-gold-400 text-ink-950" : "hover:text-paper"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
            <span>
              {corpusSize()} passages indexed from this site
              {mode === "ai" ? " · answer written by an LLM from them" : " · no LLM"}
            </span>
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
                          4.{" "}
                          {mode === "ai"
                            ? background
                              ? `The match was weak, so it added ${background} general passages about me and sent all ${shown.length} to Gemini, told to answer only from them and to refuse if they don't cover it`
                              : `Sent those ${shown.length} passages to Gemini, told to answer only from them and cite each one`
                            : result.answer.length
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
                      {mode === "ai" ? (
                        <p aria-live="polite" className="whitespace-pre-wrap">
                          {aiText ? (
                            <CitedText text={aiText} onCite={setFocused} />
                          ) : (
                            <span className="text-paper-faint">Thinking…</span>
                          )}
                          {aiState === "streaming" && aiText ? (
                            <span aria-hidden className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-gold-400 align-middle" />
                          ) : null}
                        </p>
                      ) : result.answer.length ? (
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

                    {shown.length ? (
                      <ul className="mt-4 space-y-2">
                        {shown.map((hit, i) => (
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
                              <span className="nums text-paper-faint">
                                {hit.background ? "background" : hit.score.toFixed(2)}
                              </span>
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

        <EvalCard evals={evals} />

        <p className="mt-4 text-xs leading-relaxed text-paper-faint">
          {llmEnabled
            ? "Keyword mode only quotes this site. \"With Gemini\" sends the same retrieved passages to an LLM that is told to answer only from them, so the citations still point at real text. "
            : "This demo only does keyword retrieval, so it can quote this site but not reason beyond it. "}
          The production systems I work on add pgvector embeddings and hybrid dense + sparse search
          on top.{" "}
          <Link
            href="/work/this-site"
            className="link-underline text-gold-400 transition-colors duration-300 hover:text-gold-300"
          >
            How this works →
          </Link>
        </p>
      </Reveal>
    </Section>
  );
}
