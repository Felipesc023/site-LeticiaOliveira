"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Painel", title: "Ver todos os artigos" },
  { href: "/admin/articles/new", label: "Novo artigo", title: "Criar um novo artigo" },
  { href: "/admin/leads", label: "Leads", title: "Ver os leads recebidos pelo site" },
];

export function AdminNav() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <div className="flex items-center gap-4 sm:gap-6">
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          title={item.title}
          aria-label={item.title}
          data-active={isActive(item.href)}
          className={`nav-link label-caps py-1 transition-colors ${
            isActive(item.href) ? "text-espresso" : "text-hazel hover:text-espresso"
          }`}
        >
          {item.label}
        </Link>
      ))}
      <Link
        href="/"
        target="_blank"
        title="Abrir o site público em outra aba"
        aria-label="Ver o site público"
        className="label-caps text-hazel hover:text-espresso"
      >
        Ver site ↗
      </Link>
    </div>
  );
}
