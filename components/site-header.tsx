"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Monogram } from "@/components/monogram";
import { whatsappUrl } from "@/lib/config";

const NAV = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b hairline bg-canvas/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[var(--container-max)] items-center justify-between px-5 md:px-20">
        <Link
          href="/"
          className="flex items-center gap-3 text-espresso"
          onClick={() => setOpen(false)}
        >
          <Monogram className="h-9 w-auto" />
          <span className="hidden sm:block">
            <span className="block font-serif text-lg leading-none tracking-tight">
              Letícia Oliveira
            </span>
            <span className="label-caps block text-[10px]">
              Leilões de Imóveis
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`label-caps text-[11px] transition-colors hover:text-espresso ${
                isActive(item.href) ? "text-espresso" : "text-hazel"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={whatsappUrl("Olá, Letícia. Gostaria de uma análise prévia de um edital de leilão.")}
            target="_blank"
            rel="noopener noreferrer"
            className="label-caps border border-espresso bg-espresso px-5 py-3 text-[11px] text-canvas transition-colors hover:bg-espresso-deep"
          >
            WhatsApp
          </a>
        </nav>

        <button
          type="button"
          className="label-caps text-[11px] text-espresso md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Fechar" : "Menu"}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t hairline bg-canvas px-5 py-4 md:hidden"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="label-caps block py-3 text-[12px] text-espresso"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={whatsappUrl("Olá, Letícia. Gostaria de uma análise prévia de um edital de leilão.")}
            target="_blank"
            rel="noopener noreferrer"
            className="label-caps mt-2 block border border-espresso bg-espresso px-5 py-3 text-center text-[11px] text-canvas"
          >
            Falar no WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
