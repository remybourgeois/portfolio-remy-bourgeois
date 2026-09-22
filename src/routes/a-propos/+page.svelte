<!-- src/routes/a-propos/+page.svelte -->
<script lang="ts">
  import RevealOnScroll from '$lib/components/RevealOnScroll.svelte';
  import Icon from '$lib/components/Icons.svelte';
  import { sfx } from '$lib/actions/sfx';
  import {
    SITE_URL, SITE_NAME, SITE_LOCALE, OG_IMAGE,
    PERSON_ID, WEBSITE_ID, CONTENT_UPDATED, EMAIL, PROFILES
  } from '$lib/data/site';
  import { breadcrumb } from '$lib/data/person';
  import { jsonLd } from '$lib/utils/text';

  /**
   * Repères datés. Chaque entrée est une affirmation autonome et vérifiable —
   * c'est la forme qu'un moteur génératif peut citer hors de son contexte,
   * contrairement à une prose allusive à la première personne.
   */
  const TIMELINE = [
    {
      period: '2013 – 2020',
      title: 'Designer d’interaction — Aldebaran Robotics',
      body:
        'Sept ans à concevoir les comportements et les interactions de NAO et Pepper, les robots humanoïdes les plus déployés au monde. Applications embarquées sur des milliers de robots dans plus de 70 pays, en retail, en gare et en aéroport. Design conversationnel, scénarisation vocale et sound design — dix ans avant l’arrivée des LLM.',
      slug: 'aldebaran'
    },
    {
      period: '2021 – 2024',
      title: 'Lead UI & Référent Design System — Crédit Agricole',
      body:
        'Trois ans sur l’un des plus vastes écosystèmes digitaux d’Europe : site institutionnel, application « Ma Banque » et outils conseillers. Architecture de design tokens pour gérer la déclinaison multi-marques des caisses régionales. Design system adopté par plus de 15 équipes produit, application utilisée par plus de 30 millions de personnes chaque mois.',
      slug: 'credit-agricole'
    },
    {
      period: '2023 – 2024',
      title: 'Senior Product Designer — iPify & Highlight',
      body:
        'Chez iPify, plateforme LegalTech de gestion internationale de portefeuilles de brevets : refonte du design system et conception des premières briques IA, dont l’interrogation en langage naturel. Chez Highlight, architecture d’un design system multi-thème pour un SaaS distribué en marque blanche, ramenant le déploiement d’une nouvelle marque de plusieurs semaines à quelques jours.',
      slug: 'ipify'
    },
    {
      period: '2025 – 2026',
      title: 'Founding Designer — Ofelia (Bonitasoft)',
      body:
        'Seul designer d’une suite d’orchestration IA gouvernée, construite à partir d’une page blanche. Le produit, un assistant agentique, s’intègre directement dans Slack et Teams. C’est sur ce projet que le rôle a basculé vers le design engineering : plus de maquette statique, des Pull Requests ouvertes directement dans le dépôt et revues par un développeur front.',
      slug: 'ofelia'
    }
  ];
</script>

<svelte:head>
  <title>À propos — Rémy Bourgeois, Product Design Engineer à Lyon</title>
  <meta
    name="description"
    content="Le parcours de Rémy Bourgeois : 7 ans en robotique humanoïde chez Aldebaran, 3 ans au Crédit Agricole, puis Founding Designer d'un assistant IA. 14 ans de design produit."
  />

  <meta property="og:type" content="profile" />
  <meta property="og:locale" content={SITE_LOCALE} />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:title" content="À propos — Rémy Bourgeois, Product Design Engineer" />
  <meta property="og:description" content="7 ans en robotique humanoïde, 3 ans au Crédit Agricole, puis Founding Designer d'un assistant IA. 14 ans de design produit." />
  <meta property="og:image" content={OG_IMAGE} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Rémy Bourgeois — Designing Intentions" />
  <meta property="og:url" content="{SITE_URL}/a-propos" />
  <meta property="profile:first_name" content="Rémy" />
  <meta property="profile:last_name" content="Bourgeois" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="À propos — Rémy Bourgeois, Product Design Engineer" />
  <meta name="twitter:description" content="7 ans en robotique humanoïde, 3 ans au Crédit Agricole, puis Founding Designer d'un assistant IA." />
  <meta name="twitter:image" content={OG_IMAGE} />
  <meta name="twitter:image:alt" content="Rémy Bourgeois — Designing Intentions" />
  <meta name="twitter:url" content="{SITE_URL}/a-propos" />

  {@html `<script type="application/ld+json">${jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      breadcrumb([
        { name: 'Accueil',   path: '/' },
        { name: 'À propos',  path: '/a-propos' }
      ]),
      {
        "@type": "AboutPage",
        "@id": SITE_URL + "/a-propos#webpage",
        "url": SITE_URL + "/a-propos",
        "name": "À propos — Rémy Bourgeois, Product Design Engineer à Lyon",
        "inLanguage": "fr-FR",
        "isPartOf": { "@id": WEBSITE_ID },
        "about": { "@id": PERSON_ID },
        "mainEntity": { "@id": PERSON_ID },
        "dateModified": CONTENT_UPDATED
      }
    ]
  })}</script>`}
