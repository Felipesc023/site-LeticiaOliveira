import type { Metadata } from "next";
import { ShieldCheck, Handshake, Scale, MapPin, BadgeCheck, Building2 } from "lucide-react";
import { Portrait } from "@/components/portrait";
import { Reveal } from "@/components/reveal";
import { whatsappUrl } from "@/lib/config";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Letícia Oliveira, advogada dedicada exclusivamente a leilões de imóveis judiciais e extrajudiciais, com atuação nacional.",
};

const PRINCIPLES = [
  { icon: ShieldCheck, t: "Rigor técnico", d: "Cada edital lido linha por linha, com o processo de origem auditado." },
  { icon: Handshake, t: "Proximidade", d: "Interlocução direta, sem intermediários, em linguagem clara." },
  { icon: Scale, t: "Sem promessas fáceis", d: "Análise honesta de risco — inclusive quando o caminho é não arrematar." },
];

const FACTS = [
  { icon: BadgeCheck, label: "Especialidade", value: "Leilões imobiliários" },
  { icon: Building2, label: "Modelo", value: "100% digital · nacional" },
  { icon: MapPin, label: "Registro", value: "OAB ativa" },
];

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-5 py-16 md:px-20 md:py-24">
      <div className="grid gap-14 md:grid-cols-12">
        <div className="md:col-span-7">
          <Reveal>
            <span className="label-caps">Advocacia pericial</span>
            <h1 className="mt-5 font-serif text-4xl leading-tight text-espresso md:text-5xl">
              Leilão de imóveis não é aposta de sorte. É leitura de risco.
            </h1>
          </Reveal>

          {/* PLACEHOLDER — DESIGN.md §19 / §51: substituir pelo texto real da Letícia. */}
          <Reveal delay={100}>
            <div className="prose-editorial mt-8 text-ink/75">
              <p>
                Sou Letícia Oliveira, dedicada integralmente aos leilões de
                imóveis — judiciais e extrajudiciais — em todo o Brasil.
              </p>
              <p>
                Oriento investidores e famílias que buscam segurança jurídica
                antes, durante e depois da arrematação, traduzindo um processo
                complexo em decisões claras.
              </p>
            </div>
            <p className="mt-3 text-xs text-hazel">
              Texto provisório — será substituído pelo conteúdo da Letícia.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-px border hairline bg-[rgba(61,43,31,0.12)] sm:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.t} delay={i * 90} className="bg-card p-6">
                <p.icon size={20} strokeWidth={1.4} className="text-hazel" />
                <h2 className="mt-4 font-serif text-lg text-espresso">{p.t}</h2>
                <p className="mt-1.5 text-xs leading-relaxed text-ink/60">{p.d}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <a
              href={whatsappUrl("Olá, Letícia. Gostaria de conversar sobre um leilão de imóvel.")}
              target="_blank"
              rel="noopener noreferrer"
              className="label-caps mt-10 inline-block border border-espresso bg-espresso px-8 py-4 text-[12px] text-canvas transition-colors hover:bg-espresso-deep"
            >
              Conversar diretamente
            </a>
          </Reveal>
        </div>

        <Reveal delay={140} className="md:col-span-4 md:col-start-9">
          <Portrait name="sobre.jpg" alt="Retrato de Letícia Oliveira" className="aspect-[4/5]" priority />
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
