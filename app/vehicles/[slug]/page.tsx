import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Card } from "@/components/ui/Card";
import { SpecTable } from "@/components/vehicles/SpecTable";
import { RadarChart } from "@/components/compare/RadarChart";
import { getVehicleBySlug, listVehicles } from "@/lib/data/vehicles";
import { scoreVehicle } from "@/lib/domain/compare";
import { powerToWeight, vehicleName } from "@/lib/domain/vehicle";

export async function generateStaticParams() {
  return (await listVehicles()).map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/vehicles/[slug]">): Promise<Metadata> {
  const v = await getVehicleBySlug((await params).slug);
  return { title: v ? vehicleName(v) : "Veicolo non trovato" };
}

const SECTIONS = [
  ["motore", "Motore"],
  ["trasmissione", "Trasmissione"],
  ["telaio", "Telaio"],
  ["aero", "Aerodinamica"],
  ["elettronica", "Elettronica"],
  ["curiosita", "Curiosità"],
] as const;

export default async function VehiclePage({ params }: PageProps<"/vehicles/[slug]">) {
  const v = await getVehicleBySlug((await params).slug);
  if (!v) notFound();
  const { engine, transmission, chassis, aero, electronics } = v.specs;
  const list = (xs: string[]) => (xs.length ? xs.join(", ") : null);

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          <Badge>{v.segment}</Badge>
          <Badge>{v.layout}</Badge>
          <Badge>{v.powertrain}</Badge>
          <Badge>{v.year}</Badge>
        </div>
        <h1 className="text-3xl font-bold">{vehicleName(v)}</h1>
        <p className="text-muted">{engine.type}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card>
          <dl className="grid grid-cols-2 gap-4 font-mono sm:grid-cols-4">
            <Big label="Potenza" value={`${v.powerHp} CV`} />
            <Big label="Coppia" value={`${engine.torqueNm} Nm`} />
            <Big label="0-100 km/h" value={`${v.zeroToHundredS} s`} />
            <Big label="V max" value={`${v.topSpeedKmh} km/h`} />
            <Big label="Peso" value={`${v.weightKg} kg`} />
            <Big label="CV/tonnellata" value={powerToWeight(v)} />
            <Big label="Ripartizione" value={`${chassis.weightDistributionFront}/${100 - chassis.weightDistributionFront}`} />
            <Big label="Cx" value={aero.dragCoefficient ?? "n.d."} />
          </dl>
          <nav className="mt-6 flex flex-wrap gap-2 text-sm">
            {SECTIONS.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="rounded-md border border-border px-3 py-1 hover:border-accent">
                {label}
              </a>
            ))}
            <Link href={`/compare?a=${v.slug}`} className="rounded-md bg-accent px-3 py-1 text-black">
              Confronta →
            </Link>
          </nav>
        </Card>
        <Card>
          <RadarChart series={[{ name: vehicleName(v), scores: scoreVehicle(v) }]} />
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SpecTable
          id="motore"
          title="Motore"
          rows={[
            { label: "Architettura", value: engine.type },
            { label: "Cilindrata", value: engine.displacementCc && `${engine.displacementCc} cc` },
            { label: "Cilindri", value: engine.cylinders },
            { label: "Alimentazione aria", value: engine.aspiration },
            { label: "Potenza", value: `${engine.powerKw} kW` },
            { label: "Coppia", value: `${engine.torqueNm} Nm` },
            { label: "Regime max", value: engine.redlineRpm && `${engine.redlineRpm} giri/min` },
            { label: "Alesaggio × corsa", value: engine.boreMm && engine.strokeMm && `${engine.boreMm} × ${engine.strokeMm} mm` },
            { label: "Rapporto di compressione", value: engine.compressionRatio && `${engine.compressionRatio}:1` },
          ]}
        />
        <SpecTable
          id="trasmissione"
          title="Trasmissione"
          rows={[
            { label: "Cambio", value: transmission.type },
            { label: "Marce", value: transmission.gears },
            { label: "Differenziale", value: transmission.differential },
          ]}
        />
        <SpecTable
          id="telaio"
          title="Telaio"
          rows={[
            { label: "Sospensioni ant.", value: chassis.frontSuspension },
            { label: "Sospensioni post.", value: chassis.rearSuspension },
            { label: "Freni", value: chassis.brakes },
            { label: "Sterzo", value: chassis.steering },
            { label: "Peso sull'anteriore", value: `${chassis.weightDistributionFront}%` },
          ]}
        />
        <SpecTable
          id="aero"
          title="Aerodinamica"
          rows={[
            { label: "Coefficiente Cx", value: aero.dragCoefficient },
            {
              label: "Deportanza",
              value: aero.downforceKgAtSpeed && `${aero.downforceKgAtSpeed.kg} kg a ${aero.downforceKgAtSpeed.kmh} km/h`,
            },
            { label: "Aero attiva", value: list(aero.activeAero) },
          ]}
        />
        <SpecTable
          id="elettronica"
          title="Elettronica"
          rows={[
            { label: "Centraline (ECU)", value: electronics.ecuCount },
            { label: "ADAS", value: list(electronics.adas) },
            { label: "Modalità di guida", value: list(electronics.driveModes) },
            { label: "Materiali", value: list(v.specs.materials) },
          ]}
        />
        <Card id="curiosita" className="scroll-mt-20">
          <h2 className="mb-3 text-lg font-semibold">Curiosità</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm">
            {v.specs.curiosities.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Card>
      </div>
    </article>
  );
}

function Big({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="text-lg">{value}</dd>
    </div>
  );
}
