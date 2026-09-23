import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Builds `/blog?cat=judicial&page=2`-style links, dropping `page` for page 1. */
function pageHref(basePath: string, params: Record<string, string | undefined>, page: number) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) qs.set(k, v);
  if (page > 1) qs.set("page", String(page));
  const s = qs.toString();
  return s ? `${basePath}?${s}` : basePath;
}

export function Pagination({
  basePath,
  params = {},
  page,
  pageSize,
  total,
  label = "Paginação de artigos",
}: {
  basePath: string;
  params?: Record<string, string | undefined>;
  page: number;
  pageSize: number;
  total: number;
  label?: string;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label={label}
      className="mt-14 flex items-center justify-center gap-2"
    >
      <Link
        href={pageHref(basePath, params, page - 1)}
        aria-label="Página anterior"
        title="Página anterior"
        aria-disabled={page <= 1}
        tabIndex={page <= 1 ? -1 : undefined}
        className={`chip flex h-9 w-9 items-center justify-center border border-espresso/30 text-hazel ${
          page <= 1 ? "pointer-events-none opacity-30" : "hover:border-espresso"
        }`}
      >
        <ChevronLeft size={15} aria-hidden />
      </Link>

      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={pageHref(basePath, params, p)}
          aria-label={`Ir para a página ${p}`}
          aria-current={p === page ? "page" : undefined}
          title={`Página ${p}`}
          className={`chip label-caps flex h-9 w-9 items-center justify-center border text-[11px] ${
            p === page
              ? "border-espresso bg-espresso text-canvas"
              : "border-espresso/30 text-hazel hover:border-espresso"
          }`}
        >
          {p}
        </Link>
      ))}

      <Link
        href={pageHref(basePath, params, page + 1)}
        aria-label="Próxima página"
        title="Próxima página"
        aria-disabled={page >= pageCount}
        tabIndex={page >= pageCount ? -1 : undefined}
        className={`chip flex h-9 w-9 items-center justify-center border border-espresso/30 text-hazel ${
          page >= pageCount ? "pointer-events-none opacity-30" : "hover:border-espresso"
        }`}
      >
        <ChevronRight size={15} aria-hidden />
      </Link>
    </nav>
  );
}
