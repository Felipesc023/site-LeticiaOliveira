import type { Metadata } from "next";
import { Send, SearchCheck, FileCheck2, Video, Clock, Zap, MessageCircle } from "lucide-react";
import { Portrait } from "@/components/portrait";
import { Reveal } from "@/components/reveal";
import { whatsappUrl } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Canal direto com a Dra. Letícia Oliveira via WhatsApp para triagem técnica e consultoria prévia de leilões de imóveis.",
};

const STEPS = [
  { icon: Send, t: "Envie os dados", d: "Link do leilão, edital, matrícula ou nº do processo." },
  { icon: SearchCheck, t: "Exame preliminar", d: "Viabilidade, riscos processuais e prazos fatais." },
  { icon: FileCheck2, t: "Plano e atuação", d: "Parecer e acompanhamento até a posse." },
];

const FACTS = [
  { icon: Video, label: "Modalidade", value: "Videoconferência · 100% digital" },
  { icon: Clock, label: "Horário", value: "Seg a sex, 9h às 18h30" },
  { icon: Zap, label: "Urgência", value: "Casos com praça marcada são priorizados" },
];

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-5 py-16 md:px-20 md:py-24">
      <div className="grid gap-14 md:grid-cols-12">
        <div className="md:col-span-7">
          <Reveal>
            <span className="label-caps">Canal oficial direto</span>
            <h1 className="mt-5 font-serif text-4xl leading-tight text-espresso md:text-5xl">
              Triagem técnica pelo WhatsApp
            </h1>
            <p className="mt-5 text-lg text-ink/70">
              Diálogo reservado com a Dra. Letícia Oliveira. Sem intermediários,
              filas ou formulários.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <a
              href={whatsappUrl(
                "Olá, Letícia. Gostaria de iniciar uma triagem de leilão. Segue o link/edital:",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 flex items-center gap-3 border border-espresso bg-espresso px-8 py-4 text-canvas transition-all duration-300 hover:bg-espresso-deep"
            >
              <MessageCircle size={18} />
              <span className="label-caps text-[12px]">Iniciar triagem</span>
              <span className="ml-auto text-xs text-canvas/60 transition-transform group-hover:translate-x-1">
                retorno em até 2h úteis →
              </span>
            </a>
          </Reveal>

          <div className="mt-14 grid gap-px border hairline bg-[rgba(61,43,31,0.12)] sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.t} delay={i * 90} className="bg-card p-6">
                <s.icon size={20} strokeWidth={1.4} className="text-hazel" />
                <h2 className="mt-4 font-serif text-lg text-espresso">
                  <span className="mr-2 text-hazel/50">0{i + 1}</span>
                  {s.t}
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-ink/60">{s.d}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={120} className="md:col-span-4 md:col-start-9">
          <Portrait name="contato.jpg" alt="Dra. Letícia Oliveira" className="aspect-[4/5]" />
          <dl className="mt-6 divide-y hairline border-y hairline">
            {FACTS.map((f) => (
              <div key={f.label} className="flex gap-3 py-3.5">
                <f.icon size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-hazel" />
                <div>
                  <dt className="label-caps text-[10px] text-hazel">{f.label}</dt>
                  <dd className="mt-0.5 text-sm text-ink/75">{f.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </div>
  );
}
