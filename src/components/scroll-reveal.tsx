"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li" | "header" | "footer";
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  as: As = "div",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Anything already on screen reveals at once. The observer's first
    // callback can be missed after a client-side navigation or a fast
    // scroll, and content must never stay hidden.
    const inView = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.96 && r.bottom > 0;
    };
    if (inView()) {
      setVisible(true);
      return;
    }

    const done = () => {
      setVisible(true);
      obs.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) done();
      },
      { threshold: 0, rootMargin: "0px 0px -4% 0px" },
    );
    // Scroll fallback for when the observer is throttled (background tabs,
    // some in-app browsers). One rect read per element per scroll event.
    const onScroll = () => {
      if (inView()) done();
    };
    obs.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <As
      ref={ref as never}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
        className,
      )}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </As>
  );
}
