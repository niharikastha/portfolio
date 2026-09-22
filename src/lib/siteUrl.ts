/**
 * Resolves the site's canonical origin.
 *
 * Server-only on purpose: `VERCEL_PROJECT_PRODUCTION_URL` is not a NEXT_PUBLIC_
 * variable, so it would be `undefined` inside a client bundle. Keeping this out
 * of `site.ts` (which client components import) avoids that trap.
 *
 * Precedence:
 *   1. NEXT_PUBLIC_SITE_URL          — set this once you own a custom domain
 *   2. VERCEL_PROJECT_PRODUCTION_URL — stable production domain, set by Vercel
 *   3. localhost                     — local dev
 *
 * Note it's deliberately the *production* URL, not VERCEL_URL: the latter is a
 * unique per-deployment hostname, which would make every preview build advertise
 * its own canonical URL and fragment the SEO signal.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
}
