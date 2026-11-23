<!-- src/routes/+page.svelte — page d'accueil et page indexable principale -->
<script lang="ts">
  import { onMount } from 'svelte';
  import RevealOnScroll from '#lib/components/RevealOnScroll.svelte';
  import AnimatedCounter from '#lib/components/AnimatedCounter.svelte';
  import Icon from '#lib/components/Icons.svelte';
  import Tag from '#lib/components/Tag.svelte';
  import Button from '#lib/components/Button.svelte';
  import SectionTitle from '#lib/components/SectionTitle.svelte';
  import PageCta from '#lib/components/PageCta.svelte';
  import { FEATURED_PROJECTS, heroSize, fanSheets } from '#lib/data/projects.ts';
  import { TESTIMONIALS } from '#lib/data/testimonials.ts';
  import { EXPERTISES } from '#lib/data/expertises.ts';
  import { CLIENTS } from '#lib/data/clients.ts';
  import {
    SITE_URL,
    SITE_NAME,
    SITE_LOCALE,
    OG_IMAGE,
    CONTENT_UPDATED,
    EMAIL
  } from '#lib/data/site.ts';
  import {
    AUDIT_PATH,
    AUDIT_TITLE,
    AUDIT_HOOK,
    AUDIT_PROBLEM,
    AUDIT_PROMISE
  } from '#lib/data/audit.ts';
  import { personNode, reviewNodes, websiteNode } from '#lib/data/person.ts';
  import { md, jsonLd } from '#lib/utils/text.ts';
  import { projectSrcset } from '#lib/utils/img.ts';
  import { playInView } from '#lib/actions/playInView.ts';
  import { fanCard } from '#lib/actions/fanCard.ts';
  import { tapFeedback } from '#lib/actions/tapFeedback.ts';
  import { seen } from '#lib/actions/seen.ts';
  import { appearText } from '#lib/actions/appearText.ts';

  // Le titre du hero, découpé en mots dans le gabarit pour son animation.
  const HERO_TITLE = 'Senior Product Design Engineer';
  // L'espace entre deux mots, écrite ici : dans le gabarit, Svelte la
  // supprimerait en bord de bloc et les mots se toucheraient.
  const SPACE = ' ';
  const homeProjects = FEATURED_PROJECTS;
  // Liste dupliquée pour que le défilement boucle sans couture.
  const marqueeItems = [...CLIENTS, ...CLIENTS];

  let expandedTestimonial = $state<number | null>(null);
  // Hauteur mesurée du témoignage ouvert : `max-height` ne s'anime pas vers
  // `auto`, il lui faut une valeur en pixels.
  let expandedHeight = $state(0);
  let showTopBtn = $state(false);
  // Part de la page déjà parcourue, de 0 à 1 : dessine l'anneau du bouton.
  let scrollProgress = $state(0);
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
      // L'état courant est le dernier signal du lot : un navigateur occupé en
      // livre plusieurs d'un coup, et lire le premier laissait le bouton caché.
      (entries) => {
        showTopBtn = !entries[entries.length - 1].isIntersecting;
      },
      { rootMargin: '0px' }
    );
    io.observe(topSentinel);

    // Une mesure par image au plus : le scroll ne fait que demander un rafraîchissement.
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  });

  function testimonialHeight(id: number) {
    return document.getElementById(`testimonial-${id}`)?.scrollHeight ?? 0;
  }

  function toggleTestimonial(id: number) {
    if (expandedTestimonial === id) {
      expandedTestimonial = null;
      return;
    }
    expandedHeight = testimonialHeight(id);
    expandedTestimonial = id;
  }

  function scrollToTop(event: MouseEvent) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // La flèche décolle par le haut du bouton et revient par le bas : le
    // toucher est confirmé avant même que la page ne commence à remonter.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const button = event.currentTarget as HTMLElement;
    button.animate([{ transform: 'scale(0.88)' }, { transform: 'scale(1)' }], {
      duration: 420,
      easing: 'ease-out'
    });
    button.querySelector('.top-arrow')?.animate(
      [
        { transform: 'translateY(0)', offset: 0 },
        { transform: 'translateY(-34px)', offset: 0.45 },
        { transform: 'translateY(34px)', offset: 0.46 },
        { transform: 'translateY(0)', offset: 1 }
      ],
      { duration: 620, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' }
    );
  }
