<!-- src/routes/audit-design-system/+page.svelte -->
<script lang="ts">
  import { seen } from '#lib/actions/seen.ts';
  import RevealOnScroll from '#lib/components/RevealOnScroll.svelte';
  import PageShell from '#lib/components/PageShell.svelte';
  import PageHeader from '#lib/components/PageHeader.svelte';
  import SectionTitle from '#lib/components/SectionTitle.svelte';
  import PageCta from '#lib/components/PageCta.svelte';
  import {
    SITE_URL,
    SITE_NAME,
    SITE_LOCALE,
    OG_IMAGE,
    PERSON_ID,
    WEBSITE_ID,
    CONTENT_UPDATED
  } from '#lib/data/site.ts';
  import { breadcrumb } from '#lib/data/person.ts';
  import { jsonLd } from '#lib/utils/text.ts';
  import {
    AUDIT_PATH,
    AUDIT_TITLE,
    AUDIT_HOOK,
    AUDIT_PROBLEM,
    AUDIT_PROMISE,
    AUDIT_STANCE,
    AUDIT_DELIVERABLES,
    AUDIT_WHY,
    AUDIT_CASES,
    AUDIT_CTA,
    AUDIT_MAILTO
  } from '#lib/data/audit.ts';

  /**
   * Ni tarif, ni durée, ni formule sur cette page : le format se discute au
   * cas par cas. Un seul bouton, en bas, qui ouvre le courriel avec l'objet
   * déjà rempli.
   */
  const TITLE = `${AUDIT_TITLE} | Rémy Bourgeois, Senior Product Design Engineer`;
  const DESCRIPTION = `${AUDIT_HOOK} Je mesure l'écart entre Figma et le code et je vous donne un plan pour le réduire.`;

  const CRUMBS = [
    { name: 'Accueil', path: '/' },
    { name: AUDIT_TITLE, path: AUDIT_PATH }
  ];
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
  <meta property="og:url" content="{SITE_URL}{AUDIT_PATH}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={TITLE} />
  <meta name="twitter:description" content={DESCRIPTION} />
  <meta name="twitter:image" content={OG_IMAGE} />
  <meta name="twitter:image:alt" content="Rémy Bourgeois, Designing Intentions" />
  <meta name="twitter:url" content="{SITE_URL}{AUDIT_PATH}" />

  {@html `<script type="application/ld+json">${jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      breadcrumb(CRUMBS),
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}${AUDIT_PATH}#webpage`,
        url: `${SITE_URL}${AUDIT_PATH}`,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: 'fr-FR',
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': PERSON_ID },
        dateModified: CONTENT_UPDATED
      },
      {
        '@type': 'Service',
        '@id': `${SITE_URL}${AUDIT_PATH}#service`,
        name: AUDIT_TITLE,
        description: `${AUDIT_PROBLEM} ${AUDIT_PROMISE}`,
        provider: { '@id': PERSON_ID },
        areaServed: 'FR',
        serviceType: AUDIT_TITLE
      }
    ]
  })}<\/script>`}
</svelte:head>

<PageShell>
  <PageHeader title={AUDIT_TITLE} crumbs={CRUMBS}>
    {#snippet lede()}
      {AUDIT_HOOK}
    {/snippet}
  </PageHeader>

  <div class="mb-20 max-w-[46rem] pl-5 border-l-2 border-primary/50">
    <p class="text-white/70 text-base md:text-lg leading-[1.85]">
      {AUDIT_PROBLEM}
      {AUDIT_PROMISE}
      {AUDIT_STANCE}
    </p>
  </div>

  <RevealOnScroll>
    <div class="w-full mb-20">
      <SectionTitle class="mb-12">Ce que vous recevez</SectionTitle>
      <ul use:seen class="list-cascade grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0 m-0">
        {#each AUDIT_DELIVERABLES as item, i (item)}
          <li class="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-6">
            <span class="font-mono text-xs text-accent tracking-[0.15em]" aria-hidden="true"
              >{String(i + 1).padStart(2, '0')}</span
            >
            <span class="text-lg font-semibold text-white leading-snug">{item}</span>
          </li>
        {/each}
      </ul>
    </div>
  </RevealOnScroll>

  <RevealOnScroll>
    <div class="w-full mb-20">
      <SectionTitle class="mb-8">Pourquoi moi</SectionTitle>
      <p class="text-white/70 text-base md:text-lg leading-[1.85] max-w-[46rem] mb-6">
        {AUDIT_WHY}
      </p>
      <ul class="flex flex-wrap gap-x-6 gap-y-1 list-none p-0 m-0">
        {#each AUDIT_CASES as c (c.slug)}
          <li>
            <a
              href="/projects/{c.slug}"
              class="inline-flex items-center min-h-[44px] text-sm text-accent hover:text-white underline underline-offset-4 transition-colors"
            >
              Étude de cas {c.client}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </RevealOnScroll>

  <RevealOnScroll>
    <PageCta title={AUDIT_HOOK} primaryHref={AUDIT_MAILTO} primaryLabel={AUDIT_CTA}>
      {#snippet lede()}
        Le format se discute au cas par cas.
      {/snippet}
    </PageCta>
  </RevealOnScroll>
</PageShell>
