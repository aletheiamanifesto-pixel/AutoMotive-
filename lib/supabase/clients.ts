import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

/**
 * Tre client, tre scopi:
 * - publicClient: chiave anon, nessun cookie → usabile dentro `use cache` per dati pubblici (catalogo).
 * - userClient:   chiave anon + cookie di sessione → le policy RLS vedono l'utente loggato.
 * - adminClient:  service role, bypassa RLS → SOLO job server. Mai in componenti.
 */

function requireSupabase() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase non configurato: imposta NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return { url: env.NEXT_PUBLIC_SUPABASE_URL, anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY };
}

export function publicClient() {
  const { url, anonKey } = requireSupabase();
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

export async function userClient() {
  const { url, anonKey } = requireSupabase();
  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Chiamato da un Server Component: i cookie vengono aggiornati dal proxy.
        }
      },
    },
  });
}

export function adminClient() {
  const { url } = requireSupabase();
  if (!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY mancante");
  return createClient(url, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
}
