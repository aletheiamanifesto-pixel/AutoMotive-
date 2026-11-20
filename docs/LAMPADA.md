# La lampada olografica

Documento di progetto: cosa vogliamo costruire, le decisioni prese, quelle ancora aperte e il percorso di prova.

**Legenda:** ✅ deciso · 🟡 proposta da confermare · ❌ scartato

---

## 1. L'idea e l'obiettivo

Un oggetto da mensola, scrivania o comodino "abitato": dentro una piccola teca scura compare il personaggio 3D, che **si muove e reagisce dal vivo**. Ti guarda, risponde alla voce, ai gesti e al tocco, e quando ti sposti lo vedi da un'altra angolazione.

**Obiettivo di prodotto: prendere il posto della statuina da collezione (tipo Funko POP!) sulla mensola.** Per questo:

- il personaggio deve essere visibile ad **almeno 8 cm di altezza**, la scala di una statuina da collezione (un POP standard è alto circa 9–10 cm);
- l'oggetto deve restare compatto, intorno ai **18 cm di lato**, e stare bene esposto;
- rispetto alla statuina ha un vantaggio decisivo: **è vivo**, reagisce e cambia nel tempo.

La parte fondamentale è la **reazione dal vivo**, non l'effetto visivo da solo.

---

## 2. La soluzione MVP: Cubo 18 a lastra singola

**Fantasma di Pepper a lastra singola + "segui-testa" con la webcam + teca scura.** È la combinazione migliore tra effetto, costo e reperibilità dei pezzi (confronto in §5).

```
   davanti (tu 👀)                         dietro
   ←──────────────── 18 cm ────────────────→
   ┌────────────────────────────────┬──────┐ ┐ CAPPELLO ~3 cm
   │ schermo 8" 4:3 rivolto in giù ▼│      │ ┘ ┐
   │                       ╱        │ Pi 5 │   │
   │                     ╱          │ +    │   │
   │     🐉            ╱            │ventola│  │ TECA ~12,5 cm
   │  (≥ 8 cm)       ╱  lastra      │      │   │ interno nero opaco
   │               ╱    a 45°       │ audio│   │ pannello frontale fumé
   │  📷         ╱                  │      │   │
   ├────────────────────────────────┴──────┤ ┐ ┘
   │ ESP32 tocco · LED · alimentazione     │ │ BASE ~2,5 cm
   └───────────────────────────────────────┘ ┘
```

| # | Decisione | Stato | Motivo |
|---|---|---|---|
| D1 | **Schermo in alto, rivolto verso il basso** | ✅ | L'oggetto sta sotto l'altezza degli occhi: con lo schermo in basso lo si vedrebbe acceso guardando dall'alto. In alto è nascosto, la polvere non ci cade sopra. |
| D2 | **Lastra singola a 45°** (display `pane45`) | ✅ | Il personaggio usa tutto lo schermo: a parità di ingombro è **alto il doppio** rispetto alla piramide (~10 cm contro ~5 cm). Si vede da davanti, come una statuina su una mensola. |
| D3 | **Personaggio ≥ 8 cm** | ✅ | Requisito per sostituire la statuina da collezione (§1). Impone uno schermo con **profondità della parte accesa ≥ 10 cm** (§3). |
| D4 | **"Segui-testa"** con la webcam | ✅ | Il motore ridisegna il personaggio dal punto di vista di chi guarda: spostandosi se ne vede il fianco, come un oggetto vero. È l'indizio di 3D più forte ottenibile a costo zero (§5). |
| D5 | **Teca nera opaca + pannello frontale fumé** | ✅ | Nasconde i bordi della lastra e i riflessi della stanza; il fumé migliora il contrasto (§4). |
| D6 | **Cubo da 18 cm** di lato | ✅ | Contiene uno schermo 8" 4:3 con un personaggio fino a ~10 cm; compatto da mensola. |
| D7 | **Mini computer dentro**, nel vano posteriore | ✅ | Il personaggio è disegnato dal vivo e la webcam va analizzata: serve un processore grafico, Wi-Fi e un browser. Dietro la lastra fa anche da parete nera; il calore sale lungo il retro. |
| D8 | Mini computer: **Raspberry Pi 5** (4 GB); piano B Orange Pi 5 | 🟡 | Diffuso e documentato. **Prestazioni da verificare** con personaggio + segui-testa. |
| D9 | Schermo: **8" 4:3 HDMI ad alta luminosità** (OLED se reperibile in questo formato) | 🟡 | Il 4:3 è più "quadrato" e riempie meglio il cubo; la profondità di ~12 cm soddisfa D3. |
| D10 | **ESP32 per tocco e luci** | ✅ | Un microcontrollore non fa grafica 3D: fa da sistema nervoso per i sensori semplici. |
| D11 | **Fotocamera grandangolare sul fronte** | ✅ | Serve sia al segui-testa sia alle reazioni (sguardo, gesti). |

