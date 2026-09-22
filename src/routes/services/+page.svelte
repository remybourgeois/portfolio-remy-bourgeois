<!-- src/routes/services/+page.svelte -->
<script lang="ts">
  import RevealOnScroll from '$lib/components/RevealOnScroll.svelte';
  import Icon from '$lib/components/Icons.svelte';
  import { sfx } from '$lib/actions/sfx';
  import { SERVICES, FAQ } from '$lib/data/services';
  import {
    SITE_URL, SITE_NAME, SITE_LOCALE, OG_IMAGE,
    PERSON_ID, WEBSITE_ID, CONTENT_UPDATED, EMAIL
  } from '$lib/data/site';
  import { breadcrumb } from '$lib/data/person';
  import { jsonLd } from '$lib/utils/text';

  let openFaq = $state<number | null>(0);
</script>

<svelte:head>
  <title>Prestations — Product Designer freelance à Lyon | Rémy Bourgeois</title>
  <meta
    name="description"
    content="Design system, assistants IA, SaaS B2B et design engineering. Product Designer freelance à Lyon, 14 ans d'expérience. Missions en régie ou au forfait."
  />

  <meta property="og:type" content="website" />
  <meta property="og:locale" content={SITE_LOCALE} />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:title" content="Prestations — Product Designer freelance à Lyon" />
  <meta property="og:description" content="Design system, assistants IA, SaaS B2B et design engineering. 14 ans d'expérience, missions en régie ou au forfait." />
  <meta property="og:image" content={OG_IMAGE} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Rémy Bourgeois — Designing Intentions" />
  <meta property="og:url" content="{SITE_URL}/services" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Prestations — Product Designer freelance à Lyon" />
  <meta name="twitter:description" content="Design system, assistants IA, SaaS B2B et design engineering. 14 ans d'expérience." />
  <meta name="twitter:image" content={OG_IMAGE} />
  <meta name="twitter:image:alt" content="Rémy Bourgeois — Designing Intentions" />
  <meta name="twitter:url" content="{SITE_URL}/services" />

  {@html `<script type="application/ld+json">${jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      breadcrumb([
        { name: 'Accueil',     path: '/' },
        { name: 'Prestations', path: '/services' }
      ]),
      {
        "@type": "WebPage",
        "@id": SITE_URL + "/services#webpage",
        "url": SITE_URL + "/services",
        "name": "Prestations — Product Designer freelance à Lyon",
        "inLanguage": "fr-FR",
        "isPartOf": { "@id": WEBSITE_ID },
        "about": { "@id": PERSON_ID },
        "dateModified": CONTENT_UPDATED
      },
      ...SERVICES.map((s) => ({
        "@type": "Service",
        "@id": `${SITE_URL}/services#service-${s.id}`,
        "name": s.title,
        "description": s.summary,
        "serviceType": s.title,
        "provider": { "@id": PERSON_ID },
        "areaServed": { "@type": "Country", "name": "France" },
        "availableChannel": {
          "@type": "ServiceChannel",
          "serviceUrl": SITE_URL + "/services"
        }
      })),
      {
        "@type": "FAQPage",
        "@id": SITE_URL + "/services#faq",
        "isPartOf": { "@id": WEBSITE_ID },
        "inLanguage": "fr-FR",
        "mainEntity": FAQ.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
      }
    ]
  })}</script>`}
</svelte:head>

<main id="main-content" class="min-h-screen bg-[#020205] text-white">
  <div class="max-w-5xl mx-auto px-6 pt-32 pb-24">

    <header class="mb-16">
      <a
        href="/"
        use:sfx
        class="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs uppercase tracking-wider mb-8 transition-colors min-h-[44px]"
      >
        <Icon name="ArrowLeft" size={14} /> Retour
      </a>
      <h1 class="text-4xl md:text-6xl font-semibold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
        Prestations
      </h1>
      <p class="text-white/70 text-lg md:text-xl leading-relaxed max-w-3xl">
        Je suis <strong class="text-white">Rémy Bourgeois</strong>, Product Designer et Design Engineer
        freelance basé à <strong class="text-white">Lyon</strong>. J'interviens depuis 14 ans sur des
        produits <strong class="text-white">SaaS B2B</strong> à forte complexité métier — design systems,
        assistants IA et interfaces denses — de la startup à la grande entreprise.
      </p>
      <div class="flex flex-wrap gap-3 mt-8">
        <span class="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white/70 text-xs">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true"></span>
          Disponible
        </span>
        <span class="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white/70 text-xs">
          <Icon name="MapPin" size={12} /> Lyon &amp; à distance
        </span>
        <span class="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white/70 text-xs">
          <Icon name="Briefcase" size={12} /> Régie ou forfait
        </span>
      </div>
    </header>

    <!-- ── Prestations ──────────────────────────────────────────────────── -->
    <section class="mb-24" aria-labelledby="prestations-title">
      <h2
        id="prestations-title"
        class="text-xs uppercase tracking-widest text-white/50 mb-12 font-semibold flex items-center gap-4"
      >
        <span class="w-8 h-px bg-white/20" aria-hidden="true"></span> Ce sur quoi j'interviens
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each SERVICES as service}
          <RevealOnScroll>
            <article class="h-full flex flex-col p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 shadow-expert">
              <div class="mb-5 p-3 bg-white/10 rounded-full w-fit shadow-[0_0_15px_#706bfe33]">
                <Icon name={service.icon} size={22} className="text-white" />
              </div>
              <h3 class="text-lg font-semibold mb-3">{service.title}</h3>
              <p class="text-sm text-white/70 leading-relaxed mb-5">{service.summary}</p>

              <ul class="space-y-2 mb-5 flex-1">
                {#each service.deliverables as item}
                  <li class="flex gap-2.5 text-sm text-white/60 leading-relaxed">
                    <span class="text-[#a8a5ff] flex-shrink-0" aria-hidden="true">—</span>
                    <span>{item}</span>
                  </li>
                {/each}
              </ul>

              {#if service.caseStudy}
                <a
                  href="/projects/{service.caseStudy.slug}"
                  use:sfx
                  class="inline-flex items-center gap-2 text-xs text-[#a8a5ff] hover:text-white transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-[#706bfe] rounded-full"
                >
                  {service.caseStudy.label} <Icon name="ArrowRight" size={12} />
                </a>
              {/if}
            </article>
          </RevealOnScroll>
        {/each}
      </div>
    </section>

    <!-- ── FAQ ──────────────────────────────────────────────────────────── -->
    <section class="mb-24" aria-labelledby="faq-title">
      <h2
        id="faq-title"
        class="text-xs uppercase tracking-widest text-white/50 mb-12 font-semibold flex items-center gap-4"
      >
        <span class="w-8 h-px bg-white/20" aria-hidden="true"></span> Questions fréquentes
      </h2>

      <div class="flex flex-col gap-3">
        {#each FAQ as item, i}
          <div class="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            <h3>
              <button
                type="button"
                onclick={() => (openFaq = openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                aria-controls="faq-answer-{i}"
                class="w-full flex items-center justify-between gap-4 text-left px-6 py-5 min-h-[44px]
                       text-white/85 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[#706bfe]"
              >
                <span class="text-base font-medium">{item.q}</span>
                <Icon name={openFaq === i ? 'ChevronUp' : 'ChevronDown'} size={16} className="flex-shrink-0 text-white/50" />
              </button>
            </h3>
            <!--
              La réponse reste dans le DOM même repliée : un `{#if}` la retirerait
              du HTML prérendu, et la FAQPage déclarerait alors des réponses
              absentes de la page — ce que Google traite comme du balisage trompeur.
            -->
            <div id="faq-answer-{i}" hidden={openFaq !== i} class="px-6 pb-6">
              <p class="text-sm text-white/65 leading-[1.85]">{item.a}</p>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <!-- ── Contact ──────────────────────────────────────────────────────── -->
    <section class="text-center" aria-labelledby="contact-title">
      <h2 id="contact-title" class="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
        Démarrons un projet
      </h2>
      <p class="text-white/70 mb-8 max-w-xl mx-auto leading-relaxed">
        Décrivez le contexte et l'objectif en quelques lignes — je réponds avec la faisabilité,
        le format de mission adapté et un devis.
      </p>
      <a
        href="mailto:{EMAIL}"
        use:sfx
        class="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[#5a55e0] hover:bg-[#4a45d0] text-white font-medium transition-colors focus-visible:ring-2 focus-visible:ring-white"
      >
        <Icon name="Mail" size={16} /> {EMAIL}
      </a>
    </section>

  </div>
</main>
