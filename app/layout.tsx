import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { SITE } from "@/lib/config";
import { GtmNoscript } from "@/components/gtm-noscript";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsappFloat } from "@/components/whatsapp-float";
import { NavProgress } from "@/components/nav-progress";
import { Analytics } from "@/components/analytics";
import { OAuthCodeRedirect } from "@/components/oauth-code-redirect";
import "./globals.css";

const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.role}`,
    template: `%s · ${SITE.name}`,
  },
  description:
    "Assessoria jurídica especializada em leilões de imóveis judiciais e extrajudiciais, com atuação nacional. Análise de risco antes da arrematação.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.name,
    url: SITE.url,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <GtmNoscript />
        <OAuthCodeRedirect />
        <NavProgress />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <WhatsappFloat />
        <Analytics />
      </body>
    </html>
  );
}
