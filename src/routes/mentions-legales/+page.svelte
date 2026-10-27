<!-- src/routes/mentions-legales/+page.svelte -->
<script lang="ts">
  import PageShell from '$lib/components/PageShell.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import SectionTitle from '$lib/components/SectionTitle.svelte';
  import { SITE_URL, EMAIL, LEGAL } from '$lib/data/site';

  const CRUMBS = [
    { name: 'Accueil', path: '/' },
    { name: 'Mentions légales', path: '/mentions-legales' }
  ];
</script>

<svelte:head>
  <title>Mentions légales | Rémy Bourgeois</title>
  <meta
    name="description"
    content="Éditeur, hébergeur et données personnelles du site remybourgeois.com."
  />
  <!-- Page obligatoire, pas une page de contenu : hors index. -->
  <meta name="robots" content="noindex, follow" />
</svelte:head>

<PageShell>
  <PageHeader title="Mentions légales" crumbs={CRUMBS}>
    {#snippet lede()}
      Ce que la loi demande à un site professionnel de dire sur lui-même, et ce que ce site fait de
      vos données : rien.
    {/snippet}
  </PageHeader>

  <div class="max-w-[46rem] flex flex-col gap-14">
    <section aria-labelledby="editeur-title">
      <SectionTitle id="editeur-title" class="mb-6">Éditeur du site</SectionTitle>
      <!-- Sous 640 px, libellé et valeur se superposent : en deux colonnes, le
           SIRET en mono et l'adresse ne tenaient pas dans 360 px. -->
      <dl class="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-8 gap-y-1 sm:gap-y-3 text-sm">
        <dt class="text-white/60">Dénomination</dt>
        <dd class="text-white/85 min-w-0 break-words mb-3 sm:mb-0">{LEGAL.company}</dd>
        <dt class="text-white/60">Forme juridique</dt>
        <dd class="text-white/85 min-w-0 break-words mb-3 sm:mb-0">{LEGAL.form}</dd>
        <dt class="text-white/60">Siège social</dt>
        <dd class="text-white/85 min-w-0 break-words mb-3 sm:mb-0">{LEGAL.address}</dd>
        <dt class="text-white/60">SIREN</dt>
        <dd class="text-white/85 font-mono min-w-0 break-words mb-3 sm:mb-0">{LEGAL.siren}</dd>
        <dt class="text-white/60">SIRET</dt>
        <dd class="text-white/85 font-mono min-w-0 break-words mb-3 sm:mb-0">{LEGAL.siret}</dd>
        <dt class="text-white/60">RCS</dt>
        <dd class="text-white/85 min-w-0 break-words mb-3 sm:mb-0">{LEGAL.rcs}</dd>
        <dt class="text-white/60">TVA intracommunautaire</dt>
        <dd class="text-white/85 font-mono min-w-0 break-words mb-3 sm:mb-0">{LEGAL.vat}</dd>
        <dt class="text-white/60">Code APE</dt>
        <dd class="text-white/85 min-w-0 break-words mb-3 sm:mb-0">{LEGAL.ape}</dd>
        <dt class="text-white/60">Directeur de la publication</dt>
        <dd class="text-white/85 min-w-0 break-words mb-3 sm:mb-0">{LEGAL.manager}</dd>
        <dt class="text-white/60">Contact</dt>
        <dd class="min-w-0 break-all">
          <a href="mailto:{EMAIL}" class="text-accent hover:text-white underline underline-offset-4"
            >{EMAIL}</a
          >
        </dd>
      </dl>
    </section>

    <section aria-labelledby="hebergeur-title">
      <SectionTitle id="hebergeur-title" class="mb-6">Hébergement</SectionTitle>
      <p class="text-white/70 text-sm leading-relaxed">
        Le site est hébergé par
        <a
          href={LEGAL.host.url}
          target="_blank"
          rel="noopener noreferrer"
          class="text-accent hover:text-white underline underline-offset-4">{LEGAL.host.name}</a
        >, {LEGAL.host.address}. Son code source est public sur GitHub.
      </p>
    </section>

    <section aria-labelledby="donnees-title">
      <SectionTitle id="donnees-title" class="mb-6">Données personnelles</SectionTitle>
      <div class="flex flex-col gap-4 text-white/70 text-sm leading-relaxed">
        <p>
          Ce site ne dépose aucun cookie, n'embarque aucun outil de mesure d'audience ni aucun
          script tiers, et ne collecte aucune donnée. Il n'y a ni formulaire ni compte.
        </p>
        <p>
          Si vous m'écrivez, votre adresse et votre message servent uniquement à vous répondre. Ils
          ne sont ni partagés ni ajoutés à une liste. Vous pouvez en demander la suppression à
          l'adresse ci-dessus.
        </p>
        <p>
          Le son de la page d'intro et le choix de le couper sont mémorisés dans votre navigateur
          (stockage local), sans transmission.
        </p>
      </div>
    </section>

    <section aria-labelledby="propriete-title">
      <SectionTitle id="propriete-title" class="mb-6">Propriété intellectuelle</SectionTitle>
      <div class="flex flex-col gap-4 text-white/70 text-sm leading-relaxed">
        <p>
          Les textes, le portrait, les captures et les vidéos des études de cas sont la propriété de
          Rémy Bourgeois ou sont publiés avec l'accord des clients concernés. Les logos et marques
          cités appartiennent à leurs titulaires et ne sont affichés qu'à titre de référence.
        </p>
        <p>
          Toute reproduction demande un accord écrit préalable. Les citations courtes avec lien vers
          <a href={SITE_URL} class="text-accent hover:text-white underline underline-offset-4"
            >remybourgeois.com</a
          > sont les bienvenues.
        </p>
      </div>
    </section>
  </div>
</PageShell>
