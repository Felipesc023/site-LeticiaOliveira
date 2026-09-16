import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/lib/types";
import type { CategorySlug } from "@/lib/config";

const LIST_FIELDS =
  "id,title,slug,category,cover_url,cover_credit,meta_description,published_at";

export type ArticleListItem = Pick<
  Article,
  | "id"
  | "title"
  | "slug"
  | "category"
  | "cover_url"
  | "cover_credit"
  | "meta_description"
  | "published_at"
>;

export const ARTICLES_PAGE_SIZE = 9;

export interface ArticlePage {
  items: ArticleListItem[];
  total: number;
  page: number;
  pageSize: number;
}

/** Published articles, newest first, paginated. RLS already hides
    drafts/future posts. */
export async function listArticles(
  category?: CategorySlug,
  page = 1,
): Promise<ArticlePage> {
  const supabase = await createClient();
  const from = (page - 1) * ARTICLES_PAGE_SIZE;
  const to = from + ARTICLES_PAGE_SIZE - 1;
  let q = supabase
    .from("articles")
    .select(LIST_FIELDS, { count: "exact" })
    .order("published_at", { ascending: false })
    .range(from, to);
  if (category) q = q.eq("category", category);
  const { data, error, count } = await q;
  if (error) throw error;
  return { items: data ?? [], total: count ?? 0, page, pageSize: ARTICLES_PAGE_SIZE };
}

/** All published slugs for the sitemap — unpaginated by design, this is a
    build/revalidate-time read, not a user-facing list. */
export async function listArticleSlugs(): Promise<
  Pick<ArticleListItem, "slug" | "published_at">[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("slug,published_at")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getArticle(slug: string): Promise<Article | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** Same-category siblings for the "related" strip (RF-007). */
export async function relatedArticles(
  article: Pick<Article, "id" | "category">,
  limit = 3,
): Promise<ArticleListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select(LIST_FIELDS)
    .eq("category", article.category)
    .neq("id", article.id)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}
