<!-- src/routes/projects/[slug]/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';
  import Icon from '$lib/components/Icons.svelte';
  import { sfx } from '$lib/actions/sfx';
  import { SITE_URL } from '$lib/data/site';
  import { md } from '$lib/utils/text';

  const { data }: { data: PageData } = $props();
  const project = $derived(data.project);
  const prev    = $derived(data.prev);
  const next    = $derived(data.next);
  const index   = $derived(data.index);

  // ── Slides : hero + galerie fusionnés dans un seul tableau ────────────────
  type Slide = { type: 'image' | 'video'; src: string; caption?: string; poster?: string };

  const slides = $derived.by((): Slide[] => {
    const items: Slide[] = [];
    if (project.video)  items.push({ type: 'video', src: project.video });
    else if (project.image) items.push({ type: 'image', src: project.image });
    if (project.media)  items.push(...project.media);
    return items;
  });

  // ── Carousel ───────────────────────────────────────────────────────────────
  let carIndex  = $state(0);
  let carTrack  = $state<HTMLDivElement | null>(null);
  let touchX    = $state(0);

  function carPrev() { carIndex = (carIndex - 1 + slides.length) % slides.length; }
  function carNext() { carIndex = (carIndex + 1) % slides.length; }
  function carGo(i: number) { carIndex = i; }

  function onTouchStart(e: TouchEvent) { touchX = e.touches[0].clientX; }
  function onTouchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) dx < 0 ? carNext() : carPrev();
  }

  // Reset du carousel + lightbox à chaque changement de projet (navigation client-side).
  // Sans ça, carIndex garde sa valeur précédente et le transform pointe hors-limites.
  $effect(() => {
    void project.id;  // dépendance réactive : se déclenche quand on change de projet
    carIndex = 0;
    lbOpen   = false;
    lbIndex  = 0;
    lockScroll(false);
  });

  // Lecture/pause des vidéos selon le slide actif
  $effect(() => {
    if (!carTrack) return;
    carTrack.querySelectorAll<HTMLVideoElement>('video').forEach((v, i) => {
      i === carIndex ? v.play().catch(() => {}) : v.pause();
    });
  });

  // ── Lightbox ───────────────────────────────────────────────────────────────
  let lbOpen  = $state(false);
  let lbIndex = $state(0);

  const lbSlide   = $derived(slides[lbIndex]);
  const lbCaption = $derived(slides[lbIndex]?.caption ?? null);
  const lbBadge   = $derived(slides.length > 1 ? `${lbIndex + 1} / ${slides.length}` : null);

  function openSlide(i: number) {
    lbIndex = i;
    lbOpen  = true;
    lockScroll(true);
  }

  function closeLightbox() {
    lbOpen = false;
    lockScroll(false);
  }

  function lbPrev() { if (lbIndex > 0) lbIndex--; }
  function lbNext() { if (lbIndex < slides.length - 1) lbIndex++; }

  function lockScroll(lock: boolean) {
    if (typeof document !== 'undefined') document.body.style.overflow = lock ? 'hidden' : '';
  }
</script>

<svelte:window onkeydown={(e) => {
  if (!lbOpen) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  lbPrev();
  if (e.key === 'ArrowRight') lbNext();
}} />

