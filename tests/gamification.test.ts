import { describe, expect, it } from "vitest";
import { canUnlock, levelFromXp, levelProgress, nextStreak, xpForLevel, MAX_LEVEL } from "@/lib/domain/gamification";

describe("livelli", () => {
  it("soglie quadratiche", () => {
    expect(xpForLevel(1)).toBe(0);
    expect(xpForLevel(2)).toBe(100);
    expect(xpForLevel(3)).toBe(400);
    expect(xpForLevel(10)).toBe(8100);
  });

  it("levelFromXp è coerente con xpForLevel ai bordi", () => {
    for (let lvl = 1; lvl <= MAX_LEVEL; lvl++) {
      expect(levelFromXp(xpForLevel(lvl)).level).toBe(lvl);
      if (lvl > 1) expect(levelFromXp(xpForLevel(lvl) - 1).level).toBe(lvl - 1);
    }
  });

  it("gestisce XP negativi e oltre il massimo", () => {
    expect(levelFromXp(-50).level).toBe(1);
    expect(levelFromXp(10_000_000).level).toBe(MAX_LEVEL);
    expect(levelProgress(10_000_000)).toMatchObject({ nextLevelXp: null, progress: 1 });
  });

  it("progresso a metà livello", () => {
    expect(levelProgress(250)).toMatchObject({ level: 2, nextLevelXp: 400, progress: 0.5 });
  });

  it("titoli a fasce di 5 livelli", () => {
    expect(levelFromXp(0).title).toBe("Curioso");
    expect(levelFromXp(xpForLevel(6)).title).toBe("Appassionato");
  });

  it("sblocco esperienze per livello", () => {
    expect(canUnlock(99, 2)).toBe(false);
    expect(canUnlock(100, 2)).toBe(true);
  });
});

describe("streak", () => {
  it("primo giorno", () => expect(nextStreak(0, null, "2026-11-19")).toBe(1));
  it("stesso giorno non incrementa", () => expect(nextStreak(4, "2026-11-19", "2026-11-19")).toBe(4));
  it("giorno consecutivo", () => expect(nextStreak(4, "2026-11-18", "2026-11-19")).toBe(5));
  it("cambio mese", () => expect(nextStreak(2, "2026-10-31", "2026-11-01")).toBe(3));
  it("giorno saltato azzera", () => expect(nextStreak(9, "2026-11-17", "2026-11-19")).toBe(1));
});
