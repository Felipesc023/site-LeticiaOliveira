import Link from "next/link";
import { listArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/article-card";
import { Portrait } from "@/components/portrait";
import { whatsappUrl } from "@/lib/config";

export const revalidate = 300;

export default async function HomePage() {
  const articles = (await listArticles()).slice(0, 3);

  return (
    <>
      {/* Hero — asymmetric editorial grid, not a 50/50 landing hero (DESIGN.md §11) */}
      <section className="mx-auto max-w-[var(--container-max)] px-5 pb-16 pt-16 md:px-20 md:pb-24 md:pt-24">
        <div className="grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <span className="label-caps">Assessoria jurídica de alta precisão</span>
            <h1 className="mt-6 font-serif text-4xl leading-[1.1] text-espresso md:text-6xl">
              A arrematação segura começa na leitura do que o edital não diz.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink/75">
              Auditoria prévia de leilões de imóveis judiciais e extrajudiciais:
              nulidades processuais, passivos ocultos e riscos de posse
              analisados antes de qualquer lance.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={whatsappUrl(
                  "Olá, Letícia. Gostaria de submeter um edital de leilão para análise prévia.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="label-caps border border-espresso bg-espresso px-9 py-4 text-[12px] text-canvas transition-colors hover:bg-espresso-deep"
              >
                Submeter edital para análise
              </a>
              <Link
                href="/sobre"
                className="label-caps border-b border-hazel pb-1 text-[12px] text-espresso"
              >
                Conhecer a atuação
              </Link>
            </div>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <Portrait
              name="home.jpg"
              alt="Letícia Oliveira, advogada especialista em leilões de imóveis"
              className="aspect-[4/5]"
              priority
            />
          </div>
        </div>
      </section>

      {/* Statement band */}
      <section className="border-y hairline bg-subtle">
        <div className="mx-auto max-w-[var(--container-max)] px-5 py-16 md:px-20 md:py-24">
          <p className="max-w-3xl font-serif text-2xl italic leading-snug text-espresso md:text-3xl">
            “A rentabilidade de uma arrematação não decorre da audácia do lance,
            mas da frieza pericial de quem desfez cada risco antes da abertura
            do leilão.”
          </p>
        </div>
      </section>

      {/* Domains */}
      <section className="mx-auto max-w-[var(--container-max)] px-5 py-16 md:px-20 md:py-24">
        <span className="label-caps">Escopo restrito e técnico</span>
        <h2 className="mt-4 font-serif text-3xl text-espresso md:text-4xl">
          Domínios jurídicos
        </h2>
        <div className="mt-12 grid gap-px border hairline bg-[rgba(61,43,31,0.12)] md:grid-cols-2">
          <div className="bg-card p-8 md:p-10">
            <span className="label-caps text-hazel">01 — Execução & Juízo</span>
            <h3 className="mt-3 font-serif text-2xl text-espresso">
              Leilões judiciais de imóveis
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-ink/70">
              Exame de nulidades processuais, citação do devedor, intimação de
              cônjuge e credores, e cálculo de passivos condominiais e
              tributários que acompanham o bem.
            </p>
          </div>
          <div className="bg-card p-8 md:p-10">
            <span className="label-caps text-hazel">02 — Alienação fiduciária</span>
            <h3 className="mt-3 font-serif text-2xl text-espresso">
              Leilões extrajudiciais de imóveis
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-ink/70">
              Atuação sob a Lei 9.514/97: regularidade da intimação, purgação da
              mora, consolidação da propriedade e conferência do procedimento do
              agente fiduciário.
            </p>
          </div>
        </div>
      </section>

      {/* Blog entry point */}
      {articles.length > 0 && (
        <section className="mx-auto max-w-[var(--container-max)] px-5 pb-24 md:px-20">
          <div className="flex items-end justify-between border-b hairline pb-6">
            <div>
              <span className="label-caps">Conteúdo</span>
              <h2 className="mt-3 font-serif text-3xl text-espresso">
                Orientações práticas
              </h2>
            </div>
            <Link
              href="/blog"
              className="label-caps border-b border-hazel pb-1 text-[11px] text-espresso"
            >
              Todos os artigos
            </Link>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {articles.map((a, i) => (
              <ArticleCard key={a.id} article={a} priority={i === 0} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
