import * as THREE from "three";
import {
  terrainMaterial,
  treeMaterial,
  waterMaterial,
} from "./valley-cross-materials";

import {
  BAR,
  BEAM,
  RIM,
  TREE_HEIGHT,
  WATER,
  type TerrainData,
} from "./valley-cross-terrain";

const UPRIGHT = (Math.PI / 2) * 0.9;

function smooth(a: number, b: number, v: number) {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function crossShape() {
  // Shape space is (x, -z) so it lands back in XZ after rotateX(-PI/2).
  const { x0: bx0, x1: bx1 } = BEAM;
  const pts: [number, number][] = [
    [bx0, -BEAM.z1],
    [bx1, -BEAM.z1],
    [bx1, -BAR.z1],
    [BAR.x1, -BAR.z1],
    [BAR.x1, -BAR.z0],
    [bx1, -BAR.z0],
    [bx1, -BEAM.z0],
    [bx0, -BEAM.z0],
    [bx0, -BAR.z0],
    [BAR.x0, -BAR.z0],
    [BAR.x0, -BAR.z1],
    [bx0, -BAR.z1],
  ];
  return new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
}

export type ValleyCross = {
  render: (progress: number, time: number) => void;
  dispose: () => void;
};

// Builds the scene from terrain data made in the worker, then compiles every
// shader asynchronously so the first frame does not stall the page.
export async function createValleyCross(
  canvas: HTMLCanvasElement,
  data: TerrainData,
  octaves: number,
): Promise<ValleyCross> {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    // On retina screens the extra pixels already smooth edges, and MSAA at
    // 2x density is the single most expensive thing in the frame.
    antialias: window.devicePixelRatio < 1.5,
    alpha: true,
    powerPreference: "high-performance",
  });
  // Phones pay for every pixel: cap density, shadow size and noise octaves.
  const wide = window.innerWidth >= 1024;
  // The close-up fills the screen with shaded terrain, so it is drawn at a
  // lower density (measured 14ms -> 6ms per frame at 1.5x on a retina Mac).
  // It is all organic texture and the headline is HTML, so nothing visibly
  // softens. Full density returns once the cross pulls back and its edges
  // matter, which is also when the frame gets cheap.
  let cap = Math.min(window.devicePixelRatio, wide ? 2 : 1.5);
  let zoomedOut = false;
  let pixelRatio = Math.min(cap, wide ? 1.5 : 1.25);
  renderer.setPixelRatio(pixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // The sun is parented to the cross, so the shadow map never changes in
  // light space. Draw it once and only refresh the matrices that place it.
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf2f3f5, 2, 10);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 60);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xc9d3bb, 1.1));

  const world = new THREE.Group();
  scene.add(world);

  // The sun rides with the cross so the relief stays lit the same way as it
  // stands up, and the shadow map never has to chase a moving light.
  const sun = new THREE.DirectionalLight(0xfff3e0, 2.4);
  sun.position.set(2.4, 2.6, 1.2);
  sun.castShadow = true;
  sun.shadow.mapSize.setScalar(wide ? 2048 : 1024);
  sun.shadow.camera.left = -2.6;
  sun.shadow.camera.right = 2.6;
  sun.shadow.camera.top = 2.6;
  sun.shadow.camera.bottom = -2.6;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.01;
  world.add(sun, sun.target);

  const terrainGeo = new THREE.BufferGeometry();
  terrainGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(data.positions, 3),
  );
  terrainGeo.setAttribute("normal", new THREE.BufferAttribute(data.normals, 3));
  terrainGeo.setAttribute("color", new THREE.BufferAttribute(data.colors, 3));
  terrainGeo.setIndex(new THREE.BufferAttribute(data.index, 1));
  const terrain = new THREE.Mesh(terrainGeo, terrainMaterial(octaves));
  terrain.castShadow = true;
  terrain.receiveShadow = true;
  world.add(terrain);

  const coneGeo = new THREE.ConeGeometry(0.008, TREE_HEIGHT, 7);
  coneGeo.translate(0, TREE_HEIGHT / 2, 0);
  const trees = new THREE.InstancedMesh(
    coneGeo,
    treeMaterial(TREE_HEIGHT),
    data.treeCount,
  );
  trees.instanceMatrix.array.set(
    data.treeMatrices.subarray(0, data.treeCount * 16),
  );
  trees.instanceColor = new THREE.InstancedBufferAttribute(
    data.treeColors.slice(0, data.treeCount * 3),
    3,
  );
  trees.computeBoundingSphere();
  trees.castShadow = true;
  world.add(trees);

  const shape = crossShape();
  const river = waterMaterial(octaves);
  const water = new THREE.Mesh(
    new THREE.ShapeGeometry(shape).rotateX(-Math.PI / 2),
    river.material,
  );
  water.position.y = WATER;
  // Drawn after the terrain so hidden water pixels fail the depth test before
  // its shader runs. Most of the water plane sits under the hills.
  terrain.renderOrder = 1;
  water.renderOrder = 2;
  water.receiveShadow = true;
  world.add(water);

  const depth = 0.32;
  const bevel = 0.015;
  const plinth = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 3,
    }).rotateX(-Math.PI / 2),
    // Walls only. The flat caps (group 0) would sit inside the terrain and
    // poke up through the river channel, which dips below the rim.
    [
      new THREE.MeshBasicMaterial({ visible: false }),
      new THREE.MeshStandardMaterial({ color: "#efeae0", roughness: 0.8 }),
    ],
  );
  plinth.position.y = RIM - depth - bevel - 0.0005;
  plinth.receiveShadow = true;
  world.add(plinth);

  // Aerial shot inside the crossbar junction, sized so no edge is in frame.
  const startPos = new THREE.Vector3(0, 0.7, -0.5);
  const startTarget = new THREE.Vector3(0, 0.05, -0.75);
  // High overhead: the outline of the cross reads for the first time.
  const midPos = new THREE.Vector3(0.4, 5.2, 0.9);
  const midTarget = new THREE.Vector3(0, 0, -0.45);
  const endPos = new THREE.Vector3();
  const endTarget = new THREE.Vector3();
  const pos = new THREE.Vector3();
  const target = new THREE.Vector3();
  const posCurve = new THREE.CatmullRomCurve3([startPos, midPos, endPos]);
  const targetCurve = new THREE.CatmullRomCurve3([
    startTarget,
    midTarget,
    endTarget,
  ]);

  function frameEnd(aspect: number) {
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    let dist: number;
    if (aspect >= 1) {
      // Cross on the right half, text on the left.
      dist = Math.max(2.5 / tan, 3.6 / (tan * aspect));
      endTarget.set(-dist * tan * aspect * 0.45, 0, 0);
    } else {
      // Cross in the upper half, text below it.
      dist = Math.max(2.4 / tan, 1.75 / (tan * aspect)) * 1.5;
      endTarget.set(0, -dist * tan * 0.5, 0);
    }
    endPos.set(endTarget.x, endTarget.y + 0.25, dist);
    posCurve.updateArcLengths();
    targetCurve.updateArcLengths();
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    frameEnd(camera.aspect);
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const fog = scene.fog as THREE.Fog;

  function setRatio(next: number) {
    if (next === pixelRatio) return;
    pixelRatio = next;
    renderer.setPixelRatio(next);
    resize();
  }

  // Lower the density cap a step at a time if the GPU can't hold ~50fps.
  // It never climbs back, so it can't oscillate.
  let lastFrame = 0;
  let slowFrames = 0;
  function adapt(time: number, t: number) {
    const dt = time - lastFrame;
    lastFrame = time;
    if (dt > 0 && dt < 0.25) {
      slowFrames = dt > 0.02 ? slowFrames + 1 : Math.max(0, slowFrames - 2);
      if (slowFrames > 45 && cap > 1) {
        cap = Math.max(1, cap - 0.25);
        slowFrames = 0;
      }
    }
    // Hysteresis so a scroll hovering near the threshold doesn't flip-flop.
    if (t > 0.32) zoomedOut = true;
    else if (t < 0.24) zoomedOut = false;
    setRatio(zoomedOut ? cap : Math.min(cap, wide ? 1.5 : 1.25));
  }

  function render(progress: number, time: number) {
    const t = smooth(0.1, 0.8, progress);
    adapt(time, t);
    posCurve.getPoint(t, pos);
    targetCurve.getPoint(t, target);

    // A slow drift so the opening shot breathes before anyone scrolls.
    const idle = 1 - smooth(0, 0.15, t);
    pos.x += Math.sin(time * 0.25) * 0.05 * idle;
    pos.z += Math.cos(time * 0.2) * 0.03 * idle;

    world.rotation.x = UPRIGHT * smooth(0.55, 1, t);
    world.rotation.y = Math.sin(time * 0.35) * 0.16 * smooth(0.85, 1, t);

    river.uniforms.uTime.value = time;
    camera.position.copy(pos);
    camera.lookAt(target);

    const dist = pos.distanceTo(target);
    fog.near = dist * 1.2;
    fog.far = dist * 4.5;

    world.updateMatrixWorld();
    sun.shadow.updateMatrices(sun);
    renderer.render(scene, camera);
  }

  function dispose() {
    ro.disconnect();
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        ([] as THREE.Material[])
          .concat(obj.material)
          .forEach((m) => m.dispose());
      }
    });
    renderer.dispose();
  }

  await renderer.compileAsync(scene, camera);
  return { render, dispose };
}
