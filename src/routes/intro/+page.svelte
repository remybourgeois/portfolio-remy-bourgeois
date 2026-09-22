<!-- src/routes/intro/+page.svelte -->
<script lang="ts">
  import IntroScene from '$lib/components/IntroScene.svelte';
</script>

<svelte:head>
  <title>L'expérience — Rémy Bourgeois</title>
  <meta name="description" content="Intro interactive du portfolio de Rémy Bourgeois, Senior Product Design Engineer." />
  <!--
    Volontairement hors index : cette page ne porte aucun contenu textuel, tout
    y est rendu en WebGL. C'est « / » qui porte le contenu et l'indexation.
  -->
  <meta name="robots" content="noindex, follow" />
</svelte:head>

<IntroScene />
