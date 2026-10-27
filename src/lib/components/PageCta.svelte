<!-- src/lib/components/PageCta.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import Button from '$lib/components/Button.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import { EMAIL, BOOKING_URL } from '$lib/data/site';

  /**
   * Bloc de fin commun à l'accueil, aux trois pages intérieures et aux études
   * de cas. `secondary` laisse chaque page proposer la suite logique de son
   * parcours : les études de cas depuis Accompagnement, les projets depuis
   * À propos.
   *
   * Le bouton principal dit ce qu'il fait (« M'écrire ») et l'adresse est
   * donnée en clair en dessous, copiable. Avant, l'adresse était le libellé
   * du bouton : trop longue pour la pilule à 390 px, `break-all` la coupait
   * au milieu du nom de domaine.
   */
  let {
    title,
    lede,
    extra,
    secondaryHref,
    secondaryLabel,
    secondaryIcon,
    secondaryExternal = false
  }: {
    title: string;
    lede: Snippet;
    extra?: Snippet;
    secondaryHref: string;
    secondaryLabel: string;
    secondaryIcon?: 'ArrowRight' | 'Linkedin';
    secondaryExternal?: boolean;
  } = $props();
</script>

<div class="w-full relative">
  <div
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-40 bg-primary opacity-10 blur-[120px] rounded-full pointer-events-none"
    aria-hidden="true"
  ></div>

  <div
    class="relative bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 md:p-12 text-center"
  >
    <h2 class="text-3xl md:text-4xl font-semibold text-white mb-4">{title}</h2>

    <!-- Mesure large et `text-wrap: pretty` : les accroches courtes tiennent
         alors sur une seule ligne au lieu de laisser un mot orphelin. -->
    <p
      class="body-text text-white/60 text-base leading-relaxed mb-8 max-w-3xl mx-auto [text-wrap:pretty]"
    >
      {@render lede()}
    </p>

    {#if extra}
      <p class="text-white/60 text-sm mb-8">{@render extra()}</p>
    {/if}

    <div class="flex flex-wrap justify-center gap-2 mb-8">
      <Tag tone="emerald" dot="emerald" pulse>Disponible</Tag>
      <Tag icon="Wifi">Full remote préféré</Tag>
      <Tag icon="MapPin">Basé à Lyon</Tag>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      {#if BOOKING_URL}
        <Button href={BOOKING_URL} external iconLeft="Calendar" class="w-full sm:w-auto">
          Réserver 30 minutes
        </Button>
      {:else}
        <Button href="mailto:{EMAIL}" iconLeft="Mail" class="w-full sm:w-auto">M'écrire</Button>
      {/if}
      <Button
        href={secondaryHref}
        variant="secondary"
        class="w-full sm:w-auto"
        external={secondaryExternal}
        iconLeft={secondaryIcon === 'Linkedin' ? 'Linkedin' : undefined}
        iconRight={secondaryIcon === 'ArrowRight' ? 'ArrowRight' : undefined}
      >
        {secondaryLabel}
      </Button>
    </div>

    <p class="mt-6 text-sm text-white/60">
      ou directement à
      <a
        href="mailto:{EMAIL}"
        class="text-accent hover:text-white underline underline-offset-4 transition-colors py-3"
        >{EMAIL}</a
      >
    </p>
  </div>
</div>
