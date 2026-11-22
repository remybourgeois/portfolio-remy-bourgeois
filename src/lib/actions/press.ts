// src/lib/actions/press.ts

/** Durée minimale de l'enfoncement, pour qu'un toucher bref reste visible. */
const MIN_PRESS = 120;

/**
 * Pose `data-pressed` sur un élément tant qu'on appuie dessus, au doigt, à la
 * souris ou au clavier. La mise en forme est dans app.css (« Bouton »), sur la
 * classe `btn-press` : l'élément s'enfonce puis revient avec le ressort.
 *
 * L'état vient d'ici et non de `:active` : sur un toucher bref, `:active`
 * dure moins qu'une image et rien ne se verrait. L'enfoncement est donc tenu
 * 120 ms au minimum.
 */
export function press(node: HTMLElement) {
  let pressedAt = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const down = () => {
    clearTimeout(timer);
    pressedAt = Date.now();
    node.setAttribute('data-pressed', '');
  };
  const up = () => {
    if (!node.hasAttribute('data-pressed')) return;
    clearTimeout(timer);
    timer = setTimeout(
      () => node.removeAttribute('data-pressed'),
      Math.max(0, MIN_PRESS - (Date.now() - pressedAt))
    );
  };
  const keydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') down();
  };

  const releases = ['pointerup', 'pointercancel', 'pointerleave', 'keyup', 'blur'] as const;
  node.addEventListener('pointerdown', down);
  node.addEventListener('keydown', keydown);
  for (const type of releases) node.addEventListener(type, up);

  return {
    destroy() {
      clearTimeout(timer);
      node.removeEventListener('pointerdown', down);
      node.removeEventListener('keydown', keydown);
      for (const type of releases) node.removeEventListener(type, up);
    }
  };
}
