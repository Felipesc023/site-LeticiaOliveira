import type { Metadata } from "next";
import { listArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/article-card";
import { CategoryFilter } from "@/components/category-filter";
import { CATEGORIES, type CategorySlug } from "@/lib/config";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artigos sobre leilões de imóveis judiciais e extrajudiciais: riscos, custos, matrícula, desocupação e viabilidade da arrematação.",
};

function asCategory(v: string | undefined): CategorySlug | undefined {
  return CATEGORIES.some((c) => c.slug === v) ? (v as CategorySlug) : undefined;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const category = asCategory(cat);
  const articles = await listArticles(category);

  return (
    <div className="mx-auto max-w-[var(--container-max)] px-5 py-16 md:px-20 md:py-24">
      <span className="label-caps">Guia editorial</span>
      <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-espresso md:text-5xl">
        Comprar imóveis em leilão com método, não com sorte.
      </h1>

      <div className="mt-10">
        <CategoryFilter active={category ?? ""} />
      </div>

      {articles.length === 0 ? (
        <p className="mt-16 text-ink/70">Nenhum artigo publicado nesta categoria ainda.</p>
      ) : (
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {articles.map((a, i) => (
            <ArticleCard key={a.id} article={a} priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
