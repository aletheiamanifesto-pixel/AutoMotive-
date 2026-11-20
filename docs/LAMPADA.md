# La lampada olografica

Documento di progetto: cosa vogliamo costruire, le decisioni prese, quelle ancora aperte e il percorso di prova.

**Legenda:** ✅ deciso · 🟡 proposta da confermare · ❌ scartato

---

## 1. L'idea

Una lampada da comodino/scrivania "abitata". Di giorno fa luce; quando è attiva, dentro una piccola teca compare il personaggio 3D, visibile da 4 lati, che **reagisce dal vivo**: ti guarda, risponde alla voce, ai gesti e al tocco.

La parte fondamentale del prodotto è la **reazione dal vivo**, non l'effetto visivo in sé: un personaggio che reagisce è ciò che distingue la lampada da una ventola olografica che riproduce video.

---

## 2. Com'è fatta

```
 ┌───────────────────────────────────┐
 │ ☼ anello LED verso il soffitto    │  luce della lampada (non entra nella teca)
 │ mini computer + ventola           │  il calore sale, lontano dalla teca
 │ altoparlante · microfono          │
 │ schermo rivolto verso il basso ▼  │
 ├────────────────╱╲─────────────────┤  la punta della piramide tocca il centro dello schermo
 │              ╱    ╲               │
 │            ╱  🐉    ╲         📷  │  il personaggio appare dentro la piramide
 │          ╱__________╲             │  fotocamera grandangolare sul fronte
 │   pareti in plexiglass fumé       │
 └───────────────────────────────────┘
 ▀▀▀▀▀▀ base: fondo nero, sensore di tocco, alimentazione ▀▀▀▀▀▀
```

