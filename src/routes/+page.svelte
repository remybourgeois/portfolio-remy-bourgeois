<!-- src/routes/+page.svelte -->
<script lang="ts">
  import IntroScene from '$lib/components/IntroScene.svelte';
  import RevealOnScroll from '$lib/components/RevealOnScroll.svelte';
  import AnimatedCounter from '$lib/components/AnimatedCounter.svelte';
  import Icon from '$lib/components/Icons.svelte';
  import { PROJECTS } from '$lib/data/projects';
  import { TESTIMONIALS } from '$lib/data/testimonials';
  import { EXPERTISES } from '$lib/data/expertises';
  import { CLIENT_LOGOS } from '$lib/data/clients';
  import { sfx } from '$lib/actions/sfx';

  const homeProjectIds = [2, 3, 6];
  const homeProjects = homeProjectIds.map(id => PROJECTS.find(p => p.id === id)).filter((p): p is NonNullable<typeof p> => p != null);
  const marqueeItems = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  let selectedProject: typeof PROJECTS[0] | null = null;

  const impacts = [
    { value: 13, suffix: '+', label: "Années d'expérience" },
    { value: 7,  suffix: ' ans', label: 'En robotique humanoïde' },
    { value: 14, suffix: '+', label: 'Clients & projets' },
    { value: 1,  suffix: ' lien', label: 'Créé ici même' }
  ];

  function openModal(p: typeof PROJECTS[0]) {
    selectedProject = p;
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    selectedProject = null;
    document.body.style.overflow = '';
  }
</script>

<svelte:head>
  <title>Rémy Bourgeois — Senior Product Designer & Expert IA</title>
  <meta name="description" content="Rémy Bourgeois, Senior Product Designer basé à Lyon. Expert en Design System, IA Conversationnelle et interfaces complexes (SaaS B2B). Disponible en freelance.">
</svelte:head>

