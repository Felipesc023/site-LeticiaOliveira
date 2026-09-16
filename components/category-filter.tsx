import Link from "next/link";
import { CATEGORIES } from "@/lib/config";

/** Blog category filter (RF-006). Plain links + query param — no JS, no search. */
export function CategoryFilter({ active }: { active?: string }) {
  const tabs = [{ slug: "", label: "Todos" }, ...CATEGORIES];
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Filtrar por categoria">
      {tabs.map((t) => {
        const isActive = (active ?? "") === t.slug;
        return (
          <Link
            key={t.slug || "all"}
            href={t.slug ? `/blog?cat=${t.slug}` : "/blog"}
            aria-current={isActive ? "page" : undefined}
            title={`Filtrar artigos: ${t.label}`}
            className={`chip label-caps border px-4 py-2 text-[11px] ${
              isActive
                ? "border-transparent bg-hazel shadow-[0_6px_16px_-8px_rgba(140,98,73,0.55)]"
                : "border-espresso/15 text-hazel hover:border-hazel hover:bg-hazel/10"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
