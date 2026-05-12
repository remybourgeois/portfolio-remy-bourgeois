# Portfolio v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Moderniser le portfolio (routes séparées intro/home, DM Sans, Svelte 5 runes, case studies, SEO OG, particules améliorées, 100% responsive mobile).

**Architecture:** L'intro Three.js (`/`) et le portfolio (`/home`) sont deux routes SvelteKit indépendantes. IntroScene redirige vers `/home` via `goto()` au lieu d'afficher un slot. Les case studies utilisent `/projects/[id]` avec un load function statiquement pré-rendu.

**Tech Stack:** SvelteKit · Svelte 5 · Tailwind v4 · Three.js · TypeScript · Playwright · Netlify (static adapter)

---

## File Map

| Action | Fichier |
|---|---|
| **Modifier** | `src/routes/+page.svelte` — stripped to `<IntroScene />` seulement |
| **Créer** | `src/routes/home/+page.svelte` — page portfolio (migré depuis +page.svelte) |
| **Modifier** | `src/routes/+layout.svelte` — View Transitions + supprimer introDone |
| **Modifier** | `src/routes/projects/+page.svelte` — supprimer modal, cards → liens |
| **Créer** | `src/routes/projects/[id]/+page.ts` — load function + entries() pour SSG |
| **Créer** | `src/routes/projects/[id]/+page.svelte` — case study page |
| **Modifier** | `src/lib/components/IntroScene.svelte` — goto, no slot, texture locale, N adaptatif, trails |
| **Modifier** | `src/lib/components/Nav.svelte` — Svelte 5 runes, visibility pathname !== '/' |
| **Supprimer** | `src/lib/stores/intro.ts` |
| **Créer** | `src/lib/data/site.ts` — constante SITE_URL |
| **Modifier** | `src/lib/data/projects.ts` — champs optionnels v2 |
| **Modifier** | `src/app.html` — DM Sans preconnect + link |
| **Modifier** | `src/app.css` — font-family |
| **Modifier** | `svelte.config.js` — ajouter /home aux entries prerender |
| **Créer** | `static/assets/spark.png` — texture particules (locale) |
| **Modifier** | `tests/home.test.ts` — URL /home, pas de sessionStorage requis |
| **Modifier** | `tests/projects.test.ts` — navigation vers /projects/[id] |
| **Modifier** | `.gitignore` — ajouter .superpowers/ |

---

## Task 1 : Assets & .gitignore

**Files:**
- Modify: `.gitignore`
- Create: `static/assets/spark.png`

- [ ] **Step 1 : Ajouter `.superpowers/` au .gitignore**

```bash
echo '.superpowers/' >> .gitignore
```

- [ ] **Step 2 : Télécharger la texture spark en local**

```bash
curl -L -o static/assets/spark.png "https://threejs.org/examples/textures/sprites/spark1.png"
```

Si le curl échoue (réseau), créer un PNG blanc 16×16 manuellement avec n'importe quel éditeur et le placer dans `static/assets/spark.png`. La texture n'a pas besoin d'être identique — n'importe quel petit point blanc fonctionne.

- [ ] **Step 3 : Vérifier que le fichier existe**

```bash
ls -lh static/assets/spark.png
```

Expected output : ligne avec le fichier (taille ~1-5 KB).

- [ ] **Step 4 : Commit**

```bash
git add .gitignore static/assets/spark.png
git commit -m "chore: add spark texture locally, ignore .superpowers dir"
```

---

## Task 2 : DM Sans — typographie

**Files:**
- Modify: `src/app.html`
- Modify: `src/app.css`

- [ ] **Step 1 : Mettre à jour `src/app.html`**

Remplacer le contenu complet par :

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,300&display=swap" rel="stylesheet" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

- [ ] **Step 2 : Mettre à jour `src/app.css` — remplacer la ligne `font-family` du body**

Remplacer :
```css
font-family: system-ui, -apple-system, sans-serif;
```
Par :
```css
font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
```

- [ ] **Step 3 : Lancer le dev server et vérifier visuellement la fonte**

```bash
npm run dev
```

Ouvrir `http://localhost:5173` — le texte de l'intro doit utiliser DM Sans (forme des lettres plus ronde et élégante que system-ui). Arrêter le serveur après vérification.

- [ ] **Step 4 : Commit**

