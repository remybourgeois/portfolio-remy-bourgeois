<!-- src/lib/components/AnimatedCounter.svelte -->
<script lang="ts">
  import { onMount, untrack } from 'svelte';

  let { end, suffix = '', duration = 2000 }: {
    end: number;
    suffix?: string;
    duration?: number;
  } = $props();

  // Valeur finale dès le rendu serveur. Initialiser à 0 mettait « 0+ Années
  // d'expérience » dans le HTML prérendu : les crawlers et les moteurs
  // génératifs ne lisaient que des zéros, et les chiffres — qui sont le
  // contenu factuel le plus citable de la page — n'existaient nulle part.
  // `untrack` : on capture délibérément la valeur initiale de la prop, sans
  // créer de dépendance réactive (svelte/state_referenced_locally).
  let count = $state(untrack(() => end));
  let el = $state<HTMLSpanElement | null>(null);

  onMount(() => {
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      count = end; return;
    }
    // Le retour à zéro n'a lieu que si JS tourne : sans JS, la valeur affichée
    // reste la bonne au lieu de rester bloquée à 0.
    count = 0;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      let start: number | undefined;
      const tick = (ts: number) => {
        if (start === undefined) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        // easeOutExpo — mais on stoppe dès que le chiffre affiché atteint end
        const ease = p < 1 ? 1 - Math.pow(2, -10 * p) : 1;
        count = Math.round(end * ease);
        if (p < 1 && count < end) requestAnimationFrame(tick);
        else count = end; // atterrissage propre, pas de dead zone
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  });
</script>

<!--
  Les valeurs intermédiaires sont masquées aux lecteurs d'écran : sans ça le
  compteur annonce chaque étape de l'animation. Le doublon sr-only porte la
  valeur finale en permanence — l'ancienne version la conditionnait à la fin de
  l'animation, donc le prérendu ne contenait rien pour un lecteur d'écran.
-->
<span bind:this={el}>
  <span aria-hidden="true">{count}{suffix}</span>
  <span class="sr-only">{end}{suffix}</span>
</span>
