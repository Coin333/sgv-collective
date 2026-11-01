// Pure terrain and forest generation: plain numbers and typed arrays, no
// three.js and no DOM, so it can run in a worker off the main thread.

// World units. The cross lies flat in XZ with the crossbar toward -Z, so a
// +90deg turn about X stands it upright with the crossbar on top.
export const BEAM = { x0: -0.5, x1: 0.5, z0: -2, z1: 2 };
export const BAR = { x0: -1.5, x1: 1.5, z0: -1.25, z1: -0.25 };
const BAR_Z = (BAR.z0 + BAR.z1) / 2;
export const RIM = 0.06;
export const WATER = RIM - 0.02;
export const TREE_HEIGHT = 0.026;

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

// Linear-space RGB, matching what THREE.Color stores for an sRGB hex.
function linear(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return [f(n >> 16), f((n >> 8) & 255), f(n & 255)];
}

function lerp3(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

export type TerrainData = {
  positions: Float32Array;
  normals: Float32Array;
  colors: Float32Array;
  index: Uint32Array;
  treeMatrices: Float32Array;
  treeColors: Float32Array;
  treeCount: number;
};

export function generateTerrain(
  cellsPerUnit: number,
  treeTarget: number,
): TerrainData {
  const nx = 3 * cellsPerUnit;
  const nz = 4 * cellsPerUnit;
  const step = 1 / cellsPerUnit;
  const verts = (nx + 1) * (nz + 1);
  const positions = new Float32Array(verts * 3);
  const heights = new Float32Array(verts);
  for (let j = 0; j <= nz; j++) {
    const z = BEAM.z0 + j * step;
    for (let i = 0; i <= nx; i++) {
      const x = BAR.x0 + i * step;
      const v = j * (nx + 1) + i;
      const h = insideCross(x, z) ? heightAt(x, z) : RIM;
      heights[v] = h;
      positions[v * 3] = x;
      positions[v * 3 + 1] = h;
      positions[v * 3 + 2] = z;
    }
  }

  // Cross edges fall on cell boundaries, so keeping only the quads whose
  // center is inside gives an exact outline.
  const quads: number[] = [];
  for (let j = 0; j < nz; j++) {
    for (let i = 0; i < nx; i++) {
      if (insideCross(BAR.x0 + (i + 0.5) * step, BEAM.z0 + (j + 0.5) * step)) {
        quads.push(j * (nx + 1) + i);
      }
    }
  }
  const index = new Uint32Array(quads.length * 6);
  quads.forEach((a, q) => {
    const c = a + nx + 1;
    index.set([a, c, a + 1, a + 1, c, c + 1], q * 6);
  });

  const hAt = (i: number, j: number) =>
    heights[
      Math.min(nz, Math.max(0, j)) * (nx + 1) + Math.min(nx, Math.max(0, i))
    ];

  const low = linear("#3d7a33");
  const mid = linear("#5f9a44");
  const high = linear("#7aa253");
  const rock = linear("#a6a88a");
  const normals = new Float32Array(verts * 3);
  const colors = new Float32Array(verts * 3);
  for (let j = 0; j <= nz; j++) {
    for (let i = 0; i <= nx; i++) {
      const v = j * (nx + 1) + i;
      const h = heights[v];

      // Grid normals from central differences.
      const dx = (hAt(i + 1, j) - hAt(i - 1, j)) / (2 * step);
      const dz = (hAt(i, j + 1) - hAt(i, j - 1)) / (2 * step);
      const len = Math.hypot(dx, 1, dz);
      const ny = 1 / len;
      normals[v * 3] = -dx / len;
      normals[v * 3 + 1] = ny;
      normals[v * 3 + 2] = -dz / len;

      // Creases sit below their neighbours, so darken them a little: cheap
      // ambient occlusion from the height grid itself.
      const avg =
        (hAt(i - 4, j) +
          hAt(i + 4, j) +
          hAt(i, j - 4) +
          hAt(i, j + 4) +
          hAt(i - 3, j - 3) +
          hAt(i + 3, j + 3) +
          hAt(i - 3, j + 3) +
          hAt(i + 3, j - 3)) /
        8;
      const ao = 1 - Math.min(0.35, Math.max(0, (avg - h) * 9));

      const x = positions[v * 3];
      const z = positions[v * 3 + 2];
      const t = (h - RIM) / 0.55 + (fbm(x * 9, z * 9) - 0.5) * 0.18;
      let c =
        t < 0.3
          ? lerp3(low, mid, smooth(0, 0.3, t))
          : t < 0.65
            ? lerp3(mid, high, smooth(0.3, 0.65, t))
            : lerp3(high, rock, smooth(0.8, 1.1, t));
      c = lerp3(c, rock, smooth(0.45, 0.7, 1 - ny) * 0.5);
      colors[v * 3] = c[0] * ao;
      colors[v * 3 + 1] = c[1] * ao;
      colors[v * 3 + 2] = c[2] * ao;
    }
  }

  let seed = 7;
  const rand = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
  const base = linear("#2c5a27");
  const treeMatrices = new Float32Array(treeTarget * 16);
  const treeColors = new Float32Array(treeTarget * 3);
  let treeCount = 0;
  for (
    let tries = 0;
    treeCount < treeTarget && tries < treeTarget * 30;
    tries++
  ) {
    const x = BAR.x0 + rand() * 3;
    const z = BEAM.z0 + rand() * 4;
    if (!insideCross(x, z) || edgeDist(x, z) < 0.05) continue;
    const h = heightAt(x, z);
    const rel = h - RIM;
    if (rel < 0.01 || rel > 0.34 || riverDist(x, z) < 0.05) continue;
    // Thin out the forest as it climbs.
    if (rand() < rel * 3) continue;
    const k = 0.7 + rand() * 0.7;
    const ky = k * (0.9 + rand() * 0.5);
    // Column-major scale + translation, no rotation (cones are symmetric).
    treeMatrices.set(
      [k, 0, 0, 0, 0, ky, 0, 0, 0, 0, k, 0, x, h - 0.004, z, 1],
      treeCount * 16,
    );
    const tint = 1 + (rand() - 0.5) * 0.16;
    treeColors.set(
      [base[0] * tint, base[1] * tint, base[2] * tint],
      treeCount * 3,
    );
    treeCount++;
  }

  return {
    positions,
    normals,
    colors,
    index,
    treeMatrices,
    treeColors,
    treeCount,
  };
}
