/**
 * Regole di gamification (funzioni pure, testate in tests/gamification.test.ts).
 *
 * IMPORTANTE: l'assegnazione degli XP avviene SOLO nel database tramite la funzione
 * `award_xp` (vedi supabase/migrations). Il client non può mai scrivere XP.
 * Questo modulo serve a: mostrare livelli/progressi in UI e tenere allineate
 * le costanti con l'SQL (un test verifica che XP_ACTIONS coincida con il seed SQL).
 */

export const XP_ACTIONS = {
  read_vehicle: { xp: 10, dailyCap: 20 },
  complete_quiz: { xp: 50, dailyCap: 5 },
  compare_vehicles: { xp: 15, dailyCap: 10 },
  vote_versus: { xp: 20, dailyCap: 1 },
  daily_login: { xp: 25, dailyCap: 1 },
  book_experience: { xp: 200, dailyCap: 3 },
} as const satisfies Record<string, { xp: number; dailyCap: number }>;

export type XpAction = keyof typeof XP_ACTIONS;

export type Level = { level: number; title: string; minXp: number };

/** Soglie: crescita quadratica, livello n richiede 100 * n^2 XP (titoli a fasce). */
const TITLES = ["Curioso", "Appassionato", "Meccanico", "Tecnico", "Ingegnere", "Capo Progetto", "Leggenda"] as const;
export const MAX_LEVEL = 30;

export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return 100 * (level - 1) ** 2;
}

export function titleForLevel(level: number): string {
  const idx = Math.min(TITLES.length - 1, Math.floor((level - 1) / 5));
  return TITLES[idx];
}

export function levelFromXp(xp: number): Level {
  const safe = Math.max(0, Math.floor(xp));
  const level = Math.min(MAX_LEVEL, Math.floor(Math.sqrt(safe / 100)) + 1);
  return { level, title: titleForLevel(level), minXp: xpForLevel(level) };
}

export type LevelProgress = Level & {
  xp: number;
  nextLevelXp: number | null;
  /** 0–1 */
  progress: number;
};

export function levelProgress(xp: number): LevelProgress {
  const current = levelFromXp(xp);
  if (current.level >= MAX_LEVEL) return { ...current, xp, nextLevelXp: null, progress: 1 };
  const next = xpForLevel(current.level + 1);
  return { ...current, xp, nextLevelXp: next, progress: (xp - current.minXp) / (next - current.minXp) };
}

/**
 * Streak: giorni consecutivi di attività. `lastActiveDay` e `today` sono date ISO (YYYY-MM-DD)
 * nel fuso dell'utente. Rispecchia la logica di `award_xp` in SQL.
 */
export function nextStreak(currentStreak: number, lastActiveDay: string | null, today: string): number {
  if (!lastActiveDay) return 1;
  const diffDays = Math.round((Date.parse(today) - Date.parse(lastActiveDay)) / 86_400_000);
  if (diffDays <= 0) return currentStreak; // già attivo oggi
  if (diffDays === 1) return currentStreak + 1;
  return 1;
}

/** Livello minimo richiesto per prenotare un'esperienza, confrontato col livello utente. */
export function canUnlock(userXp: number, requiredLevel: number): boolean {
  return levelFromXp(userXp).level >= requiredLevel;
}
