import * as THREE from "three";

// World units. The cross lies flat in XZ with the crossbar toward -Z, so a
// +90deg turn about X stands it upright with the crossbar on top.
const BEAM = { x0: -0.5, x1: 0.5, z0: -2, z1: 2 };
const BAR = { x0: -1.5, x1: 1.5, z0: -1.25, z1: -0.25 };
const BAR_Z = (BAR.z0 + BAR.z1) / 2;
const RIM = 0.06;
const WATER = RIM - 0.02;
const UPRIGHT = (Math.PI / 2) * 0.9;

type Box = typeof BEAM;

function inBox(x: number, z: number, b: Box) {
  return x >= b.x0 && x <= b.x1 && z >= b.z0 && z <= b.z1;
}

function insideCross(x: number, z: number) {
  return inBox(x, z, BEAM) || inBox(x, z, BAR);
}

// Distance to the cross outline from inside it, 0 on the edge.
function edgeDist(x: number, z: number) {
  const d = (b: Box) => Math.min(x - b.x0, b.x1 - x, z - b.z0, b.z1 - z);
  return Math.max(d(BEAM), d(BAR));
}

function smooth(a: number, b: number, v: number) {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function noise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function fbm(x: number, y: number) {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < 5; i++) {
    sum += amp * noise(x * freq, y * freq);
    freq *= 2.03;
    amp *= 0.5;
  }
  return sum;
}

// Distance to the river that runs down the beam and along the crossbar.
function riverDist(x: number, z: number) {
  return Math.min(
    Math.abs(x - 0.07 * Math.sin(z * 2.4 + 0.6)),
    Math.abs(z - BAR_Z - 0.05 * Math.sin(x * 2.9)),
  );
}

// Valley floor along the centerlines, ridges toward the walls, and a flat rim
// at the outline so the terrain sits flush on the plinth.
function heightAt(x: number, z: number) {
  const e = edgeDist(x, z);
  const dv = riverDist(x, z);
  const fall = smooth(0, 0.14, e);
  const ridge = Math.pow(smooth(0.05, 0.38, dv), 1.4);
  let h = RIM + ridge * (0.16 + 0.52 * fbm(x * 2.2 + 11, z * 2.2 + 3)) * fall;
  h += 0.012 * fbm(x * 14, z * 14) * fall;
  h -= 0.035 * (1 - smooth(0, 0.035, dv)) * smooth(0.05, 0.2, e);
  return h;
}

function crossShape() {
  // Shape space is (x, -z) so it lands back in XZ after rotateX(-PI/2).
  const pts: [number, number][] = [
    [-0.5, -2],
    [0.5, -2],
    [0.5, 0.25],
    [1.5, 0.25],
    [1.5, 1.25],
    [0.5, 1.25],
    [0.5, 2],
    [-0.5, 2],
    [-0.5, 1.25],
    [-1.5, 1.25],
    [-1.5, 0.25],
    [-0.5, 0.25],
  ];
  return new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
}

