"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { marked } from "marked";
import { saveArticle, deleteArticle, type SaveResult } from "@/app/admin/actions";
import { CATEGORIES } from "@/lib/config";
import { slugify } from "@/lib/slug";
import type { Article, AiComment } from "@/lib/types";

marked.setOptions({ gfm: true, breaks: false });

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
  const [keywords, setKeywords] = useState((article?.keywords ?? []).join(", "));
  const [status, setStatus] = useState(article?.status ?? "draft");
  const [publishedAt, setPublishedAt] = useState(
    article?.published_at ? toLocalInput(article.published_at) : "",
  );
  const [showPreview, setShowPreview] = useState(false);

  const [comments, setComments] = useState<AiComment[]>([]);
  const [autoReview, setAutoReview] = useState(false);
  const [aiBusy, setAiBusy] = useState<"review" | "seo" | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const lastReviewed = useRef("");

  useEffect(() => {
    if (!slugTouched && title) setSlug(slugify(title));
  }, [title, slugTouched]);

  useEffect(() => {
    if (state?.ok) router.push("/admin");
  }, [state, router]);

  async function runReview() {
    setAiBusy("review");
    setAiError(null);
    try {
      const res = await fetch("/api/ai/review", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (!res.ok) setAiError(data.error ?? "Falha na revisão");
      setComments(data.comments ?? []);
      lastReviewed.current = content;
    } catch {
      setAiError("Falha na revisão");
    } finally {
      setAiBusy(null);
    }
  }

  async function runSeo() {
    setAiBusy("seo");
    setAiError(null);
    try {
      const res = await fetch("/api/ai/seo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiError(data.error ?? "Falha na sugestão");
        return;
      }
      setMetaDescription(data.meta_description ?? metaDescription);
      setKeywords((data.keywords ?? []).join(", "));
      if (!slugTouched && data.slug) {
        setSlug(slugify(data.slug));
      }
    } catch {
      setAiError("Falha na sugestão");
    } finally {
      setAiBusy(null);
    }
  }

  // Automatic review while writing (§27/§28) — debounced, only on real change.
  useEffect(() => {
    if (!autoReview) return;
    if (content.trim().length < 120) return;
    if (content === lastReviewed.current) return;
    const t = setTimeout(runReview, 2500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, autoReview]);

  const previewHtml = useMemo(
    () => (showPreview ? (marked.parse(content, { async: false }) as string) : ""),
    [showPreview, content],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <form action={formAction} className="space-y-6">
        {article && <input type="hidden" name="id" value={article.id} />}

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

        <Field label="Conteúdo (markdown)">
          <div className="mb-2 flex gap-3 text-xs">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className={!showPreview ? "text-espresso underline" : "text-hazel"}
            >
              Escrever
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className={showPreview ? "text-espresso underline" : "text-hazel"}
            >
              Pré-visualizar
            </button>
          </div>
          {showPreview ? (
            <div
              className="prose-editorial min-h-[320px] border hairline bg-card p-4"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          ) : (
            <textarea
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={18}
              className="w-full border hairline bg-card px-3 py-2 font-mono text-sm outline-none focus:border-espresso"
            />
          )}
          {/* keep content in the form even while previewing */}
          {showPreview && <input type="hidden" name="content" value={content} />}
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Imagem de capa (URL) — opcional">
            <input
              name="cover_url"
              defaultValue={article?.cover_url ?? ""}
              placeholder="Unsplash/Pexels ou upload"
              className="w-full border hairline bg-card px-3 py-2 text-sm outline-none focus:border-espresso"
            />
          </Field>
          <Field label="Crédito da imagem — opcional">
            <input
              name="cover_credit"
              defaultValue={article?.cover_credit ?? ""}
              placeholder="Foto: Nome / Unsplash"
              className="w-full border hairline bg-card px-3 py-2 text-sm outline-none focus:border-espresso"
            />
          </Field>
        </div>

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

        <Field label="Palavras-chave (separadas por vírgula)">
          <input
            name="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full border hairline bg-card px-3 py-2 text-sm outline-none focus:border-espresso"
          />
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
            className="label-caps border border-espresso bg-espresso px-8 py-3 text-[12px] text-canvas disabled:opacity-50"
          >
            {pending ? "Salvando…" : "Salvar"}
          </button>
          {article && (
            <button
              type="button"
              onClick={() => {
                if (confirm("Excluir este artigo?")) deleteArticle(article.id);
              }}
              className="label-caps px-4 py-3 text-[11px] text-error"
            >
              Excluir
            </button>
          )}
        </div>
      </form>

      {/* AI editorial side panel (RF-011: comments beside the text) */}
      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="border hairline bg-card p-4">
          <p className="label-caps text-hazel">Assistente editorial</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={runReview}
              disabled={aiBusy !== null}
              className="label-caps border border-espresso px-3 py-2 text-[10px] text-espresso disabled:opacity-40"
            >
              {aiBusy === "review" ? "Revisando…" : "Revisar texto"}
            </button>
            <button
              type="button"
              onClick={runSeo}
              disabled={aiBusy !== null}
              className="label-caps border border-espresso px-3 py-2 text-[10px] text-espresso disabled:opacity-40"
            >
              {aiBusy === "seo" ? "Gerando…" : "Sugerir SEO"}
            </button>
          </div>
          <label className="mt-3 flex items-center gap-2 text-xs text-ink/60">
            <input
              type="checkbox"
              checked={autoReview}
              onChange={(e) => setAutoReview(e.target.checked)}
            />
            Revisar automaticamente enquanto escrevo
          </label>
          {aiError && <p className="mt-2 text-xs text-error">{aiError}</p>}
        </div>

        {comments.length > 0 && (
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="border hairline bg-card p-3 text-sm">
                <span className="label-caps text-[9px] text-hazel">{c.kind}</span>
                <p className="mt-1 border-l-2 border-canvas-dim pl-2 text-xs italic text-ink/60">
                  “{c.quote}”
                </p>
                <p className="mt-2 text-ink/85">{c.comment}</p>
                <button
                  type="button"
                  onClick={() =>
                    setComments((prev) => prev.filter((x) => x.id !== c.id))
                  }
                  className="label-caps mt-2 text-[10px] text-hazel hover:text-espresso"
                >
                  Dispensar
                </button>
              </div>
            ))}
          </div>
        )}
      </aside>
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
