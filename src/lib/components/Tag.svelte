<!-- src/lib/components/Tag.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import Icon from '$lib/components/Icons.svelte';
  import type { IconName } from '$lib/components/Icons.svelte';

  /**
   * Un tag porte une information, jamais une action. D'où le `rounded-lg` :
   * le `rounded-full` reste réservé aux boutons et aux liens, et la forme
   * suffit alors à séparer les deux familles sans compter sur la couleur.
   *
   * Un seul accent existe, `emerald`, réservé au statut de disponibilité.
   * Tout le reste est neutre : c'est ce qui rend les tags du hero, ceux des
   * cartes projet et ceux des études de cas uniformes.
   */
  let {
    as = 'span',
    icon,
    dot,
    tone = 'neutral',
    solid = false,
    pulse = false,
    class: className = '',
    children
  }: {
    as?: 'span' | 'li';
    icon?: IconName;
    dot?: 'emerald' | 'violet';
    tone?: 'neutral' | 'emerald';
    /** Fond opaque, pour un tag posé au-dessus du contenu (barre fixe). */
    solid?: boolean;
    pulse?: boolean;
    class?: string;
    children: Snippet;
  } = $props();

  // Les fonds sont décidés ici et nulle part ailleurs : deux classes `bg-*`
  // concurrentes sur le même élément se départagent par l'ordre du CSS généré,
  // pas par celui de l'attribut, donc un override côté appelant est un piège.
  const toneClass = $derived(
    solid
      ? 'bg-canvas/80 backdrop-blur-md text-white/80'
      : tone === 'emerald'
        ? 'bg-emerald-400/10 text-emerald-300'
        : 'bg-white/[0.055] text-white/80'
  );

  const dotClass = $derived(
    dot === 'emerald' ? 'bg-emerald-400 shadow-glow-emerald' : 'bg-accent shadow-glow-accent'
  );
</script>

<svelte:element
  this={as}
  class="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium {toneClass} {className}"
>
  {#if dot}
    <span
      class="w-[7px] h-[7px] rounded-full flex-shrink-0 {dotClass} {pulse ? 'animate-pulse' : ''}"
      aria-hidden="true"
    ></span>
  {:else if icon}
    <Icon
      name={icon}
      size={13}
      className="flex-shrink-0 {tone === 'neutral' ? 'text-white/50' : ''}"
    />
  {/if}
  {@render children()}
</svelte:element>
