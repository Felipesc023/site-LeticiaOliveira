import Link from "next/link";

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
      <Link
        href="/"
        className="label-caps mt-8 inline-block w-fit border border-espresso px-6 py-3 text-[11px] text-espresso transition-colors hover:bg-espresso hover:text-canvas"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
