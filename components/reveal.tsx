"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

// One IntersectionObserver shared by every <Reveal> on the page instead of
// one per instance — pages here easily mount 15-20+ of these, and browsers
// don't dedupe observer setup for you.
let sharedObserver: IntersectionObserver | null = null;
const onIntersect = new WeakMap<Element, () => void>();

function getObserver(): IntersectionObserver {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          onIntersect.get(entry.target)?.();
          sharedObserver!.unobserve(entry.target);
          onIntersect.delete(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
  }
  return sharedObserver;
}

/** Fades + rises its children in when they scroll into view. RSC-safe: pass
    server-rendered children straight through. Reduced-motion users get no
    transition (the CSS hides the transform behind a media query). */
export function Reveal({
  children,
  className,
  delay = 0,
  as,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const Tag = as ?? "div";
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const observer = getObserver();
    onIntersect.set(el, () => setShown(true));
    observer.observe(el);
    // Failsafe: never leave content hidden if the observer misfires.
    const timer = setTimeout(() => setShown(true), 2500);
    return () => {
      observer.unobserve(el);
      onIntersect.delete(el);
      clearTimeout(timer);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal={shown ? "in" : "out"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
