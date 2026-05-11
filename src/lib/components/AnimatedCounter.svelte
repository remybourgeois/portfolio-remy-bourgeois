<script lang="ts">
  import { onMount } from 'svelte';
  export let end: number;
  export let suffix = '';
  export let duration = 2000;
  let count = 0;
  let el: HTMLSpanElement;
  onMount(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { count = end; return; }
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      let start: number;
      const tick = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts-start)/duration, 1);
        const ease = p === 1 ? 1 : 1 - Math.pow(2, -10*p);
        count = Math.floor(end * ease);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  });
</script>
<span bind:this={el} aria-label="{count}{suffix}">{count}{suffix}</span>
