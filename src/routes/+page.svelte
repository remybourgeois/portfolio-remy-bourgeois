<!-- src/routes/+page.svelte — page d'accueil et page indexable principale -->
<script lang="ts">
  import { onMount } from 'svelte';
  import RevealOnScroll from '$lib/components/RevealOnScroll.svelte';
  import AnimatedCounter from '$lib/components/AnimatedCounter.svelte';
  import Icon from '$lib/components/Icons.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import { FEATURED_PROJECTS, heroSize } from '$lib/data/projects';
  import { TESTIMONIALS } from '$lib/data/testimonials';
  import { EXPERTISES } from '$lib/data/expertises';
  import { CLIENT_LOGOS } from '$lib/data/clients';
  import { sfx } from '$lib/actions/sfx';
  import { SITE_URL, SITE_NAME, SITE_LOCALE, OG_IMAGE, CONTENT_UPDATED } from '$lib/data/site';
  import { personNode, reviewNodes, websiteNode } from '$lib/data/person';
  import { md, jsonLd } from '$lib/utils/text';
  import { projectSrcset } from '$lib/utils/img';
  import { playInView } from '$lib/actions/playInView';

  const homeProjects = FEATURED_PROJECTS;
  // Liste dupliquée pour que le défilement boucle sans couture.
  const marqueeItems = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  let expandedTestimonial = $state<number | null>(null);
  let showTopBtn = $state(false);
  let topSentinel: HTMLDivElement;

  const impacts = [
    { value: 14, suffix: '+',  label: "Années d'expérience" },
    { value: 80, suffix: '+',  label: 'Projets livrés' },
    { value: 10, suffix: 'M+', label: 'Utilisateurs impactés' },
    { value: 8,  suffix: '+',  label: 'Années en IA' }
  ];

  onMount(() => {
    // Bouton « back-to-top » : visible une fois la sentinelle (~400px) dépassée.
    // IntersectionObserver plutôt qu'un listener scroll déclenché à chaque frame.
    const io = new IntersectionObserver(
      ([entry]) => { showTopBtn = !entry.isIntersecting; },
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
  <meta name="description" content="Je supprime le décalage entre le design et le code. Design systems, produits IA et SaaS B2B, conçus dans le code avec les équipes. 14 ans d'expérience, à Lyon." />

  <meta property="og:type" content="website" />
  <meta property="og:locale" content={SITE_LOCALE} />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:title" content="Lead Design System et Senior Product Designer à Lyon | Rémy Bourgeois" />
  <meta property="og:description" content="Design systems, IA conversationnelle et SaaS B2B complexes. 14 ans d'expérience, dont 7 ans en robotique humanoïde. Freelance à Lyon." />
  <meta property="og:image" content={OG_IMAGE} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Rémy Bourgeois, Designing Intentions" />
  <meta property="og:url" content="{SITE_URL}/" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Lead Design System et Senior Product Designer à Lyon | Rémy Bourgeois" />
  <meta name="twitter:description" content="Design systems, IA conversationnelle et SaaS B2B complexes. 14 ans d'expérience, dont 7 ans en robotique humanoïde. Freelance à Lyon." />
  <meta name="twitter:image" content={OG_IMAGE} />
  <meta name="twitter:image:alt" content="Rémy Bourgeois, Designing Intentions" />
  <meta name="twitter:url" content="{SITE_URL}/" />

  {@html `<script type="application/ld+json">${jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      websiteNode,
      {
        "@type": "ProfilePage",
        "@id": SITE_URL + "/#profilepage",
        "url": SITE_URL + "/",
        "name": "Lead Design System et Senior Product Designer à Lyon | Rémy Bourgeois",
        "description": "Je supprime le décalage entre le design et le code. Design systems, produits IA et SaaS B2B, conçus dans le code avec les équipes. 14 ans d'expérience, à Lyon.",
        "isPartOf": { "@id": websiteNode["@id"] },
        "about": { "@id": personNode["@id"] },
        "mainEntity": { "@id": personNode["@id"] },
        "inLanguage": "fr-FR",
        "dateModified": CONTENT_UPDATED
      },
      personNode,
      ...reviewNodes
    ]
  })}</script>`}
</svelte:head>

<div class="relative min-h-screen bg-[#020205] text-white">

  <!-- Sentinelle pour le bouton back-to-top (≈400px du haut) -->
  <div bind:this={topSentinel} class="absolute top-[400px] left-0 w-px h-px pointer-events-none" aria-hidden="true"></div>

  <main id="main-content" class="min-h-screen flex flex-col items-center pt-32 pb-20 px-6 md:px-8 max-w-6xl mx-auto w-full relative z-40">

    <!--
      Hero en deux colonnes alignées en HAUT, pas au centre : c'est la première
      ligne du H1 qui ancre la composition. L'ancienne version centrait le
      groupe portrait + titre comme une unité pendant que l'accroche vivait
      dans son propre conteneur centré : les deux blocs ne partageaient aucun
      bord, et le décalage atteignait 130 px à 1280.
    -->
    <RevealOnScroll>
      <div class="w-full grid grid-cols-1 md:grid-cols-[minmax(0,380px)_minmax(0,1fr)] gap-10 lg:gap-14 items-start mb-20">

        <div class="relative w-full max-w-[380px] mx-auto md:mx-0">
          <!-- Le halo évite que le fond clair du studio ne découpe un
               rectangle dans la page. -->
          <span
            class="absolute -inset-6 rounded-[3rem] blur-[30px] pointer-events-none
                   bg-[radial-gradient(60%_50%_at_50%_35%,rgba(112,107,254,0.3),transparent_70%)]"
            aria-hidden="true"
          ></span>
          <div class="hero-photo relative aspect-[4/3] md:aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.6)]">
            <img
              src="/assets/remy-bourgeois.webp"
              alt="Portrait de Rémy Bourgeois"
              width="500"
              height="500"
              class="w-full h-full object-cover object-[50%_20%]"
              loading="eager"
            />
            <span
              class="hero-scrim absolute inset-0 bg-gradient-to-b from-transparent via-[#020205]/55 to-[#020205]/95 pointer-events-none"
              aria-hidden="true"
            ></span>
            <span
              class="hero-tint absolute inset-0 bg-[linear-gradient(200deg,rgba(112,107,254,0.16),transparent_55%)] pointer-events-none"
              aria-hidden="true"
            ></span>
            <span class="absolute left-5 right-5 bottom-4 flex items-center gap-2.5">
              <span class="w-[7px] h-[7px] rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" aria-hidden="true"></span>
              <span class="text-white/85 text-xs font-medium">Disponible</span>
            </span>
          </div>
        </div>

        <div class="text-center md:text-left">
          <h1 class="leading-tight mb-6">
            <span class="block text-xs font-semibold text-[#a8a5ff] uppercase tracking-[0.16em] mb-2.5">Rémy Bourgeois</span>
            <span class="block text-3xl md:text-[2.9rem] font-bold text-white tracking-tight leading-[1.06]">Lead Design System &amp; Senior Product Designer</span>
          </h1>

          <ul class="flex flex-wrap justify-center md:justify-start gap-2 list-none p-0 m-0 mb-8">
            <Tag as="li" icon="LayoutIcon">Design system</Tag>
            <Tag as="li" icon="BrainCircuit">IA et agents</Tag>
            <Tag as="li" icon="Award">14 ans d'expérience</Tag>
          </ul>

          <!-- `.body-text` porte la règle globale des termes mis en avant :
               le violet #a8a5ff, comme sur le reste du site. -->
          <div class="body-text flex flex-col gap-5 max-w-[42rem] mx-auto md:mx-0 text-left">
            <p class="text-white/70 font-light leading-relaxed text-base md:text-lg">
              <strong>Je supprime le décalage entre le design et le code, et j'aide les équipes à concevoir avec l'IA.</strong>
            </p>
            <p class="text-white/70 font-light leading-relaxed text-base md:text-lg">
              14 ans de design produit, dont <strong>7 ans en robotique humanoïde</strong>.
              Je conçois des design systems et des produits IA <strong>directement dans le code</strong>,
              avec les équipes qui vont les faire vivre. Un développeur senior relit chacune de mes Pull Requests.
            </p>
            <p class="text-white/70 font-light leading-relaxed text-base md:text-lg">
              Ce n'est pas contre Figma. L'outil garde sa place : l'exploration d'un côté, une bibliothèque
              alimentée depuis le code de l'autre. Ce qui change, c'est qu'il n'y a plus qu'une
              <strong>seule source de vérité</strong>.
            </p>
          </div>
        </div>
      </div>
    </RevealOnScroll>

    <!-- Client marquee -->
    <div class="w-full mb-20" role="region" aria-label="Clients et partenaires">
      <div class="w-full overflow-hidden py-6 relative">
        <div class="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#020205] to-transparent z-10 pointer-events-none"></div>
        <div class="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#020205] to-transparent z-10 pointer-events-none"></div>
        <div class="flex w-max animate-marquee items-center marquee-track" aria-hidden="true">
          {#each marqueeItems as logo, i (i)}
            <div class="mx-5 sm:mx-8 md:mx-10 flex items-center justify-center">
              <img
                src={logo}
                alt=""
                class="h-6 w-auto object-contain opacity-70"
                loading={i < CLIENT_LOGOS.length ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Testimonials -->
    <RevealOnScroll>
      <div class="w-full mb-20">
        <h2 class="text-xs uppercase tracking-widest text-white/50 mb-16 font-semibold flex items-center justify-center gap-4">
          <span class="w-8 h-px bg-white/20" aria-hidden="true"></span> Recommandations <span class="w-8 h-px bg-white/20" aria-hidden="true"></span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {#each TESTIMONIALS as t, i}
            <div class="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 h-fit {i===1||i===4 ? 'lg:mt-10' : ''}">
              <div class="flex justify-between items-start gap-3 mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
                    <img src={t.image} alt={t.name} width="80" height="80" class="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div>
                    <span class="text-white font-semibold text-sm block">{t.name}</span>
                    <span class="text-white/70 text-xs uppercase tracking-wider font-medium">{t.role}</span>
                  </div>
                </div>
                <div class="h-6 opacity-40 flex-shrink-0">
                  <img src={t.logo} alt={t.company} class="h-full w-auto object-contain brightness-0 invert" loading="lazy" />
                </div>
              </div>
              <p id="testimonial-{t.id}" lang={t.lang} class="text-gray-300 text-sm leading-relaxed {expandedTestimonial === t.id ? '' : 'line-clamp-4'}">{t.text}</p>
              <button
                onclick={() => expandedTestimonial = expandedTestimonial === t.id ? null : t.id}
                aria-expanded={expandedTestimonial === t.id}
                aria-controls="testimonial-{t.id}"
                class="mt-3 text-[#706bfe] hover:text-[#a78bfa] text-xs flex items-center gap-1 transition-colors self-start min-h-[44px]"
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
        <h2 class="text-xs uppercase tracking-widest text-white/50 mb-16 font-semibold flex items-center justify-center gap-4">
          <span class="w-8 h-px bg-white/20" aria-hidden="true"></span> Expertises <span class="w-8 h-px bg-white/20" aria-hidden="true"></span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {#each EXPERTISES as exp}
            <div class="group relative flex flex-col items-center text-center p-6 md:p-8 rounded-xl bg-white/5 border border-white/10 shadow-expert hover:translate-y-[-4px] transition-all duration-300">
              <div class="mb-4 p-3 bg-white/10 rounded-full w-fit group-hover:rotate-[15deg] transition-transform duration-300 shadow-[0_0_15px_#706bfe33]">
                <Icon name={exp.icon} size={24} className="text-white group-hover:text-[#38bdf8] transition-colors" />
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
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-32 bg-[#706bfe] opacity-10 blur-[100px] rounded-full pointer-events-none" aria-hidden="true"></div>
        <h2 class="text-xs uppercase tracking-widest text-white/50 mb-16 font-semibold flex items-center justify-center gap-4">
          <span class="w-8 h-px bg-white/20" aria-hidden="true"></span> Impact <span class="w-8 h-px bg-white/20" aria-hidden="true"></span>
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {#each impacts as item}
            <div class="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-white/10">
              <span class="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter end={item.value} suffix={item.suffix} />
              </span>
              <span class="text-xs text-[#706bfe] uppercase tracking-wider font-semibold">{item.label}</span>
            </div>
          {/each}
        </div>
      </div>
    </RevealOnScroll>

    <!-- Featured projects (3) — liens vers case studies -->
    <RevealOnScroll>
      <div class="w-full mb-20">
        <h2 class="text-xs uppercase tracking-widest text-white/50 mb-16 font-semibold flex items-center justify-center gap-4">
          <span class="w-8 h-px bg-white/20" aria-hidden="true"></span> Projets <span class="w-8 h-px bg-white/20" aria-hidden="true"></span>
        </h2>
        <div class="flex flex-col gap-8">
          {#each homeProjects as project, i}
            {@const alt = i % 2 !== 0}
            <div class="w-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/[0.07] transition-all duration-500 group">
              <div class="flex flex-col lg:flex-row">
                <div class="flex-1 relative min-h-[240px] md:min-h-[300px] flex items-center justify-center overflow-hidden {alt ? 'lg:order-1' : 'lg:order-2'} p-4 lg:p-6">
                  <div class="mesh-gradient-bg opacity-30" aria-hidden="true"></div>
                  <a
                    href="/projects/{project.slug}"
                    use:sfx
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
                        loop muted playsinline
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
                      <span class="text-xs uppercase tracking-[0.3em] text-white/50 font-medium">Bientôt</span>
                    {/if}
                  </a>
                </div>
                <div class="flex-1 p-8 md:p-12 flex flex-col justify-center {alt ? 'lg:order-2' : 'lg:order-1'}">
                  <div class="h-8 mb-6 opacity-80">
                    {#if project.logo}
                      <img src={project.logo} alt="" class="h-full object-contain brightness-0 invert" loading="lazy" />
                    {:else}
                      <span class="text-base font-semibold text-white/50">{project.client}</span>
                    {/if}
                  </div>
                  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
                    <a href="/projects/{project.slug}" use:sfx class="text-left hover:text-[#706bfe] transition-colors focus-visible:underline focus:outline-none">
                      {project.title}
                    </a>
                  </h3>
                  <div class="flex flex-wrap gap-2 mb-6">
                    {#each project.tags as tag}
                      <Tag>{tag}</Tag>
                    {/each}
                  </div>
                  <p class="project-text text-gray-400 text-base leading-relaxed max-w-lg">{@html md(project.description)}</p>
                </div>
              </div>
            </div>
          {/each}
        </div>
        <div class="mt-12 flex justify-center">
          <a href="/projects" use:sfx
            class="flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 text-white hover:border-white/40 hover:bg-white/5 transition-all focus-visible:ring-2 focus-visible:ring-[#706bfe]">
            Découvrir tous les projets <Icon name="ArrowRight" size={16} />
          </a>
        </div>
      </div>
    </RevealOnScroll>

    <!-- Contact -->
    <RevealOnScroll>
      <div class="w-full py-20 relative">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-40 bg-[#706bfe] opacity-10 blur-[120px] rounded-full pointer-events-none" aria-hidden="true"></div>
        <!--
          La carte occupe toute la largeur de la section, comme Recommandations,
          Expertises, Impact et Projets. Seul le paragraphe reste plafonné :
          une ligne de texte sur 952 px serait pénible à lire.
        -->
        <div class="relative bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-center">
          <h2 class="text-3xl md:text-4xl font-semibold text-white mb-4">Démarrons un projet</h2>
          <p class="body-text text-white/60 text-base leading-relaxed mb-8 max-w-2xl mx-auto">
            Je vous accompagne sur vos projets d'<strong>IA</strong>, de <strong>design system</strong>,
            d'<strong>interfaces complexes</strong> et de <strong>conseil stratégique</strong>,
            que vous soyez une startup, une scale-up, une PME ou une grande entreprise.
            Disponible pour de nouvelles missions à partir de <strong>novembre 2026</strong>.
          </p>
          <p class="text-white/60 text-sm mb-8">
            <a href="/accompagnement" use:sfx class="text-[#a8a5ff] hover:text-white underline underline-offset-4 transition-colors">
              Voir les trois façons de travailler ensemble
            </a>
          </p>
          <div class="flex flex-wrap justify-center gap-2 mb-8">
            <Tag tone="emerald" dot="emerald" pulse>Disponible</Tag>
            <Tag icon="Wifi">Full remote préféré</Tag>
            <Tag icon="MapPin">Basé à Lyon</Tag>
          </div>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:remy.bourgeois@gmail.com" use:sfx
              class="flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#5a55e0] text-white font-medium hover:bg-[#4a45d0] transition-all focus-visible:ring-2 focus-visible:ring-white">
              <Icon name="Mail" size={16} className="flex-shrink-0" /> remy.bourgeois@gmail.com
            </a>
            <a href="https://www.linkedin.com/in/remy-bourgeois/" target="_blank" rel="noopener noreferrer" use:sfx
              class="flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all focus-visible:ring-2 focus-visible:ring-[#706bfe]">
              <Icon name="Linkedin" size={16} className="flex-shrink-0" /> LinkedIn
            </a>
          </div>
        </div>
        <div class="mt-16 text-center">
          <p class="text-white/55 text-xs mb-1">Ce site a été entièrement vibe codé et crafté avec intention 💙</p>
          <p class="text-white/50 text-xs">© 2026 Rémy Bourgeois</p>
        </div>
      </div>
    </RevealOnScroll>

  </main>

  <!-- Scroll-to-top -->
  {#if showTopBtn}
    <button
      onclick={scrollToTop}
      aria-label="Remonter en haut"
      class="fixed bottom-8 right-8 z-[100] p-3 rounded-full bg-[#706bfe]/20 border border-[#706bfe]/40 text-white hover:bg-[#706bfe]/60 transition-all shadow-lg backdrop-blur-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
    >
      <Icon name="ChevronUp" size={20} />
    </button>
  {/if}

</div>