```bash
git add src/app.html src/app.css
git commit -m "feat: switch typography to DM Sans"
```

---

## Task 3 : Constante SITE_URL

**Files:**
- Create: `src/lib/data/site.ts`

- [ ] **Step 1 : Créer le fichier**

```ts
// src/lib/data/site.ts
export const SITE_URL = 'https://remybourgeois.netlify.app';
```

Note : si un domaine custom est configuré sur Netlify, mettre à jour cette valeur avant de déployer.

- [ ] **Step 2 : Commit**

```bash
git add src/lib/data/site.ts
git commit -m "feat: add SITE_URL constant for OG meta tags"
```

---

## Task 4 : Extension du modèle de données Project

**Files:**
- Modify: `src/lib/data/projects.ts`

- [ ] **Step 1 : Ajouter les champs optionnels v2 à l'interface**

Remplacer le bloc `export interface Project` par :

```ts
export interface Project {
  id: number;
  client: string;
  logo: string;
  title: string;
  tags: string[];
  description: string;
  color: string;
  image: string;
  // v2 — optionnels, extensibles
  images?: string[];
  role?: string;
  year?: string;
  url?: string;
}
```

Les données existantes des projets restent inchangées — les nouveaux champs sont optionnels.

- [ ] **Step 2 : Vérifier que le typage compile**

```bash
npm run check
```

Expected : aucune erreur TypeScript.

- [ ] **Step 3 : Commit**

```bash
git add src/lib/data/projects.ts
git commit -m "feat: extend Project interface with optional v2 fields"
```

---

## Task 5 : Route `/home` — écrire le test d'abord

**Files:**
- Modify: `tests/home.test.ts`
- Create: `src/routes/home/+page.svelte`

- [ ] **Step 1 : Réécrire `tests/home.test.ts`**

```ts
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/home');
});

test('has correct page title', async ({ page }) => {
  await expect(page).toHaveTitle(/Rémy Bourgeois/);
});

test('shows Senior Product Designer heading', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Senior Product Designer/ })).toBeVisible();
});

test('shows impact counters section', async ({ page }) => {
  await expect(page.getByText(/Années d'expérience/)).toBeVisible();
});

test('shows contact section with email link', async ({ page }) => {
  await expect(page.getByRole('link', { name: /remy.bourgeois@gmail.com/ })).toBeVisible();
});

test('shows featured projects with links to case studies', async ({ page }) => {
  const projectLinks = page.locator('a[href^="/projects/"]');
  await expect(projectLinks.first()).toBeVisible();
});

test('scroll-to-top button appears after scrolling', async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect(page.getByRole('button', { name: /Remonter en haut/ })).toBeVisible();
});
```

- [ ] **Step 2 : Lancer le test pour vérifier qu'il échoue (route inexistante)**

```bash
npx playwright test tests/home.test.ts --reporter=list 2>&1 | head -20
```

Expected : tests en échec car `/home` n'existe pas encore (404).

- [ ] **Step 3 : Créer `src/routes/home/+page.svelte`**

C'est le contenu de l'actuel `src/routes/+page.svelte`, adapté pour la v2 : pas de wrapper IntroScene, scroll sur window, cards projets comme liens, Svelte 5 runes, SEO OG.

```svelte
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
```

- [ ] **Step 4 : Lancer les tests pour vérifier qu'ils passent**

```bash
npx playwright test tests/home.test.ts --reporter=list
```

Expected : tous les tests en PASS. Si des tests échouent à cause de sélecteurs, ajuster les sélecteurs dans le test (pas dans le composant).

- [ ] **Step 5 : Commit**

```bash
git add src/routes/home/+page.svelte tests/home.test.ts
git commit -m "feat: create /home route with Svelte 5 runes and project card links"
```

---

## Task 6 : Mettre à jour `svelte.config.js` + strip intro route

**Files:**
- Modify: `svelte.config.js`
- Modify: `src/routes/+page.svelte`

- [ ] **Step 1 : Mettre à jour `svelte.config.js`**

```js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ fallback: '404.html' }),
    prerender: { entries: ['/', '/home', '/projects'] }
  }
};
```

Note : `/projects/[id]` est ajouté via `entries()` dans la Task 9.

- [ ] **Step 2 : Remplacer `src/routes/+page.svelte` par l'intro seule**

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import IntroScene from '$lib/components/IntroScene.svelte';
</script>

