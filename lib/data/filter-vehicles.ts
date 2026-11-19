import type { Vehicle, VehicleFilters } from "@/lib/domain/vehicle";
import { vehicleName } from "@/lib/domain/vehicle";

/** Filtro/ordinamento in memoria sul catalogo già in cache (vedi listVehicles in vehicles.ts). */
export function filterVehicles(vehicles: Vehicle[], f: VehicleFilters): Vehicle[] {
  // Ogni parola deve comparire nel nome: "porsche gt3" trova "Porsche 911 GT3"
  const terms = f.q?.toLowerCase().split(/\s+/).filter(Boolean) ?? [];
  const result = vehicles.filter(
    (v) =>
      terms.every((t) => vehicleName(v).toLowerCase().includes(t)) &&
      (!f.brand || v.brand.toLowerCase() === f.brand.toLowerCase()) &&
      (!f.bodyType || v.bodyType === f.bodyType) &&
      (!f.segment || v.segment === f.segment) &&
      (!f.layout || v.layout === f.layout) &&
      (!f.powertrain || v.powertrain === f.powertrain) &&
      (f.yearFrom == null || v.year >= f.yearFrom) &&
      (f.yearTo == null || v.year <= f.yearTo),
  );
  return result.sort(SORTERS[f.sort ?? "name"]);
}

const SORTERS: Record<NonNullable<VehicleFilters["sort"]>, (a: Vehicle, b: Vehicle) => number> = {
  power: (a, b) => b.powerHp - a.powerHp,
  weight: (a, b) => a.weightKg - b.weightKg,
  acceleration: (a, b) => a.zeroToHundredS - b.zeroToHundredS,
  year: (a, b) => b.year - a.year,
  name: (a, b) => vehicleName(a).localeCompare(vehicleName(b)),
};
