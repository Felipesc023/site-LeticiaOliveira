import type { Metadata } from "next";
import { Send, SearchCheck, FileCheck2, Video, Clock, Zap, Phone, Mail } from "lucide-react";
import { Portrait } from "@/components/portrait";
import { Reveal } from "@/components/reveal";
import { Parallax } from "@/components/parallax";
import { SITE } from "@/lib/config";

const ADMIN_EMAIL = "leticiafeolii@gmail.com";

function formatPhone(raw: string): string {
  const m = raw.match(/^55(\d{2})(\d{5})(\d{4})$/);
  return m ? `+55 (${m[1]}) ${m[2]}-${m[3]}` : raw;
}

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Canal direto com a Dra. Letícia Oliveira via WhatsApp para triagem técnica e consultoria prévia de leilões de imóveis.",
};

const STEPS = [
  { icon: Send, t: "Você compartilha o caso", d: "Link do leilão, edital, matrícula ou número do processo." },
  { icon: SearchCheck, t: "Análise preliminar", d: "Viabilidade, riscos processuais e prazos que correm." },
  { icon: FileCheck2, t: "Acompanhamento", d: "Parecer e atuação até a posse do imóvel." },
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
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="feature-card">
                <span className="feature-card__icon">
                  <Phone size={18} strokeWidth={1.6} />
                </span>
                <p className="label-caps mt-4 text-[10px] text-hazel">Telefone</p>
                <p className="mt-1 font-serif text-lg text-espresso">{formatPhone(SITE.whatsapp)}</p>
              </div>
              <div className="feature-card">
                <span className="feature-card__icon">
                  <Mail size={18} strokeWidth={1.6} />
                </span>
                <p className="label-caps mt-4 text-[10px] text-hazel">E-mail</p>
                <p className="mt-1 break-all font-serif text-lg text-espresso">{ADMIN_EMAIL}</p>
              </div>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal
                key={s.t}
                delay={i * 90}
                dir={i % 2 === 0 ? "left" : "right"}
                className={`feature-card ${i === STEPS.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              >
                <span className="feature-card__icon">
                  <s.icon size={18} strokeWidth={1.6} />
                </span>
                <h2 className="mt-4 font-serif text-lg text-espresso">{s.t}</h2>
                <p className="mt-1.5 text-xs leading-relaxed text-ink/60">{s.d}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={120} className="md:col-span-4 md:col-start-9">
          <Parallax speed={0.08}>
            <Portrait name="contato.jpg" alt="Dra. Letícia Oliveira" className="aspect-[4/5]" />
          </Parallax>
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
