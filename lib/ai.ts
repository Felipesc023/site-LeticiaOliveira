import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { AiSeo } from "@/lib/types";
import { extractJson } from "@/lib/json";
import { sanitizeArticleHtml } from "@/lib/html";

/** Model is configurable so Letícia/Felipe can trade cost for depth without a
    code change. Defaults to the most capable model.
    (Kept on Claude — already wired + keyed. Swap here for another provider.) */
const MODEL = process.env.AI_MODEL || "claude-opus-5";

export class AiUnavailableError extends Error {}

function client(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new AiUnavailableError("ANTHROPIC_API_KEY não configurada");
  }
  return new Anthropic();
}

async function askJson<T>(
  system: string,
  user: string,
  shape: string,
  maxTokens = 4000,
): Promise<T> {
  const res = await client().messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system: `${system}\n\nResponda APENAS com JSON válido, sem comentários, no formato:\n${shape}`,
    messages: [{ role: "user", content: user }],
  });
  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  return extractJson<T>(text);
}

// ── Otimizar e formatar artigo ───────────────────────────────────────────────

export interface OptimizedArticle extends AiSeo {
  html: string;
}

const OPTIMIZE_SYSTEM = `Você é editor(a) do blog de uma advogada especialista em leilões de imóveis (judiciais e extrajudiciais), no Brasil.

Receberá um rascunho (texto solto ou HTML bagunçado). Devolva o artigo revisado e formatado.

REVISÃO:
- Corrija gramática e pontuação.
- Ajuste para um tom jurídico acessível e profissional: claro, sem juridiquês, sem promessa fácil, sem linguagem de propaganda.
- Não invente fatos jurídicos, números, prazos ou citações de lei que não estejam no rascunho.
- Preserve o sentido e as informações do autor.

FORMATAÇÃO (campo "html") — use SOMENTE estas tags:
<h2>, <h3>, <p>, <strong>, <em>, <ul>, <ol>, <li>, <blockquote>, <a href="...">
E os destaques, quando fizerem sentido:
<aside data-callout="aviso"><p><strong>Título curto</strong></p><p>...</p></aside>  → alertas de prazo, risco, nulidade, perda de prazo
<aside data-callout="dica"><p><strong>Título curto</strong></p><p>...</p></aside>   → sacadas operacionais do processo
<aside data-callout="dicionario"><p><strong>Termo</strong></p><p>Explicação em 1-2 frases.</p></aside>  → termos técnicos (propter rem, averbação, carta de arrematação, purgação da mora, consolidação da propriedade, etc.)

Regras dos destaques:
- Insira de 1 a 4 no total, apenas onde agregam. Não force; um artigo pode ter zero.
- Não repita no destaque um parágrafo que já está no corpo — o destaque complementa.
- Sem <div>, <span>, style, classes, imagens ou headings dentro de <aside>.

METADADOS:
- meta_description: 1 frase, 120-158 caracteres, sem clickbait.
- slug: minúsculas, sem acentos, palavras com hífen, curto.
- keywords: 3 a 6 termos de busca realistas.`;

const OPTIMIZE_SHAPE = `{"html":"<h2>...</h2><p>...</p>","meta_description":"...","slug":"...","keywords":["...","...","..."]}`;

export async function optimizeArticle(
  title: string,
  draft: string,
): Promise<OptimizedArticle> {
  const out = await askJson<Partial<OptimizedArticle>>(
    OPTIMIZE_SYSTEM,
    `Título: ${title}\n\nRascunho:\n${draft.slice(0, 20000)}`,
    OPTIMIZE_SHAPE,
    8000,
  );
  return {
    html: sanitizeArticleHtml(String(out.html ?? "")) || "<p></p>",
    meta_description: String(out.meta_description ?? ""),
    slug: String(out.slug ?? ""),
    keywords: Array.isArray(out.keywords) ? out.keywords.map(String).slice(0, 6) : [],
  };
}

// ── Sugestão de SEO (ação rápida secundária) ─────────────────────────────────

const SEO_SYSTEM = `Você gera metadados de SEO em português para um artigo de blog jurídico sobre leilões de imóveis.
- meta_description: 1 frase, 120-158 caracteres, sem clickbait.
- slug: curto, em minúsculas, palavras separadas por hífen, sem acentos.
- keywords: 3 a 6 termos de busca realistas.`;

const SEO_SHAPE = `{"meta_description":"...","slug":"...","keywords":["...","...","..."]}`;

export async function suggestSeo(title: string, content: string): Promise<AiSeo> {
  const seo = await askJson<AiSeo>(
    SEO_SYSTEM,
    `Título: ${title}\n\nConteúdo:\n${content.slice(0, 6000)}`,
    SEO_SHAPE,
  );
  return {
    meta_description: String(seo.meta_description ?? ""),
    slug: String(seo.slug ?? ""),
    keywords: Array.isArray(seo.keywords) ? seo.keywords.map(String).slice(0, 6) : [],
  };
}
