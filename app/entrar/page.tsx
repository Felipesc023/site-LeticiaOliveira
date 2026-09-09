import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin";
import { GoogleSignIn } from "@/components/admin/google-sign-in";

export const metadata: Metadata = { title: "Acesso administrativo", robots: { index: false } };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  if (await getAdmin()) redirect("/admin");
  const { denied } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-5 py-24">
      <span className="label-caps">Painel editorial</span>
      <h1 className="mt-4 font-serif text-3xl text-espresso">Acesso restrito</h1>
      <p className="mt-3 text-sm text-ink/70">
        Entre com uma conta Google autorizada para gerenciar os artigos.
      </p>

      {denied === "1" && (
        <p className="mt-6 border-l-2 border-error pl-3 text-sm text-error">
          Esta conta não está autorizada a acessar o painel.
        </p>
      )}
      {denied === "0" && (
        <p className="mt-6 border-l-2 border-error pl-3 text-sm text-error">
          Não foi possível concluir o login. Tente novamente.
        </p>
      )}

      <div className="mt-8">
        <GoogleSignIn />
      </div>
    </div>
  );
}
