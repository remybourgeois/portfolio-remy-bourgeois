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

<nav aria-label="Fil d'Ariane" class="mb-8">
  <ol class="flex flex-wrap items-center gap-x-2 text-xs uppercase tracking-wider text-white/60">
    {#each items as item, i (item.path)}
      <li class="flex items-center gap-x-2">
        {#if i < items.length - 1}
          <a
            href={item.path}
            class="inline-flex items-center min-h-[44px] hover:text-white transition-colors"
          >
            {item.name}
          </a>
          <span aria-hidden="true" class="text-white/50">/</span>
        {:else}
          <span aria-current="page" class="inline-flex items-center min-h-[44px] text-white/80">
            {item.name}
          </span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
