import {
  Color,
  HemisphereLight,
  DirectionalLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NoToneMapping,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SRGBColorSpace,
  WebGLRenderTarget,
  WebGLRenderer,
  type Object3D,
} from "three";
import { finalPassUv, type DisplayAdapter } from "./display/index.ts";

/**
 * Renderer olografico in due passaggi:
 * 1. la scena viene disegnata in una texture fuori schermo;
 * 2. la texture viene copiata a schermo, specchiata se il display lo richiede.
 * Così lo specchiamento fa parte dell'immagine stessa (valido anche per catture video future).
 */

export type Character = {
  /** Oggetto 3D del personaggio, centrato nell'origine. */
  readonly object: Object3D;
  /** Aggiorna il personaggio: tempo trascorso dall'avvio in secondi. */
  update(timeS: number): void;
  dispose(): void;
};

export type HoloRenderer = {
  start(): void;
  stop(): void;
  dispose(): void;
};

export function createHoloRenderer(options: {
  canvas: HTMLCanvasElement;
  display: DisplayAdapter;
  character: Character;
}): HoloRenderer {
  const { canvas, display, character } = options;

  const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // limite per GPU deboli
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NoToneMapping; // il nero deve restare nero puro
  renderer.setClearColor(display.background, 1);

  // Scena del personaggio
  const scene = new Scene();
  scene.background = new Color(display.background);
  const camera = new PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0.6, 5);
  camera.lookAt(0, 0, 0);
  scene.add(new HemisphereLight(0xbfe9ff, 0x000000, 1.2));
  const key = new DirectionalLight(0xffffff, 2);
  key.position.set(2, 3, 4);
  scene.add(key);
  scene.add(character.object);

  // Passaggio finale: quad a tutto schermo con la texture (eventualmente specchiata)
  const target = new WebGLRenderTarget(1, 1, { samples: 4 }); // MSAA sulla texture
  const uv = finalPassUv(display.mirrorX);
  target.texture.repeat.set(uv.repeatX, 1);
  target.texture.offset.set(uv.offsetX, 0);
  const quadMaterial = new MeshBasicMaterial({ map: target.texture, toneMapped: false });
  const quad = new Mesh(new PlaneGeometry(2, 2), quadMaterial);
  const screenScene = new Scene();
  screenScene.add(quad);
  const screenCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

  function resize(): void {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    const ratio = renderer.getPixelRatio();
    target.setSize(Math.floor(width * ratio), Math.floor(height * ratio));
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  const startTime = performance.now();
  function frame(): void {
    character.update((performance.now() - startTime) / 1000);
    renderer.setRenderTarget(target);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    renderer.render(screenScene, screenCamera);
  }

  return {
    start: () => renderer.setAnimationLoop(frame),
    stop: () => renderer.setAnimationLoop(null),
    dispose: () => {
      renderer.setAnimationLoop(null);
      observer.disconnect();
      character.dispose();
      quad.geometry.dispose();
      quadMaterial.dispose();
      target.dispose();
      renderer.dispose();
    },
  };
}

/** Materiale "olografico" di default per i personaggi procedurali. */
export function createHoloMaterial(color = 0x40d8ff): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.25,
    roughness: 0.35,
    metalness: 0.1,
  });
}
