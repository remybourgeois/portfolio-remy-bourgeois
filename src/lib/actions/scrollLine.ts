// src/lib/actions/scrollLine.ts

/**
 * Fait avancer le trait d'une frise avec la lecture. L'élément reçoit
 * `data-progress` et la variable `--p`, de 0 à 1, soit la part de sa hauteur
 * déjà passée sous un repère placé aux trois cinquièmes de l'écran. Chacun de
 * ses enfants directs reçoit `data-reached` une fois ce repère franchi.
 * La mise en forme est dans app.css (« Frise »).
 *
 * Sans cette action, la frise est entièrement tracée : c'est son état sans
 * JavaScript et en mouvement réduit, où l'action ne fait rien.
 */
export function scrollLine(node: HTMLElement) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const steps = [...node.children] as HTMLElement[];
  let frame = 0;

  const update = () => {
    frame = 0;
    const mark = window.innerHeight * 0.6;
    const rect = node.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (mark - rect.top) / rect.height));
    node.style.setProperty('--p', progress.toFixed(3));
    for (const step of steps) {
      step.toggleAttribute('data-reached', step.getBoundingClientRect().top < mark);
    }
  };
  // Une mesure par image au plus : le défilement ne fait que la demander.
  const request = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  node.setAttribute('data-progress', '');
  update();
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  return {
    destroy() {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    }
  };
}