</svelte:head>

<main id="main-content" class="min-h-screen bg-[#020205] text-white">
  <div class="max-w-4xl mx-auto px-6 pt-32 pb-24">

    <header class="mb-16">
      <a
        href="/"
        use:sfx
        class="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs uppercase tracking-wider mb-8 transition-colors min-h-[44px]"
      >
        <Icon name="ArrowLeft" size={14} /> Retour
      </a>

      <div class="flex flex-col md:flex-row gap-8 md:items-center">
        <img
          src="/assets/remy-bourgeois.webp"
          alt="Portrait de Rémy Bourgeois"
          width="500"
          height="500"
          class="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover flex-shrink-0 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          loading="eager"
        />
        <div>
          <h1 class="text-4xl md:text-5xl font-semibold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            À propos
          </h1>
          <p class="text-white/70 text-lg leading-relaxed">
            <strong class="text-white">Rémy Bourgeois</strong> est Product Designer et Design Engineer
            freelance, basé à <strong class="text-white">Lyon</strong>. Il conçoit depuis 14 ans des
            interfaces pour des produits complexes, et écrit lui-même le code qui les met en production.
          </p>
        </div>
      </div>
    </header>

    <!-- ── Le fil ───────────────────────────────────────────────────────── -->
    <section class="mb-20" aria-labelledby="fil-title">
      <h2 id="fil-title" class="text-xs uppercase tracking-widest text-white/50 mb-8 font-semibold flex items-center gap-4">
        <span class="w-8 h-px bg-white/20" aria-hidden="true"></span> Le fil conducteur
      </h2>
      <div class="body-text flex flex-col gap-5 text-white/70 text-base md:text-[1.05rem] leading-[1.85]">
        <p>
          Le point de départ n'est pas un écran, c'est un <strong>robot</strong>. Pendant sept ans chez
          Aldebaran, la question n'était pas « où placer ce bouton » mais « comment une machine peut-elle
          se rendre compréhensible à quelqu'un qui ne l'a jamais vue ». Concevoir pour un corps dans
          l'espace, dans une gare bruyante, oblige à penser l'interaction avant l'interface.
        </p>
        <p>
          Ce terrain a laissé deux héritages. Le premier est le <strong>design conversationnel</strong> —
          les états d'incertitude, la reprise en main humaine, ce qui se passe quand la machine se
          trompe — pratiqué bien avant que les LLM ne rendent le sujet courant. Le second est le
          <strong>son</strong> : la voix et le sound design faisaient partie du travail, et c'est
          resté une pratique personnelle, sous le même nom, en musique.
        </p>
        <p>
          Les années suivantes ont ajouté l'échelle. Le Crédit Agricole a imposé la rigueur des
          <strong>design systems</strong> opérés par des dizaines d'équipes. iPify et Highlight ont
          ajouté la contrainte du SaaS B2B dense et du multi-marques. Ofelia a fermé la boucle :
          un assistant IA à concevoir de zéro, et un mode de travail où le design ne s'arrête plus
          à la maquette.
        </p>
        <p>
          C'est le point d'arrivée actuel : <strong>supprimer le hand-off</strong>. Les composants
          sont implémentés directement dans le dépôt, les Pull Requests sont ouvertes par le designer
          et revues par un développeur front. Il n'y a plus de traduction entre l'intention et
          l'implémentation, donc plus de perte.
        </p>
      </div>
    </section>

    <!-- ── Parcours ─────────────────────────────────────────────────────── -->
    <section class="mb-20" aria-labelledby="parcours-title">
      <h2 id="parcours-title" class="text-xs uppercase tracking-widest text-white/50 mb-10 font-semibold flex items-center gap-4">
        <span class="w-8 h-px bg-white/20" aria-hidden="true"></span> Parcours
      </h2>

      <ol class="flex flex-col gap-8">
        {#each TIMELINE as step}
          <!-- RevealOnScroll rend un <div> : il doit vivre DANS le <li>, sinon
               l'<ol> a des enfants directs invalides (axe: list / listitem). -->
          <li class="pl-5 border-l-2 border-[#706bfe]/50">
            <RevealOnScroll>
              <p class="text-[10px] uppercase tracking-[0.25em] text-[#a8a5ff] font-semibold mb-2">
                {step.period}
              </p>
              <h3 class="text-lg font-semibold mb-3">{step.title}</h3>
              <p class="text-sm md:text-base text-white/65 leading-[1.85] mb-4">{step.body}</p>
              <a
                href="/projects/{step.slug}"
                use:sfx
                class="inline-flex items-center gap-2 text-xs text-[#a8a5ff] hover:text-white transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-[#706bfe] rounded-full"
              >
                Voir l'étude de cas <Icon name="ArrowRight" size={12} />
              </a>
            </RevealOnScroll>
          </li>
        {/each}
      </ol>
    </section>

    <!-- ── Ailleurs ─────────────────────────────────────────────────────── -->
    <section class="mb-20" aria-labelledby="ailleurs-title">
      <h2 id="ailleurs-title" class="text-xs uppercase tracking-widest text-white/50 mb-8 font-semibold flex items-center gap-4">
        <span class="w-8 h-px bg-white/20" aria-hidden="true"></span> Ailleurs sur le web
      </h2>
      <p class="text-white/65 text-sm leading-[1.85] mb-6">
        Plusieurs personnes portent ce nom. Les profils ci-dessous sont les miens — y compris le
        versant musique et sound design, qui vient directement des années passées en robotique.
      </p>
      <ul class="flex flex-wrap gap-3">
        {#each PROFILES as url}
          <li>
            <a
              href={url}
              target="_blank"
              rel="me noopener noreferrer"
              use:sfx
              class="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-white/15 hover:border-white/35
                     text-white/60 hover:text-white text-xs transition-colors min-h-[44px]
                     focus-visible:ring-2 focus-visible:ring-[#706bfe]"
            >
              <Icon name="ExternalLink" size={12} />
              {new URL(url).hostname.replace(/^www\./, '')}
            </a>
          </li>
        {/each}
      </ul>
    </section>

    <!-- ── Contact ──────────────────────────────────────────────────────── -->
    <section class="text-center" aria-labelledby="contact-title">
      <h2 id="contact-title" class="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
        Parlons-en
      </h2>
      <p class="text-white/70 mb-8 max-w-xl mx-auto leading-relaxed">
        Un projet, une question, ou juste l'envie d'échanger sur le design d'interfaces IA.
      </p>
      <div class="flex flex-wrap justify-center gap-3">
        <a
          href="mailto:{EMAIL}"
          use:sfx
          class="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[#5a55e0] hover:bg-[#4a45d0] text-white font-medium transition-colors focus-visible:ring-2 focus-visible:ring-white"
        >
          <Icon name="Mail" size={16} /> {EMAIL}
        </a>
        <a
          href="/services"
          use:sfx
          class="inline-flex items-center gap-3 px-7 py-4 rounded-full border border-white/20 hover:border-white/40 text-white/70 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[#706bfe]"
        >
          Voir les prestations <Icon name="ArrowRight" size={14} />
        </a>
      </div>
    </section>

  </div>
</main>
