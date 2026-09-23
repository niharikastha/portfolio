import {
  siAnthropic,
  siClaude,
  siDocker,
  siExpress,
  siGit,
  siGithub,
  siGooglegemini,
  siGraphql,
  siLinux,
  siMeta,
  siMistralai,
  siMongodb,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siPm2,
  siPnpm,
  siPostgresql,
  siPrisma,
  siReact,
  siRedis,
  siTailwindcss,
  siTurborepo,
  siTypeorm,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from "simple-icons";

/** Tech names as they appear in site.ts, mapped to their logos. */
const LOGOS: Record<string, SimpleIcon> = {
  Anthropic: siAnthropic,
  Claude: siClaude,
  Docker: siDocker,
  "Express.js": siExpress,
  Gemini: siGooglegemini,
  Git: siGit,
  GitHub: siGithub,
  GraphQL: siGraphql,
  Linux: siLinux,
  "Llama 3": siMeta,
  "Llama 3 70B": siMeta,
  Mistral: siMistralai,
  MongoDB: siMongodb,
  NestJS: siNestjs,
  "Next.js": siNextdotjs,
  "Node.js": siNodedotjs,
  PM2: siPm2,
  pnpm: siPnpm,
  PostgreSQL: siPostgresql,
  Prisma: siPrisma,
  React: siReact,
  "React Native": siReact,
  Redis: siRedis,
  "Tailwind CSS": siTailwindcss,
  Turborepo: siTurborepo,
  TypeORM: siTypeorm,
  TypeScript: siTypescript,
  Vercel: siVercel,
};

/** No logo in the icon set (or no logo at all), so these get a short monogram. */
const MONOGRAMS: Record<string, string> = {
  AWS: "aws",
  BullMQ: "Bq",
  FHIR: "FH",
  Groq: "Gq",
  OpenAI: "OA",
  Playwright: "Pw",
  "Push notifications": "Pn",
  S3: "S3",
  WebSockets: "WS",
  "Worker Threads": "WT",
  pgvector: "pg",
};

export type TechMark =
  | { kind: "logo"; name: string; path: string; color: string | null }
  | { kind: "mono"; name: string; text: string };

/** Very dark brand colours vanish on the dark theme, so those follow the text colour instead. */
function brandColor(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 0.18 ? null : `#${hex}`;
}

export function techMark(name: string): TechMark {
  const icon = LOGOS[name];
  if (icon) return { kind: "logo", name, path: icon.path, color: brandColor(icon.hex) };
  return { kind: "mono", name, text: MONOGRAMS[name] ?? name.slice(0, 2) };
}

/** True for names that have a logo or monogram; everything else is a concept, shown as text. */
export function isTool(name: string) {
  return name in LOGOS || name in MONOGRAMS;
}
