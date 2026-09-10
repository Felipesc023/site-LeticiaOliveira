const ALLOWED = /^(h2|h3|p|strong|em|ul|ol|li|blockquote|a|aside|br)$/i;
const CALLOUT_KINDS = /^(aviso|dica|dicionario)$/;

/** Keep only the tags the rich editor understands, and drop every attribute
    except `href` on <a> and `data-callout` on <aside>. The editor re-parses
    this against its schema anyway — this just keeps the AI output tidy and
    predictable before it reaches the editor / the page. */
export function sanitizeArticleHtml(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(
      /<\/?([a-z0-9]+)((?:[^>"']|"[^"]*"|'[^']*')*)>/gi,
      (m, tag: string, attrs: string) => {
        const t = tag.toLowerCase();
        if (!ALLOWED.test(t)) return "";
        if (m.startsWith("</")) return `</${t}>`;
        let keep = "";
        if (t === "a") {
          const href = attrs.match(/\bhref\s*=\s*("([^"]*)"|'([^']*)')/i);
          const url = (href?.[2] ?? href?.[3] ?? "").replace(/"/g, "");
          if (/^(https?:|mailto:|\/)/i.test(url)) keep = ` href="${url}"`;
        } else if (t === "aside") {
          const k = attrs.match(/data-callout\s*=\s*("([^"]*)"|'([^']*)')/i);
          const kind = (k?.[2] ?? k?.[3] ?? "aviso").toLowerCase();
          keep = ` data-callout="${CALLOUT_KINDS.test(kind) ? kind : "aviso"}"`;
        }
        return `<${t}${keep}>`;
      },
    )
    .trim();
}

/** New articles are saved as HTML by the rich editor; older seed rows are
    markdown. Tells them apart so the page can render either without a migration. */
export function looksLikeHtml(content: string): boolean {
  return /^\s*<(h[1-6]|p|ul|ol|blockquote|aside|div)\b/i.test(content);
}
