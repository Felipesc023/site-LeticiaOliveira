import Image from "next/image";
import fs from "node:fs";
import path from "node:path";

/** Renders a portrait from /public/leticia/<name> when the file exists,
    otherwise a labelled placeholder. DESIGN.md §12 lists which photo goes where:
      home.jpg  → Foto 3 (perfil 3/4, editorial)
      sobre.jpg → Foto 2 (retrato de frente)
    Drop the treated files into public/leticia/ to replace the placeholder. */
export function Portrait({
  name,
  alt,
  className = "",
  priority = false,
}: {
  name: "home.jpg" | "sobre.jpg" | "contato.jpg";
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const exists = fs.existsSync(
    path.join(process.cwd(), "public", "leticia", name),
  );

  return (
    <div className={`group relative overflow-hidden border hairline bg-subtle ${className}`}>
      {exists ? (
        <Image
          src={`/leticia/${name}`}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 520px"
          className="object-cover transition-transform duration-[1200ms] ease-out motion-safe:group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-full min-h-[420px] w-full items-center justify-center p-8 text-center">
          <span className="label-caps text-hazel">
            Retrato · adicionar public/leticia/{name}
          </span>
        </div>
      )}
    </div>
  );
}
