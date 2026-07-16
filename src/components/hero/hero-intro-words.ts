/**
 * Intro curtain words and timing.
 *
 * The original multilingual greeting sequence from the Awwwards Hero
 * Animations 5 component, kept verbatim along with its snappy cadence (first
 * word holds ~1s, then a greeting every 0.15s). Note "やあ" is outside Inter's
 * latin subset, so it falls back to a system font (Hiragino on macOS) for that
 * one word; it renders, just in a slightly different face.
 *
 * No module here may import React or touch the DOM: page.tsx renders
 * INTRO_WORDS[0] on the server, and it has to match the client exactly.
 */
export const INTRO_WORDS = [
  "Hello",
  "Bonjour",
  "Ciao",
  "Olá",
  "やあ",
  "Hallå",
  "Guten tag",
  "Hallo",
] as const;

export const INTRO_TIMING = {
  wordFadeDelay: 0.15,
  wordFadeDuration: 0.6,
  wordOpacity: 0.75,
  /** How long the first word holds before the cycle starts stepping. */
  firstHold: 1.0,
  /** Gap between each subsequent word. */
  step: 0.15,
  /** How long the last word holds before the curtain leaves. */
  lastHold: 0.8,
  wordOutDuration: 0.3,
  liftDuration: 0.7,
  liftDelay: 0.15,
  flattenDuration: 0.6,
  flattenDelay: 0.25,
  /**
   * Control-point offset for the curtain's trailing curve. Only half of this
   * renders as visible bulge: for a quadratic Bezier the curve peaks at half
   * the control offset, so 300 here draws a 150px belly.
   */
  bulge: 300,
} as const;

/** When the last word lands. Derived, so changing the word list stays safe. */
export const CYCLE_END =
  INTRO_TIMING.firstHold + INTRO_TIMING.step * (INTRO_WORDS.length - 2);

/** When the exit timeline is built and starts running. */
export const EXIT_AT = CYCLE_END + INTRO_TIMING.lastHold;

/** When the hero is fully revealed and scroll is released. */
export const REVEAL_AT =
  EXIT_AT +
  Math.max(
    INTRO_TIMING.wordOutDuration,
    INTRO_TIMING.liftDelay + INTRO_TIMING.liftDuration,
    INTRO_TIMING.flattenDelay + INTRO_TIMING.flattenDuration,
  );

/**
 * The curtain: a full-viewport rect whose bottom edge bulges downward on a
 * quadratic Bezier. Flattening the control point from h+bulge to h turns the
 * curve into a straight line, so the shape resolves into a plain rectangle as
 * it lifts.
 *
 * Written in raw viewport pixels on purpose. The SVG has no viewBox, so one
 * user unit is one CSS pixel.
 */
export function curtainPath(w: number, h: number, controlY: number): string {
  return `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${controlY} 0 ${h} L0 0`;
}

export const bulgedPath = (w: number, h: number) =>
  curtainPath(w, h, h + INTRO_TIMING.bulge);

export const flatPath = (w: number, h: number) => curtainPath(w, h, h);
