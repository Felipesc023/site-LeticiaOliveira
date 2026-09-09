import Link from "next/link";
import Image from "next/image";
import { whatsappUrl } from "@/lib/config";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 bg-espresso text-canvas/80">
      <div className="mx-auto max-w-[var(--container-max)] px-5 py-16 md:px-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Image
              src="/brand/lockup.png"
              alt="Letícia Oliveira Advocacia"
              width={640}
              height={543}
              className="h-28 w-auto"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Advocacia dedicada exclusivamente a leilões de imóveis judiciais e
              extrajudiciais, com atuação em todo o território nacional.
            </p>
          </div>

          <nav className="text-sm">
            <p className="label-caps mb-4 text-canvas/60">Navegação</p>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-canvas">Início</Link></li>
              <li><Link href="/sobre" className="hover:text-canvas">Sobre</Link></li>
              <li><Link href="/blog" className="hover:text-canvas">Blog</Link></li>
              <li><Link href="/contato" className="hover:text-canvas">Contato</Link></li>
              <li><Link href="/politicas" className="hover:text-canvas">Políticas</Link></li>
            </ul>
          </nav>

          <div className="text-sm">
            <p className="label-caps mb-4 text-canvas/60">Atendimento</p>
            <a
              href={whatsappUrl("Olá, Letícia. Gostaria de falar sobre um leilão de imóvel.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-canvas"
            >
              WhatsApp oficial
            </a>
            <p className="mt-4 text-canvas/60">Inscrição OAB ativa · Atendimento digital</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-2 border-t border-canvas/15 pt-6 text-xs text-canvas/50 sm:flex-row">
          <span>© {year} Letícia Oliveira Advocacia. Todos os direitos reservados.</span>
          <span>Atuação conforme o Código de Ética e Disciplina da OAB.</span>
        </div>
      </div>
    </footer>
  );
}
