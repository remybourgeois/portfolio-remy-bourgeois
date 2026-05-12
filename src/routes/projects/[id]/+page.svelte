<!-- src/routes/projects/[id]/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';
  import Icon from '$lib/components/Icons.svelte';
  import { sfx } from '$lib/actions/sfx';
  import { SITE_URL } from '$lib/data/site';

  const { data }: { data: PageData } = $props();
  const project = $derived(data.project);
  const prev = $derived(data.prev);
  const next = $derived(data.next);
</script>

<svelte:head>
  <title>{project.title} — Rémy Bourgeois</title>
  <meta name="description" content={project.description.slice(0, 160)} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Rémy Bourgeois — Portfolio" />
  <meta property="og:title" content="{project.title} — Rémy Bourgeois" />
  <meta property="og:description" content={project.description.slice(0, 160)} />
  <meta property="og:image" content="{SITE_URL}{project.image}" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="min-h-screen bg-[#020205] text-white">
  <div class="max-w-5xl mx-auto px-6 pt-32 pb-24">

    <!-- Header navigation -->
    <a
      href="/projects"
      use:sfx
      class="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs uppercase tracking-wider mb-12 transition-colors min-h-[44px]"
    >
      <Icon name="ArrowLeft" size={14} /> Tous les projets
    </a>

    <!-- Hero -->
    <div class="mb-10">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div class="h-8 opacity-80 flex-shrink-0">
          <img src={project.logo} alt={project.client} class="h-full object-contain brightness-0 invert" loading="eager" />
        </div>
        {#if project.year || project.role}
          <div class="flex flex-wrap gap-3 text-white/40 text-xs">
            {#if project.year}<span>{project.year}</span>{/if}
            {#if project.year && project.role}<span aria-hidden="true">·</span>{/if}
            {#if project.role}<span>{project.role}</span>{/if}
          </div>
        {/if}
      </div>
      <h1 class="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6 leading-tight">
        {project.title}
      </h1>
      <div class="flex flex-wrap gap-2">
        {#each project.tags as tag}
          <span class="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-medium border border-white/10">
            {tag}
          </span>
        {/each}
      </div>
    </div>

    <!-- Image principale -->
    <div class="relative w-full rounded-3xl overflow-hidden mb-10 bg-white/5 border border-white/10">
      <div class="mesh-gradient-bg opacity-40" aria-hidden="true"></div>
      <img
        src={project.image}
        alt="Aperçu du projet {project.title}"
        class="relative z-10 w-full object-contain max-h-[70vh] p-6 md:p-10 shadow-image-modal"
        loading="eager"
      />
    </div>

    <!-- Description -->
    <div class="max-w-2xl mb-16">
      <p class="text-white/70 text-base md:text-lg leading-relaxed whitespace-pre-line">
        {project.description}
      </p>
      {#if project.url}
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          use:sfx
          class="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-sm transition-all focus-visible:ring-2 focus-visible:ring-[#706bfe]"
        >
          <Icon name="ExternalLink" size={14} /> Voir le projet en ligne
        </a>
      {/if}
    </div>

    <!-- Navigation prev / next -->
    <div class="border-t border-white/10 pt-10 flex flex-col sm:flex-row gap-4 justify-between">
      {#if prev}
        <a
          href="/projects/{prev.id}"
          use:sfx
          class="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group flex-1 sm:flex-initial min-h-[60px] focus-visible:ring-2 focus-visible:ring-[#706bfe]"
        >
          <Icon name="ArrowLeft" size={16} className="text-white/40 group-hover:text-white transition-colors flex-shrink-0" />
          <div class="min-w-0">
            <div class="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Précédent</div>
            <div class="text-sm font-medium text-white/80 group-hover:text-white transition-colors truncate">{prev.title}</div>
          </div>
        </a>
      {:else}
        <div class="flex-1 sm:flex-initial"></div>
      {/if}

      {#if next}
        <a
          href="/projects/{next.id}"
          use:sfx
          class="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group flex-1 sm:flex-initial sm:text-right justify-end min-h-[60px] focus-visible:ring-2 focus-visible:ring-[#706bfe]"
        >
          <div class="min-w-0">
            <div class="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Suivant</div>
            <div class="text-sm font-medium text-white/80 group-hover:text-white transition-colors truncate">{next.title}</div>
          </div>
          <Icon name="ArrowRight" size={16} className="text-white/40 group-hover:text-white transition-colors flex-shrink-0" />
        </a>
      {:else}
        <div class="flex-1 sm:flex-initial"></div>
      {/if}
    </div>

  </div>
</div>
