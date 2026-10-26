<!-- src/lib/components/PageCta.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import Icon from '$lib/components/Icons.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import { sfx } from '$lib/actions/sfx';
  import { EMAIL } from '$lib/data/site';

  /**
   * Bloc de fin commun à l'accueil et aux trois pages intérieures. Il n'existait
   * que sur trois d'entre elles, et sous deux formes : carte avec halo et tags
   * sur l'accueil et Accompagnement, simple section centrée sur À propos.
   * Projets n'en avait aucun et se terminait sur sa grille.
   *
   * `secondary` laisse chaque page proposer la suite logique de son parcours :
   * les études de cas depuis Accompagnement, les projets depuis À propos.
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
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-40 bg-[#706bfe] opacity-10 blur-[120px] rounded-full pointer-events-none"
    aria-hidden="true"
  ></div>

  <div class="relative bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-center">
    <h2 class="text-3xl md:text-4xl font-semibold text-white mb-4">{title}</h2>

    <!-- Mesure large et `text-wrap: pretty` : les accroches courtes tiennent
         alors sur une seule ligne au lieu de laisser un mot orphelin. -->
    <p class="body-text text-white/60 text-base leading-relaxed mb-8 max-w-3xl mx-auto [text-wrap:pretty]">
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
      <a
        href="mailto:{EMAIL}"
        use:sfx
        class="flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#5a55e0] text-white font-medium hover:bg-[#4a45d0] transition-all focus-visible:ring-2 focus-visible:ring-white"
      >
        <Icon name="Mail" size={16} className="flex-shrink-0" />
        <span class="break-all">{EMAIL}</span>
      </a>
      <a
        href={secondaryHref}
        use:sfx
        target={secondaryExternal ? '_blank' : undefined}
        rel={secondaryExternal ? 'noopener noreferrer' : undefined}
        class="flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all focus-visible:ring-2 focus-visible:ring-[#706bfe]"
      >
        {#if secondaryIcon === 'Linkedin'}
          <Icon name="Linkedin" size={16} className="flex-shrink-0" />
        {/if}
        {secondaryLabel}
        {#if secondaryIcon === 'ArrowRight'}
          <Icon name="ArrowRight" size={16} className="flex-shrink-0" />
        {/if}
      </a>
    </div>
  </div>
</div>
