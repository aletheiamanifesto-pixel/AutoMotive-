import { describe, expect, it } from "vitest";
import { fitCameraDistance } from "../src/index.ts";

/** Semiampiezza angolare (radianti) occupata da una sfera di raggio r vista a distanza d. */
const angularRadius = (r: number, d: number) => Math.asin(r / d);

describe("inquadratura automatica", () => {
  const fov = 35;
  const vHalf = (fov * Math.PI) / 360;

  for (const [label, aspect] of [
    ["monitor orizzontale 16:9", 16 / 9],
    ["telefono verticale 9:19.5", 9 / 19.5],
    ["quadrato", 1],
  ] as const) {
    it(`${label}: la sfera entra sia in altezza sia in larghezza`, () => {
      const d = fitCameraDistance(1, fov, aspect);
      const hHalf = Math.atan(Math.tan(vHalf) * aspect);
      expect(angularRadius(1, d)).toBeLessThan(vHalf);
      expect(angularRadius(1, d)).toBeLessThan(hHalf);
    });
  }

  it("in verticale la telecamera si allontana di più", () => {
    expect(fitCameraDistance(1, fov, 9 / 19.5)).toBeGreaterThan(fitCameraDistance(1, fov, 16 / 9));
  });

  it("proporzionale al raggio", () => {
    expect(fitCameraDistance(2, fov, 1)).toBeCloseTo(2 * fitCameraDistance(1, fov, 1));
  });
});
