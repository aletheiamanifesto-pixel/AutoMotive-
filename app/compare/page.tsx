import type { Metadata } from "next";
import { Suspense } from "react";
import { Card } from "@/components/ui/Card";
import { RadarChart } from "@/components/compare/RadarChart";
import { getVehiclesBySlugs, listVehicles } from "@/lib/data/vehicles";
import { compareVehicles, scoreVehicle } from "@/lib/domain/compare";
import { vehicleName } from "@/lib/domain/vehicle";

export const metadata: Metadata = { title: "Confronta" };

export default function ComparePage({ searchParams }: PageProps<"/compare">) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Confronto ingegneristico</h1>
      <Suspense fallback={<p className="text-muted">Caricamento…</p>}>
        <Comparison searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Comparison({ searchParams }: Pick<PageProps<"/compare">, "searchParams">) {
  const sp = await searchParams;
  const pick = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const all = await listVehicles();
  const selected = [pick("a"), pick("b")];
  const vehicles = await getVehiclesBySlugs(selected.filter(Boolean));

  return (
    <>
      <form method="get" className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-4">
        {(["a", "b"] as const).map((key, i) => (
          <select
            key={key}
            name={key}
            defaultValue={selected[i]}
            aria-label={`Veicolo ${i + 1}`}
            className="min-w-56 rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
          >
            <option value="">Scegli un veicolo…</option>
            {all.map((v) => (
              <option key={v.slug} value={v.slug}>
                {vehicleName(v)}
              </option>
            ))}
          </select>
        ))}
        <button className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-black">Confronta</button>
      </form>

      {vehicles.length === 2 ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted">
                  <th className="py-2 font-normal">Parametro</th>
                  {vehicles.map((v) => (
                    <th key={v.id} className="py-2 font-medium text-fg">
                      {vehicleName(v)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {compareVehicles(vehicles).map((row) => (
                  <tr key={row.key}>
                    <td className="py-2 font-sans text-muted">
                      {row.label} <span className="text-xs">({row.unit})</span>
                    </td>
                    {row.values.map((val, i) => (
                      <td key={i} className={`py-2 ${row.winners.includes(i) ? "font-bold text-good" : ""}`}>
                        {val ?? "n.d."}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Card>
            <RadarChart series={vehicles.map((v) => ({ name: vehicleName(v), scores: scoreVehicle(v) }))} />
          </Card>
        </div>
      ) : (
        <p className="text-muted">Scegli due veicoli per vedere il confronto.</p>
      )}
    </>
  );
}
