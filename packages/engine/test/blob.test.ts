import { describe, expect, it } from "vitest";
import {
  BREATH_AMPLITUDE,
  BREATH_PERIOD_S,
  PROCEDURAL_CHARACTERS,
  breathe,
  createBlobGeometry,
  isProceduralId,
  triangleCount,
} from "../src/index.ts";

describe("blob procedurale", () => {
  it("numero di triangoli atteso e ben sotto il limite di 50k", () => {
    const g = createBlobGeometry({ detail: 12 });
    expect(triangleCount(g)).toBe(20 * 13 ** 2);
    expect(triangleCount(g)).toBeLessThan(50_000);
  });

  it("deterministico: due generazioni identiche", () => {
    const a = createBlobGeometry().getAttribute("position").array;
    const b = createBlobGeometry().getAttribute("position").array;
    expect(Array.from(a)).toEqual(Array.from(b));
  });

  it("centrato e dentro un ingombro ragionevole", () => {
    const box = createBlobGeometry({ radius: 1 }).boundingBox;
    if (!box) throw new Error("bounding box mancante");
    for (const axis of ["x", "z"] as const) {
      expect(Math.abs(box.min[axis] + box.max[axis])).toBeLessThan(0.2);
      expect(box.max[axis]).toBeLessThan(1.15);
    }
    expect(box.min.y).toBeGreaterThan(-1); // base schiacciata
  });

  it("senza NaN e con normali calcolate", () => {
    const g = createBlobGeometry();
    expect(Array.from(g.getAttribute("position").array).some(Number.isNaN)).toBe(false);
    expect(g.getAttribute("normal")).toBeDefined();
  });
});

describe("respiro", () => {
  it("periodico", () => {
    for (const t of [0, 0.7, 1.9, 3.3]) {
      expect(breathe(t + BREATH_PERIOD_S).scaleY).toBeCloseTo(breathe(t).scaleY);
    }
  });

  it("limitato all'ampiezza dichiarata", () => {
    for (let t = 0; t < BREATH_PERIOD_S; t += 0.05) {
      expect(Math.abs(breathe(t).scaleY - 1)).toBeLessThanOrEqual(BREATH_AMPLITUDE + 1e-9);
    }
  });

  it("conserva il volume (squash & stretch)", () => {
    for (let t = 0; t < BREATH_PERIOD_S; t += 0.3) {
      const p = breathe(t);
      expect(p.scaleY * p.scaleXZ ** 2).toBeCloseTo(1);
    }
  });

  it("si muove davvero: inspira ed espira", () => {
    expect(breathe(BREATH_PERIOD_S / 4).scaleY).toBeGreaterThan(1);
    expect(breathe((3 * BREATH_PERIOD_S) / 4).scaleY).toBeLessThan(1);
  });
});

describe("personaggi procedurali", () => {
  it("test-blob è registrato e si crea senza asset esterni", () => {
    expect(isProceduralId("test-blob")).toBe(true);
    expect(isProceduralId("drago")).toBe(false);
    const c = PROCEDURAL_CHARACTERS["test-blob"]();
    c.update(1);
    expect(c.object.scale.y).toBeCloseTo(breathe(1).scaleY);
    c.dispose();
  });
});
