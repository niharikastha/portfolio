import { profile } from "@/content/site";
import { Reveal, Section } from "./primitives";

type GhUser = {
  public_repos: number;
  followers: number;
  created_at: string;
};

type GhRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  updated_at: string;
};

/**
 * Unauthenticated GitHub API: 60 req/hr per IP. Revalidating hourly keeps us
 * well under that, and every failure path degrades to "just show the profile link".
 */
async function getGithub() {
  const headers = { Accept: "application/vnd.github+json" };
  const opts = { headers, next: { revalidate: 3600 } } as const;

  try {
    const [userRes, repoRes] = await Promise.all([
      fetch(`https://api.github.com/users/${profile.githubUsername}`, opts),
      fetch(
        `https://api.github.com/users/${profile.githubUsername}/repos?sort=updated&per_page=100`,
        opts,
      ),
    ]);

    if (!userRes.ok || !repoRes.ok) return null;

    const user = (await userRes.json()) as GhUser;
    const allRepos = (await repoRes.json()) as GhRepo[];

    if (!Array.isArray(allRepos)) return null;

    const owned = allRepos.filter((r) => !r.fork);
    const repos = owned
      .sort((a, b) => b.stargazers_count - a.stargazers_count || b.updated_at.localeCompare(a.updated_at))
      .slice(0, 6);

    const languages = [...new Set(owned.map((r) => r.language).filter(Boolean))] as string[];
    const stars = owned.reduce((sum, r) => sum + r.stargazers_count, 0);

    return { user, repos, languages, stars, publicRepos: owned.length };
  } catch {
    return null;
  }
}

export async function Github() {
  const data = await getGithub();

  return (
    <Section
      id="github"
      index="05"
      title="On GitHub"
      lead="Public repositories, pulled live from the GitHub API and refreshed hourly."
    >
      {data ? (
        <>
          <Reveal>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-700 bg-ink-700 sm:grid-cols-4">
              {[
                { label: "Public repos", value: String(data.publicRepos) },
                { label: "Stars earned", value: String(data.stars) },
                { label: "Languages", value: String(data.languages.length) },
                {
                  label: "On GitHub since",
                  value: new Date(data.user.created_at).getFullYear().toString(),
                },
              ].map((s) => (
                <div key={s.label} className="bg-ink-900 p-6">
                  <dd className="nums text-3xl font-medium leading-none text-paper">{s.value}</dd>
                  <dt className="mt-2.5 text-xs text-paper-faint">{s.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>

          {data.repos.length ? (
            <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-ink-700 bg-ink-700 sm:grid-cols-2">
              {data.repos.map((repo, i) => (
                <Reveal key={repo.id} delay={i * 0.04} className="bg-ink-900">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex h-full flex-col p-6 transition-colors duration-400 hover:bg-ink-850"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-mono text-sm text-paper">{repo.name}</h3>
                      {repo.stargazers_count > 0 ? (
                        <span className="nums shrink-0 text-[11px] text-gold-400">
                          ★ {repo.stargazers_count}
                        </span>
                      ) : null}
                    </div>
                    {repo.description ? (
                      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-paper-dim">
                        {repo.description}
                      </p>
                    ) : (
                      <div className="flex-1" />
                    )}
                    {repo.language ? (
                      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-soft/80">
                        {repo.language}
                      </p>
                    ) : null}
                  </a>
                </Reveal>
              ))}
            </div>
          ) : null}
        </>
      ) : (
        <Reveal>
          <p className="text-paper-dim">
            GitHub stats are temporarily unavailable — browse the profile directly instead.
          </p>
        </Reveal>
      )}

      <Reveal delay={0.1}>
        <a
          href={profile.socials.github}
          target="_blank"
          rel="noreferrer noopener"
          className="link-underline mt-8 inline-block font-mono text-xs uppercase tracking-[0.14em] text-paper transition-colors duration-300 hover:text-gold-400"
        >
          github.com/{profile.githubUsername} ↗
        </a>
      </Reveal>
    </Section>
  );
}
