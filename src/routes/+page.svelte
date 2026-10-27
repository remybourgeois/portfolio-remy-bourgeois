<!-- src/routes/+page.svelte — page d'accueil et page indexable principale -->
<script lang="ts">
  import { onMount } from 'svelte';
  import RevealOnScroll from '$lib/components/RevealOnScroll.svelte';
  import AnimatedCounter from '$lib/components/AnimatedCounter.svelte';
  import Icon from '$lib/components/Icons.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Button from '$lib/components/Button.svelte';
  import SectionTitle from '$lib/components/SectionTitle.svelte';
  import PageCta from '$lib/components/PageCta.svelte';
  import { FEATURED_PROJECTS, heroSize } from '$lib/data/projects';
  import { TESTIMONIALS } from '$lib/data/testimonials';
  import { EXPERTISES } from '$lib/data/expertises';
  import { CLIENTS } from '$lib/data/clients';
  import {
    SITE_URL,
    SITE_NAME,
    SITE_LOCALE,
    OG_IMAGE,
    CONTENT_UPDATED,
    EMAIL
  } from '$lib/data/site';
  import { personNode, reviewNodes, websiteNode } from '$lib/data/person';
  import { md, jsonLd } from '$lib/utils/text';
  import { projectSrcset } from '$lib/utils/img';
  import { playInView } from '$lib/actions/playInView';

  const homeProjects = FEATURED_PROJECTS;
  // Liste dupliquée pour que le défilement boucle sans couture.
  const marqueeItems = [...CLIENTS, ...CLIENTS];

  let expandedTestimonial = $state<number | null>(null);
  let showTopBtn = $state(false);
  let topSentinel: HTMLDivElement;

  const impacts = [
    { value: 14, suffix: '+', label: "Années d'expérience" },
    { value: 80, suffix: '+', label: 'Projets livrés' },
    { value: 10, suffix: 'M+', label: 'Utilisateurs impactés' },
    { value: 8, suffix: '+', label: 'Années en IA' }
  ];

  onMount(() => {
    // Bouton « back-to-top » : visible une fois la sentinelle (~400px) dépassée.
    // IntersectionObserver plutôt qu'un listener scroll déclenché à chaque frame.
    const io = new IntersectionObserver(
      ([entry]) => {
        showTopBtn = !entry.isIntersecting;
      },
      { rootMargin: '0px' }
    );
    io.observe(topSentinel);
    return () => io.disconnect();
  });

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<svelte:head>
  <title>Lead Design System et Senior Product Designer à Lyon | Rémy Bourgeois</title>
  <meta
    name="description"
    content="Je supprime le décalage entre le design et le code. Design systems, produits IA et SaaS B2B, conçus dans le code avec les équipes. 14 ans d'expérience, à Lyon."
  />

  <meta property="og:type" content="website" />
  <meta property="og:locale" content={SITE_LOCALE} />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta
    property="og:title"
    content="Lead Design System et Senior Product Designer à Lyon | Rémy Bourgeois"
  />
  <meta
    property="og:description"
    content="Design systems, IA conversationnelle et SaaS B2B complexes. 14 ans d'expérience, dont 7 ans en robotique humanoïde. Freelance à Lyon."
  />
  <meta property="og:image" content={OG_IMAGE} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Rémy Bourgeois, Designing Intentions" />
  <meta property="og:url" content="{SITE_URL}/" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta
    name="twitter:title"
    content="Lead Design System et Senior Product Designer à Lyon | Rémy Bourgeois"
  />
  <meta
    name="twitter:description"
    content="Design systems, IA conversationnelle et SaaS B2B complexes. 14 ans d'expérience, dont 7 ans en robotique humanoïde. Freelance à Lyon."
  />
  <meta name="twitter:image" content={OG_IMAGE} />
  <meta name="twitter:image:alt" content="Rémy Bourgeois, Designing Intentions" />
  <meta name="twitter:url" content="{SITE_URL}/" />

  {@html `<script type="application/ld+json">${jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      websiteNode,
      {
        '@type': 'ProfilePage',
        '@id': SITE_URL + '/#profilepage',
        url: SITE_URL + '/',
        name: 'Lead Design System et Senior Product Designer à Lyon | Rémy Bourgeois',
        description:
          "Je supprime le décalage entre le design et le code. Design systems, produits IA et SaaS B2B, conçus dans le code avec les équipes. 14 ans d'expérience, à Lyon.",
        isPartOf: { '@id': websiteNode['@id'] },
        about: { '@id': personNode['@id'] },
        mainEntity: { '@id': personNode['@id'] },
        inLanguage: 'fr-FR',
        dateModified: CONTENT_UPDATED
      },
      personNode,
      ...reviewNodes
    ]
  })}<\/script>`}
