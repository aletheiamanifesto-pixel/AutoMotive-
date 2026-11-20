# Avanzamento

## Milestone 1 — Monorepo + engine + display `screen` e `pane45` ✅

**Verifica:** `npm install && npm test && npm run holo -- --character test-blob --display pane45`
→ il blob respira su fondo nero, specchiato per la teca.

### Fatto
- Monorepo con npm workspaces (`apps/*`, `packages/*`), TypeScript strict, Vitest, ESLint, Prettier.
- `packages/engine`
  - display adapter `screen` e `pane45`: fondo nero puro per entrambi, `pane45` specchiato;
  - renderer Three.js in due passaggi (scena → texture → schermo): lo specchiamento è nell'immagine;
  - personaggio procedurale `test-blob`: sfera deformata deterministica (3.380 triangoli) con respiro squash & stretch a volume costante.
- `apps/holo`: runtime Vite che legge personaggio e display dall'indirizzo (`?character=…&display=…`).
- `scripts/holo.mjs`: comando `npm run holo -- --character <id> --display <nome>` con controllo dei parametri e messaggi d'errore chiari.
- `characters/test-blob`: manifest + LICENSE, nessun asset esterno.
- 22 test: display, specchiamento UV, geometria e respiro del blob, parametri del comando, coerenza dei manifest.
- Verificato nel browser headless: angoli dell'immagine `rgb(0,0,0)`, illuminazione invertita tra `screen` e `pane45` (specchiamento corretto), errore leggibile per un personaggio inesistente.

### Aggiunte dopo la milestone 1
- `npm run holo -- … --telefono`: il runtime è raggiungibile dagli altri dispositivi sullo stesso Wi-Fi e il terminale mostra un QR code da inquadrare (dipendenza `qrcode-terminal`, 96 kB).
- Il QR code punta all'indirizzo del Wi-Fi vero, non alle schede virtuali di Hyper-V/WSL, VirtualBox o Docker (`scripts/lan.mjs`).
- Inquadratura automatica (`fitCameraDistance`): la telecamera si allontana quanto serve perché il personaggio entri sia in altezza sia in larghezza. Prima, su un telefono in verticale, il blob usciva dai lati.

### Decisioni
- **TypeScript 6.0**, non 7: `typescript-eslint` non supporta ancora la 7.
- **Specchiamento nel renderer**, non via CSS: resterà valido quando l'immagine verrà catturata per altre uscite (ventola, video).
- **Nessun tone mapping** sul passaggio finale: il nero deve restare `#000000`.
- **Pixel ratio massimo 2 e nessun post-processing**: il PC di sviluppo ha grafica integrata.
- I pacchetti espongono direttamente i sorgenti TypeScript (nessuna build intermedia): Vite e Vitest li compilano al volo.
- I file `.md` sono esclusi da Prettier, per non riformattare la documentazione scritta a mano.

### Manca / prossimi passi
- Milestone 2: `packages/pack-schema`, `packages/actions`, `apps/playground`, caricamento dei modelli `.glb` (serve il primo personaggio con scheletro e animazioni + suoni).
- Il bundle di `apps/holo` pesa ~500 kB (Three.js): da dividere quando si aggiungono loader ed effetti.
- Playwright non ancora configurato: per CLAUDE.md serve solo ai flussi della PWA (milestone 7).

## Progetto della lampada 📝

Decisioni sul prodotto fisico in [LAMPADA.md](LAMPADA.md).

- **MVP: Cubo 18** (18 cm di lato) a **lastra singola** (`pane45`) con **segui-testa** e teca nera con pannello fumé. Obiettivo: sostituire la statuina da collezione sulla mensola, con un personaggio **alto almeno 8 cm**.
- La piramide a 4 facce resta come inserto alternativo: nel Cubo 18 il personaggio sarebbe di circa 5 cm, sotto il requisito.
- Percorsi futuri: light-field (vero 3D per più persone) e volumetrico (esperimento con un cubo LED 8×8×8).
- Esperimento 0: luce e occhi su ESP32-S3 con schermo rotondo, collegati a Claude; corpo della lampada Aukey LT-T6.
- Decisioni aperte: §12 di LAMPADA.md.
