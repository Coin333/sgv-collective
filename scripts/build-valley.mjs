// Builds the data behind the homepage hero: a 128x128 heightmap of the
// San Gabriel Valley and the position of every club on it.
//
//   node scripts/build-valley.mjs
//
// Elevation: AWS Terrain Tiles (Mapzen terrarium encoding), public, no key.
// Geocoding: OpenStreetMap Nominatim, one request per second as its policy asks.
// Outputs: public/valley/height.u16 (raw heights) and src/lib/data/valley.ts.
import { writeFileSync } from "node:fs";
import sharp from "sharp";

const SIZE = 128;
// West, south, east, north. Mt Wilson and the front range sit along the top.
const BBOX = [-118.3, 33.98, -117.7, 34.38];
const ZOOM = 11;

const { clubs } = await import("../src/lib/data/clubs.ts");

// --- Elevation ---------------------------------------------------------
const lon2x = (lon, z) => ((lon + 180) / 360) * 2 ** z;
const lat2y = (lat, z) => {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z;
};

const x0 = Math.floor(lon2x(BBOX[0], ZOOM));
const x1 = Math.floor(lon2x(BBOX[2], ZOOM));
const y0 = Math.floor(lat2y(BBOX[3], ZOOM));
const y1 = Math.floor(lat2y(BBOX[1], ZOOM));

const tiles = new Map();
for (let x = x0; x <= x1; x++) {
  for (let y = y0; y <= y1; y++) {
    const url = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${ZOOM}/${x}/${y}.png`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url} -> ${res.status}`);
    const { data, info } = await sharp(Buffer.from(await res.arrayBuffer()))
      .raw()
      .toBuffer({ resolveWithObject: true });
    tiles.set(`${x}/${y}`, { data, ch: info.channels, w: info.width });
    console.error(`tile ${x}/${y}`);
  }
}

function elevationAt(lon, lat) {
  const fx = lon2x(lon, ZOOM);
  const fy = lat2y(lat, ZOOM);
  const tx = Math.floor(fx);
  const ty = Math.floor(fy);
  const t = tiles.get(`${tx}/${ty}`);
  if (!t) return 0;
  const px = Math.min(t.w - 1, Math.floor((fx - tx) * t.w));
  const py = Math.min(t.w - 1, Math.floor((fy - ty) * t.w));
  const i = (py * t.w + px) * t.ch;
  const [r, g, b] = [t.data[i], t.data[i + 1], t.data[i + 2]];
  return r * 256 + g + b / 256 - 32768;
}

const heights = new Float32Array(SIZE * SIZE);
let min = Infinity;
let max = -Infinity;
for (let j = 0; j < SIZE; j++) {
  // Row 0 is the north edge so the texture reads top-down like a map.
  const lat = BBOX[3] - ((j + 0.5) / SIZE) * (BBOX[3] - BBOX[1]);
  for (let i = 0; i < SIZE; i++) {
    const lon = BBOX[0] + ((i + 0.5) / SIZE) * (BBOX[2] - BBOX[0]);
    const h = Math.max(0, elevationAt(lon, lat));
    heights[j * SIZE + i] = h;
    if (h < min) min = h;
    if (h > max) max = h;
  }
}

// Raw heights, normalized 0..1 as little-endian uint16, row 0 = north.
const u16 = new Uint16Array(SIZE * SIZE);
let sum = 0;
for (let k = 0; k < heights.length; k++) {
  const n = (heights[k] - min) / (max - min);
  sum += n;
  u16[k] = Math.round(n * 65535);
}
writeFileSync("public/valley/height.u16", Buffer.from(u16.buffer));
const meanNorm = sum / heights.length;

// --- Clubs -------------------------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Names Nominatim does not resolve from the club file as written.
const queryOverrides = {
  "crescenta-valley": "Crescenta Valley High School",
  "cs-arts": "California School of the Arts San Gabriel Valley",
  "rio-hondo-prep": "Rio Hondo Preparatory School",
  "flintridge-prep": "Flintridge Preparatory School",
};
async function geocode(q) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "sgvc.cc homepage build (sgvchristianclubs@gmail.com)",
        },
      });
      const json = await res.json();
      await sleep(1100);
      return json[0];
    } catch {
      console.error(`retry ${attempt + 1}: ${q}`);
      await sleep(2000 * (attempt + 1));
    }
  }
  return undefined;
}
const points = [];
for (const c of clubs) {
  const hit =
    (await geocode(
      queryOverrides[c.slug] ?? `${c.school}, ${c.city}, California`,
    )) ?? (await geocode(`${c.school}, California`));
  if (!hit) {
    console.error(`no geocode: ${c.school}`);
    continue;
  }
  const lon = Number(hit.lon);
  const lat = Number(hit.lat);
  const u = (lon - BBOX[0]) / (BBOX[2] - BBOX[0]);
  const v = (BBOX[3] - lat) / (BBOX[3] - BBOX[1]);
  const inside = u >= 0 && u <= 1 && v >= 0 && v <= 1;
  console.error(
    `${inside ? "ok " : "OUT"} ${c.slug} ${lat.toFixed(4)} ${lon.toFixed(4)} ${hit.display_name.split(",")[0]}`,
  );
  points.push({
    slug: c.slug,
    name: c.shortName ?? c.school,
    u: +u.toFixed(4),
    v: +v.toFixed(4),
    lat: +lat.toFixed(5),
    lon: +lon.toFixed(5),
  });
}

const kmWide = (BBOX[2] - BBOX[0]) * 111.32 * Math.cos((34.18 * Math.PI) / 180);
const kmTall = (BBOX[3] - BBOX[1]) * 110.57;

const ts = `// Generated by scripts/build-valley.mjs on ${new Date().toISOString().slice(0, 10)}.
// Elevation from AWS Terrain Tiles (Mapzen terrarium), schools geocoded with
// OpenStreetMap Nominatim. Re-run the script if a club moves or is added.
export const valley = {
  size: ${SIZE},
  bbox: [${BBOX.join(", ")}] as const, // west, south, east, north
  minMeters: ${Math.round(min)},
  maxMeters: ${Math.round(max)},
  kmWide: ${kmWide.toFixed(1)},
  kmTall: ${kmTall.toFixed(1)},
  data: "/valley/height.u16",
  meanNorm: ${meanNorm.toFixed(4)},
};

export type ValleyPoint = {
  slug: string;
  name: string;
  u: number; // 0 west .. 1 east
  v: number; // 0 north .. 1 south
  lat: number;
  lon: number;
};

export const valleyPoints: ValleyPoint[] = ${JSON.stringify(points, null, 2)};
`;
writeFileSync("src/lib/data/valley.ts", ts);
console.error(
  `heights ${Math.round(min)}..${Math.round(max)} m, ${points.length} points`,
);
