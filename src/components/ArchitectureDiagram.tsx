import type { CaseStudy } from "@/content/site";

type Diagram = NonNullable<CaseStudy["diagrams"]>[number];
type Node = Diagram["nodes"][number];

// Grid geometry, in SVG units. Nodes sit in the middle of a cell.
const CELL_W = 200;
const CELL_H = 122;
const NODE_W = 146;
const NODE_H = 64;
const PAD = 16;

const center = (n: Node) => ({
  x: PAD + n.col * CELL_W + CELL_W / 2,
  y: PAD + n.row * CELL_H + CELL_H / 2,
});

/** Move a point from a node's centre to the edge of its box, towards (dx, dy). */
function toBorder(c: { x: number; y: number }, dx: number, dy: number, gap: number) {
  const hw = NODE_W / 2 + gap;
  const hh = NODE_H / 2 + gap;
  const t = Math.min(dx ? hw / Math.abs(dx) : Infinity, dy ? hh / Math.abs(dy) : Infinity);
  return { x: c.x + dx * t, y: c.y + dy * t };
}

function Shape({ node }: { node: Node }) {
  const { x, y } = center(node);
  const left = x - NODE_W / 2;
  const top = y - NODE_H / 2;
  const stroke = node.ai ? "stroke-pen" : "stroke-ink-600";

  switch (node.shape) {
    case "db": {
      const ry = 7;
      return (
        <g className={`${stroke} fill-ink-900`} strokeWidth="1.5">
          <path
            d={`M${left} ${top + ry} v${NODE_H - 2 * ry} a${NODE_W / 2} ${ry} 0 0 0 ${NODE_W} 0 v${-(NODE_H - 2 * ry)}`}
          />
          <ellipse cx={x} cy={top + ry} rx={NODE_W / 2} ry={ry} className="fill-ink-850" />
        </g>
      );
    }
    case "user":
      return (
        <rect
          x={left}
          y={top}
          width={NODE_W}
          height={NODE_H}
          rx={NODE_H / 2}
          className="fill-ink-850 stroke-pen/60"
          strokeWidth="1.5"
        />
      );
    case "ext":
      // Third-party services get a dashed outline: not code I run.
      return (
        <rect
          x={left}
          y={top}
          width={NODE_W}
          height={NODE_H}
          rx="12"
          className={`fill-ink-900 ${stroke}`}
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
      );
    default:
      return (
        <rect
          x={left}
          y={top}
          width={NODE_W}
          height={NODE_H}
          rx={node.shape === "tool" ? 8 : 12}
          className={`${node.ai ? "fill-ink-850" : "fill-ink-900"} ${stroke}`}
          strokeWidth="1.5"
        />
      );
  }
}

function NodeView({ node }: { node: Node }) {
  const { x, y } = center(node);
  const tool = node.shape === "tool";
  const labelY = node.note ? y - 5 : y + 5;
  return (
    <g>
      <Shape node={node} />
      {node.ai ? (
        <text
          x={x + NODE_W / 2 - 8}
          y={y - NODE_H / 2 + 13}
          textAnchor="end"
          className="fill-pen font-mono text-[8.5px] tracking-[0.14em]"
        >
          LLM
        </text>
      ) : null}
      <text
        x={x}
        y={node.shape === "db" ? labelY + 4 : labelY}
        textAnchor="middle"
        className={tool ? "fill-paper font-mono text-[10.5px]" : "fill-paper text-[13px] font-semibold"}
      >
        {node.label}
      </text>
      {node.note ? (
        <text
          x={x}
          y={(node.shape === "db" ? labelY + 4 : labelY) + 18}
          textAnchor="middle"
          className="fill-paper-dim font-hand text-[13px]"
        >
          {node.note}
        </text>
      ) : null}
    </g>
  );
}

/**
 * A system diagram drawn from a small grid spec in site.ts: nodes are placed by
 * column and row, and edges are gently curved arrows between them, so it reads
 * like a sketch in a notebook rather than a generated chart.
 */
