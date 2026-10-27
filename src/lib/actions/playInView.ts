// src/lib/actions/playInView.ts

/**
 * Ne charge et ne lit une vidéo que lorsqu'elle approche du viewport.
 *
 * Combiné à `preload="none"` sur l'élément, une vidéo hors écran ne coûte
 * rien : la carte Ofelia de / et /projects téléchargeait 2,4 Mo au
 * chargement de la page alors qu'elle est sous la ligne de flottaison.
 *
 * Respecte `prefers-reduced-motion` et l'économiseur de données : dans ces
 * deux cas on affiche une image fixe (première frame) au lieu de lancer une
 * boucle vidéo.
 *
 * `hover: true` : sur un appareil à pointeur, la lecture attend le survol ou
 * le focus de la carte (`closest('a')`) au lieu de partir dès que la carte
 * est visible. C'est ce qui évite, sur /projets, de télécharger 2,4 Mo pour
 * une carte qui se trouve être au-dessus de la ligne de flottaison. Au
 * toucher, où le survol n'existe pas, la lecture reste pilotée par la
 * visibilité.
 */
export function playInView(node: HTMLVideoElement, options: { hover?: boolean } = {}) {
  if (typeof IntersectionObserver === 'undefined') return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData =
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ===
    true;
  const canHover = window.matchMedia('(hover: hover)').matches;
  const onIntent = options.hover === true && canHover;

  const showStillFrame = () => {
    node.preload = 'metadata';
    node.addEventListener(
      'loadeddata',
      () => {
        node.currentTime = 0.1;
      },
      { once: true }
    );
    node.load();
  };

  if (reduced || saveData) {
    showStillFrame();
    return;
  }

  if (onIntent) {
    const card = node.closest('a') ?? node;
    const play = () => node.play().catch(() => {});
    const pause = () => node.pause();
    card.addEventListener('pointerenter', play);
    card.addEventListener('focus', play);
    card.addEventListener('pointerleave', pause);
    card.addEventListener('blur', pause);
    return {
      destroy() {
        card.removeEventListener('pointerenter', play);
        card.removeEventListener('focus', play);
        card.removeEventListener('pointerleave', pause);
        card.removeEventListener('blur', pause);
      }
    };
  }

  const obs = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        node.pause();
        return;
      }
      node.play().catch(() => {});
    },
    // 200px d'avance : la lecture démarre juste avant que la carte soit visible.
    { rootMargin: '200px', threshold: 0.01 }
  );

  obs.observe(node);
  return {
    destroy() {
      obs.disconnect();
    }
  };
}
