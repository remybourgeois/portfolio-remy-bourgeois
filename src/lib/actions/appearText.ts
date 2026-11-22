// src/lib/actions/appearText.ts

/** Ce qui se révèle : les titres et les blocs de texte. */
const TARGETS = 'h1, h2, h3, h4, p, li, dt, dd, blockquote, figure';

/**
 * Ce qui ne se révèle pas ici : la navigation, le contenu masqué, et les
 * blocs qui ont déjà leur propre entrée (cascades, frise, terrains, encadré
 * « En bref », titres de section). `data-no-appear` exclut un bloc à la main.
 */
const EXCLUDED =
  'nav, [aria-hidden="true"], .sr-only, .section-title, .timeline, .terrain-step, .bref, .list-cascade, .tag-cascade, [data-no-appear]';

/** Décalage entre deux éléments qui arrivent à l'écran en même temps. */
const STAGGER = 60;

/**
 * Fait apparaître le texte d'une page au fil de la lecture : presque chaque
 * titre et chaque paragraphe monte légèrement quand il entre à l'écran.
 * Posée une fois sur le conteneur de la page, l'action trouve ses cibles
 * toute seule, sans classe à ajouter dans les gabarits. La mise en forme est
 * dans app.css (« Texte qui apparaît »).
 *
 * Un élément attend sous l'écran avec `data-appear="pending"`, puis passe à
 * `data-appear="in"`. Ce qui est déjà à l'écran au chargement n'est pas
 * touché : le masquer pour le révéler aussitôt ferait clignoter le haut de la
 * page.
 *
 * Un seul observateur pour toute la page. Il lit tout le lot de signaux :
 * un navigateur occupé en livre plusieurs d'un coup, et n'en lire qu'un
 * laisserait du texte invisible.
 *
 * Sans JavaScript ou en mouvement réduit, rien n'est masqué.
 */
export function appearText(node: HTMLElement) {
  if (typeof IntersectionObserver === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const obs = new IntersectionObserver(
    (entries) => {
      const arriving = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      arriving.forEach((entry, rank) => {
        const el = entry.target as HTMLElement;
        obs.unobserve(el);
        el.style.setProperty('--appear-delay', `${Math.min(rank, 5) * STAGGER}ms`);
        el.setAttribute('data-appear', 'in');
      });
    },
    // Dès que le haut de l'élément dépasse la bande basse de l'écran.
    { threshold: 0, rootMargin: '0px 0px -8% 0px' }
  );

  const taken = new Set<Element>();
  for (const el of node.querySelectorAll<HTMLElement>(TARGETS)) {
    if (el.closest(EXCLUDED)) continue;
    // Un bloc dans un bloc déjà retenu (un paragraphe dans une puce) suit
    // son parent : il ne s'anime pas deux fois.
    let parent = el.parentElement;
    let nested = false;
    while (parent && parent !== node) {
      if (taken.has(parent)) {
        nested = true;
        break;
      }
      parent = parent.parentElement;
    }
    if (nested) continue;
    taken.add(el);
    if (el.getBoundingClientRect().top <= window.innerHeight) continue;
    el.setAttribute('data-appear', 'pending');
    obs.observe(el);
  }

  return {
    destroy() {
      obs.disconnect();
    }
  };
}
