import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { categoryLabel } from "@/lib/config";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  draft: "Rascunho",
  published: "Publicado",
  scheduled: "Agendado",
};

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("id,title,category,status,published_at,updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-espresso">Artigos</h1>
        <Link
          href="/admin/articles/new"
          className="label-caps border border-espresso bg-espresso px-5 py-2.5 text-[11px] text-canvas"
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
    </div>
  );
}
