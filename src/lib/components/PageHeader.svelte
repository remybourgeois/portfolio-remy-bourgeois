<!-- src/lib/components/PageHeader.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import Breadcrumb from '$lib/components/Breadcrumb.svelte';

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
   *
   * `crumbs` est le même tableau que celui du JSON-LD de la page : le fil
   * d'Ariane visible remplace l'ancien lien « Retour », qui doublonnait la
   * barre permanente.
   */
  let {
    title,
    crumbs,
    lede,
    media
  }: {
    title: string;
    crumbs: { name: string; path: string }[];
    lede?: Snippet;
    media?: Snippet;
  } = $props();
</script>

<Breadcrumb items={crumbs} />

<header class="mb-14 pb-10 border-b border-white/10">
  <div class="flex flex-col md:flex-row md:items-start gap-8 md:min-h-[180px]">
    <div class="flex-1 min-w-0">
      <!--
        `leading-[1.2]` n'est pas cosmétique : avec `bg-clip-text`, le dégradé
        n'est peint que dans la boîte de la ligne. En `line-height: 1`, cette
        boîte s'arrête sous la ligne de base et les jambages descendants, le
        « g » d'Accompagnement en tête, n'étaient tout simplement pas peints.
      -->
      <h1
        class="text-[clamp(1.9rem,7.5vw,3rem)] font-semibold tracking-tight leading-[1.2] mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60"
      >
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
        <p
          class="body-text text-white/70 text-base md:text-lg font-light leading-relaxed max-w-[46rem] [text-wrap:pretty]"
        >
          {@render lede()}
        </p>
      {/if}
    </div>
    {#if media}
      <div class="flex-shrink-0">{@render media()}</div>
    {/if}
  </div>
</header>
