# Astha Niharika — Portfolio

Personal portfolio site. Next.js 15 (App Router), Tailwind CSS v4, Framer Motion.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run typecheck  # tsc --noEmit
```

> Port 3000 is often taken by the PM2 apps on this machine. Use `PORT=4318 npm run dev` if so.

## Editing content

**Everything you'd want to change lives in one file: [`src/content/site.ts`](src/content/site.ts).**
Components read from it — you shouldn't need to touch JSX to add a project, a
post, or a skill.

| What | Where in `site.ts` |
| --- | --- |
| Name, role, headline, bio, links | `profile` |
| Hero metric band | `metrics` |
| Job history | `experience` |
| Project cards | `projects` |
| Stack chips | `skills` |
| Degrees | `education` |
| Blog / LinkedIn posts | `writing` |
| GDG events, talks | `community` |
| Nav items | `nav` |

Adding a project: append to `projects`. Set `featured: true` to show it in the
default filter view, and `kind: "client"` to replace the source links with the
"proprietary, happy to discuss" note.

Bullet strings support `**bold**` — it's rendered by `RichText`, so content
stays plain text rather than JSX.

## Still to fill in

Search the repo for `TODO` — there are three:

1. **`writing[0].href`** — paste the permalink to your LinkedIn BLE post.
2. **`community[0].detail`** — name the actual GDG events (e.g. "DevFest
   Bhubaneswar 2024", "I/O Extended 2025"). Specific beats generic here.
3. **`profile.siteUrl`** — set to your real domain once you have one. It drives
   canonical URLs, the sitemap and OG tags.

Two things to fix on GitHub itself, since the site pulls from the API live:

- `klartext` and `walkingpal` have no repo description, so their cards render
  blank. Add one sentence each.
- `resume-ai-autopilot`'s description ends with "Private." but the repo is
  public. Either reword it or make the repo private — right now it contradicts
  itself, and the portfolio links to it as **Source**.

## Deploying to Vercel

```bash
npx vercel          # preview
npx vercel --prod   # production
```

Or push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new) —
zero config needed.

### Environment variables

The contact form works without these, but it will tell visitors it isn't
connected and point them at the mailto link instead. To actually receive mail,
sign up at [resend.com](https://resend.com) and set:

| Variable | Required | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | Without it, `/api/contact` returns 503. |
| `CONTACT_TO` | no | Defaults to `profile.email`. |
| `CONTACT_FROM` | no | Must be a domain verified in Resend. Defaults to Resend's shared sandbox sender, which is fine for testing but will land in spam in production. |

## Notes on how it's built

- **The hero needs no JavaScript.** Its entrance is a CSS `@keyframes`
  animation (`.rise` in `globals.css`), and `Hero` is a server component. If the
  bundle fails to load, the most important content is still there and readable.
- **Counters server-render the real number** and snap to 0 in a layout effect
  before first paint, so no-JS visitors see `65%`, not `0%`.
- **A `<noscript>` rule** in `layout.tsx` force-reveals the scroll-animated
  sections, which would otherwise stay at `opacity: 0` without JS.
- **GitHub stats are live**, fetched server-side and revalidated hourly to stay
  under the unauthenticated 60 req/hr limit. Every failure path degrades to just
  showing the profile link.
- **The OG card is generated** at `src/app/opengraph-image.tsx` — this is what
  LinkedIn renders when the link is shared, so it leads with the metrics.
- **Client work is marked `kind: "client"`** and deliberately carries no code,
  schemas or screenshots. Only resume-level outcomes.
- `prefers-reduced-motion` is honoured globally; all animation collapses to
  ~0ms.

## Accessibility

Skip link, visible focus rings, labelled form fields, `aria-live` on form
status, `aria-expanded` on the mobile menu, semantic landmarks, and a
`Person` JSON-LD block for search engines.
