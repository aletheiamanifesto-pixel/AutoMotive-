import { describe, expect, it } from "vitest";
import { DISPLAY_NAMES, PURE_BLACK, finalPassUv, getDisplayAdapter } from "../src/index.ts";

describe("display adapter", () => {
  it("tutte le uscite hanno fondo nero puro", () => {
    for (const name of DISPLAY_NAMES) expect(getDisplayAdapter(name).background).toBe(PURE_BLACK);
    expect(PURE_BLACK).toBe(0x000000);
  });

  it("pane45 specchia, screen no", () => {
    expect(getDisplayAdapter("pane45").mirrorX).toBe(true);
    expect(getDisplayAdapter("screen").mirrorX).toBe(false);
  });

  it("display sconosciuto: errore con l'elenco dei validi", () => {
    expect(() => getDisplayAdapter("fan")).toThrow(
      'Display "fan" sconosciuto. Valori validi: screen, pane45',
    );
  });

  it("specchiamento UV: la colonna u diventa 1-u", () => {
    const m = finalPassUv(true);
    for (const u of [0, 0.25, 1]) expect(u * m.repeatX + m.offsetX).toBeCloseTo(1 - u);
    const id = finalPassUv(false);
    expect(0.25 * id.repeatX + id.offsetX).toBe(0.25);
  });
});
