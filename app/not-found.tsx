import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-2xl flex-col justify-center px-5 py-24">
      <span className="label-caps">Erro 404</span>
      <h1 className="mt-4 font-serif text-4xl text-espresso">
        Esta página não existe.
      </h1>
      <p className="mt-4 text-ink/70">
        O endereço pode ter mudado ou o conteúdo foi removido.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" title="Voltar à página inicial" aria-label="Voltar à página inicial" className="btn btn-primary btn-sm">
          Voltar ao início
        </Link>
        <Link href="/blog" title="Ver os artigos do blog" aria-label="Ver o blog" className="btn btn-secondary btn-sm">
          Ver o blog
        </Link>
      </div>
    </div>
  );
}
