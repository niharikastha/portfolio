"use client";

import { useState } from "react";
import { profile } from "@/content/site";
import { Reveal, Section } from "./primitives";

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (e.g. insecure origin); the mailto link still works.
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(body?.error ?? "Something went wrong.");

      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const field =
    "w-full rounded-lg border border-ink-700 bg-ink-850 px-4 py-3 text-sm text-paper placeholder:text-paper-faint transition-colors duration-300 focus:border-gold-400 focus:outline-none";

  return (
    <Section
      id="contact"
      title="Get in touch"
      lead="If you're hiring, need help on a project, or just want to talk about RAG, I'd be glad to hear from you."
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <div>
            <p className="text-pretty text-2xl font-medium leading-snug tracking-tight text-paper">
              Email is the quickest way to reach me.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={profile.socials.email}
                className="link-underline break-all text-xl font-semibold text-pen sm:text-2xl"
              >
                {profile.email}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-label={copied ? "Email copied" : "Copy email address"}
                title={copied ? "Copied" : "Copy email"}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-600 text-paper-dim transition-colors duration-300 hover:border-pen hover:text-pen"
              >
                <span aria-live="polite" className="sr-only">
                  {copied ? "Copied" : ""}
                </span>
                {copied ? (
                  <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 8.5 3 3 7-7" />
                  </svg>
                ) : (
                  <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
                    <path d="M10.5 5.5V4a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5" />
                  </svg>
                )}
              </button>
            </div>

            {profile.available ? (
              <div className="mt-8 rounded-2xl border border-gold-400/40 bg-gold-400/[0.05] p-5">
                <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gold-400">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                  Hiring? The short version
                </p>
                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-sm">
                  {[
                    ["Looking for", profile.lookingFor],
                    ["Experience", "~3 years, AI + fullstack, 4 live client products"],
                    ["Based in", profile.location],
                    ["Work mode", profile.workModes],
                    ["Notice", profile.noticePeriod],
                  ]
                    .filter(([, v]) => v)
                    .map(([label, value]) => (
                      <div key={label} className="contents">
                        <dt className="text-paper-faint">{label}</dt>
                        <dd className="text-paper">{value}</dd>
                      </div>
                    ))}
                </dl>
                <div className="mt-5 flex flex-wrap gap-2">
                  <a
                    href={profile.resumePath}
                    download
                    className="rounded-full bg-gold-400 px-4 py-2 text-xs font-semibold text-ink-950 transition-colors duration-300 hover:bg-gold-300"
                  >
                    Download resume
                  </a>
                  <a
                    href={`${profile.socials.email}?subject=${encodeURIComponent("Role at ")}`}
                    className="rounded-full border border-ink-600 px-4 py-2 text-xs text-paper transition-colors duration-300 hover:border-gold-400 hover:text-gold-400"
                  >
                    Email about a role
                  </a>
                </div>
              </div>
            ) : null}

            <dl className="mt-10 space-y-4 text-sm">
              {[
                ["Phone", profile.phone, `tel:${profile.phone.replace(/\s/g, "")}`],
                ["LinkedIn", "in/niharika-astha", profile.socials.linkedin],
                ["GitHub", `@${profile.githubUsername}`, profile.socials.github],
                ["Instagram", "@astha_niharika_20", profile.socials.instagram],
                ["Location", profile.location, null],
              ].map(([label, value, href]) => (
                <div
                  key={label as string}
                  className="flex justify-between gap-4 border-b border-ink-800 pb-3"
                >
                  <dt className="text-paper-faint">{label}</dt>
                  <dd className="text-right font-medium text-paper">
                    {href ? (
                      <a
                        href={href as string}
                        target={String(href).startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer noopener"
                        className="link-underline hover:text-gold-400"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-ink-700 bg-ink-900 p-7 sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-xs text-paper-dim">
                  Name
                </label>
                <input id="name" name="name" required autoComplete="name" className={field} placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-xs text-paper-dim">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={field}
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="subject" className="mb-2 block text-xs text-paper-dim">
                Subject
              </label>
              <input id="subject" name="subject" className={field} placeholder="Role, project, or question" />
            </div>

            <div className="mt-4">
              <label htmlFor="message" className="mb-2 block text-xs text-paper-dim">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className={`${field} resize-y`}
                placeholder="A sentence or two about what you're building."
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              className="mt-6 w-full rounded-full bg-paper py-3 text-sm font-semibold text-ink-950 transition-all duration-300 hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : status === "sent" ? "Message sent ✓" : "Send message"}
            </button>

            {/* Live region so screen readers hear the result */}
            <p aria-live="polite" className="mt-4 text-sm">
              {status === "sent" ? (
                <span className="text-gold-400">Thanks — I&apos;ll reply within a day or two.</span>
              ) : status === "error" ? (
                <span className="text-paper-dim">
                  {error}{" "}
                  <a href={profile.socials.email} className="link-underline text-gold-400">
                    Email me directly instead.
                  </a>
                </span>
              ) : null}
            </p>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