export function ArchitectureDiagram({ diagram, id }: { diagram: Diagram; id: string }) {
  const cols = Math.max(...diagram.nodes.map((n) => n.col)) + 1;
  const rows = Math.max(...diagram.nodes.map((n) => n.row)) + 1;
  const width = cols * CELL_W + PAD * 2;
  const height = rows * CELL_H + PAD * 2;
  const byId = new Map(diagram.nodes.map((n) => [n.id, n]));
  const arrow = `arrow-${id}`;

  const edges = diagram.edges.flatMap((e, i) => {
    const a = byId.get(e.from);
    const b = byId.get(e.to);
    if (!a || !b) return [];
    const ca = center(a);
    const cb = center(b);
    const dx = cb.x - ca.x;
    const dy = cb.y - ca.y;
    const p0 = toBorder(ca, dx, dy, 4);
    const p1 = toBorder(cb, -dx, -dy, 6);
    // A slight bow, alternating sides, so the arrows look drawn by hand.
    const len = Math.hypot(p1.x - p0.x, p1.y - p0.y) || 1;
    const bow = (i % 2 ? -1 : 1) * Math.min(12, len * 0.08);
    const cx = (p0.x + p1.x) / 2 + (-(p1.y - p0.y) / len) * bow;
    const cy = (p0.y + p1.y) / 2 + ((p1.x - p0.x) / len) * bow;
    // Midpoint of the curve; labels on flat arrows sit just above the line.
    const mx = 0.25 * p0.x + 0.5 * cx + 0.25 * p1.x;
    const my = 0.25 * p0.y + 0.5 * cy + 0.25 * p1.y;
    const flat = Math.abs(dy) < 1;
    return [
      {
        ...e,
        key: `${e.from}-${e.to}`,
        d: `M${p0.x} ${p0.y} Q${cx} ${cy} ${p1.x} ${p1.y}`,
        lx: mx,
        ly: flat ? my - 8 : my + 4,
      },
    ];
  });

  return (
    <figure className="rounded-2xl border border-ink-700 bg-ink-950 p-3 sm:p-5">
      {/* The dot grid makes it feel like graph paper; it scrolls sideways on small screens. */}
      <div className="relative overflow-x-auto rounded-xl">
        <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 [mask-image:none] opacity-70" />
        <svg
          role="img"
          aria-label={diagram.title}
          viewBox={`0 0 ${width} ${height}`}
          className="relative mx-auto block h-auto w-full"
          style={{ minWidth: Math.min(width, 640) }}
        >
          <title>{diagram.title}</title>
          <g className="text-paper-faint">
            <defs>
              <marker id={arrow} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M1 1.5 8.5 5 1 8.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
            </defs>

            {edges.map((e) => (
              <path
                key={e.key}
                d={e.d}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeDasharray={e.dashed ? "4 5" : undefined}
                markerEnd={`url(#${arrow})`}
                markerStart={e.both ? `url(#${arrow})` : undefined}
              />
            ))}
          </g>

          {diagram.nodes.map((n) => (
            <NodeView key={n.id} node={n} />
          ))}

          {/* Labels go on top so a short hop between two boxes can still carry one. */}
          {edges.map((e) =>
            e.label ? (
              <text
                key={e.key}
                x={e.lx}
                y={e.ly}
                textAnchor="middle"
                className="fill-pen stroke-ink-950 font-hand text-[13px]"
                strokeWidth="5"
                strokeLinejoin="round"
                style={{ paintOrder: "stroke" }}
              >
                {e.label}
              </text>
            ) : null,
          )}
        </svg>
      </div>
      <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-1">
        <span className="text-sm leading-relaxed text-paper-dim">{diagram.caption}</span>
        <span className="flex shrink-0 items-center gap-4 font-mono text-[10px] tracking-[0.12em] text-paper-faint uppercase">
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="h-2.5 w-4 rounded-sm border border-pen" /> calls a model
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="h-2.5 w-4 rounded-sm border border-dashed border-paper-faint" /> third-party
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * How much survives each stage, as bars on a log scale: going from 16,500 to 15
 * on a linear scale would leave the last bars invisible.
 */
export function Funnel({ stages }: { stages: NonNullable<CaseStudy["funnel"]> }) {
  const max = Math.log10(Math.max(...stages.map((s) => s.n)));
  return (
    <figure className="rounded-2xl border border-ink-700 bg-ink-900 p-5 sm:p-7">
      <ol className="space-y-3">
        {stages.map((s, i) => {
          const pct = 18 + 82 * (Math.log10(Math.max(s.n, 1)) / max);
          return (
            <li key={s.label} className="grid items-center gap-x-5 gap-y-1 sm:grid-cols-[1fr_15rem]">
              <div className="relative h-11">
                <div
                  className={`flex h-full items-center rounded-lg px-4 ${
                    i === stages.length - 1 ? "bg-pen text-[#1a0f0c]" : "bg-ink-700 text-paper"
                  }`}
                  style={{ width: `${pct}%`, opacity: i === stages.length - 1 ? 1 : 1 - i * 0.12 }}
                >
                  <span className="nums text-lg font-bold tracking-tight">{s.value}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-paper">{s.label}</p>
                {s.note ? <p className="font-hand text-[15px] leading-snug text-pen">{s.note}</p> : null}
              </div>
            </li>
          );
        })}
      </ol>
      <figcaption className="mt-5 font-mono text-[10px] tracking-[0.14em] text-paper-faint uppercase">
        Bar widths on a log scale
      </figcaption>
    </figure>
  );
}
