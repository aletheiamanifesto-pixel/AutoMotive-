import { z } from "zod";

/**
 * Variabili d'ambiente validate. Tutte opzionali in sviluppo: senza Supabase
 * l'app usa i dati locali (lib/data/seed-vehicles.ts).
 */
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
});

const blankToUndefined = Object.fromEntries(
  Object.entries(process.env).map(([k, v]) => [k, v === "" ? undefined : v]),
);

export const env = envSchema.parse(blankToUndefined);

export const isSupabaseConfigured = Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
