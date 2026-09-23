import type { CaseStudy } from "@/content/site";

/**
 * A project's pipeline as a row of steps (a column on small screens).
 * Steps that call a model are marked, so you can see how little of the
 * pipeline actually needs one.
 */
export function PipelineDiagram({
  steps,
  compact = false,
}: {
  steps: CaseStudy["pipeline"];
  compact?: boolean;
}) {
  return (
    <figure>
      <ol className={`grid gap-2 ${compact ? "sm:grid-cols-3 lg:grid-cols-6" : "md:grid-cols-3 xl:grid-cols-6"}`}>
        {steps.map((step, i) => (
          <li
            key={step.label}
            className={`relative rounded-xl border p-3 ${
              step.ai ? "border-gold-400/50 bg-gold-400/[0.06]" : "border-ink-700 bg-ink-850"
            }`}
          >
            <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.14em]">
              <span className="nums text-paper-faint">{String(i + 1).padStart(2, "0")}</span>
              {step.ai ? <span className="text-gold-400">LLM</span> : null}
            </div>
            <p className="mt-2 text-sm font-medium text-paper">{step.label}</p>
            <p className="mt-1 text-xs leading-snug text-paper-dim">{step.note}</p>
          </li>
        ))}
      </ol>
      <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-paper-faint">
        {steps.filter((s) => s.ai).length} of {steps.length} steps call a model
      </figcaption>
    </figure>
  );
}
