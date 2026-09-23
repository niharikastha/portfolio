import { techMark } from "@/lib/tech";

/**
 * A row of round logo chips. The name appears in a small label on hover, and
 * is always in the markup for screen readers. Server-safe: no client JS.
 */
export function TechStack({
  items,
  size = "md",
  className = "",
}: {
  items: string[];
  size?: "sm" | "md";
  className?: string;
}) {
  const box = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const icon = size === "sm" ? 15 : 18;

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((name, i) => {
        const mark = techMark(name);
        return (
          <li key={name} className="group relative">
            <span
              className={`${box} flex items-center justify-center rounded-full border border-ink-700 bg-ink-900 text-paper shadow-[0_1px_0_var(--color-ink-700)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-ink-600 group-hover:bg-ink-850 ${
                i % 3 === 1 ? "group-hover:-rotate-6" : "group-hover:rotate-6"
              }`}
            >
              {mark.kind === "logo" ? (
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  width={icon}
                  height={icon}
                  fill={mark.color ?? "currentColor"}
                >
                  <path d={mark.path} />
                </svg>
              ) : (
                <span aria-hidden className="font-mono text-[10px] font-semibold tracking-tight text-paper-dim">
                  {mark.text}
                </span>
              )}
              <span className="sr-only">{name}</span>
            </span>

            {/* Hover label */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-paper px-2 py-1 font-mono text-[10px] font-medium text-ink-950 opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
            >
              {name}
              <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-paper" />
            </span>
          </li>
        );
      })}
    </ul>
  );
}
