import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
    <article className="lift group flex h-full flex-col border hairline bg-card hover:border-espresso">
      <Link href={`/blog/${article.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/9] overflow-hidden border-b hairline">
          <div className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
            <CoverImage article={article} priority={priority} />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-8">
          <span className="label-caps">{categoryLabel(article.category)}</span>
          <h3 className="mt-3 font-serif text-2xl leading-snug text-espresso transition-colors group-hover:text-hazel">
            {article.title}
          </h3>
          {article.meta_description && (
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              {article.meta_description}
            </p>
          )}
          <span className="mt-5 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-hazel opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Ler artigo <ArrowUpRight size={13} />
          </span>
        </div>
      </Link>
    </article>
  );
}
