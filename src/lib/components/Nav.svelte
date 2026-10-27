<!-- src/lib/components/Nav.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { audioStore } from '$lib/stores/audio';
  import Icon from '$lib/components/Icons.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import IntroCta from '$lib/components/IntroCta.svelte';
  import { sfx } from '$lib/actions/sfx';

  let menuOpen = $state(false);
  let isMuted = $derived($audioStore.isMuted);
  let currentPath = $derived($page.url.pathname);
  /**
   * La barre vit partout sauf sur /intro, où elle recouvrirait la scène WebGL
   * et où la seule sortie utile est déjà le lien « Passer l'intro ».
   * L'accueil portait sa propre barre fixe : elle a été supprimée au profit de
   * celle-ci, et le CTA vers /intro y a été déplacé. Deux barres en `fixed
   * top-0 z-50` se seraient recouvertes.
   */
  let visible = $derived(currentPath !== '/intro');

  const LINKS = [
    { href: '/', label: 'Home', exact: true },
    { href: '/projects', label: 'Projets', exact: false },
    { href: '/accompagnement', label: 'Accompagnement', exact: true },
    { href: '/a-propos', label: 'À propos', exact: true }
  ];

  const isActive = (href: string, exact: boolean) =>
    exact ? currentPath === href : currentPath.startsWith(href);
</script>

<nav
  aria-label="Navigation principale"
  aria-hidden={!visible}
  inert={!visible}
  class="fixed top-0 w-full z-50 transition-all duration-500
         bg-[#020205]/90 backdrop-blur-md border-b border-white/5
         {visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}"
>
  <div class="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
    <!--
      Le nom renvoyait à l'accueil, exactement comme le lien « Home » deux
      centimètres plus loin. La place revient au CTA, seule destination que la
      barre ne proposait pas deux fois.
    -->
    <IntroCta />

    <!--
      Les liens passent au menu déroulant sous 1024 px et non sous 768 : entre
      les deux, la barre porte déjà le CTA et n'a plus la place de les aligner.
    -->
    <div class="hidden lg:flex items-center gap-6">
      {#each LINKS as link}
        <a
          href={link.href}
          use:sfx
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
      <div class="hidden xl:block">
        <Tag dot="violet" pulse solid class="whitespace-nowrap">Lien établi</Tag>
      </div>

      <button
        onclick={audioStore.toggleMute}
        aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
        aria-pressed={!isMuted}
        class="hidden lg:flex items-center gap-2 text-white/60 hover:text-white transition-colors min-h-[44px] px-2"
      >
        <div
          class="w-1.5 h-1.5 rounded-full {isMuted ? 'bg-red-500' : 'bg-emerald-400 animate-pulse'}"
        ></div>
        <Icon name={isMuted ? 'SpeakerOff' : 'Speaker'} size={14} />
      </button>

      <button
        class="lg:hidden text-white/60 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
        onclick={() => (menuOpen = !menuOpen)}
        aria-label="Menu"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
      >
        <Icon name="Menu" size={20} />
      </button>
    </div>
  </div>

  {#if menuOpen}
    <div
      id="mobile-menu"
      class="lg:hidden border-t border-white/5 px-6 py-4 flex flex-col gap-4 bg-[#020205]/95"
    >
      {#each LINKS as link}
        <a
          href={link.href}
          use:sfx
          onclick={() => (menuOpen = false)}
          class="text-sm text-white/70 hover:text-white transition-colors py-2">{link.label}</a
        >
      {/each}
      <button
        onclick={audioStore.toggleMute}
        aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
        aria-pressed={!isMuted}
        class="flex items-center gap-2 text-sm text-white/60 hover:text-white w-fit py-2 min-h-[44px]"
      >
        <Icon name={isMuted ? 'SpeakerOff' : 'Speaker'} size={14} />
        Son {isMuted ? 'OFF' : 'ON'}
      </button>
    </div>
  {/if}
</nav>
