<!-- src/routes/accompagnement/+page.svelte -->
<script lang="ts">
  import RevealOnScroll from '$lib/components/RevealOnScroll.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import PageCta from '$lib/components/PageCta.svelte';
  import { SITE_URL, SITE_NAME, SITE_LOCALE, OG_IMAGE, PERSON_ID, WEBSITE_ID, CONTENT_UPDATED } from '$lib/data/site';
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
      lede:
        "UX, UI, parcours et écrans. Le métier de base : produire ce que les gens utilisent, pas seulement le système qui le rend possible.",
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
      lede:
        "Deux jours par semaine, pour faire vivre le design system avec les équipes plutôt qu'à côté d'elles.",
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
    'Tokens', 'Composants', 'Documentation', 'Accessibilité',
    'Alignement Figma et code', 'Outillage', 'Contribution', 'Gouvernance', 'Adoption'
  ];

  const CONVICTIONS = [
    "Une seule source de vérité : le code. Figma n'est pas supprimé, il trouve sa place.",
    'Des règles lisibles par une machine, vérifiées à chaque Pull Request, plutôt ' +
      "qu'une documentation que personne ne relit.",
    "Avec l'IA, le design system devient le carburant de la génération. Un système " +
      'mal structuré produit des variantes incohérentes, très vite.',
    'On mesure avant de changer : qualité, délai de mise sur le marché, confort des équipes.'
  ];

  const TITLE = 'Accompagnement design system et conception produit | Rémy Bourgeois';
  const DESCRIPTION =
    "Conception produit, audit de design system et accompagnement à la mise en place. " +
    "Trois façons de travailler avec Rémy Bourgeois, Lead Design System à Lyon.";
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
    "@context": "https://schema.org",
    "@graph": [
      breadcrumb([
        { name: 'Accueil',        path: '/' },
        { name: 'Accompagnement', path: '/accompagnement' }
      ]),
      {
        "@type": "WebPage",
        "@id": SITE_URL + "/accompagnement#webpage",
        "url": SITE_URL + "/accompagnement",
        "name": TITLE,
        "description": DESCRIPTION,
        "inLanguage": "fr-FR",
        "isPartOf": { "@id": WEBSITE_ID },
        "about": { "@id": PERSON_ID },
        "dateModified": CONTENT_UPDATED
      },
      ...FORMATS.map((f) => ({
        "@type": "Service",
        "@id": `${SITE_URL}/accompagnement#${f.id}`,
        "name": f.title,
        "description": f.lede,
        "provider": { "@id": PERSON_ID },
        "areaServed": "FR",
        "serviceType": f.title
      }))
    ]
  })}<\/script>`}
</svelte:head>

<main id="main-content" class="min-h-screen bg-[#020205] text-white">
  <div class="max-w-6xl mx-auto px-6 md:px-8 pt-32 pb-24">

    <PageHeader title="Accompagnement">
      {#snippet lede()}
        Trois façons de travailler ensemble : le produit lui-même, le système qui le fabrique,
        et la façon dont l'équipe s'en sert.
      {/snippet}
    </PageHeader>

    <RevealOnScroll>
      <div class="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20 items-start">
        {#each FORMATS as format, i}
          <section
            id={format.id}
            aria-labelledby="{format.id}-title"
            class="h-full rounded-3xl border p-8 {i === 0
              ? 'border-[#706bfe]/30 bg-[#706bfe]/[0.07]'
              : 'border-white/10 bg-white/5'}"
          >
            <p class="text-[10px] uppercase tracking-[0.2em] text-[#a8a5ff] font-semibold mb-2">{format.label}</p>
            <h2 id="{format.id}-title" class="text-xl font-semibold mb-3 leading-snug">{format.title}</h2>
            <p class="text-white/70 text-sm leading-relaxed mb-6">{format.lede}</p>

            {#if format.id === 'audit'}
              <p class="text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold mb-2">Méthode</p>
              <p class="text-white/70 text-sm leading-relaxed mb-4">
                Une grille de maturité sur neuf axes. Chaque note est appuyée par une preuve :
                inventaire Figma, lecture du code, entretiens avec les équipes.
              </p>
              <ul class="flex flex-wrap gap-2 mb-6 list-none p-0 m-0">
                {#each AXES as axe}
                  <Tag as="li">{axe}</Tag>
                {/each}
              </ul>
            {/if}

            <p class="text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold mb-3">{format.listTitle}</p>
            <ul class="flex flex-col gap-2.5 mb-6 list-none p-0 m-0">
              {#each format.items as item}
                <li class="flex gap-3 text-white/70 text-sm leading-relaxed">
                  <span class="mt-2 w-1.5 h-1.5 rounded-full bg-[#a8a5ff] flex-shrink-0" aria-hidden="true"></span>
                  {item}
                </li>
              {/each}
            </ul>

            {#if format.id === 'mise-en-place'}
              <p class="text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold mb-2">Ce que vous gardez</p>
              <p class="text-white/70 text-sm leading-relaxed mb-6">
                Le jour où je pars, rien ne s'arrête. C'est le critère de réussite, et il est vérifiable.
              </p>
            {/if}

            <p class="text-white/60 text-xs tracking-wide">{format.meta}</p>
          </section>
        {/each}
      </div>
    </RevealOnScroll>

    <RevealOnScroll>
      <div class="w-full mb-20">
        <!-- Même motif que les titres de section d'À propos : un seul filet,
             à gauche. Le motif centré à deux filets reste celui de l'accueil,
             qui est une vitrine et non un document. -->
        <h2 class="text-xs uppercase tracking-widest text-white/50 mb-12 font-semibold flex items-center gap-4">
          <span class="w-8 h-px bg-white/20" aria-hidden="true"></span> Ce que je défends
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {#each CONVICTIONS as conviction}
            <p class="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70 text-sm leading-relaxed">
              {conviction}
            </p>
          {/each}
        </div>
        <p class="text-white/60 text-sm leading-relaxed mt-8 max-w-3xl">
          J'ai vu les trois niveaux de maturité d'un design system : un grand groupe au Crédit Agricole,
          une refonte chez iPify, une création de zéro chez Ofelia.
        </p>
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

  </div>
</main>
