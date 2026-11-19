import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { isSupabaseConfigured } from "@/lib/env";
import { publicClient } from "@/lib/supabase/clients";
import { vehicleSchema, type Vehicle, type VehicleFilters } from "@/lib/domain/vehicle";
import { SEED_VEHICLES } from "./seed-vehicles";
import { filterVehicles } from "./filter-vehicles";

/**
 * Data Access Layer del catalogo. Le pagine chiamano SOLO queste funzioni,
 * mai Supabase direttamente. Il catalogo è pubblico → cache lato server con tag
 * "vehicles" (invalidabile con revalidateTag dopo un import di dati).
 */

const COLUMNS =
  "id, slug, brand, model, year, body_type, segment, layout, powertrain, power_hp, weight_kg, zero_to_hundred_s, top_speed_kmh, price_eur, image_url, specs";

type VehicleRow = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  body_type: string;
  segment: string;
  layout: string;
  powertrain: string;
  power_hp: number;
  weight_kg: number;
  zero_to_hundred_s: number;
  top_speed_kmh: number;
  price_eur: number | null;
  image_url: string | null;
  specs: unknown;
};

function fromRow(r: VehicleRow): Vehicle {
  return vehicleSchema.parse({
    id: r.id,
    slug: r.slug,
    brand: r.brand,
    model: r.model,
    year: r.year,
    bodyType: r.body_type,
    segment: r.segment,
    layout: r.layout,
    powertrain: r.powertrain,
    powerHp: Number(r.power_hp),
    weightKg: Number(r.weight_kg),
    zeroToHundredS: Number(r.zero_to_hundred_s),
    topSpeedKmh: Number(r.top_speed_kmh),
    priceEur: r.price_eur == null ? null : Number(r.price_eur),
    imageUrl: r.image_url,
    specs: r.specs,
  });
}

async function fetchAll(): Promise<Vehicle[]> {
  if (!isSupabaseConfigured) return SEED_VEHICLES;
  const { data, error } = await publicClient().from("vehicles").select(COLUMNS).eq("published", true);
  if (error) throw new Error(`Errore lettura veicoli: ${error.message}`);
  return (data as VehicleRow[]).map(fromRow);
}

/**
 * Per un catalogo di qualche centinaio di modelli conviene caricare tutto (cache) e filtrare
 * in memoria: una sola query, filtri istantanei. Oltre ~2000 righe passare a filtri SQL + paginazione.
 */
export async function listVehicles(filters: VehicleFilters = {}): Promise<Vehicle[]> {
  "use cache";
  cacheTag("vehicles");
  cacheLife("hours");
  return filterVehicles(await fetchAll(), filters);
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  "use cache";
  cacheTag("vehicles", `vehicle:${slug}`);
  cacheLife("hours");
  return (await fetchAll()).find((v) => v.slug === slug) ?? null;
}

export async function getVehiclesBySlugs(slugs: string[]): Promise<Vehicle[]> {
  const all = await listVehicles();
  return slugs.flatMap((s) => all.find((v) => v.slug === s) ?? []);
}

export async function listBrands(): Promise<string[]> {
  const all = await listVehicles();
  return [...new Set(all.map((v) => v.brand))].sort();
}
