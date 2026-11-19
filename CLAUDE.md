# CLAUDE.md — AutoMotive

Leggi il README.md: descrive visione, architettura, Character Pack, collezione e roadmap. Questo file contiene le **regole di lavoro**.

## Regole di lavoro
- **Una milestone per sessione** (numeri della roadmap nel README). Inizia con un piano breve: file da creare/modificare, dipendenze, comando finale di verifica. Poi implementa.
- **Ogni milestone termina con**: test che passano (`npm test`), un comando eseguibile documentato nel README, aggiornamento di `docs/PROGRESS.md` (cosa è fatto, cosa manca, decisioni prese).
- **Branch per milestone** (`m01-engine`, `m02-pack`, …), commit piccoli in italiano, PR verso `main`.
- **Nessun segreto nel codice**: chiavi solo in `.env` (mai committato), con `.env.example` aggiornato.
- Se manca un input (chiave API, modello 3D, decisione di design) fermati e chiedi, indicando esattamente cosa serve.
- Non aggiungere dipendenze pesanti senza motivarlo. Preferisci librerie mantenute e diffuse.

## Convenzioni tecniche
- **Monorepo** con npm workspaces: `apps/*`, `packages/*`, `server/`.
- **TypeScript strict** ovunque nel codice JS. Vite per le app del runtime, Next.js per `apps/collect` e `apps/admin`.
- Test: **Vitest** per unità, **Playwright** solo per i flussi critici della PWA (scansione → schiusa → collezione).
- Lint/format: ESLint + Prettier.
- I pacchetti in `packages/` non dipendono dalle app. `packages/collection` è condiviso tra client e server: nessuna API del browser al suo interno.

## Vincoli di prestazioni (PC di sviluppo debole: 8 GB RAM, GPU 2 GB)
- Runtime 3D a 60 fps su grafica integrata: modelli ≤ 50k triangoli, texture ≤ 2K, compressione meshopt/Draco.
- Un solo personaggio animato in scena; particelle limitate (≤ 2.000).
- Nessun modello AI locale: il cervello usa un LLM via API.

## Regole del dominio
- Il cervello lavora **solo** con il vocabolario di azioni canoniche (`packages/actions`). L'output dell'LLM è JSON validato con schema (zod); se non valido → fallback alla macchina a stati.
- Ogni azione deve avere un fallback procedurale per famiglia: nessun personaggio può "bloccarsi".
- Ogni Character Pack è validato da `packages/pack-schema` prima del caricamento.
- **Webcam e microfono elaborati in locale**; all'LLM arrivano solo eventi testuali.

## Regole di sicurezza per la collezione
- Token dei drop firmati **Ed25519**; la chiave privata vive solo nelle Edge Function del server.
- Claim **atomico** in Postgres (transazione + vincoli di unicità): mai superare `max_claims`, mai due claim dello stesso account sullo stesso drop.
- Numerazione delle copie assegnata dal server, mai dal client.
- Row Level Security attiva su tutte le tabelle; il client non scrive mai direttamente su `copies`.
- Rate limiting su claim e contagio.
- Contagio valido solo se entrambi i giocatori firmano lo scambio entro 30 secondi.
- Niente acquisti di personaggi casuali con denaro reale, niente mercato a soldi veri, niente NFT/crypto.

## Contenuti
- Nessun personaggio protetto (franchise, marchi). I Pack di esempio usano solo modelli procedurali o con licenza commerciale registrata in `LICENSE.txt`.
- Il personaggio di test procedurale (`characters/test-blob`) deve funzionare senza alcun asset esterno.
