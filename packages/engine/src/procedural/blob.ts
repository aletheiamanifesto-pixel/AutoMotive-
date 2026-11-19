import { IcosahedronGeometry, type BufferGeometry } from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";

/**
 * Personaggio di test interamente procedurale: nessun file esterno.
 * Una sfera deformata in modo deterministico (stesso risultato a ogni avvio).
 */

export type BlobOptions = {
  /** Raggio di base in unità di scena. */
  radius?: number;
  /** Suddivisioni dell'icosaedro: triangoli = 20 * (detail + 1)^2. */
  detail?: number;
  /** Intensità della deformazione "a bozzi" (0 = sfera perfetta). */
  lumpiness?: number;
};

export function createBlobGeometry({
  radius = 1,
  detail = 12,
  lumpiness = 0.08,
}: BlobOptions = {}): BufferGeometry {
  // L'icosaedro di Three.js ha vertici duplicati per ogni faccia: uniti, le normali
  // diventano condivise e la superficie appare liscia invece che sfaccettata.
  const geometry = mergeVertices(
    new IcosahedronGeometry(radius, detail).deleteAttribute("normal").deleteAttribute("uv"),
  );
  const pos = geometry.getAttribute("position");

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const len = Math.hypot(x, y, z);
    // Rumore liscio a bassa frequenza: somma di onde, deterministica.
    const n = Math.sin(3 * x + 1.3) * Math.sin(2 * y + 0.7) * Math.sin(2.5 * z + 2.1);
    // Base leggermente schiacciata: il blob "si appoggia".
    const squashY = y < 0 ? 0.85 : 1;
    const r = radius * (1 + lumpiness * n);
    pos.setXYZ(i, (x / len) * r, (y / len) * r * squashY, (z / len) * r);
  }

  pos.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

export function triangleCount(geometry: BufferGeometry): number {
  const index = geometry.getIndex();
  return (index ? index.count : geometry.getAttribute("position").count) / 3;
}

export type BreathPose = {
  /** Scala verticale. */
  scaleY: number;
  /** Scala orizzontale (x e z): compensa la verticale per conservare il volume. */
  scaleXZ: number;
};

export const BREATH_PERIOD_S = 4;
export const BREATH_AMPLITUDE = 0.05;

/**
 * Respiro con squash & stretch: quando si allunga si assottiglia, come un corpo morbido.
 * scaleY * scaleXZ^2 = 1 → volume costante.
 */
export function breathe(timeS: number, period = BREATH_PERIOD_S, amplitude = BREATH_AMPLITUDE): BreathPose {
  const scaleY = 1 + amplitude * Math.sin((2 * Math.PI * timeS) / period);
  return { scaleY, scaleXZ: 1 / Math.sqrt(scaleY) };
}
