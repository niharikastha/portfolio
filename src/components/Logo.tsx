/**
 * Personal mark: a little tilted computer with "an" handwritten on the screen
 * and a blinking cursor. Drawn inline so it follows the theme and the hand font.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 48 44" className={className} fill="none">
      <g transform="rotate(-6 24 22)">
        <rect x="4" y="3" width="40" height="30" rx="7" className="fill-paper" />
        <rect x="8.5" y="7.5" width="31" height="20" rx="3.5" className="fill-ink-950" />
        <text
          x="12.5"
          y="23"
          className="fill-pen font-hand"
          style={{ fontSize: 15, fontWeight: 700 }}
        >
          an
        </text>
        <rect x="30" y="20" width="5" height="2.6" rx="1" className="logo-cursor fill-pen" />
        <path d="M19 33l-2 5.5h14L29 33" className="fill-paper-dim" />
        <path d="M13 40.5h22" className="stroke-paper" strokeWidth="2.6" strokeLinecap="round" />
      </g>
      <path
        d="M44 1v3.5M44 8.5v3.5M38.5 6.2h3.5M46.5 6.2h1.5"
        className="stroke-pen"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
