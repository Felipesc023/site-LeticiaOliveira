import type { Metadata } from "next";
import { Portrait } from "@/components/portrait";
import { whatsappUrl } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Canal direto com a Dra. Letícia Oliveira via WhatsApp para triagem técnica e consultoria prévia de leilões de imóveis.",
};

const STEPS = [
  {
    n: "01",
    t: "Envio dos dados",
    d: "Envie o link do leilão, o edital, a matrícula ou o número do processo pelo WhatsApp.",
  },
  {
    n: "02",
    t: "Exame preliminar",
    d: "Análise prévia de viabilidade, riscos processuais e prazos fatais da praça.",
  },
  {
    n: "03",
    t: "Plano e atuação",
    d: "Alinhamento por videoconferência e emissão do parecer para arrematação segura.",
  },
];

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-5 py-16 md:px-20 md:py-24">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <span className="label-caps">Canal oficial direto</span>
          <h1 className="mt-6 font-serif text-4xl leading-tight text-espresso md:text-5xl">
            Triagem técnica e consultoria prévia para arrematação de imóveis.
          </h1>
          <p className="mt-6 font-serif text-xl italic text-ink/70">
            Diálogo reservado com a Dra. Letícia Oliveira. Sem intermediários,
            filas ou formulários extensos.
          </p>

          <div className="mt-10 border hairline bg-card p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="label-caps text-hazel">Canal aberto para triagem</span>
              <span className="label-caps text-hazel">Sigilo OAB</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink/75">
              Apresente os dados do leilão para receber uma avaliação de
              viabilidade jurídica com agilidade e profundidade técnica.
            </p>
            <a
              href={whatsappUrl(
                "Olá, Letícia. Gostaria de iniciar uma triagem de leilão. Segue o link/edital:",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="label-caps mt-6 inline-block border border-espresso bg-espresso px-8 py-4 text-[12px] text-canvas transition-colors hover:bg-espresso-deep"
            >
              Iniciar triagem pelo WhatsApp
            </a>
            <div className="mt-6 flex flex-wrap justify-between gap-2 border-t hairline pt-4 text-xs text-ink/60">
              <span>Retorno em até 2 horas úteis</span>
              <span>Atendimento em todo o Brasil</span>
            </div>
          </div>

          <div className="mt-12 grid gap-px border hairline bg-[rgba(61,43,31,0.12)] sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="bg-card p-6">
                <span className="font-serif text-3xl text-espresso">{s.n}</span>
                <h2 className="mt-2 font-serif text-lg text-espresso">{s.t}</h2>
                <p className="mt-2 text-xs leading-relaxed text-ink/70">{s.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-4 md:col-start-9">
          <Portrait
            name="contato.jpg"
            alt="Dra. Letícia Oliveira"
            className="aspect-[4/5]"
          />
          <div className="mt-6 space-y-4 text-sm">
            <div>
              <p className="label-caps text-hazel">Modalidade</p>
              <p className="mt-1">Videoconferência · atendimento digital</p>
            </div>
            <div>
              <p className="label-caps text-hazel">Horário de triagem</p>
              <p className="mt-1">Segunda a sexta, 9h às 18h30</p>
            </div>
            <div>
              <p className="label-caps text-hazel">Prazo urgente?</p>
              <p className="mt-1">
                Sinalize no início da mensagem a data do 1º ou 2º leilão para
                priorização.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
