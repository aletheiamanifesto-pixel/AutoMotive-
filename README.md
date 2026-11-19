# 🚗 AutoEngineer Academy

La piattaforma dove studiare le auto come un vero ingegnere e sbloccare esperienze nel mondo automotive.

## Stack

| Area | Strumento |
|---|---|
| Framework | Next.js 16 (App Router, Cache Components) + React 19 + TypeScript |
| Stile | Tailwind CSS v4 |
| Database / Auth | Supabase (Postgres + RLS + Auth) |
| Validazione | zod (schema unico per form, API e JSONB) |
| Pagamenti | Stripe (abbonamenti + crediti esperienza) |
| Test | Vitest |
| Deploy | Vercel |

## Avvio rapido

```bash
npm install
npm run dev
```

Senza variabili d'ambiente l'app usa i dati locali in `lib/data/seed-vehicles.ts`.
Per collegare Supabase copia `.env.example` in `.env.local` e applica la migrazione:

```bash
npx supabase db push
```

## Comandi

| Comando | Cosa fa |
|---|---|
| `npm run dev` | Server di sviluppo |
| `npm test` | Test di unità (Vitest) |
| `npm run typecheck` | Controllo tipi |
| `npm run lint` | ESLint |
| `npm run build` | Build di produzione |

## Architettura

```
app/                  Pagine (Server Components). Nessun accesso diretto al DB.
components/           UI riutilizzabile (layout, ui, vehicles, compare)
lib/domain/           Logica pura e testata: veicoli, confronto, gamification, piani
lib/data/             Data Access Layer: unica porta verso i dati (Supabase o seed locale)
lib/supabase/         Client Supabase: public (cache), user (cookie/RLS), admin (solo webhook)
supabase/migrations/  Schema SQL, RLS e funzioni server (award_xp, book_experience)
tests/                Test di unità + test di allineamento TS ↔ SQL
```

### Regole chiave

1. **XP, crediti, piano e prenotazioni non si scrivono mai dal client.** Si modificano solo con
   le funzioni SQL `award_xp` / `book_experience` (che leggono l'utente da `auth.uid()`)
   o dal webhook Stripe con service role. Sul profilo l'utente può cambiare solo nome e avatar.
2. **Specifiche tecniche in JSONB validato da zod.** I campi filtrabili sono colonne SQL;
   le sezioni tecniche (motore, telaio, aero…) sono JSONB, così si arricchiscono senza migrazioni.
3. **Costanti allineate.** `tests/sql-sync.test.ts` fallisce se regole XP o piani in TypeScript
   divergono dai valori inseriti nella migrazione SQL.
4. **Dati mancanti = `null`, mostrati come "n.d."**, mai inventati. I dati di esempio sono
   indicativi e vanno verificati sulle fonti dei costruttori.

## Roadmap

- [x] Base del progetto, schema DB con RLS, dominio testato
- [x] Catalogo con filtri, scheda veicolo, confronto con radar chart, pagina piani
- [ ] Autenticazione Supabase (login/registrazione, `proxy.ts` per il refresh della sessione)
- [ ] Profilo utente: livello, XP, streak, badge
- [ ] Stripe: checkout, webhook idempotente, customer portal
- [ ] Esperienze e prenotazioni
- [ ] Offerte, versus settimanale, classifica
