<!-- src/routes/accompagnement/+page.svelte -->
<script lang="ts">
  import RevealOnScroll from '$lib/components/RevealOnScroll.svelte';
  import Icon from '$lib/components/Icons.svelte';
  import PageShell from '$lib/components/PageShell.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import SectionTitle from '$lib/components/SectionTitle.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Button from '$lib/components/Button.svelte';
  import PageCta from '$lib/components/PageCta.svelte';
  import {
    SITE_URL,
    SITE_NAME,
    SITE_LOCALE,
    OG_IMAGE,
    PERSON_ID,
    WEBSITE_ID,
    CONTENT_UPDATED,
    EMAIL
  } from '$lib/data/site';
  import { breadcrumb } from '$lib/data/person';
  import { jsonLd } from '$lib/utils/text';

  /**
   * Trois formats, du produit lui-même au système qui le fabrique. La
   * conception produit vient en premier : c'est le métier de base, et une page
   * qui n'annonce que du design system laisse croire au reste.
   *
   * Aucun tarif ici, et la grille d'audit est nommée sans être détaillée.
   */
  const FORMATS = [
    {
      id: 'conception',
      label: 'Format 1',
      title: 'Conception produit',
      lede: 'UX, UI, parcours et écrans. Le métier de base : produire ce que les gens utilisent, pas seulement le système qui le rend possible.',
      listTitle: 'Ce que je produis',
      items: [
        'Le cadrage, la recherche et les parcours',
        'Les wireframes, puis les écrans finalisés',
        "La direction artistique de l'interface",
        "Des prototypes qu'on peut tester, pas des images",
        "L'accessibilité pensée dès l'écran, pas corrigée après",
        'Les composants livrés dans le dépôt, prêts à être utilisés'
      ],
      meta: 'Au forfait ou en régie · à distance'
    },
    {
      id: 'audit',
      label: 'Format 2',
      title: 'Audit du design system et du workflow',
      lede: 'Un état des lieux chiffré, et une feuille de route pour la suite.',
      listTitle: 'Livrables',
      items: [
        'Une synthèse pour la direction',
        'Le rapport détaillé, axe par axe',
        'Le workflow actuel et le workflow cible',
        'Une feuille de route en trois scénarios',
        'Les indicateurs à suivre ensuite'
      ],
      meta: 'Au forfait · à distance · quelques semaines'
    },
    {
      id: 'mise-en-place',
      label: 'Format 3',
      title: 'Accompagnement à la mise en place',
      lede: "Deux jours par semaine, pour faire vivre le design system avec les équipes plutôt qu'à côté d'elles.",
      listTitle: "Ce qu'on met en place",
      items: [
        'Un pilote sur un périmètre réel, pas une démo',
        "Les garde-fous des agents IA, pour qu'ils génèrent dans le système et pas à côté",
        'La gouvernance et le circuit de contribution',
        'La conduite du changement, côté design comme côté dev'
      ],
      meta: '2 jours par semaine · à distance'
    }
  ];

  const AXES = [
    'Tokens',
    'Composants',
    'Documentation',
    'Accessibilité',
    'Alignement Figma et code',
    'Outillage',
    'Contribution',
    'Gouvernance',
    'Adoption'
  ];

  const CONVICTIONS = [
    "Une seule source de vérité : le code. Figma n'est pas supprimé, il trouve sa place.",
    'Des règles lisibles par une machine, vérifiées à chaque Pull Request, plutôt ' +
      "qu'une documentation que personne ne relit.",
    "Avec l'IA, le design system devient le carburant de la génération. Un système " +
      'mal structuré produit des variantes incohérentes, très vite.',
    'On mesure avant de changer : qualité, délai de mise sur le marché, confort des équipes.'
  ];

  /**
   * Les trois terrains où la méthode a été éprouvée, du plus mûr au plus neuf.
   * Chaque niveau renvoie à son étude de cas : c'est une preuve, pas une
   * phrase d'ambiance posée sous les convictions.
   */
  const TERRAINS = [
    {
      level: 'Grand groupe',
      client: 'Crédit Agricole',
      what: 'Un design system adopté par plus de 15 équipes, à faire vivre sans rien casser.',
      slug: 'credit-agricole'
    },
    {
      level: 'Refonte',
      client: 'iPify',
      what: 'Un existant dense à restructurer, et des briques IA à y intégrer sans friction.',
      slug: 'ipify'
    },
    {
      level: 'Création de zéro',
      client: 'Ofelia',
      what: 'Une page blanche, un premier designer, et le système construit dans le code.',
      slug: 'ofelia'
    }
  ];

  const TITLE = 'Accompagnement design system et conception produit | Rémy Bourgeois';
  const DESCRIPTION =
    'Conception produit, audit de design system et accompagnement à la mise en place. ' +
    'Trois façons de travailler avec Rémy Bourgeois, Lead Design System à Lyon.';

  const CRUMBS = [
    { name: 'Accueil', path: '/' },
    { name: 'Accompagnement', path: '/accompagnement' }
  ];

  // Un courriel qui arrive avec le format en objet évite la question « pour
  // quoi ? » : le visiteur a déjà choisi, l'objet le dit.
  const mailto = (title: string) =>
    `mailto:${EMAIL}?subject=${encodeURIComponent(`Accompagnement : ${title}`)}`;
