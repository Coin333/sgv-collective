"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  bulgedPath,
  EXIT_AT,
  flatPath,
  INTRO_TIMING,
  INTRO_WORDS,
} from "./hero-intro-words";

/** Set by the pre-paint gate script in layout.tsx. */
const isIntroPlaying = () =>
  document.documentElement.getAttribute("data-hero-intro") === "play";

/**
 * The intro curtain. Plays once per session on a hard load of "/", then
 * unmounts itself.
 *
 * Whether it plays is decided by the pre-paint script in layout.tsx, which
 * sets data-hero-intro="play" on <html>. CSS keys off that attribute, so this
 * component renders byte-identical markup on server and client and the
 * decision never enters React state on the first render.
 *
 * Deliberately NOT ported from the reference: its DOMContentLoaded bootstrap
 * (that event has already fired by the time an effect runs, so the callback
 * would never execute and the curtain would hang on screen forever), its
 * CSS-level body{overflow:hidden} (app-wide in App Router, would freeze every
 * route), and its style.display="none" teardown (React does not track it and
 * it strands a fixed overlay in the a11y tree).
 */
export function HeroIntro() {
  const curtainRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLParagraphElement>(null);
  const wordTextRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const exitStartedRef = useRef(false);

  // Only `done` is state, and it is only ever set from GSAP's onComplete.
  // Whether to play is read straight off the DOM attribute instead of being
  // mirrored into state: the curtain is CSS-gated to display:none without that
  // attribute, so a skipped intro is already invisible and needs no re-render.
  const [done, setDone] = useState(false);

  // Scroll lock. Held in JS so it can never outlive this component, and
  // released in both onComplete and cleanup so navigating away mid-animation
  // cannot strand a locked page. useLayoutEffect, not useEffect: the latter
  // runs after paint and would leave one scrollable frame.
  useLayoutEffect(() => {
    if (!isIntroPlaying() || done) return;
    const body = document.body;
    // Measure before locking: removing the scrollbar shifts layout ~15px.
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [done]);

  useGSAP(
    () => {
      if (!isIntroPlaying() || done) return;
      const curtain = curtainRef.current;
      const word = wordRef.current;
      const wordText = wordTextRef.current;
      const path = pathRef.current;
      if (!curtain || !word || !wordText || !path) return;

      // GSAP's default lagSmoothing(500, 33) advances its virtual clock by only
      // 33ms for any frame over 500ms, to keep tweens smooth through a stall.
      // That is exactly wrong here: hydration, the three.js dynamic import and
      // shader compile all blow past 500ms, so the intro silently stops
      // tracking wall clock and the first word hangs for 4-14s instead of 0.7s.
      // This intro is a fixed-duration gate on the page, so it must obey real
      // time even if a frame drops. Restored on cleanup: GSAP's ticker is
      // global and this is the only GSAP on the site, but leaving it flipped
      // would silently change behavior for anything added later.
      gsap.ticker.lagSmoothing(0);

      const measure = () => {
        const r = curtain.getBoundingClientRect();
        return { w: r.width, h: r.height };
      };

      let { w, h } = measure();
      path.setAttribute("d", bulgedPath(w, h));

      gsap.to(word, {
        opacity: INTRO_TIMING.wordOpacity,
        duration: INTRO_TIMING.wordFadeDuration,
        delay: INTRO_TIMING.wordFadeDelay,
      });

      // Step through the words. Scoped by useGSAP, so every delayedCall is
      // reverted on unmount and StrictMode's double-invoke cannot double-fire.
      INTRO_WORDS.forEach((text, i) => {
        if (i === 0) return;
        const at = INTRO_TIMING.firstHold + INTRO_TIMING.step * (i - 1);
        gsap.delayedCall(at, () => {
          wordText.textContent = text;
        });
      });

      gsap.delayedCall(EXIT_AT, () => {
        exitStartedRef.current = true;
        // Re-measure: the viewport may have changed during the hold.
        ({ w, h } = measure());

        const tl = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          onComplete: () => {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
            document.documentElement.removeAttribute("data-hero-intro");
            setDone(true);
          },
        });

        tl.to(word, { opacity: 0, duration: INTRO_TIMING.wordOutDuration }, 0);
        tl.to(
          curtain,
          {
            y: -h,
            duration: INTRO_TIMING.liftDuration,
            delay: INTRO_TIMING.liftDelay,
            ease: "power4.inOut",
          },
          0,
        );
        // Flattening the Bezier and clearing the viewport land on the same
        // frame by design: the belly straightens exactly as the curtain exits.
        tl.fromTo(
          path,
          { attr: { d: bulgedPath(w, h) } },
          {
            attr: { d: flatPath(w, h) },
            duration: INTRO_TIMING.flattenDuration,
            delay: INTRO_TIMING.flattenDelay,
            ease: "power4.inOut",
          },
          0,
        );
      });

      let raf = 0;
      const onResize = () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          // Once the exit is running, the tween owns `d`. Writing the initial
          // path here would fight it mid-interpolation.
          if (exitStartedRef.current) return;
          ({ w, h } = measure());
          path.setAttribute("d", bulgedPath(w, h));
        });
      };
      window.addEventListener("resize", onResize);
      return () => {
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        gsap.ticker.lagSmoothing(500, 33); // back to GSAP's default
      };
    },
    { scope: curtainRef, dependencies: [done] },
  );

  if (done) return null;

  return (
    <div ref={curtainRef} className="hero-curtain" aria-hidden="true">
      <p ref={wordRef} className="hero-curtain__word">
        <span className="hero-curtain__dot" />
        <span ref={wordTextRef}>{INTRO_WORDS[0]}</span>
      </p>
      <svg className="hero-curtain__svg">
        <path ref={pathRef} className="hero-curtain__path" />
      </svg>
    </div>
  );
}
