// src/lib/actions/tapFeedback.ts

/** La carte se soulève de 3 % et tremble de gauche à droite en s'amortissant. */
const SHIVER: Keyframe[] = [
  { transform: 'scale(1)', offset: 0 },
  { transform: 'scale(1.028) translateX(-1.6px)', offset: 0.14 },
  { transform: 'scale(1.03) translateX(1.5px)', offset: 0.28 },
  { transform: 'scale(1.03) translateX(-1.1px)', offset: 0.42 },
  { transform: 'scale(1.026) translateX(0.8px)', offset: 0.56 },
  { transform: 'scale(1.018) translateX(-0.4px)', offset: 0.7 },
  { transform: 'scale(1)', offset: 1 }
];
/** La pastille de l'icône rebondit. */
const POP: Keyframe[] = [{ transform: 'scale(0.82)' }, { transform: 'scale(1)' }];
/** Un anneau s'échappe de la pastille (son `::after`, stylé dans app.css). */
const RING: Keyframe[] = [
  { transform: 'scale(1)', opacity: 0.8 },
  { transform: 'scale(1.9)', opacity: 0 }
];
/** Le tracé de l'icône se redessine. */
const DRAW: Keyframe[] = [
  { strokeDasharray: '1', strokeDashoffset: '1' },
  { strokeDasharray: '1', strokeDashoffset: '0' }
];

/**
 * Réaction d'une carte au toucher : elle frissonne et son icône, portée par
 * l'élément `.tap-icon`, se redessine.
 *
 * Les animations passent par `element.animate()` et non par une classe CSS.
 * La carte et son icône ont déjà une animation d'apparition déclarée en CSS :
 * la remplacer le temps du toucher, puis la rétablir, la faisait rejouer, et
 * la carte disparaissait une seconde après chaque toucher. Une animation
 * lancée ici se superpose sans rien remplacer.
 *
 * L'écoute porte sur `click` et non sur `pointerdown` : un doigt posé sur la
 * carte pour faire défiler la page ne déclenche rien.
 *
 * Le tracé a besoin d'une longueur normalisée sur chaque forme :
 * `pathLength="1"` est posé ici plutôt que dans `Icons.svelte`, qui dessine
 * une trentaine d'icônes dont une seule section se sert ainsi.
 *
 * En mouvement réduit, l'action ne fait rien.
 */
export function tapFeedback(node: HTMLElement) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof node.animate !== 'function') return;

  const icon = node.querySelector<HTMLElement>('.tap-icon');
  const shapes = [...node.querySelectorAll<SVGElement>('.tap-icon svg > *')];
  for (const shape of shapes) shape.setAttribute('pathLength', '1');

  // Le ressort du site, lu sur le token. Un navigateur qui ne connaît pas
  // `linear()` refuse la valeur : on retombe sur une courbe simple.
  const spring = getComputedStyle(node).getPropertyValue('--ease-spring').trim();
  const withSpring = (el: Element, frames: Keyframe[], options: KeyframeAnimationOptions) => {
    try {
      return el.animate(frames, { ...options, easing: spring || 'ease-out' });
    } catch {
      return el.animate(frames, { ...options, easing: 'ease-out' });
    }
  };

  let running: Animation[] = [];
  const replay = () => {
    // Un second toucher pendant l'animation la relance depuis le début.
    for (const animation of running) animation.cancel();
    running = [node.animate(SHIVER, { duration: 520, easing: 'ease-out', id: 'tap-shiver' })];
    if (icon) {
      running.push(withSpring(icon, POP, { duration: 620 }));
      running.push(
        icon.animate(RING, { duration: 700, easing: 'ease-out', pseudoElement: '::after' })
      );
    }
    for (const shape of shapes) {
      running.push(shape.animate(DRAW, { duration: 750, easing: 'cubic-bezier(0.6, 0, 0.2, 1)' }));
    }
  };

  node.addEventListener('click', replay);
  return {
    destroy() {
      for (const animation of running) animation.cancel();
      node.removeEventListener('click', replay);
    }
  };
}
