import { marked } from "marked";
import { looksLikeHtml } from "@/lib/html";

marked.setOptions({ gfm: true, breaks: false });

/** Render trusted admin-authored markdown to HTML.
    Content is written only by allowlisted admins (RN-001), so no sanitizer dep. */
export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

/** New articles are saved as HTML by the rich editor; older seed rows are
    markdown. Render either without a migration. */
export function renderArticle(content: string): string {
  return looksLikeHtml(content) ? content : renderMarkdown(content);
}

/** ~200 wpm reading estimate — used internally only, never shown (DESIGN.md §21). */
export function excerpt(md: string, max = 160): string {
  const text = md
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_>`#-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}