| # | Decisione | Stato | Motivo |
|---|---|---|---|
| D1 | **Schermo in alto, rivolto verso il basso** | ✅ | La lampada sta sotto l'altezza degli occhi: con lo schermo in basso lo si vedrebbe acceso guardando dall'alto e l'illusione si romperebbe. In alto è nascosto, la polvere non ci cade sopra e il calore sale lontano dalla teca. |
| D2 | **Piramide a 4 facce con la punta verso lo schermo** (quindi punta in su, base larga in basso) | ✅ | Regola fisica: la punta guarda sempre lo schermo. Le facce a 45° riflettono l'immagine in orizzontale verso chi guarda. |
| D3 | **Mini teca**: pareti in plexiglass fumé, fondo nero opaco | ✅ | Vedi §3: il fumé migliora il contrasto di circa 3 volte e permette la visione da 4 lati senza fondo nero dietro. |
| D4 | **4 viste diverse**, non 4 copie della stessa immagine | ✅ | 4 telecamere virtuali intorno al personaggio (davanti, destra, dietro, sinistra): girando intorno alla lampada si vedono lati diversi. Le viste sono calcolate dal vivo, quindi ogni reazione appare su tutti i lati. |
| D5 | **Mini computer dentro la lampada**, che fa girare lo stesso software web a tutto schermo | ✅ | Il personaggio è disegnato dal vivo (4 viste) e analizza webcam e microfono: serve un processore grafico, Wi-Fi e un browser. |
| D6 | Mini computer: **Raspberry Pi 5** (4 GB); piano B Orange Pi 5 | 🟡 | Diffuso, documentato, fotocamera e audio facili da collegare. **Prestazioni da verificare** con 4 viste + webcam prima di comprare il resto. |
| D7 | **Schermo OLED** (≥ 5,5", luminoso) | 🟡 | Sull'OLED il nero è davvero spento; su un LCD il "nero" si vede come un quadrato grigio nella piramide. |
| D8 | **ESP32 solo per tocco e luci LED** | ✅ | Un microcontrollore non può fare grafica 3D: fa da "sistema nervoso" per i sensori semplici, non da cervello. |
| D9 | **Fotocamera grandangolare sul fronte della teca**, rivolta verso la stanza | ✅ | Senza fotocamera niente sguardo né gesti. Le fotocamere di un telefono messo a faccia in giù non vedono l'utente. |

### Scartato
| Opzione | Stato | Perché |
|---|---|---|
| Schermo in basso con piramide sopra (come i video con il telefono) | ❌ per il prodotto (✔ per le prove) | Da in piedi si vede lo schermo acceso; polvere sullo schermo. Resta comodo per le prove con il telefono. |
| Ventola LED olografica | ❌ | Rumorosa, pale pericolose, si vede solo da davanti, di solito riproduce video preparati e non un personaggio dal vivo. |
| Vecchio telefono come cervello della lampada | ❌ per l'MVP | Le fotocamere non vedono l'utente; via Wi-Fi il browser blocca fotocamera e microfono (indirizzo non sicuro); si scalda e va in standby. |
| Solo un microchip (ESP32) | ❌ | Non sa disegnare in 3D. |
| Promettere l'effetto "alieno nella stanza illuminata" delle pubblicità | ❌ | Non è realizzabile con queste tecnologie: sarebbe pubblicità ingannevole. Tutti questi sistemi sono illusioni ottiche con immagini piatte. |

---

## 3. Il problema della luce

Un vetro o plexiglass trasparente riflette circa il **4% della luce per superficie**: il personaggio riflesso è debole, mentre la luce della stanza dietro la piramide passa e si somma all'immagine. L'illusione dipende dal rapporto **luce riflessa del personaggio / luce di sfondo**.

| Problema | Effetto | Soluzione |
|---|---|---|
| Riflesso debole (~4%) | personaggio pallido | schermo luminoso (≥ 800–1000 nit) e/o **pellicola semiriflettente** (beam splitter), che riflette 5–10 volte di più |
| Sfondo chiaro dietro la piramide | personaggio invisibile | **plexiglass fumé** (vedi sotto) e fondo nero |
| Il nero dell'LCD non è nero | quadrato grigio nella piramide | **schermo OLED** |
| Immagine doppia | personaggio sdoppiato | plexiglass sottile (1 mm) o pellicola su un solo lato |
| Luce della lampada stessa | ologramma "lavato via" | luce rivolta verso il soffitto; si abbassa in modalità ologramma |
| Colori scuri del personaggio | **le parti scure diventano invisibili** (il nero è trasparente) | regola di design §6 |
| Facce di luminosità diversa | 2 lati più deboli | dipende dalla polarizzazione dello schermo: da verificare con una prova |

**Perché il fumé funziona.** Con pareti che lasciano passare il 30% della luce: l'immagine attraversa una parete (arriva il 30%), lo sfondo ne attraversa due (arriva il 9%). Il contrasto migliora di circa 3 volte.

**Aiuti software:** bagliore (glow) attorno al personaggio; colori chiari di default; luminosità regolata in automatico in base alla luce della stanza, usando la webcam come sensore.

---

## 4. Le 4 viste sullo schermo

Le viste stanno a croce intorno al centro, dove poggia la punta della piramide; ognuna è girata verso la faccia che la riflette e specchiata (il vetro la ribalta).

```
              [ vista da dietro ]
 [ da sinistra ]       ·        [ da destra ]
              [ vista da davanti ]
```

- Schermo **in alto** (lampada): testa del personaggio verso il centro, piedi verso l'esterno.
- Schermo **in basso** (prove col telefono): piedi verso il centro, testa verso l'esterno.

Nel software diventa il display adapter `pyramid` con l'opzione di montaggio (schermo sopra/sotto).

**Piramide fatta in casa per le prove con un telefono:** 4 trapezi ritagliati dalla custodia di un CD: lato lungo 6 cm, lato corto 1 cm, altezza 3,5 cm, uniti con lo scotch (facce a circa 45°).

---

## 5. La reazione dal vivo

Il personaggio ripete di continuo il ciclo **sente → decide → agisce**. Il cervello ha tre velocità:

| Livello | Tempo | Esempio | Chi decide |
|---|---|---|---|
| 1. Riflessi | < 0,1 s | ti avvicini → si gira verso di te; batti le mani → sobbalza | regole sul dispositivo |
| 2. Umore | secondi–minuti | accarezzato spesso → più affettuoso; ignorato → si annoia e dorme | bisogni (energia, affetto, noia) sul dispositivo |
| 3. Carattere | 1–3 s, ogni tanto | gli parli → risposta coerente con la personalità | LLM via API |

**Principio:** la sensazione di "vivo" nasce soprattutto dai livelli 1 e 2. L'LLM non gestisce mai le reazioni immediate.

| Tu fai… | Lui… | Senso |
|---|---|---|
| entri nella stanza | si sveglia, ti guarda | webcam (viso) |
| ti sposti | ti segue con lo sguardo | webcam (posizione del viso) |
| saluti | ricambia | webcam (gesto) |
| muovi la mano piano vicino a lui | fa le fusa ("carezza nell'aria") | webcam (mano aperta e lenta) |
| tocchi la lampada | reagisce al tocco | sensore sulla teca (ESP32) |
| batti le mani | sobbalza | microfono (volume) |
| dici "fuoco!" | mossa speciale | microfono (parola chiave) |
| lo ignori a lungo | sbadiglia, dorme | timer + umore |
| torni dopo ore | fa festa | memoria |

**Dove avviene cosa.** Nella lampada, anche senza internet: disegno 3D, riflessi, umore, analisi di immagini e suoni. Le immagini della webcam **non escono mai** dalla lampada. Su internet: solo l'LLM (riceve eventi testuali, mai immagini) e la collezione. Senza Wi-Fi il personaggio continua a vivere e reagire.

**Proposta 🟡 — reazioni prima del personaggio vero.** Costruire subito riflessi e umore con il blob di prova (sguardo, carezza, spavento, sonno, risveglio) più un pannello che mostra cosa "sente". Il personaggio di Meshy, quando arriva, eredita le reazioni. Comporta anticipare parte delle milestone 3–5 nella roadmap.

---

## 6. Regole di design dei personaggi (per la lampada)

- **Colori chiari, saturi, luminosi.** Le parti scure o nere diventano invisibili: un personaggio nero sparisce.
- **Silhouette leggibile** da tutti e 4 i lati.
- **Dimensione** adatta alla piramide: il personaggio deve stare tutto in una vista (l'inquadratura automatica del motore lo garantisce).
- Restano valide le regole del README: design originale, licenza commerciale, ≤ 50k triangoli.

---

## 7. Componenti del prototipo (MVP) 🟡

| Pezzo | Scelta | Costo indicativo* |
|---|---|---|
| Mini computer | Raspberry Pi 5 (4 GB) + dissipatore/ventola + scheda di memoria | 90 € |
| Alimentazione | alimentatore USB-C 27 W | 15 € |
| Schermo | OLED 5,5" HDMI | 70–100 € |
| Fotocamera | Camera Module 3 Wide | 35–45 € |
| Audio | microfono USB + altoparlante con amplificatore | 20 € |
| Piramide e teca | pellicola semiriflettente, plexiglass fumé, telaio stampato in 3D o in legno | 30–50 € |
| Tocco e luci | ESP32-S3 + anello LED WS2812B | 15 € |
| **Totale** | | **circa 280–330 €** |

\*Prezzi orientativi per un pezzo singolo, da verificare all'acquisto. Possibile acquisto in due tappe: prima Pi 5 + schermo (test di prestazioni e luce), poi il resto.

---

## 8. Esperimento 0: la luce collegata a Claude 🟡

Lo stesso ciclo del personaggio in versione minima: **succede qualcosa → l'AI decide → comando preciso → un oggetto fisico reagisce.**

```
Tu scrivi a Claude Code → Claude risponde → hook sul PC → Wi-Fi → ESP32 → 💡
```

- **Versione 1 (hook di Claude Code):** luce soffusa che "respira" mentre Claude lavora; un lampo quando ha finito.
- **Versione 2 (API di Claude):** Claude sceglie colore ed effetto in base al tono della risposta, solo tra quelli previsti (`{"luce": "blu", "effetto": "pulsa"}`): è il vocabolario di azioni del README in miniatura.

**Hardware:** ESP32-S3 DevKitC-1 (ha già un LED colorato a bordo), anello LED WS2812B da 16 LED, 3 cavi dupont femmina-femmina, cavo USB-C dati. Circa 15–20 €. La lampada Aukey disponibile si comanda solo al tocco, quindi non è collegabile.

**Cosa verifica:** il collegamento AI → oggetto fisico (milestone 5), l'ESP32 con le luci della base (milestone 13) e i tempi di risposta dell'LLM.

---

## 9. Percorso di prova

| Passo | Cosa | Serve |
|---|---|---|
| 1 | Display `pyramid` (4 viste, schermo sopra/sotto) + bagliore | software |
| 2 | Prova della luce in casa: telefono + piramide di CD; luce accesa/spenta, fondo bianco/nero, foglio fumé | telefono, custodia CD |
| 3 | Esperimento 0: luce collegata a Claude | ESP32 + anello LED |
| 4 | Test di prestazioni sul Raspberry Pi 5: 4 viste + webcam | Pi 5 + schermo |
| 5 | Prototipo della teca: schermo in alto, piramide, fumé, fondo nero | componenti §7 |
| 6 | Sensi nella lampada: fotocamera, microfono, tocco | componenti §7 |

---

## 10. Decisioni aperte

| # | Domanda | Opzioni | Consiglio |
|---|---|---|---|
| A1 | Mini computer | Raspberry Pi 5 / Orange Pi 5 | Pi 5, dopo il test di prestazioni |
| A2 | Budget del prototipo | ~300 € in una volta / due tappe | da decidere |
| A3 | Riconoscimento vocale | sul dispositivo (es. Vosk, solo parole chiave) / Web Speech API di Chrome | **sul dispositivo**: quello di Chrome invia l'audio ai server di Google, in contrasto con la regola "microfono elaborato in locale" di CLAUDE.md |
| A4 | Ordine della roadmap | reazioni con il blob prima del personaggio vero / ordine attuale | reazioni prima (§5) |
| A5 | Seguire chi gira intorno alla lampada | una fotocamera frontale / più fotocamere o grandangolo | una frontale per l'MVP |
| A6 | Dove tenere l'esperimento 0 | `firmware/` di questo repo / progetto separato | `firmware/` |