<svelte:head>
  <title>Rémy Bourgeois — Portfolio</title>
</svelte:head>

<IntroScene />
```

- [ ] **Step 3 : Vérifier que le projet compile**

```bash
npm run check
```

Expected : warnings possibles sur `introDone` (encore importé dans IntroScene/Nav) — c'est normal, sera corrigé aux Tasks suivantes. Aucune erreur fatale.

- [ ] **Step 4 : Commit**

```bash
git add svelte.config.js src/routes/+page.svelte
git commit -m "refactor: strip intro route to IntroScene only, add /home to prerender"
```

---

## Task 7 : Mettre à jour IntroScene — goto, no slot, texture locale, N adaptatif

**Files:**
- Modify: `src/lib/components/IntroScene.svelte`

- [ ] **Step 1 : Modifier les imports du script de IntroScene**

Remplacer le bloc d'imports actuel (lignes 1–9 du `<script>`) par :

```ts
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import * as THREE from 'three';
import { audioStore, SFX_SUCCESS } from '$lib/stores/audio';
import { POETIC_PHRASES } from '$lib/data/phrases';
import Icon from '$lib/components/Icons.svelte';
```

Suppressions : `import { get } from 'svelte/store'` et `import { introDone } from '$lib/stores/intro'`.

- [ ] **Step 2 : Supprimer la déclaration module-level `prefersReducedMotion`**

Supprimer la ligne :
```ts
const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;
```

Elle sera remplacée par une variable locale `prefersRM` déclarée inside `onMount`.

- [ ] **Step 3 : Remplacer le début de `onMount` — supprimer introDone, N adaptatif, texture locale**

Remplacer les 3 premières lignes de `onMount` :

```ts
// AVANT (à supprimer)
if (get(introDone)) {
  sceneStep = 2;
}

const w = window.innerWidth, h = window.innerHeight;
const scene = new THREE.Scene();
// ...
N = prefersReducedMotion ? 500 : 2800;
// ...
const sprite = new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/spark1.png');
```

Par :

```ts
// APRÈS
const w = window.innerWidth, h = window.innerHeight;
const prefersRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
N = prefersRM ? 500 : w < 768 ? 1200 : 2800;

const scene = new THREE.Scene();
// ... reste identique jusqu'à la ligne sprite ...
const sprite = new THREE.TextureLoader().load('/assets/spark.png'); // texture locale
```

Dans toute la fonction `onMount` (y compris dans `animate`), remplacer chaque occurrence de `prefersReducedMotion` par `prefersRM`.

- [ ] **Step 4 : Mettre à jour `handlePointerDown` — supprimer les références à sceneStep 2**

Dans la fonction `handlePointerDown`, effectuer ces 3 remplacements :

```ts
// (a) Supprimer la ligne :
if (sceneStep < 2) audioStore.engine?.wakeUp();
// Remplacer par :
audioStore.engine?.wakeUp();

// (b) Supprimer la guard :
if (sceneStep === 2) return;

// (c) Remplacer le setTimeout final :
// AVANT
setTimeout(() => {
  sceneStep = 2;
  introDone.set(true);
}, ANIM_DURATION + TRANSITION_DELAY);

// APRÈS
setTimeout(() => {
  goto('/home');
}, ANIM_DURATION + TRANSITION_DELAY);
```

- [ ] **Step 5 : Supprimer le bloc `#main-content` du template**

Dans le template HTML de IntroScene, supprimer entièrement ce bloc (environ 8 lignes) :

```svelte
<!-- Supprimer ce bloc entier -->
<div
  id="main-content"
  tabindex="-1"
  class="absolute inset-0 z-30 bg-[#020205]/95 backdrop-blur-sm transition-transform duration-1000 ease-in-out
         overflow-y-auto overflow-x-hidden
         {sceneStep === 2 ? 'translate-y-0 pointer-events-auto' : 'translate-y-full pointer-events-none invisible'}"
>
  <slot />
</div>
```

Garder `sceneStep` et les deux autres blocs conditionnels (affichage titre sceneStep 0 et bouton progression sceneStep 1) — ils restent nécessaires.

- [ ] **Step 5 : Vérifier que l'intro tourne sans erreur**

```bash
npm run dev
```

