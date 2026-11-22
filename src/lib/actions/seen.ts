// src/lib/actions/seen.ts

/**
 * Pose `data-seen` sur un élément la première fois qu'il entre à l'écran.
 * app.css s'en sert pour faire apparaître les étiquettes d'une carte projet
 * l'une après l'autre (« Étiquettes »).
 *
 * Les cartes de l'accueil vivent toutes dans une seule section révélée : sans
 * ce repère par carte, leurs étiquettes joueraient toutes en même temps, hors
 * écran pour la plupart.
 *
 * En mouvement réduit l'action ne fait rien : l'attribut n'arrive jamais et
 * les étiquettes sont simplement là.
 */
export function seen(node: HTMLElement) {
  if (typeof IntersectionObserver === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const obs = new IntersectionObserver(
    // Tout le lot : un navigateur occupé livre plusieurs signaux d'un coup.
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      obs.disconnect();
      node.setAttribute('data-seen', '');
    },
    { threshold: 0.2 }
  );
  obs.observe(node);
  return {
    destroy() {
      obs.disconnect();
    }
  };
}
