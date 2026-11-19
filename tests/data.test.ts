import { describe, expect, it } from "vitest";
import { SEED_VEHICLES } from "@/lib/data/seed-vehicles";
import { filterVehicles } from "@/lib/data/filter-vehicles";
import { vehicleFiltersSchema, vehicleSchema } from "@/lib/domain/vehicle";

describe("dataset", () => {
  it("ogni veicolo rispetta lo schema", () => {
    for (const v of SEED_VEHICLES) expect(() => vehicleSchema.parse(v)).not.toThrow();
  });
  it("slug univoci", () => {
    expect(new Set(SEED_VEHICLES.map((v) => v.slug)).size).toBe(SEED_VEHICLES.length);
  });
  it("kW coerenti con CV dichiarati (±3%)", () => {
    for (const v of SEED_VEHICLES) {
      const hpFromKw = v.specs.engine.powerKw * 1.35962;
      expect(Math.abs(hpFromKw - v.powerHp) / v.powerHp, v.slug).toBeLessThan(0.03);
    }
  });
});

describe("filtri", () => {
  it("query string non valida viene ignorata, non rompe la pagina", () => {
    const f = vehicleFiltersSchema.parse({ layout: "XYZ", yearFrom: "abc", sort: "power" });
    expect(f).toEqual({ layout: undefined, yearFrom: undefined, sort: "power" });
  });
  it("filtra per layout e ordina per potenza", () => {
    const res = filterVehicles(SEED_VEHICLES, { layout: "AWD", sort: "power" });
    expect(res.map((v) => v.slug)).toEqual(["tesla-model-s-plaid", "toyota-gr-yaris"]);
  });
  it("ricerca testuale su marca + modello", () => {
    expect(filterVehicles(SEED_VEHICLES, { q: "porsche gt3" })).toHaveLength(1);
  });
});
