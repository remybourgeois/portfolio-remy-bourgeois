<!-- src/lib/components/Nav.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { audioStore } from '$lib/stores/audio';
  import { introDone } from '$lib/stores/intro';
  import Icon from '$lib/components/Icons.svelte';
  import { sfx } from '$lib/actions/sfx';

  let menuOpen = false;
  $: isMuted = $audioStore.isMuted;
  $: visible = $introDone;
</script>

<nav
  aria-label="Navigation principale"
  class="fixed top-0 w-full z-50 transition-all duration-500
         bg-[#020205]/90 backdrop-blur-md border-b border-white/5
         {visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}"
>
  <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
    <a href="/" use:sfx class="text-white/70 hover:text-white text-xs uppercase tracking-wider transition-colors">
      Rémy Bourgeois
    </a>

    <div class="hidden md:flex items-center gap-6">
      <a href="/"
         use:sfx
         class="text-xs uppercase tracking-wider transition-colors
                {($page.url.pathname as string) === '/' ? 'text-white' : 'text-white/60 hover:text-white'}">
        Home
      </a>
      <a href="/projects"
         use:sfx
         class="text-xs uppercase tracking-wider transition-colors
                {($page.url.pathname as string) === '/projects' ? 'text-white' : 'text-white/60 hover:text-white'}">
        Projets
      </a>
      <button
        on:click={audioStore.toggleMute}
        aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
        aria-pressed={!isMuted}
        class="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
      >
        <div class="w-1.5 h-1.5 rounded-full {isMuted ? 'bg-red-500' : 'bg-emerald-400 animate-pulse'}"></div>
        <Icon name={isMuted ? 'SpeakerOff' : 'Speaker'} size={14} />
      </button>
    </div>

    <button
      class="md:hidden text-white/60 hover:text-white"
      on:click={() => menuOpen = !menuOpen}
      aria-label="Menu"
      aria-expanded={menuOpen}
    >
      <Icon name="Menu" size={20} />
    </button>
  </div>

  {#if menuOpen}
    <div class="md:hidden border-t border-white/5 px-6 py-4 flex flex-col gap-4 bg-[#020205]/95">
      <a href="/" use:sfx on:click={() => menuOpen = false}
         class="text-sm text-white/70 hover:text-white transition-colors">Home</a>
      <a href="/projects" use:sfx on:click={() => menuOpen = false}
         class="text-sm text-white/70 hover:text-white transition-colors">Projets</a>
      <button on:click={audioStore.toggleMute}
        class="flex items-center gap-2 text-sm text-white/60 hover:text-white w-fit">
        <Icon name={isMuted ? 'SpeakerOff' : 'Speaker'} size={14} />
        Son {isMuted ? 'OFF' : 'ON'}
      </button>
    </div>
  {/if}
</nav>
