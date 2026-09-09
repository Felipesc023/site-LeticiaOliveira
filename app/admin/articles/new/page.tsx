import { ArticleEditor } from "@/components/admin/article-editor";

export const metadata = { title: "Novo artigo" };

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="mb-8 font-serif text-2xl text-espresso">Novo artigo</h1>
      <ArticleEditor />
    </div>
  );
}