<IntroScene>
  <!-- Barre de nav post-intro -->
  <nav aria-label="Barre post-intro" class="fixed top-0 w-full z-50 bg-[#020205]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex flex-col gap-4 items-center md:flex-row md:justify-between">
    <a href="/" use:sfx class="order-2 md:order-1 flex items-center gap-2 text-white/70 hover:text-white text-xs uppercase tracking-wider transition-colors border border-white/10 hover:border-white/30 px-4 py-2 rounded-full focus-visible:ring-2 focus-visible:ring-[#706bfe]">
      <Icon name="RefreshCw" size={12} />
      <span>Recommencer l'expérience</span>
    </a>
    <div class="order-1 md:order-2 flex items-center gap-2" role="status">
      <div class="w-2 h-2 rounded-full shadow-[0_0_10px_#706bfe] bg-[#706bfe]" aria-hidden="true"></div>
      <span class="text-white/70 text-xs font-mono uppercase">Lien établi</span>
    </div>
  </nav>

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
              <Icon name="Award" size={12} /> +13 ans d'expérience
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
          Avec <strong class="font-medium text-[#706bfe]">13+ ans d'expérience</strong>, dont <strong class="font-medium text-[#706bfe]">7 ans en robotique humanoïde</strong>,
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
              <p class="text-gray-300 text-sm leading-relaxed line-clamp-4">{t.text}</p>
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
              <span class="text-xs text-white/50 uppercase tracking-wider">{item.label}</span>
            </div>
          {/each}
        </div>
      </div>
    </RevealOnScroll>

    <!-- Featured projects (3) -->
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
                <div class="flex-1 relative min-h-[300px] flex items-center justify-center overflow-hidden {alt ? 'lg:order-1' : 'lg:order-2'} p-4 lg:p-6">
                  <div class="mesh-gradient-bg opacity-30" aria-hidden="true"></div>
                  <button
                    type="button"
                    aria-label="Voir le projet {project.title}"
                    class="relative z-10 w-full h-full absolute inset-0 cursor-zoom-in focus:outline-none focus-visible:ring-4 focus-visible:ring-[#706bfe]"
                    on:click={() => openModal(project)}
                    use:sfx
                  >
                    <img src={project.image} alt="" class="w-full h-full object-contain shadow-2xl" loading="lazy" />
                  </button>
                </div>
                <div class="flex-1 p-8 md:p-12 flex flex-col justify-center {alt ? 'lg:order-2' : 'lg:order-1'}">
                  <div class="h-8 mb-6 opacity-80">
                    <img src={project.logo} alt="" class="h-full object-contain brightness-0 invert" loading="lazy" />
                  </div>
                  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
                    <button on:click={() => openModal(project)} use:sfx class="text-left hover:text-[#706bfe] transition-colors focus-visible:underline focus:outline-none">
                      {project.title}
                    </button>
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
            class="flex items-center gap-3 px-8 py-4 rounded-full border border-[#706bfe]/30 text-[#706bfe] hover:bg-[#706bfe]/10 hover:border-[#706bfe] transition-all focus-visible:ring-2 focus-visible:ring-[#706bfe]">
            Découvrir tous les projets <Icon name="ArrowRight" size={16} />
          </a>
        </div>
      </div>
    </RevealOnScroll>

    <!-- Contact -->
    <RevealOnScroll>
      <div class="w-full py-20 relative">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-40 bg-[#706bfe] opacity-10 blur-[120px] rounded-full pointer-events-none" aria-hidden="true"></div>
        <div class="relative text-center">
          <p class="text-xs uppercase tracking-widest text-white/40 mb-4">Disponible en freelance</p>
          <h2 class="text-4xl md:text-6xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#706bfe] to-[#a78bfa]">
            Travaillons ensemble
          </h2>
          <p class="text-white/60 max-w-xl mx-auto mb-10 text-base md:text-lg">
            Un projet de Design System, d'IA conversationnelle, ou d'interface complexe ?
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:remy.bourgeois@gmail.com" use:sfx
              class="flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#706bfe] text-white font-medium hover:bg-[#5a55e0] transition-all focus-visible:ring-2 focus-visible:ring-white">
              <Icon name="Mail" size={16} /> Me contacter
            </a>
            <a href="https://www.linkedin.com/in/remybourgeois" target="_blank" rel="noopener noreferrer" use:sfx
              class="flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all focus-visible:ring-2 focus-visible:ring-[#706bfe]">
              <Icon name="Linkedin" size={16} /> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </RevealOnScroll>

  </main>
</IntroScene>

<!-- Project Modal (outside IntroScene to be above all z-index) -->
{#if selectedProject}
  <div
    class="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title-home"
    style="animation: fadeIn 0.3s ease-out"
  >
    <div class="absolute inset-0 bg-black/90 backdrop-blur-xl" on:click={closeModal} aria-hidden="true"></div>
    <button
      on:click={closeModal}
      aria-label="Fermer la modale"
      class="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-20 focus-visible:ring-2 focus-visible:ring-white"
    >
      <Icon name="X" size={24} />
    </button>
    <div class="relative w-full max-w-6xl max-h-full flex flex-col items-center justify-center z-10 pointer-events-none">
      <div
        class="relative w-full h-auto max-h-[80vh] pointer-events-auto rounded-[64px] overflow-hidden shadow-2xl bg-white/5 flex items-center justify-center border border-white/10"
        style="backdrop-filter:blur(30px)"
      >
        <div class="mesh-gradient-bg" aria-hidden="true"></div>
        <img
          src={selectedProject.image}
          alt="Aperçu du projet {selectedProject.title}"
          class="relative z-10 w-full h-full object-contain max-h-[80vh] p-8 shadow-image-modal"
        />
      </div>
      <div class="mt-6 flex items-center gap-4 pointer-events-auto bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
        <div class="h-6 w-auto opacity-90">
          <img src={selectedProject.logo} alt={selectedProject.client} class="h-full object-contain brightness-0 invert" />
        </div>
        <div class="w-px h-4 bg-white/20" aria-hidden="true"></div>
        <span id="modal-title-home" class="text-white font-medium text-sm">{selectedProject.title}</span>
      </div>
    </div>
  </div>
{/if}