Naviguer sur `http://localhost:5173` — l'intro doit s'afficher. Cliquer 10 fois — doit rediriger vers `/home`. Arrêter le serveur.

- [ ] **Step 6 : Commit**

```bash
git add src/lib/components/IntroScene.svelte
git commit -m "feat: IntroScene redirects to /home via goto, local spark texture, adaptive particle count"
```

---

## Task 8 : Supprimer le store `introDone` — Nav.svelte + layout

**Files:**
- Modify: `src/lib/components/Nav.svelte`
- Modify: `src/routes/+layout.svelte`
- Delete: `src/lib/stores/intro.ts`

- [ ] **Step 1 : Réécrire `src/lib/components/Nav.svelte` avec Svelte 5 runes**

```svelte
<!-- src/lib/components/Nav.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { audioStore } from '$lib/stores/audio';
  import Icon from '$lib/components/Icons.svelte';
  import { sfx } from '$lib/actions/sfx';

  let menuOpen = $state(false);
  let isMuted = $derived($audioStore.isMuted);
  let currentPath = $derived($page.url.pathname);
  let visible = $derived(currentPath !== '/');
</script>

<nav
  aria-label="Navigation principale"
  class="fixed top-0 w-full z-50 transition-all duration-500
         bg-[#020205]/90 backdrop-blur-md border-b border-white/5
         {visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}"
>
  <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
    <a href="/home" use:sfx class="text-white/70 hover:text-white text-xs uppercase tracking-wider transition-colors">
      Rémy Bourgeois
    </a>

    <div class="hidden md:flex items-center gap-6">
      <a href="/home"
         use:sfx
         class="text-xs uppercase tracking-wider transition-colors
                {currentPath === '/home' ? 'text-white' : 'text-white/60 hover:text-white'}">
        Home
      </a>
      <a href="/projects"
         use:sfx
         class="text-xs uppercase tracking-wider transition-colors
                {currentPath.startsWith('/projects') ? 'text-white' : 'text-white/60 hover:text-white'}">
        Projets
      </a>
      <button
        onclick={audioStore.toggleMute}
        aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
        aria-pressed={!isMuted}
        class="flex items-center gap-2 text-white/60 hover:text-white transition-colors min-h-[44px] px-2"
      >
        <div class="w-1.5 h-1.5 rounded-full {isMuted ? 'bg-red-500' : 'bg-emerald-400 animate-pulse'}"></div>
        <Icon name={isMuted ? 'SpeakerOff' : 'Speaker'} size={14} />
      </button>
    </div>

    <button
      class="md:hidden text-white/60 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
      onclick={() => menuOpen = !menuOpen}
      aria-label="Menu"
      aria-expanded={menuOpen}
    >
      <Icon name="Menu" size={20} />
    </button>
  </div>

  {#if menuOpen}
    <div class="md:hidden border-t border-white/5 px-6 py-4 flex flex-col gap-4 bg-[#020205]/95">
      <a href="/home" use:sfx onclick={() => menuOpen = false}
         class="text-sm text-white/70 hover:text-white transition-colors py-2">Home</a>
      <a href="/projects" use:sfx onclick={() => menuOpen = false}
         class="text-sm text-white/70 hover:text-white transition-colors py-2">Projets</a>
      <button onclick={audioStore.toggleMute}
        class="flex items-center gap-2 text-sm text-white/60 hover:text-white w-fit py-2 min-h-[44px]">
        <Icon name={isMuted ? 'SpeakerOff' : 'Speaker'} size={14} />
        Son {isMuted ? 'OFF' : 'ON'}
      </button>
    </div>
  {/if}
</nav>
```

