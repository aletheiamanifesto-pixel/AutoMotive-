# Passi per Claude Code

Una sessione per milestone. Incolla il prompt, approva il piano, lascia lavorare, verifica con il comando finale, unisci la PR. Poi passa alla successiva.

---

## Input da preparare (prima di iniziare)

| Input | Serve dalla milestone | Dove si ottiene |
|---|---|---|
| Node.js 20+, Git, Claude Code installati | 1 | nodejs.org, git-scm.com |
| Un personaggio 3D con scheletro e animazioni in `.glb` (es. drago con idle, felice, arrabbiato, mossa speciale) | 2 | Meshy (genera + auto-rig) oppure Sketchfab/CGTrader con **licenza commerciale** |
| 5–10 effetti sonori del personaggio (verso, fusa, ruggito, mossa speciale) | 2 | librerie royalty-free (es. Freesound con licenza CC0) |
| Webcam e microfono funzionanti | 4 | quelli del PC |
| Chiave API di un LLM (es. Anthropic) | 5 | console del provider; mettila in `.env` |
| Progetto Supabase (URL + anon key + service role key) | 6 | supabase.com, piano gratuito |
| Dominio o sottodominio per la PWA + hosting (Vercel) | 7 | Vercel piano gratuito |
| Nomi, descrizioni e rarità dei primi 5–10 personaggi | 7 | decisione tua |
| 3 bar/negozi partner a Roma + zone dei drop | 10 | vendita diretta |
| Adesivi QR stampati | 10 | tipografia / stampa online |

---

## Fase A — Il personaggio vive

### Sessione 1 — Monorepo ed engine
```
Leggi README.md e CLAUDE.md. Esegui la milestone 1.
Crea il monorepo (npm workspaces, TypeScript strict, Vitest, ESLint, Prettier),
packages/engine con renderer Three.js e display adapter "screen" e "pane45"
(fondo nero puro, immagine specchiata), e apps/holo che mostra il personaggio
procedurale characters/test-blob. Prima mostrami il piano.
```
**Verifica:** `npm run holo -- --character test-blob --display pane45` mostra il blob che respira su fondo nero.

### Sessione 2 — Character Pack, azioni, Playground
```
Milestone 2. Crea packages/pack-schema (schema zod del manifest come nel README),
packages/actions (vocabolario canonico + risoluzione azione → clip o procedurale)
e apps/playground: carica un Pack, elenca le azioni, un pulsante per ciascuna.
Usa il modello che ho messo in characters/<id>/model.glb e scrivi il suo manifest.json.
```
**Input:** il `.glb` del primo personaggio + suoni in `characters/<id>/`.
**Verifica:** nel Playground ogni pulsante esegue l'azione senza errori.

### Sessione 3 — Movimento procedurale
```
Milestone 3. In packages/families implementa le 6 famiglie del README con i fallback
procedurali (respiro, sguardo verso un punto, coda/ali secondarie, galleggiamento,
squash & stretch). Aggiungi in packages/engine gli strati di movimento e il sistema
di particelle per gli effetti (fuoco, scintille, cuori) con bloom.
```
**Verifica:** anche le azioni senza clip funzionano; la mossa speciale mostra le particelle.

### Sessione 4 — Sensi
```
Milestone 4. packages/senses: MediaPipe Gesture Recognizer dalla webcam
(carezza = mano aperta che si muove lenta vicino al personaggio, pugno, saluto),
posizione del viso per lo sguardo, comandi vocali in italiano con Web Speech API.
Emetti eventi tipizzati. Collegali a trigger semplici nel Playground.
```
**Verifica:** carezza nell'aria → `react_pet`; dire "fuoco" → `special_1`.

### Sessione 5 — Cervello
```
Milestone 5. packages/brain: bisogni (energia, fame, affetto, noia) che evolvono nel
tempo, macchina a stati per le reazioni immediate, client LLM che riceve personalità,
umore, evento e azioni disponibili e restituisce JSON validato; memoria locale.
Se l'LLM non risponde o il JSON non è valido, usa la macchina a stati.
```
**Input:** chiave API in `.env`.
**Verifica:** lasciato solo si addormenta; al ritorno ti "saluta"; accarezzato spesso diventa più affettuoso.

---

## Fase B — Il personaggio si colleziona

### Sessione 6 — Backend
```
Milestone 6. server/ con Supabase: migrazioni per players, characters, drops,
copies (numerate), claims, contagions, partners. Edge Function sign-drop (Ed25519),
claim (verifica firma, claim atomico, numerazione, rarità, variante cromatica),
RLS su tutte le tabelle, rate limiting. Test sul claim concorrente: mai oltre max_claims.
```
**Input:** credenziali Supabase in `.env`.
**Verifica:** 100 claim simultanei su un drop da 10 → esattamente 10 copie numerate 1–10.

### Sessione 7 — App giocatore
```
Milestone 7. apps/collect: PWA Next.js con login, scansione QR dalla fotocamera,
animazione dell'uovo che si schiude, rivelazione della rarità, collezione (Pokédex
con sagome dei personaggi mancanti) e vista del personaggio con il runtime di
packages/engine, anche in modalità ologramma.
```
**Input:** elenco dei primi personaggi con nomi e rarità.
**Verifica:** scansiono un QR di test dal telefono → l'uovo si schiude → il personaggio è in collezione.

### Sessione 8 — Contagio e regali
```
Milestone 8. Contagio: due giocatori mostrano/scansionano il QR del profilo, entrambi
confermano entro 30 secondi, nasce un uovo secondo le regole di rarità; leggendari
propagati solo così, con albero di diffusione. Regalo: QR uovo d'invito.
Pagina "mappa di diffusione" anonimizzata.
```
**Verifica:** con due account su due telefoni nasce un uovo; il leggendario #1 passa a #2 e l'albero lo mostra.

### Sessione 9 — Admin
```
Milestone 9. apps/admin: creazione drop (personaggio, rarità, max catture, zona,
scadenza), esportazione PDF di adesivi QR stampabili, gestione partner con QR rotante
a tempo da mostrare al banco, statistiche (catture, giocatori attivi, fattore di
diffusione per giocatore).
```
**Verifica:** creo un drop, stampo il PDF, lo scansiono, vedo la cattura nelle statistiche.

---

## Fase C — Test sul campo

### Sessione 10 — Preparazione pilota
```
Milestone 10. Prepara il pilota di Roma: 20 drop, 3 partner, 1 leggendario a copia
unica. Aggiungi la dashboard del pilota (catture al giorno, ritenzione a 1/7 giorni,
fattore di diffusione) e una checklist operativa in docs/PILOTA.md.
```
**Input:** nomi dei partner, zone dei drop, adesivi stampati.

Dalla sessione 11 in poi: `Milestone N del README.`
