import { z } from "zod";

/**
 * Modello di dominio dei veicoli.
 *
 * Scelta: i campi su cui si filtra/ordina (brand, anno, segmento, potenza, peso…)
 * sono colonne SQL; le sezioni tecniche (motore, telaio, aero, elettronica, materiali)
 * sono JSONB validato da questi schemi zod. Così lo schema DB resta stabile mentre
 * le schede tecniche possono arricchirsi senza migrazioni continue.
 */

export const BODY_TYPES = ["coupe", "berlina", "suv", "spider", "hatchback", "hypercar"] as const;
export const SEGMENTS = ["sportiva", "supercar", "hypercar", "gt", "premium", "utilitaria"] as const;
export const LAYOUTS = ["FR", "MR", "RR", "FF", "AWD"] as const;
export const POWERTRAINS = ["termico", "ibrido", "plug-in", "elettrico"] as const;

export const engineSchema = z.object({
  type: z.string(), // es. "V8 biturbo", "Boxer 6 aspirato", "3 motori elettrici"
  displacementCc: z.number().int().positive().nullable(),
  cylinders: z.number().int().positive().nullable(),
  aspiration: z.enum(["aspirato", "turbo", "biturbo", "compressore", "elettrico"]),
  powerKw: z.number().positive(),
  torqueNm: z.number().positive(),
  redlineRpm: z.number().int().positive().nullable(),
  boreMm: z.number().positive().nullable(),
  strokeMm: z.number().positive().nullable(),
  compressionRatio: z.number().positive().nullable(),
  notes: z.string().optional(),
});

export const transmissionSchema = z.object({
  type: z.enum(["manuale", "doppia-frizione", "automatico", "monomarcia", "sequenziale"]),
  gears: z.number().int().positive(),
  differential: z.string().optional(),
});

export const chassisSchema = z.object({
  frontSuspension: z.string(),
  rearSuspension: z.string(),
  brakes: z.string(),
  steering: z.string(),
  weightDistributionFront: z.number().min(0).max(100), // % sull'anteriore
});

export const aeroSchema = z.object({
  dragCoefficient: z.number().positive().nullable(),
  downforceKgAtSpeed: z
    .object({ kg: z.number().nonnegative(), kmh: z.number().positive() })
    .nullable(),
  activeAero: z.array(z.string()),
});

export const electronicsSchema = z.object({
  ecuCount: z.number().int().nonnegative().nullable(),
  adas: z.array(z.string()),
  driveModes: z.array(z.string()),
});

export const vehicleSpecsSchema = z.object({
  engine: engineSchema,
  transmission: transmissionSchema,
  chassis: chassisSchema,
  aero: aeroSchema,
  electronics: electronicsSchema,
  materials: z.array(z.string()),
  curiosities: z.array(z.string()),
});

export const vehicleSchema = z.object({
  id: z.string(),
  slug: z.string(),
  brand: z.string(),
  model: z.string(),
  year: z.number().int().min(1886),
  bodyType: z.enum(BODY_TYPES),
  segment: z.enum(SEGMENTS),
  layout: z.enum(LAYOUTS),
  powertrain: z.enum(POWERTRAINS),
  powerHp: z.number().positive(),
  weightKg: z.number().positive(),
  zeroToHundredS: z.number().positive(),
  topSpeedKmh: z.number().positive(),
  priceEur: z.number().positive().nullable(),
  imageUrl: z.string().nullable(),
  specs: vehicleSpecsSchema,
});

export type Vehicle = z.infer<typeof vehicleSchema>;
export type VehicleSpecs = z.infer<typeof vehicleSpecsSchema>;
export type BodyType = (typeof BODY_TYPES)[number];
export type Segment = (typeof SEGMENTS)[number];
export type Layout = (typeof LAYOUTS)[number];
export type Powertrain = (typeof POWERTRAINS)[number];

export type VehicleSummary = Omit<Vehicle, "specs">;

/** Filtri del catalogo, letti dalla query string. Valori non validi vengono scartati. */
export const vehicleFiltersSchema = z.object({
  q: z.string().trim().max(80).optional().catch(undefined),
  brand: z.string().trim().max(40).optional().catch(undefined),
  bodyType: z.enum(BODY_TYPES).optional().catch(undefined),
  segment: z.enum(SEGMENTS).optional().catch(undefined),
  layout: z.enum(LAYOUTS).optional().catch(undefined),
  powertrain: z.enum(POWERTRAINS).optional().catch(undefined),
  yearFrom: z.coerce.number().int().optional().catch(undefined),
  yearTo: z.coerce.number().int().optional().catch(undefined),
  sort: z.enum(["power", "weight", "acceleration", "year", "name"]).optional().catch(undefined),
});

export type VehicleFilters = z.infer<typeof vehicleFiltersSchema>;

export function vehicleName(v: Pick<Vehicle, "brand" | "model">): string {
  return `${v.brand} ${v.model}`;
}

export function powerToWeight(v: Pick<Vehicle, "powerHp" | "weightKg">): number {
  return Math.round((v.powerHp / v.weightKg) * 1000); // CV per tonnellata
}
