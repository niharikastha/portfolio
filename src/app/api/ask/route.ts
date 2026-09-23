import { ask, llmHits } from "@/lib/retrieval";

/**
 * LLM mode for "Ask my portfolio". Retrieval runs here with the same BM25
 * engine the browser uses, so the passage numbers match what the visitor sees;
 * Gemini only writes the answer from those passages.
 *
 * Env: GEMINI_API_KEY (required; a free key from aistudio.google.com works),
 * GEMINI_MODEL (optional, defaults to gemini-3.6-flash), ASK_DAILY_LIMIT
 * (optional, defaults to 300 questions a day).
 */

export const runtime = "nodejs";

const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.6-flash";
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

You will be given numbered passages taken from the site. Answer only from those passages. General questions (who you are, what you do, where you work) and greetings are fine to answer from the passages that describe Astha. If the passages don't contain the answer, say you couldn't find it on the site and suggest using the contact form; don't fill gaps from general knowledge, and don't guess at things like salary, age or personal life.

Write two to four plain sentences in the first person, as Astha ("I built..."). After each claim, cite the passage it came from as [1], [2] and so on. No headings, lists or markdown. Keep numbers exactly as the passages state them.`;

type GeminiChunk = {
  candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
};

const text = (s: string, status = 200) =>
  new Response(s, { status, headers: { "Content-Type": "text/plain; charset=utf-8" } });

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
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

  const found = llmHits(ask(question));

  if (overDailyCap()) {
    return text("AI mode has hit its daily limit. The keyword answer above still works.", 429);
  }

  const passages = found.map((h, i) => `[${i + 1}] (${h.chunk.source}) ${h.chunk.text}`).join("\n\n");

  const encoder = new TextEncoder();
  const upstream = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: [
          {
            role: "user",
            parts: [{ text: `<passages>\n${passages}\n</passages>\n\nQuestion: ${question}` }],
          },
        ],
        // Room for the model's thinking plus a short answer.
        generationConfig: { maxOutputTokens: 1024, temperature: 0.2 },
      }),
    },
  ).catch((err: unknown) => {
    console.error("ask route:", err);
    return null;
  });

  if (!upstream?.ok || !upstream.body) {
    if (upstream && upstream.status !== 429) {
      console.error("ask route:", upstream.status, await upstream.text().catch(() => ""));
    }
    return text(
      upstream?.status === 429
        ? "AI mode is busy right now. Try again in a minute."
        : "AI mode ran into a problem. The keyword answer above still works.",
      upstream?.status === 429 ? 429 : 502,
    );
  }

  const reader = upstream.body.pipeThrough(new TextDecoderStream()).getReader();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      let blocked = false;
      try {
        // Gemini streams server-sent events: one `data: {json}` line per chunk.
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += value;
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const chunk = JSON.parse(line.slice(5)) as GeminiChunk;
            const candidate = chunk.candidates?.[0];
            for (const part of candidate?.content?.parts ?? []) {
              if (part.text && !part.thought) controller.enqueue(encoder.encode(part.text));
            }
            if (chunk.promptFeedback?.blockReason || candidate?.finishReason === "SAFETY") {
              blocked = true;
            }
          }
        }
        if (blocked) controller.enqueue(encoder.encode("\n\nI can't help with that one."));
      } catch (err) {
        console.error("ask route:", err);
        controller.enqueue(
          encoder.encode("\n\nAI mode ran into a problem. The keyword answer above still works."),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
