<!-- src/lib/components/PageShell.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  /**
   * Conteneur des pages intérieures : même gouttière, même hauteur sous la
   * barre, même largeur. Projets, Accompagnement et À propos le recopiaient
   * chacune, et l'étude de cas en avait une quatrième version (gouttière
   * différente, 16 px plus haut). Une étude de cas reste plus étroite, pour
   * la mesure du texte : c'est `width`, pas une copie.
   */
  let { width = 'wide', children }: { width?: 'wide' | 'narrow'; children: Snippet } = $props();
</script>

<main id="main-content" class="min-h-screen bg-canvas text-white">
  <div class="{width === 'narrow' ? 'max-w-5xl' : 'max-w-6xl'} mx-auto px-6 md:px-8 pt-32 pb-24">
    {@render children()}
  </div>
</main>