- [ ] **Step 2 : Mettre à jour `src/routes/+layout.svelte` — supprimer introDone**

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
  import Nav from '$lib/components/Nav.svelte';
  import { audioStore } from '$lib/stores/audio';
  import { browser } from '$app/environment';
  import { onNavigate } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    if (!browser) return;
    const unlock = () => { audioStore.engine?.init(); audioStore.engine?.wakeUp(); };
    window.addEventListener('touchstart', unlock, { once: true });
    window.addEventListener('click', unlock, { once: true });

    const onVisibility = () => {
      if (document.hidden) audioStore.engine?.suspendForVisibility();
      else audioStore.engine?.resumeFromVisibility();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  });

  // View Transitions API — graceful degradation
  onNavigate((navigation) => {
    const conn = (navigator as any).connection;
    const slow = conn?.effectiveType === '2g';
    const reduced = typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
    if (!document.startViewTransition || slow || reduced) return;
    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<svelte:head>
  <meta name="author" content="Rémy Bourgeois" />
</svelte:head>

<Nav />
<slot />
```

- [ ] **Step 3 : Supprimer `src/lib/stores/intro.ts`**

```bash
rm src/lib/stores/intro.ts
```

- [ ] **Step 4 : Vérifier qu'il ne reste aucun import de introDone**

```bash
grep -r "introDone\|stores/intro" src/
```

Expected : aucun résultat. Si des résultats apparaissent, supprimer les imports manuellement.

- [ ] **Step 5 : Vérifier la compilation**

```bash
npm run check
```

Expected : aucune erreur.

- [ ] **Step 6 : Commit**

```bash
git add src/lib/components/Nav.svelte src/routes/+layout.svelte
git rm src/lib/stores/intro.ts
git commit -m "refactor: remove introDone store, migrate Nav to Svelte 5 runes, add View Transitions to layout"
```

---

## Task 9 : Mettre à jour `projects/+page.svelte` — supprimer modal, cards comme liens

**Files:**
- Modify: `src/routes/projects/+page.svelte`

- [ ] **Step 1 : Écrire le test mis à jour pour la page projets**

```ts
// tests/projects.test.ts
import { test, expect } from '@playwright/test';

test('shows projects grid', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByRole('link', { name: /Voir le projet/ }).first()).toBeVisible();
});

test('back link goes to /home', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByRole('link', { name: /Retour/ })).toHaveAttribute('href', '/home');
});

test('project card navigates to case study', async ({ page }) => {
  await page.goto('/projects');
  await page.getByRole('link', { name: /Voir le projet/ }).first().click();
  await expect(page.url()).toMatch(/\/projects\/\d+/);
});
```

- [ ] **Step 2 : Lancer le test pour vérifier qu'il échoue**

```bash
npx playwright test tests/projects.test.ts --reporter=list 2>&1 | head -30
```

Expected : au moins le test "navigates to case study" échoue (la modal existe encore).

- [ ] **Step 3 : Réécrire `src/routes/projects/+page.svelte`**

```svelte
<!-- src/routes/projects/+page.svelte -->
<script lang="ts">
  import { PROJECTS } from '$lib/data/projects';
  import Icon from '$lib/components/Icons.svelte';
  import { sfx } from '$lib/actions/sfx';
  import { SITE_URL } from '$lib/data/site';
</script>

