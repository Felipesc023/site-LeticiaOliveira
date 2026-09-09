import Image from "next/image";

/** Letícia Oliveira brand mark (símbolo isolado). `tone="light"` recolours it
    to white for dark surfaces via CSS — one asset, no duplicate file. */
export function Monogram({
  className = "h-8 w-8",
  tone = "dark",
  title = "Letícia Oliveira",
}: {
  className?: string;
  tone?: "dark" | "light";
  title?: string;
}) {
  return (
    <Image
      src="/brand/monogram.png"
      alt={title}
      width={240}
      height={254}
      className={className}
      style={tone === "light" ? { filter: "brightness(0) invert(1)" } : undefined}
      priority
    />
  );
}
