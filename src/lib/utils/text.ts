// src/lib/utils/text.ts

/**
 * Échappe le HTML. Le contenu vient aujourd'hui du dépôt, écrit à la main,
 * mais `md()` alimente un `{@html}` : sans cet échappement, le jour où ce
 * contenu viendrait d'un CMS ou d'une source externe, il serait injecté brut.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Mini markdown : **bold** -> <strong>, \n -> <br>
 * Utilisé avec {@html} dans les templates Svelte.
 */
export function md(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

/**
 * Sérialise un objet pour un <script type="application/ld+json">.
 * JSON.stringify n'échappe pas `</script>` : une chaîne contenant cette
 * séquence fermerait la balise et le reste serait interprété comme du HTML.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
