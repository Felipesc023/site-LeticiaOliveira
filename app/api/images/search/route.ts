import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";
import { rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";

const UNSPLASH = "https://api.unsplash.com";

export type StockImage = {
  id: string;
  thumb: string;
  full: string;
  credit: string;
  downloadLocation: string;
};

/** Proxies Unsplash search so the access key stays server-side (RNF-003).
    Needs UNSPLASH_ACCESS_KEY — without it the picker shows a hint. */
export async function GET(request: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "não autorizado" }, { status: 401 });

  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "UNSPLASH_ACCESS_KEY não configurada", results: [] },
      { status: 503 },
    );
  }
  if (!rateLimit(`img:${admin.id}`, 40)) {
    return NextResponse.json({ error: "muitas buscas", results: [] }, { status: 429 });
  }

  const q = new URL(request.url).searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ results: [] });

  const res = await fetch(
    `${UNSPLASH}/search/photos?per_page=24&orientation=landscape&query=${encodeURIComponent(q)}`,
    { headers: { Authorization: `Client-ID ${key}` } },
  );
  if (!res.ok) {
    return NextResponse.json({ error: "falha na busca", results: [] }, { status: 502 });
  }
  const data = await res.json();
  const results: StockImage[] = (data.results ?? []).map((p: Record<string, unknown>) => {
    const urls = p.urls as Record<string, string>;
    const user = p.user as Record<string, string>;
    const links = p.links as Record<string, string>;
    return {
      id: p.id as string,
      thumb: urls.small,
      full: urls.regular,
      credit: `Foto: ${user.name} / Unsplash`,
      downloadLocation: links.download_location,
    };
  });
  return NextResponse.json({ results });
}

/** Unsplash requires a hit to the photo's download_location when it's actually
    used. Called by the picker on select. */
export async function POST(request: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  const key = process.env.UNSPLASH_ACCESS_KEY;
  const { downloadLocation } = await request.json().catch(() => ({}));
  if (key && typeof downloadLocation === "string" && downloadLocation.startsWith(UNSPLASH)) {
    await fetch(downloadLocation, { headers: { Authorization: `Client-ID ${key}` } }).catch(() => {});
  }
  return NextResponse.json({ ok: true });
}
