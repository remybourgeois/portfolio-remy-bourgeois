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

  const homeProjectIds = [2, 3, 6];
  const homeProjects = homeProjectIds
    .map(id => PROJECTS.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p != null);
  const marqueeItems = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  let expandedTestimonial = $state<number | null>(null);
  let scrollY = $state(0);

  const impacts = [
    { value: 13, suffix: '+',  label: "Années d'expérience" },
    { value: 80, suffix: '+',  label: 'Projets livrés' },
    { value: 10, suffix: 'M+', label: 'Utilisateurs impactés' },
    { value: 7,  suffix: '+',  label: 'Années en IA' }
  ];

  onMount(() => {
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
  <meta property="og:image" content="{SITE_URL}/assets/1_Photo%20Remy%20Bourgeois%20Pro.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="min-h-screen bg-[#020205] text-white">

  <!-- Barre top : Recommencer + Lien établi -->
  <div class="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between pointer-events-none">
    <a
      href="/"
      use:sfx
      class="pointer-events-auto flex items-center gap-2 text-white/60 hover:text-white text-xs uppercase tracking-wider transition-colors border border-white/10 hover:border-white/30 px-4 py-2 rounded-full bg-[#020205]/80 backdrop-blur-md focus-visible:ring-2 focus-visible:ring-[#706bfe]"
    >
      <Icon name="RefreshCw" size={12} />
      <span>Recommencer l'expérience</span>
    </a>
    <div class="pointer-events-auto flex items-center gap-2 bg-[#020205]/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full" role="status">
      <div class="w-2 h-2 rounded-full shadow-[0_0_10px_#706bfe] bg-[#706bfe] animate-pulse" aria-hidden="true"></div>
      <span class="text-white/60 text-xs font-mono uppercase tracking-wider">Lien établi</span>
    </div>
  </div>

  <main class="min-h-screen flex flex-col items-center pt-32 pb-20 px-6 md:px-8 max-w-6xl mx-auto w-full relative z-40">

    <!-- Hero -->
    <RevealOnScroll>
      <div class="w-full flex flex-col md:flex-row gap-8 items-center justify-center mb-12">
        <div class="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl flex-shrink-0">
          <img src="/assets/1_Photo Remy Bourgeois Pro.jpg" alt="Portrait de Rémy Bourgeois" class="w-full h-full object-cover" loading="eager" />
        </div>
        <div class="text-center md:text-left">
          <h2 class="text-4xl md:text-5xl font-semibold text-white mb-6">Senior Product Designer</h2>
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
      <div class="w-full mb-12 flex flex-col gap-6 max-w-3xl mx-auto">
        <p class="text-white/70 font-light leading-relaxed text-base md:text-lg text-left">
          <strong class="font-medium text-[#706bfe]">Je conçois des expériences où l'humain et l'IA travaillent ensemble.</strong>
        </p>
        <p class="text-white/70 font-light leading-relaxed text-base md:text-lg text-left">
          Avec <strong class="font-medium text-[#706bfe]">14+ ans d'expérience</strong>, dont <strong class="font-medium text-[#706bfe]">7 ans en robotique humanoïde</strong>,
          j'imagine des <strong class="font-medium text-[#706bfe]">AI assistants</strong>, des <strong class="font-medium text-[#706bfe]">Design Systems</strong> et des
          <strong class="font-medium text-[#706bfe]">interfaces complexes</strong> qui rendent les produits plus clairs, plus intelligents et plus humains.
        </p>
      </div>
    </RevealOnScroll>

    <!-- Client marquee -->
    <div class="w-full mb-20" aria-label="Clients et partenaires">
      <div class="w-full overflow-hidden py-6 relative">
        <div class="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#020205] to-transparent z-10 pointer-events-none"></div>
        <div class="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#020205] to-transparent z-10 pointer-events-none"></div>
        <div class="flex w-max animate-marquee items-center" aria-hidden="true">
          {#each marqueeItems as logo, i (i)}
            <div class="mx-2 md:mx-8 flex items-center justify-center">
              <img src={logo} alt="" class="h-6 w-auto object-contain brightness-0 invert opacity-60 hover:opacity-100 transition-opacity" loading="lazy" />
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Testimonials -->
    <RevealOnScroll>
      <div class="w-full mb-20">
        <h3 class="text-xs uppercase tracking-widest text-white/50 mb-16 font-semibold flex items-center justify-center gap-4">
          <span class="w-8 h-px bg-white/20" aria-hidden="true"></span> Recommandations <span class="w-8 h-px bg-white/20" aria-hidden="true"></span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {#each TESTIMONIALS as t, i}
            <div class="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 h-fit {i===1||i===4 ? 'lg:mt-10' : ''}">
              <div class="flex justify-between items-start gap-3 mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
                    <img src={t.image} alt={t.name} class="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div>
                    <span class="text-white font-semibold text-sm block">{t.name}</span>
                    <span class="text-white/70 text-[11px] uppercase tracking-wider font-medium">{t.role}</span>
                  </div>
                </div>
                <div class="h-6 opacity-40 flex-shrink-0">
                  <img src={t.logo} alt={t.company} class="h-full w-auto object-contain brightness-0 invert" loading="lazy" />
                </div>
              </div>
              <p class="text-gray-300 text-sm leading-relaxed {expandedTestimonial === t.id ? '' : 'line-clamp-4'}">{t.text}</p>
              <button
                onclick={() => expandedTestimonial = expandedTestimonial === t.id ? null : t.id}
                class="mt-3 text-[#706bfe] hover:text-[#a78bfa] text-xs flex items-center gap-1 transition-colors self-start min-h-[44px] md:min-h-0"
              >
                {#if expandedTestimonial === t.id}
                  Réduire ↑
                {:else}
                  Lire le témoignage +
                {/if}
              </button>
            </div>
          {/each}
        </div>
      </div>
    </RevealOnScroll>

    <!-- Expertises -->
    <RevealOnScroll>
      <div class="w-full mb-20">
        <h3 class="text-xs uppercase tracking-widest text-white/50 mb-16 font-semibold flex items-center justify-center gap-4">
          <span class="w-8 h-px bg-white/20" aria-hidden="true"></span> Expertises <span class="w-8 h-px bg-white/20" aria-hidden="true"></span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {#each EXPERTISES as exp}
            <div class="group relative flex flex-col items-center text-center p-6 md:p-8 rounded-xl bg-white/5 border border-white/10 shadow-expert hover:translate-y-[-4px] transition-all duration-300">
              <div class="mb-4 p-3 bg-white/10 rounded-full w-fit group-hover:rotate-[15deg] transition-transform duration-300" style="box-shadow:0 0 15px #706bfe33">
                <Icon name={exp.icon} size={24} className="text-white group-hover:text-[#38bdf8] transition-colors" />
              </div>
              <h4 class="text-lg font-semibold mb-2">{exp.title}</h4>
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
        <h3 class="text-xs uppercase tracking-widest text-white/50 mb-16 font-semibold flex items-center justify-center gap-4">
          <span class="w-8 h-px bg-white/20" aria-hidden="true"></span> Impact <span class="w-8 h-px bg-white/20" aria-hidden="true"></span>
        </h3>
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
        <h3 class="text-xs uppercase tracking-widest text-white/50 mb-16 font-semibold flex items-center justify-center gap-4">
          <span class="w-8 h-px bg-white/20" aria-hidden="true"></span> Projets <span class="w-8 h-px bg-white/20" aria-hidden="true"></span>
        </h3>
        <div class="flex flex-col gap-8">
          {#each homeProjects as project, i}
            {@const alt = i % 2 !== 0}
            <div class="w-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/[0.07] transition-all duration-500 group">
              <div class="flex flex-col lg:flex-row">
                <div class="flex-1 relative min-h-[240px] md:min-h-[300px] flex items-center justify-center overflow-hidden {alt ? 'lg:order-1' : 'lg:order-2'} p-4 lg:p-6">
                  <div class="mesh-gradient-bg opacity-30" aria-hidden="true"></div>
                  <a
                    href="/projects/{project.id}"
                    use:sfx
                    aria-label="Voir le projet {project.title}"
                    class="relative z-10 w-full h-full absolute inset-0 focus-visible:ring-4 focus-visible:ring-[#706bfe] focus:outline-none"
                  >
                    <img src={project.image} alt="" class="w-full h-full object-contain shadow-2xl" loading="lazy" />
                  </a>
                </div>
                <div class="flex-1 p-8 md:p-12 flex flex-col justify-center {alt ? 'lg:order-2' : 'lg:order-1'}">
                  <div class="h-8 mb-6 opacity-80">
                    <img src={project.logo} alt="" class="h-full object-contain brightness-0 invert" loading="lazy" />
                  </div>
                  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
                    <a href="/projects/{project.id}" use:sfx class="text-left hover:text-[#706bfe] transition-colors focus-visible:underline focus:outline-none">
                      {project.title}
                    </a>
                  </h3>
                  <div class="flex flex-wrap gap-2 mb-6">
                    {#each project.tags as tag}
                      <span class="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium border border-white/10">{tag}</span>
                    {/each}
                  </div>
                  <p class="text-gray-400 text-base leading-relaxed max-w-lg">{project.description}</p>
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
          <p class="text-white/60 text-base leading-relaxed mb-8">
            Je vous accompagne dans vos projets de <span class="text-[#706bfe]">IA</span>, de <span class="text-[#a78bfa]">design system</span>,
            d'<span class="text-[#a78bfa]">interfaces complexes</span> et de <span class="text-[#a78bfa]">conseil stratégique</span> —
            que vous soyez une <strong class="font-semibold text-white/80">startup</strong>, une <strong class="font-semibold text-white/80">scale-up</strong>,
            une <strong class="font-semibold text-white/80">PME</strong> ou une <strong class="font-semibold text-white/80">grande entreprise</strong>.
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
            <a href="https://www.linkedin.com/in/remybourgeois" target="_blank" rel="noopener noreferrer" use:sfx
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
  {#if scrollY > 400}
    <button
      onclick={scrollToTop}
      aria-label="Remonter en haut"
      class="fixed bottom-8 right-8 z-[100] p-3 rounded-full bg-[#706bfe]/20 border border-[#706bfe]/40 text-white hover:bg-[#706bfe]/60 transition-all shadow-lg backdrop-blur-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
    >
      <Icon name="ChevronUp" size={20} />
    </button>
  {/if}

</div>
