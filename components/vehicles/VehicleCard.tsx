import Link from "next/link";
import { Badge, Card } from "@/components/ui/Card";
import { powerToWeight, vehicleName, type Vehicle } from "@/lib/domain/vehicle";

export function VehicleCard({ vehicle: v }: { vehicle: Vehicle }) {
  return (
    <Link href={`/vehicles/${v.slug}`} className="group block">
      <Card className="h-full transition group-hover:border-accent">
        <div className="mb-3 flex flex-wrap gap-1.5">
          <Badge>{v.layout}</Badge>
          <Badge>{v.powertrain}</Badge>
          <Badge>{v.year}</Badge>
        </div>
        <h3 className="font-semibold">{vehicleName(v)}</h3>
        <p className="mb-4 text-sm text-muted">{v.specs.engine.type}</p>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-sm">
          <Stat label="Potenza" value={`${v.powerHp} CV`} />
          <Stat label="Peso" value={`${v.weightKg} kg`} />
          <Stat label="0-100" value={`${v.zeroToHundredS} s`} />
          <Stat label="CV/t" value={powerToWeight(v)} />
        </dl>
      </Card>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
