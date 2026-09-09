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
            className={`label-caps border px-4 py-2 text-[11px] transition-colors ${
              isActive
                ? "border-espresso bg-espresso text-canvas"
                : "border-espresso/30 text-hazel hover:border-espresso"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
