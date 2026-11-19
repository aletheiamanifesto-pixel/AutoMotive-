import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { listVehicles } from "@/lib/data/vehicles";

export default async function HomePage() {
  // Catalogo in cache: questa pagina finisce interamente nello static shell.
  const trending = (await listVehicles({ sort: "power" })).slice(0, 3);
  const curiosity = trending[0]?.specs.curiosities[0];

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Studia le auto come un <span className="text-accent">ingegnere</span>.
        </h1>
        <p className="max-w-2xl text-muted">
          Schede tecniche, confronti ingegneristici e un percorso a livelli che sblocca esperienze reali nel mondo
          automotive.
        </p>
        <div className="flex gap-3">
          <Link href="/vehicles" className="rounded-lg bg-accent px-4 py-2 font-medium text-black">
            Esplora i veicoli
          </Link>
          <Link href="/compare" className="rounded-lg border border-border px-4 py-2">
            Confronta
          </Link>
        </div>
      </section>

      {curiosity && (
        <Card className="border-accent/50">
          <p className="mb-1 text-xs uppercase tracking-wider text-accent">Curiosità del giorno</p>
          <p>{curiosity}</p>
        </Card>
      )}

      <section>
        <h2 className="mb-4 text-xl font-semibold">Le più potenti del catalogo</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trending.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </section>
    </div>
  );
}
