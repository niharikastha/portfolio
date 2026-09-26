/**
 * A small, honest eval for the Ask engine. Each case says which source should
 * come back first, or that the engine should refuse. It runs at build time and
 * the result is shown next to the demo, so if a content edit breaks retrieval,
 * the number on the site drops.
 */
import { ask } from "./retrieval";

/** `expect` lists every source that counts as a correct top hit; null means it should refuse. */
type Case = { q: string; expect: string[] | null };

const CASES: Case[] = [
  { q: "What RAG work have you done?", expect: ["Hyscaler · Experience"] },
  { q: "How did you reduce hallucinations?", expect: ["Hyscaler · Experience", "Project · Legal Research Tool"] },
  { q: "Have you worked in healthcare?", expect: ["Project · Doctegrity", "Hyscaler · Experience"] },
  { q: "Do you know HIPAA and FHIR?", expect: ["Project · Doctegrity"] },
  { q: "What is JobPilot?", expect: ["Project · JobPilot"] },
  { q: "How many job postings does your agent scan?", expect: ["Project · JobPilot"] },
  { q: "What is KlarText?", expect: ["Project · KlarText"] },
  { q: "Anything for German documents?", expect: ["Project · KlarText"] },
  { q: "Tell me about the legal research tool", expect: ["Project · Legal Research Tool"] },
  { q: "Have you worked on fintech CSV pipelines?", expect: ["Project · Stock Data Platform"] },
  { q: "Any government projects?", expect: ["Project · R4Funds"] },
  { q: "Have you built a mobile app?", expect: ["Project · Walking Pal"] },
  { q: "Where did you study?", expect: ["Education"] },
  { q: "What was your CGPA?", expect: ["Education"] },
  { q: "Have you been to hackathons?", expect: ["Community"] },
  { q: "Do you attend Google developer events?", expect: ["Community"] },
  { q: "Where are you based?", expect: ["Profile"] },
  { q: "Have you written about Bluetooth?", expect: ["Writing"] },
  { q: "Do you know Kubernetes?", expect: null },
  { q: "What's your favourite food?", expect: null },
  { q: "Can you write Rust?", expect: null },
  { q: "How old are you?", expect: null },
];

export type EvalResult = {
  total: number;
  passed: number;
  answerable: { total: number; passed: number };
  refusals: { total: number; passed: number };
  failures: { q: string; expected: string; got: string }[];
};

export function runEvals(): EvalResult {
  const result: EvalResult = {
    total: CASES.length,
    passed: 0,
    answerable: { total: 0, passed: 0 },
    refusals: { total: 0, passed: 0 },
    failures: [],
  };
  for (const c of CASES) {
    const r = ask(c.q);
    const answered = r.answer.length > 0;
    const got = answered ? r.hits[0].chunk.source : "refused";
    const ok = c.expect === null ? !answered : c.expect.includes(got);
    const bucket = c.expect === null ? result.refusals : result.answerable;
    bucket.total += 1;
    if (ok) {
      bucket.passed += 1;
      result.passed += 1;
    } else {
      result.failures.push({ q: c.q, expected: c.expect?.join(" or ") ?? "refused", got });
    }
  }
  return result;
}
