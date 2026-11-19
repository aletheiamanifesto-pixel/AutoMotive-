import { describe, expect, it } from "vitest";
import { DISPLAY_NAMES } from "@automotive/engine";
import { DISPLAYS, parseHoloArgs } from "../scripts/holo-args.mjs";

const chars = ["test-blob"];

describe("npm run holo: parametri", () => {
  it("valori predefiniti", () => {
    expect(parseHoloArgs([], chars)).toEqual({ character: "test-blob", display: "screen", open: true });
  });

  it("forma con spazio e forma con =", () => {
    expect(parseHoloArgs(["--character", "test-blob", "--display", "pane45"], chars)).toMatchObject({
      display: "pane45",
    });
    expect(parseHoloArgs(["--display=pane45", "--no-open"], chars)).toMatchObject({
      display: "pane45",
      open: false,
    });
  });

  it("rifiuta un personaggio che non esiste", () => {
    expect(() => parseHoloArgs(["--character", "drago"], chars)).toThrow(/non trovato.*test-blob/);
  });

  it("rifiuta un display sconosciuto elencando quelli validi", () => {
    expect(() => parseHoloArgs(["--display", "piramide"], chars)).toThrow(/screen, pane45/);
  });

  it("rifiuta parametri sconosciuti o senza valore", () => {
    expect(() => parseHoloArgs(["--colore", "rosso"], chars)).toThrow(/sconosciuto/);
    expect(() => parseHoloArgs(["--display"], chars)).toThrow(/Manca il valore/);
  });

  it("help", () => {
    expect(parseHoloArgs(["--help"], chars)).toEqual({ help: true });
  });

  it("l'elenco dei display è allineato con il motore", () => {
    expect([...DISPLAYS]).toEqual([...DISPLAY_NAMES]);
  });
});
