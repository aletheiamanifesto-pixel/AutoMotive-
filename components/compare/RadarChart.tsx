import type { VehicleScore } from "@/lib/domain/compare";

/**
 * Radar chart SVG puro (nessuna libreria, renderizzato sul server).
 * Gli assi senza dato vengono disegnati a 0 e marcati "n.d." nell'etichetta.
 */
const COLORS = ["var(--color-accent)", "var(--color-accent-2)", "var(--color-good)"];
const SIZE = 360;
const C = SIZE / 2;
const R = 120;

function point(i: number, n: number, value: number): [number, number] {
  const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
  return [C + Math.cos(angle) * R * (value / 100), C + Math.sin(angle) * R * (value / 100)];
}

export function RadarChart({ series }: { series: { name: string; scores: VehicleScore[] }[] }) {
  const axes = series[0]?.scores ?? [];
  const n = axes.length;
  if (n === 0) return null;

  return (
    <figure>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto w-full max-w-md" role="img" aria-label="Radar chart del confronto">
        {[25, 50, 75, 100].map((ring) => (
          <polygon
            key={ring}
            points={axes.map((_, i) => point(i, n, ring).join(",")).join(" ")}
            fill="none"
            stroke="var(--color-border)"
          />
        ))}
        {axes.map((a, i) => {
          const [x, y] = point(i, n, 100);
          const [lx, ly] = point(i, n, 122);
          const missing = series.some((s) => s.scores[i].score == null);
          return (
            <g key={a.key}>
              <line x1={C} y1={C} x2={x} y2={y} stroke="var(--color-border)" />
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="var(--color-muted)">
                {a.label}
                {missing ? " (n.d.)" : ""}
              </text>
            </g>
          );
        })}
        {series.map((s, si) => (
          <polygon
            key={s.name}
            points={s.scores.map((sc, i) => point(i, n, sc.score ?? 0).join(",")).join(" ")}
            fill={COLORS[si % COLORS.length]}
            fillOpacity={0.18}
            stroke={COLORS[si % COLORS.length]}
            strokeWidth={2}
          />
        ))}
      </svg>
      <figcaption className="mt-2 flex justify-center gap-4 text-sm">
        {series.map((s, si) => (
          <span key={s.name} className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-sm" style={{ background: COLORS[si % COLORS.length] }} />
            {s.name}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
