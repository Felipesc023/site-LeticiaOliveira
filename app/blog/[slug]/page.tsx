import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticle, relatedArticles } from "@/lib/articles";
import { renderArticle } from "@/lib/markdown";
import { categoryLabel, SITE, whatsappUrl } from "@/lib/config";
import { CoverImage } from "@/components/cover-image";
import { ArticleCard } from "@/components/article-card";
import { Reveal } from "@/components/reveal";
import { ShareButton } from "@/components/share-button";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Artigo não encontrado" };

  const url = `${SITE.url}/blog/${article.slug}`;
  return {
    title: article.title,
    description: article.meta_description ?? undefined,
    keywords: article.keywords ?? undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.meta_description ?? undefined,
      publishedTime: article.published_at ?? undefined,
    },
    twitter: { card: "summary_large_image", title: article.title },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const related = await relatedArticles(article);
  const url = `${SITE.url}/blog/${article.slug}`;
  const published = article.published_at
    ? new Date(article.published_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <article>
      <Reveal as="header" className="mx-auto max-w-3xl px-5 pt-14 md:pt-20">
        <div className="flex items-center gap-3">
          <Link
            href={`/blog?cat=${article.category}`}
            className="nav-link label-caps text-hazel"
          >
            {categoryLabel(article.category)}
          </Link>
          {published && (
            <span className="text-xs text-ink/50">· {published}</span>
          )}
        </div>
        <h1 className="mt-4 font-serif text-4xl leading-[1.12] text-espresso md:text-5xl">
          {article.title}
        </h1>
        {article.meta_description && (
          <p className="mt-5 font-serif text-xl italic text-ink/70">
            {article.meta_description}
          </p>
        )}
      </Reveal>

      <Reveal delay={100} className="mx-auto mt-10 max-w-4xl px-5">
        <div className="relative aspect-[16/9] border hairline">
          <CoverImage article={article} priority />
        </div>
        {article.cover_credit && (
          <p className="mt-2 text-xs text-ink/50">{article.cover_credit}</p>
        )}
      </Reveal>

      <div
        className="prose-editorial mx-auto mt-14 px-5"
        dangerouslySetInnerHTML={{ __html: renderArticle(article.content) }}
      />

      <div className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center gap-4 px-5">
        <ShareButton title={article.title} url={url} />
        <a
          href={whatsappUrl(
            `Olá, Letícia. Li o artigo "${article.title}" e gostaria de tirar uma dúvida.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="label-caps border border-espresso bg-espresso px-5 py-3 text-[11px] text-canvas transition-colors hover:bg-espresso-deep"
        >
          Analisar meu edital
        </a>
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-24 max-w-[var(--container-max)] px-5 md:px-20">
          <Reveal>
            <div className="border-t hairline pt-10">
              <span className="label-caps">Mesma categoria</span>
              <h2 className="mt-3 font-serif text-2xl text-espresso">
                Continue a leitura
              </h2>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {related.map((a, i) => (
              <Reveal key={a.id} delay={i * 80}>
                <ArticleCard article={a} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
