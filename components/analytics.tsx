"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/config";

const KEY = "lo-consent";

/** GA4 + GTM + LGPD consent banner (DESIGN.md §31/§32). Both only load after
    opt-in. No id configured for either → that script doesn't render. */
export function Analytics() {
  const [choice, setChoice] = useState<"granted" | "denied" | null>(null);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v === "granted" || v === "denied") setChoice(v);
    } catch {
      /* private mode — treat as undecided */
    }
  }, []);

  const decide = (v: "granted" | "denied") => {
    try {
      localStorage.setItem(KEY, v);
    } catch {
      /* ignore */
    }
    setChoice(v);
  };

  if (!SITE.gaId && !SITE.gtmId) return null;

  return (
    <>
      {choice === "granted" && (
        <>
          {SITE.gaId && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${SITE.gaId}`}
                strategy="afterInteractive"
              />
              <Script id="ga-init" strategy="afterInteractive">
                {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${SITE.gaId}',{anonymize_ip:true});`}
              </Script>
            </>
          )}
          {SITE.gtmId && (
            <Script id="gtm-init" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${SITE.gtmId}');`}
            </Script>
          )}
        </>
      )}

      {choice === null && (
        <div
          role="dialog"
          aria-label="Aviso de cookies"
          className="fixed inset-x-0 bottom-0 z-50 border-t hairline bg-card px-5 py-4 shadow-[0_-8px_24px_-12px_rgba(61,43,31,0.18)] md:px-20"
          style={{ animation: "rise-in 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <div className="mx-auto flex max-w-[var(--container-max)] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="max-w-2xl text-sm text-ink/80">
              Usamos cookies de análise (Google Analytics) para entender o uso do
              site. Veja a{" "}
              <a href="/politicas" className="underline underline-offset-2">
                Política de Privacidade
              </a>
              .
            </p>
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => decide("denied")}
                className="btn btn-secondary btn-sm"
              >
                Recusar
              </button>
              <button
                type="button"
                onClick={() => decide("granted")}
                className="btn btn-primary btn-sm"
              >
                Aceitar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
