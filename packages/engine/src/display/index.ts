/**
 * Display adapter: descrivono COME il personaggio viene mostrato su un certo hardware.
 * Il renderer li legge e si configura di conseguenza; non contengono codice di disegno.
 */

/** Il nero puro è "trasparente" su lastra, piramide e ventola: niente grigi di fondo. */
export const PURE_BLACK = 0x000000;

export type DisplayAdapter = {
  readonly name: DisplayName;
  readonly description: string;
  /** Colore di sfondo (sempre nero puro: regola comune a tutte le uscite olografiche). */
  readonly background: number;
  /** Specchia l'immagine in orizzontale: la lastra a 45° riflette e la ribalta. */
  readonly mirrorX: boolean;
};

export const DISPLAY_NAMES = ["screen", "pane45"] as const;
export type DisplayName = (typeof DISPLAY_NAMES)[number];

const ADAPTERS: Record<DisplayName, DisplayAdapter> = {
  screen: {
    name: "screen",
    description: "Monitor normale, per lo sviluppo",
    background: PURE_BLACK,
    mirrorX: false,
  },
  pane45: {
    name: "pane45",
    description: "Teca con lastra a 45° sopra uno schermo: immagine specchiata",
    background: PURE_BLACK,
    mirrorX: true,
  },
};

export function isDisplayName(name: string): name is DisplayName {
  return (DISPLAY_NAMES as readonly string[]).includes(name);
}

export function getDisplayAdapter(name: string): DisplayAdapter {
  if (!isDisplayName(name)) {
    throw new Error(`Display "${name}" sconosciuto. Valori validi: ${DISPLAY_NAMES.join(", ")}`);
  }
  return ADAPTERS[name];
}

/**
 * Trasformazione delle coordinate UV per il passaggio finale a schermo.
 * Specchiare = leggere la colonna 1-u invece di u (repeat -1, offset 1).
 */
export function finalPassUv(mirrorX: boolean): { repeatX: number; offsetX: number } {
  return mirrorX ? { repeatX: -1, offsetX: 1 } : { repeatX: 1, offsetX: 0 };
}
