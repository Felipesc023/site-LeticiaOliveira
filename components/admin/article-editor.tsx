"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sparkles, ImageIcon, Trash2, SpellCheck2 } from "lucide-react";
import { saveArticle, deleteArticle, type SaveResult } from "@/app/admin/actions";
import { CATEGORIES } from "@/lib/config";
import { slugify } from "@/lib/slug";
import type { Article } from "@/lib/types";
import { RichEditor } from "@/components/admin/rich-editor";
import { ImagePicker } from "@/components/admin/image-picker";
import { AiProgress } from "@/components/admin/ai-progress";

type Props = { article?: Article };

export function ArticleEditor({ article }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<SaveResult | null, FormData>(
    saveArticle,
    null,
  );

  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!article);
  const [content, setContent] = useState(article?.content ?? "");
  const [metaDescription, setMetaDescription] = useState(article?.meta_description ?? "");
  const [coverUrl, setCoverUrl] = useState(article?.cover_url ?? "");
  const [coverCredit, setCoverCredit] = useState(article?.cover_credit ?? "");
  const [status, setStatus] = useState(article?.status ?? "draft");
  const [publishedAt, setPublishedAt] = useState(
    article?.published_at ? toLocalInput(article.published_at) : "",
  );

  const [pickerOpen, setPickerOpen] = useState(false);
  const [aiBusy, setAiBusy] = useState<"optimize" | "seo" | "review" | null>(null);
  const [aiMsg, setAiMsg] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (!slugTouched && title) setSlug(slugify(title));
  }, [title, slugTouched]);

  useEffect(() => {
    if (state?.ok) router.push("/admin");
  }, [state, router]);

  async function runReview() {
    setAiBusy("review");
    setAiMsg(null);
    setAiSuggestions([]);
    try {
      const res = await fetch("/api/ai/review", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, draft: content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiMsg(data.error ?? "Falha ao revisar");
        return;
      }
      setContent(data.html);
      setAiSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
      setAiMsg("Correções pontuais aplicadas. O texto e as ideias continuam suas.");
    } catch {
      setAiMsg("Falha ao revisar");
    } finally {
      setAiBusy(null);
    }
  }

  async function runOptimize() {
    setAiBusy("optimize");
    setAiMsg(null);
    setAiSuggestions([]);
    try {
      const res = await fetch("/api/ai/optimize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, draft: content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiMsg(data.error ?? "Falha ao otimizar");
        return;
      }
      setContent(data.html);
      if (data.meta_description) setMetaDescription(data.meta_description);
      if (!slugTouched && data.slug) setSlug(slugify(data.slug));
      setAiMsg("Artigo revisado e formatado. Revise antes de publicar.");
    } catch {
      setAiMsg("Falha ao otimizar");
    } finally {
      setAiBusy(null);
    }
  }

  async function runSeo() {
    setAiBusy("seo");
    setAiMsg(null);
    try {
      const res = await fetch("/api/ai/seo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiMsg(data.error ?? "Falha na sugestão");
        return;
      }
      setMetaDescription(data.meta_description ?? metaDescription);
      if (!slugTouched && data.slug) setSlug(slugify(data.slug));
      setAiMsg("Metadados sugeridos.");
    } catch {
      setAiMsg("Falha na sugestão");
    } finally {
      setAiBusy(null);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <form action={formAction} className="space-y-6">
        {article && <input type="hidden" name="id" value={article.id} />}
        <input type="hidden" name="content" value={content} />
        <input type="hidden" name="cover_url" value={coverUrl} />
        <input type="hidden" name="cover_credit" value={coverCredit} />

        <Field label="Título">
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border hairline bg-card px-3 py-2 font-serif text-xl outline-none focus:border-espresso"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Slug (URL)">
            <input
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              className="w-full border hairline bg-card px-3 py-2 text-sm outline-none focus:border-espresso"
            />
          </Field>
          <Field label="Categoria">
            <select
              name="category"
              defaultValue={article?.category ?? CATEGORIES[0].slug}
              className="w-full border hairline bg-card px-3 py-2 text-sm outline-none focus:border-espresso"
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Conteúdo">
          <RichEditor html={content} onChange={setContent} />
        </Field>

        <Field label="Imagem de capa">
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            <div className="relative aspect-[16/9] w-full max-w-[240px] shrink-0 overflow-hidden border hairline bg-subtle sm:w-48">
              {coverUrl ? (
                <Image src={coverUrl} alt="" fill sizes="192px" className="object-cover" />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center p-2 text-center text-[10px] text-hazel">
                  Sem imagem — capa tipográfica de marca será usada
                </span>
              )}
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                title={coverUrl ? "Trocar a imagem de capa" : "Escolher uma imagem de capa"}
                aria-label={coverUrl ? "Trocar imagem de capa" : "Escolher imagem de capa"}
                className="btn btn-secondary btn-sm"
              >
                <ImageIcon size={13} aria-hidden /> {coverUrl ? "Trocar imagem" : "Escolher imagem"}
              </button>
              {coverUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setCoverUrl("");
                    setCoverCredit("");
                  }}
                  title="Remover a imagem de capa"
                  aria-label="Remover imagem de capa"
                  className="btn btn-ghost btn-sm px-1 text-error"
                >
                  <Trash2 size={13} aria-hidden /> Remover
                </button>
              )}
              {coverCredit && <p className="text-xs text-ink/50">{coverCredit}</p>}
            </div>
          </div>
        </Field>

        <Field label="Meta description (SEO)">
          <textarea
            name="meta_description"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={2}
            className="w-full border hairline bg-card px-3 py-2 text-sm outline-none focus:border-espresso"
          />
          <span className="mt-1 block text-xs text-ink/40">
            {metaDescription.length} caracteres
          </span>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Status">
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="w-full border hairline bg-card px-3 py-2 text-sm outline-none focus:border-espresso"
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicar agora</option>
              <option value="scheduled">Agendar</option>
            </select>
          </Field>
          {status === "scheduled" && (
            <Field label="Data de publicação">
              <input
                type="datetime-local"
                name="published_at"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full border hairline bg-card px-3 py-2 text-sm outline-none focus:border-espresso"
              />
            </Field>
          )}
        </div>

        {state && !state.ok && (
          <p className="border-l-2 border-error pl-3 text-sm text-error">{state.error}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            title="Salvar as alterações deste artigo"
            aria-label="Salvar artigo"
            className="btn btn-primary disabled:opacity-50"
          >
            {pending ? "Salvando…" : "Salvar"}
          </button>
          {article && (
            <button
              type="button"
              onClick={() => {
                if (confirm("Excluir este artigo?")) deleteArticle(article.id);
              }}
              title="Excluir este artigo definitivamente"
              aria-label="Excluir artigo"
              className="btn btn-ghost btn-sm text-error"
            >
              Excluir
            </button>
          )}
        </div>
      </form>

      <aside className="space-y-4 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto">
        <div className="border hairline bg-card p-4">
          <p className="label-caps text-hazel">Assistente editorial</p>
          <p className="mt-2 text-xs leading-relaxed text-ink/60">
            Cole o rascunho no editor. "Revisar sem reescrever" só corrige
            gramática e ortografia, mantendo suas palavras, e sugere ideias de
            organização à parte. "Otimizar e formatar" reescreve e formata o
            artigo inteiro, com destaques e SEO.
          </p>
          <button
            type="button"
            onClick={runReview}
            disabled={aiBusy !== null}
            title="Corrige só gramática e ortografia, sem trocar seu texto"
            aria-label="Revisar o texto sem reescrever, só corrigindo erros"
            className="btn btn-secondary btn-sm mt-4 w-full"
          >
            <SpellCheck2 size={14} className={aiBusy === "review" ? "animate-pulse" : ""} aria-hidden />
            {aiBusy === "review" ? "Revisando…" : "Revisar sem reescrever"}
          </button>
          <button
            type="button"
            onClick={runOptimize}
            disabled={aiBusy !== null}
            title="Reescreve, formata e sugere SEO automaticamente"
            aria-label="Otimizar e formatar o artigo inteiro com IA"
            className="btn btn-primary btn-sm mt-2 w-full"
          >
            <Sparkles size={14} className={aiBusy === "optimize" ? "animate-pulse" : ""} aria-hidden />
            {aiBusy === "optimize" ? "Otimizando…" : "Otimizar e formatar"}
          </button>
          <button
            type="button"
            onClick={runSeo}
            disabled={aiBusy !== null}
            title="Sugere só meta description, slug e palavras-chave"
            aria-label="Sugerir apenas os metadados de SEO"
            className="btn btn-ghost btn-sm mt-2 w-full"
          >
            {aiBusy === "seo" ? "Gerando…" : "Só sugerir SEO"}
          </button>
          {aiBusy && <AiProgress kind={aiBusy} />}
          {!aiBusy && aiMsg && <p className="mt-3 text-xs text-hazel">{aiMsg}</p>}
          {!aiBusy && aiSuggestions.length > 0 && (
            <div className="mt-3 border-l-2 border-hazel/40 pl-3">
              <p className="label-caps text-[10px] text-hazel">Ideias de organização</p>
              <ul className="mt-1.5 space-y-1.5 text-xs leading-relaxed text-ink/65">
                {aiSuggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="border hairline bg-card p-4 text-xs leading-relaxed text-ink/55">
          <p className="label-caps mb-2 text-hazel">Destaques</p>
          <p>
            <strong className="text-ink/75">⚠ Aviso legal</strong> — prazos e riscos.<br />
            <strong className="text-ink/75">💡 Dica prática</strong> — sacadas do processo.<br />
            <strong className="text-ink/75">📖 Dicionário</strong> — termos técnicos.
          </p>
          <p className="mt-2">Os botões na barra do editor inserem manualmente.</p>
        </div>
      </aside>

      {pickerOpen && (
        <ImagePicker
          onClose={() => setPickerOpen(false)}
          onSelect={({ url, credit }) => {
            setCoverUrl(url);
            setCoverCredit(credit);
          }}
        />
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-caps mb-1.5 block text-hazel">{label}</span>
      {children}
    </label>
  );
}

/** ISO → value for <input type="datetime-local"> in local time. */
function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}
