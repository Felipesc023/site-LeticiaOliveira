import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { signOut } from "./actions";

export const metadata: Metadata = {
  title: { default: "Painel", template: "%s · Painel" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b hairline bg-card">
        <div className="mx-auto flex h-auto max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-3 sm:h-14 sm:flex-nowrap sm:py-0">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/admin" className="label-caps text-espresso">
              Painel
            </Link>
            <Link
              href="/admin/articles/new"
              title="Criar um novo artigo"
              aria-label="Criar novo artigo"
              className="label-caps text-hazel hover:text-espresso"
            >
              Novo artigo
            </Link>
            <Link
              href="/admin/leads"
              title="Ver os leads recebidos pelo site"
              aria-label="Ver leads"
              className="label-caps text-hazel hover:text-espresso"
            >
              Leads
            </Link>
            <Link
              href="/"
              target="_blank"
              title="Abrir o site público em outra aba"
              aria-label="Ver o site público"
              className="label-caps text-hazel hover:text-espresso"
            >
              Ver site
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-ink/50 md:block">{admin.email}</span>
            <form action={signOut}>
              <button
                title="Encerrar a sessão"
                aria-label="Sair da conta"
                className="label-caps text-[11px] text-hazel hover:text-espresso"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-5 sm:py-10">{children}</main>
    </div>
  );
}
