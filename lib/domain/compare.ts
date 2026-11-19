import type { Vehicle } from "./vehicle";
import { powerToWeight } from "./vehicle";

/**
 * Punteggi ingegneristici 0–100 usati dal radar chart e dal confronto.
 * Ogni asse è normalizzato su una scala fissa (non relativa ai veicoli confrontati),
 * così lo stesso veicolo ha sempre lo stesso punteggio in qualsiasi confronto.
 */

export type ScoreAxis = {
  key: string;
  label: string;
  /** Valore grezzo estratto dal veicolo (null se il dato manca). */
  raw: (v: Vehicle) => number | null;
  /** Range di normalizzazione [peggio, meglio]; se peggio > meglio l'asse è invertito. */
  range: readonly [number, number];
  unit: string;
};

export const SCORE_AXES: readonly ScoreAxis[] = [
  { key: "power", label: "Potenza", raw: (v) => v.powerHp, range: [100, 1500], unit: "CV" },
  { key: "ptw", label: "Potenza/peso", raw: powerToWeight, range: [50, 1000], unit: "CV/t" },
  { key: "accel", label: "Accelerazione", raw: (v) => v.zeroToHundredS, range: [12, 2], unit: "s 0-100" },
  { key: "vmax", label: "Velocità max", raw: (v) => v.topSpeedKmh, range: [150, 420], unit: "km/h" },
  { key: "aero", label: "Efficienza aero", raw: (v) => v.specs.aero.dragCoefficient, range: [0.45, 0.2], unit: "Cx" },
  { key: "torque", label: "Coppia", raw: (v) => v.specs.engine.torqueNm, range: [150, 2000], unit: "Nm" },
] as const;

export function normalize(value: number, [worst, best]: readonly [number, number]): number {
  const t = (value - worst) / (best - worst);
  return Math.round(Math.min(1, Math.max(0, t)) * 100);
}

export type VehicleScore = { key: string; label: string; score: number | null; raw: number | null; unit: string };

export function scoreVehicle(v: Vehicle): VehicleScore[] {
  return SCORE_AXES.map((axis) => {
    const raw = axis.raw(v);
    return {
      key: axis.key,
      label: axis.label,
      unit: axis.unit,
      raw,
      score: raw == null ? null : normalize(raw, axis.range),
    };
  });
}

export type CompareRow = {
  key: string;
  label: string;
  unit: string;
  values: (number | null)[];
  /** Indici dei veicoli migliori su quell'asse (pareggi inclusi). */
  winners: number[];
};

export function compareVehicles(vehicles: Vehicle[]): CompareRow[] {
  const scored = vehicles.map(scoreVehicle);
  return SCORE_AXES.map((axis, i) => {
    const scores = scored.map((s) => s[i].score);
    const best = Math.max(...scores.map((s) => s ?? -1));
    return {
      key: axis.key,
      label: axis.label,
      unit: axis.unit,
      values: scored.map((s) => s[i].raw),
      winners: best < 0 ? [] : scores.flatMap((s, idx) => (s === best ? [idx] : [])),
    };
  });
}
