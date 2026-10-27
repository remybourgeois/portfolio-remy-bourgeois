<!-- src/lib/components/SiteFooter.svelte -->
<script lang="ts">
  /**
   * Pied de page commun. Il n'existait que sur l'accueil : les trois autres
   * pages et les études de cas se terminaient sans signature ni copyright.
   * La ligne « vibe codé » a été retirée : pour un acheteur qui se méfie du
   * code généré, elle contredisait « un développeur senior relit chaque PR ».
   */
</script>

<footer class="max-w-6xl mx-auto px-6 md:px-8 pb-10">
  <p class="text-white/50 text-xs text-center">
    © 2026 Rémy Bourgeois
    <span aria-hidden="true" class="mx-2">·</span>
    <a
      href="/mentions-legales"
      class="hover:text-white transition-colors underline-offset-4 hover:underline py-3"
      >Mentions légales</a
    >
  </p>
</footer>
