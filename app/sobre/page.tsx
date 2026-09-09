import type { Metadata } from "next";
import { Portrait } from "@/components/portrait";
import { whatsappUrl } from "@/lib/config";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Letícia Oliveira, advogada dedicada exclusivamente a leilões de imóveis judiciais e extrajudiciais, com atuação nacional.",
};

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-5 py-16 md:px-20 md:py-24">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <span className="label-caps">Curadoria &amp; advocacia pericial</span>
          <h1 className="mt-6 font-serif text-4xl leading-tight text-espresso md:text-5xl">
            Leilão de imóveis não é uma aposta de sorte. É leitura minuciosa de
            risco e técnica processual.
          </h1>

          {/* PLACEHOLDER — DESIGN.md §19 / §51: substituir pelo texto real da Letícia. */}
          <div className="prose-editorial mt-10 text-ink/80">
            <p>
              Sou Letícia Oliveira, advogada dedicada integralmente ao universo
              dos leilões de imóveis, atuando tanto em processos judiciais quanto
              extrajudiciais em todo o Brasil.
            </p>
            <p>
              Ao longo da minha trajetória, construí uma atuação focada em
              orientar investidores e famílias que buscam segurança jurídica
              antes, durante e depois da arrematação de um imóvel — traduzindo um
              processo naturalmente complexo em decisões claras e bem informadas.
            </p>
            <p>
              Minha abordagem une rigor técnico e proximidade: cada cliente
              recebe uma análise cuidadosa do caso, sem promessas fáceis, com
              foco em reduzir riscos e evitar surpresas. É essa mesma vocação
              para explicar o Direito de forma acessível que me levou a
              compartilhar conteúdo educativo nas redes sociais.
            </p>
          </div>

          <p className="mt-6 text-xs text-hazel">
            Texto provisório — será substituído pelo conteúdo definitivo enviado
            pela Letícia.
          </p>

          <a
            href={whatsappUrl("Olá, Letícia. Gostaria de conversar sobre um leilão de imóvel.")}
            target="_blank"
            rel="noopener noreferrer"
            className="label-caps mt-10 inline-block border border-espresso bg-espresso px-8 py-4 text-[12px] text-canvas transition-colors hover:bg-espresso-deep"
          >
            Conversar diretamente
          </a>
        </div>

        <div className="md:col-span-4 md:col-start-9">
          <Portrait
            name="sobre.jpg"
            alt="Retrato de Letícia Oliveira"
            className="aspect-[4/5]"
            priority
          />
          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="label-caps text-hazel">Especialidade</dt>
              <dd className="mt-1">Leilões imobiliários</dd>
            </div>
            <div>
              <dt className="label-caps text-hazel">Modelo</dt>
              <dd className="mt-1">100% digital / nacional</dd>
            </div>
            <div>
              <dt className="label-caps text-hazel">Abordagem</dt>
              <dd className="mt-1">Due diligence prévia</dd>
            </div>
            <div>
              <dt className="label-caps text-hazel">Registro</dt>
              <dd className="mt-1">OAB ativa</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
