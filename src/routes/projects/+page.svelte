<!-- src/routes/projects/+page.svelte -->
<script lang="ts">
  import { PROJECTS, heroSize } from '$lib/data/projects';
  import PageShell from '$lib/components/PageShell.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import PageCta from '$lib/components/PageCta.svelte';
  import Tag from '$lib/components/Tag.svelte';
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
  import { jsonLd } from '$lib/utils/text';
  import { projectSrcset } from '$lib/utils/img';
  import { playInView } from '$lib/actions/playInView';

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
      <a
        href="/projects/{project.slug}"
        aria-label="Voir le projet {project.title}"
        class="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden
               hover:bg-white/[0.08] hover:border-white/20 hover:shadow-glow-card
               transition-all duration-500 text-left
               focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div class="relative h-56 overflow-hidden">
          <div
            class="mesh-gradient-bg opacity-0 group-hover:opacity-20 transition-opacity duration-500"
            aria-hidden="true"
          ></div>
          {#if project.video}
            <!-- Lecture au survol sur un appareil à pointeur : la première
                 carte est au-dessus de la ligne de flottaison, et 2,4 Mo
                 partaient au chargement sans que personne ne l'ait demandé. -->
            <video
              src={project.video}
              poster={project.videoPoster}
              use:playInView={{ hover: true }}
              preload="none"
              loop
              muted
              playsinline
              aria-hidden="true"
              width={heroSize(project).width}
              height={heroSize(project).height}
              class="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-[1.03]"
            ></video>
          {:else if project.image || project.media?.length}
            <img
              src={project.image || project.media![0].src}
              srcset={projectSrcset(project.image || project.media![0].src)}
              sizes="(min-width: 768px) 50vw, 100vw"
              alt=""
              width={heroSize(project).width}
              height={heroSize(project).height}
              class="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
            />
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
          <div class="flex flex-wrap gap-2">
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
      secondaryLabel="Voir comment je travaille"
      secondaryIcon="ArrowRight"
    >
      {#snippet lede()}
        Design systems, assistants IA et interfaces complexes. Dites-moi le vôtre.
      {/snippet}
    </PageCta>
  </div>
</PageShell>