### Alternative e scartati
| Opzione | Stato | Perché |
|---|---|---|
| Piramide a 4 facce (display `pyramid`) | 🟡 come **inserto alternativo** | Si vede da 4 lati ma il personaggio è piccolo (~5 cm nel Cubo 18, sotto il requisito D3). Lo stesso cubo può ospitare un inserto "piramide" intercambiabile, per le demo. |
| Schermo 7" 16:9 | ❌ | Profondità ~8,6 cm → personaggio ~7 cm, sotto il requisito D3. |
| Ventola LED olografica | ❌ | Rumorosa, pale pericolose, immagine piatta e solo frontale, di solito riproduce video preparati. |
| Vecchio telefono come cervello | ❌ per l'MVP | Le fotocamere non vedono l'utente; via Wi-Fi il browser blocca fotocamera e microfono; si scalda e va in standby. |
| Solo un microchip (ESP32) | ❌ | Non sa disegnare in 3D. |
| Volumetrico come MVP | ❌ per l'MVP | Progetto di ricerca lungo; resta come esperimento (§10). |
| Promettere l'effetto "alieno nella stanza illuminata" delle pubblicità | ❌ | Non è realizzabile con queste tecnologie: sarebbe pubblicità ingannevole. |

---

## 3. Misure del Cubo 18

**Regola della lastra singola:** il personaggio può essere alto quanto la **profondità** della parte accesa dello schermo (la dimensione da davanti a dietro), in pratica circa l'80% per lasciare margine ai movimenti. Per ≥ 8 cm servono quindi **≥ 10 cm di profondità**.

| Pezzo | Misura (indicativa, da ricontrollare sullo schermo comprato) |
|---|---|
| Cubo esterno | **18 × 18 × 18 cm** |
| Parte accesa dello schermo 8" 4:3 | circa 16,3 cm (larghezza) × 12,2 cm (profondità) |
| Lastra (plexiglass 1 mm o pellicola semiriflettente) | **16,5 × 17,3 cm** (17,3 = profondità × 1,414), inclinata a 45°: bordo alto **dietro**, sotto il bordo posteriore dello schermo; bordo basso **davanti** |
| Cappello (schermo + LED) | ~3 cm |
| Teca | ~12,5 cm di altezza |
| Base (ESP32, LED, alimentazione) | ~2,5 cm |
| Vano posteriore (Raspberry Pi 5, audio) | ~4,5 cm di profondità, per tutta l'altezza |
| **Personaggio visibile** | **fino a ~10 cm** di altezza e ~14 cm di larghezza |

| Formato | Schermo | Ingombro | Personaggio | Requisito ≥ 8 cm |
|---|---|---|---|---|
| **Lastra singola** ✅ | **8" 4:3** | **cubo 18 cm** | **~10 cm** | ✅ |
| Lastra singola | 10,1" 16:10 | cubo 24 cm | ~11–12 cm | ✅ ma ingombrante |
| Lastra singola | 7" 16:9 | 17 × 13 × 12 cm | ~7 cm | ❌ |
| Piramide (inserto) | 8" 4:3 | cubo 18 cm | ~5 cm | ❌ |

**Stampa 3D:** cappello, telaio con le scanalature per lastra e pannelli, base e vano posteriore in PLA/PETG **nero opaco**; pezzi non più grandi di 18 cm per entrare nelle stampanti comuni; fessure d'aria sul vano del computer; fori per alimentazione e fotocamera. Lastra e pannello fumé **non** si stampano: si tagliano da fogli di plexiglass o pellicola.

---

## 4. Il problema della luce

Un vetro o plexiglass trasparente riflette circa il **4% della luce per superficie**: il personaggio riflesso è debole, mentre la luce della stanza dietro la lastra passa e si somma all'immagine. L'illusione dipende dal rapporto **luce riflessa del personaggio / luce di sfondo**.

| Problema | Effetto | Soluzione |
|---|---|---|
| Riflesso debole (~4%) | personaggio pallido | schermo luminoso e/o **pellicola semiriflettente** (beam splitter, tipo teleprompter), che riflette 5–10 volte di più |
| Sfondo chiaro dietro la lastra | personaggio invisibile | interno **nero opaco** |
| Riflessi della stanza sul vetro | si vede "un vetro" | pannello frontale **fumé**, bordi della lastra nascosti nel telaio |
| Il nero dell'LCD non è nero | rettangolo grigio visibile | schermo **OLED** se reperibile; altrimenti pellicola semiriflettente + fumé |
| Immagine doppia | personaggio sdoppiato | lastra sottile (1 mm) o pellicola su un solo lato |
| Luce della lampada stessa | ologramma "lavato via" | luci LED rivolte verso l'esterno, mai dentro la teca |
| Colori scuri del personaggio | **le parti scure diventano invisibili** | regola di design §7 |

