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
  now: "Adding an LLM mode to the Ask my portfolio demo on this site",
  nowUpdated: "Sep 2026",

  // Hero
  headline: ["Hi, I'm Astha.", "I build AI features and the apps around them."],
  subhead:
    "I'm a fullstack engineer at Hyscaler. Most of my work is on RAG and LLM features for client products in healthcare, fintech, legal-tech and fundraising, along with the Node backends and React frontends they sit in.",

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
  /** The pipeline, in order. `note` is the short label under each step. */
  pipeline: { label: string; note: string; ai?: boolean }[];
  decisions: { title: string; body: string }[];
  // TODO: these two are yours to write; each section hides while empty.
  whatBroke?: string[];
  nextTime?: string[];
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
        { label: "Rule filters", note: "~90% dropped before any paid call" },
        { label: "Embed + match", note: "Local embeddings, pgvector similarity" },
        { label: "Rank", note: "Claude with prompt caching · 7 AM", ai: true },
        { label: "Tailor resume", note: "Fact check against the real resume", ai: true },
        { label: "Shortlist", note: "Email + Telegram by 9 AM · stops before submit" },
      ],
      decisions: [
        {
          title: "Cheap filters before the model",
          body: "Most postings are obviously a bad fit. Plain rule-based filters throw out about 90% of them, so paid model calls only go to the ones that are actually close.",
        },
        {
          title: "Embeddings for similarity, the LLM for judgement",
          body: "Local embeddings and pgvector handle 'is this roughly my kind of job'. Claude is only asked the harder question of how well it fits, and prompt caching keeps the repeated context (my resume, my preferences) cheap.",
        },
        {
          title: "A fact check on tailored resumes",
          body: "A tailored resume that invents a skill is worse than an untailored one. Each rewrite is checked against the source resume so the model can reword and reorder, but not add.",
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
        { label: "Follow up", note: "Questions about that document" },
      ],
      decisions: [
        {
          title: "Not making things up mattered most",
          body: "A wrong answer about a visa deadline can cost someone a lot. That shaped the whole design: every summary and follow-up answer is about one specific document the user uploaded.",
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
  // TODO: replace these with your real photos and captions.
  { file: "gdg-1.jpg", caption: "Google Developer Groups meetup", tag: "GDG" },
  { file: "gdg-2.jpg", caption: "Google Developers seminar", tag: "GDG" },
  { file: "hackathon-1.jpg", caption: "Hackathon with my team", tag: "Hackathon" },
  { file: "hackathon-2.jpg", caption: "Demo time at a hackathon", tag: "Hackathon" },
];

export const nav = [
  { label: "Ask AI", href: "#ask" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Community", href: "#writing" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];
