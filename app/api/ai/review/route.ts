import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";
import { rateLimit } from "@/lib/ratelimit";
import { reviewDraft, AiUnavailableError } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  if (!rateLimit(`ai:${admin.id}`)) {
    return NextResponse.json({ error: "muitas requisições" }, { status: 429 });
  }

  const { title, content } = await request.json().catch(() => ({}));
  if (typeof content !== "string" || content.trim().length < 40) {
    return NextResponse.json({ comments: [] });
  }

  try {
    const comments = await reviewDraft(String(title ?? ""), content);
    return NextResponse.json({ comments });
  } catch (err) {
    if (err instanceof AiUnavailableError) {
      return NextResponse.json({ error: "IA indisponível", comments: [] }, { status: 503 });
    }
    console.error("ai/review", err);
    return NextResponse.json({ error: "falha na revisão", comments: [] }, { status: 502 });
  }
}
