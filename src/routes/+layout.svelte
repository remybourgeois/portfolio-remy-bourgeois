<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
  import Nav from '$lib/components/Nav.svelte';
  import { audioStore } from '$lib/stores/audio';
  import { browser } from '$app/environment';
  import { onNavigate } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    if (!browser) return;
    const unlock = () => { audioStore.engine?.init(); audioStore.engine?.wakeUp(); };
    window.addEventListener('touchstart', unlock, { once: true });
    window.addEventListener('click', unlock, { once: true });

    const onVisibility = () => {
      if (document.hidden) audioStore.engine?.suspendForVisibility();
      else audioStore.engine?.resumeFromVisibility();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  });

  // View Transitions API — graceful degradation
  onNavigate((navigation) => {
    const conn = (navigator as any).connection;
    const slow = conn?.effectiveType === '2g';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || slow || reduced) return;
    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<svelte:head>
  <meta name="author" content="Rémy Bourgeois" />
</svelte:head>

<Nav />
<slot />
