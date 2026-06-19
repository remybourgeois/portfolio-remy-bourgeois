<!-- src/routes/home/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import RevealOnScroll from '$lib/components/RevealOnScroll.svelte';
  import AnimatedCounter from '$lib/components/AnimatedCounter.svelte';
  import Icon from '$lib/components/Icons.svelte';
  import { PROJECTS } from '$lib/data/projects';
  import { TESTIMONIALS } from '$lib/data/testimonials';
  import { EXPERTISES } from '$lib/data/expertises';
  import { CLIENT_LOGOS } from '$lib/data/clients';
  import { sfx } from '$lib/actions/sfx';
  import { SITE_URL } from '$lib/data/site';
  import { md } from '$lib/utils/text';

  const homeProjectIds = [8, 1, 3, 4];
  const homeProjects = homeProjectIds
    .map(id => PROJECTS.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p != null);
  const marqueeItems = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  let expandedTestimonial = $state<number | null>(null);
  let showTopBtn = $state(false);
  let topSentinel: HTMLDivElement;

  // Photo micro-interaction: glow + scale
  let photoHovered = $state(false);

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
  <title>Rémy Bourgeois — Senior Product Designer & Expert IA</title>
  <meta name="description" content="Rémy Bourgeois, Senior Product Designer basé à Lyon. Expert en Design System, IA Conversationnelle et interfaces complexes (SaaS B2B). Disponible en freelance." />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Rémy Bourgeois — Portfolio" />
  <meta property="og:title" content="Rémy Bourgeois — Senior Product Designer & Expert IA" />
  <meta property="og:description" content="Senior Product Designer basé à Lyon. Expert Design System, IA Conversationnelle, interfaces complexes SaaS B2B. 14+ ans d'expérience." />
  <meta property="og:image" content="{SITE_URL}/assets/og-cover.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Rémy Bourgeois — Designing Intentions" />
  <meta property="og:url" content="{SITE_URL}/home" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="{SITE_URL}/assets/og-cover.jpg" />
  <meta name="twitter:url" content="{SITE_URL}/home" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Rémy Bourgeois",
    "jobTitle": "Senior Product Designer",
    "description": "Senior Product Designer basé à Lyon, expert en Design System, IA Conversationnelle et interfaces complexes SaaS B2B. 14+ ans d'expérience.",
    "url": SITE_URL + "/home",
    "image": SITE_URL + "/assets/remy-bourgeois.webp",
    "email": "remy.bourgeois@gmail.com",
    "address": { "@type": "PostalAddress", "addressLocality": "Lyon", "addressCountry": "FR" },
    "sameAs": ["https://www.linkedin.com/in/remy-bourgeois/"],
    "knowsAbout": ["Product Design", "Design System", "Intelligence Artificielle", "UX/UI", "SaaS B2B"]
  })}</script>`}
</svelte:head>

<div class="relative min-h-screen bg-[#020205] text-white">

  <!-- Sentinelle pour le bouton back-to-top (≈400px du haut) -->
  <div bind:this={topSentinel} class="absolute top-[400px] left-0 w-px h-px pointer-events-none" aria-hidden="true"></div>

  <!-- Barre top : Recommencer + Lien établi -->
  <div class="fixed top-0 w-full z-50 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 pointer-events-none">
    <a
      href="/"
      use:sfx
      class="pointer-events-auto flex items-center gap-1.5 sm:gap-2 text-white/60 hover:text-white text-[11px] sm:text-xs uppercase tracking-wider transition-colors border border-white/10 hover:border-white/30 px-3 sm:px-4 py-3 rounded-full bg-[#020205]/80 backdrop-blur-md focus-visible:ring-2 focus-visible:ring-[#706bfe]"
    >
      <Icon name="RefreshCw" size={11} />
      <span class="whitespace-nowrap">Recommencer l'expérience</span>
    </a>
    <div class="pointer-events-auto flex items-center gap-1.5 sm:gap-2 bg-[#020205]/80 backdrop-blur-md border border-white/10 px-3 sm:px-4 py-2 rounded-full">
      <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shadow-[0_0_8px_#706bfe] bg-[#706bfe] animate-pulse" aria-hidden="true"></div>
      <span class="whitespace-nowrap text-white/60 text-[11px] sm:text-xs font-mono uppercase tracking-wider">Lien établi</span>
    </div>
  </div>

  <main id="main-content" class="min-h-screen flex flex-col items-center pt-32 pb-20 px-6 md:px-8 max-w-6xl mx-auto w-full relative z-40">

    <!-- Hero -->
    <RevealOnScroll>
      <div class="w-full flex flex-col md:flex-row gap-8 items-center justify-center mb-12">
        <div
          class="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden flex-shrink-0 transition-shadow duration-300 ease-out"
          style="box-shadow: {photoHovered
            ? '0 0 24px 6px rgba(112,107,254,0.35), 0 0 60px 16px rgba(112,107,254,0.12), 0 20px 40px rgba(0,0,0,0.5)'
            : '0 20px 40px rgba(0,0,0,0.4)'};"
          onmouseenter={() => photoHovered = true}
          onmouseleave={() => photoHovered = false}
          role="img"
          aria-label="Portrait de Rémy Bourgeois"
        >
          <img
            src="/assets/remy-bourgeois.webp"
            alt=""
            width="500"
            height="500"
            class="w-full h-full object-cover transition-transform duration-300 ease-out"
            style="transform: scale({photoHovered ? 1.03 : 1});"
            loading="eager"
          />
        </div>
        <div class="text-center md:text-left">
          <h1 class="mb-6 leading-tight">
            <span class="block text-xs font-semibold text-[#706bfe] uppercase tracking-[0.12em] mb-1">Rémy Bourgeois</span>
            <span class="block text-4xl md:text-5xl font-bold text-white tracking-tight">Senior Product Designer</span>
          </h1>
          <ul class="flex flex-wrap justify-center md:justify-start gap-3 list-none p-0 m-0">
            <li class="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-medium border border-amber-500/20 flex items-center gap-2">
              <Icon name="BrainCircuit" size={12} /> IA Expert
            </li>
            <li class="px-3 py-1.5 rounded-full bg-[#a78bfa]/10 text-[#a78bfa] text-xs font-medium border border-[#a78bfa]/20 flex items-center gap-2">
              <Icon name="Briefcase" size={12} /> Freelance
            </li>
            <li class="px-3 py-1.5 rounded-full bg-[#38bdf8]/10 text-[#38bdf8] text-xs font-medium border border-[#38bdf8]/20 flex items-center gap-2">
              <Icon name="Award" size={12} /> +14 ans d'expérience
            </li>
          </ul>
        </div>
      </div>
    </RevealOnScroll>

    <!-- Bio -->
    <RevealOnScroll>
      <div class="body-text w-full mb-12 flex flex-col gap-6 max-w-3xl mx-auto">
        <p class="text-white/70 font-light leading-relaxed text-base md:text-lg text-left">
          <strong>Je conçois des expériences où l'humain et l'IA travaillent ensemble.</strong>
        </p>
        <p class="text-white/70 font-light leading-relaxed text-base md:text-lg text-left">
          14+ ans d'expérience, dont <strong>7 ans en robotique humanoïde</strong>.
          J'imagine des <strong>AI assistants</strong>, des Design Systems et des interfaces complexes
          qui rendent les produits plus clairs, plus intelligents et plus humains.
        </p>
        <p class="text-white/70 font-light leading-relaxed text-base md:text-lg text-left">
          Je supprime le hand-off en <strong>itérant directement dans le code</strong>, pour accélérer la vélocité des équipes tech.
        </p>
      </div>
    </RevealOnScroll>

    <!-- Client marquee -->
    <div class="w-full mb-20" aria-label="Clients et partenaires">
      <div class="w-full overflow-hidden py-6 relative">
        <div class="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#020205] to-transparent z-10 pointer-events-none"></div>
        <div class="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#020205] to-transparent z-10 pointer-events-none"></div>
        <div class="flex w-max animate-marquee items-center marquee-track" aria-hidden="true">
          {#each marqueeItems as logo, i (i)}
            <div class="mx-5 sm:mx-8 md:mx-10 flex items-center justify-center">
              <img src={logo} alt="" class="h-6 w-auto object-contain opacity-60" loading="eager" decoding="async" />
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
              <p id="testimonial-{t.id}" class="text-gray-300 text-sm leading-relaxed {expandedTestimonial === t.id ? '' : 'line-clamp-4'}">{t.text}</p>
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
                    aria-label="Voir le projet {project.title}"
                    class="relative z-10 w-full h-full absolute inset-0 focus-visible:ring-4 focus-visible:ring-[#706bfe] focus:outline-none"
                  >
                    {#if project.video}
                      <video src={project.video} autoplay loop muted playsinline aria-hidden="true" width="1920" height="1080" class="w-full h-full object-contain shadow-2xl"></video>
                    {:else if project.image || project.media?.length}
                      <img src={project.image || project.media![0].src} alt="" width="1920" height="1080" class="w-full h-full object-contain shadow-2xl" loading="lazy" />
                    {:else}
                      <span class="text-xs uppercase tracking-[0.3em] text-white/20 font-medium">Bientôt</span>
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
                      <span class="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium border border-white/10">{tag}</span>
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
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-40 bg-[#706bfe] opacity-10 blur-[120px] rounded-full pointer-events-none" aria-hidden="true"></div>
        <div class="relative bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-semibold text-white mb-4">Démarrons un projet</h2>
          <p class="body-text text-white/60 text-base leading-relaxed mb-8">
            Je vous accompagne sur vos projets d'<strong>IA</strong>, de <strong>design system</strong>,
            d'<strong>interfaces complexes</strong> et de <strong>conseil stratégique</strong> —
            que vous soyez une startup, une scale-up, une PME ou une grande entreprise.
          </p>
          <div class="flex flex-wrap justify-center gap-3 mb-8">
            <span class="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white/70 text-xs">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true"></span> Disponible
            </span>
            <span class="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white/70 text-xs">
              <Icon name="Wifi" size={12} /> Full remote préféré
            </span>
            <span class="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white/70 text-xs">
              <Icon name="MapPin" size={12} /> Basé à Lyon
            </span>
          </div>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:remy.bourgeois@gmail.com" use:sfx
              class="flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#706bfe] text-white font-medium hover:bg-[#5a55e0] transition-all focus-visible:ring-2 focus-visible:ring-white">
              <Icon name="Mail" size={16} /> remy.bourgeois@gmail.com
            </a>
            <a href="https://www.linkedin.com/in/remy-bourgeois/" target="_blank" rel="noopener noreferrer" use:sfx
              class="flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all focus-visible:ring-2 focus-visible:ring-[#706bfe]">
              <Icon name="Linkedin" size={16} /> LinkedIn
            </a>
          </div>
        </div>
        <div class="mt-16 text-center">
          <p class="text-white/30 text-xs mb-1">Ce site a été entièrement vibe codé et crafté avec intention 💙</p>
          <p class="text-white/20 text-xs">© 2026 Rémy Bourgeois</p>
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
