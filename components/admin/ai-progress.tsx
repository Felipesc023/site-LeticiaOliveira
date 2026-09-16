"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = {
  optimize: [
    "Revisando gramática e tom…",
    "Estruturando os parágrafos…",
    "Inserindo destaques…",
    "Gerando meta description e slug…",
    "Quase lá…",
  ],
  seo: ["Lendo o conteúdo…", "Escolhendo palavras-chave…", "Redigindo a meta description…"],
  review: ["Lendo o texto…", "Corrigindo gramática e ortografia…", "Anotando sugestões de organização…"],
} as const;

// ponytail: a single LLM call gives no real progress signal — this bar eases
// toward 92% on a fixed time estimate and the caller snaps it to done.
const ESTIMATE_MS = { optimize: 26000, seo: 12000, review: 20000 };

export function AiProgress({ kind }: { kind: "optimize" | "seo" | "review" }) {
  const steps = STEPS[kind];
  const estimate = ESTIMATE_MS[kind];
  const [pct, setPct] = useState(5);
  const [label, setLabel] = useState<string>(steps[0]);
  const start = useRef(Date.now());

  useEffect(() => {
    start.current = Date.now();
    const id = setInterval(() => {
      const t = Date.now() - start.current;
      const eased = 92 * (1 - Math.exp(-t / (estimate * 0.55)));
      setPct(Math.min(92, Math.max(5, eased)));
      setLabel(steps[Math.min(steps.length - 1, Math.floor((t / estimate) * steps.length))]);
    }, 200);
    return () => clearInterval(id);
  }, [estimate, steps]);

  return (
    <div className="mt-3" role="status" aria-live="polite">
      <div className="flex items-center justify-between text-[10px] text-hazel">
        <span>{label}</span>
        <span className="tabular-nums">{Math.round(pct)}%</span>
      </div>
      <div className="bar-track mt-1.5 h-1 bg-subtle">
        <div
          className="h-full bg-hazel transition-[width] duration-200 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
