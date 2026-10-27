<!-- src/lib/components/PageShell.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  /**
   * Conteneur des pages intérieures : même gouttière, même hauteur sous la
   * barre, même largeur. Projets, Accompagnement et À propos le recopiaient
   * chacune, et l'étude de cas en avait une quatrième version (gouttière
   * différente, 16 px plus haut). Une seule largeur, y compris pour l'étude
   * de cas : le fil d'Ariane et le titre démarrent au même pixel sur toutes
   * les pages, et la mesure du texte est tenue par le bloc de texte lui-même.
   */
  let { children }: { children: Snippet } = $props();
</script>

<main id="main-content" class="min-h-screen bg-canvas text-white">
  <div class="max-w-6xl mx-auto px-6 md:px-8 pt-32 pb-24">
    {@render children()}
  </div>
</main>
