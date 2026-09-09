import Image from "next/image";
import { categoryLabel } from "@/lib/config";
import { Monogram } from "@/components/monogram";
import type { ArticleListItem } from "@/lib/articles";

/** RF-008: articles without an uploaded/stock cover fall back to a brand
    template — category tint + title + monogram. No AI photorealistic images. */
export function CoverImage({
  article,
  priority = false,
}: {
  article: Pick<ArticleListItem, "title" | "category" | "cover_url">;
  priority?: boolean;
}) {
  if (article.cover_url) {
    return (
      <Image
        src={article.cover_url}
        alt={article.title}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 640px"
        className="object-cover"
      />
    );
  }

  const judicial = article.category === "judicial";
  return (
    <div
      className={`relative flex h-full w-full flex-col justify-between p-7 ${
        judicial ? "bg-subtle text-espresso" : "bg-espresso text-canvas"
      }`}
    >
      <span className="label-caps opacity-80">
        {categoryLabel(article.category)}
      </span>
      <p className="font-serif text-xl leading-tight line-clamp-3">
        {article.title}
      </p>
      <Monogram
        className="h-7 w-7 self-end opacity-60"
        tone={judicial ? "dark" : "light"}
      />
    </div>
  );
}
