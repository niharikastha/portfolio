/**
 * Single source of truth for every word on this site.
 * Edit this file to update the portfolio — no component changes needed.
 *
 * Anything marked TODO needs a real value from you before launch.
 */

export const profile = {
  name: "Astha Niharika",
  role: "AI Fullstack Engineer",
  location: "Bhubaneswar, India",
  email: "asthaniharika123@gmail.com",
  phone: "+91 77395 23225",
  // The canonical origin is resolved at build time from the environment —
  // see src/lib/siteUrl.ts. Set NEXT_PUBLIC_SITE_URL to override it.
  resumePath: "/Astha_Niharika_Resume.pdf",
  // Drop your photo into /public under this name (a square-ish JPG works best).
  // Until the file exists, the About section shows your initials instead.
  photo: "/photo.jpg",
  available: true,
  availableLabel: "Open to AI / fullstack roles",
  // Hire-me card. Leave noticePeriod empty to hide that row.
  lookingFor: "AI engineer or fullstack roles where the AI has to be right, not just respond",
  workModes: "Remote & hybrid",
  noticePeriod: "", // TODO: e.g. "30 days"

  // One line about what you're working on right now. Empty string hides it.
  now: "Replacing KlarText's substring search with clause-level chunks and hybrid retrieval: Postgres full-text + embeddings, merged with reciprocal rank fusion",
  nowUpdated: "Sep 2026",

  // Hero. `headline` is also used by the social share image.
  headline: ["Hi, I'm Astha.", "I build AI features and the apps around them."],
  heroLines: ["I'm Astha.", "I build AI that"],
  // Cycles in handwriting after the last hero line. Keep them short.
  heroPhrases: ["cites its sources", "knows when to say no", "gets the answer right", "holds up in production"],
  // **Wrapped** phrases get a highlighter swipe.
  subhead:
    "I'm a fullstack engineer at Hyscaler. Most of my work is **RAG and LLM features** for client products in healthcare, fintech, legal-tech and fundraising, and the Node backends and React frontends they sit in. I care about **whether the answer is right**, not just whether it answers.",
  // Written on the polaroid under the photo.
  photoCaption: "Based in Bhubaneswar, Odisha",
  // Logo row under the hero, in order.
  builderStack: [
    "TypeScript",
    "Node.js",
    "NestJS",
    "Next.js",
    "React",
    "PostgreSQL",
    "pgvector",
    "Redis",
    "Docker",
    "OpenAI",
    "Claude",
    "Gemini",
  ],
  // A second, more relaxed photo for the About section. Falls back to `photo`.
  aboutPhoto: "/gallery/off-the-clock-1.jpg",

  // Sits under the metric band.
  metricsNote:
    "Between them, these four products also automate 40+ hours of manual work a week.",

  // About
  about: [
    "I'm a fullstack engineer, and these days most of my time goes into the AI side of products: retrieval, chunking, checking whether the answers are actually right, and working out what to do when a provider goes down. Getting a model to respond is quick. Getting it reliable enough for a doctor or a lawyer to use takes most of the effort, and it's the part I enjoy.",
    "I've been at Hyscaler since January 2024 and have worked on four client products there. On LexRoss, a legal research tool, I brought hallucinations down by 65% and made retrieval 40% faster by combining dense and sparse search. On Doctegrity, I built the sync between medical devices and physician dashboards over WebSockets and FHIR, which had to meet HIPAA rules for patient data.",
    "Outside work I mostly build tools for my own problems. JobPilot goes through job postings every morning and sends me a shortlist, and KlarText explains German paperwork like rental contracts and visa letters in plain language. I do my best work on teams that care whether the AI is right, not just whether it answers.",
  ],

  // "How I got here": a short paragraph or two in your own words — how you got
  // into engineering and then into AI. Shown in About only when non-empty.
  story: [] as string[], // TODO

  socials: {
    github: "https://github.com/niharikastha",
    linkedin: "https://www.linkedin.com/in/niharika-astha/",
    instagram: "https://www.instagram.com/astha_niharika_20/",
    email: "mailto:asthaniharika123@gmail.com",
  },
  githubUsername: "niharikastha",
};

