import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";
import { getArticle } from "@/lib/articles";
import { categoryLabel } from "@/lib/config";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Letícia Oliveira — Leilões de Imóveis";

const monogram = fs
  .readFileSync(path.join(process.cwd(), "public/brand/monogram.png"))
  .toString("base64");

/** Brand-template OG image (DESIGN.md §21): title + category tint + monogram. */
export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  const judicial = article?.category === "judicial";
  const bg = judicial ? "#f4efea" : "#3d2b1f";
  const fg = judicial ? "#3d2b1f" : "#fbf9f6";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: bg,
          color: fg,
          padding: 80,
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 24, letterSpacing: 6, textTransform: "uppercase" }}>
            {article ? categoryLabel(article.category) : "Blog"}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/png;base64,${monogram}`}
            width={64}
            height={68}
            style={judicial ? {} : { filter: "brightness(0) invert(1)" }}
            alt=""
          />
        </div>
        <div style={{ fontSize: 60, lineHeight: 1.15, maxWidth: 1000 }}>
          {article?.title ?? "Leilões de Imóveis"}
        </div>
        <div style={{ fontSize: 26 }}>Letícia Oliveira Advocacia</div>
      </div>
    ),
    size,
  );
}
