import type { ArticleStatus } from "@/lib/types";

export type PublishResolution =
  | { ok: true; status: ArticleStatus; published_at: string | null }
  | { ok: false; error: string };

/** RF-004: turn the editor's status choice into a concrete (status, published_at)
    pair. A scheduled date in the past means "publish now". Pure — unit-tested. */
export function resolvePublish(
  status: ArticleStatus,
  scheduledAt: string | null,
  now: number = Date.now(),
): PublishResolution {
  if (status === "published") {
    return { ok: true, status: "published", published_at: new Date(now).toISOString() };
  }
  if (status === "scheduled") {
    if (!scheduledAt) return { ok: false, error: "Defina a data de publicação para agendar." };
    const when = new Date(scheduledAt);
    if (isNaN(when.getTime())) return { ok: false, error: "Data de agendamento inválida." };
    if (when.getTime() <= now) {
      return { ok: true, status: "published", published_at: when.toISOString() };
    }
    return { ok: true, status: "scheduled", published_at: when.toISOString() };
  }
  return { ok: true, status: "draft", published_at: null };
}
