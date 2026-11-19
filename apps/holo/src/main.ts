import {
  PROCEDURAL_CHARACTERS,
  createHoloRenderer,
  getDisplayAdapter,
  isProceduralId,
  type Character,
} from "@automotive/engine";

/**
 * Runtime olografico. Legge dall'indirizzo quale personaggio e quale display usare:
 *   /?character=test-blob&display=pane45
 * (lo script `npm run holo` costruisce questo indirizzo dai parametri da riga di comando).
 */

type Manifest = { id: string; name: string; procedural?: string };

// Tutti i manifest in characters/*/ vengono inclusi al momento della build.
const manifests = import.meta.glob<Manifest>("../../../characters/*/manifest.json", {
  eager: true,
  import: "default",
});

function findManifest(id: string): Manifest | undefined {
  return Object.values(manifests).find((m) => m.id === id);
}

function loadCharacter(id: string): Character {
  const manifest = findManifest(id);
  if (!manifest) {
    const known = Object.values(manifests).map((m) => m.id);
    throw new Error(`Personaggio "${id}" non trovato in characters/. Disponibili: ${known.join(", ")}`);
  }
  if (manifest.procedural && isProceduralId(manifest.procedural)) {
    return PROCEDURAL_CHARACTERS[manifest.procedural]();
  }
  throw new Error(`"${id}" non è procedurale: il caricamento dei modelli .glb arriva nella milestone 2.`);
}

function showError(message: string): void {
  const box = document.getElementById("error");
  if (box) {
    box.textContent = message;
    box.style.display = "grid";
  }
  console.error(message);
}

try {
  const params = new URLSearchParams(window.location.search);
  const display = getDisplayAdapter(params.get("display") ?? "screen");
  const character = loadCharacter(params.get("character") ?? "test-blob");
  const canvas = document.getElementById("holo");
  if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Canvas #holo mancante");

  document.title = `AutoMotive · ${character.object.name || params.get("character")} · ${display.name}`;
  createHoloRenderer({ canvas, display, character }).start();
} catch (error) {
  showError(error instanceof Error ? error.message : String(error));
}
