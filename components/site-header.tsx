"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Monogram } from "@/components/monogram";
import { whatsappUrl } from "@/lib/config";

const NAV = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
];

const WA_MSG = "Olá, Letícia. Gostaria de uma análise prévia de um edital de leilão.";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className="sticky top-0 z-40 border-b hairline backdrop-blur-md transition-colors duration-300"
      style={{
        animation: "rise-in 0.5s cubic-bezier(0.16,1,0.3,1) both",
        background: scrolled ? "rgba(251,249,246,0.9)" : "rgba(251,249,246,0.75)",
        boxShadow: scrolled ? "0 1px 12px rgba(61,43,31,0.06)" : "none",
      }}
    >
      <div
        className="mx-auto flex max-w-[var(--container-max)] items-center justify-between px-5 transition-all duration-300 md:px-20"
        style={{ height: scrolled ? "3.5rem" : "4.25rem" }}
      >
        <Link
          href="/"
          className="group flex items-center gap-3 text-espresso"
        >
          <Monogram className="h-9 w-auto transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-105" />
          <span className="hidden sm:block">
            <span className="block font-serif text-lg leading-none tracking-tight">
              Letícia Oliveira
            </span>
            <span className="label-caps block text-[10px]">Leilões de Imóveis</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-active={isActive(item.href)}
              className={`nav-link label-caps text-[11px] transition-colors hover:text-espresso ${
                isActive(item.href) ? "text-espresso" : "text-hazel"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={whatsappUrl(WA_MSG)}
            target="_blank"
            rel="noopener noreferrer"
            className="label-caps border border-espresso bg-espresso px-5 py-2.5 text-[11px] text-canvas transition-all duration-300 hover:bg-espresso-deep hover:tracking-[0.28em]"
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
          style={{ animation: "rise-in 0.35s ease both" }}
        >
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="label-caps block py-3 text-[12px] text-espresso"
              style={{ animation: `rise-in 0.4s ease both`, animationDelay: `${i * 40}ms` }}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={whatsappUrl(WA_MSG)}
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