/** Hero metric band. `value` is the number to count up to; `prefix`/`suffix` wrap it. */
export const metrics = [
  {
    value: 65,
    suffix: "%",
    label: "Fewer hallucinations",
    detail: "On a production legal knowledge base, via RAG over pgvector.",
  },
  {
    value: 10000,
    suffix: "+",
    label: "Documents indexed",
    detail: "Parsed, chunked and embedded through enterprise pipelines.",
  },
  {
    value: 40,
    suffix: "%",
    label: "Lower retrieval latency",
    detail: "Hybrid dense + sparse search at 90% relevance.",
  },
  {
    value: 4,
    suffix: "",
    label: "Live production products",
    detail: "Healthcare, fintech, legal-tech and government fundraising.",
  },
];

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
  stack: string[];
  products: { name: string; domain: string }[];
};

export const experience: Experience[] = [
  {
    company: "Hyscaler",
    role: "Software Development Engineer I",
    period: "Jan 2024 — Present",
    location: "Bhubaneswar, Odisha",
    summary:
      "I work on the AI side of four client products, usually as the sole or lead engineer, plus the backend and frontend around it. All of it is live.",
    highlights: [
      "Designed Retrieval-Augmented Generation systems over PostgreSQL/pgvector and OpenAI APIs, cutting hallucinations **65%** and improving answer accuracy on domain-specific queries.",
      "Architected the document pipeline — parsing, chunking, embedding and indexing **10,000+ documents** — enabling semantic and lexical search across enterprise knowledge bases.",
      "Optimised retrieval with **hybrid dense + sparse search** and metadata filtering: **40% lower query latency** while holding **90% relevance**.",
      "Integrated **OpenAI, Anthropic and Mistral** behind one provider-agnostic interface, across document analysis, knowledge retrieval and business automation.",
      "Built **bidirectional sync** between medical devices and physician dashboards over WebSockets and **FHIR APIs**, hitting **100% HIPAA compliance** on transmission of critical patient data.",
      "Parallelised high-volume CSV ingestion in Node.js with **Worker Threads** to handle **10K+ records daily** — **50% faster** at **99.9% data accuracy**.",
    ],
    stack: [
      "Node.js",
      "NestJS",
      "Next.js",
      "React",
      "PostgreSQL",
      "pgvector",
      "MongoDB",
      "Docker",
      "WebSockets",
      "FHIR",
    ],
    products: [
      { name: "Doctegrity", domain: "Healthcare" },
      { name: "MerQube Hyally", domain: "Fintech" },
      { name: "LexRoss", domain: "Legal AI" },
      { name: "R4Funds", domain: "Government fundraising" },
    ],
  },
];

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  period: string;
  domain: string;
  /** "personal" renders code/demo links; "client" renders a proprietary notice instead. */
  kind: "personal" | "client";
  featured: boolean;
  problem: string;
  highlights: string[];
  stack: string[];
  metric?: { value: string; label: string };
  links?: { label: string; href: string }[];
  /** Having one gives the project a page at /work/<slug>. */
  caseStudy?: CaseStudy;
};

export type CaseStudy = {
  /**
   * Live demo and/or recording. TODO: fill in when ready. `video` is a file in
   * /public/work/<slug>/ (mp4/webm) or a YouTube/Loom URL. While both are empty
   * the page shows a dashed placeholder in dev and nothing in production.
   */
  demo?: { liveUrl?: string; video?: string };
  /** The pipeline, in order. `note` is the short label under each step. */
  pipeline: { label: string; note: string; ai?: boolean }[];
  decisions: { title: string; body: string }[];
  /** "Why this and not that", one line per tool. */
  techChoices?: { tech: string; why: string }[];
  /** Honest limitations: what's broken, missing or not production-grade yet. */
  knownGaps?: string[];
  /** How to make the answers better: retrieval, RAG and agent improvements. */
  improvements?: { title: string; body: string }[];
  /** Be honest here — "none yet" plus a plan beats a vague claim. */
  testing?: { status: string; plan: string[] };
  /** Files in /public/work/<slug>/. Missing files are skipped. */
  screenshots?: { file: string; caption: string }[];
};

