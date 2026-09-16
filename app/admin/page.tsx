import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { categoryLabel } from "@/lib/config";
import { Pagination } from "@/components/pagination";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

const STATUS_LABEL: Record<string, string> = {
  draft: "Rascunho",
  published: "Publicado",
  scheduled: "Agendado",
};

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const from = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();
  const { data: articles, count } = await supabase
    .from("articles")
    .select("id,title,category,status,published_at,updated_at", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-espresso">Artigos</h1>
        <Link
          href="/admin/articles/new"
          title="Criar um novo artigo"
          aria-label="Criar novo artigo"
          className="btn btn-primary btn-sm"
        >
          Novo artigo
        </Link>
      </div>

      <div className="mt-8 border hairline bg-card">
        {(articles ?? []).length === 0 && (
          <p className="p-6 text-sm text-ink/60">Nenhum artigo ainda.</p>
        )}
        {(articles ?? []).map((a) => (
          <Link
            key={a.id}
            href={`/admin/articles/${a.id}`}
            className="flex items-center justify-between gap-4 border-b hairline px-6 py-4 last:border-b-0 hover:bg-subtle"
          >
            <div className="min-w-0">
              <p className="truncate font-serif text-lg text-espresso">{a.title}</p>
              <p className="mt-0.5 text-xs text-ink/50">
                {categoryLabel(a.category)}
                {a.published_at &&
                  ` · ${new Date(a.published_at).toLocaleDateString("pt-BR")}`}
              </p>
            </div>
            <span
              className={`label-caps shrink-0 text-[10px] ${
                a.status === "published" ? "text-hazel" : "text-ink/40"
              }`}
            >
              {STATUS_LABEL[a.status] ?? a.status}
            </span>
          </Link>
        ))}
      </div>

      <Pagination basePath="/admin" page={page} pageSize={PAGE_SIZE} total={count ?? 0} />
    </div>
  );
}
