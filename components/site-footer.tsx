import Link from "next/link";
import Image from "next/image";
import { whatsappUrl } from "@/lib/config";
import { Reveal } from "@/components/reveal";

const NAV = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
  { href: "/politicas", label: "Políticas" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 bg-espresso text-canvas/80">
      <Reveal className="mx-auto max-w-[var(--container-max)] px-5 py-16 md:px-20">
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
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="inline-block transition-all duration-300 hover:translate-x-1 hover:text-canvas"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="text-sm">
            <p className="label-caps mb-4 text-canvas/60">Atendimento</p>
            <a
              href={whatsappUrl("Olá, Dra. Letícia. Gostaria de tirar uma dúvida.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-canvas"
              aria-label="Falar com a Dra. Letícia Oliveira pelo WhatsApp"
              title="Falar pelo WhatsApp"
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
      </Reveal>
    </footer>
  );
}
