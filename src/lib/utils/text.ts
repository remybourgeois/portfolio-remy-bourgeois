// src/lib/utils/text.ts

/**
 * Mini markdown : **bold** → <strong>, \n → <br>
 * Utilisé avec {@html} dans les templates Svelte.
 */
export function md(text: string): string {
  return text
    .replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}