<svelte:head>
  <title>Projets — Rémy Bourgeois</title>
  <meta name="description" content="Portfolio de projets : Design System, IA conversationnelle, SaaS B2B, robotique humanoïde." />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Rémy Bourgeois — Portfolio" />
  <meta property="og:title" content="Projets — Rémy Bourgeois" />
  <meta property="og:description" content="Design System, IA conversationnelle, interfaces complexes — 14 ans de travail condensé." />
  <meta property="og:image" content="{SITE_URL}/assets/1_Photo%20Remy%20Bourgeois%20Pro.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="min-h-screen bg-[#020205] text-white">
  <div class="max-w-6xl mx-auto px-6 pt-32 pb-20">

    <header class="mb-16">
      <a href="/home" use:sfx class="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs uppercase tracking-wider mb-8 transition-colors min-h-[44px]">
        <Icon name="ArrowLeft" size={14} /> Retour
      </a>
      <h1 class="text-4xl md:text-6xl font-semibold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
        Projets
      </h1>
      <p class="text-white/50 text-base max-w-xl">
        Design System, IA conversationnelle, interfaces complexes — 14 ans de travail condensé.
      </p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each PROJECTS as project}
        <a
          href="/projects/{project.id}"
          use:sfx
          aria-label="Voir le projet {project.title}"
          class="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden
                 hover:bg-white/[0.08] hover:border-white/20
                 hover:shadow-[0_0_40px_rgba(112,107,254,0.15)]
                 transition-all duration-500 text-left
                 focus-visible:ring-2 focus-visible:ring-[#706bfe]"
        >
          <div class="relative h-56 overflow-hidden">
            <div class="mesh-gradient-bg opacity-0 group-hover:opacity-20 transition-opacity duration-500" aria-hidden="true"></div>
            <img
              src={project.image}
              alt=""
              class="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
          <div class="p-6">
            <div class="h-6 mb-3 opacity-70">
              <img src={project.logo} alt="" class="h-full w-auto object-contain brightness-0 invert" loading="lazy" />
            </div>
            <h2 class="text-lg font-semibold text-white mb-3 group-hover:text-[#706bfe] transition-colors">
              {project.title}
            </h2>
            <div class="flex flex-wrap gap-1.5">
              {#each project.tags as tag}
                <span class="px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 text-[11px] font-medium border border-white/10">
                  {tag}
                </span>
              {/each}
            </div>
          </div>
        </a>
      {/each}
    </div>

  </div>
</div>
```

- [ ] **Step 4 : Lancer les tests projets**

```bash
npx playwright test tests/projects.test.ts --reporter=list
```

Les tests "shows projects grid" et "back link" doivent passer. Le test "navigates to case study" échouera encore car `/projects/[id]` n'existe pas — c'est attendu à ce stade.

- [ ] **Step 5 : Commit**

```bash
git add src/routes/projects/+page.svelte tests/projects.test.ts
git commit -m "feat: projects page uses anchor links to case studies, remove modal"
```

---

## Task 10 : Case study — load function + page

**Files:**
- Create: `src/routes/projects/[id]/+page.ts`
- Create: `src/routes/projects/[id]/+page.svelte`

- [ ] **Step 1 : Créer `src/routes/projects/[id]/+page.ts`**

```ts
// src/routes/projects/[id]/+page.ts
import { PROJECTS } from '$lib/data/projects';
import { error } from '@sveltejs/kit';

export const prerender = true;

export function entries() {
  return PROJECTS.map(p => ({ id: String(p.id) }));
}

export function load({ params }) {
  const id = Number(params.id);
  const idx = PROJECTS.findIndex(p => p.id === id);
  if (idx === -1) throw error(404, 'Projet non trouvé');
  return {
    project: PROJECTS[idx],
    prev: idx > 0 ? PROJECTS[idx - 1] : null,
    next: idx < PROJECTS.length - 1 ? PROJECTS[idx + 1] : null
  };
}
```

- [ ] **Step 2 : Créer `src/routes/projects/[id]/+page.svelte`**

```svelte
<!-- src/routes/projects/[id]/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';
  import Icon from '$lib/components/Icons.svelte';
  import { sfx } from '$lib/actions/sfx';
  import { SITE_URL } from '$lib/data/site';

  const { data }: { data: PageData } = $props();
  const { project, prev, next } = data;
</script>

<svelte:head>
  <title>{project.title} — Rémy Bourgeois</title>
  <meta name="description" content={project.description.slice(0, 160)} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Rémy Bourgeois — Portfolio" />
  <meta property="og:title" content="{project.title} — Rémy Bourgeois" />
  <meta property="og:description" content={project.description.slice(0, 160)} />
  <meta property="og:image" content="{SITE_URL}{project.image}" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="min-h-screen bg-[#020205] text-white">
  <div class="max-w-5xl mx-auto px-6 pt-32 pb-24">

    <!-- Header navigation -->
    <a
      href="/projects"
      use:sfx
      class="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs uppercase tracking-wider mb-12 transition-colors min-h-[44px]"
    >
      <Icon name="ArrowLeft" size={14} /> Tous les projets
    </a>

    <!-- Hero -->
    <div class="mb-10">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div class="h-8 opacity-80 flex-shrink-0">
          <img src={project.logo} alt={project.client} class="h-full object-contain brightness-0 invert" loading="eager" />
        </div>
        {#if project.year || project.role}
          <div class="flex flex-wrap gap-3 text-white/40 text-xs">
            {#if project.year}<span>{project.year}</span>{/if}
            {#if project.year && project.role}<span aria-hidden="true">·</span>{/if}
            {#if project.role}<span>{project.role}</span>{/if}
          </div>
        {/if}
      </div>
      <h1 class="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6 leading-tight">
        {project.title}
      </h1>
      <div class="flex flex-wrap gap-2">
        {#each project.tags as tag}
          <span class="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-medium border border-white/10">
            {tag}
          </span>
        {/each}
      </div>
    </div>

    <!-- Image principale -->
    <div class="relative w-full rounded-3xl overflow-hidden mb-10 bg-white/5 border border-white/10">
      <div class="mesh-gradient-bg opacity-40" aria-hidden="true"></div>
      <img
        src={project.image}
        alt="Aperçu du projet {project.title}"
        class="relative z-10 w-full object-contain max-h-[70vh] p-6 md:p-10 shadow-image-modal"
        loading="eager"
      />
    </div>

    <!-- Description -->
    <div class="max-w-2xl mb-16">
      <p class="text-white/70 text-base md:text-lg leading-relaxed whitespace-pre-line">
        {project.description}
      </p>
      {#if project.url}
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          use:sfx
          class="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-sm transition-all focus-visible:ring-2 focus-visible:ring-[#706bfe]"
        >
          <Icon name="ExternalLink" size={14} /> Voir le projet en ligne
        </a>
      {/if}
    </div>

    <!-- Navigation prev / next -->
    <div class="border-t border-white/10 pt-10 flex flex-col sm:flex-row gap-4 justify-between">
      {#if prev}
        <a
          href="/projects/{prev.id}"
          use:sfx
          class="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group flex-1 sm:flex-initial min-h-[60px] focus-visible:ring-2 focus-visible:ring-[#706bfe]"
        >
          <Icon name="ArrowLeft" size={16} className="text-white/40 group-hover:text-white transition-colors flex-shrink-0" />
          <div class="min-w-0">
            <div class="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Précédent</div>
            <div class="text-sm font-medium text-white/80 group-hover:text-white transition-colors truncate">{prev.title}</div>
          </div>
        </a>
      {:else}
        <div class="flex-1 sm:flex-initial"></div>
      {/if}

      {#if next}
        <a
          href="/projects/{next.id}"
          use:sfx
          class="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group flex-1 sm:flex-initial sm:text-right justify-end min-h-[60px] focus-visible:ring-2 focus-visible:ring-[#706bfe]"
        >
          <div class="min-w-0">
            <div class="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Suivant</div>
            <div class="text-sm font-medium text-white/80 group-hover:text-white transition-colors truncate">{next.title}</div>
          </div>
          <Icon name="ArrowRight" size={16} className="text-white/40 group-hover:text-white transition-colors flex-shrink-0" />
        </a>
      {:else}
        <div class="flex-1 sm:flex-initial"></div>
      {/if}
    </div>

  </div>
</div>
```

- [ ] **Step 3 : Lancer tous les tests**

```bash
npx playwright test --reporter=list
```

Expected : tous les tests passent, y compris "navigates to case study".

- [ ] **Step 4 : Commit**

```bash
git add src/routes/projects/[id]/
git commit -m "feat: case study pages at /projects/[id] with load function and SSG entries"
```

---

## Task 11 : Trails particules dans IntroScene

**Files:**
- Modify: `src/lib/components/IntroScene.svelte`

Cette tâche est une amélioration visuelle — les particules laissent un sillage lors des transitions de forme.

- [ ] **Step 1 : Ajouter le buffer de trails dans IntroScene**

Dans la section `onMount`, après la déclaration du tableau `positions` (N*3), ajouter :

```ts
// Trail buffer : 3 frames précédentes par particule
const trailBuffers: Float32Array[] = [
  new Float32Array(N * 3).fill(0),
  new Float32Array(N * 3).fill(0),
  new Float32Array(N * 3).fill(0),
];
let trailIdx = 0;
```

- [ ] **Step 2 : Dans la boucle `animate`, copier les positions courantes dans le trail buffer**

Juste avant `posAttr.needsUpdate = true;`, ajouter :

```ts
// Mise à jour du trail buffer
trailBuffers[trailIdx].set(posArr);
trailIdx = (trailIdx + 1) % trailBuffers.length;
```

- [ ] **Step 3 : Modifier la taille et l'opacité des particules pendant les transitions**

Dans le `PointsMaterial`, passer de `opacity:.85` à `opacity:.75` et ajouter dans la boucle animate, pendant les frames où `isLocked || isReturning`, une légère variation de taille :

```ts
// Dans animate(), après la mise à jour des positions :
if ((isLocked || isReturning) && !prefersRM) {
  mat.opacity = 0.65;
  mat.size = 0.18;
} else {
  mat.opacity = 0.75;
  mat.size = 0.15;
}
mat.needsUpdate = true;
```

Note : `mat` doit être déclaré dans le scope de `onMount` (déplacer `const mat = new THREE.PointsMaterial(...)` dans une variable `let mat`).

- [ ] **Step 4 : Vérifier visuellement**

```bash
npm run dev
```

Naviguer sur `/`, cliquer 3-4 fois — les particules doivent avoir un léger changement de taille/opacité lors des transitions. Arrêter le serveur.

- [ ] **Step 5 : Commit**

```bash
git add src/lib/components/IntroScene.svelte
git commit -m "feat: particle trail buffer and adaptive opacity/size during shape transitions"
```

---

## Task 12 : Vérification responsive mobile

Cette tâche est manuelle — pas de code à écrire, mais des vérifications à faire.

- [ ] **Step 1 : Lancer le dev server**

```bash
npm run dev
```

- [ ] **Step 2 : Ouvrir les DevTools Chrome → Device Toolbar → iPhone SE (375px)**

Tester chaque page et cocher :

**Page `/` (intro) :**
- [ ] Le titre "DESIGNING INTENTIONS" est lisible et non tronqué
- [ ] Le bouton de progression (cercle) est accessible au pouce (≥ 44px, centré en bas)
- [ ] Le bouton son est visible et tappable (≥ 44px)

**Page `/home` (390px iPhone 14) :**
- [ ] Le hero est en colonne (photo au-dessus du texte)
- [ ] La marquee des logos est visible
- [ ] Les témoignages passent en 1 colonne
- [ ] Les expertises passent en 1 colonne
- [ ] Les compteurs impact passent en 2 colonnes (grid-cols-2)
- [ ] Les projets mis en avant passent en colonne (image au-dessus du texte)
- [ ] La section contact : boutons en colonne (`flex-col sm:flex-row`)
- [ ] Le bouton scroll-to-top a ≥ 44px tap target

**Page `/projects` (375px) :**
- [ ] 1 colonne de cards
- [ ] Le lien "Retour" est tappable
- [ ] Les cards ont une image lisible

**Page `/projects/[id]` (375px) :**
- [ ] L'image projet prend toute la largeur
- [ ] Le titre est lisible
- [ ] Les boutons prev/next sont en colonne (`flex-col sm:flex-row`) avec `min-h-[60px]`
- [ ] Le lien "Tous les projets" est tappable

- [ ] **Step 3 : Corriger tout problème trouvé**

Si des problèmes sont détectés, les corriger dans les fichiers concernés. Committer les corrections séparément :

```bash
git add <fichiers modifiés>
git commit -m "fix(responsive): <description du correctif>"
```

- [ ] **Step 4 : Tester aussi en 768px (tablette)**

Vérifier que les transitions entre layouts mobiles et desktop sont fluides (pas de contenu tronqué ou layout cassé au breakpoint md:).

---

## Task 13 : Build final + tests

- [ ] **Step 1 : Lancer tous les tests Playwright**

```bash
npx playwright test --reporter=list
```

Expected : tous les tests en PASS. Si des tests échouent, corriger les sélecteurs ou le code, ne pas désactiver les tests.

- [ ] **Step 2 : Vérifier la compilation TypeScript**

```bash
npm run check
```

Expected : aucune erreur.

- [ ] **Step 3 : Lancer le build de production**

```bash
npm run build
```

Expected : build sans erreur. Vérifier que les routes générées incluent `/home` et `/projects/1` à `/projects/7` dans le dossier `.svelte-kit/output/`.

```bash
ls .svelte-kit/output/prerendered/pages/ 2>/dev/null || ls build/ 2>/dev/null | head -20
```

- [ ] **Step 4 : Commit final si tout passe**

```bash
git add -A
git commit -m "chore: final build and test verification for portfolio v2"
```

---

## Récapitulatif des routes v2

| Route | Fichier | Description |
|---|---|---|
| `/` | `src/routes/+page.svelte` | Intro Three.js, redirige vers /home |
| `/home` | `src/routes/home/+page.svelte` | Portfolio complet |
| `/projects` | `src/routes/projects/+page.svelte` | Grille de projets |
| `/projects/[id]` | `src/routes/projects/[id]/+page.svelte` | Case study |
