import { createClient } from "@/lib/supabase/server";
import { Pagination } from "@/components/pagination";
import { toggleLeadStatus } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

const REASON_LABEL: Record<string, string> = {
  arrematacao: "Arrematação de imóvel",
  outro: "Outro assunto",
};

const SOURCE_LABEL: Record<string, string> = {
  home_hero: "Início · botão principal",
  contato_page: "Página de contato",
};

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const from = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();
  const { data: leads, count } = await supabase
    .from("leads")
    .select("id,name,phone,email,reason,investment_range,source,status,created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  return (
    <div>
      <h1 className="font-serif text-2xl text-espresso">Leads</h1>
      <p className="mt-1 text-sm text-ink/55">
        Pessoas que deixaram os dados pelo site pra você entrar em contato.
      </p>

      <div className="mt-8 border hairline bg-card">
        {(leads ?? []).length === 0 && (
          <p className="p-6 text-sm text-ink/60">Nenhum lead ainda.</p>
        )}
        {(leads ?? []).map((l) => (
          <div
            key={l.id}
            className="flex flex-col gap-3 border-b hairline px-6 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <p className="font-serif text-lg text-espresso">{l.name}</p>
                <span
                  className={`label-caps text-[9px] ${l.status === "novo" ? "text-hazel" : "text-ink/35"}`}
                >
                  {l.status === "novo" ? "Novo" : "Contatado"}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-ink/70">
                {l.phone} · {l.email}
              </p>
              <p className="mt-0.5 text-xs text-ink/50">
                {REASON_LABEL[l.reason] ?? l.reason}
                {l.investment_range && ` · ${l.investment_range}`}
                {l.source && ` · ${SOURCE_LABEL[l.source] ?? l.source}`}
                {" · "}
                {new Date(l.created_at).toLocaleString("pt-BR")}
              </p>
            </div>
            <form action={toggleLeadStatus.bind(null, l.id, l.status)}>
              <button
                type="submit"
                title={l.status === "novo" ? "Marcar como contatado" : "Marcar como novo"}
                aria-label={l.status === "novo" ? "Marcar lead como contatado" : "Marcar lead como novo"}
                className="btn btn-ghost btn-sm shrink-0"
              >
                {l.status === "novo" ? "Marcar como contatado" : "Marcar como novo"}
              </button>
            </form>
          </div>
        ))}
      </div>

      <Pagination
        basePath="/admin/leads"
        page={page}
        pageSize={PAGE_SIZE}
        total={count ?? 0}
        label="Paginação de leads"
      />
    </div>
  );
}
