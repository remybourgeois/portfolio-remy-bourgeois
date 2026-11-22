// src/lib/actions/fanCard.ts

/**
 * Ouvre l'éventail d'une carte projet et lit sa vidéo tant qu'il est ouvert.
 *
 * La carte reçoit `data-fan-open` : la mise en forme est dans app.css
 * (« Éventail »). Avec une souris, l'ouverture suit le survol et le focus. Au
 * toucher, où le survol n'existe pas, la carte s'ouvre quand son visuel passe
 * dans la bande centrale de l'écran et se referme quand il en sort.
 *
 * Le survol exige un pointeur fin : certains téléphones annoncent
 * `hover: hover`, et un toucher y laissait l'état de survol collé.
 *
 * La vidéo est en `preload="none"` : elle ne se télécharge qu'à la première
 * ouverture. En mouvement réduit ou avec l'économiseur de données, elle reste
 * sur son poster, et l'éventail ne s'ouvre plus tout seul au défilement.
 *
 * `watch` : sélecteur de l'élément dont la position décide de l'ouverture au
 * toucher. Par défaut le premier enfant de la carte, qui est son visuel sur
 * /projects. Sur l'accueil la carte est haute (visuel puis texte) : sans ça
 * elle resterait ouverte tant que son texte traverse l'écran.
 *
 * `video: false` : la carte ne pilote pas la vidéo. L'accueil la lit déjà
 * dès qu'elle est visible, avec `playInView`.
 */
export function fanCard(node: HTMLElement, options: { watch?: string; video?: boolean } = {}) {
  const video = options.video === false ? null : node.querySelector('video');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData =
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ===
    true;
  const pointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const set = (open: boolean) => {
    node.toggleAttribute('data-fan-open', open);
    if (!video || reduced || saveData) return;
    if (open) video.play().catch(() => {});
    else video.pause();
  };
  const open = () => set(true);
  const close = () => set(false);

  if (pointer) {
    node.addEventListener('pointerenter', open);
    // `focusin` et non `focus` : sur l'accueil le lien est dans la carte.
    node.addEventListener('focusin', open);
    node.addEventListener('pointerleave', close);
    node.addEventListener('focusout', close);
    return {
      destroy() {
        node.removeEventListener('pointerenter', open);
        node.removeEventListener('focusin', open);
        node.removeEventListener('pointerleave', close);
        node.removeEventListener('focusout', close);
      }
    };
  }

  if (reduced || typeof IntersectionObserver === 'undefined') return;

  // L'état courant est le dernier signal du lot : un navigateur occupé en
  // livre plusieurs d'un coup pour le même élément.
  const obs = new IntersectionObserver(
    (entries) => set(entries[entries.length - 1].isIntersecting),
    {
      // Bande centrale : 24 % de la hauteur de l'écran.
      rootMargin: '-38% 0px -38% 0px'
    }
  );
  const watched = options.watch ? node.querySelector(options.watch) : node.firstElementChild;
  obs.observe(watched ?? node);
  return {
    destroy() {
      obs.disconnect();
    }
  };
}
