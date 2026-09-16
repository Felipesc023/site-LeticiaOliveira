"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Search, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { StockImage } from "@/app/api/images/search/route";

type Selection = { url: string; credit: string };

export function ImagePicker({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (s: Selection) => void;
}) {
  const [tab, setTab] = useState<"stock" | "upload">("stock");
  const [q, setQ] = useState("");
  const [results, setResults] = useState<StockImage[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setBusy(true);
    setErr("");
    try {
      const res = await fetch(`/api/images/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) setErr(data.error ?? "Falha na busca");
      setResults(data.results ?? []);
    } catch {
      setErr("Falha na busca");
    } finally {
      setBusy(false);
    }
  }

  async function pickStock(img: StockImage) {
    fetch("/api/images/search", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ downloadLocation: img.downloadLocation }),
    }).catch(() => {});
    onSelect({ url: img.full, credit: img.credit });
    onClose();
  }

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("article-covers")
        .upload(path, file, { cacheControl: "31536000", upsert: false });
      if (error) {
        setErr(error.message);
        return;
      }
      const { data } = supabase.storage.from("article-covers").getPublicUrl(path);
      onSelect({ url: data.publicUrl, credit: "" });
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-espresso-deep/40 p-4 sm:p-10"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl border hairline bg-canvas"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b hairline px-5 py-3">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setTab("stock")}
              title="Buscar no banco de imagens do Unsplash"
              aria-label="Aba: banco de imagens"
              aria-pressed={tab === "stock"}
              className={`label-caps text-[11px] ${tab === "stock" ? "text-espresso" : "text-hazel"}`}
            >
              Banco de imagens
            </button>
            <button
              type="button"
              onClick={() => setTab("upload")}
              title="Enviar uma imagem do computador"
              aria-label="Aba: enviar arquivo"
              aria-pressed={tab === "upload"}
              className={`label-caps text-[11px] ${tab === "upload" ? "text-espresso" : "text-hazel"}`}
            >
              Enviar arquivo
            </button>
          </div>
          <button type="button" onClick={onClose} title="Fechar" aria-label="Fechar seletor de imagem">
            <X size={18} className="text-hazel" />
          </button>
        </div>

        <div className="p-5">
          {tab === "stock" ? (
            <>
              <form onSubmit={search} className="flex gap-2">
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="ex.: casa, contrato, cidade, chave"
                  className="flex-1 border hairline bg-card px-3 py-2 text-sm outline-none focus:border-espresso"
                />
                <button
                  type="submit"
                  disabled={busy}
                  title="Buscar imagens"
                  aria-label="Buscar imagens"
                  className="btn btn-primary btn-sm"
                >
                  <Search size={13} aria-hidden /> Buscar
                </button>
              </form>
              {err && <p className="mt-3 text-xs text-error">{err}</p>}
              <div className="mt-4 grid max-h-[55vh] grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
                {results.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => pickStock(img)}
                    title={`Usar esta imagem (${img.credit})`}
                    aria-label={`Escolher imagem de ${img.credit}`}
                    className="group relative aspect-[4/3] overflow-hidden border hairline"
                  >
                    <Image
                      src={img.thumb}
                      alt=""
                      fill
                      sizes="240px"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <span className="absolute inset-x-0 bottom-0 truncate bg-espresso-deep/70 px-1.5 py-0.5 text-[9px] text-canvas">
                      {img.credit}
                    </span>
                  </button>
                ))}
              </div>
              {!busy && results.length === 0 && !err && (
                <p className="mt-6 text-xs text-ink/50">
                  Busque por uma palavra-chave. As fotos vêm do Unsplash, com
                  crédito preenchido automaticamente.
                </p>
              )}
            </>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-hazel/50 bg-card px-6 py-16 text-center">
              <Upload size={22} className="text-hazel" />
              <span className="text-sm text-ink/70">
                Clique para escolher uma imagem do computador
              </span>
              <span className="text-xs text-ink/40">JPG, PNG ou WebP · vai para o Storage do Supabase</span>
              <input type="file" accept="image/*" onChange={upload} className="hidden" disabled={busy} />
            </label>
          )}
          {busy && <p className="mt-3 text-xs text-hazel">Processando…</p>}
        </div>
      </div>
    </div>
  );
}