</script>

<svelte:head>
  <title>{TITLE}</title>
  <meta name="description" content={DESCRIPTION} />

  <meta property="og:type" content="website" />
  <meta property="og:locale" content={SITE_LOCALE} />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:title" content={TITLE} />
  <meta property="og:description" content={DESCRIPTION} />
  <meta property="og:image" content={OG_IMAGE} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Rémy Bourgeois, Designing Intentions" />
  <meta property="og:url" content="{SITE_URL}/accompagnement" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={TITLE} />
  <meta name="twitter:description" content={DESCRIPTION} />
  <meta name="twitter:image" content={OG_IMAGE} />
  <meta name="twitter:image:alt" content="Rémy Bourgeois, Designing Intentions" />
  <meta name="twitter:url" content="{SITE_URL}/accompagnement" />

  {@html `<script type="application/ld+json">${jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      breadcrumb(CRUMBS),
      {
        '@type': 'WebPage',
        '@id': SITE_URL + '/accompagnement#webpage',
        url: SITE_URL + '/accompagnement',
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: 'fr-FR',
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': PERSON_ID },
        dateModified: CONTENT_UPDATED
      },
      ...FORMATS.map((f) => ({
        '@type': 'Service',
        '@id': `${SITE_URL}/accompagnement#${f.id}`,
        name: f.title,
        description: f.lede,
        provider: { '@id': PERSON_ID },
        areaServed: 'FR',
        serviceType: f.title
      }))
    ]
  })}<\/script>`}
</svelte:head>

<PageShell>
  <PageHeader title="Accompagnement" crumbs={CRUMBS}>
    {#snippet lede()}
      Trois façons de travailler ensemble : le produit lui-même, le système qui le fabrique, et la
      façon dont l'équipe s'en sert.
    {/snippet}
  </PageHeader>

  <RevealOnScroll>
    <div class="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20 items-start">
      {#each FORMATS as format, i (format.id)}
        <!-- `scroll-mt` : les ancres #conception, #audit et #mise-en-place sont
             liées depuis l'accueil, et la barre fixe recouvrirait le titre. -->
        <section
          id={format.id}
          aria-labelledby="{format.id}-title"
          class="h-full flex flex-col rounded-3xl border p-8 scroll-mt-28 {i === 0
            ? 'border-primary/30 bg-primary/[0.07]'
            : 'border-white/10 bg-white/5'}"
        >
          <p class="eyebrow text-accent mb-2">{format.label}</p>
          <h2 id="{format.id}-title" class="text-xl font-semibold mb-3 leading-snug">
            {format.title}
          </h2>
          <p class="text-white/70 text-sm leading-relaxed mb-6">{format.lede}</p>

          {#if format.id === 'audit'}
            <p class="eyebrow text-white/60 mb-2">Méthode</p>
            <p class="text-white/70 text-sm leading-relaxed mb-4">
              Une grille de maturité sur neuf axes. Chaque note est appuyée par une preuve :
              inventaire Figma, lecture du code, entretiens avec les équipes.
            </p>
            <ul class="flex flex-wrap gap-2 mb-6 list-none p-0 m-0">
              {#each AXES as axe (axe)}
                <Tag as="li">{axe}</Tag>
              {/each}
            </ul>
          {/if}

          <p class="eyebrow text-white/60 mb-3">{format.listTitle}</p>
          <ul class="flex flex-col gap-2.5 mb-6 list-none p-0 m-0">
            {#each format.items as item (item)}
              <li class="flex gap-3 text-white/70 text-sm leading-relaxed">
                <span
                  class="mt-2 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0"
                  aria-hidden="true"
                ></span>
                {item}
              </li>
            {/each}
          </ul>

          {#if format.id === 'mise-en-place'}
            <p class="eyebrow text-white/60 mb-2">Ce que vous gardez</p>
            <p class="text-white/70 text-sm leading-relaxed mb-6">
              Le jour où je pars, rien ne s'arrête. C'est le critère de réussite, et il est
              vérifiable.
            </p>
          {/if}

          <p class="text-white/60 text-xs tracking-wide mb-6">{format.meta}</p>

          <div class="mt-auto">
            <Button href={mailto(format.title)} variant="secondary" size="sm" iconLeft="Mail">
              Parler de ce format
            </Button>
          </div>
        </section>
      {/each}
    </div>
  </RevealOnScroll>

  <RevealOnScroll>
    <div class="w-full mb-20">
      <SectionTitle class="mb-12">Ce que je défends</SectionTitle>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each CONVICTIONS as conviction (conviction)}
          <p
            class="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70 text-sm leading-relaxed"
          >
            {conviction}
          </p>
        {/each}
      </div>
    </div>
  </RevealOnScroll>

  <RevealOnScroll>
    <div class="w-full mb-20">
      <SectionTitle class="mb-4">Trois niveaux de maturité, trois terrains</SectionTitle>
      <p class="text-white/60 text-sm leading-relaxed mb-10 max-w-3xl">
        Un design system n'a pas les mêmes besoins selon qu'il existe depuis dix ans, qu'il faut le
        refondre ou qu'il reste à inventer. Les trois cas ont été traités.
      </p>
      <ol class="grid grid-cols-1 md:grid-cols-3 gap-6 list-none p-0 m-0">
        {#each TERRAINS as terrain, i (terrain.slug)}
          <li>
            <a
              href="/projects/{terrain.slug}"
              class="group flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-6
                     hover:bg-white/[0.08] hover:border-white/20 transition-colors
                     focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
            >
              <span class="font-mono text-xs text-accent tracking-[0.15em]"
                >{String(i + 1).padStart(2, '0')}</span
              >
              <span class="text-lg font-semibold text-white leading-snug">{terrain.level}</span>
              <span class="text-white/70 text-sm leading-relaxed">{terrain.what}</span>
              <span
                class="mt-auto inline-flex items-center gap-2 text-xs text-accent group-hover:text-white transition-colors pt-2"
              >
                Étude de cas {terrain.client}
                <Icon name="ArrowRight" size={12} />
              </span>
            </a>
          </li>
        {/each}
      </ol>
    </div>
  </RevealOnScroll>

  <RevealOnScroll>
    <PageCta
      title="Démarrons un projet"
      secondaryHref="/projects"
      secondaryLabel="Voir les études de cas"
      secondaryIcon="ArrowRight"
    >
      {#snippet lede()}
        Dites-moi où vous en êtes, et je vous dirai lequel des trois formats a du sens.
      {/snippet}
    </PageCta>
  </RevealOnScroll>
</PageShell>
