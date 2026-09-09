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
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="label-caps text-espresso">
              Painel editorial
            </Link>
            <Link href="/admin/articles/new" className="label-caps text-hazel hover:text-espresso">
              Novo artigo
            </Link>
            <Link href="/" className="label-caps text-hazel hover:text-espresso" target="_blank">
              Ver site
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-ink/50 sm:block">{admin.email}</span>
            <form action={signOut}>
              <button className="label-caps text-[11px] text-hazel hover:text-espresso">
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
    </div>
  );
}