export const projects: Project[] = [
  {
    slug: "jobpilot",
    name: "JobPilot",
    tagline: "A job-search agent that runs every morning and sends me a shortlist.",
    period: "May 2026 — Sep 2026",
    domain: "Agentic AI · Automation",
    kind: "personal",
    featured: true,
    problem:
      "Most of job hunting is filtering out postings that obviously don't fit, and paying an LLM to do that felt wasteful. So JobPilot runs cheap rule-based filters first and only sends what's left to the model.",
    highlights: [
      "Scans **16,500 live job postings** and shortlists the ones worth applying to. Rule-based filters remove about 90% of them before any paid AI call.",
      "Tailors the resume for each job, with a check that stops the model from inventing facts. Pulls from 6 hiring platforms and fills in applications, but stops before submitting so I can review them.",
      "Runs on its own: it fetches postings at 6 AM, ranks them at 7, and sends the shortlist by email and Telegram by 9.",
      "Keeps costs down with local embeddings, pgvector similarity and prompt caching instead of an LLM call per posting.",
    ],
    stack: [
      "NestJS",
      "BullMQ",
      "Redis",
      "PostgreSQL",
      "pgvector",
      "Playwright",
      "Claude",
      "Prisma",
      "Turborepo",
    ],
    metric: { value: "16,500", label: "postings triaged" },
    links: [{ label: "Source", href: "https://github.com/niharikastha/resume-ai-autopilot" }],
    caseStudy: {
      pipeline: [
        { label: "Fetch", note: "16,500 postings from 6 platforms · 6 AM" },
        { label: "Screen", note: "Free rule checks drop ~90%, each with a reason" },
        { label: "Vector shortlist", note: "Local embeddings + pgvector pick the top 60" },
        { label: "Score", note: "Claude Haiku, prompt-cached · 7 AM", ai: true },
        { label: "Tailor resume", note: "Claude Opus, fact-checked, fails closed", ai: true },
        { label: "Digest", note: "Pay gate, then email + Telegram by 9 AM" },
      ],
      decisions: [
        {
          title: "Cheap filters before the model",
          body: "Most postings are obviously a bad fit. A free, deterministic screen (title, dealbreakers, years of experience, location, freshness, already applied) throws out about 90% of them, and every rejection is logged with a named reason so I can see which rule is doing the work.",
        },
        {
          title: "Embeddings cap the spend, the LLM judges fit",
          body: "Vector similarity is used as a budget, not a verdict: topical overlap isn't fit. pgvector orders what survived the screen and only the 60 most plausible go to Claude, which is asked the harder question of how well each one fits.",
        },
        {
          title: "A fact check that fails closed",
          body: "A tailored resume that invents a skill is worse than an untailored one. The model can only return rewrites of existing bullets (there's nowhere in the schema to put a new one), and a separate check rejects any number, technology or employer that isn't in the source. If anything fails, the whole variant is thrown away and the base resume is used.",
        },
        {
          title: "A short digest people keep reading",
          body: "WEAK and REJECT matches never reach the digest, only STRONG, GOOD and BORDERLINE. A digest full of noise teaches you to ignore it. Pay works the same way: a stated salary below my floor rejects, but an AI estimate below it doesn't, and unknown pay passes.",
        },
        {
          title: "A human stays in the loop",
          body: "It fills in applications but stops before submitting. Sending an application is the one step that can't be undone, so I review it.",
        },
        {
          title: "Runs on a schedule",
          body: "Fetching, ranking and sending are timed jobs (6, 7 and 9 AM) built on BullMQ and Redis, so the shortlist is waiting in the morning without me starting anything.",
        },
      ],
      techChoices: [
        { tech: "Claude Haiku for scoring", why: "Scoring is high-volume rubric classification. Haiku does it at about a fifth of the price, which is the difference between a daily run I can afford to leave on and one I'd switch off." },
        { tech: "Claude Opus for tailoring", why: "There are only about 15 tailored resumes a day, and an overstated one can cost an application. That's where the stronger model is worth paying for." },
        { tech: "Local embeddings (bge-small)", why: "A 384-dimension model that runs inside the app, so embedding thousands of postings costs nothing and keeps working when an API is down." },
        { tech: "pgvector", why: "Vector search inside the Postgres I already had, so there's no second database to run or keep in sync." },
        { tech: "Prompt caching", why: "The resume and preferences are the same for every posting, so they sit at the front of the prompt and are cached across calls." },
        { tech: "Pure stage functions", why: "The screen, the pay gate and the fact check are plain functions with no I/O, so they're cheap to run on everything and easy to test." },
      ],
      knownGaps: [
        "The fact check only knows technologies in its dictionary, so a tool it has never heard of can slip through. It also can't catch overstatement without numbers ('led' instead of 'contributed to'); that's what the human review before submitting is for.",
        "Title rules match substrings, so excluding 'intern' also excludes 'internal tools engineer'.",
        "Structured salary appears on only about 0.3% of Indian postings, so pay is mostly inferred from company tier rather than read.",
        "Prompt caching needs a minimum prefix length. A short resume may be under it, and then nothing is cached.",
        "There are no automated tests yet, even though the stages were written to be testable.",
      ],
      improvements: [
        {
          title: "Hybrid retrieval for the shortlist",
          body: "Combine keyword scoring (BM25 on title and skills) with the vector ranking using **reciprocal rank fusion**. Embeddings are good at 'similar kind of role' and bad at exact requirements like 'Go' or 'Kubernetes'; keywords are the opposite.",
        },
        {
          title: "Embed the parts that matter",
          body: "Embed the requirements section on its own, not the whole posting with its benefits and company boilerplate, so similarity reflects the job and not the marketing.",
        },
        {
          title: "Rerank before the expensive call",
          body: "Rerank the vector top 60 with a cross-encoder so the best candidates are reliably inside the cut, then send fewer postings to Claude for the same recall.",
        },
        {
          title: "Measure it with my own decisions",
          body: "Every apply or skip is a label. Track **precision@10** of the digest against them, and tune the 60 cutoff and the screen rules from real numbers instead of guesses.",
        },
        {
          title: "Look things up only when unsure",
          body: "For BORDERLINE postings only, let the model call tools (the company page, similar past postings) before deciding, with a hard cap on rounds. Clear cases stay single-shot and cheap.",
        },
        {
          title: "Say how sure it is",
          body: "Ask for a confidence alongside the score, and send low-confidence results to BORDERLINE rather than letting them silently become STRONG or REJECT.",
        },
      ],
      testing: {
        status:
          "No automated tests yet. The type system and a fail-closed env schema catch configuration mistakes at startup, and every screening rejection is logged with its reason, but correctness is checked by reading the daily digest.",
        plan: [
          "Unit tests for the fact check: invented numbers, new technologies, changed employers, and the known blind spots, written as tests that document them.",
          "Table tests for the screen and pay gate, including the 'intern' / 'internal' case.",
          "A labelled set of past postings with my apply/skip decisions, used as a regression eval for scoring.",
        ],
      },
    },
  },
  {
    slug: "klartext",
    name: "KlarText",
    tagline: "Explains German paperwork in plain language, in your own language.",
    period: "Jan 2026 — Mar 2026",
    domain: "Applied LLMs · Document AI",
    kind: "personal",
    featured: true,
    problem:
      "Rental contracts, tax notices and visa letters in German are hard to follow when you've just moved, and a missed deadline can be expensive. The thing I cared about most was that it shouldn't make things up, especially about visas.",
    highlights: [
      "Turns a German document into a plain-language summary with a risk level, the key details, and a translation into the user's own language.",
      "Pulls out deadlines as dated to-dos and calendar events (5 task categories), and lets you ask follow-up questions about each document.",
      "Uses two AI providers (Gemini and Llama 3 70B on Groq) that can be swapped, and retries up to 3 times with backoff when one is rate-limited.",
    ],
    stack: ["NestJS", "TypeORM", "PostgreSQL", "Gemini", "Groq", "Llama 3 70B", "Turborepo"],
    metric: { value: "3×", label: "provider failover retries" },
    links: [{ label: "Source", href: "https://github.com/niharikastha/klartext" }],
    caseStudy: {
      pipeline: [
        { label: "Upload", note: "Rental contract, tax notice, visa letter" },
        { label: "Understand", note: "Gemini or Llama 3 70B on Groq", ai: true },
        { label: "Summarise", note: "Plain language + a risk level", ai: true },
        { label: "Extract deadlines", note: "Dated to-dos in 5 categories", ai: true },
        { label: "Translate", note: "Into the user's own language", ai: true },
        { label: "Ask", note: "An agent searches all your documents", ai: true },
      ],
      decisions: [
        {
          title: "Not making things up mattered most",
          body: "A wrong answer about a visa deadline can cost someone a lot. That shaped the whole design: answers come from the user's own documents through tools, and name the document they came from, instead of from what the model thinks German bureaucracy usually says.",
        },
        {
          title: "Chat as a small agent with tools",
          body: "Questions like 'what do I have to pay this month?' span several letters. The chat has 5 tools (list documents, list action items, search, get details, get full text) and can call them for up to **4 rounds** before answering. Each tool call streams to the screen as it happens, so you can see what it looked at.",
        },
        {
          title: "Two swappable providers",
          body: "Gemini and Llama 3 70B on Groq are interchangeable, so the app isn't tied to one provider's limits or pricing.",
        },
        {
          title: "Retries with backoff",
          body: "Free and cheap tiers rate-limit often. When a provider is rate-limited, requests retry up to 3 times with backoff, so a busy provider shows up as a slower answer rather than an error.",
        },
        {
          title: "Deadlines as actions",
          body: "People don't need a summary that says 'there is a deadline'; they need the date in their calendar. Deadlines come out as dated to-dos and calendar events.",
        },
      ],
      techChoices: [
        { tech: "Gemini for analysis", why: "It reads photos of letters directly, so a phone picture of a tax notice works without a separate OCR step. Text PDFs go through pdf-parse first." },
        { tech: "Groq for chat", why: "Chat is several model calls per question (one per tool round). Groq is fast enough to stream and supports the tool-calling loop, so the conversation stays responsive." },
        { tech: "Server-sent events", why: "Tool calls and the answer stream to the browser as they happen, instead of a spinner over a multi-step agent loop." },
        { tech: "Retry with backoff", why: "Up to 3 retries on 503s, and on a 429 it waits as long as the provider asks (up to 65 seconds) rather than guessing." },
      ],
      knownGaps: [
        "Search is a plain substring match over the translation and summary, and it returns the first 500 characters of a document rather than the part that matched. A question about a clause on page 3 can get page 1.",
        "No automated tests. Everything has been checked by hand against the sample documents in the repo.",
        "Analysis runs in the background after upload. If the server restarts mid-analysis, that document stays 'pending'.",
        "Not production-hardened yet: uploaded files are served without an auth check, rate limiting is configured but not enforced, there's no password-reset email, and the schema is synced rather than migrated.",
      ],
      improvements: [
        {
          title: "Chunk by clause, not by page",
          body: "German letters and contracts have structure: numbered clauses (§), a Betreff line, a deadline paragraph. Split on that structure and store each chunk with its document and position, so search can return the clause that answers the question.",
        },
        {
          title: "Hybrid search inside the search tool",
          body: "Replace the substring match with keyword search (Postgres full-text, which handles German compound words far better) plus embeddings, merged with **reciprocal rank fusion**. 'When do I have to move out?' should find 'Kündigungsfrist' even though no word overlaps.",
        },
        {
          title: "Quote, then answer",
          body: "Make the model quote the exact passage it relied on before answering, and check in code that the quote really appears in the document. If it doesn't, the answer isn't shown.",
        },
        {
          title: "Check dates in code",
          body: "Parse every extracted deadline with a deterministic date parser and confirm the date appears in the source text. The model finds the deadline; code confirms it.",
        },
        {
          title: "A tighter agent loop",
          body: "Plan, retrieve, answer, then verify the answer against what was retrieved, still within the 4-round cap. When the documents don't contain the answer, say so plainly instead of answering from general knowledge.",
        },
        {
          title: "An eval over the sample documents",
          body: "Annotate the 6 sample documents with their correct deadlines, amounts and risk levels, and score every prompt or model change against them: extraction accuracy, retrieval hit rate, and whether it refuses when it should.",
        },
      ],
      testing: {
        status:
          "No automated tests yet. Each change has been tested by hand against 6 sample German documents in the repo: a rental contract, an employment contract, a tax assessment, a residence permit extension, a health insurance bill and a registration confirmation. The README says this plainly too.",
        plan: [
          "Turn the sample documents into an annotated eval (see above) and run it on every change.",
          "Unit tests for the retry logic: 503 backoff and honouring the 429 retry-after hint.",
          "API tests for document ownership, so one user's search can never return another user's document.",
        ],
      },
    },
  },
  {
    slug: "this-site",
    name: "This portfolio",
    tagline: "A portfolio you can question, with its own retrieval engine and eval.",
    period: "Sep 2026",
    domain: "Retrieval · RAG · Evals",
    kind: "personal",
    featured: false,
    problem:
      "Most AI portfolios say 'I build RAG' and show a screenshot. I wanted the site itself to be a small, honest RAG system you can use: ask it about me, see what it retrieved and why, and watch it refuse when the answer isn't there.",
    highlights: [
      "A BM25 retriever with synonym expansion that runs **in the browser** over every passage on the site, and shows its terms, scores and sources for each answer.",
      "An optional LLM mode: the server re-runs the same retrieval and Gemini answers **only from those passages**, with citations that point at real text.",
      "A **22-question eval** that re-runs on every build and is shown on the page, failures included.",
      "Cost and abuse limits on the LLM route: per-visitor and daily caps, a token cap, and a model that is told to refuse when the passages don't cover the question.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Gemini", "Vercel"],
    links: [{ label: "Source", href: "https://github.com/niharikastha/portfolio" }],
    caseStudy: {
      pipeline: [
        { label: "Question", note: "Typed or picked from suggestions" },
        { label: "Tokenise + expand", note: "Stopwords, stemming, synonyms at half weight" },
        { label: "BM25", note: "Scores every passage on the site" },
        { label: "Threshold", note: "Weak match → refuse, or add background for the LLM" },
        { label: "Answer", note: "Gemini, only from the top passages", ai: true },
        { label: "Cite", note: "Every claim links to its passage" },
      ],
      decisions: [
        {
          title: "BM25 instead of embeddings",
          body: "The corpus is a few dozen passages. Keyword scoring runs in the browser in under a millisecond, costs nothing, needs no vector database, and every score can be shown and explained — which is the point of the demo.",
        },
        {
          title: "Refusing is a feature",
          body: "If the best match is below a threshold, keyword mode says it couldn't find the answer. LLM mode instead adds the general passages about me, so 'tell me about yourself' works, and the model is told to refuse when they don't cover the question. A portfolio that invents facts about its owner would be worse than no demo.",
        },
        {
          title: "Retrieval on the server too",
          body: "LLM mode re-runs retrieval server-side instead of trusting passages sent from the browser, so nobody can feed the model their own 'facts', and the [n] numbers still match what the visitor sees.",
        },
        {
          title: "Weight fields, not just words",
          body: "A project's name counts 3× in its own passage, without making the passage look longer to BM25. That one change took the eval from 20 to 21 of 22 and fixed 'What is KlarText?', which used to land on the About paragraph.",
        },
        {
          title: "Show the eval, including failures",
          body: "The eval result is rendered on the page from the same build, so a content edit that breaks retrieval shows up as a lower number. The failures stay visible because they're the most useful part.",
        },
      ],
      techChoices: [
        { tech: "Next.js", why: "Static pages for the content, one server route for the LLM, and build-time work (the eval, the OG image) in the same codebase." },
        { tech: "BM25", why: "Explainable, instant and free at this corpus size. Embeddings would be the next step, not the first one." },
        { tech: "Gemini Flash", why: "Free tier, fast, and good at 'answer only from these passages and cite them'. A low temperature and a token cap keep answers short and on-script, and the daily cap keeps it inside the free quota." },
        { tech: "Streaming", why: "The answer appears as it's written instead of after a blank wait." },
      ],
      knownGaps: [
        "Keyword retrieval misses paraphrases. The one eval failure left is 'the legal research tool': the About paragraph uses that exact phrase, so it outranks the LexRoss passage.",
        "Rate limits are in memory, so each server instance counts separately and they reset on a cold start. Fine for a portfolio, not for a real product.",
        "The eval checks retrieval only. It doesn't yet check whether the LLM's answer is grounded in the passages it cites.",
      ],
      improvements: [
        {
          title: "Hybrid search: add embeddings next to BM25",
          body: "Embed every passage at build time (the corpus is small enough to ship as JSON) and merge the two rankings with **reciprocal rank fusion**. Keywords catch exact names like pgvector; embeddings catch paraphrases like 'German paperwork'.",
        },
        {
          title: "Rerank the top results",
          body: "Retrieve the top 10 cheaply, then rerank them with a cross-encoder or a small LLM call and keep the best 3. Recall comes from retrieval, precision from reranking.",
        },
        {
          title: "Rewrite the question before searching",
          body: "Turn 'what about the second one?' into a standalone query using the conversation so far, so follow-up questions retrieve as well as first ones.",
        },
        {
          title: "Let the model search again (agentic retrieval)",
          body: "Give the model the search as a tool. If the first passages don't answer the question it can search with different terms, capped at **2 rounds** so cost and latency stay bounded.",
        },
        {
          title: "Check answers, not just retrieval",
          body: "Add a groundedness eval: for each LLM answer, check that every cited sentence is supported by its passage, and that out-of-scope questions are still refused.",
        },
      ],
      testing: {
        status:
          "The 22-question retrieval eval runs on every build and its score is on the home page; the project is type-checked. There are no unit tests yet.",
        plan: [
          "Make the eval a CI gate: fail the build if the pass rate drops below the current score.",
          "Add a groundedness eval for LLM mode (see above).",
          "Unit tests for the tokenizer and the refusal threshold, since those are the parts most likely to regress quietly.",
        ],
      },
    },
  },
  {
    slug: "doctegrity",
    name: "Doctegrity",
    tagline: "Keeping medical device readings and physician dashboards in sync.",
    period: "2024 — Present",
    domain: "Healthcare · HIPAA",
    kind: "client",
    featured: true,
    problem:
      "Doctors need to see current readings, not stale ones, so the sync had to work both ways, in real time, and meet HIPAA rules for sending patient data.",
    highlights: [
      "Built two-way sync between medical devices and physician dashboards over WebSockets and FHIR APIs.",
      "Met HIPAA data-transmission standards for critical patient information (**100% compliance**).",
      "Handled device disconnects and replays so they don't create conflicting records.",
    ],
    stack: ["Node.js", "NestJS", "WebSockets", "FHIR", "PostgreSQL", "Docker"],
    metric: { value: "100%", label: "HIPAA transmission compliance" },
  },
  {
    slug: "lexross",
    name: "LexRoss",
    tagline: "Legal research answers that point back to their sources.",
    period: "2024 — Present",
    domain: "Legal AI · RAG",
    kind: "client",
    featured: true,
    problem:
      "For legal questions, a confident wrong answer is worse than no answer, so most of the work went into retrieval before touching the generation side.",
    highlights: [
      "Built RAG on PostgreSQL/pgvector that reduced hallucinations by **65%**.",
      "Combined dense and sparse search with metadata filters, making queries **40% faster** at 90% relevance.",
      "Set up a pipeline that indexes **10,000+ documents**, with chunking tuned for long legal texts.",
    ],
    stack: ["NestJS", "PostgreSQL", "pgvector", "OpenAI", "Anthropic", "Mistral"],
    metric: { value: "65%", label: "fewer hallucinations" },
  },
  {
    slug: "merqube-hyally",
    name: "MerQube Hyally",
    tagline: "Importing large volumes of financial CSV data without dropping rows.",
    period: "2024 — Present",
    domain: "Fintech · Data pipelines",
    kind: "client",
    featured: false,
    problem:
      "The data couldn't lose rows silently, and single-threaded Node was too slow for the volume.",
    highlights: [
      "Moved CSV processing onto Worker Threads to handle 10K+ records a day, **50% faster**, with 99.9% data accuracy.",
      "Backend and dashboard work across a multi-app monorepo with a shared NestJS API.",
    ],
    stack: ["NestJS", "Worker Threads", "Next.js", "PostgreSQL", "Prisma", "Docker"],
    metric: { value: "99.9%", label: "data accuracy" },
  },
  {
    slug: "r4funds",
    name: "R4Funds",
    tagline: "A fundraising platform for government programmes.",
    period: "2024 — Present",
    domain: "GovTech · Fundraising",
    kind: "client",
    featured: false,
    problem:
      "For public-sector fundraising, being reliable and auditable matters more than new features.",
    highlights: [
      "Delivered backend and frontend features across a production monorepo with load-tested deployment paths.",
      "Contributed to the shared API, auth and deployment tooling used across the platform.",
    ],
    stack: ["NestJS", "Next.js", "PostgreSQL", "Prisma", "pnpm", "Turborepo", "PM2"],
  },
  {
    slug: "walking-pal",
    name: "Walking Pal",
    tagline: "An app for finding people to go walking with.",
    period: "Jun 2023 — Dec 2023",
    domain: "Mobile · Social",
    kind: "personal",
    featured: false,
    problem:
      "People tend to walk more when someone is expecting them, so the app was built around meeting up for walks.",
    highlights: [
      "Built the social features: WebSocket chat, adding friends by QR code, and push notifications.",
      "Added location-based walk discovery with calendar sync, used for **500+ community walks a month**.",
      "Daily active users went up **23%** after the social features launched.",
    ],
    stack: ["React Native", "Node.js", "WebSockets", "MongoDB", "Push notifications"],
    metric: { value: "+23%", label: "daily active users" },
    links: [{ label: "Source", href: "https://github.com/niharikastha/walkingpal" }],
  },
];

