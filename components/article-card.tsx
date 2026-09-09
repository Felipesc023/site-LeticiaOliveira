import Link from "next/link";
import { categoryLabel } from "@/lib/config";
import type { ArticleListItem } from "@/lib/articles";
import { CoverImage } from "@/components/cover-image";

export function ArticleCard({
  article,
  priority = false,
}: {
  article: ArticleListItem;
  priority?: boolean;
}) {
  return (
    <article className="group flex flex-col border hairline bg-card">
      <Link href={`/blog/${article.slug}`} className="block">
        <div className="aspect-[16/9] overflow-hidden border-b hairline">
          <CoverImage article={article} priority={priority} />
        </div>
        <div className="p-8">
          <span className="label-caps">{categoryLabel(article.category)}</span>
          <h3 className="mt-3 font-serif text-2xl leading-snug text-espresso transition-colors group-hover:text-hazel">
            {article.title}
          </h3>
          {article.meta_description && (
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              {article.meta_description}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
