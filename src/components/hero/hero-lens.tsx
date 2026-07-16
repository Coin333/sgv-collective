"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { fragmentShader, vertexShader } from "./lens-shaders";

interface HeroLensProps {
  /** The image element next/image already fetched and decoded. Reused as the texture. */
  imgRef: RefObject<HTMLImageElement | null>;
  onFailure: () => void;
  maskRadius?: number;
  maskSpeed?: number;
  lerpFactor?: number;
  radiusLerpSpeed?: number;
  turbulenceIntensity?: number;
}

export default function HeroLens({
  imgRef,
  onFailure,
  maskRadius = 0.15,
  maskSpeed = 0.75,
  lerpFactor = 0.05,
  radiusLerpSpeed = 0.1,
  turbulenceIntensity = 0.075,
}: HeroLensProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);

  // Live config for the rAF loop, so prop changes never re-register the effect.
  const configRef = useRef({
    maskRadius,
    maskSpeed,
    lerpFactor,
    radiusLerpSpeed,
    turbulenceIntensity,
  });
  useEffect(() => {
    configRef.current = {
      maskRadius,
      maskSpeed,
      lerpFactor,
      radiusLerpSpeed,
      turbulenceIntensity,
    };
  }, [maskRadius, maskSpeed, lerpFactor, radiusLerpSpeed, turbulenceIntensity]);

  const onFailureRef = useRef(onFailure);
  useEffect(() => {
    onFailureRef.current = onFailure;
  }, [onFailure]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    // Guards the async decode below: without this, navigating away during a
    // slow image load still constructs an unreachable, un-disposable renderer.
    let cancelled = false;
    let disposed = false;
    let rafId = 0;
    let resizeRaf = 0;
    let pointerRaf = 0;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.OrthographicCamera | null = null;
    let geometry: THREE.PlaneGeometry | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let texture: THREE.Texture | null = null;
    let io: IntersectionObserver | null = null;
    let ro: ResizeObserver | null = null;

    const targetMouse = new THREE.Vector2(0.5, 0.5);
    const lerpedMouse = new THREE.Vector2(0.5, 0.5);
    let targetRadius = 0;
    let isInView = true;
    // Cached: the reference calls getBoundingClientRect() on every mousemove,
    // forcing a synchronous layout each time.
    let rect = canvas.getBoundingClientRect();
    let lastPointer = { x: -1, y: -1 };

    const dispose = () => {
      if (disposed) return;
      disposed = true;
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      if (pointerRaf) cancelAnimationFrame(pointerRaf);
      io?.disconnect();
      ro?.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      geometry?.dispose();
      material?.dispose();
      texture?.dispose();
      renderer?.dispose();
      // The one everyone omits. This is what actually frees the GPU context;
      // browsers cap live contexts (~16 desktop, ~8 mobile Safari).
      renderer?.forceContextLoss();
      renderer = null;
      scene = null;
      camera = null;
      geometry = null;
      material = null;
      texture = null;
    };

    function onContextLost(e: Event) {
      e.preventDefault();
      if (rafId) cancelAnimationFrame(rafId);
      // Fall back permanently. The identical base image is already underneath,
      // so the lens just stops. No restore attempt.
      setVisible(false);
    }

    const hitTest = (x: number, y: number) => {
      const inside =
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      if (inside) {
        targetMouse.x = (x - rect.left) / rect.width;
        targetMouse.y = 1 - (y - rect.top) / rect.height; // GL origin is bottom-left
        targetRadius = configRef.current.maskRadius;
      } else {
        // Deliberately do NOT update targetMouse here: that is what makes the
        // lens shrink in place instead of chasing the cursor off the hero.
        targetRadius = 0;
      }
    };

    function onPointerMove(e: PointerEvent) {
      lastPointer = { x: e.clientX, y: e.clientY };
      if (pointerRaf) return;
      pointerRaf = requestAnimationFrame(() => {
        pointerRaf = 0;
        hitTest(lastPointer.x, lastPointer.y);
      });
    }

    function onScroll() {
      // Replays the last pointer position: scrolling the hero out from under a
      // stationary cursor must still close the lens, and pointermove never
      // fires in that case.
      if (pointerRaf) return;
      pointerRaf = requestAnimationFrame(() => {
        pointerRaf = 0;
        rect = canvas!.getBoundingClientRect();
        if (lastPointer.x >= 0) hitTest(lastPointer.x, lastPointer.y);
      });
    }

    const init = async () => {
      try {
        // Resolves immediately if already decoded (it is: next/image rendered
        // it with priority). This also guarantees currentSrc is populated.
        await img.decode();
      } catch {
        // decode() rejects on a broken image; nothing to draw.
        if (!cancelled) onFailureRef.current();
        return;
      }
      if (cancelled) return;

      try {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;

        // Load through TextureLoader against the EXACT url next/image already
        // fetched (currentSrc, the optimized /_next/image variant), so this is
        // a browser cache hit and not a second network request.
        //
        // Do NOT hand the live image element to new THREE.Texture(). next/image owns
        // that element and can swap srcset variants under us; three caches the
        // upload dimensions from the first frame and then re-uploads the new,
        // differently-sized bitmap with texSubImage2D, which fails on a real
        // GPU with "GL_INVALID_VALUE: Offset overflows texture dimensions" and
        // leaves a blank texture. A blank texture reads gray=0, which the
        // duotone maps to flat baby blue: an effect with nothing in it.
        const src = img.currentSrc || img.src;
        texture = await new THREE.TextureLoader().loadAsync(src);
        if (cancelled) {
          texture.dispose();
          return;
        }
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        // Do NOT set texture.colorSpace. Default NoColorSpace + a ShaderMaterial
        // with no #include gives a clean sRGB in/out pass-through. Setting
        // SRGBColorSpace decodes to linear and never re-encodes: washed out.
        texture.needsUpdate = true;

        scene = new THREE.Scene();
        camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        geometry = new THREE.PlaneGeometry(2, 2);
        material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: {
            u_texture: { value: texture },
            u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
            u_time: { value: 0 },
            u_resolution: { value: new THREE.Vector2(w, h) },
            u_radius: { value: 0 }, // starts closed
            u_speed: { value: configRef.current.maskSpeed },
            u_imageAspect: {
              value: img.naturalWidth / img.naturalHeight,
            },
            u_turbulenceIntensity: {
              value: configRef.current.turbulenceIntensity,
            },
          },
        });
        scene.add(new THREE.Mesh(geometry, material));

        // antialias:false: MSAA only smooths geometry edges, and the only edge
        // here is the fragment shader's step() mask, which stays aliased anyway.
        renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(w, h, false); // updateStyle=false: CSS owns the size
      } catch {
        dispose();
        onFailureRef.current();
        return;
      }

      rect = canvas.getBoundingClientRect();

      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            isInView = entry.isIntersecting;
            if (!isInView) targetRadius = 0;
          }
        },
        { threshold: 0.1 },
      );
      io.observe(canvas);

      ro = new ResizeObserver(() => {
        if (resizeRaf) return;
        resizeRaf = requestAnimationFrame(() => {
          resizeRaf = 0;
          if (!renderer || !material) return;
          const nw = canvas.clientWidth;
          const nh = canvas.clientHeight;
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          renderer.setSize(nw, nh, false);
          material.uniforms.u_resolution.value.set(nw, nh);
          rect = canvas.getBoundingClientRect();
          // Deliberately does NOT touch the texture. It owns its own decoded
          // bitmap now, and the shader's cover math already adapts to any
          // container size via u_resolution, so a resize needs no re-upload.
          // Re-uploading here is what produced the texSubImage2D overflow.
        });
      });
      ro.observe(canvas);

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      canvas.addEventListener("webglcontextlost", onContextLost);

      const clock = new THREE.Clock();
      let firstRender = true;

      const animate = () => {
        rafId = requestAnimationFrame(animate);
        if (!renderer || !scene || !camera || !material) return;

        const dt = clock.getDelta();
        const cfg = configRef.current;

        // Frame-rate independent: the reference lerps by a fixed factor per
        // frame, so it runs at double speed on a 120Hz display.
        const mouseAlpha = 1 - Math.pow(1 - cfg.lerpFactor, dt * 60);
        const radiusAlpha = 1 - Math.pow(1 - cfg.radiusLerpSpeed, dt * 60);

        lerpedMouse.lerp(targetMouse, mouseAlpha);
        material.uniforms.u_mouse.value.copy(lerpedMouse);
        material.uniforms.u_time.value += dt * 0.6;
        material.uniforms.u_radius.value +=
          (targetRadius - material.uniforms.u_radius.value) * radiusAlpha;

        // Let the radius finish closing before idling, so it never pops shut.
        if (!isInView && material.uniforms.u_radius.value < 0.001) return;

        renderer.render(scene, camera);

        if (firstRender) {
          firstRender = false;
          // Fade in only after a real frame exists. The canvas draws pixels
          // identical to the img beneath it, so this is invisible by design.
          setVisible(true);
        }
      };
      animate();
    };

    void init();
    return dispose;
  }, [imgRef]);

  // pointer-events-none is safe here: cursor tracking uses window-level
  // listeners precisely so the copy above can keep its own clicks.
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-10 block h-full w-full transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
