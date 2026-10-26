<!-- src/lib/components/PageHeader.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import Icon from '$lib/components/Icons.svelte';
  import { sfx } from '$lib/actions/sfx';

  /**
   * En-tête commun à Projets, Accompagnement et À propos. Les trois pages
   * divergeaient sur six points : taille du titre, alignement, dégradé ou non,
   * présence d'une accroche, portrait avant le titre, et donc hauteur d'en-tête
   * différente, qui faisait démarrer le contenu à trois hauteurs différentes.
   *
   * Un composant plutôt que trois copies : l'uniformité devient structurelle,
   * elle ne dépend plus de la discipline au prochain ajout de page.
   *
   * `min-h` sur la rangée : c'est ce qui garantit que le contenu démarre au
   * même pixel, que l'accroche tienne sur une ou trois lignes.
   */
  let {
    title,
    backHref = '/',
    backLabel = 'Retour',
    lede,
    media
  }: {
    title: string;
    backHref?: string;
    backLabel?: string;
    lede?: Snippet;
    media?: Snippet;
  } = $props();
</script>

<a
  href={backHref}
  use:sfx
  class="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs uppercase tracking-wider transition-colors mb-10 min-h-[44px]"
>
  <Icon name="ArrowLeft" size={14} /> {backLabel}
</a>

<header class="mb-14 pb-10 border-b border-white/10">
  <div class="flex flex-col md:flex-row md:items-start gap-8 md:min-h-[180px]">
    <div class="flex-1 min-w-0">
      <h1 class="text-4xl md:text-5xl font-semibold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
        {title}
      </h1>
      {#if lede}
        <!--
          `text-wrap: pretty` répare les césures : l'accroche s'arrêtait en
          plein milieu d'un groupe de mots, ce qui donnait l'impression qu'elle
          butait sur un mur invisible. La mesure passe à 46rem, assez large
          pour que l'arrêt de ligne paraisse voulu, assez courte pour rester
          sous les 75 caractères.
        -->
        <p class="body-text text-white/70 text-base md:text-lg font-light leading-relaxed max-w-[46rem] [text-wrap:pretty]">
          {@render lede()}
        </p>
      {/if}
    </div>
    {#if media}
      <div class="flex-shrink-0">{@render media()}</div>
    {/if}
  </div>
</header>
