<!-- src/routes/projects/[slug]/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';
  import Icon from '$lib/components/Icons.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Button from '$lib/components/Button.svelte';
  import PageShell from '$lib/components/PageShell.svelte';
  import Breadcrumb from '$lib/components/Breadcrumb.svelte';
  import PageCta from '$lib/components/PageCta.svelte';
  import {
    SITE_URL,
    SITE_NAME,
    SITE_LOCALE,
    OG_IMAGE,
    PERSON_ID,
    WEBSITE_ID,
    CONTENT_UPDATED
  } from '$lib/data/site';
  import { breadcrumb } from '$lib/data/person';
  import { md, jsonLd } from '$lib/utils/text';
  import { projectSrcset } from '$lib/utils/img';
  import { heroSize } from '$lib/data/projects';

  const { data }: { data: PageData } = $props();
  const project = $derived(data.project);
  const prev = $derived(data.prev);
  const next = $derived(data.next);
  const index = $derived(data.index);

  const crumbs = $derived([
    { name: 'Accueil', path: '/' },
    { name: 'Projets', path: '/projects' },
    { name: project.title, path: `/projects/${project.slug}` }
  ]);

  // ── Slides : hero + galerie fusionnés dans un seul tableau ────────────────
  type Slide = {
    type: 'image' | 'video';
    src: string;
    caption?: string;
    poster?: string;
    width: number;
    height: number;
  };

  const slides = $derived.by((): Slide[] => {
    const items: Slide[] = [];
    const hero = heroSize(project);
    if (project.video)
      items.push({ type: 'video', src: project.video, poster: project.videoPoster, ...hero });
    else if (project.image) items.push({ type: 'image', src: project.image, ...hero });
    if (project.media) items.push(...project.media);
    return items;
  });

  // ── Carousel ───────────────────────────────────────────────────────────────
  let carIndex = $state(0);
  let carTrack = $state<HTMLDivElement | null>(null);
  let touchX = $state(0);

  function carPrev() {
    carIndex = (carIndex - 1 + slides.length) % slides.length;
  }
  function carNext() {
    carIndex = (carIndex + 1) % slides.length;
  }
  function carGo(i: number) {
    carIndex = i;
  }

  function onTouchStart(e: TouchEvent) {
    touchX = e.touches[0].clientX;
  }
  function onTouchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) dx < 0 ? carNext() : carPrev();
  }

  // Reset du carousel + lightbox à chaque changement de projet (navigation client-side).
  // Sans ça, carIndex garde sa valeur précédente et le transform pointe hors-limites.
  $effect(() => {
    void project.id; // dépendance réactive : se déclenche quand on change de projet
    carIndex = 0;
    lbOpen = false;
    lbIndex = 0;
    lockScroll(false);
  });

  // Lecture pilotée entièrement ici. Les <video> n'ont ni `autoplay` ni preload :
  // sans ça le navigateur téléchargeait les trois vidéos en parallèle dès l'arrivée
  // sur la page, soit 12 Mo pour un seul visuel visible.
  $effect(() => {
    if (!carTrack) return;
    carTrack.querySelectorAll<HTMLVideoElement>('video').forEach((v, i) => {
      if (i === carIndex) v.play().catch(() => {});
      else v.pause();
    });
  });

  // ── Lightbox ───────────────────────────────────────────────────────────────
  let lbOpen = $state(false);
  let lbIndex = $state(0);
  let lbCloseEl = $state<HTMLButtonElement | null>(null);
  let lbTrigger: HTMLButtonElement | null = null;

  const lbSlide = $derived(slides[lbIndex]);
  const lbCaption = $derived(slides[lbIndex]?.caption ?? null);
  const lbBadge = $derived(slides.length > 1 ? `${lbIndex + 1} / ${slides.length}` : null);

  function openSlide(i: number, trigger?: HTMLButtonElement) {
    lbTrigger = trigger ?? null;
    lbIndex = i;
    lbOpen = true;
    lockScroll(true);
    // Focus déplacé vers "Fermer" après le rendu
    setTimeout(() => lbCloseEl?.focus(), 50);
  }

  function closeLightbox() {
    lbOpen = false;
    lockScroll(false);
    lbTrigger?.focus();
  }

  function trapFocus(e: KeyboardEvent) {
    if (e.key !== 'Tab' || !lbCloseEl) return;
    const dialog = lbCloseEl.closest('[role="dialog"]') as HTMLElement;
    if (!dialog) return;
    const focusable = [
      ...dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])'
      )
    ];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function lbPrev() {
    if (lbIndex > 0) lbIndex--;
  }
  function lbNext() {
    if (lbIndex < slides.length - 1) lbIndex++;
  }

  function lockScroll(lock: boolean) {
    if (typeof document !== 'undefined') document.body.style.overflow = lock ? 'hidden' : '';
  }

  // Les flèches du carousel et de la lightbox partagent la même forme.
  const arrowClass =
    'w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-primary/30 hover:border-primary/50 transition-all disabled:opacity-20 disabled:pointer-events-none';
