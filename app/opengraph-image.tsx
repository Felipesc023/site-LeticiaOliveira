import { ImageResponse } from "next/og";
import { SITE } from "@/lib/config";
import { MONOGRAM_BASE64 } from "@/lib/monogram-base64";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = SITE.name;

/** Default OG image for every page that doesn't define its own (blog
    articles override this via app/blog/[slug]/opengraph-image.tsx). */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#3d2b1f",
          color: "#fbf9f6",
          padding: 80,
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/png;base64,${MONOGRAM_BASE64}`}
            width={72}
            height={76}
            style={{ filter: "brightness(0) invert(1)" }}
            alt=""
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 64, lineHeight: 1.1 }}>{SITE.name}</div>
          <div style={{ fontSize: 30, opacity: 0.75 }}>{SITE.role}</div>
        </div>
      </div>
    ),
    size,
  );
}
