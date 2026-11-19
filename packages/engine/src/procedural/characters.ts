import { Mesh } from "three";
import { breathe, createBlobGeometry } from "./blob.ts";
import { createHoloMaterial, type Character } from "../renderer.ts";

/** Personaggi costruiti interamente dal codice, indicati nel manifest con `"procedural": "<id>"`. */
export const PROCEDURAL_CHARACTERS = {
  "test-blob": createTestBlob,
} as const satisfies Record<string, () => Character>;

export type ProceduralId = keyof typeof PROCEDURAL_CHARACTERS;

export function isProceduralId(id: string): id is ProceduralId {
  return Object.hasOwn(PROCEDURAL_CHARACTERS, id);
}

function createTestBlob(): Character {
  const geometry = createBlobGeometry();
  const material = createHoloMaterial();
  const mesh = new Mesh(geometry, material);

  return {
    object: mesh,
    update(timeS) {
      const pose = breathe(timeS);
      mesh.scale.set(pose.scaleXZ, pose.scaleY, pose.scaleXZ);
      mesh.rotation.y = timeS * 0.25; // lenta rotazione: si vede che è 3D
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