export const skills = [
  {
    group: "AI / Machine Learning",
    items: [
      "Agentic AI",
      "LLMs",
      "RAG",
      "Vector databases",
      "Embeddings",
      "Hybrid search",
      "Prompt engineering",
      "OpenAI",
      "Anthropic",
      "Mistral",
      "Gemini",
      "Llama 3",
    ],
  },
  {
    group: "Backend",
    items: [
      "Node.js",
      "NestJS",
      "Express.js",
      "GraphQL",
      "REST APIs",
      "WebSockets",
      "Worker Threads",
      "BullMQ",
      "Redis",
    ],
  },
  {
    group: "Frontend",
    items: ["React", "Next.js", "React Native", "TypeScript", "Tailwind CSS"],
  },
  {
    group: "Data & DevOps",
    items: [
      "PostgreSQL",
      "pgvector",
      "MongoDB",
      "Prisma",
      "AWS",
      "S3",
      "Docker",
      "PM2",
      "Git",
      "Linux",
    ],
  },
];

export const education = [
  {
    credential: "B.Tech, Information Technology",
    institution: "Veer Surendra Sai University of Technology (VSSUT)",
    period: "Nov 2020 — May 2024",
    score: "8.61 CGPA",
  },
  {
    credential: "Higher Secondary (12th, CBSE — PCMB)",
    institution: "DAV Bistupur, Jamshedpur",
    period: "2018 — 2019",
    score: "88.4%",
  },
  {
    credential: "Secondary (10th, ICSE)",
    institution: "J. H. Tarapore School, Jamshedpur",
    period: "2016 — 2017",
    score: "92.4%",
  },
];