function buildTerrain(cellsPerUnit: number) {
  const nx = 3 * cellsPerUnit;
  const nz = 4 * cellsPerUnit;
  const step = 1 / cellsPerUnit;
  const pos = new Float32Array((nx + 1) * (nz + 1) * 3);
  for (let j = 0; j <= nz; j++) {
    const z = BEAM.z0 + j * step;
    for (let i = 0; i <= nx; i++) {
      const x = BAR.x0 + i * step;
      const k = (j * (nx + 1) + i) * 3;
      pos[k] = x;
      pos[k + 1] = insideCross(x, z) ? heightAt(x, z) : RIM;
      pos[k + 2] = z;
    }
  }

  // Cross edges fall on cell boundaries, so keeping only the quads whose
  // center is inside gives an exact outline.
  const index: number[] = [];
  for (let j = 0; j < nz; j++) {
    for (let i = 0; i < nx; i++) {
      const cx = BAR.x0 + (i + 0.5) * step;
      const cz = BEAM.z0 + (j + 0.5) * step;
      if (!insideCross(cx, cz)) continue;
      const a = j * (nx + 1) + i;
      const b = a + 1;
      const c = a + nx + 1;
      const d = c + 1;
      index.push(a, c, b, b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setIndex(index);
  geo.computeVertexNormals();

  const low = new THREE.Color("#3d7a33");
  const mid = new THREE.Color("#5f9a44");
  const high = new THREE.Color("#94ae69");
  const rock = new THREE.Color("#c4c1ad");
  const normals = geo.getAttribute("normal");
  const colors = new Float32Array(pos.length);
  const c = new THREE.Color();
  for (let v = 0; v < pos.length / 3; v++) {
    const x = pos[v * 3];
    const z = pos[v * 3 + 2];
    const t = (pos[v * 3 + 1] - RIM) / 0.55 + (fbm(x * 9, z * 9) - 0.5) * 0.18;
    if (t < 0.3) c.copy(low).lerp(mid, smooth(0, 0.3, t));
    else if (t < 0.65) c.copy(mid).lerp(high, smooth(0.3, 0.65, t));
    else c.copy(high).lerp(rock, smooth(0.65, 1, t));
    c.lerp(rock, smooth(0.35, 0.6, 1 - normals.getY(v)) * 0.6);
    colors[v * 3] = c.r;
    colors[v * 3 + 1] = c.g;
    colors[v * 3 + 2] = c.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

function buildTrees(count: number) {
  let seed = 7;
  const rand = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const geo = new THREE.ConeGeometry(0.008, 0.026, 6);
  geo.translate(0, 0.013, 0);
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.9 });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  const base = new THREE.Color("#2c5a27");
  const tint = new THREE.Color();

  let placed = 0;
  for (let tries = 0; placed < count && tries < count * 30; tries++) {
    const x = BAR.x0 + rand() * 3;
    const z = BEAM.z0 + rand() * 4;
    if (!insideCross(x, z) || edgeDist(x, z) < 0.05) continue;
    const h = heightAt(x, z);
    const rel = h - RIM;
    if (rel < 0.01 || rel > 0.34 || riverDist(x, z) < 0.05) continue;
    // Thin out the forest as it climbs.
    if (rand() < rel * 3) continue;
    const k = 0.7 + rand() * 0.7;
    p.set(x, h - 0.004, z);
    s.set(k, k * (0.9 + rand() * 0.5), k);
    m.compose(p, q, s);
    mesh.setMatrixAt(placed, m);
    tint.copy(base).offsetHSL(0, 0, (rand() - 0.5) * 0.08);
    mesh.setColorAt(placed, tint);
    placed++;
  }
  mesh.count = placed;
  return mesh;
}

export type ValleyCross = {
  render: (progress: number, time: number) => void;
  dispose: () => void;
};

export function createValleyCross(canvas: HTMLCanvasElement): ValleyCross {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -2.6;
  sun.shadow.camera.right = 2.6;
  sun.shadow.camera.top = 2.6;
  sun.shadow.camera.bottom = -2.6;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.01;
  world.add(sun, sun.target);

  const wide = window.innerWidth >= 1024;
  const terrain = new THREE.Mesh(
    buildTerrain(wide ? 80 : 64),
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92 }),
  );
  terrain.castShadow = true;
  terrain.receiveShadow = true;
  world.add(terrain);

  const trees = buildTrees(wide ? 4200 : 2600);
  trees.castShadow = true;
  world.add(trees);

  const shape = crossShape();
  const water = new THREE.Mesh(
    new THREE.ShapeGeometry(shape).rotateX(-Math.PI / 2),
    // Lambert on purpose: any specular washes the river out to a grey stripe.
    new THREE.MeshLambertMaterial({ color: "#2a6f9e" }),
  );
  water.position.y = WATER;
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

  function render(progress: number, time: number) {
    const t = smooth(0.1, 0.8, progress);
    posCurve.getPoint(t, pos);
    targetCurve.getPoint(t, target);

    // A slow drift so the opening shot breathes before anyone scrolls.
    const idle = 1 - smooth(0, 0.15, t);
    pos.x += Math.sin(time * 0.25) * 0.05 * idle;
    pos.z += Math.cos(time * 0.2) * 0.03 * idle;

    world.rotation.x = UPRIGHT * smooth(0.55, 1, t);
    world.rotation.y = Math.sin(time * 0.35) * 0.16 * smooth(0.85, 1, t);

    camera.position.copy(pos);
    camera.lookAt(target);

    const dist = pos.distanceTo(target);
    fog.near = dist * 1.2;
    fog.far = dist * 4.5;

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

  return { render, dispose };
}
