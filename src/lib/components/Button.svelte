<!-- src/lib/components/Button.svelte -->
<script lang="ts">
  import { onDestroy, type Snippet } from 'svelte';
  import Icon from '$lib/components/Icons.svelte';
  import type { IconName } from '$lib/components/Icons.svelte';

  /**
   * Le bouton du site, sous ses deux formes : pilule pleine pour l'action
   * principale d'un bloc, pilule à bordure pour la suite logique. Il était
   * recopié dans cinq fichiers avec trois tailles différentes : la forme est
   * maintenant décidée ici, l'appelant ne choisit que le rôle et la taille.
   *
   * Avec `href` il rend un lien, sinon un `<button type="button">`. Un lien
   * externe reçoit `target` et `rel` tout seul.
   */
  let {
    href,
    variant = 'primary',
    size = 'md',
    iconLeft,
    iconRight,
    external = false,
    onclick,
    class: className = '',
    children
  }: {
    href?: string;
    variant?: 'primary' | 'secondary';
    size?: 'md' | 'sm';
    iconLeft?: IconName;
    iconRight?: IconName;
    external?: boolean;
    onclick?: () => void;
    class?: string;
    children: Snippet;
  } = $props();

  const base =
    'btn-press inline-flex items-center justify-center gap-3 rounded-full font-medium focus:outline-none focus-visible:ring-2';
  const sizes = { md: 'px-6 sm:px-8 py-4 text-base', sm: 'px-5 py-3 text-sm' };
  const variants = {
    primary: 'bg-primary-strong text-white hover:bg-primary-hover focus-visible:ring-white',
    secondary:
      'border border-white/20 text-white/70 hover:text-white hover:border-white/40 focus-visible:ring-primary'
  };
  const classes = $derived(`${base} ${sizes[size]} ${variants[variant]} ${className}`);
  const iconSize = $derived(size === 'sm' ? 14 : 16);

  // Réponse au toucher : le bouton s'enfonce sous le doigt puis revient avec le
  // ressort (app.css, « Bouton »). L'état vient d'ici et non de `:active` : sur
  // un toucher bref, `:active` dure moins qu'une image et rien ne se verrait.
  // L'enfoncement est donc tenu 120 ms au minimum.
  const MIN_PRESS = 120;
  let pressed = $state(false);
  let pressedAt = 0;
  let releaseTimer: ReturnType<typeof setTimeout> | undefined;

  function press() {
    clearTimeout(releaseTimer);
    pressedAt = Date.now();
    pressed = true;
  }
  function release() {
    if (!pressed) return;
    clearTimeout(releaseTimer);
    releaseTimer = setTimeout(
      () => (pressed = false),
      Math.max(0, MIN_PRESS - (Date.now() - pressedAt))
    );
  }
  function keydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') press();
  }
  onDestroy(() => clearTimeout(releaseTimer));
</script>

{#snippet content()}
  {#if iconLeft}
    <Icon name={iconLeft} size={iconSize} className="btn-icon btn-icon-left flex-shrink-0" />
  {/if}
  {@render children()}
  {#if iconRight}
    <Icon name={iconRight} size={iconSize} className="btn-icon btn-icon-right flex-shrink-0" />
  {/if}
{/snippet}

{#if href}
  <a
    {href}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
    class={classes}
    data-pressed={pressed ? '' : undefined}
    onpointerdown={press}
    onpointerup={release}
    onpointercancel={release}
    onpointerleave={release}
    onkeydown={keydown}
    onkeyup={release}
    onblur={release}
  >
    {@render content()}
  </a>
{:else}
  <button
    type="button"
    {onclick}
    class={classes}
    data-pressed={pressed ? '' : undefined}
    onpointerdown={press}
    onpointerup={release}
    onpointercancel={release}
    onpointerleave={release}
    onkeydown={keydown}
    onkeyup={release}
    onblur={release}
  >
    {@render content()}
  </button>
{/if}
