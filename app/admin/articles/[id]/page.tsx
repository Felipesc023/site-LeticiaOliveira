import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArticleEditor } from "@/components/admin/article-editor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Editar artigo" };

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!article) notFound();

  return (
    <div>
      <h1 className="mb-8 font-serif text-2xl text-espresso">Editar artigo</h1>
      <ArticleEditor article={article} />
    </div>
  );
}