**Perché il fumé funziona.** Con un pannello che lascia passare il 30% della luce, l'immagine del personaggio lo attraversa una volta, mentre i riflessi della stanza sul vetro lo attraversano due volte (entrando e uscendo): il contrasto migliora di circa 3 volte.

**Aiuti software:** bagliore (glow) attorno al personaggio; colori chiari di default; luminosità regolata in base alla luce della stanza, usando la webcam come sensore.

---

## 5. L'effetto 3D: cosa si ottiene e cosa no

Tutti i sistemi a riflessione (lastra, piramide) mostrano **immagini piatte**: la piramide non è "più 3D" della lastra, mostra solo 4 viste piatte. Il cervello percepisce il 3D da diversi indizi:

| Indizio | Lastra singola | Piramide | **Lastra + segui-testa** (MVP) | Light-field |
|---|---|---|---|---|
| Fluttua nello spazio (l'occhio mette a fuoco "dentro" la scatola) | ✅ | ✅ | ✅ | ✅ |
| Ombre, luci, prospettiva | ✅ | ✅ | ✅ | ✅ |
| Ti guarda e reagisce | ✅ | ✅ | ✅ | ✅ |
| Muovendo la testa vedi un altro lato | ❌ | a scatti (4 lati) | ✅ fluido, **1 persona alla volta** | ✅ più persone |
| Ogni occhio vede un'immagine diversa (stereo) | ❌ | ❌ | ❌ | ✅ senza occhiali |

**Segui-testa.** La webcam stima la posizione degli occhi di chi guarda; il motore sposta la telecamera virtuale di conseguenza, molte volte al secondo. Due movimenti si sommano: il personaggio si muove per conto suo (animazioni e reazioni) e il punto di vista cambia quando ti sposti.

**Limiti:** l'effetto pieno è per una persona alla volta (chi è accanto vede il personaggio sospeso, senza cambio di prospettiva); il personaggio resta dentro la teca; avanti/indietro è reso con dimensione e prospettiva, perché l'immagine riflessa sta su un piano.

---

## 6. La reazione dal vivo

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
| ti sposti | ti segue con lo sguardo; il punto di vista cambia | webcam (posizione del viso) |
| saluti | ricambia | webcam (gesto) |
| muovi la mano piano davanti alla teca | fa le fusa ("carezza nell'aria") | webcam (mano aperta e lenta) |
| tocchi l'oggetto | reagisce al tocco | sensore (ESP32) |
| batti le mani | sobbalza | microfono (volume) |
| dici "fuoco!" | mossa speciale | microfono (parola chiave) |
| lo ignori a lungo | sbadiglia, dorme | timer + umore |
| torni dopo ore | fa festa | memoria |

**Dove avviene cosa.** Nell'oggetto, anche senza internet: disegno 3D, segui-testa, riflessi, umore, analisi di immagini e suoni. Le immagini della webcam **non escono mai** dall'oggetto. Su internet: solo l'LLM (riceve eventi testuali, mai immagini) e la collezione.

---

## 7. Regole di design dei personaggi

- **Alto almeno 8 cm in teca** e completamente visibile anche mentre si muove: il motore lo inquadra automaticamente.
- **Colori chiari, saturi, luminosi.** Le parti scure o nere diventano invisibili.
- **Silhouette leggibile** di fronte e di tre quarti (con il segui-testa si vede anche il fianco).
- Restano valide le regole del README: design originale, licenza commerciale, ≤ 50k triangoli.

---

## 8. Componenti del prototipo 🟡

| Pezzo | Scelta | Costo indicativo* |
|---|---|---|
| Lastra | pellicola o vetro semiriflettente (per la prima prova: plexiglass trasparente 1 mm) | 10–30 € |
| Teca | Cubo 18 stampato in 3D, interno nero opaco + pannello frontale fumé | 15–25 € |
| Schermo | 8" 4:3 HDMI ad alta luminosità | 60–90 € |
| Mini computer | Raspberry Pi 5 (4 GB) + ventola + alimentatore USB-C 27 W | ~105 € |
| Fotocamera | Camera Module 3 Wide | 35–45 € |
| Audio | microfono USB + altoparlante con amplificatore | ~20 € |
| Tocco e luci | ESP32-S3 + anello LED | ~15 € |
| **Totale** | | **circa 260–330 €** |

\*Prezzi orientativi per un pezzo singolo, da verificare all'acquisto.

---

## 9. Esperimento 0: la luce collegata a Claude 🟡

Lo stesso ciclo del personaggio in versione minima: **succede qualcosa → l'AI decide → comando preciso → un oggetto fisico reagisce.**

```
Tu scrivi a Claude Code → Claude risponde → hook sul PC → Wi-Fi → ESP32 → 💡 (+ occhi sullo schermo rotondo)
```

- **Versione 1 (hook di Claude Code):** luce soffusa che "respira" mentre Claude lavora; un lampo quando ha finito.
- **Versione 2 (API di Claude):** Claude sceglie colore ed effetto solo tra quelli previsti (`{"luce": "blu", "effetto": "pulsa"}`): il vocabolario di azioni del README in miniatura.

**Scheda scelta:** ESP32-S3 con schermo rotondo IPS da 1,28" (Waveshare ESP32-S3-LCD-1.28). Sullo schermo: due occhi che si muovono, "pensano" mentre Claude elabora, sorridono quando ha finito, dormono a lampada spenta. Preferire la versione **senza** touch (32 piedini disponibili, passo 1,27 mm) a quella touch (6 piedini su connettore SH1.0).

**Corpo della lampada:** Aukey LT-T6 (si comanda solo al tocco, alimentatore esterno a bassa tensione). Modifica proposta: sostituire l'elettronica originale con ESP32 + anello LED **SK6812 RGBW** (bianco caldo vero), collegando la base metallica a sfioramento a un piedino touch dell'ESP32. Da verificare: tensione di uscita dell'alimentatore (se 12 V serve un riduttore a 5 V) e foto dell'interno. Alimentatore da ~6 W: luminosità dei LED da limitare nel firmware.

---

## 10. Percorsi futuri

| Percorso | Cosa | Stato |
|---|---|---|
| **Light-field** | Sostituire la lastra con uno schermo light-field (es. Looking Glass Go, 6", listino 299 $): vero 3D stereo per più persone, senza occhiali. Nel software cambia solo il display adapter. Compatibilità del modello Go con la libreria WebXR/Three.js **da verificare**. | aggiornamento "premium" |
| **Volumetrico** | Punti di luce davvero nello spazio, visibili da ogni lato. Esperimento a basso costo: **cubo LED 8×8×8** pilotato dall'ESP32 (personaggio a "pixel grossi"). Salto di qualità: pannello di LED rotante (meccanica impegnativa). Nel software: adapter `volume` che voxelizza il personaggio. | esperimento parallelo |
| **Piramide** | Inserto intercambiabile nel Cubo 18 per demo a 4 lati. | opzione |

---

## 11. Percorso di prova

Prima si verifica l'effetto spendendo poco, poi si compra.

| Passo | Cosa | Costo | Serve |
|---|---|---|---|
| 1 | **Segui-testa** con il blob in `pane45`, sul PC: prima dritto, poi con un foglio di plexiglass a 45° davanti a monitor o tablet | ~10 € | software + webcam del PC |
| 2 | Esperimento 0: luce e occhi collegati a Claude | ~20–40 € | ESP32 + anello LED |
| 3 | Test di prestazioni sul Raspberry Pi 5: personaggio + segui-testa | ~170 € | Pi 5 + schermo 8" |
| 4 | Stampa e montaggio del Cubo 18 | ~40 € | stampante 3D, plexiglass |
| 5 | Sensi nell'oggetto: fotocamera, microfono, tocco | ~70 € | componenti §8 |

---

## 12. Decisioni aperte

| # | Domanda | Opzioni | Consiglio |
|---|---|---|---|
| A1 | Mini computer | Raspberry Pi 5 / Orange Pi 5 | Pi 5, dopo il test di prestazioni (passo 3) |
| A2 | Schermo esatto | modello 8" 4:3 da scegliere (OLED se esiste) | il più luminoso con profondità della parte accesa ≥ 10 cm |
| A3 | Riconoscimento vocale | sul dispositivo (es. Vosk, solo parole chiave) / Web Speech API di Chrome | **sul dispositivo**: quello di Chrome invia l'audio ai server di Google, in contrasto con la regola "microfono elaborato in locale" di CLAUDE.md |
| A4 | Ordine della roadmap | reazioni e segui-testa con il blob prima del personaggio vero / ordine attuale | reazioni prima |
| A5 | Dove tenere l'esperimento 0 | `firmware/` di questo repo / progetto separato | `firmware/` |
| A6 | Stampante 3D | modello e area di stampa da conoscere | serve per dividere i pezzi del Cubo 18 |
