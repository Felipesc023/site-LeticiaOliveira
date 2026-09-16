"use client";

import { useState } from "react";

export function ShareButton({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — nothing else to do */
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      title="Compartilhar este artigo"
      aria-label="Compartilhar este artigo"
      className="btn btn-secondary btn-sm"
    >
      {copied ? "Link copiado" : "Compartilhar"}
    </button>
  );
}
