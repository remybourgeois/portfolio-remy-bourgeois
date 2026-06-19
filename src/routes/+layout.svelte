<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
  import Nav from '$lib/components/Nav.svelte';
  import { audioStore } from '$lib/stores/audio';
  import { browser } from '$app/environment';
  import { onNavigate } from '$app/navigation';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { SITE_URL } from '$lib/data/site';

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
  <link rel="canonical" href="{SITE_URL}{$page.url.pathname}" />
</svelte:head>

<!-- Skip link : sur l'intro (pas de #main-content) on saute directement au portfolio -->
<a
  href={$page.url.pathname === '/' ? '/home' : '#main-content'}
  class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999]
         focus:px-4 focus:py-2 focus:rounded-full focus:bg-[#706bfe] focus:text-white
         focus:text-sm focus:font-medium focus:outline-none"
>
  {$page.url.pathname === '/' ? 'Accéder au portfolio' : 'Passer au contenu'}
</a>
<Nav />
<slot />
