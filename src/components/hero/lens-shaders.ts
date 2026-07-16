/**
 * Inversion-lens shaders.
 *
 * The camera is vestigial: the vertex shader writes gl_Position directly and
 * bypasses every matrix. It exists only because renderer.render(scene, camera)
 * needs a non-null second argument. Changing its bounds does nothing.
 */
export const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

/**
 * Two deliberate departures from the reference component:
 *
 * 1. Cover math. The reference fits to height (scaling x only). Our hero image
 *    is 2304x1536 (aspect 1.5), so on any 16:9 desktop that samples outside
 *    [0,1] and edge-smears ~9% of each side, and it disagrees with the base
 *    image's object-cover, which crops. We cover in both directions instead,
 *    so the canvas is pixel-identical to the img underneath it.
 *
 * 2. Duotone. The reference returns vec3(1.0 - gray), a neutral B&W negative.
 *    Neutral gray is not in this palette, so the negative is mapped through
 *    navy -> baby blue. To revert: vec3 lens = vec3(1.0 - gray);
 */
export const fragmentShader = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform sampler2D u_texture;
uniform vec2  u_mouse;
uniform float u_time;
uniform vec2  u_resolution;
uniform float u_radius;
uniform float u_speed;
uniform float u_imageAspect;
uniform float u_turbulenceIntensity;

const vec3  NAVY = vec3(0.05098, 0.12157, 0.23922); // #0d1f3d
const vec3  BABY = vec3(0.55686, 0.77255, 0.98431); // #8ec5fb
// Matches .hero-base-still's scale(1.05), which parks slow-drift's 0% keyframe.
const float ZOOM = 1.05;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// 5 octaves, not the reference's 8. Octaves 6-8 carry ~2.7% of amplitude and
// are numerically dead: by octave 8 the dot product reaches ~1.4M and sin() of
// that has no mantissa left in 32-bit float, so they render differently per
// GPU driver. Normalized by accumulated weight so the count stays a free knob.
float turbulence(vec2 p) {
  float t = 0.0;
  float w = 0.5;
  float total = 0.0;
  for (int i = 0; i < 5; i++) {
    t += noise(p) * w;
    total += w;
    p *= 2.0;
    w *= 0.5;
  }
  return t / total;
}

void main() {
  float screenAspect = u_resolution.x / u_resolution.y;

  vec2 s = (screenAspect > u_imageAspect)
    ? vec2(1.0, u_imageAspect / screenAspect)
    : vec2(screenAspect / u_imageAspect, 1.0);
  vec2 texCoord = (vUv - 0.5) * s / ZOOM + 0.5;

  vec4 tex = texture2D(u_texture, texCoord);
  float gray = dot(tex.rgb, vec3(0.299, 0.587, 0.114)); // Rec.601 luma
  vec3 lens = mix(NAVY, BABY, 1.0 - gray);

  // Only x is aspect-scaled, so the distance field is in units of container
  // HEIGHT: u_radius 0.15 means 15% of hero height. The scaling exists purely
  // to keep the blob circular rather than elliptical.
  vec2 cUV = vec2(vUv.x * screenAspect, vUv.y);
  vec2 cM  = vec2(u_mouse.x * screenAspect, u_mouse.y);
  float dist = distance(cUV, cM);

  float jag = dist + (turbulence(vUv * 25.0 + u_time * u_speed) - 0.5) * u_turbulenceIntensity;
  float mask = step(jag, u_radius); // hard edge on purpose

  gl_FragColor = vec4(mix(tex.rgb, lens, mask), 1.0);
}
`;
