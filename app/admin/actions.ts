"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdmin } from "@/lib/admin";
import { slugify } from "@/lib/slug";
import { resolvePublish } from "@/lib/publish";
import { CATEGORIES } from "@/lib/config";
import type { ArticleStatus } from "@/lib/types";

export type SaveResult =
  | { ok: true; id: string; slug: string }
  | { ok: false; error: string };

const STATUSES: ArticleStatus[] = ["draft", "published", "scheduled"];

/** RF-002/004/005: create or update an article. Re-checks admin (defense in
    depth on top of middleware + RLS). */
export async function saveArticle(
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  const admin = await getAdmin();
  if (!admin) return { ok: false, error: "Sessão expirada. Faça login novamente." };

  const id = (formData.get("id") as string) || null;
  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string) ?? "";
  const category = formData.get("category") as string;
  let status = formData.get("status") as ArticleStatus;
  const slugRaw = (formData.get("slug") as string)?.trim();
  const metaDescription = (formData.get("meta_description") as string)?.trim() || null;
  const keywords = (formData.get("keywords") as string)
    ?.split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  const coverUrl = (formData.get("cover_url") as string)?.trim() || null;
  const coverCredit = (formData.get("cover_credit") as string)?.trim() || null;
  const scheduledAt = (formData.get("published_at") as string) || null;

  if (!title) return { ok: false, error: "O título é obrigatório." };
  if (!CATEGORIES.some((c) => c.slug === category))
    return { ok: false, error: "Categoria inválida." };
  if (!STATUSES.includes(status)) status = "draft";

  const slug = slugify(slugRaw || title);
  if (!slug) return { ok: false, error: "Não foi possível gerar o slug." };

  const pub = resolvePublish(status, scheduledAt);
  if (!pub.ok) return { ok: false, error: pub.error };

  const supabase = await createClient();
  const row = {
    title,
    slug,
    content,
    category,
    status: pub.status,
    published_at: pub.published_at,
    meta_description: metaDescription,
    keywords: keywords && keywords.length ? keywords : null,
    cover_url: coverUrl,
    cover_credit: coverCredit,
  };

  const query = id
    ? supabase.from("articles").update(row).eq("id", id).select("id,slug").single()
    : supabase.from("articles").insert(row).select("id,slug").single();

  const { data, error } = await query;
  if (error) {
    if (error.code === "23505") return { ok: false, error: "Já existe um artigo com esse slug." };
    return { ok: false, error: error.message };
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${data.slug}`);
  revalidatePath("/admin");
  return { ok: true, id: data.id, slug: data.slug };
}

export async function deleteArticle(id: string): Promise<void> {
  const admin = await getAdmin();
  if (!admin) redirect("/entrar");
  const supabase = await createClient();
  await supabase.from("articles").delete().eq("id", id);
  revalidatePath("/blog");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/entrar");
}
