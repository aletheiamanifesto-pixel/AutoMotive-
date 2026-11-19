import type { Metadata } from "next";
import { Suspense } from "react";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { listBrands, listVehicles } from "@/lib/data/vehicles";
import { BODY_TYPES, LAYOUTS, POWERTRAINS, SEGMENTS, vehicleFiltersSchema } from "@/lib/domain/vehicle";

export const metadata: Metadata = { title: "Veicoli" };

/**
 * I filtri sono un normale <form method="get">: funzionano senza JavaScript,
 * l'URL è condivisibile e la pagina resta un Server Component.
 */
export default function VehiclesPage({ searchParams }: PageProps<"/vehicles">) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Catalogo veicoli</h1>
      <Suspense fallback={<p className="text-muted">Caricamento catalogo…</p>}>
        <Catalog searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Catalog({ searchParams }: Pick<PageProps<"/vehicles">, "searchParams">) {
  const raw = await searchParams;
  const filters = vehicleFiltersSchema.parse(
    Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v || undefined])),
  );
  const [vehicles, brands] = await Promise.all([listVehicles(filters), listBrands()]);

  return (
    <>
      <form method="get" className="grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-3 lg:grid-cols-6">
        <input
          name="q"
          defaultValue={filters.q}
          placeholder="Cerca marca o modello"
          className="rounded-md border border-border bg-surface-2 px-3 py-2 text-sm sm:col-span-3 lg:col-span-2"
        />
        <Select name="brand" label="Marca" value={filters.brand} options={brands} />
        <Select name="segment" label="Segmento" value={filters.segment} options={SEGMENTS} />
        <Select name="layout" label="Layout" value={filters.layout} options={LAYOUTS} />
        <Select name="powertrain" label="Alimentazione" value={filters.powertrain} options={POWERTRAINS} />
        <Select name="bodyType" label="Carrozzeria" value={filters.bodyType} options={BODY_TYPES} />
        <Select
          name="sort"
          label="Ordina per nome"
          value={filters.sort}
          options={["power", "weight", "acceleration", "year"]}
          labels={{ power: "Potenza", weight: "Peso", acceleration: "0-100", year: "Anno" }}
        />
        <button className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-black">Filtra</button>
      </form>

      <p className="text-sm text-muted">{vehicles.length} veicoli</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
      </div>
    </>
  );
}

function Select({
  name,
  label,
  value,
  options,
  labels,
}: {
  name: string;
  label: string;
  value?: string;
  options: readonly string[];
  labels?: Record<string, string>;
}) {
  return (
    <select
      name={name}
      defaultValue={value ?? ""}
      aria-label={label}
      className="rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {labels?.[o] ?? o}
        </option>
      ))}
    </select>
  );
}
