import type { MetadataRoute } from "next";
import { listArticleSlugs } from "@/lib/articles";
import { SITE } from "@/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/sobre", "/blog", "/contato", "/politicas"].map(
    (path) => ({
      url: `${SITE.url}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    }),
  );

  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = await listArticleSlugs();
    articleRoutes = articles.map((a) => ({
      url: `${SITE.url}/blog/${a.slug}`,
      lastModified: a.published_at ? new Date(a.published_at) : new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }));
  } catch {
    /* DB unreachable at build — ship the static routes */
  }

  return [...staticRoutes, ...articleRoutes];
}
