/**
 * A tiny, dependency-free retrieval engine over the portfolio's own content.
 *
 * It's BM25 keyword scoring (the "sparse" half of a hybrid search) plus a small
 * synonym table. There is no LLM: answers are stitched together from the
 * retrieved text only, so it can't say anything the site doesn't.
 */
import {
  community,
  education,
  experience,
  profile,
  projects,
  skills,
  writing,
} from "@/content/site";

export type Chunk = { id: number; source: string; text: string };

export type Hit = { chunk: Chunk; score: number; matched: string[] };

export type AskResult = {
  queryTerms: string[];
  expandedTerms: string[];
  hits: Hit[];
  answer: { sentence: string; cite: number }[];
  corpusSize: number;
  ms: number;
};

const plain = (s: string) => s.replace(/\*\*/g, "");

function buildCorpus(): Chunk[] {
  const raw: Omit<Chunk, "id">[] = [
    {
      source: "Profile",
      text: `${profile.name} is an ${profile.role} based in ${profile.location}. ${profile.availableLabel}. Email: ${profile.email}.`,
    },
    ...profile.about.map((text) => ({ source: "About", text })),
    ...experience.flatMap((job) => [
      {
        source: `${job.company} · Experience`,
        text: `${job.role} at ${job.company}, ${job.period}, ${job.location}. ${job.summary} Products: ${job.products
          .map((p) => `${p.name} (${p.domain})`)
          .join(", ")}.`,
      },
      ...job.highlights.map((h) => ({ source: `${job.company} · Experience`, text: plain(h) })),
    ]),
    ...projects.map((p) => ({
      source: `Project · ${p.name}`,
      text: `${p.name} (${p.domain}): ${p.tagline} ${p.problem} ${p.highlights.map(plain).join(" ")} Built with ${p.stack.join(", ")}.`,
    })),
    ...skills.map((g) => ({
      source: "Skills",
      text: `${g.group} skills: ${g.items.join(", ")}.`,
    })),
    ...education.map((e) => ({
      source: "Education",
      text: `${e.credential} at ${e.institution}, ${e.period}. Scored ${e.score}.`,
    })),
    ...community.map((c) => ({
      source: "Community",
      text: `${c.title}: ${c.detail} (${c.role}, ${c.date})`,
    })),
    ...writing.map((w) => ({
      source: "Writing",
      text: `${w.title} (${w.platform}, ${w.date}). ${w.blurb}`,
    })),
  ];
  return raw.map((c, id) => ({ ...c, id }));
}

const STOPWORDS = new Set(
  "a an and are as at be by can did do does for from has have how i in is it its me my of on or she so that the their them there they this to was what when where which who why will with you your her about any ever done used use tell work worked been know like have".split(
    " ",
  ),
);

/** Very light stemming — enough that "hackathons" matches "hackathon". */
function stem(word: string) {
  if (word.length > 5 && word.endsWith("ing")) return word.slice(0, -3);
  if (word.length > 4 && word.endsWith("ed")) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

export function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/node\.js/g, "nodejs")
    .replace(/next\.js/g, "nextjs")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
    .map(stem);
}

/** Query-side expansion, so a visitor's words can find the site's words. */
const SYNONYMS: Record<string, string[]> = {
  ai: ["llm", "rag", "agentic"],
  llm: ["openai", "anthropic", "mistral", "gemini"],
  model: ["llm", "openai", "anthropic"],
  claude: ["anthropic"],
  gpt: ["openai"],
  chatgpt: ["openai"],
  health: ["healthcare", "medical", "hipaa"],
  medical: ["healthcare", "hipaa", "physician"],
  hospital: ["healthcare", "medical"],
  legal: ["lexross", "law"],
  law: ["legal", "lexross"],
  finance: ["fintech", "financial"],
  bank: ["fintech", "financial"],
  study: ["education", "university", "tech"],
  college: ["university", "vssut", "tech"],
  degree: ["tech", "university"],
  school: ["education"],
  search: ["retrieval", "hybrid"],
  retrieval: ["search", "rag"],
  rag: ["retrieval", "augmented", "pgvector", "hallucination"],
  vector: ["pgvector", "embedding"],
  database: ["postgresql", "mongodb", "pgvector"],
  db: ["postgresql", "mongodb"],
  job: ["jobpilot", "hyscaler"],
  company: ["hyscaler"],
  german: ["klartext", "germany"],
  google: ["gdg"],
  event: ["gdg", "hackathon", "seminar"],
  community: ["gdg", "hackathon"],
  live: ["based", "bhubaneswar"],
  located: ["based", "bhubaneswar"],
  hire: ["open", "role", "email"],
  contact: ["email", "reach"],
  backend: ["nodejs", "nestj"],
  frontend: ["react", "nextjs"],
  mobile: ["native"],
  hallucination: ["rag", "invent"],
};

