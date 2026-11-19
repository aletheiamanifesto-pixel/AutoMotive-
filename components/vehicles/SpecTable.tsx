import { Card } from "@/components/ui/Card";

export type SpecRow = { label: string; value: string | number | null | undefined };

/** Tabella specifiche riutilizzabile: i dati mancanti sono mostrati esplicitamente, mai inventati. */
export function SpecTable({ id, title, rows }: { id: string; title: string; rows: SpecRow[] }) {
  return (
    <Card id={id} className="scroll-mt-20">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      <dl className="divide-y divide-border text-sm">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-2 gap-4 py-2">
            <dt className="text-muted">{r.label}</dt>
            <dd className="font-mono">
              {r.value == null || r.value === "" ? <span className="text-muted/60">n.d.</span> : r.value}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
