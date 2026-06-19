// src/lib/utils/img.ts

/**
 * srcset 768/1280/1920 pour les screenshots projet (variantes générées dans static/assets).
 * Renvoie undefined pour toute autre image (logos, avatars, vidéos) → l'attribut srcset
 * n'est alors pas rendu, et seul `src` (le 1920) est utilisé.
 */
export function projectSrcset(src: string | undefined | null): string | undefined {
  if (!src || !src.includes('/assets/portfolio-') || !src.endsWith('.webp')) return undefined;
  const base = src.replace(/\.webp$/, '');
  return `${base}-768.webp 768w, ${base}-1280.webp 1280w, ${src} 1920w`;
}