const K1 = 1.4;
const B = 0.75;

type Index = {
  chunks: Chunk[];
  docs: Map<string, number>[];
  lengths: number[];
  avgLen: number;
  df: Map<string, number>;
};

let cached: Index | null = null;

function getIndex(): Index {
  if (cached) return cached;
  const chunks = buildCorpus();
  const docs = chunks.map((c) => {
    const tf = new Map<string, number>();
    for (const t of tokenize(`${c.source} ${c.text}`)) tf.set(t, (tf.get(t) ?? 0) + 1);
    return tf;
  });
  const lengths = docs.map((d) => [...d.values()].reduce((a, b) => a + b, 0));
  const df = new Map<string, number>();
  for (const d of docs) for (const t of d.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  cached = {
    chunks,
    docs,
    lengths,
    avgLen: lengths.reduce((a, b) => a + b, 0) / lengths.length,
    df,
  };
  return cached;
}

export function corpusSize() {
  return getIndex().chunks.length;
}

/** Below this, the best match is too weak to answer from. */
const MIN_SCORE = 1.5;

export function ask(question: string, topK = 3): AskResult {
  const start = performance.now();
  const index = getIndex();
  const N = index.chunks.length;

  const queryTerms = [...new Set(tokenize(question))];
  const expandedTerms = [
    ...new Set(queryTerms.flatMap((t) => (SYNONYMS[t] ?? []).map(stem))),
  ].filter((t) => !queryTerms.includes(t));

  // Original words count fully; synonyms count for half.
  const weighted: [string, number][] = [
    ...queryTerms.map((t) => [t, 1] as [string, number]),
    ...expandedTerms.map((t) => [t, 0.5] as [string, number]),
  ];

  const scored: Hit[] = index.chunks.map((chunk, i) => {
    const tf = index.docs[i];
    let score = 0;
    const matched: string[] = [];
    for (const [term, weight] of weighted) {
      const f = tf.get(term);
      if (!f) continue;
      const n = index.df.get(term) ?? 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      score +=
        weight * idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * index.lengths[i]) / index.avgLen)));
      matched.push(term);
    }
    // Skill lists are pure keywords, so they'd outrank real descriptions of the work.
    if (chunk.source === "Skills") score *= 0.6;
    return { chunk, score, matched };
  });

  const hits = scored
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  const answer: AskResult["answer"] = [];
  const top = hits[0]?.score ?? 0;
  if (top >= MIN_SCORE) {
    const terms = new Set([...queryTerms, ...expandedTerms]);
    hits.forEach((hit, rank) => {
      if (hit.score < top * 0.6) return;
      // Pick the sentence in this passage that overlaps the question most.
      // Split on sentence ends followed by a capital, so "B.Tech" and "Node.js" survive.
      const sentences = hit.chunk.text.split(/(?<=[.!?])\s+(?=[A-Z])/);
      let best = sentences[0];
      let bestOverlap = -1;
      for (const s of sentences) {
        const overlap = tokenize(s).filter((t) => terms.has(t)).length;
        if (overlap > bestOverlap || (overlap === bestOverlap && s.length > best.length)) {
          best = s;
          bestOverlap = overlap;
        }
      }
      if (!answer.some((a) => a.sentence === best.trim())) {
        answer.push({ sentence: best.trim(), cite: rank + 1 });
      }
    });
  }

  return {
    queryTerms,
    expandedTerms,
    hits,
    answer,
    corpusSize: N,
    ms: performance.now() - start,
  };
}
