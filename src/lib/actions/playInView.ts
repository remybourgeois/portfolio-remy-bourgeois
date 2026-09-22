// src/lib/actions/playInView.ts

/**
 * Ne charge et ne lit une vidéo que lorsqu'elle approche du viewport.
 *
 * Combiné à `preload="none"` sur l'élément, une vidéo hors écran ne coûte
 * rien : la carte Ofelia de / et /projects téléchargeait 2,4 Mo au
 * chargement de la page alors qu'elle est sous la ligne de flottaison.
 *
 * Respecte `prefers-reduced-motion` : dans ce cas on affiche une image fixe
 * (première frame) au lieu de lancer une boucle vidéo.
 */
export function playInView(node: HTMLVideoElement) {
  if (typeof IntersectionObserver === 'undefined') return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const showStillFrame = () => {
    node.preload = 'metadata';
    node.addEventListener('loadeddata', () => { node.currentTime = 0.1; }, { once: true });
    node.load();
  };

  const obs = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        if (!reduced) node.pause();
        return;
      }
      if (reduced) {
        showStillFrame();
        obs.disconnect();
        return;
      }
      node.play().catch(() => {});
    },
    // 200px d'avance : la lecture démarre juste avant que la carte soit visible.
    { rootMargin: '200px', threshold: 0.01 }
  );

  obs.observe(node);
  return { destroy() { obs.disconnect(); } };
}
