import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";
import { rateLimit } from "@/lib/ratelimit";
import { reviewArticle, AiUnavailableError, describeAiError } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

/** "Revisar sem reescrever": corrige gramática/ortografia preservando o texto
    dela, e devolve sugestões de organização separadas (nunca aplicadas
    automaticamente). Aprovação humana continua no editor (RN-002). */
export async function POST(request: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  if (!rateLimit(`ai:${admin.id}`, 12)) {
    return NextResponse.json({ error: "muitas requisições" }, { status: 429 });
  }

  const { title, draft } = await request.json().catch(() => ({}));
  if (typeof draft !== "string" || draft.replace(/<[^>]*>/g, "").trim().length < 40) {
    return NextResponse.json({ error: "escreva um rascunho antes de revisar" }, { status: 400 });
  }

  try {
    const result = await reviewArticle(String(title ?? ""), draft);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof AiUnavailableError) {
      return NextResponse.json({ error: "IA indisponível" }, { status: 503 });
    }
    console.error("ai/review", err);
    return NextResponse.json({ error: describeAiError(err) }, { status: 502 });
  }
}
