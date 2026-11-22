<!-- src/lib/components/AnimatedCounter.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';

  let {
    end,
    suffix = '',
    duration = 950
  }: {
    end: number;
    suffix?: string;
    duration?: number;
  } = $props();

  // Une colonne par chiffre : 0 à 9, puis un second 0. Un chiffre final « 0 »
  // vise ce second zéro, sinon « 80 » ne ferait tourner que sa dizaine.
  const CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  // Décalage entre deux colonnes d'un même nombre, en millisecondes.
  const STAGGER = 80;

  let digits = $derived(String(end).split(''));
  let el = $state<HTMLSpanElement | null>(null);
  // `rolling` : les colonnes remplacent le texte. `landed` : elles ont reçu
  // leur cible. Les deux restent à `false` au rendu serveur, qui écrit donc la
  // valeur finale en clair. Initialiser à 0 mettait « 0+ Années d'expérience »
  // dans le HTML prérendu : les crawlers et les moteurs génératifs ne lisaient
  // que des zéros, alors que ces chiffres sont le contenu le plus citable de
  // la page. Les colonnes, elles, y écriraient « 01234567890 ».
  let rolling = $state(false);
  let landed = $state(false);

  onMount(() => {
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Les colonnes sont découpées à une hauteur de ligne (`1lh`). Un navigateur
    // qui ne connaît pas l'unité les afficherait en entier : il garde le texte.
    if (!CSS.supports('height', '1lh')) return;

    // Le passage à zéro n'a lieu que si JS tourne : sans JS, la valeur
    // affichée reste la bonne.
    rolling = true;
    let done: ReturnType<typeof setTimeout> | undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        landed = true;
        // Une fois posées, les colonnes rendent la place au texte : le DOM
        // retrouve la forme qu'il avait au prérendu.
        done = setTimeout(() => (rolling = false), duration + digits.length * STAGGER + 150);
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      clearTimeout(done);
    };
  });
</script>

<!--
  Les colonnes sont masquées aux lecteurs d'écran : sans ça le compteur annonce
  tous les chiffres qui défilent. Le doublon sr-only porte la valeur finale en
  permanence, prérendu compris.
-->
<span bind:this={el}>
  <!-- Chiffres à largeur fixe : le nombre garde sa largeur d'un état à l'autre. -->
  <span aria-hidden="true" class="tabular-nums">
    {#if rolling}
      {#each digits as digit, i (i)}
        <span class="counter-digit"
          ><span
            class="counter-strip"
            style:--d={landed ? (digit === '0' ? 10 : Number(digit)) : 0}
            style:--k={i}
            style:--counter-ms="{duration}ms"
            style:--counter-stagger="{STAGGER}ms"
            >{#each CELLS as cell, c (c)}<span>{cell}</span>{/each}</span
          ></span
        >
      {/each}{suffix}
    {:else}
      {end}{suffix}
    {/if}
  </span>
  <span class="sr-only">{end}{suffix}</span>
</span>
