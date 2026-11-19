import { describe, expect, it } from "vitest";
import { compareVehicles, normalize, scoreVehicle } from "@/lib/domain/compare";
import { SEED_VEHICLES } from "@/lib/data/seed-vehicles";

const bySlug = (s: string) => SEED_VEHICLES.find((v) => v.slug === s)!;

describe("normalize", () => {
  it("scala diretta e invertita, con clamp", () => {
    expect(normalize(50, [0, 100])).toBe(50);
    expect(normalize(2, [12, 2])).toBe(100); // 0-100 più basso = meglio
    expect(normalize(500, [0, 100])).toBe(100);
    expect(normalize(-5, [0, 100])).toBe(0);
  });
});

describe("confronto", () => {
  it("dato mancante → punteggio null, non 0", () => {
    const gt3 = scoreVehicle(bySlug("porsche-911-gt3-992"));
    expect(gt3.find((s) => s.key === "aero")?.score).toBeNull();
  });

  it("vince chi accelera di più, l'asse invertito funziona", () => {
    const rows = compareVehicles([bySlug("mazda-mx5-nd-20"), bySlug("tesla-model-s-plaid")]);
    expect(rows.find((r) => r.key === "accel")?.winners).toEqual([1]);
  });

  it("pareggio: entrambi vincitori", () => {
    const rows = compareVehicles([bySlug("porsche-911-gt3-992"), bySlug("bmw-m3-competition-g80")]);
    expect(rows.find((r) => r.key === "power")?.winners).toEqual([0, 1]);
  });

  it("asse senza dati per nessuno → nessun vincitore", () => {
    const rows = compareVehicles([bySlug("porsche-911-gt3-992"), bySlug("ferrari-296-gtb")]);
    expect(rows.find((r) => r.key === "aero")?.winners).toEqual([]);
  });
});
