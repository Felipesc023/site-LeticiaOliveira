export const SITE = {
  name: "Letícia Oliveira",
  role: "Advocacia em Leilões de Imóveis",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "",
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
} as const;

export const CATEGORIES = [
  { slug: "judicial", label: "Leilão Judicial" },
  { slug: "extrajudicial", label: "Leilão Extrajudicial" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

/** RN-005: WhatsApp is the only contact channel. Prefills a message when given. */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Admin allowlist (RF-001). Enforced here and again by RLS in the DB. */
export function adminAllowlist(): string[] {
  return (process.env.ADMIN_ALLOWLIST ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && adminAllowlist().includes(email.toLowerCase());
}
