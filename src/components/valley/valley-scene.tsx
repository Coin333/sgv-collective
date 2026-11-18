"use client";

// The San Gabriel Valley as a 128x128 mesh. One uniform, uT, scrubs the
// terrain from its real shape (0) to a level plain (1). All displacement
// happens in the vertex shader from precomputed height and slope
// attributes, so scrolling never touches geometry in JavaScript and the
// scene only renders while uT is still moving.

import { useEffect, useRef } from "react";
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";
import { valley, valleyPoints } from "@/lib/data/valley";

export type ValleySceneApi = { setTarget: (t: number) => void };

const WIDTH = 4;
const DEPTH = (WIDTH * valley.kmTall) / valley.kmWide;
const AMP = 0.62; // vertical exaggeration; 2.8 km real over 55 km reads flat otherwise

const vertexShader = /* glsl */ `
  attribute float aHeight;
  attribute vec2 aGrad;
  uniform float uT;
  uniform float uAmp;
  uniform float uLevel;
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    float y = mix(aHeight, uLevel, uT) * uAmp;
    vec3 p = vec3(position.x, y, position.z);
    float k = (1.0 - uT) * uAmp;
    vNormal = normalize(vec3(-aGrad.x * k, 1.0, -aGrad.y * k));
    vPos = p;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform vec3 uDark;
  uniform vec3 uLight;
  uniform vec3 uBg;
  uniform float uHalfW;
  uniform float uHalfD;
  uniform float uT;
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    vec3 L = normalize(vec3(-0.35, 0.9, 0.6));
    float lambert = max(dot(normalize(vNormal), L), 0.0);
    vec3 c = mix(uDark, uLight, lambert);
    // A plain is light. The leveled ground bleaches toward the page.
    c = mix(c, uBg, 0.72 * smoothstep(0.35, 1.0, uT));
    // Fade into the page at the far edge and the sides so it is a place,
    // not a tile.
    float far = smoothstep(-uHalfD, -uHalfD * 0.35, vPos.z);
    float side = smoothstep(uHalfW, uHalfW * 0.72, abs(vPos.x));
    float near = smoothstep(uHalfD, uHalfD * 0.8, vPos.z);
    float a = far * side * near;
    gl_FragColor = vec4(mix(uBg, c, a), 1.0);
  }
`;

const pointVertex = /* glsl */ `
  attribute float aHeight;
  uniform float uT;
  uniform float uAmp;
  uniform float uLevel;
  uniform float uDpr;
  varying float vFade;
  void main() {
    float y = mix(aHeight, uLevel, uT) * uAmp + 0.012;
    vec4 mv = modelViewMatrix * vec4(position.x, y, position.z, 1.0);
    gl_PointSize = (26.0 * uDpr) / -mv.z;
    vFade = smoothstep(1.9, 1.3, abs(position.x));
    gl_Position = projectionMatrix * mv;
  }
`;

const pointFragment = /* glsl */ `
  precision highp float;
  uniform float uT;
  uniform vec3 uDark;
  varying float vFade;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.36, d) * vFade;
    if (a < 0.01) discard;
    vec3 c = mix(vec3(1.0), uDark, smoothstep(0.5, 0.95, uT));
    gl_FragColor = vec4(c, a);
  }
`;

function bilinear(h: Float32Array, size: number, u: number, v: number) {
  const x = Math.min(size - 1.001, Math.max(0, u * (size - 1)));
  const y = Math.min(size - 1.001, Math.max(0, v * (size - 1)));
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const a = h[y0 * size + x0];
  const b = h[y0 * size + x0 + 1];
  const c = h[(y0 + 1) * size + x0];
  const d = h[(y0 + 1) * size + x0 + 1];
  return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy;
}

