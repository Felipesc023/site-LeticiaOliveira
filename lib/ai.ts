import "server-only";
import { GoogleGenAI } from "@google/genai";
import type { AiSeo } from "@/lib/types";
import { extractJson } from "@/lib/json";
import { sanitizeArticleHtml } from "@/lib/html";

/** Model is configurable so Letícia/Felipe can trade cost for depth without a
    code change. Gemini free tier: generosa e sem cartão de crédito
    (aistudio.google.com/apikey). */
const MODEL = process.env.AI_MODEL || "gemini-3.6-flash";

export class AiUnavailableError extends Error {}

function client(): GoogleGenAI {
  if (!process.env.GEMINI_API_KEY) {
    throw new AiUnavailableError("GEMINI_API_KEY não configurada");
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

/** Shared into every prompt — the giveaways that make text read as
    AI-written instead of as something Letícia actually wrote. */
const HUMAN_VOICE_RULES = `
VOZ HUMANA — regras de estilo, sempre:
- Nunca use travessão (—). Troque por vírgula, ponto, ou reformule a frase.
- Evite estas palavras/expressões batidas de texto de IA: "justamente", "fundamental", "essencial", "sobretudo", "outrossim", "cabe destacar", "vale ressaltar", "é importante ressaltar", "não apenas... mas também", "em suma", "de forma a", "no que tange", "dessa forma", "nesse sentido".
- Frases de tamanho variado, como alguém realmente escreveria, não uma cadência artificialmente equilibrada.
- Tom sóbrio de advogada falando com um cliente, nunca linguagem de propaganda ou "copy" comercial (nada de "aproveite", "não perca", "garanta já").`;

async function askJson<T>(
  system: string,
  user: string,
  shape: string,
  maxTokens = 4000,
): Promise<T> {
  const res = await client().models.generateContent({
    model: MODEL,
    contents: user,
    config: {
      systemInstruction: `${system}\n\nResponda APENAS com JSON válido, sem comentários, no formato:\n${shape}`,
      maxOutputTokens: maxTokens,
      responseMimeType: "application/json",
    },
  });
  const text = res.text ?? "";
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
- keywords: 3 a 6 termos de busca realistas.
${HUMAN_VOICE_RULES}`;

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
- keywords: 3 a 6 termos de busca realistas.
${HUMAN_VOICE_RULES}`;

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

// ── Revisão leve (corrige sem reescrever) ────────────────────────────────────

export interface ReviewResult {
  html: string;
  suggestions: string[];
}

const REVIEW_SYSTEM = `Você é revisor(a) de texto para o blog de uma advogada especialista em leilões de imóveis. NÃO é seu trabalho reescrever o artigo aqui, é só revisar.

O QUE CORRIGIR (aplique direto no campo "html"):
- Erros de gramática, ortografia, concordância e pontuação.
- Nada além disso. Não troque palavras dela por sinônimos "melhores". Não reescreva frases que já estão corretas, mesmo que você faria diferente. Não mude a ordem dos parágrafos. Preserve o vocabulário e o jeito de escrever dela ao máximo.
- Mantenha as mesmas tags HTML que já estavam no texto (não adicione destaques novos, não reformate).

O QUE SUGERIR (campo "suggestions", separado do texto, nunca aplicado sozinho):
- 2 a 5 ideias de ORGANIZAÇÃO/leitura: onde quebrar um parágrafo longo, onde um trecho renderia melhor como lista, onde caberia um subtítulo, onde um parágrafo poderia virar um destaque (aviso/dica/dicionário).
- Nunca sugira trocar uma palavra por outra "mais sofisticada" ou "mais persuasiva".
- Cada sugestão em 1 frase curta e direta, como um colega de trabalho comentaria, não como um relatório.
${HUMAN_VOICE_RULES}`;

const REVIEW_SHAPE = `{"html":"<p>...</p>","suggestions":["...","..."]}`;

export async function reviewArticle(title: string, draftHtml: string): Promise<ReviewResult> {
  const out = await askJson<{ html?: string; suggestions?: string[] }>(
    REVIEW_SYSTEM,
    `Título: ${title}\n\nTexto:\n${draftHtml.slice(0, 20000)}`,
    REVIEW_SHAPE,
    8000,
  );
  return {
    html: sanitizeArticleHtml(String(out.html ?? draftHtml)) || draftHtml,
    suggestions: Array.isArray(out.suggestions) ? out.suggestions.map(String).slice(0, 5) : [],
  };
}
