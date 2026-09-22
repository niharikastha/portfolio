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
  available: true,
  availableLabel: "Open to AI / fullstack roles",

  // Hero
  headline: ["I build production AI", "systems that ship."],
  subhead:
    "Three years turning research-grade AI into products people actually use — RAG over pgvector, multi-provider LLM pipelines, and document systems running live in healthcare, fintech, legal-tech and fundraising.",

  // Sits under the metric band. From the résumé summary, and too good to bury.
  metricsNote:
    "Plus 40+ hours of manual work automated every week across those four products.",

  // About
  about: [
    "I'm a fullstack engineer who specialises in the unglamorous half of AI: the retrieval quality, the evaluation loops, the chunking strategy, the fallback when a provider rate-limits you at 2am. Models are easy to call. Making them reliable enough to put in front of a doctor or a lawyer is the actual work.",
    "At Hyscaler I've shipped four live products across four regulated-ish domains. I cut hallucinations by 65% on a legal knowledge base, dropped retrieval latency 40% with hybrid dense + sparse search, and built the FHIR sync layer that keeps medical devices and physician dashboards in agreement at 100% HIPAA transmission compliance.",
    "Outside work I build things I personally need — a job-hunting agent that reads 16,500 postings so I don't have to, and a translator for the German bureaucracy that refuses to invent facts about your visa. I'm most useful on teams that care about whether the AI is actually right.",
  ],

  socials: {
    github: "https://github.com/niharikastha",
    linkedin: "https://www.linkedin.com/in/niharika-astha/",
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
      "Sole or lead engineer on the AI layer of four client products, plus the backend and frontend around it. Everything below is running in production.",
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
};

