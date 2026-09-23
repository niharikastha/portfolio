"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ask, corpusSize, llmHits, tokenize, type AskResult } from "@/lib/retrieval";
import { Reveal, Section } from "./primitives";

const SUGGESTIONS = [
  "What RAG work have you done?",
  "Have you worked in healthcare?",
  "Which LLM providers have you used?",
  "What is JobPilot?",
  "Have you been to hackathons?",
  "Do you know Kubernetes?",
];

/** Follow-up questions by where the answer came from. All of these retrieve well. */
const FOLLOW_UPS: [RegExp, string[]][] = [
  [/^Project/, ["How did you reduce hallucinations?", "What have you built on your own?", "Which LLM providers have you used?"]],
  [/Experience/, ["Have you worked in healthcare?", "What is JobPilot?", "Are you open to new roles?"]],
  [/^(Profile|About)/, ["What did you do at Hyscaler?", "What is KlarText?", "Have you been to hackathons?"]],
  [/^Skills/, ["What's your experience with Node.js?", "What RAG work have you done?", "What is JobPilot?"]],
  [/^(Community|Writing|Education)/, ["Do you write or speak at events?", "Where did you study?", "What RAG work have you done?"]],
];
const DEFAULT_FOLLOW_UPS = ["What RAG work have you done?", "What is JobPilot?", "Are you open to new roles?"];

function followUps(source: string | undefined, asked: string) {
  const pool = FOLLOW_UPS.find(([re]) => source && re.test(source))?.[1] ?? DEFAULT_FOLLOW_UPS;
  return [...pool, ...DEFAULT_FOLLOW_UPS]
    .filter((q, i, all) => all.indexOf(q) === i && q.toLowerCase() !== asked.toLowerCase())
    .slice(0, 3);
}

