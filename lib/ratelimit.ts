// ponytail: in-memory fixed-window limiter, per server instance. The real
// abuse control is Cloudflare at the edge (DESIGN.md §33) — this is a cheap
// second layer so a stuck admin tab can't spin the AI routes.
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit = 20, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}
