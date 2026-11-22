<!-- src/routes/projects/+page.svelte -->
<script lang="ts">
  import { PROJECTS, heroSize, fanSheets } from '#lib/data/projects.ts';
  import PageShell from '#lib/components/PageShell.svelte';
  import PageHeader from '#lib/components/PageHeader.svelte';
  import PageCta from '#lib/components/PageCta.svelte';
  import Tag from '#lib/components/Tag.svelte';
  import {
    SITE_URL,
    SITE_NAME,
    SITE_LOCALE,
    OG_IMAGE,
    PERSON_ID,
    WEBSITE_ID,
    CONTENT_UPDATED
  } from '#lib/data/site.ts';
  import { breadcrumb } from '#lib/data/person.ts';
  import { jsonLd } from '#lib/utils/text.ts';
  import { projectSrcset } from '#lib/utils/img.ts';
  import { fanCard } from '#lib/actions/fanCard.ts';
  import { seen } from '#lib/actions/seen.ts';

  const CRUMBS = [
    { name: 'Accueil', path: '/' },
    { name: 'Projets', path: '/projects' }
  ];
</script>

<svelte:head>
  <title>Projets, études de cas Design System, IA et SaaS B2B | Rémy Bourgeois</title>
  <meta
    name="description"
    content="Cinq études de cas détaillées : design systems multi-marques, assistants IA conversationnels, SaaS B2B et robotique humanoïde. 14 ans de pratique, documentés."
  />

  <meta property="og:type" content="website" />
  <meta property="og:locale" content={SITE_LOCALE} />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta
    property="og:title"
    content="Projets, études de cas Design System, IA et SaaS B2B | Rémy Bourgeois"
  />
  <meta
    property="og:description"
    content="Cinq études de cas détaillées : design systems multi-marques, assistants IA conversationnels, SaaS B2B et robotique humanoïde. 14 ans de pratique, documentés."
  />
  <meta property="og:image" content={OG_IMAGE} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Rémy Bourgeois, Designing Intentions" />
  <meta property="og:url" content="{SITE_URL}/projects" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta
    name="twitter:title"
    content="Projets, études de cas Design System, IA et SaaS B2B | Rémy Bourgeois"
  />
  <meta
    name="twitter:description"
    content="Cinq études de cas détaillées : design systems multi-marques, assistants IA conversationnels, SaaS B2B et robotique humanoïde. 14 ans de pratique, documentés."
  />
  <meta name="twitter:image" content={OG_IMAGE} />
  <meta name="twitter:image:alt" content="Rémy Bourgeois, Designing Intentions" />
  <meta name="twitter:url" content="{SITE_URL}/projects" />

  {@html `<script type="application/ld+json">${jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      breadcrumb(CRUMBS),
      {
        '@type': 'CollectionPage',
        '@id': SITE_URL + '/projects#collection',
        url: SITE_URL + '/projects',
        name: 'Projets, études de cas Design System, IA et SaaS B2B | Rémy Bourgeois',
        description:
          'Cinq études de cas détaillées : design systems multi-marques, assistants IA conversationnels, SaaS B2B et robotique humanoïde. 14 ans de pratique, documentés.',
        inLanguage: 'fr-FR',
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': PERSON_ID },
        dateModified: CONTENT_UPDATED,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: PROJECTS.length,
          itemListElement: PROJECTS.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE_URL}/projects/${p.slug}`,
            name: p.title
          }))
        }
      }
    ]
  })}<\/script>`}
</svelte:head>

<PageShell>
  <PageHeader title="Projets" crumbs={CRUMBS}>
    {#snippet lede()}
      Cinq études de cas détaillées : design systems multi-marques, assistants IA conversationnels,
      SaaS B2B et robotique humanoïde.
    {/snippet}
  </PageHeader>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    {#each PROJECTS as project (project.slug)}
      {@const sheets = fanSheets(project)}
      {@const hasVisual = Boolean(project.video || project.image || project.media?.length)}
      <!--
        Éventail : les autres écrans du projet sont empilés derrière le visuel
        et s'écartent à l'ouverture de la carte (action `fanCard`, app.css).
        `data-fan` porte le nombre de feuilles, la géométrie en dépend : à deux,
        la paire se répartit de part et d'autre de l'axe.
      -->
      <a
        href="/projects/{project.slug}"
        aria-label="Voir le projet {project.title}"
        use:fanCard
        data-fan={sheets.length + 1}
        class="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden
               hover:bg-white/[0.08] hover:border-white/20 hover:shadow-glow-card
               data-[fan-open]:bg-white/[0.08] data-[fan-open]:border-white/20 data-[fan-open]:shadow-glow-card
               transition-all duration-500 text-left
               focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div class="relative h-56 overflow-hidden">
          <div
            class="mesh-gradient-bg opacity-0 group-hover:opacity-20 transition-opacity duration-500"
            aria-hidden="true"
          ></div>
          {#if hasVisual}
            {#each sheets as sheet, i (sheet.src)}
              <div class="fan-sheet {i === 0 ? 'fan-sheet-l' : 'fan-sheet-r'}" aria-hidden="true">
                <img
                  src={sheet.src}
                  srcset={projectSrcset(sheet.src)}
                  sizes="260px"
                  alt=""
                  width={sheet.width}
                  height={sheet.height}
                  class="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
            {/each}
            <div class="fan-sheet fan-sheet-front">
              {#if project.video}
                <!-- Lue par `fanCard` à l'ouverture de la carte, jamais au
                     chargement : la première carte est au-dessus de la ligne
                     de flottaison, et la vidéo partait sans que personne ne
                     l'ait demandée. -->
                <video
                  src={project.video}
                  poster={project.videoPoster}
                  preload="none"
                  loop
                  muted
                  playsinline
                  aria-hidden="true"
                  width={heroSize(project).width}
                  height={heroSize(project).height}
                  class="w-full h-full object-cover object-top"
                ></video>
              {:else}
                <img
                  src={project.image || project.media![0].src}
                  srcset={projectSrcset(project.image || project.media![0].src)}
                  sizes="260px"
                  alt=""
                  width={heroSize(project).width}
                  height={heroSize(project).height}
                  class="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              {/if}
            </div>
          {:else}
            <div class="w-full h-full flex items-center justify-center">
              <span class="eyebrow text-white/50">Bientôt</span>
            </div>
          {/if}
        </div>
        <div class="p-6">
          {#if project.logo}
            <div class="h-6 mb-3 opacity-70">
              <img
                src={project.logo}
                alt=""
                class="h-full w-auto object-contain brightness-0 invert"
                loading="lazy"
              />
            </div>
          {:else}
            <div class="h-6 mb-3 opacity-70 flex items-center">
              <span class="text-sm font-semibold text-white/50">{project.client}</span>
            </div>
          {/if}
          <h2
            class="text-lg font-semibold text-white mb-3 group-hover:text-accent transition-colors"
          >
            {project.title}
          </h2>
          <div use:seen class="tag-cascade flex flex-wrap gap-2">
            {#each project.tags as tag (tag)}
              <Tag>{tag}</Tag>
            {/each}
          </div>
        </div>
      </a>
    {/each}
  </div>

  <div class="mt-20">
    <PageCta
      title="Un projet qui ressemble à ceux-là ?"
      secondaryHref="/accompagnement"
      secondaryLabel="Voir l'accompagnement"
      secondaryIcon="ArrowRight"
    >
      {#snippet lede()}
        Design systems, assistants IA et interfaces complexes. Dites-moi le vôtre.
      {/snippet}
    </PageCta>
  </div>
</PageShell>