</script>

<svelte:window
  onkeydown={(e) => {
    if (!lbOpen) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbPrev();
    if (e.key === 'ArrowRight') lbNext();
    trapFocus(e);
  }}
/>

<svelte:head>
  <title>{project.title}, {project.role} | Rémy Bourgeois</title>
  <meta name="description" content={project.seoDescription} />

  <meta property="og:type" content="article" />
  <meta property="og:locale" content={SITE_LOCALE} />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:title" content="{project.title} | Rémy Bourgeois" />
  <meta property="og:description" content={project.seoDescription} />
  <meta property="og:image" content={OG_IMAGE} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Rémy Bourgeois, Designing Intentions" />
  <meta property="og:url" content="{SITE_URL}/projects/{project.slug}" />
  <meta property="article:author" content="Rémy Bourgeois" />
  <meta property="article:modified_time" content={CONTENT_UPDATED} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{project.title} | Rémy Bourgeois" />
  <meta name="twitter:description" content={project.seoDescription} />
  <meta name="twitter:image" content={OG_IMAGE} />
  <meta name="twitter:image:alt" content="Rémy Bourgeois, Designing Intentions" />
  <meta name="twitter:url" content="{SITE_URL}/projects/{project.slug}" />

  {@html `<script type="application/ld+json">${jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      breadcrumb(crumbs),
      {
        '@type': 'CreativeWork',
        '@id': `${SITE_URL}/projects/${project.slug}#work`,
        url: `${SITE_URL}/projects/${project.slug}`,
        name: project.title,
        headline: `${project.title}, ${project.role}`,
        description: project.seoDescription,
        abstract: `${project.summary.context} Impact : ${project.summary.impact}`,
        inLanguage: 'fr-FR',
        isPartOf: { '@id': WEBSITE_ID },
        creator: { '@id': PERSON_ID },
        author: { '@id': PERSON_ID },
        keywords: project.tags,
        about: project.tags,
        temporalCoverage: project.year,
        dateModified: CONTENT_UPDATED,
        sourceOrganization: { '@type': 'Organization', name: project.client },
        image: project.image ? SITE_URL + project.image : OG_IMAGE
      }
    ]
  })}<\/script>`}
</svelte:head>

<!-- ─── Lightbox ─────────────────────────────────────────────────────────── -->
{#if lbOpen && lbSlide}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-[300] bg-overlay/98 backdrop-blur-xl flex flex-col lb-enter"
    onclick={closeLightbox}
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    aria-label="Aperçu plein écran"
  >
    <!-- Barre supérieure -->
    <div
      role="none"
      class="flex items-center justify-between px-5 py-4 flex-shrink-0"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="flex items-center gap-3">
        {#if lbBadge}
          <span
            class="font-mono text-xs text-white/55 bg-white/[0.05] border border-white/[0.07] px-3 py-1 rounded-full"
          >
            {lbBadge}
          </span>
        {/if}
        {#if lbCaption}
          <span class="text-xs text-white/60">{lbCaption}</span>
        {/if}
      </div>
      <button
        bind:this={lbCloseEl}
        class="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-white/50 hover:text-white text-xs transition-all"
        onclick={closeLightbox}
        aria-label="Fermer la lightbox"
      >
        <Icon name="X" size={13} /> Fermer
      </button>
    </div>

    <!--
      Les flèches sont posées PAR-DESSUS le média, pas à côté : en colonne
      avec lui, elles lui prenaient 120 px de large à 390 px et la vidéo
      finissait sur 230 px, plus petite que dans le carousel qu'on venait
      d'agrandir.
    -->
    <div
      role="none"
      class="relative flex-1 flex items-center justify-center px-2 sm:px-5 pb-5 min-h-0"
      onclick={(e) => e.stopPropagation()}
    >
      <div
        class="relative w-full max-w-5xl min-h-0 max-h-full rounded-2xl overflow-hidden
                  bg-gradient-to-br from-panel-from to-panel-to border border-white/[0.07]
                  flex items-center justify-center p-2 sm:p-6"
      >
        {#if lbSlide.type === 'video'}
          <!-- Démo d'interface muette, sans parole ni son : une piste de
               sous-titres n'aurait rien à transcrire. L'ancienne `<track>`
               vide satisfaisait l'avertisseur sans servir personne. -->
          <!-- svelte-ignore a11y_media_has_caption -->
          <!-- ds-allow-autoplay: la lightbox ne s'ouvre que sur un clic du visiteur -->
          <video
            src={lbSlide.src}
            poster={lbSlide.poster}
            controls
            autoplay
            width={lbSlide.width}
            height={lbSlide.height}
            class="max-w-full max-h-[78vh] object-contain rounded-xl"
          ></video>
        {:else}
          <img
            src={lbSlide.src}
            srcset={projectSrcset(lbSlide.src)}
            sizes="100vw"
            alt={lbCaption ?? project.title}
            width={lbSlide.width}
            height={lbSlide.height}
            class="max-w-full max-h-[78vh] object-contain rounded-xl"
          />
        {/if}
      </div>

      {#if slides.length > 1}
        <button
          class="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 {arrowClass}"
          onclick={lbPrev}
          disabled={lbIndex === 0}
          aria-label="Précédent"
        >
          <Icon name="ArrowLeft" size={15} />
        </button>
        <button
          class="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 {arrowClass}"
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
<PageShell>
  <Breadcrumb items={crumbs} />

  <!--
    Le H1 porte la hiérarchie visuelle : avant, le logo client faisait 56 px
    de haut et le titre du projet, pourtant le H1, 20 px en blanc atténué. Ce
    que la page annonce comme principal est maintenant ce qu'on voit en
    premier ; le logo redevient une marque d'identification.
  -->
  <header
    class="grid grid-cols-1 md:grid-cols-[1fr_200px] items-end pb-12 mb-14 border-b border-white/[0.06]"
  >
    <div class="flex flex-col items-start gap-5">
      <span class="font-mono text-xs text-accent tracking-[0.15em]">
        {String(index + 1).padStart(3, '0')}
      </span>

      {#if project.logo}
        <img
          src={project.logo}
          alt={project.client}
          class="h-7 w-auto object-contain brightness-0 invert opacity-80"
          loading="eager"
        />
      {:else}
        <span class="eyebrow text-white/60">{project.client}</span>
      {/if}

      <h1 class="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05]">
        {project.title}
      </h1>

      {#if project.tags.length > 0}
        <div class="flex flex-wrap gap-2">
          {#each project.tags as tag (tag)}
            <Tag>{tag}</Tag>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Droite : rôle + année, ancrés en bas -->
    {#if project.role || project.year}
      <div
        class="flex flex-row md:flex-col gap-6 md:gap-5
                  md:justify-end md:pl-8 md:border-l md:border-white/[0.07]
                  border-t border-white/[0.07] md:border-t-0 pt-5 md:pt-0 mt-5 md:mt-0"
      >
        {#if project.role}
          <div>
            <div class="eyebrow text-white/60 mb-1">Rôle</div>
            <div class="text-sm text-white/85 font-medium leading-snug">{project.role}</div>
          </div>
        {/if}
        {#if project.year}
          <div>
            <div class="eyebrow text-white/60 mb-1">Année</div>
            <div class="text-sm text-white/60 font-mono">{project.year}</div>
          </div>
        {/if}
      </div>
    {/if}
  </header>

  <!-- ── En bref ─────────────────────────────────────────────────────────── -->
  <!-- Résumé extractible tel quel par un moteur génératif : contexte, stack, impact. -->
  <section
    aria-labelledby="en-bref-title"
    class="mb-10 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 md:p-6"
  >
    <h2 id="en-bref-title" class="eyebrow text-white/60 mb-5">En bref</h2>
    <dl class="grid gap-5 md:grid-cols-3 md:gap-8">
      <div>
        <dt class="eyebrow text-white/60 mb-2">Contexte</dt>
        <dd class="text-sm text-white/70 leading-relaxed">{project.summary.context}</dd>
      </div>
      <div>
        <dt class="eyebrow text-white/60 mb-2">Stack &amp; méthodes</dt>
        <dd>
          <ul class="flex flex-wrap gap-2">
            {#each project.summary.stack as item (item)}
              <Tag as="li">{item}</Tag>
            {/each}
          </ul>
        </dd>
      </div>
      <div>
        <dt class="eyebrow text-accent mb-2">Impact</dt>
        <dd class="text-sm text-white/85 leading-relaxed font-medium">
          {project.summary.impact}
        </dd>
      </div>
    </dl>
  </section>

  <!-- ── Carousel ──────────────────────────────────────────────────────── -->
  {#if slides.length > 0}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="relative rounded-3xl overflow-hidden bg-gradient-to-br from-panel-from to-panel-to border border-white/[0.07] group"
      ontouchstart={onTouchStart}
      ontouchend={onTouchEnd}
    >
      <!-- Track -->
      <div
        bind:this={carTrack}
        class="flex"
        style="transform: translateX(-{carIndex *
          100}%); transition: transform 0.45s cubic-bezier(.4,0,.2,1);"
      >
        {#each slides as slide, i (slide.src)}
          <button
            class="flex-[0_0_100%] flex items-center justify-center p-4 sm:p-6 md:p-10 min-h-[260px] sm:min-h-[380px] md:min-h-[500px] cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            onclick={(e) => openSlide(i, e.currentTarget as HTMLButtonElement)}
            tabindex={i === carIndex ? 0 : -1}
            aria-hidden={i === carIndex ? undefined : 'true'}
            aria-label="Voir {slide.caption ?? `le visuel ${i + 1}`} en plein écran"
          >
            {#if slide.type === 'video'}
              <video
                src={slide.src}
                poster={slide.poster}
                preload="none"
                loop
                muted
                playsinline
                aria-hidden="true"
                width={slide.width}
                height={slide.height}
                class="max-w-full max-h-[55vh] sm:max-h-[65vh] object-contain pointer-events-none"
              ></video>
            {:else}
              <img
                src={slide.src}
                srcset={projectSrcset(slide.src)}
                sizes="(min-width: 1024px) 1024px, 100vw"
                alt={slide.caption ?? ''}
                loading={i === 0 ? 'eager' : 'lazy'}
                width={slide.width}
                height={slide.height}
                class="max-w-full max-h-[55vh] sm:max-h-[65vh] object-contain pointer-events-none"
              />
            {/if}
          </button>
        {/each}
      </div>

      <!-- Badge slide x/n -->
      {#if slides.length > 1}
        <div
          class="absolute top-4 right-4 font-mono text-xs text-white/55 bg-black/35 border border-white/[0.07] px-3 py-1 rounded-full pointer-events-none"
        >
          {carIndex + 1} / {slides.length}
        </div>
      {/if}

      <!-- Plein écran hint (hover desktop) -->
      <div
        class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      >
        <div
          class="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white text-xs font-medium"
        >
          <Icon name="Maximize2" size={13} /> Plein écran
        </div>
      </div>

      <!--
        Flèches de navigation. Révélées au survol sur un appareil à pointeur,
        toujours visibles au toucher : `group-hover` n'existe pas sur un
        téléphone, et le balayage seul n'annonce pas qu'il y a une suite.
      -->
      {#if slides.length > 1}
        <button
          class="absolute left-4 top-1/2 -translate-y-1/2 z-10 {arrowClass} opacity-0 group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
          onclick={(e) => {
            e.stopPropagation();
            carPrev();
          }}
          aria-label="Précédent"
        >
          <Icon name="ArrowLeft" size={16} />
        </button>
        <button
          class="absolute right-4 top-1/2 -translate-y-1/2 z-10 {arrowClass} opacity-0 group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
          onclick={(e) => {
            e.stopPropagation();
            carNext();
          }}
          aria-label="Suivant"
        >
          <Icon name="ArrowRight" size={16} />
        </button>
      {/if}
    </div>

    <!-- Dots -->
    {#if slides.length > 1}
      <!--
        La pastille reste fine, mais le bouton qui la porte fait 44 px de
        côté : une cible de 5 px est introuvable au doigt. La barre est un
        <span> décoratif, la zone sensible est le <button> autour. Les
        pastilles inactives sont à 35 % de blanc : 18 % restait sous les 3:1
        du contraste non textuel (WCAG 1.4.11), qu'axe ne mesure pas.
      -->
      <div class="flex justify-center items-center pt-2 mb-14">
        {#each slides as _, i (i)}
          <button
            class="h-11 min-w-[44px] px-2 flex items-center justify-center border-none bg-transparent cursor-pointer"
            onclick={() => carGo(i)}
            aria-label="Aller au visuel {i + 1}"
            aria-current={i === carIndex ? 'true' : undefined}
          >
            <span
              class="block h-[5px] rounded-full transition-all duration-300
                     {i === carIndex ? 'w-[22px] bg-primary' : 'w-[5px] bg-white/35'}"
              aria-hidden="true"
            ></span>
          </button>
        {/each}
      </div>
    {:else}
      <div class="mb-14"></div>
    {/if}
  {:else}
    <!-- Placeholder si aucun media -->
    <div
      class="rounded-3xl bg-gradient-to-br from-panel-from to-panel-to border border-white/[0.07] min-h-[300px] flex items-center justify-center mb-14"
    >
      <span class="eyebrow text-white/50">Bientôt</span>
    </div>
  {/if}

  <!-- ── Contexte ────────────────────────────────────────────────────────── -->
  <!-- La page a la largeur des autres ; c'est ce bloc qui tient la mesure
       du texte, à 46 rem comme l'accroche des en-têtes. -->
  <div class="mb-14 flex flex-col gap-10 max-w-[46rem]">
    <!-- Description principale -->
    <div class="pl-5 border-l border-white/[0.1]">
      <h2 class="eyebrow text-white/60 mb-4">Contexte</h2>
      <p class="project-text text-white/65 text-base md:text-[1.05rem] leading-[1.85]">
        {@html md(project.description)}
      </p>
      {#if project.url}
        <div class="mt-6">
          <Button href={project.url} variant="secondary" size="sm" iconLeft="ExternalLink" external>
            Voir le projet en ligne
          </Button>
        </div>
      {/if}
    </div>

    <!-- Challenge -->
    {#if project.challenge}
      <div class="pl-5 border-l-2 border-primary/50">
        <h2 class="eyebrow text-accent mb-4">Challenge</h2>
        <p class="project-text text-white/60 text-base leading-[1.85]">
          {@html md(project.challenge)}
        </p>
      </div>
    {/if}

    <!-- Résultat -->
    {#if project.outcome}
      <div class="pl-5 border-l-2 border-emerald-400/50">
        <h2 class="eyebrow text-emerald-400/70 mb-4">Résultat</h2>
        <p class="project-text text-white/60 text-base leading-[1.85]">
          {@html md(project.outcome)}
        </p>
      </div>
    {/if}
  </div>

  <!-- ── Prev / Next ─────────────────────────────────────────────────────── -->
  <nav
    aria-label="Autres études de cas"
    class="border-t border-white/[0.08] pt-10 flex flex-col sm:flex-row gap-4 justify-between"
  >
    {#if prev}
      <a
        href="/projects/{prev.slug}"
        class="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]
               hover:bg-white/[0.08] hover:border-white/15 transition-all duration-300 group
               flex-1 sm:flex-none sm:max-w-[240px] min-h-[60px]
               focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Icon
          name="ArrowLeft"
          size={15}
          className="text-white/55 group-hover:text-white/80 transition-colors flex-shrink-0"
        />
        <div class="min-w-0">
          <div class="eyebrow text-white/60 mb-0.5">Précédent</div>
          <div
            class="text-sm font-medium text-white/60 group-hover:text-white transition-colors truncate"
          >
            {prev.title}
          </div>
        </div>
      </a>
    {:else}
      <div></div>
    {/if}

    {#if next}
      <a
        href="/projects/{next.slug}"
        class="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]
               hover:bg-white/[0.08] hover:border-white/15 transition-all duration-300 group
               flex-1 sm:flex-none sm:max-w-[240px] justify-end text-right min-h-[60px]
               focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div class="min-w-0">
          <div class="eyebrow text-white/60 mb-0.5">Suivant</div>
          <div
            class="text-sm font-medium text-white/60 group-hover:text-white transition-colors truncate"
          >
            {next.title}
          </div>
        </div>
        <Icon
          name="ArrowRight"
          size={15}
          className="text-white/55 group-hover:text-white/80 transition-colors flex-shrink-0"
        />
      </a>
    {:else}
      <div></div>
    {/if}
  </nav>

  <!-- La page se terminait sur « Suivant » : le parcours de conversion
       s'arrêtait là où il devrait aboutir. -->
  <div class="mt-20">
    <PageCta
      title="Un projet qui ressemble à celui-là ?"
      secondaryHref="/accompagnement"
      secondaryLabel="Voir comment je travaille"
      secondaryIcon="ArrowRight"
    >
      {#snippet lede()}
        Design systems, assistants IA et interfaces complexes. Dites-moi le vôtre.
      {/snippet}
    </PageCta>
  </div>
</PageShell>

<style>
  .lb-enter {
    animation: lb-in 0.18s ease-out both;
  }
  @keyframes lb-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