/**
 * Writing. The BLE post is real — paste its LinkedIn permalink into `href`.
 * Add more entries as you publish; the section renders whatever is here.
 */
export const writing = [
  {
    title: "Getting hands-on with Bluetooth Low Energy",
    blurb:
      "Notes from working with BLE: how it behaves on real devices, and where that differs from the spec.",
    platform: "LinkedIn",
    date: "2025",
    // TODO: paste the permalink to your BLE post.
    href: "https://www.linkedin.com/in/niharika-astha/recent-activity/all/",
    tags: ["BLE", "Embedded", "Protocols"],
  },
];

/**
 * Community. TODO: swap in the real event names, years and cities
 * (e.g. "DevFest Bhubaneswar 2024") and the names of your hackathons.
 */
export const community = [
  {
    title: "Google Developer Groups (GDG)",
    role: "Attendee",
    detail:
      "I go to GDG meetups and Google Developers seminars, mostly for the Cloud and applied-AI sessions, and to meet other developers in the area.",
    date: "2023 — Present",
  },
  {
    title: "Hackathons",
    role: "Participant",
    detail:
      "I've taken part in hackathons, building and demoing prototypes with a team against the clock.",
    date: "2021 — Present",
  },
];

/**
 * Gallery. Put photos in /public/gallery/ and list them here. Entries whose
 * file doesn't exist yet are skipped, and the section hides itself until at
 * least one photo is in place.
 *
 * `tag` drives the filter buttons, so reuse the same spelling for the same kind
 * of event.
 */
