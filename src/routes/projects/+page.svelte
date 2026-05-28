<!-- src/routes/projects/+page.svelte -->
<script lang="ts">
  import { PROJECTS } from '$lib/data/projects';
  import Icon from '$lib/components/Icons.svelte';
  import { sfx } from '$lib/actions/sfx';
  import { SITE_URL } from '$lib/data/site';
</script>

<svelte:head>
  <title>Projets — Rémy Bourgeois</title>
  <meta name="description" content="Portfolio de projets : Design System, IA conversationnelle, SaaS B2B, robotique humanoïde." />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Rémy Bourgeois — Portfolio" />
  <meta property="og:title" content="Projets — Rémy Bourgeois" />
  <meta property="og:description" content="Design System, IA conversationnelle, interfaces complexes — 14 ans de travail condensé." />
  <meta property="og:image" content="{SITE_URL}/assets/1_Photo%20Remy%20Bourgeois%20Pro.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="min-h-screen bg-[#020205] text-white">
  <div class="max-w-6xl mx-auto px-6 pt-32 pb-20">

    <header class="mb-16">
      <a href="/home" use:sfx class="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs uppercase tracking-wider mb-8 transition-colors min-h-[44px]">
        <Icon name="ArrowLeft" size={14} /> Retour
      </a>
      <h1 class="text-4xl md:text-6xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
        Projets
      </h1>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each PROJECTS as project}
        <a
          href="/projects/{project.slug}"
          use:sfx
          aria-label="Voir le projet {project.title}"
          class="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden
                 hover:bg-white/[0.08] hover:border-white/20
                 hover:shadow-[0_0_40px_rgba(112,107,254,0.15)]
                 transition-all duration-500 text-left
                 focus-visible:ring-2 focus-visible:ring-[#706bfe]"
        >
          <div class="relative h-56 overflow-hidden">
            <div class="mesh-gradient-bg opacity-0 group-hover:opacity-20 transition-opacity duration-500" aria-hidden="true"></div>
            {#if project.video}
              <video
                src={project.video}
                autoplay
                loop
                muted
                playsinline
                class="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-[1.03]"
              ></video>
            {:else if project.image || project.media?.length}
              <img
                src={project.image || project.media![0].src}
                alt=""
                class="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-[1.03]"
                loading="lazy"
              />
            {:else}
              <div class="w-full h-full flex items-center justify-center">
                <span class="text-xs uppercase tracking-[0.3em] text-white/20 font-medium">Bientôt</span>
              </div>
            {/if}
          </div>
          <div class="p-6">
            {#if project.logo}
              <div class="h-6 mb-3 opacity-70">
                <img src={project.logo} alt="" class="h-full w-auto object-contain brightness-0 invert" loading="lazy" />
              </div>
            {:else}
              <div class="h-6 mb-3 opacity-70 flex items-center">
                <span class="text-sm font-semibold text-white/50">{project.client}</span>
              </div>
            {/if}
            <h2 class="text-lg font-semibold text-white mb-3 group-hover:text-[#706bfe] transition-colors">
              {project.title}
            </h2>
            <div class="flex flex-wrap gap-1.5">
              {#each project.tags as tag}
                <span class="px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 text-[11px] font-medium border border-white/10">
                  {tag}
                </span>
              {/each}
            </div>
          </div>
        </a>
      {/each}
    </div>

  </div>
</div>
