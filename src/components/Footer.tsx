import type { ReactNode } from "react";
import { siGithub, siInstagram } from "simple-icons";
import { profile } from "@/content/site";

const icon = "h-[18px] w-[18px]";

const links: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: "GitHub",
    href: profile.socials.github,
    icon: (
      <svg aria-hidden viewBox="0 0 24 24" className={icon} fill="currentColor">
        <path d={siGithub.path} />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: profile.socials.linkedin,
    icon: (
      <svg aria-hidden viewBox="0 0 24 24" className={icon} fill="currentColor">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-1.8 3.6-1.8 3.85 0 4.54 2.4 4.54 5.5v5.8h-4v-5.1c0-1.3-.03-2.9-1.9-2.9-1.9 0-2.1 1.4-2.1 2.8v5.2h-4v-11Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: profile.socials.instagram,
    icon: (
      <svg aria-hidden viewBox="0 0 24 24" className={icon} fill="currentColor">
        <path d={siInstagram.path} />
      </svg>
    ),
  },
  {
    label: "Email",
    href: profile.socials.email,
    icon: (
      <svg aria-hidden viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    ),
  },
  {
    label: "Resume",
    href: profile.resumePath,
    icon: (
      <svg aria-hidden viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
        <path d="M14 3v5h5M12 11v6m0 0-2.5-2.5M12 17l2.5-2.5" />
      </svg>
    ),
  },
];

/** Server component: a sign-off, the email, round social links and a way back up. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-10 overflow-hidden">
      {/* Hand-drawn squiggle instead of a straight rule */}
      <svg
        aria-hidden
        viewBox="0 0 1200 24"
        preserveAspectRatio="none"
        className="mx-auto block h-5 w-full max-w-6xl px-6 text-ink-600"
        fill="none"
      >
        <path
          d="M0 12c50-10 100 10 150 0s100 10 150 0 100 10 150 0 100 10 150 0 100 10 150 0 100 10 150 0 100 10 150 0 100 10 150 0"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-10">
        <div className="grid items-end gap-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="-rotate-2 font-hand text-xl text-pen">thanks for scrolling this far!</p>
            <p className="mt-3 text-balance text-[clamp(1.8rem,4.5vw,3rem)] leading-[1.08] font-bold tracking-[-0.03em] text-paper">
              Got a role or a project in mind?
            </p>
            <a
              href={profile.socials.email}
              className="group mt-5 inline-flex flex-wrap items-center gap-3 text-lg font-semibold text-paper-dim transition-colors duration-300 hover:text-pen sm:text-xl"
            >
              <span className="link-underline break-all">{profile.email}</span>
              <span
                aria-hidden
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-600 transition-all duration-300 group-hover:rotate-[-45deg] group-hover:border-pen"
              >
                →
              </span>
            </a>
          </div>

          <div className="md:justify-self-end">
            <p className="mb-3 font-hand text-lg text-paper-dim md:text-right">find me here</p>
            <ul className="flex flex-wrap gap-2.5">
              {links.map((l, i) => (
                <li key={l.label} className="group relative">
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer noopener"
                    download={l.href === profile.resumePath ? true : undefined}
                    aria-label={l.label}
                    className={`flex h-12 w-12 items-center justify-center rounded-full border border-ink-700 bg-ink-900 text-paper-dim transition-all duration-300 hover:-translate-y-1 hover:border-pen hover:text-pen ${
                      i % 2 ? "hover:-rotate-6" : "hover:rotate-6"
                    }`}
                  >
                    {l.icon}
                  </a>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 translate-y-1 rounded-md bg-paper px-2 py-1 font-mono text-[10px] whitespace-nowrap text-ink-950 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    {l.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-ink-800 pt-6 text-xs text-paper-faint">
          <p>
            © {year} {profile.name} · {profile.location}
          </p>
          <a
            href="#main"
            className="group flex items-center gap-2 transition-colors duration-300 hover:text-paper"
          >
            <span className="font-hand text-base text-pen">back to top</span>
            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-1">
              ↑
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