export default function ValleyScene({
  onApi,
  initial = 0,
  className,
}: {
  onApi: (api: ValleySceneApi | null) => void;
  initial?: number;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;

    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "low-power",
    });
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(new Color("#ffffff"), 1);
    host.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(24, 1, 0.1, 20);
    camera.position.set(0, 3.1, 5.4);
    camera.lookAt(0, 0.62, -0.5);

    const uniforms = {
      uT: { value: initial },
      uAmp: { value: AMP },
      uLevel: { value: valley.meanNorm },
      uDark: { value: new Color("#2a2a2d") },
      uLight: { value: new Color("#c4c4c9") },
      uBg: { value: new Color("#ffffff") },
      uHalfW: { value: WIDTH / 2 },
      uHalfD: { value: DEPTH / 2 },
      uDpr: { value: dpr },
    };

    const terrainMat = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });
    const pointMat = new ShaderMaterial({
      uniforms,
      vertexShader: pointVertex,
      fragmentShader: pointFragment,
      transparent: true,
      depthWrite: false,
    });

    let mesh: Mesh | null = null;
    let points: Points | null = null;
    let current = initial;
    let target = initial;
    let raf = 0;
    let ready = false;

    const size = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const render = () => renderer.render(scene, camera);

    const tick = () => {
      raf = 0;
      if (disposed) return;
      const diff = target - current;
      if (Math.abs(diff) < 0.0008) {
        current = target;
        uniforms.uT.value = current;
        render();
        return;
      }
      current += diff * 0.14;
      uniforms.uT.value = current;
      render();
      raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf && ready) raf = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(() => {
      size();
      if (ready) render();
    });
    ro.observe(host);
    size();

    fetch(valley.data)
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        if (disposed) return;
        const n = valley.size;
        const raw = new Uint16Array(buf);
        const h = new Float32Array(raw.length);
        for (let i = 0; i < raw.length; i++) h[i] = raw[i] / 65535;

        // Terrain: PlaneGeometry rows run top to bottom, same as the data.
        const geo = new PlaneGeometry(WIDTH, DEPTH, n - 1, n - 1);
        geo.rotateX(-Math.PI / 2);
        const dx = WIDTH / (n - 1);
        const dz = DEPTH / (n - 1);
        const grad = new Float32Array(n * n * 2);
        for (let j = 0; j < n; j++) {
          for (let i = 0; i < n; i++) {
            const k = j * n + i;
            const xl = h[j * n + Math.max(0, i - 1)];
            const xr = h[j * n + Math.min(n - 1, i + 1)];
            const zu = h[Math.max(0, j - 1) * n + i];
            const zd = h[Math.min(n - 1, j + 1) * n + i];
            grad[k * 2] = (xr - xl) / (2 * dx);
            grad[k * 2 + 1] = (zd - zu) / (2 * dz);
          }
        }
        geo.setAttribute("aHeight", new Float32BufferAttribute(h, 1));
        geo.setAttribute("aGrad", new Float32BufferAttribute(grad, 2));
        mesh = new Mesh(geo, terrainMat);
        scene.add(mesh);

        // Clubs: one point per school, on the same surface.
        const pg = new BufferGeometry();
        const pos: number[] = [];
        const ph: number[] = [];
        for (const p of valleyPoints) {
          pos.push((p.u - 0.5) * WIDTH, 0, (p.v - 0.5) * DEPTH);
          ph.push(bilinear(h, n, p.u, p.v));
        }
        pg.setAttribute("position", new Float32BufferAttribute(pos, 3));
        pg.setAttribute("aHeight", new Float32BufferAttribute(ph, 1));
        points = new Points(pg, pointMat);
        scene.add(points);

        ready = true;
        render();
        host.dataset.ready = "true";
        onApi({
          setTarget: (t) => {
            target = Math.min(1, Math.max(0, t));
            wake();
          },
        });
      })
      .catch(() => {
        host.dataset.ready = "failed";
      });

    return () => {
      disposed = true;
      onApi(null);
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      mesh?.geometry.dispose();
      points?.geometry.dispose();
      terrainMat.dispose();
      pointMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onApi, initial]);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
