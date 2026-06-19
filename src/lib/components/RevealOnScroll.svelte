<script lang="ts">
  import { onMount } from 'svelte';
  let el: HTMLDivElement;
  let visible = false;
  let prefersRM = false;
  onMount(() => {
    prefersRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { visible = true; obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  });
</script>
<div
  bind:this={el}
  class="{prefersRM ? '' : 'transition-all duration-1000 transform'} {visible || prefersRM ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}"
>
  <slot />
</div>