export type GalleryPhoto = {
  file: string;
  caption: string;
  tag: string;
  date?: string;
};

export const gallery: GalleryPhoto[] = [
  { file: "devfest-bhubaneswar-1.jpg", caption: "DevFest Bhubaneswar, run by Google Developer Groups", tag: "GDG" },
  { file: "devfest-bhubaneswar-2.jpg", caption: "In the hall between sessions at DevFest Bhubaneswar", tag: "GDG" },
  { file: "off-the-clock-1.jpg", caption: "Dressed up for an evening out", tag: "Off the clock" },
  { file: "off-the-clock-2.jpg", caption: "Rooftop dinner on a night off", tag: "Off the clock" },
  // TODO: add hackathon photos here with tag "Hackathon"; the filter buttons appear once there are two tags.
];

/** Handwritten margin note above each section heading, keyed by section id. */
export const kickers: Record<string, string> = {
  ask: "go on, try it",
  work: "things I've built",
  experience: "where I've been",
  about: "the person behind it",
  skills: "tools I reach for",
  github: "fresh off the keyboard",
  writing: "outside the day job",
  gallery: "proof I leave my desk",
  education: "where it started",
  contact: "say hi!",
};

export const nav = [
  { label: "Ask AI", href: "#ask" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Community", href: "#writing" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];
