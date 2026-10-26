<!-- src/lib/components/IntroCta.svelte -->
<script lang="ts">
  import { sfx } from '$lib/actions/sfx';

  /**
   * Invitation vers /intro. Elle ne doit pas se lire comme un lien de nav de
   * plus : un faisceau tourne dans la bordure, le halo respire, et une pastille
   * de particules en orbite annonce la nature WebGL de la page visée. La
   * sous-ligne dit le reste, pour qu'on sache avant de cliquer.
   *
   * Tout est en CSS (app.css, section « CTA ») : aucun octet de réseau en plus,
   * et rien à monter côté client.
   */
</script>

<!--
  La couche du faisceau est un frère du <a>, pas son parent : un parent en
  `overflow-hidden` rognerait l'anneau de focus clavier.
-->
<div class="cta-shell flex flex-col items-center gap-1">
  <span class="cta-halo relative inline-block rounded-full bg-[#706bfe]/35 p-[1.5px]">
    <span class="absolute inset-0 rounded-full overflow-hidden" aria-hidden="true">
      <span class="cta-beam"></span>
    </span>
    <a
      href="/intro"
      use:sfx
      class="cta-pill relative flex items-center gap-2 text-white text-[11px] font-semibold uppercase tracking-wider px-3 lg:px-4 py-2.5 rounded-full focus-visible:ring-2 focus-visible:ring-[#706bfe]"
    >
      <!--
        Icône inline plutôt que <Icon> : elle anime deux groupes à des vitesses
        différentes, ce que le composant ne sait pas exprimer.
      -->
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" class="flex-shrink-0">
        <circle cx="12" cy="12" r="9" stroke="rgba(168,165,255,0.28)" stroke-width="1" />
        <circle cx="12" cy="12" r="2.4" fill="#a8a5ff" />
        <g class="cta-orbit">
          <circle cx="21" cy="12" r="1.7" fill="#38bdf8" />
          <circle cx="3" cy="12" r="1.2" fill="#a8a5ff" />
        </g>
        <g class="cta-orbit-rev">
          <circle cx="12" cy="4" r="1.4" fill="#ffffff" />
        </g>
      </svg>
      <span class="whitespace-nowrap hidden lg:inline">Vivre l'expérience</span>
      <span class="whitespace-nowrap lg:hidden">Expérience</span>
    </a>
  </span>
  <span class="cta-breathe cta-sub text-white/70 text-[9px] font-medium uppercase tracking-[0.14em] whitespace-nowrap">
    <span class="hidden lg:inline">3D interactive · son · 40 s</span>
    <span class="lg:hidden">3D · son · 40 s</span>
  </span>
</div>
