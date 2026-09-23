"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/ratelimit";

export type LeadResult = { ok: true } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Public lead form submission. Next.js Server Actions already reject
    cross-origin POSTs (built-in CSRF protection), so no token handling needed
    here. Layered anti-spam: a honeypot field bots fill but humans never see,
    a minimum fill time (bots submit instantly), and a per-IP rate limit —
    all free, no third-party CAPTCHA key to manage. */
export async function submitLead(
  _prev: LeadResult | null,
  formData: FormData,
): Promise<LeadResult> {
  if ((formData.get("website") as string)?.trim()) {
    // Honeypot tripped — pretend success so the bot doesn't learn to avoid it.
    return { ok: true };
  }

  const startedAt = Number(formData.get("startedAt"));
  if (!startedAt || Date.now() - startedAt < 2000) {
    return { ok: false, error: "Envio rápido demais. Tente novamente." };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (!rateLimit(`lead:${ip}`, 5, 10 * 60_000)) {
    return { ok: false, error: "Muitas tentativas. Aguarde alguns minutos e tente de novo." };
  }

  const name = ((formData.get("name") as string) || "").trim().slice(0, 120);
  const phone = ((formData.get("phone") as string) || "").trim().slice(0, 30);
  const email = ((formData.get("email") as string) || "").trim().slice(0, 160);
  const reason = formData.get("reason") === "arrematacao" ? "arrematacao" : "outro";
  const investmentRange =
    reason === "arrematacao"
      ? ((formData.get("investment_range") as string) || "").trim().slice(0, 60) || null
      : null;
  const source = ((formData.get("source") as string) || "").trim().slice(0, 60) || null;

  if (name.length < 2) return { ok: false, error: "Informe seu nome." };
  if (phone.replace(/\D/g, "").length < 10) {
    return { ok: false, error: "Informe um telefone válido, com DDD." };
  }
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Informe um e-mail válido." };

  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert({
    name,
    phone,
    email,
    reason,
    investment_range: investmentRange,
    source,
  });

  if (error) {
    // Real cause stays server-side only — never echoed to the visitor.
    console.error("leads:insert", error);
    return { ok: false, error: "Não foi possível enviar agora. Tente novamente em instantes." };
  }

  return { ok: true };
}
