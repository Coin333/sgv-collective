"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

// ssr:false is only legal from a Client Component, which is why this boundary
// exists at all. Keeps three.js (~170KB gz) off the critical path entirely.
const HeroLens = dynamic(() => import("./hero-lens"), { ssr: false });

/**
 * The hero backdrop: the image, the lens, and the overlays.
 *
 * The governing rule is that the image is NEVER hidden. The lens is strictly
 * additive on top of a hero that is already correct on its own, so if JS is
 * off, WebGL is missing, three.js fails, or the device is touch, the user gets
 * exactly today's hero with no extra markup. Never set opacity:0 on this image.
 */
export function HeroBackdrop() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [enableLens, setEnableLens] = useState(false);

  // Starts false so SSR and the first client render agree.
  useEffect(() => {
    // No cursor means the lens can never open: targetRadius stays 0 and every
    // fragment returns a copy of the image. Shipping three.js to a phone to
    // reproduce a bitmap the browser already has is pure cost.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // three r175 is WebGL2-only (WebGL1 was dropped in r163), so this
    // pre-flight is what keeps the import from firing on unsupported GPUs.
    try {
      const probe = document.createElement("canvas");
      if (!probe.getContext("webgl2")) return;
    } catch {
      return;
    }

    // Wait for the intro to finish before pulling in three.js. These two look
    // independent, but they are not: downloading ~170KB and compiling shaders
    // blocks the main thread for seconds, which starves the curtain's ticker
    // and makes the word cycle fire in one late burst. Measured at ~11s to
    // reveal when the lens mounted during the intro, against a designed 2.85s.
    if (document.documentElement.getAttribute("data-hero-intro") !== "play") {
      // Next frame, not synchronously: keeps the three.js import off
      // hydration's critical frame.
      const id = requestAnimationFrame(() => setEnableLens(true));
      return () => cancelAnimationFrame(id);
    }

    // HeroIntro removes the attribute in its onComplete.
    const observer = new MutationObserver(() => {
      if (document.documentElement.getAttribute("data-hero-intro") !== "play") {
        observer.disconnect();
        setEnableLens(true);
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-hero-intro"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="absolute inset-0">
      <Image
        ref={imgRef}
        src="/images/everything-night-main.jpg"
        alt="Everything Night group photo"
        fill
        priority
        sizes="100vw"
        // The canvas cannot follow a CSS keyframe, so when the lens is live the
        // image parks at slow-drift's 0% keyframe (scale 1.05) and the shader
        // matches with ZOOM 1.05. The swap happens under the curtain, at a
        // moment when slow-drift is already at that exact scale.
        className={`object-cover ${
          enableLens ? "hero-base-still" : "animate-slow-drift"
        }`}
      />
      {enableLens && (
        <HeroLens imgRef={imgRef} onFailure={() => setEnableLens(false)} />
      )}
      {/* Above the canvas: keeps the headline legible and tints the lens
          on-brand rather than letting it read as a raw demo effect.
          pointer-events-none is load-bearing, not decoration: these span the
          full hero, so without it they swallow every click on the CTAs. */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-b from-[var(--color-navy)]/70 via-[var(--color-navy)]/40 to-[var(--color-navy)]/95" />
      <div className="pointer-events-none absolute inset-0 z-30 bg-dot-grid-dark opacity-25" />
    </div>
  );
}
