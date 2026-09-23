"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { Monogram } from "@/components/monogram";
import { SITE } from "@/lib/config";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

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

      {open && mounted &&
        createPortal(
          // Rendered straight into <body> — a CTA button living inside a
          // <Reveal> (which sets will-change:transform permanently, not just
          // mid-animation) turns that ancestor into the containing block for
          // any position:fixed descendant, shrinking the overlay down to the
          // button's own box instead of the full screen. A portal sidesteps
          // that regardless of which ancestor's CSS is responsible.
          <div
            className="overlay-enter fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-espresso-deep/50 p-4 backdrop-blur-sm sm:items-center sm:p-10"
            onClick={() => setOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Fale com a advogada"
              className="modal-enter grid w-full max-w-3xl overflow-hidden rounded-[28px] bg-canvas shadow-[0_30px_80px_-20px_rgba(35,31,32,0.45)] sm:grid-cols-[0.8fr_1.2fr]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Visual panel — the same warm gradient as the home hero, so the
                  pop-up reads as part of the same world instead of a bolted-on
                  system dialog. Short band on top for mobile, side panel on
                  larger screens. */}
              <div className="relative flex flex-row items-center gap-4 bg-gradient-to-br from-[#fbf9f6] to-[#cabeb5] px-6 py-6 sm:flex-col sm:items-start sm:justify-between sm:gap-0 sm:px-8 sm:py-10">
                <Monogram className="h-9 w-auto shrink-0 sm:h-10" />
                <div className="sm:mt-8">
                  <p className="font-serif text-lg leading-snug text-espresso sm:text-2xl">
                    Vamos conversar sobre o seu caso.
                  </p>
                  <p className="mt-2 hidden text-sm text-espresso/70 sm:block">
                    Leva menos de um minuto.
                  </p>
                </div>
                <p className="label-caps hidden text-[10px] text-espresso/60 sm:mt-auto sm:block">
                  Dra. Letícia Oliveira · {SITE.oab}
                </p>
              </div>

              <div className="relative p-6 sm:p-8">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  title="Fechar"
                  aria-label="Fechar formulário de contato"
                  className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-hazel transition-colors hover:bg-espresso/[0.06]"
                >
                  <X size={18} />
                </button>
                <LeadForm source={source} onSuccess={() => undefined} />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
