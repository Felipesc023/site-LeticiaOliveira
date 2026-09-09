import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/** Flips due 'scheduled' articles to 'published'. Public reads already gate on
    published_at, so this only keeps the admin view + caches honest.
    Call from an external scheduler (e.g. cron-job.org, Vercel Cron) with header
    `authorization: Bearer <CRON_SECRET>`. */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY não configurada" },
      { status: 503 },
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("articles")
    .update({ status: "published" })
    .eq("status", "scheduled")
    .lte("published_at", new Date().toISOString())
    .select("slug");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (data?.length) {
    revalidatePath("/blog");
    revalidatePath("/admin");
    for (const a of data) revalidatePath(`/blog/${a.slug}`);
  }
  return NextResponse.json({ published: data?.map((a) => a.slug) ?? [] });
}
