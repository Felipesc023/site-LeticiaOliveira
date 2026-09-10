import { Node, mergeAttributes } from "@tiptap/core";

export type CalloutKind = "aviso" | "dica" | "dicionario";

export const CALLOUT_LABEL: Record<CalloutKind, string> = {
  aviso: "Aviso legal",
  dica: "Dica prática",
  dicionario: "Dicionário técnico",
};

/** A block that wraps paragraphs, serialised as
    `<aside data-callout="aviso">…</aside>`. The visual label + colour come from
    CSS on `[data-callout]`, shared by the editor and the public article page —
    so there is no separate render component. */
export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      kind: {
        default: "aviso" as CalloutKind,
        parseHTML: (el) => el.getAttribute("data-callout") || "aviso",
        renderHTML: (attrs) => ({ "data-callout": attrs.kind }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "aside[data-callout]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["aside", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setCallout:
        (kind: CalloutKind) =>
        ({ commands }) =>
          commands.wrapIn(this.name, { kind }),
      toggleCallout:
        (kind: CalloutKind) =>
        ({ commands }) =>
          commands.toggleWrap(this.name, { kind }),
    };
  },
});

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (kind: CalloutKind) => ReturnType;
      toggleCallout: (kind: CalloutKind) => ReturnType;
    };
  }
}