</script>

<!-- Le texte se recompose quand la largeur change : la hauteur ouverte aussi. -->
<svelte:window
  onresize={() => {
    if (expandedTestimonial !== null) expandedHeight = testimonialHeight(expandedTestimonial);
  }}
/>

<svelte:head>
  <title>Rémy Bourgeois | Senior Product Design Engineer à Lyon</title>
  <meta
    name="description"
    content="Rémy Bourgeois, Senior Product Design Engineer à Lyon. Je conçois des design systems et des produits IA directement dans le code, pour des SaaS B2B complexes."
  />

  <meta property="og:type" content="website" />
  <meta property="og:locale" content={SITE_LOCALE} />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:title" content="Rémy Bourgeois | Senior Product Design Engineer à Lyon" />
  <meta
    property="og:description"
    content="Rémy Bourgeois, Senior Product Design Engineer à Lyon. Je conçois des design systems et des produits IA directement dans le code, pour des SaaS B2B complexes."
  />
  <meta property="og:image" content={OG_IMAGE} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Rémy Bourgeois, Designing Intentions" />
  <meta property="og:url" content="{SITE_URL}/" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Rémy Bourgeois | Senior Product Design Engineer à Lyon" />
  <meta
    name="twitter:description"
    content="Rémy Bourgeois, Senior Product Design Engineer à Lyon. Je conçois des design systems et des produits IA directement dans le code, pour des SaaS B2B complexes."
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
        name: 'Rémy Bourgeois | Senior Product Design Engineer à Lyon',
        description:
          'Rémy Bourgeois, Senior Product Design Engineer à Lyon. Je conçois des design systems et des produits IA directement dans le code, pour des SaaS B2B complexes.',
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

  <!-- `appearText` : comme sur les pages intérieures, le texte situé sous
       l'écran se révèle au fil de la lecture, titre après paragraphe. Les
       cartes gardent leur propre entrée, leur texte arrive juste après. -->
  <main
    use:appearText
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
          <!-- Ouverture en cascade, comme sur les pages intérieures : chaque
               bloc du hero porte `load-step` et son rang (app.css,
               « Ouverture de page »). Le titre garde ses mots qui montent un
               par un, calés entre le nom et l'accroche. -->
          <div class="load-step [--load-rank:0] flex items-center gap-4 mb-7 md:hidden">
            <img
              src="/assets/remy-bourgeois-320.webp"
              alt="Portrait de Rémy Bourgeois"
              width="320"
              height="320"
              class="w-[72px] h-[72px] rounded-full object-cover object-[50%_20%] border border-white/15 shadow-lift flex-shrink-0"
              loading="eager"
            />
            <Tag tone="emerald" dot="emerald" pulse>Disponible</Tag>
          </div>

          <h1 class="leading-tight mb-6">
            <span class="load-step [--load-rank:1] block eyebrow text-accent mb-3"
              >Rémy Bourgeois</span
            >
            <!-- Chaque mot monte derrière un cache à l'ouverture de la page
                 (app.css, « Titre d'accueil »). Le texte reste entier dans le
                 HTML, mot après mot, séparés par de vraies espaces. -->
            <span
              class="block text-4xl md:text-[3.25rem] lg:text-[3.75rem] font-bold text-white tracking-tight leading-[1.04] [text-wrap:balance]"
            >
              {#each HERO_TITLE.split(' ') as word, k (k)}
                <span class="hero-word"><span style:--k={k}>{word}</span></span>{SPACE}
              {/each}
            </span>
          </h1>

          <!--
            Trois niveaux, pas quatre : le titre, une seule phrase forte en
            blanc, puis un paragraphe en gris sans aucun mot en gras. L'ancien
            hero mettait douze mots en violet et rien ne gagnait.
          -->
          <p
            class="load-step [--load-rank:6] text-xl md:text-2xl font-medium text-white leading-snug mb-5"
          >
            Je conçois des design systems et des produits IA directement dans le code, pour des SaaS
            B2B complexes.
          </p>
          <p
            class="load-step [--load-rank:7] text-white/65 font-light leading-relaxed text-base md:text-lg max-w-[40rem]"
          >
            14 ans de design produit, dont 7 ans en robotique humanoïde. Je travaille avec les
            équipes qui vont faire vivre le produit, et un développeur senior relit chacune de mes
            Pull Requests.
          </p>

          <div class="load-step [--load-rank:8] flex flex-wrap gap-3 mt-9">
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
        <div class="load-step [--load-rank:2] hidden md:block relative md:mt-1">
          <span
            class="absolute -inset-6 rounded-[3rem] blur-[30px] pointer-events-none bg-primary/20"
            aria-hidden="true"
          ></span>
          <div
            class="hero-portrait relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 shadow-lift"
          >
            <!-- C'est l'élément LCP de l'accueil sur grand écran : priorité
                 haute dès le HTML. Sous md le bloc est masqué et `sizes`
                 tombe à 72 px : le navigateur prend alors la variante 320,
                 déjà demandée par la vignette, donc aucune requête de plus. -->
            <img
              src="/assets/remy-bourgeois.webp"
              srcset="/assets/remy-bourgeois-320.webp 320w, /assets/remy-bourgeois.webp 500w"
              sizes="(min-width: 768px) 400px, 72px"
              alt=""
              width="500"
              height="500"
              class="w-full h-full object-cover object-[50%_20%]"
              loading="eager"
              fetchpriority="high"
              decoding="async"
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
    <section class="load-step [--load-rank:9] w-full mb-20" aria-label="Clients et partenaires">
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
          <!-- `width` et `height` réservent la place de chaque logo avant son
               chargement : la piste a sa largeur finale dès le premier rendu.
               Pas de `loading="lazy"` sur la seconde moitié : elle reprend les
               mêmes fichiers, il n'y a rien à économiser, et un logo arrivé en
               retard y changeait la largeur de la piste en plein défilement. -->
          {#each marqueeItems as client, i (i)}
            <div class="mx-5 sm:mx-8 md:mx-10 flex items-center justify-center">
              <img
                src={client.logo}
                alt=""
                width={client.width}
                height={client.height}
                class="h-6 w-auto object-contain opacity-70 brightness-0 invert"
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
              class="reveal-item flex flex-col bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 h-fit {i ===
                1 || i === 4
                ? 'lg:mt-10'
                : ''}"
              style:--i={Math.min(i, 5)}
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
              <!-- Replié, le texte s'arrête à quatre lignes et la dernière
                   s'estompe ; ouvert, la hauteur s'anime et le voile se lève
                   (app.css, « Témoignage »). -->
              <div
                class="testimonial-clip {expandedTestimonial === t.id ? 'is-open' : ''}"
                style:max-height={expandedTestimonial === t.id ? `${expandedHeight}px` : undefined}
              >
                <p
                  id="testimonial-{t.id}"
                  lang={t.lang}
                  class="text-gray-300 text-sm leading-relaxed"
                >
                  {t.text}
                </p>
              </div>
              <button
                onclick={() => toggleTestimonial(t.id)}
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
          {#each EXPERTISES as exp, i (exp.id)}
            <!-- Au toucher, la carte frissonne et son icône se redessine
                 (action `tapFeedback`, app.css « Carte touchée »). La carte
                 ne mène nulle part : l'effet reste léger pour ne pas promettre
                 une ouverture. -->
            <div
              use:tapFeedback
              style:--i={Math.min(i, 5)}
              class="tap-card reveal-item group relative flex flex-col items-center text-center p-6 md:p-8 rounded-xl bg-white/5 border border-white/10 shadow-glow-primary mouse:hover:translate-y-[-4px] transition-all duration-300"
            >
              <div
                class="tap-icon icon-settle relative mb-4 p-3 bg-white/10 rounded-full w-fit mouse:group-hover:rotate-[15deg] transition-transform duration-300 shadow-glow-primary"
              >
                <Icon name={exp.icon} size={24} className="text-tertiary" />
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
        <div class="section-halo" aria-hidden="true"></div>
        <SectionTitle align="center" class="mb-16">Impact</SectionTitle>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {#each impacts as item, i (item.label)}
            <div
              style:--i={i}
              class="reveal-item flex flex-col items-center text-center p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10"
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
            {@const sheets = fanSheets(project)}
            <!--
              Éventail : les autres écrans du projet sont empilés derrière le
              visuel et s'écartent à l'ouverture de la carte (action `fanCard`,
              app.css « Éventail »). `video: false` : la vidéo garde sa lecture
              dès qu'elle est visible, l'éventail n'y touche pas.
            -->
            <div
              use:fanCard={{ watch: '.fan-stage', video: false }}
              data-fan={sheets.length + 1}
              class="w-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/[0.07] transition-all duration-500 group"
            >
              <div class="flex flex-col lg:flex-row">
                <div
                  class="fan-stage [--fan-w:52%] lg:[--fan-w:min(56%,400px)] flex-1 relative min-h-[240px] md:min-h-[300px] flex items-center justify-center overflow-hidden {alt
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
                    {#if project.video || project.image || project.media?.length}
                      {#each sheets as sheet, n (sheet.src)}
                        <span class="fan-sheet {n === 0 ? 'fan-sheet-l' : 'fan-sheet-r'}">
                          <img
                            src={sheet.src}
                            srcset={projectSrcset(sheet.src)}
                            sizes="(min-width: 1024px) 400px, 60vw"
                            alt=""
                            width={sheet.width}
                            height={sheet.height}
                            class="w-full h-full object-cover object-top"
                            loading="lazy"
                          />
                        </span>
                      {/each}
                      <span class="fan-sheet fan-sheet-front">
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
                            class="w-full h-full object-cover object-top"
                          ></video>
                        {:else}
                          <img
                            src={project.image || project.media![0].src}
                            srcset={projectSrcset(project.image || project.media![0].src)}
                            sizes="(min-width: 1024px) 400px, 60vw"
                            alt=""
                            width={heroSize(project).width}
                            height={heroSize(project).height}
                            class="w-full h-full object-cover object-top"
                            loading="lazy"
                          />
                        {/if}
                      </span>
                    {:else}
                      <span class="eyebrow text-white/50">Bientôt</span>
                    {/if}
                    <!-- Invitation au survol. Le lien entier est déjà masqué
                         aux lecteurs d'écran : le titre porte le lien accessible. -->
                    <span
                      class="absolute left-4 bottom-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-canvas/80 px-3 py-1.5 text-sm font-medium text-white opacity-0 translate-y-2 transition-[opacity,transform] duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                    >
                      Voir l'étude de cas
                      <Icon name="ArrowRight" size={14} />
                    </span>
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
                  <div use:seen class="tag-cascade flex flex-wrap gap-2 mb-6">
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

    <!-- Audit design system : l'offre, entre les preuves et le contact -->
    <RevealOnScroll>
      <section class="w-full pt-20" aria-labelledby="audit-title">
        <SectionTitle align="center" id="audit-title" class="mb-16">{AUDIT_TITLE}</SectionTitle>
        <div
          class="rounded-3xl border border-primary/30 bg-primary/[0.07] p-6 sm:p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-8"
        >
          <div class="flex-1 min-w-0">
            <h3 class="text-2xl md:text-3xl font-semibold text-white leading-snug mb-4">
              {AUDIT_HOOK}
            </h3>
            <p class="text-white/70 text-base leading-relaxed max-w-[40rem]">
              {AUDIT_PROBLEM}
              {AUDIT_PROMISE}
            </p>
          </div>
          <div class="flex-shrink-0">
            <Button href={AUDIT_PATH} variant="secondary" iconRight="ArrowRight">
              Découvrir l'audit
            </Button>
          </div>
        </div>
      </section>
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
              class="text-accent hover:text-white underline underline-offset-4 transition-colors py-3"
            >
              Voir les trois formules d'accompagnement design system
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
      class="fixed bottom-8 right-8 z-[100] h-11 w-11 overflow-hidden rounded-full bg-primary/20 border border-white/10 text-white hover:bg-primary/60 transition-all shadow-lg backdrop-blur-sm flex items-center justify-center"
    >
      <!-- Anneau de progression : `pathLength="1"` ramène le périmètre à 1,
           le décalage du tiret est donc directement la part restante. -->
      <svg
        class="absolute inset-0 h-full w-full -rotate-90 text-accent pointer-events-none"
        viewBox="0 0 44 44"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="22"
          cy="22"
          r="21"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          pathLength="1"
          stroke-dasharray="1"
          style:stroke-dashoffset={1 - scrollProgress}
        />
      </svg>
      <span class="top-arrow flex"><Icon name="ChevronUp" size={20} /></span>
    </button>
  {/if}
</div>
