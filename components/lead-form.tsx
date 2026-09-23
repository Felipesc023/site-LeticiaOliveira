"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { submitLead, type LeadResult } from "@/app/actions/leads";

const INVESTMENT_RANGES = [
  "Até R$ 150 mil",
  "R$ 150 mil a R$ 300 mil",
  "R$ 300 mil a R$ 500 mil",
  "Acima de R$ 500 mil",
  "Ainda não sei",
];

/** Public lead capture form. `source` tags where it was opened from (visible
    only to the admin, in the leads list) so Letícia knows which CTA works. */
export function LeadForm({ source, onSuccess }: { source: string; onSuccess?: () => void }) {
  const [state, formAction, pending] = useActionState<LeadResult | null, FormData>(
    submitLead,
    null,
  );
  const [reason, setReason] = useState<"arrematacao" | "outro">("arrematacao");
  const startedAtRef = useRef(Date.now());

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (state?.ok) onSuccess?.();
  }, [state, onSuccess]);

  if (state?.ok) {
    return (
      <div className="border hairline bg-card p-6 text-center">
        <p className="font-serif text-lg text-espresso">Recebemos seus dados.</p>
        <p className="mt-2 text-sm text-ink/65">
          A Dra. Letícia Oliveira vai entrar em contato em breve.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="startedAt" value={startedAtRef.current} />
      {/* Honeypot — hidden from sighted and screen-reader users, bots fill it anyway. */}
      <div className="absolute left-[-9999px] top-auto" aria-hidden="true">
        <label htmlFor="lead-website">Não preencher</label>
        <input id="lead-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <LeadField label="Nome">
        <input
          name="name"
          required
          autoComplete="name"
          className="w-full border hairline bg-card px-3 py-2.5 text-sm outline-none focus:border-espresso"
        />
      </LeadField>

      <div className="grid gap-4 sm:grid-cols-2">
        <LeadField label="Telefone (com DDD)">
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="(11) 91234-5678"
            className="w-full border hairline bg-card px-3 py-2.5 text-sm outline-none focus:border-espresso"
          />
        </LeadField>
        <LeadField label="E-mail">
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full border hairline bg-card px-3 py-2.5 text-sm outline-none focus:border-espresso"
          />
        </LeadField>
      </div>

      <LeadField label="Sobre o que você quer falar?">
        <select
          name="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value as "arrematacao" | "outro")}
          className="w-full border hairline bg-card px-3 py-2.5 text-sm outline-none focus:border-espresso"
        >
          <option value="arrematacao">Arrematação de imóvel em leilão</option>
          <option value="outro">Outro assunto</option>
        </select>
      </LeadField>

      {reason === "arrematacao" && (
        <LeadField label="Quanto pretende investir na arrematação?">
          <select
            name="investment_range"
            defaultValue=""
            className="w-full border hairline bg-card px-3 py-2.5 text-sm outline-none focus:border-espresso"
          >
            <option value="" disabled>
              Selecione uma faixa
            </option>
            {INVESTMENT_RANGES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </LeadField>
      )}

      {state && !state.ok && (
        <p className="border-l-2 border-error pl-3 text-sm text-error">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        title="Enviar seus dados para a Dra. Letícia Oliveira"
        aria-label="Enviar formulário de contato"
        className="btn btn-primary w-full disabled:opacity-50"
      >
        {pending ? "Enviando…" : "Quero ser contatado"}
        <Send size={14} aria-hidden />
      </button>
      <p className="text-center text-[11px] leading-relaxed text-ink/45">
        Seus dados são usados só para este contato, nunca compartilhados com terceiros.
      </p>
    </form>
  );
}

function LeadField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-caps mb-1.5 block text-hazel">{label}</span>
      {children}
    </label>
  );
}
