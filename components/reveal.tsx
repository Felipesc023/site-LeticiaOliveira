"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

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
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    // Failsafe: never leave content hidden if the observer misfires.
    const timer = setTimeout(() => {
      setShown(true);
      io.disconnect();
    }, 2500);
    return () => {
      io.disconnect();
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
