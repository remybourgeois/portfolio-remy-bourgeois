<!-- src/lib/components/Button.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { press } from '#lib/actions/press.ts';
  import Icon from '#lib/components/Icons.svelte';
  import type { IconName } from '#lib/components/Icons.svelte';

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
    use:press
  >
    {@render content()}
  </a>
{:else}
  <button type="button" {onclick} class={classes} use:press>
    {@render content()}
  </button>
{/if}
