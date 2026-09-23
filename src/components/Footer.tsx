import { profile } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-800">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper">
              {profile.name}
              <span className="text-gold-400">.</span>
            </p>
            <p className="mt-2 text-xs text-paper-faint">
              © {year} · Built with Next.js and Tailwind.
            </p>
          </div>

          <ul className="flex flex-wrap gap-7">
            {[
              ["GitHub", profile.socials.github],
              ["LinkedIn", profile.socials.linkedin],
              ["Email", profile.socials.email],
              ["Résumé", profile.resumePath],
            ].map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer noopener"
                  className="link-underline font-mono text-[11px] uppercase tracking-[0.14em] text-paper-dim transition-colors duration-300 hover:text-gold-400"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
