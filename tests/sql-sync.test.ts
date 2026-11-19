import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { XP_ACTIONS } from "@/lib/domain/gamification";
import { PLANS } from "@/lib/domain/plans";

/** Evita che le costanti TS e i seed SQL divergano in silenzio. */
const sql = readFileSync(new URL("../supabase/migrations/20261119000000_init.sql", import.meta.url), "utf8");

function insertedRows(table: string): string[][] {
  const m = sql.match(new RegExp(`insert into public\\.${table} \\([^)]*\\) values([\\s\\S]*?);`));
  if (!m) throw new Error(`seed ${table} non trovato`);
  return [...m[1].matchAll(/\(([^)]*)\)/g)].map((r) => r[1].split(",").map((c) => c.trim().replace(/'/g, "")));
}

describe("allineamento TS ↔ SQL", () => {
  it("xp_rules", () => {
    const fromSql = Object.fromEntries(insertedRows("xp_rules").map(([a, xp, cap]) => [a, { xp: +xp, dailyCap: +cap }]));
    expect(fromSql).toEqual(XP_ACTIONS);
  });
  it("plans", () => {
    const fromSql = Object.fromEntries(insertedRows("plans").map(([id, m, c]) => [id, [+m, +c]]));
    const fromTs = Object.fromEntries(Object.values(PLANS).map((p) => [p.id, [p.xpMultiplier, p.monthlyExperienceCredits]]));
    expect(fromSql).toEqual(fromTs);
  });
});