/** What the visitor sees while Gemini works: typing dots and what's happening. */
function Thinking({ passages }: { passages: number }) {
  const reduced = useReducedMotion();
  const steps = [
    `Reading the ${passages} best passages…`,
    "Checking what they actually say…",
    "Writing your answer…",
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((n) => Math.min(n + 1, steps.length - 1)), 1100);
    return () => clearInterval(t);
  }, [reduced, steps.length]);

  return (
    <span className="flex items-center gap-3 text-paper-faint">
      <span aria-hidden className="flex gap-1">
        {[0, 1, 2].map((d) => (
          <span
            key={d}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-pen"
            style={{ animationDelay: `${d * 0.15}s` }}
          />
        ))}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={i}
          initial={reduced ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {steps[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

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

type Mode = "keyword" | "ai";

export function Ask({ llmEnabled }: { llmEnabled: boolean }) {
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

  const answerText = mode === "ai" ? aiText : result?.answer.map((a) => a.sentence).join(" ");

  return (
    <Section
      id="ask"
      title="Ask my portfolio"
      lead="Ask anything about my work, skills or experience. Answers come only from what's on this site, with a link to where each one came from."
    >
      <Reveal>
        <div className="rounded-3xl border border-ink-700 bg-ink-900 p-4 sm:p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(query);
            }}
            className="relative"
          >
            <label htmlFor="ask-input" className="sr-only">
              Ask a question about Astha
            </label>
            <input
              id="ask-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a question, like “Have you worked with RAG?”"
              autoComplete="off"
              className="w-full rounded-2xl border border-ink-700 bg-ink-950 py-4 pr-16 pl-5 text-base text-paper shadow-sm placeholder:text-paper-faint transition-colors duration-300 focus:border-pen focus:outline-none"
            />
            <button
              type="submit"
              disabled={!query.trim()}
              aria-label="Ask"
              className="absolute top-1/2 right-2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl bg-pen text-[#1a0f0c] transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
            >
              <svg aria-hidden viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 10h12m0 0-5-5m5 5-5 5" />
              </svg>
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 font-hand text-base text-paper-faint">or try:</span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => run(s)}
                className="rounded-full border border-ink-700 bg-ink-950 px-3 py-1.5 text-xs text-paper-dim transition-colors duration-300 hover:border-pen hover:text-pen"
              >
                {s}
              </button>
            ))}
          </div>

          {llmEnabled ? (
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-ink-800 pt-4 text-sm">
              <button
                type="button"
                role="switch"
                aria-checked={mode === "ai"}
                onClick={() => {
                  const next = mode === "ai" ? "keyword" : "ai";
                  setMode(next);
                  if (next === "ai" && asked) void streamAnswer(asked);
                }}
                className="flex items-center gap-2.5 text-paper"
              >
                <span
                  className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${
                    mode === "ai" ? "bg-pen" : "bg-ink-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${
                      mode === "ai" ? "translate-x-5" : ""
                    }`}
                  />
                </span>
                AI answers
              </button>
              <span className="text-xs text-paper-faint">
                {mode === "ai"
                  ? "Gemini writes the answer, using only passages from this site."
                  : "Off: answers are quoted straight from the site, no AI."}
              </span>
            </div>
          ) : null}

          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key={runId}
                initial={reduced ? undefined : { opacity: 0, y: 6 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0 }}
                className="mt-6"
              >
                {/* Your question, as a chat bubble */}
                <div className="mb-4 flex justify-end">
                  <p className="max-w-[85%] rounded-2xl rounded-tr-sm bg-pen px-4 py-2.5 text-sm font-medium text-[#1a0f0c]">
                    {asked}
                  </p>
                </div>

                {/* The answer, as a chat reply */}
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pen/15 font-hand text-sm font-bold text-pen">
                    A
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="rounded-2xl rounded-tl-sm bg-ink-850 p-5 text-[15px] leading-relaxed text-paper">
                      {mode === "ai" ? (
                        <p aria-live="polite" className="whitespace-pre-wrap">
                          {aiText ? (
                            <CitedText text={aiText} onCite={setFocused} />
                          ) : (
                            <Thinking passages={shown.length} />
                          )}
                          {aiState === "streaming" && aiText ? (
                            <span aria-hidden className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-pen align-middle" />
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
                                className="nums align-super text-[10px] text-pen hover:underline"
                              >
                                [{a.cite}]
                              </button>{" "}
                            </span>
                          ))}
                        </p>
                      ) : (
                        <p className="text-paper-dim">
                          I&apos;m only set up to answer questions about me and my work, and I
                          couldn&apos;t find that on this site, so I won&apos;t guess. Try asking about
                          my projects, experience or skills, or{" "}
                          <a href="#contact" className="text-pen underline-offset-2 hover:underline">
                            ask me directly
                          </a>
                          .
                        </p>
                      )}
                    </div>

                    {answerText && shown.length ? (
                      <p className="mt-2 text-xs text-paper-faint">
                        The small numbers like [1] point to the sources below.
                      </p>
                    ) : null}

                    {shown.length ? (
                      <details className="group mt-4" open={focused !== null || undefined}>
                        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-paper-dim transition-colors hover:text-paper">
                          <span aria-hidden className="transition-transform duration-300 group-open:rotate-90">
                            ›
                          </span>
                          Sources ({shown.length}) and how it found them
                        </summary>

                        <ol className="mt-4 space-y-2 border-l-2 border-ink-700 pl-4 text-xs text-paper-dim">
                          <li>
                            <span className="text-paper">1. Picked out key words:</span>{" "}
                            {result.queryTerms.length ? (
                              <span className="inline-flex flex-wrap gap-1 align-middle">
                                {result.queryTerms.map((t) => (
                                  <Chip key={t}>{t}</Chip>
                                ))}
                                {result.expandedTerms.map((t) => (
                                  <Chip key={t} dim>
                                    {t}
                                  </Chip>
                                ))}
                              </span>
                            ) : (
                              "(nothing searchable)"
                            )}
                          </li>
                          <li>
                            <span className="text-paper">2. Searched {result.corpusSize} passages</span>{" "}
                            from this site with BM25 keyword ranking (
                            {result.ms < 1 ? "<1" : result.ms.toFixed(1)} ms).
                          </li>
                          <li>
                            <span className="text-paper">3. </span>
                            {mode === "ai"
                              ? background
                                ? `The match was weak, so it added ${background} general passages about me, then Gemini wrote the answer from them.`
                                : "Gemini wrote the answer from the best matches, citing each one."
                              : result.answer.length
                                ? "Quoted the best-matching sentences."
                                : "Nothing matched well enough, so it didn't answer."}
                          </li>
                        </ol>

                        <ul className="mt-4 space-y-2">
                          {shown.map((hit, i) => (
                            <li
                              key={hit.chunk.id}
                              className={`rounded-xl border p-4 transition-colors duration-300 ${
                                focused === i + 1 ? "border-pen bg-ink-850" : "border-ink-700"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3 text-xs">
                                <span className="font-medium text-paper">
                                  <span className="nums mr-1 text-pen">[{i + 1}]</span> {hit.chunk.source}
                                </span>
                                <span className="flex items-center gap-2 text-paper-faint">
                                  {hit.background ? (
                                    "background"
                                  ) : (
                                    <>
                                      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-ink-800">
                                        <motion.span
                                          className="block h-full rounded-full bg-pen"
                                          initial={reduced ? false : { width: 0 }}
                                          animate={{ width: `${(hit.score / top) * 100}%` }}
                                          transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                                        />
                                      </span>
                                      match
                                    </>
                                  )}
                                </span>
                              </div>
                              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-paper-dim">
                                <Highlighted text={hit.chunk.text} terms={hit.matched} />
                              </p>
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : null}

                    {mode !== "ai" || aiState !== "streaming" ? (
                      <motion.div
                        initial={reduced ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: reduced ? 0 : 0.3, duration: 0.3 }}
                        className="mt-5"
                      >
                        <p className="font-hand text-base text-paper-dim">
                          {result.answer.length || mode === "ai" ? "curious about more? ask next:" : "maybe try one of these:"}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {followUps(result.hits[0]?.chunk.source, asked).map((q) => (
                            <button
                              key={q}
                              type="button"
                              onClick={() => run(q)}
                              className="group flex items-center gap-1.5 rounded-full border border-pen/40 bg-pen/[0.06] px-3 py-1.5 text-xs text-paper transition-all duration-300 hover:-translate-y-0.5 hover:border-pen"
                            >
                              {q}
                              <span aria-hidden className="text-pen transition-transform duration-300 group-hover:translate-x-0.5">
                                →
                              </span>
                            </button>
                          ))}
                        </div>
                        <p className="mt-4 text-xs text-paper-faint">
                          Rather ask me yourself?{" "}
                          <a href="#contact" className="link-underline text-pen">
                            Send me a message
                          </a>
                        </p>
                      </motion.div>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-paper-faint">
          Built like the retrieval systems I work on, at a smaller scale.{" "}
          <Link
            href="/work/this-site"
            className="link-underline text-pen transition-colors duration-300 hover:text-paper"
          >
            How this works →
          </Link>
        </p>
      </Reveal>
    </Section>
  );
}
