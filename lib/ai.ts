import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { AiComment, AiSeo } from "@/lib/types";
import { extractJson } from "@/lib/json";

/** Model is configurable so Letícia/Felipe can trade cost for depth without a
    code change. Defaults to the most capable model. */
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
): Promise<T> {
  const res = await client().messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: `${system}\n\nResponda APENAS com JSON válido, sem comentários, no formato:\n${shape}`,
    messages: [{ role: "user", content: user }],
  });
  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  return extractJson<T>(text);
}

const REVIEW_SYSTEM = `Você é um editor de textos jurídicos para o blog de uma advogada especialista em leilões de imóveis.
Tom-alvo: consultivo e sofisticado, sem juridiquês e sem simplificação genérica de landing page.
Aponte trechos que podem melhorar em clareza, impacto, excesso de jargão ou estrutura.
Cada observação deve citar um trecho VERBATIM do texto (campo "quote") para ancorar o comentário ao lado da frase.
Não reescreva o texto. Não invente fatos jurídicos. Máximo de 8 observações, priorizando as mais relevantes.
Se o texto já estiver bom, retorne uma lista vazia.`;

const REVIEW_SHAPE = `{"comments":[{"quote":"trecho verbatim do texto","comment":"a sugestão","kind":"clareza|impacto|juridiquês|estrutura|outro"}]}`;

/** RF-010/011: editorial review as anchored comments, never a rewrite. */
export async function reviewDraft(
  title: string,
  content: string,
): Promise<AiComment[]> {
  const { comments } = await askJson<{ comments: Omit<AiComment, "id">[] }>(
    REVIEW_SYSTEM,
    `Título: ${title}\n\nTexto (markdown):\n${content}`,
    REVIEW_SHAPE,
  );
  return (comments ?? [])
    .filter((c) => c && typeof c.quote === "string" && content.includes(c.quote))
    .slice(0, 8)
    .map((c, i) => ({ ...c, id: `c${i}` }));
}

const SEO_SYSTEM = `Você gera metadados de SEO em português para um artigo de blog jurídico sobre leilões de imóveis.
- meta_description: 1 frase, 120-158 caracteres, sem clickbait.
- slug: curto, em minúsculas, palavras separadas por hífen, sem acentos, sem stopwords desnecessárias.
- keywords: 3 a 6 termos de busca realistas.`;

const SEO_SHAPE = `{"meta_description":"...","slug":"...","keywords":["...","...","..."]}`;

/** RF-012: suggested meta description, slug and keywords — human still approves. */
export async function suggestSeo(
  title: string,
  content: string,
): Promise<AiSeo> {
  const seo = await askJson<AiSeo>(
    SEO_SYSTEM,
    `Título: ${title}\n\nTexto (markdown):\n${content.slice(0, 6000)}`,
    SEO_SHAPE,
  );
  return {
    meta_description: String(seo.meta_description ?? ""),
    slug: String(seo.slug ?? ""),
    keywords: Array.isArray(seo.keywords) ? seo.keywords.map(String).slice(0, 6) : [],
  };
}
