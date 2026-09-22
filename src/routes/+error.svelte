<!-- src/routes/+error.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import Icon from '$lib/components/Icons.svelte';

  const status = $derived($page.status);
  const isNotFound = $derived(status === 404);
</script>

<svelte:head>
  <title>{isNotFound ? 'Page introuvable' : 'Erreur'} — Rémy Bourgeois</title>
  <meta name="robots" content="noindex, follow" />
</svelte:head>

<main id="main-content" class="min-h-screen bg-[#020205] text-white flex items-center justify-center px-6 py-24">
  <div class="w-full max-w-lg text-center flex flex-col items-center gap-6">
    <span class="font-mono text-xs tracking-[0.25em] text-[#a8a5ff] uppercase">
      Erreur {status}
    </span>

    <h1 class="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-balance">
      {isNotFound ? 'Cette page n’existe pas' : 'Quelque chose a mal tourné'}
    </h1>

    <p class="text-white/60 text-base leading-relaxed max-w-md">
      {#if isNotFound}
        Le lien est peut-être obsolète, ou l’adresse comporte une faute de frappe.
        Les projets sont tous accessibles depuis le portfolio.
      {:else}
        {$page.error?.message ?? 'Une erreur inattendue est survenue.'}
      {/if}
    </p>

    <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center pt-2">
      <a
        href="/"
        class="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#5a55e0] text-white font-medium
               hover:bg-[#4a45d0] transition-colors focus-visible:ring-2 focus-visible:ring-white focus:outline-none"
      >
        Retour au portfolio
      </a>
      <a
        href="/projects"
        class="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/20 text-white/70
               hover:text-white hover:border-white/40 transition-colors
               focus-visible:ring-2 focus-visible:ring-[#706bfe] focus:outline-none"
      >
        Voir les projets <Icon name="ArrowRight" size={15} />
      </a>
    </div>
  </div>
</main>
