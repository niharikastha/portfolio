import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

/**
 * Visitor tracking endpoint.
 *
 * Called from a small client component on every page mount. Records:
 *   timestamp, IP, user-agent, country/city/region (from Vercel geo headers),
 *   referrer, path, and a per-session id (localStorage on the client).
 *
 * Silent no-op when POSTGRES_URL isn't set — the site never breaks if the DB
 * is missing, we just don't record anything.
 *
 * Env:
 *   POSTGRES_URL — from Vercel Postgres integration
 */

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!process.env.POSTGRES_URL) return NextResponse.json({ ok: false, skipped: true });

  let body: { path?: string; referrer?: string; sessionId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const path = String(body.path ?? "").slice(0, 500);
  if (!path) return NextResponse.json({ error: "Missing path." }, { status: 400 });

  const h = request.headers;
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    null;
  const ua = h.get("user-agent")?.slice(0, 500) ?? null;
  const country = h.get("x-vercel-ip-country") ?? null;
  const city = decodeURIComponent(h.get("x-vercel-ip-city") ?? "") || null;
  const region = h.get("x-vercel-ip-country-region") ?? null;
  const referrer = (body.referrer ?? h.get("referer") ?? "").slice(0, 500) || null;
  const sessionId = (body.sessionId ?? "").slice(0, 100) || null;

  try {
    await sql`
      INSERT INTO visits (ip, user_agent, country, city, region, referrer, path, session_id)
      VALUES (${ip}, ${ua}, ${country}, ${city}, ${region}, ${referrer}, ${path}, ${sessionId})
    `;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[track] insert failed:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