<svelte:head>
  <title>{project.title} — Rémy Bourgeois</title>
  <meta name="description" content={project.description.replace(/\*\*/g, '').slice(0, 160)} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Rémy Bourgeois — Portfolio" />
  <meta property="og:title" content="{project.title} — Rémy Bourgeois" />
  <meta property="og:description" content={project.description.replace(/\*\*/g, '').slice(0, 160)} />
  <meta property="og:image" content="{SITE_URL}{project.image || project.media?.[0]?.src || ''}" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<!-- ─── Lightbox ─────────────────────────────────────────────────────────── -->
{#if lbOpen && lbSlide}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-[300] bg-[#060609]/98 backdrop-blur-xl flex flex-col lb-enter"
    onclick={closeLightbox}
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    aria-label="Aperçu plein écran"
  >
    <!-- Barre supérieure -->
    <div role="none" class="flex items-center justify-between px-5 py-4 flex-shrink-0" onclick={(e) => e.stopPropagation()}>
      <div class="flex items-center gap-3">
        {#if lbBadge}
          <span class="font-mono text-[10px] text-white/25 bg-white/[0.05] border border-white/[0.07] px-3 py-1 rounded-full">
            {lbBadge}
          </span>
        {/if}
        {#if lbCaption}
          <span class="text-xs text-white/40">{lbCaption}</span>
        {/if}
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-white/50 hover:text-white text-xs transition-all"
        onclick={closeLightbox}
        aria-label="Fermer"
      >
        <Icon name="X" size={13} /> Fermer
      </button>
    </div>

    <!-- Media + flèches -->
    <div role="none" class="flex-1 flex items-center justify-center px-5 pb-5 gap-4 min-h-0" onclick={(e) => e.stopPropagation()}>

      {#if slides.length > 1}
        <button
          class="flex-shrink-0 w-10 h-10 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.08]
                 flex items-center justify-center text-white/40 hover:text-white transition-all
                 disabled:opacity-20 disabled:pointer-events-none"
          onclick={lbPrev}
          disabled={lbIndex === 0}
          aria-label="Précédent"
        >
          <Icon name="ArrowLeft" size={15} />
        </button>
      {/if}

      <div class="relative flex-1 min-w-0 max-w-5xl min-h-0 max-h-full rounded-2xl overflow-hidden
                  bg-gradient-to-br from-[#14102a] to-[#0b091a] border border-white/[0.07]
                  flex items-center justify-center p-6">
        {#if lbSlide.type === 'video'}
          <!-- svelte-ignore a11y_media_has_caption -->
          <video src={lbSlide.src} controls autoplay
                 class="max-w-full max-h-[78vh] object-contain rounded-xl">
            <track kind="captions" src="" label="Captions" />
          </video>
        {:else}
          <img src={lbSlide.src} alt={lbCaption ?? ''}
               class="max-w-full max-h-[78vh] object-contain rounded-xl" />
        {/if}
      </div>

      {#if slides.length > 1}
        <button
          class="flex-shrink-0 w-10 h-10 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.08]
                 flex items-center justify-center text-white/40 hover:text-white transition-all
                 disabled:opacity-20 disabled:pointer-events-none"
          onclick={lbNext}
          disabled={lbIndex === slides.length - 1}
          aria-label="Suivant"
        >
          <Icon name="ArrowRight" size={15} />
        </button>
      {/if}
    </div>
  </div>
{/if}

<!-- ─── Page ──────────────────────────────────────────────────────────────── -->
<div class="min-h-screen bg-[#020205] text-white">
  <div class="max-w-5xl mx-auto px-6 pt-28 pb-24">

    <!-- Retour -->
    <a
      href="/projects"
      use:sfx
      class="inline-flex items-center gap-2 text-white/40 hover:text-white text-xs uppercase tracking-widest mb-14 transition-colors min-h-[44px]"
    >
      <Icon name="ArrowLeft" size={13} />
      Tous les projets
    </a>

    <!-- ── Header — Version A : Split 2 colonnes ────────────────────────── -->
    <header class="grid grid-cols-1 md:grid-cols-[1fr_200px] items-stretch pb-12 mb-14 border-b border-white/[0.06]">

      <!-- Gauche : index + logo + tags -->
      <div class="flex flex-col items-start gap-5">
        <span class="font-mono text-[10px] text-[#706bfe]/40 tracking-[0.15em]">
          {String(index + 1).padStart(3, '0')}
        </span>

        {#if project.logo}
          <img
            src={project.logo}
            alt={project.client}
            class="h-14 w-auto object-contain brightness-0 invert opacity-90"
            loading="eager"
          />
        {:else}
          <span class="text-4xl md:text-5xl font-bold text-white tracking-tight leading-none">
            {project.client}
          </span>
        {/if}

        {#if project.tags.length > 0}
          <div class="flex flex-wrap gap-2">
            {#each project.tags as tag}
              <span class="px-3 py-1 rounded-full bg-white/[0.05] text-white/45 text-[11px] font-medium border border-white/[0.1]">
                {tag}
              </span>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Droite : rôle + année, ancrés en bas -->
      {#if project.role || project.year}
        <div class="flex flex-row md:flex-col gap-6 md:gap-5
                    md:justify-end md:pl-8 md:border-l md:border-white/[0.07]
                    border-t border-white/[0.07] md:border-t-0 pt-5 md:pt-0 mt-5 md:mt-0">
          {#if project.role}
            <div>
              <div class="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1">Rôle</div>
              <div class="text-[13px] text-[#706bfe]/80 font-medium leading-snug">{project.role}</div>
            </div>
          {/if}
          {#if project.year}
            <div>
              <div class="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1">Année</div>
              <div class="text-[13px] text-white/60 font-mono">{project.year}</div>
            </div>
          {/if}
        </div>
      {/if}
    </header>

    <!-- ── Carousel ──────────────────────────────────────────────────────── -->
    {#if slides.length > 0}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#14102a] to-[#0b091a] border border-white/[0.07] group"
        ontouchstart={onTouchStart}
        ontouchend={onTouchEnd}
      >
        <!-- Track -->
        <div
          bind:this={carTrack}
          class="flex"
          style="transform: translateX(-{carIndex * 100}%); transition: transform 0.45s cubic-bezier(.4,0,.2,1);"
        >
          {#each slides as slide, i}
            <button
              class="flex-[0_0_100%] flex items-center justify-center p-6 md:p-10 min-h-[380px] md:min-h-[500px] cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[#706bfe]"
              onclick={() => openSlide(i)}
              tabindex={i === carIndex ? 0 : -1}
              aria-label="Voir en plein écran"
            >
              {#if slide.type === 'video'}
                <video
                  src={slide.src}
                  poster={slide.poster}
                  autoplay loop muted playsinline
                  class="max-w-full max-h-[65vh] object-contain pointer-events-none"
                ></video>
              {:else}
                <img
                  src={slide.src}
                  alt={slide.caption ?? ''}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  class="max-w-full max-h-[65vh] object-contain pointer-events-none"
                />
              {/if}
            </button>
          {/each}
        </div>

        <!-- Badge slide x/n -->
        {#if slides.length > 1}
          <div class="absolute top-4 right-4 font-mono text-[10px] text-white/25 bg-black/35 border border-white/[0.07] px-3 py-1 rounded-full pointer-events-none">
            {carIndex + 1} / {slides.length}
          </div>
        {/if}

        <!-- Plein écran hint (hover desktop) -->
        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div class="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white text-xs font-medium">
            <Icon name="Maximize2" size={13} /> Plein écran
          </div>
        </div>

        <!-- Flèches de navigation -->
        {#if slides.length > 1}
          <button
            class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
                   bg-black/40 backdrop-blur-sm border border-white/10
                   flex items-center justify-center text-white/50
                   hover:text-white hover:bg-[#706bfe]/30 hover:border-[#706bfe]/50
                   transition-all z-10 opacity-0 group-hover:opacity-100"
            onclick={(e) => { e.stopPropagation(); carPrev(); }}
            aria-label="Précédent"
          >
            <Icon name="ArrowLeft" size={16} />
          </button>
          <button
            class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
                   bg-black/40 backdrop-blur-sm border border-white/10
                   flex items-center justify-center text-white/50
                   hover:text-white hover:bg-[#706bfe]/30 hover:border-[#706bfe]/50
                   transition-all z-10 opacity-0 group-hover:opacity-100"
            onclick={(e) => { e.stopPropagation(); carNext(); }}
            aria-label="Suivant"
          >
            <Icon name="ArrowRight" size={16} />
          </button>
        {/if}
      </div>

      <!-- Dots -->
      {#if slides.length > 1}
        <div class="flex justify-center items-center gap-1.5 pt-4 mb-14">
          {#each slides as _, i}
            <button
              class="h-[5px] rounded-full border-none p-0 cursor-pointer transition-all duration-300
                     {i === carIndex ? 'w-[22px] bg-[#706bfe]' : 'w-[5px] bg-white/[0.18] hover:bg-white/30'}"
              onclick={() => carGo(i)}
              aria-label="Aller au visuel {i + 1}"
            ></button>
          {/each}
        </div>
      {:else}
        <div class="mb-14"></div>
      {/if}

    {:else}
      <!-- Placeholder si aucun media -->
      <div class="rounded-3xl bg-gradient-to-br from-[#14102a] to-[#0b091a] border border-white/[0.07] min-h-[300px] flex items-center justify-center mb-14">
        <span class="text-xs uppercase tracking-[0.4em] text-white/15 font-medium">Bientôt</span>
      </div>
    {/if}

    <!-- ── Contexte ────────────────────────────────────────────────────────── -->
    <div class="mb-14 flex flex-col gap-10">

      <!-- Description principale -->
      <div class="pl-5 border-l border-white/[0.1]">
        <p class="text-[9px] uppercase tracking-[0.25em] text-white/25 font-semibold mb-4">Contexte</p>
        <p class="project-text text-white/65 text-base md:text-[1.05rem] leading-[1.85]">
          {@html md(project.description)}
        </p>
        {#if project.url}
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            use:sfx
            class="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-sm transition-all focus-visible:ring-2 focus-visible:ring-[#706bfe]"
          >
            <Icon name="ExternalLink" size={14} /> Voir le projet en ligne
          </a>
        {/if}
      </div>

      <!-- Challenge -->
      {#if project.challenge}
        <div class="pl-5 border-l-2 border-[#706bfe]/50">
          <p class="text-[9px] uppercase tracking-[0.25em] text-[#706bfe]/70 font-semibold mb-4">Challenge</p>
          <p class="project-text text-white/60 text-base leading-[1.85]">{@html md(project.challenge)}</p>
        </div>
      {/if}

      <!-- Résultat -->
      {#if project.outcome}
        <div class="pl-5 border-l-2 border-emerald-400/50">
          <p class="text-[9px] uppercase tracking-[0.25em] text-emerald-400/70 font-semibold mb-4">Résultat</p>
          <p class="project-text text-white/60 text-base leading-[1.85]">{@html md(project.outcome)}</p>
        </div>
      {/if}

    </div>

    <!-- ── Prev / Next ─────────────────────────────────────────────────────── -->
    <div class="border-t border-white/[0.08] pt-10 flex flex-col sm:flex-row gap-4 justify-between">
      {#if prev}
        <a
          href="/projects/{prev.slug}"
          use:sfx
          class="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]
                 hover:bg-white/[0.08] hover:border-white/15 transition-all duration-300 group
                 flex-1 sm:flex-none sm:max-w-[240px] min-h-[60px]
                 focus-visible:ring-2 focus-visible:ring-[#706bfe]"
        >
          <Icon name="ArrowLeft" size={15} className="text-white/30 group-hover:text-white/80 transition-colors flex-shrink-0" />
          <div class="min-w-0">
            <div class="text-[9px] text-white/25 uppercase tracking-[0.15em] mb-0.5">Précédent</div>
            <div class="text-sm font-medium text-white/60 group-hover:text-white transition-colors truncate">{prev.title}</div>
          </div>
        </a>
      {:else}
        <div></div>
      {/if}

      {#if next}
        <a
          href="/projects/{next.slug}"
          use:sfx
          class="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]
                 hover:bg-white/[0.08] hover:border-white/15 transition-all duration-300 group
                 flex-1 sm:flex-none sm:max-w-[240px] justify-end text-right min-h-[60px]
                 focus-visible:ring-2 focus-visible:ring-[#706bfe]"
        >
          <div class="min-w-0">
            <div class="text-[9px] text-white/25 uppercase tracking-[0.15em] mb-0.5">Suivant</div>
            <div class="text-sm font-medium text-white/60 group-hover:text-white transition-colors truncate">{next.title}</div>
          </div>
          <Icon name="ArrowRight" size={15} className="text-white/30 group-hover:text-white/80 transition-colors flex-shrink-0" />
        </a>
      {:else}
        <div></div>
      {/if}
    </div>

  </div>
</div>

<style>
  .lb-enter {
    animation: lb-in 0.18s ease-out both;
  }
  @keyframes lb-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
</style>
