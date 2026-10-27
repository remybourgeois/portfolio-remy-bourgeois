<!-- src/routes/+error.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';

  const status = $derived($page.status);
  const isNotFound = $derived(status === 404);
</script>

<svelte:head>
  <title>{isNotFound ? 'Page introuvable' : 'Erreur'} | Rémy Bourgeois</title>
  <meta name="robots" content="noindex, follow" />
</svelte:head>

<main
  id="main-content"
  class="min-h-[80vh] bg-canvas text-white flex items-center justify-center px-6 py-24"
>
  <div class="w-full max-w-lg text-center flex flex-col items-center gap-6">
    <span class="font-mono eyebrow text-accent">Erreur {status}</span>

    <h1
      class="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-balance"
    >
      {isNotFound ? 'Cette page n’existe pas' : 'Quelque chose a mal tourné'}
    </h1>

    <p class="text-white/60 text-base leading-relaxed max-w-md">
      {#if isNotFound}
        Le lien est peut-être obsolète, ou l’adresse comporte une faute de frappe. Les projets sont
        tous accessibles depuis le portfolio.
      {:else}
        {$page.error?.message ?? 'Une erreur inattendue est survenue.'}
      {/if}
    </p>

    <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center pt-2">
      <Button href="/">Retour au portfolio</Button>
      <Button href="/projects" variant="secondary" iconRight="ArrowRight">Voir les projets</Button>
    </div>
  </div>
</main>
