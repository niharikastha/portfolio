import { NextResponse } from "next/server";
import nodemailer, { type Transporter } from "nodemailer";
import { profile } from "@/content/site";

/**
 * Contact endpoint.
 *
 * Sends via SMTP (nodemailer) when SMTP_HOST/USER/PASS are set. Without them
 * the form fails politely and the UI points visitors at the mailto link, so
 * the site is never broken, only degraded.
 *
 * Env:
 *   SMTP_HOST      — e.g. smtp.gmail.com, smtp.zoho.com, smtp.sendgrid.net
 *   SMTP_PORT      — 587 (STARTTLS) or 465 (SSL). Defaults to 587.
 *   SMTP_SECURE    — "true" for port 465. Defaults to false.
 *   SMTP_USER      — SMTP username (usually your email)
 *   SMTP_PASS      — SMTP password or app password
 *   CONTACT_FROM   — "Name <no-reply@yourdomain.com>". Defaults to SMTP_USER.
 *   CONTACT_TO     — where to deliver. Defaults to profile.email.
 */

export const runtime = "nodejs";

const MAX_LEN = { name: 100, email: 200, subject: 200, message: 5000 };

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

let cachedTransporter: Transporter | null = null;
function getTransporter() {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  if (cachedTransporter) return cachedTransporter;

  const port = Number(process.env.SMTP_PORT ?? 587);
  cachedTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return cachedTransporter;
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

  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[contact] SMTP env not set — message not delivered.");
    return NextResponse.json({ error: "The form isn't connected yet." }, { status: 503 });
  }

  try {
    await transporter.sendMail({
      from: process.env.CONTACT_FROM ?? process.env.SMTP_USER,
      to: process.env.CONTACT_TO ?? profile.email,
      replyTo: `${name} <${email}>`,
      subject: `[Portfolio] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
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
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] SMTP send failed:", err);
    return NextResponse.json({ error: "Couldn't send that message." }, { status: 500 });
  }
}
