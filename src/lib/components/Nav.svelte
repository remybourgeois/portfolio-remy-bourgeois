<!-- src/lib/components/Nav.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { page } from '$app/state';
  import IntroCta from '#lib/components/IntroCta.svelte';
  import { LAB_URL } from '#lib/data/site.ts';

  let menuOpen = $state(false);
  // Durée d'ouverture et de fermeture du menu mobile. Ramenée à zéro au
  // montage si le visiteur demande moins de mouvement.
  let menuMs = $state(300);
  let currentPath = $derived(page.url.pathname);
  /**
   * La barre vit partout sauf sur /intro, où elle recouvrirait la scène WebGL
   * et où la seule sortie utile est déjà le lien « Passer l'intro ».
   */
  let visible = $derived(currentPath !== '/intro');

  const LINKS = [
    { href: '/', label: 'Accueil', exact: true },
    { href: '/projects', label: 'Projets', exact: false },
    { href: '/accompagnement', label: 'Accompagnement', exact: true },
    { href: '/a-propos', label: 'À propos', exact: true },
    // Le Lab est un site à part (lab.remybourgeois.com, dossier `lab/`) : lien
    // absolu, jamais « actif », ouvert dans le même onglet comme les autres.
    { href: LAB_URL, label: 'Lab', exact: true }
  ];

  const isActive = (href: string, exact: boolean) =>
    exact ? currentPath === href : currentPath.startsWith(href);

  // Repère de la page courante dans la barre desktop : un trait unique qui
  // glisse d'un lien à l'autre. Sa position est mesurée sur le lien actif, donc
  // elle suit la largeur réelle des libellés sans rien coder en dur.
  let linksEl = $state<HTMLDivElement | null>(null);
  let indicator = $state({ x: 0, width: 0, shown: false });
  let indicatorReady = $state(false);

  function placeIndicator() {
    const active = linksEl?.querySelector<HTMLElement>('[aria-current="page"]');
    // Sous 1024 px la barre est en `display: none` : rien à mesurer.
    if (!active || active.offsetWidth === 0) {
      indicator.shown = false;
      return;
    }
    indicator = { x: active.offsetLeft, width: active.offsetWidth, shown: true };
  }

  $effect(() => {
    void currentPath;
    placeIndicator();
  });

  onMount(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) menuMs = 0;
    if (!linksEl) return;
    // La largeur des liens change quand DM Sans remplace la police de repli,
    // et la barre apparaît ou disparaît au passage des 1024 px.
    const ro = new ResizeObserver(placeIndicator);
    ro.observe(linksEl);
    const raf = requestAnimationFrame(() => (indicatorReady = true));
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  });

  // Le menu mobile se referme à chaque navigation, y compris au clic sur le
  // lien de la page courante, qui ne déclenche pas de changement d'URL.
  $effect(() => {
    void currentPath;
    menuOpen = false;
  });
</script>

<!--
  La place de gauche est celle de la marque : un visiteur qui arrive de Google
  sur /projects doit savoir chez qui il est avant le pied de page. Le CTA de
  l'intro passe à droite, en secondaire. Le bouton son et le témoin « Lien
  établi » ont été retirés : hors de /intro, ils ne produisaient aucun effet,
  le moteur audio coupant tout son dès qu'on quitte l'intro.
-->
<nav
  aria-label="Navigation principale"
  aria-hidden={!visible}
  inert={!visible}
  class="fixed top-0 w-full z-50 transition-all duration-500
         bg-canvas/90 backdrop-blur-md border-b border-white/5
         {visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}"
>
  <div class="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
    <a
      href="/"
      class="inline-flex items-center min-h-[44px] text-sm font-semibold tracking-tight text-white hover:text-accent transition-colors whitespace-nowrap"
    >
      Rémy Bourgeois
    </a>

    <!--
      Les liens passent au menu déroulant sous 1024 px et non sous 768 : entre
      les deux, la barre porte déjà le CTA et n'a plus la place de les aligner.
    -->
    <div bind:this={linksEl} class="relative hidden lg:flex items-center gap-6">
      <span
        aria-hidden="true"
        class="nav-indicator pointer-events-none absolute left-0 bottom-1 h-0.5 rounded-full bg-accent shadow-glow-accent
               {indicator.shown ? 'opacity-100' : 'opacity-0'} {indicatorReady ? 'is-ready' : ''}"
        style:width="{indicator.width}px"
        style:transform="translateX({indicator.x}px)"
      ></span>
      {#each LINKS as link (link.href)}
        <a
          href={link.href}
          aria-current={isActive(link.href, link.exact) ? 'page' : undefined}
          class="text-xs uppercase tracking-wider transition-colors py-3 px-1
                  {isActive(link.href, link.exact)
            ? 'text-white'
            : 'text-white/60 hover:text-white'}"
        >
          {link.label}
        </a>
      {/each}
    </div>

    <div class="flex items-center gap-3">
      <IntroCta />

      <button
        class="lg:hidden text-white/60 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
        onclick={() => (menuOpen = !menuOpen)}
        aria-label="Menu"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
      >
        <!-- Trois barres qui se croisent à l'ouverture (app.css, « Menu
             mobile ») : le bouton se transforme au lieu de changer d'icône. -->
        <span class="burger {menuOpen ? 'is-open' : ''}" aria-hidden="true"
          ><i></i><i></i><i></i></span
        >
      </button>
    </div>
  </div>

  {#if menuOpen}
    <!-- Le panneau se déplie, puis les liens arrivent l'un après l'autre
         (`--k` est leur rang). -->
    <div
      id="mobile-menu"
      transition:slide={{ duration: menuMs }}
      class="lg:hidden border-t border-white/5 px-6 py-4 flex flex-col gap-2 bg-canvas/95"
    >
      {#each LINKS as link, k (link.href)}
        <a
          href={link.href}
          aria-current={isActive(link.href, link.exact) ? 'page' : undefined}
          style:--k={k}
          class="menu-item flex items-center gap-3 text-sm transition-colors py-3 min-h-[44px]
                 {isActive(link.href, link.exact)
            ? 'text-white font-medium'
            : 'text-white/70 hover:text-white'}"
        >
          <span
            class="w-1.5 h-1.5 rounded-full {isActive(link.href, link.exact)
              ? 'bg-accent'
              : 'bg-transparent'}"
            aria-hidden="true"
          ></span>
          {link.label}
        </a>
      {/each}
    </div>
  {/if}
</nav>