export const projects: Project[] = [
  {
    slug: "jobpilot",
    name: "JobPilot",
    tagline: "An agent that job-hunts for you while you sleep.",
    period: "May 2026 — Sep 2026",
    domain: "Agentic AI · Automation",
    kind: "personal",
    featured: true,
    problem:
      "Job hunting is 90% triage and 10% judgement, but every AI tool on the market spends tokens on the triage. JobPilot inverts that: cheap deterministic filters first, expensive model calls only on what survives.",
    highlights: [
      "Scans **16,500 live job postings** and shortlists only the ones worth applying to — rule-based filters cut **~90%** of the corpus before the paid AI step ever runs.",
      "Rewrites the resume per job with a **guard that blocks the model from inventing facts**; pulls from **6 hiring platforms** and auto-fills applications, deliberately **stopping before submit**.",
      "Runs **fully unattended**: cron fetches at 6 AM, ranks at 7 AM, emails and Telegrams the shortlist by 9 AM.",
      "Cost control through local embeddings, pgvector similarity and prompt caching instead of naive per-posting LLM calls.",
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
  },
  {
    slug: "klartext",
    name: "KlarText",
    tagline: "German bureaucracy, translated into plain language you speak.",
    period: "Jan 2026 — Mar 2026",
    domain: "Applied LLMs · Document AI",
    kind: "personal",
    featured: true,
    problem:
      "A rental contract or a visa letter in German legalese is where newcomers lose money and deadlines. The hard constraint isn't summarisation — it's never being confidently wrong about someone's immigration status.",
    highlights: [
      "Turns dense German paperwork — rental contracts, tax notices, visa letters — into a plain-language summary with a **risk level**, key details, and a translation **into the user's own language**.",
      "Extracts every deadline into a dated action item and a calendar event across **5 task categories**, with per-document chat for follow-ups.",
      "Runs on a **swappable 2-provider AI layer** (Gemini, Groq Llama 3 70B) that retries **up to 3×** with exponential backoff when a provider rate-limits.",
    ],
    stack: ["NestJS", "TypeORM", "PostgreSQL", "Gemini", "Groq", "Llama 3 70B", "Turborepo"],
    metric: { value: "3×", label: "provider failover retries" },
    links: [{ label: "Source", href: "https://github.com/niharikastha/klartext" }],
  },
  {
    slug: "doctegrity",
    name: "Doctegrity",
    tagline: "Medical devices and physician dashboards, always in agreement.",
    period: "2024 — Present",
    domain: "Healthcare · HIPAA",
    kind: "client",
    featured: true,
    problem:
      "A physician acting on stale readings is a safety incident. The sync layer had to be bidirectional, real-time, and provably compliant with HIPAA transmission rules.",
    highlights: [
      "Built **bidirectional synchronisation** between medical devices and physician dashboards over **WebSockets and FHIR APIs**.",
      "Achieved **100% compliance** with HIPAA data-transmission standards for critical patient information.",
      "Designed the ingestion path so device disconnects and replays never produce a conflicting clinical record.",
    ],
    stack: ["Node.js", "NestJS", "WebSockets", "FHIR", "PostgreSQL", "Docker"],
    metric: { value: "100%", label: "HIPAA transmission compliance" },
  },
  {
    slug: "lexross",
    name: "LexRoss",
    tagline: "Legal research that cites instead of improvising.",
    period: "2024 — Present",
    domain: "Legal AI · RAG",
    kind: "client",
    featured: true,
    problem:
      "In legal work a plausible-sounding wrong answer is worse than no answer. This was a retrieval problem long before it was a generation problem.",
    highlights: [
      "RAG architecture over **PostgreSQL/pgvector** that reduced hallucinations by **65%**.",
      "**Hybrid dense + sparse retrieval** with metadata filtering — **40% faster** queries at **90% relevance**.",
      "Document pipeline indexing **10,000+ documents** with chunking tuned for long-form legal structure.",
    ],
    stack: ["NestJS", "PostgreSQL", "pgvector", "OpenAI", "Anthropic", "Mistral"],
    metric: { value: "65%", label: "fewer hallucinations" },
  },
  {
    slug: "merqube-hyally",
    name: "MerQube Hyally",
    tagline: "High-volume financial data, ingested without losing a row.",
    period: "2024 — Present",
    domain: "Fintech · Data pipelines",
    kind: "client",
    featured: false,
    problem:
      "Financial ingestion has no tolerance for silent row loss, and single-threaded Node was the bottleneck.",
    highlights: [
      "Parallelised high-volume CSV processing with **Worker Threads** — **10K+ records daily**, **50% faster**, **99.9% data accuracy**.",
      "Backend and dashboard work across a multi-app monorepo with a shared NestJS API.",
    ],
    stack: ["NestJS", "Worker Threads", "Next.js", "PostgreSQL", "Prisma", "Docker"],
    metric: { value: "99.9%", label: "data accuracy" },
  },
  {
    slug: "r4funds",
    name: "R4Funds",
    tagline: "Fundraising infrastructure for government programmes.",
    period: "2024 — Present",
    domain: "GovTech · Fundraising",
    kind: "client",
    featured: false,
    problem:
      "Public-sector fundraising flows need auditability and uptime more than they need novelty.",
    highlights: [
      "Delivered backend and frontend features across a production monorepo with load-tested deployment paths.",
      "Contributed to the shared API, auth and deployment tooling used across the platform.",
    ],
    stack: ["NestJS", "Next.js", "PostgreSQL", "Prisma", "pnpm", "Turborepo", "PM2"],
  },
  {
    slug: "walking-pal",
    name: "Walking Pal",
    tagline: "The first walking-buddy app — social fitness, geolocated.",
    period: "Jun 2023 — Dec 2023",
    domain: "Mobile · Social",
    kind: "personal",
    featured: false,
    problem:
      "People walk more when someone is waiting for them. The product was really about turning a solitary habit into a standing appointment.",
    highlights: [
      "Built social and events core: **WebSocket chat**, **QR-code friend connections**, push notifications.",
      "**Geolocation-based walk discovery** with calendar sync, powering **500+ community walks a month**.",
      "Drove a **23% lift in daily active users** after the social layer shipped.",
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
      "Notes from working with BLE — how the protocol actually behaves on real devices, and the gap between the spec and what ships.",
    platform: "LinkedIn",
    date: "2025",
    // TODO: paste the permalink to your BLE post.
    href: "https://www.linkedin.com/in/niharika-astha/recent-activity/all/",
    tags: ["BLE", "Embedded", "Protocols"],
  },
];

/**
 * Community. You mentioned Google Developers seminars — fill in the specific
 * event names, years and cities and this section gets much stronger.
 */
export const community = [
  {
    title: "Google Developer Groups — seminars & events",
    role: "Attendee",
    // TODO: list the actual events, e.g. "DevFest Bhubaneswar 2024", "I/O Extended 2025".
    detail:
      "Regular participant in Google Developers seminars and GDG sessions, following Android, Cloud and applied-AI tracks.",
    date: "2023 — Present",
  },
];

export const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Writing", href: "#writing" },
  { label: "Contact", href: "#contact" },
];
