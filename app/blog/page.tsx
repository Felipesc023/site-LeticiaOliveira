import type { Metadata } from "next";
import { listArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/article-card";
import { CategoryFilter } from "@/components/category-filter";
import { Pagination } from "@/components/pagination";
import { Reveal } from "@/components/reveal";
import { CATEGORIES, type CategorySlug } from "@/lib/config";

export const revalidate = 600;

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
  searchParams: Promise<{ cat?: string; page?: string }>;
}) {
  const { cat, page: pageParam } = await searchParams;
  const category = asCategory(cat);
  const page = Math.max(1, Number(pageParam) || 1);
  const { items: articles, total, pageSize } = await listArticles(category, page);

  return (
    <div className="mx-auto max-w-[var(--container-max)] px-5 py-16 md:px-20 md:py-24">
      <Reveal>
        <span className="label-caps">Guia editorial</span>
        <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-espresso md:text-5xl">
          Comprar imóveis em leilão com método, não com sorte.
        </h1>
        <div className="mt-10">
          <CategoryFilter active={category ?? ""} />
        </div>
      </Reveal>

      {articles.length === 0 ? (
        <p className="mt-16 text-ink/70">Nenhum artigo publicado nesta categoria ainda.</p>
      ) : (
        <>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {articles.map((a, i) => (
              <Reveal key={a.id} delay={(i % 3) * 80}>
                <ArticleCard article={a} priority={i < 3} />
              </Reveal>
            ))}
          </div>
          <Pagination
            basePath="/blog"
            params={{ cat: category }}
            page={page}
            pageSize={pageSize}
            total={total}
          />
        </>
      )}
    </div>
  );
}
