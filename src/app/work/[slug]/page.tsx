import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { profile, projects } from "@/content/site";
import { PipelineDiagram } from "@/components/PipelineDiagram";
import { RichText, Tag } from "@/components/primitives";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";

type Params = { slug: string };

const withCaseStudy = projects.filter((p) => p.caseStudy);

export function generateStaticParams(): Params[] {
  return withCaseStudy.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = withCaseStudy.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} case study`,
    description: project.tagline,
    alternates: { canonical: `/work/${project.slug}` },
  };
}

function Heading({ children }: { children: string }) {
  return (
    <h2 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-normal leading-tight tracking-tight text-paper">
      {children}
    </h2>
  );
}

/** Turn a normal YouTube/Loom share link into its embeddable form. */
function toEmbed(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const loom = url.match(/loom\.com\/(?:share|embed)\/([\w-]+)/);
  if (loom) return `https://www.loom.com/embed/${loom[1]}`;
  return null;
}

function Demo({ slug, demo }: { slug: string; demo?: { liveUrl?: string; video?: string } }) {
  const video = demo?.video;
  const localVideo =
    video && !video.startsWith("http") && fs.existsSync(path.join(process.cwd(), "public", "work", slug, video))
      ? `/work/${slug}/${video}`
      : null;
  const embed = video?.startsWith("http") ? toEmbed(video) : null;

  if (!localVideo && !embed && !demo?.liveUrl) {
    // Reserved space for the demo. Only visible while developing.
    if (process.env.NODE_ENV !== "development") return null;
    return (
      <div className="mt-10 flex aspect-video items-center justify-center rounded-2xl border-2 border-dashed border-ink-600 p-6 text-center text-sm text-paper-faint">
        Demo goes here — set <code className="mx-1 font-mono">caseStudy.demo</code> in site.ts
        (a video in /public/work/{slug}/, a YouTube/Loom link, or a live URL). Hidden in production
        until then.
      </div>
    );
  }

  return (
    <section aria-label="Demo" className="mt-10">
      {localVideo ? (
        <video
          src={localVideo}
          controls
          playsInline
          preload="metadata"
          className="aspect-video w-full rounded-2xl border border-ink-700 bg-ink-900"
        />
      ) : embed ? (
        <iframe
          src={embed}
          title="Demo video"
          allow="fullscreen; picture-in-picture"
          className="aspect-video w-full rounded-2xl border border-ink-700 bg-ink-900"
        />
      ) : null}
      {demo?.liveUrl ? (
        <a
          href={demo.liveUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-4 inline-block rounded-full bg-gold-400 px-5 py-2.5 text-sm font-semibold text-ink-950 transition-colors duration-300 hover:bg-gold-300"
        >
          Try the live demo ↗
        </a>
      ) : null}
    </section>
  );
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = withCaseStudy.find((p) => p.slug === slug);
  if (!project?.caseStudy) notFound();
  const cs = project.caseStudy;

  const screenshots = (cs.screenshots ?? []).filter((s) =>
    fs.existsSync(path.join(process.cwd(), "public", "work", project.slug, s.file)),
  );

  return (
    <>
      <header className="border-b border-ink-800">
        <nav aria-label="Case study" className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/#work" className="link-underline text-sm text-paper-dim hover:text-paper">
            ← Back to {profile.name}
          </Link>
          <ThemeToggle />
        </nav>
      </header>

      <main id="main" className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper-faint">
          Case study · {project.period} · <span className="text-sky-soft/80">{project.domain}</span>
        </p>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4rem)] font-normal leading-[1.02] tracking-tight text-paper">
          {project.name}
        </h1>
        <p className="mt-4 font-display text-xl italic text-gold-400">{project.tagline}</p>

        {project.metric ? (
          <p className="mt-8">
            <span className="nums text-3xl font-medium text-paper">{project.metric.value}</span>{" "}
            <span className="text-sm text-paper-faint">{project.metric.label}</span>
          </p>
        ) : null}

        <Demo slug={project.slug} demo={cs.demo} />

        <section className="mt-14">
          <Heading>The problem</Heading>
          <div className="rule-fade mt-5" />
          <p className="mt-5 text-pretty leading-relaxed text-paper-dim">{project.problem}</p>
        </section>

        <section className="mt-14">
          <Heading>How it works</Heading>
          <div className="rule-fade mt-5" />
          <div className="mt-6">
            <PipelineDiagram steps={cs.pipeline} />
          </div>
          <ul className="mt-8 space-y-2.5">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-[15px] leading-relaxed text-paper-dim">
                <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-gold-500" />
                <span>
                  <RichText text={h} />
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <Heading>Decisions and why</Heading>
          <div className="rule-fade mt-5" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {cs.decisions.map((d) => (
              <div key={d.title} className="rounded-2xl border border-ink-700 bg-ink-900 p-5">
                <h3 className="font-medium text-paper">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper-dim">{d.body}</p>
              </div>
            ))}
          </div>
        </section>

        {screenshots.length ? (
          <section className="mt-14">
            <Heading>Screenshots</Heading>
            <div className="rule-fade mt-5" />
            <div className="mt-6 grid gap-6">
              {screenshots.map((s) => (
                <figure key={s.file}>
                  <Image
                    src={`/work/${project.slug}/${s.file}`}
                    alt={s.caption}
                    width={1600}
                    height={1000}
                    className="h-auto w-full rounded-xl border border-ink-700"
                  />
                  <figcaption className="mt-2 text-xs text-paper-faint">{s.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {cs.techChoices?.length ? (
          <section className="mt-14">
            <Heading>Why these tools</Heading>
            <div className="rule-fade mt-5" />
            <dl className="mt-6 divide-y divide-ink-800 rounded-2xl border border-ink-700 bg-ink-900">
              {cs.techChoices.map((t) => (
                <div key={t.tech} className="grid gap-1 p-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                  <dt className="font-mono text-xs uppercase tracking-[0.12em] text-gold-400">{t.tech}</dt>
                  <dd className="text-sm leading-relaxed text-paper-dim">{t.why}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {cs.knownGaps?.length ? (
          <section className="mt-14">
            <Heading>Known gaps</Heading>
            <div className="rule-fade mt-5" />
            <p className="mt-5 text-sm text-paper-faint">
              What isn&apos;t production-grade yet. I&apos;d rather list these than have you find them.
            </p>
            <ul className="mt-4 space-y-2.5">
              {cs.knownGaps.map((g) => (
                <li key={g} className="flex gap-3 text-[15px] leading-relaxed text-paper-dim">
                  <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-ink-600" />
                  <span>
                    <RichText text={g} />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {cs.improvements?.length ? (
          <section className="mt-14">
            <Heading>Making the answers better</Heading>
            <div className="rule-fade mt-5" />
            <p className="mt-5 text-sm text-paper-faint">
              What I&apos;d change next in retrieval, the RAG step and the agent loop, in the order
              I&apos;d do it.
            </p>
            <ol className="mt-6 space-y-4">
              {cs.improvements.map((imp, i) => (
                <li key={imp.title} className="grid grid-cols-[2rem_1fr] gap-3">
                  <span className="nums font-mono text-sm text-gold-400">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-medium text-paper">{imp.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-paper-dim">
                      <RichText text={imp.body} />
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {cs.testing ? (
          <section className="mt-14">
            <Heading>Testing</Heading>
            <div className="rule-fade mt-5" />
            <p className="mt-5 leading-relaxed text-paper-dim">{cs.testing.status}</p>
            {cs.testing.plan.length ? (
              <ul className="mt-4 space-y-2.5">
                {cs.testing.plan.map((t) => (
                  <li key={t} className="flex gap-3 text-[15px] leading-relaxed text-paper-dim">
                    <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-gold-500" />
                    <span>
                      <RichText text={t} />
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ) : null}

        <section className="mt-14">
          <Heading>Built with</Heading>
          <div className="rule-fade mt-5" />
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-5">
            {project.links?.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer noopener"
                className="link-underline font-mono text-xs uppercase tracking-[0.14em] text-paper hover:text-gold-400"
              >
                {l.label} ↗
              </a>
            ))}
            <Link
              href="/#contact"
              className="link-underline font-mono text-xs uppercase tracking-[0.14em] text-gold-400 hover:text-gold-300"
            >
              Talk to me about it →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
