import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { isProceduralId } from "@automotive/engine";

const dir = join(import.meta.dirname, "..", "characters");

describe("characters/", () => {
  const ids = readdirSync(dir).filter((d) => existsSync(join(dir, d, "manifest.json")));

  it("test-blob esiste", () => expect(ids).toContain("test-blob"));

  it.each(ids)("%s: manifest coerente, licenza presente", (id) => {
    const manifest = JSON.parse(readFileSync(join(dir, id, "manifest.json"), "utf8"));
    expect(manifest.id).toBe(id);
    expect(existsSync(join(dir, id, "LICENSE.txt"))).toBe(true);
    if (manifest.procedural) expect(isProceduralId(manifest.procedural)).toBe(true);
  });
});
