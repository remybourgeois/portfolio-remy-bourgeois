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
      <dl class="grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 text-sm">
        <dt class="text-white/60">Nom</dt>
        <dd class="text-white/85">{LEGAL.publisher}</dd>
        <dt class="text-white/60">Statut</dt>
        <dd class="text-white/85">{LEGAL.status}</dd>
        {#if LEGAL.siret}
          <dt class="text-white/60">SIRET</dt>
          <dd class="text-white/85 font-mono">{LEGAL.siret}</dd>
        {/if}
        {#if LEGAL.address}
          <dt class="text-white/60">Adresse</dt>
          <dd class="text-white/85">{LEGAL.address}</dd>
        {/if}
        <dt class="text-white/60">Contact</dt>
        <dd>
          <a href="mailto:{EMAIL}" class="text-accent hover:text-white underline underline-offset-4"
            >{EMAIL}</a
          >
        </dd>
        <dt class="text-white/60">Directeur de la publication</dt>
        <dd class="text-white/85">{LEGAL.publisher}</dd>
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
