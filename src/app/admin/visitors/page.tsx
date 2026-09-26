import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";

type Visit = {
  id: number;
  seen_at: string;
  ip: string | null;
  user_agent: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
  referrer: string | null;
  path: string;
  session_id: string | null;
};

function shortUA(ua: string | null): string {
  if (!ua) return "—";
  // Pull the most recognisable bit — "Chrome/…", "Safari/…", "Firefox/…", "bot".
  const m =
    ua.match(/(Chrome|Firefox|Safari|Edge|OPR|CriOS|FxiOS|bot|Bot)\/[\d.]+/) ??
    ua.match(/(Googlebot|bingbot|DuckDuckBot|Slackbot|Twitterbot)/i);
  const platform =
    ua.match(/(iPhone|iPad|Android|Macintosh|Windows|Linux)/)?.[1] ?? "";
  return [m?.[0], platform].filter(Boolean).join(" · ") || ua.slice(0, 40);
}

async function loadVisits(): Promise<Visit[]> {
  if (!process.env.POSTGRES_URL) return [];
  const { rows } = await sql<Visit>`
    SELECT id, seen_at, ip, user_agent, country, city, region, referrer, path, session_id
    FROM visits
    ORDER BY seen_at DESC
    LIMIT 200
  `;
  return rows;
}

async function loadStats() {
  if (!process.env.POSTGRES_URL) {
    return { total: 0, uniqueSessions: 0, uniqueIPs: 0, last24h: 0 };
  }
  const { rows } = await sql<{
    total: number;
    unique_sessions: number;
    unique_ips: number;
    last_24h: number;
  }>`
    SELECT
      COUNT(*)::int                                                       AS total,
      COUNT(DISTINCT session_id)::int                                     AS unique_sessions,
      COUNT(DISTINCT ip)::int                                             AS unique_ips,
      COUNT(*) FILTER (WHERE seen_at > NOW() - INTERVAL '24 hours')::int  AS last_24h
    FROM visits
  `;
  const r = rows[0];
  return {
    total: r?.total ?? 0,
    uniqueSessions: r?.unique_sessions ?? 0,
    uniqueIPs: r?.unique_ips ?? 0,
    last24h: r?.last_24h ?? 0,
  };
}

export default async function VisitorsPage() {
  const [visits, stats] = await Promise.all([loadVisits(), loadStats()]);
  const configured = Boolean(process.env.POSTGRES_URL);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 text-sm">
      <h1 className="text-2xl font-semibold">Visitor log</h1>
      <p className="mt-1 text-neutral-500">
        Last 200 visits, most recent first.
      </p>

      {!configured && (
        <div className="mt-6 rounded-md border border-amber-400/40 bg-amber-400/10 p-4 text-amber-900 dark:text-amber-300">
          <strong>POSTGRES_URL isn&apos;t set.</strong> Add the Vercel Postgres
          integration and run <code>db/migrations/001_visits.sql</code> against
          the database to start recording.
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ["Total visits", stats.total],
          ["Last 24h", stats.last24h],
          ["Unique sessions", stats.uniqueSessions],
          ["Unique IPs", stats.uniqueIPs],
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-lg border border-neutral-300 p-4 dark:border-neutral-700">
            <div className="text-xs uppercase tracking-wider text-neutral-500">{label}</div>
            <div className="mt-1 text-2xl font-semibold">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto rounded-lg border border-neutral-300 dark:border-neutral-700">
        <table className="min-w-full text-left">
          <thead className="bg-neutral-100 text-xs uppercase tracking-wider text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
            <tr>
              <th className="px-3 py-2">When</th>
              <th className="px-3 py-2">Where</th>
              <th className="px-3 py-2">IP</th>
              <th className="px-3 py-2">Path</th>
              <th className="px-3 py-2">Referrer</th>
              <th className="px-3 py-2">Client</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {visits.map((v) => (
              <tr key={v.id} className="align-top">
                <td className="whitespace-nowrap px-3 py-2 font-mono text-xs">
                  {new Date(v.seen_at).toLocaleString()}
                </td>
                <td className="px-3 py-2">
                  {[v.city, v.region, v.country].filter(Boolean).join(", ") || "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-2 font-mono text-xs">
                  {v.ip ?? "—"}
                </td>
                <td className="px-3 py-2 font-mono text-xs">{v.path}</td>
                <td className="max-w-[240px] truncate px-3 py-2 font-mono text-xs" title={v.referrer ?? ""}>
                  {v.referrer ?? "—"}
                </td>
                <td className="px-3 py-2 text-xs">{shortUA(v.user_agent)}</td>
              </tr>
            ))}
            {visits.length === 0 && configured && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-neutral-500">
                  No visits recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
