export type ArticleStatus = "draft" | "published" | "scheduled";

/** Mirrors the `articles` table (see supabase/migrations). Fields from DESIGN.md §41. */
export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string; // markdown
  category: string; // 'judicial' | 'extrajudicial'
  cover_url: string | null;
  cover_credit: string | null; // attribution for Unsplash/Pexels (RN-006)
  meta_description: string | null;
  keywords: string[] | null;
  status: ArticleStatus;
  published_at: string | null; // ISO; publish gate for scheduled posts
  created_at: string;
  updated_at: string;
}

export type ArticleInput = Omit<
  Article,
  "id" | "created_at" | "updated_at"
>;

/** One AI editorial suggestion, anchored to a quoted snippet (RF-011). */
export interface AiComment {
  id: string;
  quote: string; // verbatim slice of the draft the note refers to
  comment: string; // the suggestion
  kind: "clareza" | "impacto" | "juridiquês" | "estrutura" | "outro";
}

export interface AiSeo {
  meta_description: string;
  slug: string;
  keywords: string[];
}
