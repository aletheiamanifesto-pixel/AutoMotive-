# AutoMotive

> **Auto-Motive: personaggi che si muovono da soli.**
> Scegli un'immagine qualsiasi, lei diventa un personaggio 3D olografico che vive sulla tua scrivania, ti riconosce e reagisce a voce, gesti e carezze.

---

## Visione

Una piattaforma, non un singolo personaggio.

1. L'utente sceglie o carica un'**immagine** (un drago, un gatto, un robot, un mostriciattolo, il proprio cane, un oggetto).
2. La pipeline la trasforma in un **personaggio 3D animabile** (Character Pack).
3. Il personaggio appare in **ologramma** (teca a 45°, piramide, ventola LED, display light-field).
4. Un **cervello AI** gli dà personalità, umore e memoria: risponde alla voce, segue con lo sguardo, reagisce alle carezze, fa le sue "mosse speciali".

Il software è **indipendente dal personaggio**: il drago è solo il primo esempio. Ogni personaggio è un pacchetto di dati che il motore sa far vivere senza modificare il codice.

5. I personaggi sono **collezionabili**: si trovano nel mondo reale (QR/NFC sparsi in città, luoghi partner, bustine a sorpresa, eventi) e si diffondono **per contagio** quando i giocatori si incontrano. Più un personaggio è raro, più è difficile da trovare: alcuni leggendari nascono in **una sola copia** e si diffondono a macchia d'olio.

> **In sintesi:** caccia nel mondo reale (stile Pokémon GO) + collezione e rarità + un personaggio che poi **vive a casa tua in ologramma**.

---

## Come funziona

```
 Immagine / testo
       │
       ▼
┌────────────────────┐   ┌──────────────────────────────────────────────┐
│  Pipeline Creator  │──▶│              Character Pack                  │
│  image→3D, rig,    │   │ modello .glb · animazioni · manifest.json    │
│  analisi AI        │   │ personalità · suoni · effetti                │
└────────────────────┘   └──────────────────────┬───────────────────────┘
                                                │
                                                ▼
┌────────────┐   ┌──────────────┐   ┌───────────────────┐   ┌──────────────┐
│   Sensi    │──▶│   Cervello   │──▶│  Motore azioni    │──▶│  Renderer    │
│ voce, mano,│   │ bisogni +    │   │ azione canonica → │   │ Three.js →   │
│ touch, viso│   │ stati + LLM  │   │ animazione/proced.│   │ ologramma    │
└────────────┘   └──────────────┘   └───────────────────┘   └──────────────┘
```

### 1. Vocabolario di azioni canoniche
Il cervello non conosce le animazioni di un personaggio specifico: ragiona solo in **azioni canoniche**, uguali per tutti.

| Categoria | Azioni |
|---|---|
| Base | `idle`, `sleep`, `wake_up`, `look_at`, `walk`, `turn` |
| Emozioni | `happy`, `excited`, `angry`, `scared`, `sad`, `curious`, `shy` |
| Interazione | `react_pet`, `react_poke`, `react_call`, `follow_hand`, `eat`, `play` |
| Speciali | `special_1`, `special_2`, `special_3` (es. drago: sputa fuoco; gatto: fusa; robot: scansione laser) |

Ogni Character Pack dichiara **come** esegue ogni azione. Se un'azione non ha un'animazione dedicata, il motore usa un **fallback procedurale**, così ogni personaggio può fare tutto.

### 2. Famiglie di scheletro (rig family)
Ogni immagine viene classificata in una famiglia, che determina scheletro, animazioni condivise e fallback.

| Famiglia | Esempi | Note |
|---|---|---|
| `humanoid` | robot, eroi, persone stilizzate | animazioni condivisibili tra personaggi |
| `quadruped` | cani, gatti, volpi, dinosauri | |
| `winged` | draghi, uccelli, fate | quadrupede/bipede + ali |
| `serpentine` | serpenti, draghi orientali, pesci | movimento a onda procedurale |
| `blob` | slime, mascotte tondeggianti | squash & stretch procedurale |
| `object` | tazze, auto, giocattoli, logo | nessuno scheletro: galleggia, ruota, rimbalza, "respira" |

Le animazioni scritte per una famiglia si **riutilizzano** su tutti i personaggi della stessa famiglia (retargeting), per cui ogni nuovo personaggio costa pochissimo.

### 3. Strati di movimento
Ogni frame combina più strati, per sembrare vivo anche senza animazioni nuove:
1. **Animazione base** (clip dal Pack o dalla libreria di famiglia)
2. **Procedurale**: respiro, sguardo che segue la mano o il viso, coda/ali secondarie, micro-movimenti casuali
3. **Effetti**: particelle (fuoco, scintille, cuori, neve), luci, bloom
4. **Suono**: verso, effetti, musica di stato

