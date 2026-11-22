// src/lib/actions/seen.ts

/**
 * Pose `data-seen` sur un élément la première fois qu'il est vraiment à
 * l'écran. app.css s'en sert pour faire arriver ses enfants l'un après l'autre
 * (étiquettes, listes, encadré « En bref », terrains).
 *
 * L'action se pose sur l'élément animé lui-même, pas sur la carte qui le
 * contient : une liste placée en bas d'une haute carte jouait son entrée dès
 * que le haut de la carte apparaissait, et l'animation était finie avant
 * qu'on n'arrive dessus.
 *
 * Tant qu'il attend sous l'écran, l'élément porte `data-seen-pending` et ses
 * enfants sont masqués : sans ça ils seraient visibles, puis disparaîtraient
 * pour rejouer leur entrée. Un élément déjà à l'écran au chargement n'est
 * jamais masqué : il joue son entrée aussitôt.
 *
 * En mouvement réduit l'action ne fait rien : aucun attribut n'arrive et le
 * contenu est simplement là.
 */
export function seen(node: HTMLElement) {
  if (typeof IntersectionObserver === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Déjà à l'écran, même en partie : l'entrée se joue tout de suite. Attendre
  // qu'il soit davantage visible le laisserait affiché, puis le ferait
  // disparaître pour rejouer son entrée.
  if (node.getBoundingClientRect().top <= window.innerHeight) {
    node.setAttribute('data-seen', '');
    return;
  }
  node.setAttribute('data-seen-pending', '');

  const obs = new IntersectionObserver(
    // Tout le lot : un navigateur occupé livre plusieurs signaux d'un coup.
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      obs.disconnect();
      node.removeAttribute('data-seen-pending');
      node.setAttribute('data-seen', '');
    },
    // Un tiers de l'élément, et pas dans la bande basse de l'écran : l'entrée
    // se joue sous les yeux, pas au ras du bord.
    { threshold: 0.35, rootMargin: '0px 0px -8% 0px' }
  );
  obs.observe(node);
  return {
    destroy() {
      obs.disconnect();
    }
  };
}
