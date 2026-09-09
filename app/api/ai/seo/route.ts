import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";
import { rateLimit } from "@/lib/ratelimit";
import { suggestSeo, AiUnavailableError } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  if (!rateLimit(`ai:${admin.id}`)) {
    return NextResponse.json({ error: "muitas requisições" }, { status: 429 });
  }

  const { title, content } = await request.json().catch(() => ({}));
  if (typeof content !== "string" || content.trim().length < 40) {
    return NextResponse.json({ error: "texto muito curto" }, { status: 400 });
  }

  try {
    const seo = await suggestSeo(String(title ?? ""), content);
    return NextResponse.json(seo);
  } catch (err) {
    if (err instanceof AiUnavailableError) {
      return NextResponse.json({ error: "IA indisponível" }, { status: 503 });
    }
    console.error("ai/seo", err);
    return NextResponse.json({ error: "falha na sugestão" }, { status: 502 });
  }
}
