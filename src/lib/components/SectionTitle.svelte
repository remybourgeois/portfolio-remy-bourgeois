<!-- src/lib/components/SectionTitle.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  /**
   * Titre de section, en deux variantes voulues : centré entre deux filets sur
   * l'accueil, qui est une vitrine, et aligné à gauche derrière un seul filet
   * sur les pages intérieures, qui sont des documents. La chaîne de classes
   * était recopiée huit fois ; la différence entre les deux motifs vit ici,
   * dans `align`, et non dans la discipline du prochain ajout de section.
   */
  let {
    align = 'left',
    id,
    class: className = '',
    children
  }: {
    align?: 'left' | 'center';
    id?: string;
    class?: string;
    children: Snippet;
  } = $props();
</script>

<h2
  {id}
  class="eyebrow text-white/50 flex items-center gap-4 {align === 'center'
    ? 'justify-center'
    : ''} {className}"
>
  <span class="w-8 h-px bg-white/20" aria-hidden="true"></span>
  {@render children()}
  {#if align === 'center'}
    <span class="w-8 h-px bg-white/20" aria-hidden="true"></span>
  {/if}
</h2>
