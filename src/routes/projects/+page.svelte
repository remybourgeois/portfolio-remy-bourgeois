<script lang="ts">
  import { onMount } from 'svelte';
  import { PROJECTS, type Project } from '$lib/data/projects';
  import Icon from '$lib/components/Icons.svelte';
  import { sfx } from '$lib/actions/sfx';
  import { introDone } from '$lib/stores/intro';
  import { audioStore, SFX_BACK } from '$lib/stores/audio';

  let selected: Project | null = null;

  onMount(() => {
    introDone.set(true);
    document.body.style.overflow = 'auto';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selected) closeModal();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  });

  function openModal(p: Project) {
    selected = p;
    document.body.style.overflow = 'hidden';
    audioStore.engine?.playRandomSFX();
  }

  function closeModal() {
    audioStore.engine?.playSound(SFX_BACK);
    selected = null;
    document.body.style.overflow = 'auto';
  }
</script>

<svelte:head>
  <title>Projets — Rémy Bourgeois</title>
  <meta name="description" content="Portfolio de projets : Design System, IA conversationnelle, SaaS B2B, robotique humanoïde.">
</svelte:head>

<div class="min-h-screen bg-[#020205] text-white">
  <div class="max-w-6xl mx-auto px-6 pt-32 pb-20">

    <header class="mb-16">
      <a href="/" use:sfx class="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs uppercase tracking-wider mb-8 transition-colors">
        <Icon name="ArrowLeft" size={14} /> Retour
      </a>
      <h1 class="text-4xl md:text-6xl font-semibold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
        Projets
      </h1>
      <p class="text-white/50 text-base max-w-xl">
        Design System, IA conversationnelle, interfaces complexes — 13 ans de travail condensé.
      </p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each PROJECTS as project}
        <button
          type="button"
          on:click={() => openModal(project)}
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
            <img
              src={project.image}
              alt=""
              class="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
          <div class="p-6">
            <div class="h-6 mb-3 opacity-70">
              <img src={project.logo} alt="" class="h-full w-auto object-contain brightness-0 invert" loading="lazy" />
            </div>
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
        </button>
      {/each}
    </div>

  </div>
</div>

<!-- Modal -->
{#if selected}
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title-projects"
    style="animation: fadeIn 0.3s ease-out"
  >
    <div
      class="absolute inset-0 bg-black/90 backdrop-blur-xl"
      on:click={closeModal}
      aria-hidden="true"
    ></div>

    <button
      on:click={closeModal}
      aria-label="Fermer"
      class="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-20 transition-all focus-visible:ring-2 focus-visible:ring-white"
    >
      <Icon name="X" size={24} />
    </button>

    <div class="relative w-full max-w-6xl max-h-full flex flex-col items-center z-10 pointer-events-none">
      <div
        class="relative w-full pointer-events-auto rounded-[48px] overflow-hidden shadow-2xl bg-white/5 border border-white/10 flex items-center justify-center max-h-[70vh]"
        style="backdrop-filter:blur(30px)"
      >
        <div class="mesh-gradient-bg" aria-hidden="true"></div>
        <img
          src={selected.image}
          alt="Aperçu du projet {selected.title}"
          class="relative z-10 w-full h-full object-contain max-h-[70vh] p-8 shadow-image-modal"
        />
      </div>

      <div class="mt-6 w-full pointer-events-auto flex flex-col md:flex-row gap-4 items-start md:items-center bg-black/50 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10">
        <div class="flex items-center gap-4 flex-shrink-0">
          <div class="h-6 opacity-90">
            <img src={selected.logo} alt={selected.client} class="h-full object-contain brightness-0 invert" />
          </div>
          <div class="w-px h-4 bg-white/20" aria-hidden="true"></div>
          <span id="modal-title-projects" class="text-white font-semibold text-sm">{selected.title}</span>
        </div>
        <div class="flex flex-wrap gap-1.5">
          {#each selected.tags as tag}
            <span class="px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 text-[11px] border border-white/10">{tag}</span>
          {/each}
        </div>
      </div>

      <div class="mt-4 w-full pointer-events-auto bg-black/30 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5">
        <p class="text-white/70 text-sm leading-relaxed whitespace-pre-line">{selected.description}</p>
      </div>
    </div>
  </div>
{/if}
