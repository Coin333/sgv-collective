"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { CTAButton } from "@/components/buttons";
import { cn } from "@/lib/utils";
import type { TerrainData } from "./valley-cross-terrain";

// Scroll windows (0 to 1 across the pinned section) for each text beat. The
// first is already on screen at load; the last stays once it arrives.
const BEATS: [number, number][] = [
  [-1, 0.14],
  [0.24, 0.38],
  [0.42, 0.56],
  [0.6, 0.74],
  [0.8, 2],
];
const FADE = 0.05;

function smooth(a: number, b: number, v: number) {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

const display =
  "font-display font-semibold tracking-[-0.045em] leading-[0.95] text-balance";

export function ValleyCrossHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const lightScrimRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scene: import("./valley-cross-scene").ValleyCross | null = null;
    let cancelled = false;
    let raf = 0;
    let running = false;
    let target = 0;
    let current = 0;
    let last = performance.now();

    function readScroll() {
      const r = section!.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      target = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    }

    const beats = section.querySelectorAll<HTMLElement>("[data-beat]");

    function applyBeats(p: number) {
      beats.forEach((el) => {
        const [a, b] = BEATS[Number(el.dataset.beat)];
        const fin = a < 0 ? 1 : smooth(a, a + FADE, p);
        const fout = 1 - smooth(b - FADE, b, p);
        const o = fin * fout;
        el.style.opacity = String(o);
        el.style.transform = `translate3d(0, ${(1 - fin) * 28 - (1 - fout) * 28}px, 0)`;
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
        el.style.pointerEvents = o > 0.6 ? "auto" : "none";
      });
      if (scrimRef.current) {
        scrimRef.current.style.opacity = String(1 - smooth(0.08, 0.18, p));
      }
      if (lightScrimRef.current) {
        const mid = smooth(0.22, 0.28, p) * (1 - smooth(0.7, 0.76, p));
        lightScrimRef.current.style.opacity = String(mid);
      }
    }

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      current = reduce
        ? target
        : current + (target - current) * Math.min(1, dt * 5);
      scene?.render(current, now / 1000);
      applyBeats(current);
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    // Terrain is generated in a worker so scrolling stays smooth while it
    // builds. three.js loads in parallel and stays out of the first JS chunk.
    const wide = window.innerWidth >= 1024;
    const opts = { cells: wide ? 80 : 64, trees: wide ? 4200 : 2600 };
    let worker: Worker | undefined;
    const onMainThread = () =>
      import("./valley-cross-terrain").then((m) =>
        m.generateTerrain(opts.cells, opts.trees),
      );
    const terrain = new Promise<TerrainData>((resolve) => {
      try {
        worker = new Worker(
          new URL("./valley-cross.worker.ts", import.meta.url),
          { type: "module" },
        );
        worker.onmessage = (e: MessageEvent<TerrainData>) => resolve(e.data);
        worker.onerror = () => onMainThread().then(resolve);
        worker.postMessage(opts);
      } catch {
        onMainThread().then(resolve);
      }
    });

    Promise.all([import("./valley-cross-scene"), terrain])
      .then(async ([{ createValleyCross }, data]) => {
        worker?.terminate();
        if (cancelled) return;
        const built = await createValleyCross(canvas, data, wide ? 4 : 3);
        if (cancelled) {
          built.dispose();
          return;
        }
        scene = built;
        // Draw now rather than waiting on the loop, which may be paused
        // until the first scroll or intersection callback.
        scene.render(current, performance.now() / 1000);
        canvas.style.opacity = "1";
        if (posterRef.current) posterRef.current.style.opacity = "0";
      })
      // No WebGL: the text beats still run over the plain backdrop.
      .catch(() => {});

    readScroll();
    current = target;
    applyBeats(current);

    const io = new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? start() : stop(),
    );
    io.observe(section);
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll);

    return () => {
      cancelled = true;
      stop();
      io.disconnect();
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
      scene?.dispose();
    };
  }, []);

  // Server markup: only the opening beat shows until the effect takes over.
  const hidden = { opacity: 0, visibility: "hidden" as const };

  return (
    <section
      ref={sectionRef}
      aria-label="God's family with a purpose"
      className="relative h-[520vh] bg-[#f5f5f7]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-gradient-to-b from-white to-[#eef0f2]">
        {/* Stands in for the valley until three.js has loaded. */}
        <div
          ref={posterRef}
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#5f9a44,#2c5a27)] transition-opacity duration-1000 delay-500"
        />
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000"
        />

        <div
          ref={scrimRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.38),rgba(0,0,0,0.08)_70%)]"
        />

        {/* Backs the mid-scroll beats so the small lines read over terrain. */}
        <div
          ref={lightScrimRef}
          aria-hidden="true"
          style={{ opacity: 0 }}
          className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-gradient-to-b from-[#f5f5f7] via-[#f5f5f7]/85 to-transparent"
        />

        {/* Opening: over the valley, white type. */}
        <div
          data-beat={0}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white"
        >
          <p className="text-xs sm:text-sm font-medium tracking-[0.18em] uppercase text-white/85">
            San Gabriel Valley Christian Club Collective
          </p>
          <h1
            className={cn(
              display,
              "mt-5 max-w-5xl text-[clamp(3.25rem,10vw,9rem)] [text-shadow:0_4px_40px_rgba(0,0,0,0.35)]",
            )}
          >
            God&apos;s family with a purpose.
          </h1>
          <div className="absolute bottom-8 flex flex-col items-center gap-1 text-xs font-medium text-white/80">
            Scroll
            <ChevronDown
              className="h-4 w-4 animate-bounce"
              aria-hidden="true"
            />
          </div>
        </div>

        {[
          {
            eyebrow: "Across the San Gabriel Valley",
            big: "20 schools.",
            body: "One network of Christian clubs, from Pasadena to Glendora.",
          },
          {
            eyebrow: "Ephesians 2:19",
            big: "1 family.",
            body: "Different schools, same household.",
          },
          {
            eyebrow: "How we work",
            big: "Every club student-led.",
            body: "We don't run clubs. We serve them.",
          },
        ].map((b, i) => (
          <div
            key={b.big}
            data-beat={i + 1}
            style={hidden}
            className="absolute inset-x-0 top-0 flex flex-col items-center px-4 pt-[14vh] text-center text-[#1d1d1f]"
          >
            <p className="text-xs sm:text-sm font-medium tracking-[0.18em] uppercase text-[#6e6e73]">
              {b.eyebrow}
            </p>
            <p
              className={cn(
                display,
                "mt-4 max-w-4xl text-[clamp(3rem,9vw,8rem)]",
              )}
            >
              {b.big}
            </p>
            <p className="mt-5 max-w-md text-lg sm:text-xl text-[#6e6e73]">
              {b.body}
            </p>
          </div>
        ))}

        {/* Settled: the cross stands beside the closing pitch. */}
        <div
          data-beat={4}
          style={hidden}
          className="absolute inset-0 flex items-end lg:items-center"
        >
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 lg:pb-0">
            <div className="max-w-xl text-[#1d1d1f]">
              <h2 className={cn(display, "text-[clamp(2.5rem,6vw,5.25rem)]")}>
                Here to serve your club.
              </h2>
              <p className="mt-5 text-lg sm:text-xl leading-relaxed text-[#424245]">
                We&apos;re a network of Christian clubs across 20 high schools
                in the San Gabriel Valley. We&apos;re here to serve your club
                and build joyful community, so no Christian student has to walk
                alone.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTAButton href="/clubs" size="lg" className="rounded-full">
                  Find your club
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </CTAButton>
                <CTAButton
                  href="#for-clubs"
                  variant="outline"
                  size="lg"
                  className="rounded-full bg-white/70 backdrop-blur"
                >
                  See what we offer clubs
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
