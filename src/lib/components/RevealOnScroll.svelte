<!-- src/lib/components/RevealOnScroll.svelte -->
<script lang="ts">
  import { onMount, type Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  let el = $state<HTMLDivElement | null>(null);
  // On part de `true` : si l'IntersectionObserver ne se déclenche jamais (JS en
  // erreur, navigateur ancien), le contenu reste visible au lieu de disparaître.
  let visible = $state(true);
  let animate = $state(false);

  onMount(() => {
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Un bloc déjà à l'écran n'est jamais masqué : le cacher pour le révéler
    // aussitôt produirait un fondu sortant puis entrant. En pratique le premier
    // callback de l'observer arrive avant le paint, mais cet ordonnancement
    // n'est pas garanti d'un navigateur à l'autre — ici c'est déterministe.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    animate = true;
    visible = false;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { visible = true; obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  });
</script>

<!--
  `w-full` : le conteneur parent de la home est en `flex items-center`, donc un
  enfant sans largeur explicite se dimensionne sur son contenu. Les sections
  Impact, Projets et Contact étaient de ce fait plus étroites que Recommandations
  et Expertises, dont les grilles remplissaient déjà la largeur disponible.
  Le wrapper d'animation ne doit pas décider de la largeur de la section.
-->
<div
  bind:this={el}
  class="w-full {animate ? 'transition-all duration-1000 transform' : ''} {visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}"
>
  {@render children()}
</div>
