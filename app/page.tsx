import Link from "next/link";
import { Gavel, ScrollText, ArrowRight, Quote } from "lucide-react";
import { listArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/article-card";
import { Portrait } from "@/components/portrait";
import { Reveal } from "@/components/reveal";
import { Parallax } from "@/components/parallax";
import { whatsappUrl } from "@/lib/config";

export const revalidate = 600;

const DOMAINS = [
  {
    icon: Gavel,
    tag: "Execução & juízo",
    title: "Leilões judiciais",
    text: "Nulidades processuais, intimações e passivos condominiais e tributários que acompanham o imóvel.",
  },
  {
    icon: ScrollText,
    tag: "Alienação fiduciária",
    title: "Leilões extrajudiciais",
    text: "Lei 9.514/97: regularidade da intimação, purgação da mora e consolidação da propriedade.",
  },
];

export default async function HomePage() {
  const articles = (await listArticles()).items.slice(0, 3);

  return (
    <>
      {/* Hero — asymmetric editorial grid (DESIGN.md §11) */}
      <section className="mx-auto max-w-[var(--container-max)] px-5 pb-16 pt-14 md:px-20 md:pb-24 md:pt-20">
        <div className="grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal>
              <span className="label-caps">Assessoria jurídica de alta precisão</span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-serif text-4xl leading-[1.08] text-espresso md:text-6xl">
                A arrematação segura começa na leitura do que o edital não diz.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-md text-lg text-ink/70">
                Auditoria prévia de leilões judiciais e extrajudiciais, antes de
                qualquer lance.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <a
                  href={whatsappUrl(
                    "Olá, Dra. Letícia. Gostaria de tirar uma dúvida sobre um leilão de imóvel.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  aria-label="Falar com a Dra. Letícia Oliveira pelo WhatsApp"
                  title="Falar com a advogada pelo WhatsApp"
                >
                  Fale com a advogada
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden />
                </a>
                <Link
                  href="/sobre"
                  className="nav-link label-caps pb-1 text-[12px] text-espresso"
                >
                  Conhecer a atuação
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal delay={120} className="md:col-span-4 md:col-start-9">
            <Parallax speed={0.08}>
              <Portrait
                name="home.jpg"
                alt="Letícia Oliveira, advogada especialista em leilões de imóveis"
                className="aspect-[4/5]"
                priority
              />
            </Parallax>
          </Reveal>
        </div>
      </section>

      {/* Statement band */}
      <section className="border-y hairline bg-subtle">
        <div className="mx-auto max-w-[var(--container-max)] px-5 py-16 md:px-20 md:py-24">
          <Reveal>
            <Quote size={40} className="text-hazel/40" strokeWidth={1} />
            <p className="mt-4 max-w-3xl font-serif text-2xl italic leading-snug text-espresso md:text-3xl">
              A rentabilidade de uma arrematação não decorre da audácia do lance,
              mas da frieza pericial de quem desfez cada risco antes da abertura
              do leilão.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Domains */}
      <section className="mx-auto max-w-[var(--container-max)] px-5 py-16 md:px-20 md:py-24">
        <Reveal>
          <span className="label-caps">Escopo restrito</span>
          <h2 className="mt-4 font-serif text-3xl text-espresso md:text-4xl">
            Duas frentes, uma especialidade
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {DOMAINS.map((d, i) => (
            <Reveal key={d.title} delay={i * 90} dir={i % 2 === 0 ? "left" : "right"} className="feature-card md:p-10">
              <span className="feature-card__icon">
                <d.icon size={20} strokeWidth={1.6} />
              </span>
              <span className="label-caps mt-5 block text-hazel">{d.tag}</span>
              <h3 className="mt-2 font-serif text-2xl text-espresso">{d.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/65">{d.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Blog entry point */}
      {articles.length > 0 && (
        <section className="mx-auto max-w-[var(--container-max)] px-5 pb-24 md:px-20">
          <Reveal>
            <div className="flex items-end justify-between border-b hairline pb-6">
              <div>
                <span className="label-caps">Conteúdo</span>
                <h2 className="mt-3 font-serif text-3xl text-espresso">
                  Orientações práticas
                </h2>
              </div>
              <Link
                href="/blog"
                className="nav-link label-caps pb-1 text-[11px] text-espresso"
              >
                Todos os artigos
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {articles.map((a, i) => (
              <Reveal key={a.id} delay={i * 80}>
                <ArticleCard article={a} priority={i === 0} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
