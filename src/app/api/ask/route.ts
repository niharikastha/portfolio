import Anthropic from "@anthropic-ai/sdk";
import { ask } from "@/lib/retrieval";

/**
 * LLM mode for "Ask my portfolio". Retrieval runs here with the same BM25
 * engine the browser uses, so the passage numbers match what the visitor sees;
 * Claude only writes the answer from those passages.
 *
 * Env: ANTHROPIC_API_KEY (required), ANTHROPIC_MODEL (optional, defaults to
 * claude-opus-5), ASK_DAILY_LIMIT (optional, defaults to 300 questions a day).
 */

export const runtime = "nodejs";

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-opus-5";
const MAX_QUESTION = 300;

// Best-effort in-memory limits, same idea as the contact route. They reset on
// cold start, which is fine for a portfolio; the daily cap is the cost guard.
const WINDOW_MS = 60 * 60 * 1000;
const PER_IP = 20;
const DAILY = Number(process.env.ASK_DAILY_LIMIT ?? 300);
const hits = new Map<string, number[]>();
let day = { date: "", count: 0 };

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= PER_IP) return true;
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function overDailyCap() {
  const today = new Date().toISOString().slice(0, 10);
  if (day.date !== today) day = { date: today, count: 0 };
  if (day.count >= DAILY) return true;
  day.count += 1;
  return false;
}

const SYSTEM = `You answer questions about Astha Niharika, a software engineer, for visitors to their portfolio site.

You will be given numbered passages taken from the site. Answer only from those passages. If they don't contain the answer, say you couldn't find it on the site and suggest using the contact form; don't fill gaps from general knowledge, and don't guess at things like salary, age or personal life.

Write two to four plain sentences in the first person, as Astha ("I built..."). After each claim, cite the passage it came from as [1], [2] and so on. No headings, lists or markdown. Keep numbers exactly as the passages state them.`;

const text = (s: string, status = 200) =>
  new Response(s, { status, headers: { "Content-Type": "text/plain; charset=utf-8" } });

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return text("AI mode isn't set up on this deployment.", 503);
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return text("You've asked a lot of questions in the last hour. Try again later.", 429);
  }

  let question = "";
  try {
    const body = (await req.json()) as { question?: unknown };
    question = typeof body.question === "string" ? body.question.trim() : "";
  } catch {
    return text("Bad request.", 400);
  }
  if (!question || question.length > MAX_QUESTION) {
    return text(`Questions need to be between 1 and ${MAX_QUESTION} characters.`, 400);
  }

  const { hits: found } = ask(question);
  if (!found.length) {
    // Nothing to ground an answer in, so don't spend a model call on it.
    return text(
      "I couldn't find that on this site, so I won't guess. Try the contact form to ask me directly.",
    );
  }

  if (overDailyCap()) {
    return text("AI mode has hit its daily limit. The keyword answer above still works.", 429);
  }

  const passages = found.map((h, i) => `[${i + 1}] (${h.chunk.source}) ${h.chunk.text}`).join("\n\n");

  const client = new Anthropic();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const response = client.beta.messages.stream({
          model: MODEL,
          max_tokens: 400,
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          output_config: { effort: "low" },
          system: SYSTEM,
          messages: [
            {
              role: "user",
              content: `<passages>\n${passages}\n</passages>\n\nQuestion: ${question}`,
            },
          ],
        });

        for await (const event of response) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        const final = await response.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode("\n\nI can't help with that one."));
        }
      } catch (err) {
        const msg =
          err instanceof Anthropic.RateLimitError
            ? "AI mode is busy right now. Try again in a minute."
            : "AI mode ran into a problem. The keyword answer above still works.";
        if (!(err instanceof Anthropic.RateLimitError)) console.error("ask route:", err);
        controller.enqueue(encoder.encode(`\n\n${msg}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
