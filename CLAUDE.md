# CLAUDE.md

Portfolio SvelteKit (Svelte 5 runes, `adapter-static`, Tailwind v4, Three.js sur l'intro).
Déployé sur **Netlify** en **déploiement continu depuis `main`**.

## Workflow git — OBLIGATOIRE

**Ne jamais committer ni pousser directement sur `main`** (branche protégée, CI requis).
Pour TOUTE modification demandée, suivre cette procédure :

1. Partir de `main` à jour, créer une branche :
   `git checkout main && git pull && git checkout -b <type>/<sujet>`
   (types : `feat`, `fix`, `chore`, `docs`, `refactor`)
2. Implémenter le changement.
3. **Vérifier en local avant de pousser** : `npm run check` puis `npm run test:e2e` (doivent passer).
4. `git commit` → `git push -u origin <branche>` → `gh pr create --fill`.
5. Attendre le **CI vert** sur la PR (`gh pr checks`), puis merger : `gh pr merge --squash --delete-branch`.
6. Revenir à jour en local : `git checkout main && git pull`.

Le merge n'est autorisé que si le CI (`build-and-test`) passe. Le merge sur `main`
déclenche automatiquement le déploiement Netlify (et chaque PR génère une preview).

## Commandes

- `npm run dev` — serveur de dev
- `npm run build` — build prod → `build/`
- `npm run preview` — prévisualiser le build
- `npm run check` — svelte-check (types + a11y)
- `npm run test:e2e` — tests Playwright

## Invariants à ne pas casser

- **Audio** : `audioStore` ne charge rien au niveau module. Seul `IntroScene`
  appelle `engine.prime()`. Les autres pages n'émettent aucun son et ne doivent
  télécharger aucun MP3 (`tests/perf.test.ts` le vérifie).
- **Vidéos** : jamais d'`autoplay`. Utiliser `preload="none"` + `use:playInView`
  sur les cartes, et la lecture pilotée par `carIndex` dans la case study.
- **Contraste** : plancher à `text-white/50` pour tout texte sur `#020205`.
  Pour un accent violet sur fond sombre, utiliser `#a8a5ff`, pas `#706bfe` dilué.
  `tests/a11y.test.ts` passe axe-core sur quatre gabarits.
- **Icônes** : `name` est typé par l'union `IconName`. Une icône non dessinée
  fait échouer `npm run check` au lieu de rendre un `<svg>` vide.
- **Responsive** : vérifié à 390, 820 et 1440 px, aucun débordement horizontal.

## Repères

- Pages : `src/routes/` — `/` (intro WebGL), `/home`, `/projects`, `/projects/[slug]`
- Contenu : `src/lib/data/` · Médias : `static/assets/` (images **WebP**, audio **MP3**)
- Images projet : variantes responsives 768/1280/1920 via `src/lib/utils/img.ts` (`projectSrcset`)
- Sitemap généré depuis les données : `src/routes/sitemap.xml/+server.ts`
- Police DM Sans **auto-hébergée** (`@fontsource-variable/dm-sans`) — ne pas réintroduire Google Fonts
- Image OG sociale : `static/assets/og-cover.jpg` (1200×630, **JPG** — pas de WebP pour l'OG)
- Posters vidéo : champ `videoPoster` (hero) et `poster` (media) dans `projects.ts`.
  Les fichiers ne sont pas encore produits — voir « Reste à faire » ci-dessous.

## Reste à faire

- **Posters vidéo** : générer `poster-ofelia.webp`, `poster-ofelia-2.webp`,
  `poster-ofelia-3.webp` (première frame) et les renseigner dans `projects.ts`.
  Sans eux, une vidéo en `preload="none"` laisse un cadre vide avant lecture.
- **Ré-encoder `ofelia-3.mp4`** : 8 Mo pour 18 s en 1112×1080, soit ~3,5 Mb/s.
  Une capture d'interface tient largement sous 1,5 Mo.
