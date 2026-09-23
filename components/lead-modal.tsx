"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { LeadForm } from "@/components/lead-form";

/** A CTA button that opens the lead form in a modal. Used wherever a page
    wants "Fale com a advogada" to capture contact details first, instead of
    jumping straight to WhatsApp (the floating WhatsApp button stays for
    visitors who'd rather talk directly). */
export function LeadModalTrigger({
  source,
  className,
  children,
}: {
  source: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Deixar seus dados para a Dra. Letícia Oliveira te retornar"
        aria-label="Abrir formulário de contato"
        className={className}
      >
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-espresso-deep/40 p-4 sm:items-center sm:p-10"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md border hairline bg-canvas"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b hairline px-5 py-3">
              <p className="label-caps text-hazel">Fale com a advogada</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                title="Fechar"
                aria-label="Fechar formulário de contato"
              >
                <X size={18} className="text-hazel" />
              </button>
            </div>
            <div className="p-5">
              <LeadForm source={source} onSuccess={() => undefined} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
