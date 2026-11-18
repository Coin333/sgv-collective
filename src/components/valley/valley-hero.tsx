"use client";

// Isaiah 40:4 over the real shape of the San Gabriel Valley. A 420vh track
// with a sticky stage: scrolling scrubs the terrain flat and steps through
// the four lines of the verse, each tied to one part of the mission, then
// lands on the site's headline. Phones, reduced motion, and browsers
// without WebGL get a still of the leveled valley instead of the scene.

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ValleySceneApi } from "./valley-scene";

const ValleyScene = dynamic(() => import("./valley-scene"), { ssr: false });

const stages = [
  {
    verse: "Every valley shall be raised up,",
    mission:
      "This valley. And the student who is the only Christian at their school.",
  },
  {
    verse: "every mountain and hill made low;",
    mission:
      "The walls between schools, churches, and friend groups. Adults step back. Students lead.",
  },
  {
    verse: "the rough ground shall become level,",
    mission:
      "Playbooks, cutouts, a handoff every June. Starting a club stops being hard.",
  },
  {
    verse: "the rugged places a plain.",
    mission: "One flat place to stand together. Everything Night.",
  },
];

// Scroll fraction at which each stage begins. The mesh is flat by stage 4.
const STAGE_AT = [0, 0.2, 0.4, 0.6, 0.8];
const MESH_FROM = 0.03;
const MESH_TO = 0.72;

function meshT(p: number) {
  return Math.min(1, Math.max(0, (p - MESH_FROM) / (MESH_TO - MESH_FROM)));
}

function stageFor(p: number) {
  let s = 1;
  for (let i = 1; i < STAGE_AT.length; i++) if (p >= STAGE_AT[i]) s = i + 1;
  return s;
}

export function ValleyHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<ValleySceneApi | null>(null);
  const forcedRef = useRef<number | null>(null);
  const [mode, setMode] = useState<"pending" | "scene" | "poster">("pending");
  const [initial, setInitial] = useState(0);

  const onApi = useCallback((api: ValleySceneApi | null) => {
    apiRef.current = api;
    if (api && forcedRef.current !== null) api.setTarget(meshT(forcedRef.current));
  }, []);

  // Decide once, on the client, whether this device gets the scene.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forced = params.get("valley");
    if (forced !== null) {
      forcedRef.current = Math.min(1, Math.max(0, Number(forced)));
      setInitial(meshT(forcedRef.current));
      stageRef.current?.setAttribute("data-forced", "true");
    }
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const narrow = window.innerWidth < 768;
    let webgl = false;
    try {
      const c = document.createElement("canvas");
      webgl = !!c.getContext("webgl2");
    } catch {
      webgl = false;
    }
    if (params.get("bare") !== null) {
      stageRef.current?.setAttribute("data-bare", "true");
    }
    const scene =
      webgl &&
      params.get("poster") === null &&
      (forced !== null || (!reduced && !narrow));
    // Let the headline paint first; the scene is decoration. A plain timer,
    // not requestIdleCallback, which never fires in a background tab.
    const timer = window.setTimeout(
      () => setMode(scene ? "scene" : "poster"),
      120,
    );
    return () => window.clearTimeout(timer);
  }, []);

  // Scroll drives both the text stage and the mesh.
  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;
    let ticking = false;
    let lastStage = 0;

    const update = () => {
      ticking = false;
      let p: number;
      if (forcedRef.current !== null) {
        p = forcedRef.current;
      } else {
        const rect = track.getBoundingClientRect();
        const span = rect.height - window.innerHeight;
        p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 1;
      }
      const s = stageFor(p);
      if (s !== lastStage) {
        lastStage = s;
        stage.dataset.stage = String(s);
      }
      apiRef.current?.setTarget(meshT(p));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={trackRef} className="relative h-[420vh] bg-white">
      <div
        ref={stageRef}
        data-stage="1"
        className="valley-stage sticky top-0 h-[100svh] overflow-hidden"
      >
        {/* Visual layer */}
        <div className="absolute inset-0">
          {mode === "scene" && (
            <ValleyScene
              onApi={onApi}
              initial={initial}
              className="valley-canvas absolute inset-0 [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full"
            />
          )}
          {mode === "poster" && (
            <picture>
              <source
                media="(max-width: 767px)"
                srcSet="/valley/poster-mobile.jpg"
              />
              <img
                src="/valley/poster.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                decoding="async"
                fetchPriority="low"
              />
            </picture>
          )}
        </div>

        {/* Text layer */}
        <div className="valley-text relative mx-auto flex h-full max-w-[1180px] flex-col px-5 pt-24 sm:px-8 md:pt-32">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#6e6e73] sm:text-xs">
            San Gabriel Valley Christian Club Collective
          </p>

          <div className="relative mt-5 flex-1">
            {stages.map((s, i) => (
              <div
                key={s.verse}
                data-line={i + 1}
                className="valley-line absolute inset-x-0 top-0 max-w-3xl"
              >
                <p className="font-display text-[clamp(2.25rem,6vw,5.5rem)] font-semibold tracking-[-0.045em] text-[#1d1d1f] [line-height:0.98] text-balance">
                  {s.verse}
                </p>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-[#6e6e73] md:text-xl">
                  {s.mission}
                </p>
                <p className="mt-5 text-xs text-[#6e6e73]/80 sm:text-sm">
                  Isaiah 40:4
                </p>
              </div>
            ))}

            <div data-line="5" className="valley-line absolute inset-x-0 top-0">
              <h1 className="max-w-[11ch] font-display text-[clamp(3rem,8vw,7.25rem)] font-semibold tracking-[-0.05em] text-[#1d1d1f] [line-height:0.92]">
                No Christian student walks{" "}
                <span className="text-[#1d1d1f]/35">alone.</span>
              </h1>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-[#6e6e73] md:text-xl">
                A network of student-led Christian clubs across twenty high
                schools in the San Gabriel Valley. Started by students in 2024.
                Handed to new students every June.
              </p>
              <div className="mt-8 flex items-center gap-6">
                <Link
                  href="/clubs"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-black"
                >
                  Find your club
                </Link>
                <Link
                  href="/legacy"
                  className="group inline-flex items-center gap-1.5 text-base font-medium text-[#1d1d1f]"
                >
                  Our story
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
