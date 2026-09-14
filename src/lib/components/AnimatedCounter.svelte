<!-- src/lib/components/AnimatedCounter.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';

  let { end, suffix = '', duration = 2000 }: {
    end: number;
    suffix?: string;
    duration?: number;
  } = $props();

  let count = $state(0);
  let done = $state(false);
  let el = $state<HTMLSpanElement | null>(null);

  onMount(() => {
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      count = end; done = true; return;
    }
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
        else { count = end; done = true; } // atterrissage propre, pas de dead zone
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  });
</script>

<!--
  Les valeurs intermédiaires sont masquées aux lecteurs d'écran : sans ça le
  compteur annonce chaque étape de l'animation. Seul le total final est annoncé.
-->
<span bind:this={el}>
  <span aria-hidden="true">{count}{suffix}</span>
  <span class="sr-only" aria-live="polite">{done ? `${end}${suffix}` : ''}</span>
</span>
