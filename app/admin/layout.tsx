import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { AdminNav } from "@/components/admin/admin-nav";
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
          <AdminNav />
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
