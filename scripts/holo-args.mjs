// @ts-check
/**
 * Lettura dei parametri di `npm run holo -- --character <id> --display <nome>`.
 * Funzione pura, testata in tests/holo-args.test.ts.
 */

/** Deve coincidere con DISPLAY_NAMES in packages/engine (verificato da un test). */
export const DISPLAYS = /** @type {const} */ (["screen", "pane45"]);

export const HELP = `Uso: npm run holo -- --character <id> --display <${DISPLAYS.join("|")}>

  --character  cartella in characters/ (predefinito: test-blob)
  --display    tipo di uscita (predefinito: screen)
  --no-open    non aprire il browser automaticamente`;

/**
 * @param {string[]} argv argomenti dopo "--"
 * @param {string[]} availableCharacters cartelle presenti in characters/ con un manifest.json
 * @returns {{ character: string, display: string, open: boolean } | { help: true }}
 */
export function parseHoloArgs(argv, availableCharacters) {
  let character = "test-blob";
  let display = "screen";
  let open = true;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    /** @param {string} name */
    const value = (name) => {
      const next = argv[++i];
      if (next === undefined || next.startsWith("--")) throw new Error(`Manca il valore dopo ${name}`);
      return next;
    };
    if (arg === "--help" || arg === "-h") return { help: true };
    else if (arg === "--character") character = value(arg);
    else if (arg?.startsWith("--character=")) character = arg.slice("--character=".length);
    else if (arg === "--display") display = value(arg);
    else if (arg?.startsWith("--display=")) display = arg.slice("--display=".length);
    else if (arg === "--no-open") open = false;
    else throw new Error(`Parametro sconosciuto: ${arg}\n\n${HELP}`);
  }

  if (!availableCharacters.includes(character)) {
    throw new Error(
      `Personaggio "${character}" non trovato in characters/. Disponibili: ${availableCharacters.join(", ") || "nessuno"}`,
    );
  }
  if (!(/** @type {readonly string[]} */ (DISPLAYS).includes(display))) {
    throw new Error(`Display "${display}" sconosciuto. Valori validi: ${DISPLAYS.join(", ")}`);
  }
  return { character, display, open };
}
