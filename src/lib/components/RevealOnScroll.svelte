<script lang="ts">
  import { onMount } from 'svelte';
  let el: HTMLDivElement;
  let visible = false;
  onMount(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { visible = true; obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  });
</script>
<div bind:this={el} class="transition-all duration-1000 transform {visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}">
  <slot />
</div>
