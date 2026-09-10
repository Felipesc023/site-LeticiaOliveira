"use client";

import { useEffect } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  TriangleAlert,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import { Callout, type CalloutKind } from "@/lib/tiptap/callout";

const EXTENSIONS = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    link: { openOnClick: false },
  }),
  Placeholder.configure({
    placeholder: "Cole ou escreva o rascunho aqui e clique em “Otimizar e formatar”.",
  }),
  Callout,
];

function Btn({
  on,
  active,
  title,
  children,
}: {
  on: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={on}
      title={title}
      aria-label={title}
      className={`flex h-8 w-8 items-center justify-center border hairline text-espresso transition-colors ${
        active ? "bg-espresso text-canvas" : "bg-card hover:bg-subtle"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const callout = (kind: CalloutKind) =>
    editor.chain().focus().toggleCallout(kind).run();

  return (
    <div className="flex flex-wrap items-center gap-1 border-b hairline bg-canvas p-2">
      <Btn title="Negrito" on={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
        <Bold size={15} />
      </Btn>
      <Btn title="Itálico" on={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
        <Italic size={15} />
      </Btn>
      <span className="mx-1 h-5 w-px bg-[rgba(61,43,31,0.15)]" />
      <Btn title="Título" on={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
        <Heading2 size={15} />
      </Btn>
      <Btn title="Subtítulo" on={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
        <Heading3 size={15} />
      </Btn>
      <Btn title="Lista" on={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
        <List size={15} />
      </Btn>
      <Btn title="Lista numerada" on={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
        <ListOrdered size={15} />
      </Btn>
      <Btn title="Citação" on={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
        <Quote size={15} />
      </Btn>
      <Btn
        title="Link"
        on={() => {
          const prev = editor.getAttributes("link").href as string | undefined;
          const url = window.prompt("Endereço do link:", prev ?? "https://");
          if (url === null) return;
          if (url === "") editor.chain().focus().unsetLink().run();
          else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }}
        active={editor.isActive("link")}
      >
        <Link2 size={15} />
      </Btn>
      <span className="mx-1 h-5 w-px bg-[rgba(61,43,31,0.15)]" />
      <Btn title="Aviso legal" on={() => callout("aviso")} active={editor.isActive("callout", { kind: "aviso" })}>
        <TriangleAlert size={15} />
      </Btn>
      <Btn title="Dica prática" on={() => callout("dica")} active={editor.isActive("callout", { kind: "dica" })}>
        <Lightbulb size={15} />
      </Btn>
      <Btn title="Dicionário técnico" on={() => callout("dicionario")} active={editor.isActive("callout", { kind: "dicionario" })}>
        <BookOpen size={15} />
      </Btn>
    </div>
  );
}

/** Controlled-ish rich text editor. Normal typing keeps `html` === editor HTML,
    so the sync effect no-ops; it only fires when the parent swaps content
    wholesale (e.g. after the AI "Otimizar e formatar"). */
export function RichEditor({
  html,
  onChange,
}: {
  html: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: EXTENSIONS,
    content: html || "<p></p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose-editorial min-h-[420px] px-5 py-4 outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (html && html !== current) {
      editor.commands.setContent(html, { emitUpdate: false });
    }
  }, [html, editor]);

  if (!editor) {
    return <div className="min-h-[470px] border hairline bg-card" />;
  }

  return (
    <div className="border hairline bg-card">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
