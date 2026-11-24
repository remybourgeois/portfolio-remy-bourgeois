# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Trois visiteurs, à égalité de priorité (confirmé par Rémy le 2026-11-24) :

- Le décideur produit ou tech (CPO, CTO, Head of Design, fondateur) d'un SaaS B2B, qui cherche un freelance senior et évalue le profil lui-même.
- Le recruteur ou l'intermédiaire (ESN, cabinet, plateforme comme Malt ou Collective), qui présélectionne des profils pour un client final.
- Le responsable de design system (lead design ou lead front), qui constate un écart entre Figma et le code et cherche un audit.

Aucun des trois ne passe devant les autres : une décision qui sert l'un en perdant un autre est à revoir.

## Product Purpose

Portfolio de Rémy Bourgeois, Senior Product Design Engineer freelance basé à Lyon. Le site présente son positionnement, ses expertises, ses études de cas, ses trois formats d'accompagnement et son offre d'audit design system.

Une visite réussie se termine par une prise de contact pour une mission. La demande d'audit est une seconde issue valable, mais c'est la mission qui prime quand il faut choisir.

## Positioning

Un designer senior qui conçoit directement dans le code de production (GitHub, Storybook, Claude Code) plutôt qu'en maquettes, avec chaque Pull Request relue par un développeur senior. Il n'est pas développeur et ne se présente pas comme tel.

Ce positionnement s'appuie sur 14 ans d'expérience, dont 7 ans en robotique humanoïde chez Aldebaran, et sur trois spécialités : design systems et design tokens, IA conversationnelle, interfaces SaaS B2B complexes.

Le site est lui-même une pièce à conviction : il est construit selon la méthode qu'il décrit, avec des invariants vérifiés par le CI.

## Operating Context

- Le visiteur arrive depuis LinkedIn, Malt, Collective, un moteur de recherche ou un moteur génératif, souvent pour vérifier un profil qu'on lui a transmis.
- `/` est la page d'entrée et la page indexable principale. `/intro` est une intro WebGL sonore, à part, non indexée.
- Le contact se fait par e-mail (liens `mailto:`). Il n'y a ni formulaire ni prise de rendez-vous.
- Le Lab (`lab.remybourgeois.com`) héberge prototypes et expériences sur un projet Netlify distinct.

## Capabilities and Constraints

- Site statique : SvelteKit (Svelte 5), `adapter-static`, Tailwind v4, Three.js sur l'intro seulement. Déployé sur Netlify depuis `main`.
- Pages : accueil, à propos, accompagnement, audit design system, index des projets, études de cas, mentions légales.
- Le contenu vit dans `src/lib/data/`. Le sitemap, `llms.txt` et le JSON-LD sont générés depuis ces données.
- Contenu en français. Certains témoignages sont en anglais.
- Les invariants techniques et éditoriaux (audio, vidéo, images, contraste, couleurs, typographie, composants, SEO) sont décrits dans `CLAUDE.md` et vérifiés par `npm run verify`. Ils font autorité sur toute proposition de design.
- Toute modification passe par une branche, une PR et un CI vert.

Non décidé (Rémy a répondu « je ne sais pas » le 2026-11-24, à lui demander avant d'agir dessus) :

- si les chiffres clés sont figés ou peuvent évoluer ;
- ce qui peut être montré des écrans et données client au-delà de ce qui est déjà publié ;
- si une version anglaise est envisagée ;
- si des tarifs peuvent apparaître sur le site.

## Brand Commitments

- Nom : Rémy Bourgeois. Titre : Senior Product Design Engineer. Société : WOO.
- Voix : première personne, directe, factuelle. Pas de tiret cadratin dans le contenu visible. Une seule mise en avant par paragraphe, jamais sur un nom de marque.
- Homonymie : toujours distinguer du comédien français du même nom.
- Le versant musique et sound design fait partie du profil : il vient des années en robotique.

## Evidence on Hand

- Cinq études de cas dans `src/lib/data/projects.ts` : Ofelia, iPify, Aldebaran Robotics, Crédit Agricole, Highlight.
- Témoignages clients nommés dans `src/lib/data/testimonials.ts`, logos clients dans `src/lib/data/clients.ts`.
- Chiffres publiés : 14 ans d'expérience, 80 projets livrés, plus de 10 millions d'utilisateurs touchés, 8 ans sur des produits à base d'IA.
- Vidéos de démonstration et captures du produit Ofelia dans `static/assets/`.
- Offre d'audit rédigée dans `src/lib/data/audit.ts`.

À ne pas fabriquer : aucun témoignage, client, chiffre, tarif ou résultat qui ne figure pas déjà dans ces fichiers.

## Product Principles

1. La preuve avant la promesse : chaque affirmation renvoie à une étude de cas, un chiffre publié ou un témoignage nommé.
2. Le site applique ce qu'il vend : règles écrites, vérifiées automatiquement, dans le code.
3. Trois lecteurs, un seul message : le décideur, l'intermédiaire et le responsable de design system doivent chacun trouver leur réponse sans que le site se disperse.
4. La mission d'abord : quand deux appels à l'action se concurrencent, celui qui mène au contact pour une mission l'emporte.
5. Rapide et sobre hors de l'intro : rien de lourd ni de sonore sur les pages qui comptent pour le référencement.

## Accessibility & Inclusion

Contraste vérifié par axe-core sur six gabarits, plancher de 12 px pour le texte, aucune vidéo en lecture automatique, aucun son hors de `/intro`, mise en page vérifiée à 390, 820 et 1440 px.
