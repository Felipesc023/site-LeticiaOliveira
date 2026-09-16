"use client";

import { useEffect, useRef } from "react";

// One scroll/resize listener shared by every <Parallax> instance, same
// pattern as the shared IntersectionObserver in reveal.tsx.
const targets = new Set<{ el: HTMLElement; speed: number }>();
let listening = false;

function tick() {
  const vh = window.innerHeight;
  for (const t of targets) {
    const r = t.el.getBoundingClientRect();
    const offset = r.top + r.height / 2 - vh / 2;
    t.el.style.transform = `translateY(${(-offset * t.speed).toFixed(2)}px)`;
  }
}

function ensureListening() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", tick, { passive: true });
  window.addEventListener("resize", tick);
}

/** Subtle scroll-linked drift, purely decorative. Skips entirely for
    prefers-reduced-motion so it never fights users who opted out of motion. */
export function Parallax({
  children,
  speed = 0.06,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const entry = { el, speed };
    targets.add(entry);
    ensureListening();
    tick();
    return () => {
      targets.delete(entry);
      el.style.transform = "";
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
