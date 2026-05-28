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
    // Unlock AudioContext on first interaction — wakeUp() is now safe on non-intro pages
    // because it checks engine.bgmActive before attempting to resume BGM.
    const unlock = () => { audioStore.engine?.init(); audioStore.engine?.wakeUp(); };
    window.addEventListener('touchstart', unlock, { once: true });
    window.addEventListener('click', unlock, { once: true });

    const onVisibility = () => {
      if (document.hidden) audioStore.engine?.suspendForVisibility();
      else audioStore.engine?.resumeFromVisibility(); // checks bgmActive internally
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  });

  // View Transitions API + BGM shutdown when leaving the intro
  onNavigate((navigation) => {
    // Cut BGM as soon as we leave the intro page
    if (navigation.from?.url.pathname === '/') {
      audioStore.engine?.disableBGM();
    }

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
