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

        {cs.whatBroke?.length ? (
          <section className="mt-14">
            <Heading>What broke</Heading>
            <div className="rule-fade mt-5" />
            <div className="mt-5 space-y-4 leading-relaxed text-paper-dim">
              {cs.whatBroke.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        ) : null}

        {cs.nextTime?.length ? (
          <section className="mt-14">
            <Heading>What I&apos;d do differently</Heading>
            <div className="rule-fade mt-5" />
            <div className="mt-5 space-y-4 leading-relaxed text-paper-dim">
              {cs.nextTime.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
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
