import * as THREE from "three";

// All surface detail is computed per pixel on the GPU, so there are no image
// textures to download. Octave count is the main cost knob for weaker GPUs.

const NOISE = /* glsl */ `
float vcHash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float vcNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(vcHash(i), vcHash(i + vec2(1.0, 0.0)), u.x),
    mix(vcHash(i + vec2(0.0, 1.0)), vcHash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float vcFbm(vec2 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < VC_OCTAVES; i++) {
    s += a * vcNoise(p);
    p = p * 2.03 + 17.1;
    a *= 0.5;
  }
  return s;
}
`;

function withPos(shader: THREE.WebGLProgramParametersWithUniforms) {
  shader.vertexShader = shader.vertexShader
    .replace(
      "#include <common>",
      "#include <common>\nvarying vec3 vcPos;\nvarying vec3 vcNormal;",
    )
    .replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\nvcPos = position;\nvcNormal = normal;",
    );
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <common>",
    `#include <common>\nvarying vec3 vcPos;\nvarying vec3 vcNormal;\n${NOISE}`,
  );
}

// Grass mottling and dry patches, rock with strata on steep faces, and a fine
// bump that catches the low sun. Detail fades out with distance so it never
// shimmers once the cross is small on screen.
export function terrainMaterial(octaves: number) {
  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.92,
  });
  mat.defines = { VC_OCTAVES: octaves };
  mat.onBeforeCompile = (shader) => {
    withPos(shader);
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <color_fragment>",
        /* glsl */ `#include <color_fragment>
float vcSlope = 1.0 - normalize(vcNormal).y;
float vcMacro = vcFbm(vcPos.xz * 18.0);
float vcMicro = vcNoise(vcPos.xz * 220.0);
float vcFade = 1.0 - smoothstep(1.5, 7.0, length(vViewPosition));
vec3 vcGrass = diffuseColor.rgb * (0.78 + 0.42 * vcMacro);
vcGrass *= mix(1.0, 0.86 + 0.28 * vcMicro, vcFade);
float vcDry = smoothstep(0.55, 0.75, vcFbm(vcPos.xz * 7.0 + 3.0));
vcGrass = mix(vcGrass, vcGrass * vec3(1.12, 1.06, 0.8), vcDry * 0.3);
float vcStrata = 0.5 + 0.5 * sin(vcPos.y * 260.0 + vcMacro * 8.0);
vec3 vcRock = vec3(0.34, 0.31, 0.26) * (0.75 + 0.35 * vcStrata) * (0.85 + 0.3 * vcMicro);
float vcRockMix = smoothstep(0.45, 0.68, vcSlope + (vcMacro - 0.5) * 0.2) * 0.85;
diffuseColor.rgb = mix(vcGrass, vcRock, vcRockMix);`,
      )
      .replace(
        "#include <normal_fragment_maps>",
        /* glsl */ `#include <normal_fragment_maps>
{
  float h = (vcFbm(vcPos.xz * 90.0) * 0.6 + vcNoise(vcPos.xz * 260.0) * 0.4)
    * 0.0025 * (1.0 + vcRockMix) * vcFade;
  vec2 dH = vec2(dFdx(h), dFdy(h));
  vec3 sx = dFdx(-vViewPosition);
  vec3 sy = dFdy(-vViewPosition);
  vec3 r1 = cross(sy, normal);
  vec3 r2 = cross(normal, sx);
  float det = dot(sx, r1) * (gl_FrontFacing ? 1.0 : -1.0);
  normal = normalize(abs(det) * normal - sign(det) * (dH.x * r1 + dH.y * r2));
}`,
      );
  };
  return mat;
}

// Slow drifting light and dark bands with the odd glint. Lambert keeps the
// sun from washing the whole river out to grey.
export function waterMaterial(octaves: number) {
  const uniforms = { uTime: { value: 0 } };
  const mat = new THREE.MeshLambertMaterial({ color: "#2a6f9e" });
  mat.defines = { VC_OCTAVES: octaves };
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    withPos(shader);
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform float uTime;")
      .replace(
        "#include <color_fragment>",
        /* glsl */ `#include <color_fragment>
float vcW = vcFbm(vcPos.xz * 55.0 + vec2(uTime * 0.12, uTime * 0.07));
diffuseColor.rgb *= 0.8 + 0.45 * vcW;
float vcGlint = smoothstep(0.78, 0.92, vcNoise(vcPos.xz * 140.0 + uTime * 0.3));
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.75, 0.88, 0.95), vcGlint * 0.35);`,
      );
  };
  return { material: mat, uniforms };
}

// Darker at the base, lighter at the tip, so each tree reads as a volume.
export function treeMaterial(height: number) {
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.9 });
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vcTreeY;")
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>\nvcTreeY = position.y / ${height.toFixed(4)};`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vcTreeY;")
      .replace(
        "#include <color_fragment>",
        "#include <color_fragment>\ndiffuseColor.rgb *= 0.62 + 0.55 * vcTreeY;",
      );
  };
  return mat;
}