</svelte:head>

<div class="relative min-h-screen bg-canvas text-white">
  <!-- Sentinelle pour le bouton back-to-top (≈400px du haut) -->
  <div
    bind:this={topSentinel}
    class="absolute top-[400px] left-0 w-px h-px pointer-events-none"
    aria-hidden="true"
  ></div>

  <main
    id="main-content"
    class="min-h-screen flex flex-col items-center pt-32 pb-20 px-6 md:px-8 max-w-6xl mx-auto w-full relative z-40"
  >
    <!--
      Hero en deux colonnes dès md : le texte à gauche, le portrait à droite,
      en couleur et grand. L'ancienne version le désaturait et le voilait,
      et le posait AVANT le titre : sur mobile il occupait tout le premier
      écran. Ici la colonne du portrait disparaît sous md, où seule une
      vignette de 72 px reste au-dessus du nom : le titre et les deux boutons
      tiennent dans le premier écran du téléphone, et l'écran large n'a plus
      de vide à droite. La même image sert aux deux : une seule requête.
    -->
    <RevealOnScroll>
      <div
        class="w-full grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,320px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] gap-10 lg:gap-16 items-start mb-20"
      >
        <div class="max-w-[44rem]">
          <div class="flex items-center gap-4 mb-7 md:hidden">
            <img
              src="/assets/remy-bourgeois.webp"
              alt="Portrait de Rémy Bourgeois"
              width="500"
              height="500"
              class="w-[72px] h-[72px] rounded-full object-cover object-[50%_20%] border border-white/15 shadow-lift flex-shrink-0"
              loading="eager"
            />
            <Tag tone="emerald" dot="emerald" pulse>Disponible</Tag>
          </div>

          <h1 class="leading-tight mb-6">
            <span class="block eyebrow text-accent mb-3">Rémy Bourgeois</span>
            <span
              class="block text-4xl md:text-[3.25rem] lg:text-[3.75rem] font-bold text-white tracking-tight leading-[1.04] [text-wrap:balance]"
              >Lead Design System &amp; Senior Product Designer</span
            >
          </h1>

          <!--
            Trois niveaux, pas quatre : le titre, une seule phrase forte en
            blanc, puis un paragraphe en gris sans aucun mot en gras. L'ancien
            hero mettait douze mots en violet et rien ne gagnait.
          -->
          <p class="text-xl md:text-2xl font-medium text-white leading-snug mb-5">
            Je supprime le décalage entre le design et le code.
          </p>
          <p class="text-white/65 font-light leading-relaxed text-base md:text-lg max-w-[40rem]">
            14 ans de design produit, dont 7 ans en robotique humanoïde. Je conçois des design
            systems et des produits IA directement dans le code, avec les équipes qui vont les faire
            vivre. Un développeur senior relit chacune de mes Pull Requests.
          </p>

          <div class="flex flex-wrap gap-3 mt-9">
            <Button href="mailto:{EMAIL}" iconLeft="Mail">M'écrire</Button>
            <Button href="/projects" variant="secondary" iconRight="ArrowRight">
              Voir les projets
            </Button>
          </div>
        </div>

        <!--
          Portrait cadré 4:5, calé sur la ligne du nom. Au repos : couleur
          légèrement adoucie, grain argentique, bords assombris (la vignette
          règle aussi le fond blanc du studio, qui s'arrêtait net sur le noir).
          Au survol ou au focus, la photo se réveille : vraies couleurs, voile
          levé, léger avancement. Tout est en CSS (app.css, « Portrait du
          hero »), rien ne dépend de la position de la souris, et le repos
          reste la version qu'on voit au toucher.
        -->
        <div class="hidden md:block relative md:mt-1">
          <span
            class="absolute -inset-6 rounded-[3rem] blur-[30px] pointer-events-none bg-primary/20"
            aria-hidden="true"
          ></span>
          <div
            class="hero-portrait relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 shadow-lift"
          >
            <img
              src="/assets/remy-bourgeois.webp"
              alt=""
              width="500"
              height="500"
              class="w-full h-full object-cover object-[50%_20%]"
              loading="eager"
            />
            <span class="hero-grain absolute inset-0 pointer-events-none" aria-hidden="true"></span>
            <span class="hero-vignette absolute inset-0 pointer-events-none" aria-hidden="true"
            ></span>
            <span
              class="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-canvas/80 to-transparent pointer-events-none"
              aria-hidden="true"
            ></span>
            <span class="absolute left-5 bottom-5">
              <Tag tone="emerald" dot="emerald" pulse solid>Disponible</Tag>
            </span>
          </div>
        </div>
      </div>
    </RevealOnScroll>

    <!-- Client marquee. Le défilement est décoratif : c'est la liste hors
         écran qu'un lecteur d'écran lit à sa place. -->
    <section class="w-full mb-20" aria-label="Clients et partenaires">
      <ul class="sr-only">
        {#each CLIENTS as client (client.name)}
          <li>{client.name}</li>
        {/each}
      </ul>
      <div class="w-full overflow-hidden py-6 relative">
        <div
          class="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-canvas to-transparent z-10 pointer-events-none"
        ></div>
        <div
          class="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-canvas to-transparent z-10 pointer-events-none"
        ></div>
        <div class="flex w-max animate-marquee items-center marquee-track" aria-hidden="true">
          {#each marqueeItems as client, i (i)}
            <div class="mx-5 sm:mx-8 md:mx-10 flex items-center justify-center">
              <img
                src={client.logo}
                alt=""
                class="h-6 w-auto object-contain opacity-70"
                loading={i < CLIENTS.length ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <RevealOnScroll>
      <div class="w-full mb-20">
        <SectionTitle align="center" class="mb-16">Recommandations</SectionTitle>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {#each TESTIMONIALS as t, i (t.id)}
            <div
              class="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 h-fit {i ===
                1 || i === 4
                ? 'lg:mt-10'
                : ''}"
            >
              <div class="flex justify-between items-start gap-3 mb-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-white/5 flex-shrink-0"
                  >
                    <img
                      src={t.image}
                      alt={t.name}
                      width="80"
                      height="80"
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <span class="text-white font-semibold text-sm block">{t.name}</span>
                    <span class="text-white/70 text-xs uppercase tracking-wider font-medium"
                      >{t.role}</span
                    >
                  </div>
                </div>
                <div class="h-6 opacity-40 flex-shrink-0">
                  <img
                    src={t.logo}
                    alt={t.company}
                    class="h-full w-auto object-contain brightness-0 invert"
                    loading="lazy"
                  />
                </div>
              </div>
              <p
                id="testimonial-{t.id}"
                lang={t.lang}
                class="text-gray-300 text-sm leading-relaxed {expandedTestimonial === t.id
                  ? ''
                  : 'line-clamp-4'}"
              >
                {t.text}
              </p>
              <button
                onclick={() => (expandedTestimonial = expandedTestimonial === t.id ? null : t.id)}
                aria-expanded={expandedTestimonial === t.id}
                aria-controls="testimonial-{t.id}"
                class="mt-3 text-accent hover:text-white text-xs flex items-center gap-1 transition-colors self-start min-h-[44px]"
              >
                {expandedTestimonial === t.id ? 'Réduire' : 'Lire le témoignage'}
              </button>
            </div>
          {/each}
        </div>
      </div>
    </RevealOnScroll>

    <!-- Expertises -->
    <RevealOnScroll>
      <div class="w-full mb-20">
        <SectionTitle align="center" class="mb-16">Expertises</SectionTitle>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {#each EXPERTISES as exp (exp.id)}
            <div
              class="group relative flex flex-col items-center text-center p-6 md:p-8 rounded-xl bg-white/5 border border-white/10 shadow-glow-primary hover:translate-y-[-4px] transition-all duration-300"
            >
              <div
                class="mb-4 p-3 bg-white/10 rounded-full w-fit group-hover:rotate-[15deg] transition-transform duration-300 shadow-glow-primary"
              >
                <Icon
                  name={exp.icon}
                  size={24}
                  className="text-white group-hover:text-tertiary transition-colors"
                />
              </div>
              <h3 class="text-lg font-semibold mb-2">{exp.title}</h3>
              <p class="text-sm text-white/70">{exp.desc}</p>
            </div>
          {/each}
        </div>
      </div>
    </RevealOnScroll>

    <!-- Impact counters -->
    <RevealOnScroll>
      <div class="w-full mb-24 py-10 relative">
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-32 bg-primary opacity-10 blur-[100px] rounded-full pointer-events-none"
          aria-hidden="true"
        ></div>
        <SectionTitle align="center" class="mb-16">Impact</SectionTitle>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {#each impacts as item (item.label)}
            <div
              class="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-white/10"
            >
              <span class="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter end={item.value} suffix={item.suffix} />
              </span>
              <span class="eyebrow text-accent">{item.label}</span>
            </div>
          {/each}
        </div>
      </div>
    </RevealOnScroll>

    <!-- Featured projects — liens vers case studies -->
    <RevealOnScroll>
      <div class="w-full mb-20">
        <SectionTitle align="center" class="mb-16">Projets</SectionTitle>
        <div class="flex flex-col gap-8">
          {#each homeProjects as project, i (project.slug)}
            {@const alt = i % 2 !== 0}
            <div
              class="w-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/[0.07] transition-all duration-500 group"
            >
              <div class="flex flex-col lg:flex-row">
                <div
                  class="flex-1 relative min-h-[240px] md:min-h-[300px] flex items-center justify-center overflow-hidden {alt
                    ? 'lg:order-1'
                    : 'lg:order-2'} p-4 lg:p-6"
                >
                  <div class="mesh-gradient-bg opacity-30" aria-hidden="true"></div>
                  <a
                    href="/projects/{project.slug}"
                    tabindex="-1"
                    aria-hidden="true"
                    class="absolute inset-0 z-10 w-full h-full focus:outline-none"
                  >
                    {#if project.video}
                      <video
                        src={project.video}
                        poster={project.videoPoster}
                        use:playInView
                        preload="none"
                        loop
                        muted
                        playsinline
                        aria-hidden="true"
                        width={heroSize(project).width}
                        height={heroSize(project).height}
                        class="w-full h-full object-contain shadow-2xl"
                      ></video>
                    {:else if project.image || project.media?.length}
                      <img
                        src={project.image || project.media![0].src}
                        srcset={projectSrcset(project.image || project.media![0].src)}
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        alt=""
                        width={heroSize(project).width}
                        height={heroSize(project).height}
                        class="w-full h-full object-contain shadow-2xl"
                        loading="lazy"
                      />
                    {:else}
                      <span class="eyebrow text-white/50">Bientôt</span>
                    {/if}
                  </a>
                </div>
                <div
                  class="flex-1 p-8 md:p-12 flex flex-col justify-center {alt
                    ? 'lg:order-2'
                    : 'lg:order-1'}"
                >
                  <div class="h-8 mb-6 opacity-80">
                    {#if project.logo}
                      <img
                        src={project.logo}
                        alt=""
                        class="h-full object-contain brightness-0 invert"
                        loading="lazy"
                      />
                    {:else}
                      <span class="text-base font-semibold text-white/50">{project.client}</span>
                    {/if}
                  </div>
                  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
                    <a
                      href="/projects/{project.slug}"
                      class="text-left hover:text-accent transition-colors focus-visible:underline focus:outline-none"
                    >
                      {project.title}
                    </a>
                  </h3>
                  <div class="flex flex-wrap gap-2 mb-6">
                    {#each project.tags as tag (tag)}
                      <Tag>{tag}</Tag>
                    {/each}
                  </div>
                  <p class="project-text text-gray-400 text-base leading-relaxed max-w-lg">
                    {@html md(project.description)}
                  </p>
                </div>
              </div>
            </div>
          {/each}
        </div>
        <div class="mt-12 flex justify-center">
          <Button href="/projects" variant="secondary" iconRight="ArrowRight">
            Découvrir tous les projets
          </Button>
        </div>
      </div>
    </RevealOnScroll>

    <!-- Contact -->
    <RevealOnScroll>
      <div class="w-full pt-20">
        <PageCta
          title="Démarrons un projet"
          secondaryHref="https://www.linkedin.com/in/remy-bourgeois/"
          secondaryLabel="LinkedIn"
          secondaryIcon="Linkedin"
          secondaryExternal
        >
          {#snippet lede()}
            Je vous accompagne sur vos projets d'IA, de design system, d'interfaces complexes et de
            conseil stratégique, que vous soyez une startup, une scale-up, une PME ou une grande
            entreprise.
          {/snippet}
          {#snippet extra()}
            <a
              href="/accompagnement"
              class="text-accent hover:text-white underline underline-offset-4 transition-colors"
            >
              Voir les trois façons de travailler ensemble
            </a>
          {/snippet}
        </PageCta>
      </div>
    </RevealOnScroll>
  </main>

  <!-- Scroll-to-top -->
  {#if showTopBtn}
    <button
      onclick={scrollToTop}
      aria-label="Remonter en haut"
      class="fixed bottom-8 right-8 z-[100] p-3 rounded-full bg-primary/20 border border-primary/40 text-white hover:bg-primary/60 transition-all shadow-lg backdrop-blur-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
    >
      <Icon name="ChevronUp" size={20} />
    </button>
  {/if}
</div>
