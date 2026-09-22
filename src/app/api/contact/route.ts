import { NextResponse } from "next/server";
import { profile } from "@/content/site";

/**
 * Contact endpoint.
 *
 * Sends via Resend (https://resend.com) when RESEND_API_KEY is set — no SDK, just
 * their REST API. Without the key the form fails politely and the UI points the
 * visitor at the mailto link, so the site is never broken, only degraded.
 *
 * Env:
 *   RESEND_API_KEY  — required to actually send
 *   CONTACT_TO      — defaults to the address in site.ts
 *   CONTACT_FROM    — must be a domain you've verified in Resend
 */

const MAX_LEN = { name: 100, email: 200, subject: 200, message: 5000 };

// Crude per-instance throttle. Good enough to stop a bored bot; real abuse
// protection belongs at the edge (Vercel WAF / Cloudflare).
const hits = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages from this address. Please email me directly." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const subject = String(body.subject ?? "").trim() || "Portfolio enquiry";
  const message = String(body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
  }

  if (
    name.length > MAX_LEN.name ||
    email.length > MAX_LEN.email ||
    subject.length > MAX_LEN.subject ||
    message.length > MAX_LEN.message
  ) {
    return NextResponse.json({ error: "That message is too long." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY not set — message not delivered.");
    return NextResponse.json(
      { error: "The form isn't connected yet." },
      { status: 503 },
    );
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO ?? profile.email],
        reply_to: email,
        subject: `[Portfolio] ${subject}`,
        html: `
          <div style="font-family:system-ui,sans-serif;line-height:1.6">
            <h2 style="margin:0 0 16px">New message from your portfolio</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
            <hr style="border:none;border-top:1px solid #ddd;margin:20px 0" />
            <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[contact] Resend rejected the message:", res.status, detail);
      return NextResponse.json({ error: "Couldn't send that message." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Unexpected failure:", err);
    return NextResponse.json({ error: "Couldn't send that message." }, { status: 500 });
  }
}
