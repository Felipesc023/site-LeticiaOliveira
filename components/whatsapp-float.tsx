"use client";

import { whatsappUrl, SITE } from "@/lib/config";

/** Floating WhatsApp entry point (DESIGN.md §25). Minimal: a small green mark,
    gentle idle float, a brief pulse on load to catch the eye, then calm. */
export function WhatsappFloat() {
  if (!SITE.whatsapp) return null;
  return (
    <a
      href={whatsappUrl(
        "Olá, Letícia. Gostaria de uma análise prévia de um edital de leilão.",
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="group fixed bottom-5 right-5 z-40 float-idle [body.mobile-nav-open_&]:hidden"
    >
      <span
        className="flex h-12 w-12 items-center justify-center bg-[#25D366] text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-active:scale-95"
        style={{ borderRadius: "9999px", animation: "ring-pulse 2.2s ease-out 3" }}
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
          <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm0 18.2h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.09.81.82-3.01-.2-.31a8.24 8.24 0 0 1 12.8-10.2 8.19 8.19 0 0 1 2.42 5.84c0 4.54-3.7 8.24-8.25 8.24Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43l-.48-.01c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.25 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
        </svg>
      </span>
    </a>
  );
}