### 4. Cervello
- **Bisogni** che cambiano nel tempo: energia, fame, affetto, noia.
- **Macchina a stati / behaviour tree** per le reazioni immediate (sotto i 100 ms: carezza → `react_pet`).
- **LLM** per le decisioni "di carattere": riceve personalità, umore, evento e lista delle azioni disponibili; risponde **solo** in JSON (`{"action": "special_1", "intensity": 0.8, "sound": "roar"}`). Non può inventare azioni che il personaggio non ha.
- **Memoria** locale: nome dell'utente, abitudini, ultimo contatto ("sei tornato!").

### 5. Sensi
| Senso | Tecnologia |
|---|---|
| Mano e gesti (carezza nell'aria, saluto, pugno) | MediaPipe Hands / Gesture Recognizer (webcam) |
| Presenza e posizione del viso | MediaPipe Face Detection, per lo sguardo |
| Voce | Web Speech API o Whisper; parole chiave + intenti via LLM |
| Tocco fisico | ESP32 + sensore capacitivo sulla teca, via WebSerial |

### 6. Uscite olografiche (display adapter)
Lo stesso personaggio, più modi di proiettarlo:
| Adapter | Hardware |
|---|---|
| `pane45` | Teca con lastra a 45° sopra uno schermo (immagine specchiata) — **default** |
| `pyramid` | Piramide a 4 facce (4 viste a croce) |
| `fan` | Ventola LED olografica (uscita video) |
| `lightfield` | Display light-field (più viste) |
| `screen` | Monitor normale, per sviluppo |

Regola comune: **fondo nero puro**, il nero è trasparente.

---

## Character Pack

Ogni personaggio è una cartella autonoma in `characters/<id>/`:

```
characters/dragon-ember/
├── manifest.json      # identità, famiglia, mappa azioni, personalità
├── model.glb          # modello con scheletro (Draco/meshopt)
├── animations/        # clip extra non presenti nel .glb (opzionale)
├── sounds/            # versi ed effetti
├── effects.json       # particelle delle mosse speciali
├── thumbnail.png
└── LICENSE.txt        # origine e licenza di modello e suoni
```

Esempio di `manifest.json`:

```json
{
  "id": "dragon-ember",
  "name": "Ember",
  "rig_family": "winged",
  "scale_cm": 12,
  "personality": {
    "traits": ["curioso", "orgoglioso", "affettuoso con chi lo accarezza"],
    "voice": "versi, nessuna parola",
    "temper": 0.6
  },
  "actions": {
    "idle":      { "clip": "Idle_Breath" },
    "sleep":     { "clip": "Sleep_Curl" },
    "react_pet": { "clip": "Happy_Purr", "sound": "purr", "effect": "hearts_small" },
    "angry":     { "clip": "Roar", "sound": "roar" },
    "special_1": { "label": "Sputa fuoco", "clip": "Fire_Breath", "effect": "fire_cone", "sound": "fire" },
    "walk":      { "procedural": "family_default" }
  },
  "triggers": {
    "special_1": ["voce:fuoco", "gesto:pugno_aperto", "umore:arrabbiato>0.8"]
  },
  "license": { "source": "Meshy", "commercial_use": true, "original_design": true }
}
```

---

## Pipeline Creator (immagine → Character Pack)

1. **Analisi** — un modello vision classifica l'immagine: famiglia di scheletro, nome suggerito, tratti di personalità, idee per le mosse speciali.
2. **3D** — generazione image-to-3D (Meshy / Tripo / Hunyuan3D via API), con texture.
3. **Pulizia** — Blender headless: scala, orientamento, decimazione (≤ 50k triangoli per i dispositivi deboli), compressione.
4. **Rig** — auto-rig per la famiglia (umanoide, quadrupede…); per `object` e `blob` nessun rig.
5. **Animazioni** — libreria della famiglia + eventuali clip generate; mappatura sulle azioni canoniche.
6. **Pack** — generazione di `manifest.json`, suoni scelti dalla libreria, effetti, thumbnail.
7. **Revisione** — anteprima nel Playground prima della pubblicazione.

---

## Collezione e diffusione

### Il ciclo di gioco
**Trovi → catturi (l'uovo si schiude) → porta a casa (ologramma) → cresce ed evolve → lo mostri e scambi → altri vogliono trovarlo.**

### Come si ottengono i personaggi

| Canale | Funzionamento |
|---|---|
| **Drop QR/NFC** | Adesivi/cartoline con codice firmato sparsi in città. Ogni drop ha un numero massimo di catture: i primi ottengono la variante rara, gli altri la comune |
| **Luoghi partner** | Bar, negozi, palestre ospitano personaggi esclusivi: si catturano solo sul posto (QR al banco + verifica di posizione). I partner pagano un abbonamento per il traffico in negozio |
| **Bustine fisiche a sorpresa** | Mini figure / carte / portachiavi con QR o NFC univoco: si apre, si scansiona, il personaggio appare |
| **Eventi e stagioni** | Personaggi disponibili solo in una finestra di tempo o in una zona (concerto, festività, quartiere per 48 h) |
| **Contagio** | Due giocatori si incontrano e scansionano a vicenda il QR del profilo: nasce un **uovo** di un personaggio che nessuno dei due ha. È il motore della diffusione |
| **Regalo** | Un giocatore genera un QR "uovo" per far entrare un amico (invito) |

### Rarità

| Livello | Fonte | Note |
|---|---|---|
| Comune | ovunque, drop frequenti | |
| Raro | luoghi partner, eventi | |
| Epico | contagio, evoluzione dopo cure prolungate | |
| Leggendario | **una sola copia iniziale**, si propaga solo per contagio | ogni copia è **numerata** (#1…#N); il possessore della #1 è "l'Originale" |
| Variante cromatica | probabilità bassa su qualsiasi cattura | palette alternativa dello stesso Pack |

### Diffusione a macchia d'olio
- **Albero di contagio**: ogni copia di un leggendario registra da chi è stata trasmessa. Si può vedere la "mappa di diffusione" del personaggio (anonimizzata).
- **Tetto di copie** per personaggio/stagione: la scarsità è reale e verificabile.
- **Evoluzioni** legate alla cura (carezze, interazioni giornaliere) e agli incontri.
- **Classifiche** per quartiere/città e **badge** (Originale, Primo cacciatore, Untore leggendario).
- **Metrica chiave**: fattore di diffusione = nuovi giocatori portati da ogni giocatore (inviti + contagi). Obiettivo > 1.

### Codici e anti-imbroglio
- Ogni QR/NFC contiene un **token firmato** (Ed25519) dal server: `{drop_id, character_id, max_claims, scadenza, firma}`. Un QR modificato non viene accettato.
- Le catture sono **validate lato server**: contatore atomico per drop, una cattura per account per drop, limiti di velocità.
- Luoghi partner: verifica di **posizione** + QR rotante a tempo mostrato al banco (non fotografabile e riutilizzabile da casa).
- Contagio: entrambi i dispositivi firmano lo scambio entro pochi secondi l'uno dall'altro (incontro reale).
- Rilevamento di posizioni falsificate e account multipli.

### Modello di ricavo
1. **Luoghi sponsorizzati** (abbonamento mensile per partner)
2. **Bustine fisiche** a sorpresa
3. **Collaborazioni** con brand ed eventi (personaggi esclusivi)
4. **Teca olografica** con marchio proprio
5. **Oggetti estetici** (accessori, ambienti, pose)

Niente rivendita a soldi veri dentro l'app, niente NFT/crypto.

---

## Struttura del repository

```
AutoMotive/
├── README.md
├── CLAUDE.md                 # regole di lavoro per Claude Code
├── apps/
│   ├── holo/                 # runtime del personaggio (Three.js) — gira sul dispositivo
│   ├── playground/           # ambiente di test: carica un Pack, prova azioni e trigger
│   ├── collect/              # app giocatore (PWA): scansione QR, schiusa uovo, collezione, contagio
│   ├── admin/                # gestione drop, stampa QR, partner, statistiche
│   └── creator/              # interfaccia immagine → Character Pack
├── server/                   # API: catture, rarità, numerazione, contagio, partner (Supabase)
│   ├── migrations/           # schema database
│   └── functions/            # edge function: claim, contagion, sign-drop
├── packages/
│   ├── engine/               # renderer, display adapter, effetti, strati di movimento
│   ├── actions/              # vocabolario canonico, risoluzione azione → clip/procedurale
│   ├── families/             # scheletri, animazioni condivise e fallback per famiglia
│   ├── brain/                # bisogni, macchina a stati, client LLM, memoria
│   ├── senses/               # mano, viso, voce, touch (WebSerial)
│   ├── collection/           # token firmati, rarità, regole di contagio (condiviso client/server)
│   └── pack-schema/          # schema JSON del manifest + validatore
├── pipeline/                 # script Python/Blender per creare i Pack
├── firmware/esp32-touch/     # sensore carezza + LED della base
├── characters/               # Character Pack (uno per cartella)
└── tests/
```

---

## Stack

| Livello | Tecnologia |
|---|---|
| Runtime 3D | Three.js, TypeScript, Vite, postprocessing (bloom), three.quarks (particelle) |
| Sensi | MediaPipe (mano, gesti, viso), Web Speech API / Whisper, WebSerial |
| Cervello | Macchina a stati in TS + LLM via API (risposte JSON validate) |
| App giocatore | PWA (Next.js + Tailwind), scansione QR via fotocamera, Web NFC dove disponibile |
| Backend | Supabase (Postgres, Auth, Edge Functions), firme Ed25519, Row Level Security |
| Pipeline | Python, Blender 4.x headless, API Meshy / Tripo |
| Firmware | ESP32 (Arduino), sensore capacitivo, LED WS2812 |
| Sviluppo | Node.js 20+, Claude Code, GitHub |

**Requisiti minimi di prestazioni:** 60 fps su PC con grafica integrata; modelli ≤ 50k triangoli, texture ≤ 2K.

---

## Avvio rapido (obiettivo milestone 2)

```bash
git clone https://github.com/aletheiamanifesto-pixel/AutoMotive-.git
cd AutoMotive-
npm install
cp .env.example .env          # chiave API del modello AI
npm run playground            # apre il Playground con il personaggio di esempio
npm run holo -- --character dragon-ember --display pane45
```

---

## Roadmap

### Fase A — Il personaggio vive
| # | Milestone | Risultato |
|---|---|---|
| 1 | Monorepo + engine + display adapter `screen` e `pane45` | Un modello .glb su fondo nero, specchiato per la teca |
| 2 | Character Pack + vocabolario azioni + Playground | Il primo personaggio esegue tutte le azioni canoniche |
| 3 | Strati procedurali (respiro, sguardo, fallback per famiglia) | Sembra vivo anche da fermo |
| 4 | Sensi: mano e gesti, voce | Carezza nell'aria → reazione; "fuoco!" → mossa speciale |
| 5 | Cervello: bisogni, stati, LLM, memoria | Personalità e umore |

### Fase B — Il personaggio si colleziona
| # | Milestone | Risultato |
|---|---|---|
| 6 | Backend: schema DB, auth, token firmati, claim atomico | Un QR firmato assegna una copia numerata |
| 7 | App giocatore (PWA): scansione, schiusa uovo, collezione | Il "Pokédex" personale + vista ologramma |
| 8 | Contagio e regali tra giocatori + albero di diffusione | La diffusione a macchia d'olio |
| 9 | Admin: crea drop, stampa QR, partner con QR rotante, statistiche | Gestione dei drop in città |

### Fase C — Test sul campo (Roma)
| # | Milestone | Risultato |
|---|---|---|
| 10 | **Test pilota**: 20 drop QR, 3 bar partner, 1 leggendario a copia unica | Misura di catture, ritenzione, fattore di diffusione |
| 11 | Demo video + lista d'attesa | Materiale per reel, partner e crowdfunding |

### Fase D — Scala
| # | Milestone | Risultato |
|---|---|---|
| 12 | Pipeline Creator (immagine → Pack) | Nuovi personaggi in poche ore |
| 13 | Firmware ESP32 touch + LED | Carezza fisica sulla teca |
| 14 | Bustine fisiche + negozio | Monetizzazione |
| 15 | Hardware dedicato | Teca con marchio proprio |

---

## Regole su contenuti, licenze e sicurezza

- **Niente personaggi protetti** (Disney, Pokémon, anime, marchi): la pipeline accetta immagini dell'utente e design originali; i Pack pubblici richiedono `original_design: true` e licenza commerciale del modello.
- Ogni Pack include `LICENSE.txt` con l'origine di modello, animazioni e suoni.
- **Privacy**: video della webcam elaborato **in locale** (MediaPipe nel browser), mai salvato né inviato; all'LLM arrivano solo eventi testuali ("l'utente ha accarezzato").
- **Minori**: se il pubblico include bambini, nessuna chat libera con l'LLM, solo comportamenti; consenso dei genitori e conformità GDPR prima di qualsiasi lancio.
- Il cervello è progettato come **compagno giocoso**, non come sostituto di relazioni umane.
- **Niente gioco d'azzardo**: nessun acquisto con denaro reale di personaggi digitali casuali (loot box). La casualità a pagamento è solo negli oggetti fisici (bustine), con probabilità sempre pubbliche. Nessun mercato a soldi veri, nessun NFT/crypto.
- **Sicurezza dei luoghi**: i drop si piazzano solo in spazi pubblici sicuri o presso partner consenzienti; mai su strade trafficate, proprietà private, scuole.
- **Posizione**: usata solo al momento della cattura, mai tracciata in continuo; dati di diffusione mostrati solo in forma anonima e aggregata.

---

## Licenza

Da definire.
