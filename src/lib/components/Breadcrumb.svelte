<!-- src/lib/components/Breadcrumb.svelte -->
<script lang="ts">
  /**
   * Fil d'Ariane visible. Il remplace les liens « Retour » et « Tous les
   * projets », qui doublonnaient la barre permanente et ne disaient pas où
   * l'on était. Il prend le même tableau que le `BreadcrumbList` du JSON-LD :
   * ce que le moteur lit est ce que le visiteur voit.
   */
  let { items }: { items: { name: string; path: string }[] } = $props();
</script>

<!--
  La cible tactile de 44 px est faite de 14 px au-dessus et au-dessous du
  texte ; la marge négative annule les 14 px du haut, pour que le texte du
  fil d'Ariane commence au même pixel que la première ligne du hero de
  l'accueil, sous la même hauteur de barre.
-->
<nav aria-label="Fil d'Ariane" class="-mt-3.5 mb-8">
  <ol class="flex flex-wrap items-center gap-x-2 text-xs uppercase tracking-wider text-white/60">
    {#each items as item, i (item.path)}
      <li class="flex items-center gap-x-2">
        {#if i < items.length - 1}
          <a
            href={item.path}
            class="inline-flex items-center py-3.5 hover:text-white transition-colors"
          >
            {item.name}
          </a>
          <span aria-hidden="true" class="text-white/50">/</span>
        {:else}
          <span aria-current="page" class="inline-flex items-center py-3.5 text-white/80">
            {item.name}
          </span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
