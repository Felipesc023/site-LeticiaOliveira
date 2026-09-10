import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";
import { rateLimit } from "@/lib/ratelimit";
import { optimizeArticle, AiUnavailableError } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

/** "✨ Otimizar e formatar artigo": revisa, formata em HTML com destaques e
    devolve os metadados de SEO. Aprovação humana continua no editor (RN-002). */
export async function POST(request: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  if (!rateLimit(`ai:${admin.id}`, 12)) {
    return NextResponse.json({ error: "muitas requisições" }, { status: 429 });
  }

  const { title, draft } = await request.json().catch(() => ({}));
  if (typeof draft !== "string" || draft.replace(/<[^>]*>/g, "").trim().length < 40) {
    return NextResponse.json({ error: "escreva um rascunho antes de otimizar" }, { status: 400 });
  }

  try {
    const result = await optimizeArticle(String(title ?? ""), draft);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof AiUnavailableError) {
      return NextResponse.json({ error: "IA indisponível" }, { status: 503 });
    }
    console.error("ai/optimize", err);
    return NextResponse.json({ error: "falha ao otimizar" }, { status: 502 });
  }
}
